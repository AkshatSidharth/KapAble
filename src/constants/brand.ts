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

/** Where builds are published, in place of a marketing download page. */
export const RELEASES_URL = `${REPO_URL}/releases`;

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
  /**
   * OAuth broker for Supabase specifically. Upstream ran this on a separate
   * host from the one serving Neon, so it can be pointed somewhere else;
   * it falls back to the shared broker.
   */
  supabaseOauthBrokerUrl: () =>
    optionalEnv("KAPABLE_SUPABASE_OAUTH_URL") ??
    optionalEnv("KAPABLE_OAUTH_URL"),
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

/**
 * Where an "upgrade" call to action should send the user.
 *
 * With a subscription backend configured this is that portal. Without one,
 * upgrading is not a thing this build can do, so rather than open a checkout
 * that does not exist, it explains why — the docs section covering hosted
 * services. Surfaces that are *only* an upsell should hide themselves with
 * isManagedPlanConfigured() instead of calling this.
 *
 * @param path Path within the account portal, e.g. "/subscription".
 */
export function upgradeUrl(path = ""): string {
  const accountUrl = hostedServices.accountUrl();
  if (!accountUrl) {
    return `${DOCS_URL}#hosted-services`;
  }
  return `${accountUrl.replace(/\/+$/, "")}${path}`;
}

/**
 * The Neon OAuth broker, or a clear error naming what to configure.
 *
 * Token refresh has no useful degraded mode — without a broker the stored
 * refresh token cannot be exchanged — so this throws rather than returning
 * undefined and letting a fetch fail against a host that does not resolve.
 */
export function requireNeonOauthBroker(): string {
  const broker = hostedServices.oauthBrokerUrl();
  if (!broker) {
    throw new Error(
      "No OAuth broker is configured, so the Neon connection cannot be " +
        "refreshed. Set KAPABLE_OAUTH_URL, or connect Neon with an API key.",
    );
  }
  return broker.replace(/\/+$/, "");
}

/** The Supabase OAuth broker, or a clear error naming what to configure. */
export function requireSupabaseOauthBroker(): string {
  const broker = hostedServices.supabaseOauthBrokerUrl();
  if (!broker) {
    throw new Error(
      "No OAuth broker is configured, so the Supabase connection cannot be " +
        "refreshed. Set KAPABLE_SUPABASE_OAUTH_URL, or connect Supabase with " +
        "an access token.",
    );
  }
  return broker.replace(/\/+$/, "");
}

/**
 * Base URL of the hosted help-chat assistant, or a clear error.
 *
 * The in-app help bot talks to a gateway upstream operated; there is no
 * offline equivalent, so this throws with an actionable message rather than
 * silently failing against a host this fork does not own.
 */
export function requireHelpChatUrl(): string {
  const helpChatUrl = optionalEnv("KAPABLE_HELP_CHAT_URL");
  if (!helpChatUrl) {
    throw new Error(
      "The in-app help assistant needs a hosted endpoint, which this build " +
        "does not have. Set KAPABLE_HELP_CHAT_URL, or see the docs at " +
        `${DOCS_URL}.`,
    );
  }
  return helpChatUrl;
}

/**
 * Endpoint returning the signed-in account's credit balance, or a clear error.
 *
 * Only reached on the managed-plan path, which needs a gateway key; there is
 * no local answer to "how many credits are left", so this throws rather than
 * querying a host this fork does not own.
 */
export function requireUserInfoUrl(): string {
  const override = optionalEnv("KAPABLE_USER_INFO_URL");
  if (override) return override;
  const apiBaseUrl = hostedServices.apiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error(
      "No account API is configured, so credit balance is unavailable. Set " +
        "KAPABLE_API_URL, or use a bring-your-own-key provider, which bills " +
        "through your own provider account.",
    );
  }
  return `${apiBaseUrl.replace(/\/+$/, "")}/v1/user/info`;
}

/** True when analytics have been explicitly configured for this build. */
export function isTelemetryConfigured(): boolean {
  return Boolean(hostedServices.telemetryKey());
}

/** True when an update feed has been configured for this build. */
export function isAutoUpdateConfigured(): boolean {
  return Boolean(hostedServices.updateFeedUrl());
}
