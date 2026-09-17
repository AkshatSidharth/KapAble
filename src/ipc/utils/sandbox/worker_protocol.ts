import {
  KapableError,
  KapableErrorKind,
  isKapableError,
} from "@/errors/kapable_error";
import type { SandboxHostCallName } from "./capabilities";
import type { SandboxRunResult } from "./execution";

export interface SandboxWorkerInput {
  appPath: string;
  script: string;
  timeoutMs: number;
  persistFullOutput?: boolean;
}

export interface SandboxWorkerHostCall {
  name: SandboxHostCallName;
  path?: string;
}

export interface SerializedSandboxWorkerError {
  name?: string;
  message: string;
  kind?: KapableErrorKind;
  stack?: string;
}

export type SandboxWorkerMessage =
  | { type: "vmBudgetStart" }
  | { type: "vmBudgetPause" }
  | { type: "vmBudgetResume" }
  | { type: "hostCall"; hostCall: SandboxWorkerHostCall }
  | { type: "result"; result: SandboxRunResult }
  | { type: "error"; error: SerializedSandboxWorkerError };

export function serializeSandboxWorkerError(
  error: unknown,
): SerializedSandboxWorkerError {
  if (isKapableError(error)) {
    return {
      name: error.name,
      message: error.message,
      kind: error.kind,
      stack: error.stack,
    };
  }
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return {
    message: String(error),
  };
}

function isKapableErrorKind(value: unknown): value is KapableErrorKind {
  return (
    typeof value === "string" &&
    Object.values(KapableErrorKind).includes(value as KapableErrorKind)
  );
}

export function deserializeSandboxWorkerError(
  error: SerializedSandboxWorkerError,
): Error {
  if (isKapableErrorKind(error.kind)) {
    const kapableError = new KapableError(error.message, error.kind);
    kapableError.stack = error.stack;
    return kapableError;
  }

  const genericError = new Error(error.message);
  genericError.name = error.name ?? genericError.name;
  genericError.stack = error.stack;
  return genericError;
}
