import { KapableError, KapableErrorKind } from "@/errors/kapable_error";
import { hostedServices } from "@/constants/brand";

/**
 * Base URL of the managed OpenAI-compatible gateway.
 *
 * Upstream Dyad defaulted this to its own hosted engine. KapAble does not run rebrand:keep
 * one, so there is no default: every caller here is on the managed-plan path,
 * which is unreachable without a key anyway. Failing with an actionable
 * message beats issuing requests to a domain this fork does not own.
 *
 * Set KAPABLE_ENGINE_URL to point at your own gateway.
 */
export function getKapableEngineBaseUrl(): string {
  const engineUrl = hostedServices.engineUrl();
  if (!engineUrl) {
    throw new KapableError(
      "No KapAble engine is configured. Set KAPABLE_ENGINE_URL to an " +
        "OpenAI-compatible gateway, or use a bring-your-own-key provider " +
        "from Settings > AI.",
      KapableErrorKind.Precondition,
    );
  }
  return engineUrl;
}

/** Whether the managed gateway is available in this build. */
export function isKapableEngineConfigured(): boolean {
  return Boolean(hostedServices.engineUrl());
}
