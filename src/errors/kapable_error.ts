/**
 * Classified application errors for IPC/main-process code.
 * Use {@link KapableError} with a {@link KapableErrorKind} so telemetry can ignore
 * high-volume, non-actionable failures (see `shouldFilterTelemetryException`).
 */

export enum KapableErrorKind {
  Validation = "validation",
  NotFound = "not_found",
  Auth = "auth",
  Precondition = "precondition",
  Conflict = "conflict",
  UserCancelled = "user_cancelled",
  RateLimited = "rate_limited",
  /** Upstream failures; reported to PostHog by default unless you add finer metadata later. */
  External = "external",
  /** Bugs, invariant violations, unexpected failures — always reported. */
  Internal = "internal",
  /** Unclassified; treated as reportable until call sites are migrated. */
  Unknown = "unknown",
}

const TELEMETRY_FILTERED_KINDS: ReadonlySet<KapableErrorKind> = new Set([
  KapableErrorKind.Validation,
  KapableErrorKind.NotFound,
  KapableErrorKind.Auth,
  KapableErrorKind.Precondition,
  KapableErrorKind.Conflict,
  KapableErrorKind.UserCancelled,
  KapableErrorKind.RateLimited,
]);

/**
 * Returns true if this kind should not be sent to PostHog as an `$exception` event.
 */
export function isKapableErrorKindFilteredFromTelemetry(
  kind: KapableErrorKind,
): boolean {
  return TELEMETRY_FILTERED_KINDS.has(kind);
}

export class KapableError extends Error {
  readonly kind: KapableErrorKind;
  readonly cause?: unknown;

  constructor(
    message: string,
    kind: KapableErrorKind,
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = "KapableError";
    this.kind = kind;
    this.cause = options?.cause;
  }
}

export function isKapableError(error: unknown): error is KapableError {
  return error instanceof KapableError;
}
