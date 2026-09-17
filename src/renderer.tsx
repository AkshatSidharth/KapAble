import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";
import { RouterProvider } from "@tanstack/react-router";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import {
  getTelemetryUserId,
  isTelemetryOptedIn,
  isKapableProUser,
} from "./hooks/useSettings";

// Initialize i18next before any rendering
import "./i18n";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  MutationCache,
  useQueryClient,
} from "@tanstack/react-query";
import { showError } from "./lib/toast";
import { ipc } from "./ipc/types";
import { useStore } from "jotai";
import { queryKeys } from "./lib/queryKeys";
import {
  createExceptionFromTelemetry,
  getExceptionTelemetryContext,
  getPostHogTelemetryStorage,
  PostHogErrorDeduper,
  shouldBypassNonProTelemetrySampling,
  shouldFilterPostHogExceptionEvent,
} from "./lib/posthogTelemetry";
import { registerRendererIpcListeners } from "./app_wiring/registerRendererIpcListeners";
import {
  ChatStreamProvider,
  useChatStreamManager,
} from "./chat_stream/ChatStreamProvider";
import {
  EntityDisposalProvider,
  useEntityDisposal,
  useRegisterEntityDisposer,
} from "./state_machines/react";
import { clearTestRuntimeForAppAtom } from "./atoms/testRuntimeAtoms";
import {
  ensureRecentViewedChatIdAtom,
  initializeChatTabSessionStorageAtom,
} from "./atoms/chatAtoms";
import {
  configureChatTabWindowSession,
  promoteMostRecentChatTabSession,
  pruneChatTabWindowSessions,
} from "./window_infrastructure/chat_tab_session_storage";
import type { VisibleEntity } from "./window_infrastructure/types";
import { initialWindowNavigation } from "./window_infrastructure/initial_window_navigation";
import {
  earlyTelemetryEvents,
  registerEarlyRendererEvents,
} from "./app_wiring/early_renderer_events";
import { clearRecorderForAppAtom } from "./atoms/recorderAtoms";

// @ts-ignore
console.log("Running in mode:", import.meta.env.MODE);
registerEarlyRendererEvents();

interface MyMeta extends Record<string, unknown> {
  showErrorToast: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.showErrorToast) {
        showError(error);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.showErrorToast) {
        showError(error);
      }
    },
  }),
});

const postHogErrorDeduper = new PostHogErrorDeduper(
  getPostHogTelemetryStorage(window),
);
window.addEventListener("pagehide", () => postHogErrorDeduper.flush());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    postHogErrorDeduper.flush();
  }
});

// KapAble ships with analytics switched off. Upstream Dyad hard-coded its own rebrand:keep
// PostHog project key here, so an opted-in KapAble user would have reported
// into a project this fork does not own. Supply VITE_KAPABLE_POSTHOG_KEY at
// build time to send analytics to your own project instead.
//
// With no key configured the client is still constructed — PostHogProvider and
// the posthog.capture() call sites throughout the app expect one — but it is
// opted out of capturing and has remote config disabled, so it issues no
// network requests. before_send below is a second, independent stop.
// @ts-ignore - import.meta.env is provided by Vite; see the `debug` line below.
const posthogProjectKey = import.meta.env.VITE_KAPABLE_POSTHOG_KEY as
  | string
  | undefined;
const analyticsEnabled = Boolean(posthogProjectKey);

