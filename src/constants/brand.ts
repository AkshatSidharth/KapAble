/**
 * Brand identity and hosted-service configuration for KapAble.
 *
 * KapAble is a fork of Dyad (https://github.com/dyad-sh/dyad). Upstream ran a
 * set of hosted services behind `*.dyad.sh` — an LLM gateway, a model catalog,
 * OAuth brokers for Supabase/Neon, subscription billing, a log-upload sink and
 * an update feed. KapAble does not operate equivalents.
 *
 * Rather than leave those URLs pointing at a domain nobody owns, every hosted
 * dependency is declared here and is **unset by default**. Callers check the
 * relevant `is*Configured()` helper and degrade to a clear, local behaviour
 * instead of failing against a host that does not resolve. Point any of them at
 * your own deployment by setting the matching environment variable.
 *
 * The bring-your-own-key path — the one the demo uses — needs none of this.
 */

export const BRAND_NAME = "KapAble";

export const BRAND_TAGLINE = "A local, open-source AI app builder";

export const REPO_URL = "https://github.com/AkshatSidharth/KapAble";

/**
 * Docs live in the repository rather than on a marketing site, so in-app
 * "learn more" links resolve to something real.
 */
export const DOCS_URL = `${REPO_URL}/blob/main/docs/README.md`;

export const ISSUES_URL = `${REPO_URL}/issues`;

export const DEMO_GUIDE_URL = `${REPO_URL}/blob/main/docs/DEMO.md`;

/** Reads an env var, treating blank/whitespace as "not configured". */
function optionalEnv(name: string): string | undefined {
  const value =
    typeof process !== "undefined" ? process.env?.[name]?.trim() : undefined;
  return value ? value : undefined;
}

/**
 * Hosted endpoints. Each is `undefined` unless explicitly configured, which is
 * what switches the corresponding feature on.
 */
export const hostedServices = {
  /** OpenAI-compatible gateway used by the managed ("Pro") model path. */
  engineUrl: () => optionalEnv("KAPABLE_ENGINE_URL"),
  /** Base URL serving the model catalog, MCP catalog and desktop config. */
  apiBaseUrl: () => optionalEnv("KAPABLE_API_URL"),
  /** Subscription/billing portal. */
  accountUrl: () => optionalEnv("KAPABLE_ACCOUNT_URL"),
  /** OAuth broker used by the Supabase and Neon integrations. */
  oauthBrokerUrl: () => optionalEnv("KAPABLE_OAUTH_URL"),
  /** Sink that bug-report log bundles are uploaded to. */
  logUploadUrl: () => optionalEnv("KAPABLE_LOG_UPLOAD_URL"),
  /** Electron update feed. Auto-update stays off until this is set. */
  updateFeedUrl: () => optionalEnv("KAPABLE_UPDATE_FEED_URL"),
  /** PostHog project key. Analytics stay off entirely until this is set. */
  telemetryKey: () => optionalEnv("KAPABLE_POSTHOG_KEY"),
  telemetryHost: () =>
    optionalEnv("KAPABLE_POSTHOG_HOST") ?? "https://us.i.posthog.com",
} as const;

/**
 * True when a managed subscription backend is wired up. When false the app
 * hides upgrade/upsell surfaces rather than linking to a checkout that does
 * not exist — KapAble is bring-your-own-key only in that configuration.
 */
export function isManagedPlanConfigured(): boolean {
  return Boolean(hostedServices.accountUrl());
}

/** True when analytics have been explicitly configured for this build. */
export function isTelemetryConfigured(): boolean {
  return Boolean(hostedServices.telemetryKey());
}

/** True when an update feed has been configured for this build. */
export function isAutoUpdateConfigured(): boolean {
  return Boolean(hostedServices.updateFeedUrl());
}