const posthogClient = posthog.init(
  posthogProjectKey ?? "phc-kapable-analytics-disabled",
  {
    api_host:
      // @ts-ignore - import.meta.env is provided by Vite.
      (import.meta.env.VITE_KAPABLE_POSTHOG_HOST as string | undefined) ??
      "https://us.i.posthog.com",
    opt_out_capturing_by_default: !analyticsEnabled,
    advanced_disable_decide: !analyticsEnabled,
    // Opting out stops events being *sent*, but PostHog still fetches its
    // exception-autocapture bundle from its CDN on init, which is a request to
    // a third party the user never agreed to. These keep the unconfigured
    // build genuinely silent on the network.
    disable_external_dependency_loading: !analyticsEnabled,
    disable_session_recording: !analyticsEnabled,
    disable_surveys: !analyticsEnabled,
    // @ts-ignore
    debug: import.meta.env.MODE === "development",
    autocapture: false,
    capture_exceptions: analyticsEnabled,
    capture_pageview: false,
    before_send: (event) => {
      if (!analyticsEnabled) {
        // No analytics project configured for this build.
        return null;
      }
      if (!isTelemetryOptedIn()) {
        console.debug("Telemetry not opted in, skipping event");
        return null;
      }

      if (shouldFilterPostHogExceptionEvent(event)) {
        console.debug(
          "Filtering generic fetch failed exception from telemetry",
        );
        return null;
      }
      const telemetryUserId = getTelemetryUserId();
      if (telemetryUserId) {
        posthogClient.identify(telemetryUserId);
      }

      if (event?.properties["$ip"]) {
        event.properties["$ip"] = null;
      }

      const isPro = isKapableProUser();
      const dedupedEvent = postHogErrorDeduper.process(event, isPro);
      if (!dedupedEvent) {
        console.debug("Deduplicating PostHog error event", event?.event);
        return null;
      }
      event = dedupedEvent;

      // For non-Pro users, only send 10% of events (but always send errors,
      // app:initial-load, promo_click, and sandbox.script.* — see
      // shouldBypassNonProTelemetrySampling).
      if (!isPro) {
        if (
          !shouldBypassNonProTelemetrySampling(event) &&
          Math.random() > 0.1
        ) {
          console.debug("Non-Pro user: sampling out event", event?.event);
          return null;
        }
      }

      console.debug(
        "Telemetry opted in - UUID:",
        telemetryUserId,
        "sending event",
        event,
      );
      return event;
    },
    persistence: "localStorage",
  },
);

function App() {
  return (
    <ChatStreamProvider>
      <RendererServices />
    </ChatStreamProvider>
  );
}

function RendererServices() {
  const queryClient = useQueryClient();
  const store = useStore();
  const chatStreamManager = useChatStreamManager();
  const entityDisposal = useEntityDisposal();
  const [windowReady, setWindowReady] = useState(false);
  const clearAppRuntime = useCallback(
    (appId: number) => {
      store.set(clearTestRuntimeForAppAtom, appId);
      // Recorded interactions can carry whatever the user typed into the app;
      // a deleted app must not leave them (or its draft) resident for the rest
      // of the renderer's life.
      store.set(clearRecorderForAppAtom, appId);
      // The main process holds its own copies: a parked draft, and possibly a
      // live session still serving an isolated database and holding the app's
      // lock. Clearing the atoms only takes away the UI that could have ended
      // them. (`stopApp` during deletion ends the session too, but deletion
      // paths that never started the app wouldn't have.)
      void ipc.recording.discardRecordedTestDraft({ appId }).catch(() => {});
      void ipc.recording.stopRecording({ appId }).catch(() => {});
    },
    [store],
  );
  useRegisterEntityDisposer("app", clearAppRuntime);

  // Fetch user budget on app load
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.userBudget.info,
      queryFn: () => ipc.system.getUserBudget(),
    });
  }, [queryClient]);

  useEffect(() => {
    // Subscribe to navigation state changes
    const unsubscribe = router.subscribe("onResolved", (navigation) => {
      // Capture the navigation event in PostHog
      posthog.capture("navigation", {
        toPath: navigation.toLocation.pathname,
        fromPath: navigation.fromLocation?.pathname,
      });

      // Optionally capture as a standard pageview as well
      posthog.capture("$pageview", {
        path: navigation.toLocation.pathname,
      });
    });

    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(
    () =>
      earlyTelemetryEvents.subscribe(({ eventName, properties }) => {
        if (eventName === "$exception") {
          posthog.captureException(
            createExceptionFromTelemetry(properties),
            getExceptionTelemetryContext(properties),
          );
          return;
        }

        posthog.capture(eventName, properties);
      }),
    [],
  );

  useEffect(() => {
    let disposed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let retryDelayMs = 100;
    const bootstrapWindow = () => {
      void ipc.windowInfrastructure
        .bootstrap({})
        .then((bootstrap) => {
          if (disposed) return;
          configureChatTabWindowSession(bootstrap.windowSessionId, {
            mayMigrateLegacySession: bootstrap.mayMigrateLegacyChatTabSession,
          });
          try {
            if (bootstrap.mayMigrateLegacyChatTabSession) {
              promoteMostRecentChatTabSession(
                window.localStorage,
                bootstrap.windowSessionId,
              );
            }
            pruneChatTabWindowSessions(
              window.localStorage,
              bootstrap.restorableWindowSessionIds,
            );
            store.set(initializeChatTabSessionStorageAtom);
          } catch (error) {
            // Browser storage is optional presentation state. A denied or full
            // localStorage must not turn a successful main-process bootstrap
            // into a permanently blank product window.
            console.error(
              "Failed to initialize chat tab session storage",
              error,
            );
          }
          const entity: VisibleEntity | undefined = bootstrap.initialEntity;
          if (entity?.kind === "chat") {
            // Seed the tab before route navigation. ChatTabs hydration merges
            // pre-hydration opens, so this works even with a collapsed sidebar.
            store.set(ensureRecentViewedChatIdAtom, entity.id);
          }
          const navigation = initialWindowNavigation(
            entity,
            bootstrap.initialChatAppId,
          );
          if (navigation) {
            void router.navigate({ ...navigation, replace: true });
          }
          setWindowReady(true);
        })
        .catch((error) => {
          if (disposed) return;
          console.error("Failed to initialize window session", error);
          retryTimer = setTimeout(bootstrapWindow, retryDelayMs);
          retryDelayMs = Math.min(retryDelayMs * 2, 5_000);
        });
    };
    bootstrapWindow();
    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  useEffect(() => {
    if (!windowReady) return;
    return registerRendererIpcListeners({
      ipcClient: ipc,
      store,
      queryClient,
      chatStreamManager,
      entityDisposal,
      getCurrentPathname: () => router.state.location.pathname,
      subscribeToNavigation: (listener) =>
        router.subscribe("onResolved", listener),
    });
  }, [chatStreamManager, entityDisposal, queryClient, store, windowReady]);

  return windowReady ? <RouterProvider router={router} /> : null;
}

/**
 * Every screen in the app talks to the main process through
 * `window.electron.ipcRenderer`, which the preload script exposes. If preload
 * failed to build or load, that object is missing, the window-session
 * bootstrap throws, and React renders nothing — a white window with no clue
 * why. That is a miserable thing to debug, so say it plainly instead.
 */
function MissingPreloadBridge() {
  const panel: React.CSSProperties = {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 560,
    margin: "12vh auto",
    padding: "0 24px",
    lineHeight: 1.6,
    color: "#1f2328",
  };
  return (
    <div style={panel}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>
        KapAble could not reach its main process
      </h1>
      <p style={{ marginTop: 0 }}>
        The preload bridge (<code>window.electron</code>) is missing, so the UI
        has nothing to talk to. This almost always means the preload bundle
        failed to build.
      </p>
      <p>Check the terminal running KapAble for a line like:</p>
      <pre
        style={{
          background: "#f6f8fa",
          padding: 12,
          borderRadius: 6,
          overflowX: "auto",
          fontSize: 12,
        }}
      >
        ✖ Building src/preload.ts target
      </pre>
      <p>
        Fix the error it reports, then fully quit and restart KapAble — a
        preload change needs a real restart, not a hot reload.
      </p>
    </div>
  );
}

const hasPreloadBridge = Boolean(
  (window as unknown as { electron?: { ipcRenderer?: unknown } }).electron
    ?.ipcRenderer,
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {hasPreloadBridge ? (
      <QueryClientProvider client={queryClient}>
        <PostHogProvider client={posthogClient}>
          <EntityDisposalProvider>
            <App />
          </EntityDisposalProvider>
        </PostHogProvider>
      </QueryClientProvider>
    ) : (
      <MissingPreloadBridge />
    )}
  </StrictMode>,
);
