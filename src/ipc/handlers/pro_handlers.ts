import fetch from "node-fetch"; // Electron main process might need node-fetch
import { shell } from "electron";
import log from "electron-log";
import { createLoggedHandler } from "./safe_handle";
import { createLoggedTypedHandler } from "./base";
import { readSettings } from "../../main/settings"; // Assuming settings are read this way
import {
  SubscriptionStatusSchema,
  systemContracts,
  UserBudgetInfo,
  UserBudgetInfoSchema,
} from "@/ipc/types";
import { IS_TEST_BUILD } from "../utils/test_utils";
import {
  AUDIO_REQUEST_ID_PATTERN,
  audioContracts,
  MAX_AUDIO_FILENAME_LENGTH,
  MAX_AUDIO_RECORDING_BYTES,
  MAX_AUDIO_REQUEST_ID_LENGTH,
} from "../types/audio";
import type { TranscribeAudioParams } from "../types/audio";
import { transcribeWithKapableEngine } from "../utils/llm_engine_provider";
import { getKapableEngineBaseUrl } from "../utils/kapable_engine_url";
import { KapableError, KapableErrorKind } from "@/errors/kapable_error";

import { fetchUserInfo } from "../services/user_budget_service";
import { hostedServices, upgradeUrl } from "@/constants/brand";
export {
  UserInfoResponseSchema,
  type UserInfoResponse,
} from "../services/user_budget_service";

const logger = log.scope("pro_handlers");
const handle = createLoggedHandler(logger);
const typedHandle = createLoggedTypedHandler(logger);

function validateAudioTranscriptionRequest(input: TranscribeAudioParams) {
  if (
    input.audioData.byteLength === 0 ||
    input.audioData.byteLength > MAX_AUDIO_RECORDING_BYTES
  ) {
    throw new KapableError(
      `Audio data must be between 1 and ${MAX_AUDIO_RECORDING_BYTES} bytes`,
      KapableErrorKind.Validation,
    );
  }

  const trimmedFilename = input.filename.trim();
  if (
    trimmedFilename.length === 0 ||
    trimmedFilename.length > MAX_AUDIO_FILENAME_LENGTH ||
    trimmedFilename.includes("/") ||
    trimmedFilename.includes("\\") ||
    trimmedFilename === "." ||
    trimmedFilename === ".."
  ) {
    throw new KapableError(
      "Invalid audio filename",
      KapableErrorKind.Validation,
    );
  }

  if (
    input.requestId.trim().length === 0 ||
    input.requestId.length > MAX_AUDIO_REQUEST_ID_LENGTH ||
    !AUDIO_REQUEST_ID_PATTERN.test(input.requestId)
  ) {
    throw new KapableError(
      "Invalid transcription request ID",
      KapableErrorKind.Validation,
    );
  }
}

function getSubscriptionStatusUrl() {
  return (
    process.env.KAPABLE_SUBSCRIPTION_STATUS_URL ??
    upgradeUrl("/api/desktop/subscription-status")
  );
}

function getSubscriptionStatusApiKey() {
  const url = getSubscriptionStatusUrl();
  const fixtureApiKey = process.env.KAPABLE_SUBSCRIPTION_STATUS_FIXTURE_API_KEY;
  if (fixtureApiKey) {
    try {
      const hostname = new URL(url).hostname;
      if (
        hostname === "127.0.0.1" ||
        hostname === "localhost" ||
        hostname === "[::1]"
      ) {
        return fixtureApiKey;
      }
    } catch {
      // The request path below will log and safely ignore an invalid URL.
    }
  }
  return readSettings().providerSettings?.auto?.apiKey?.value;
}

export function parseBillingActionUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new KapableError(
      "Invalid billing action URL",
      KapableErrorKind.Validation,
    );
  }
  // A server-supplied URL that the app will open, so it is pinned to the host
  // of the configured account portal. With no portal configured there is no
  // trusted host, and every billing action URL is rejected.
  let expectedHostname: string | undefined;
  const accountUrl = hostedServices.accountUrl();
  if (accountUrl) {
    try {
      expectedHostname = new URL(accountUrl).hostname;
    } catch {
      expectedHostname = undefined;
    }
  }
  if (
    !expectedHostname ||
    url.protocol !== "https:" ||
    url.hostname !== expectedHostname ||
    url.username !== "" ||
    url.password !== "" ||
    url.port !== ""
  ) {
    throw new KapableError(
      "Invalid billing action URL",
      KapableErrorKind.Validation,
    );
  }
  return url.toString();
}

export function registerProHandlers() {
  // This method should try to avoid throwing errors because this is auxiliary
  // information and isn't critical to using the app
  handle("get-user-budget", async (): Promise<UserBudgetInfo | null> => {
    if (IS_TEST_BUILD) {
      // Return mock budget data for E2E tests instead of spamming the API
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 30); // Reset in 30 days
      return {
        usedCredits: 100,
        totalCredits: 1000,
        budgetResetDate: resetDate,
        redactedUserId: "<redacted-user-id-testing>",
        isTrial: false,
      };
    }
    logger.debug("Attempting to fetch user budget information.");

    const settings = readSettings();

    const apiKey = settings.providerSettings?.auto?.apiKey?.value;

    if (!apiKey) {
      // Expected state for non-Pro users; not an error.
      logger.debug("LLM Gateway API key (KapAble Pro) is not configured.");
      return null;
    }

    try {
      const data = await fetchUserInfo(apiKey);

      // Turn user_abc1234 =>  "****1234"
      // Preserve the last 4 characters so we can correlate bug reports
      // with the user.
      const redactedUserId =
        data.userId.length > 8 ? "****" + data.userId.slice(-4) : "<redacted>";

      logger.debug("Successfully fetched user budget information.");

      // Transform to UserBudgetInfo format
      const userBudgetInfo = UserBudgetInfoSchema.parse({
        usedCredits: data.usedCredits,
        totalCredits: data.totalCredits,
        budgetResetDate: new Date(data.budgetResetDate),
        redactedUserId: redactedUserId,
        isTrial: data.isTrial,
      });

      return userBudgetInfo;
    } catch (error: any) {
      logger.error(`Error fetching user budget: ${error.message}`, error);
      return null;
    }
  });

  typedHandle(systemContracts.getSubscriptionStatus, async () => {
    const apiKey = getSubscriptionStatusApiKey();
    if (!apiKey) {
      return null;
    }
    if (IS_TEST_BUILD && !process.env.KAPABLE_SUBSCRIPTION_STATUS_URL) {
      return null;
    }

    try {
      const response = await fetch(getSubscriptionStatusUrl(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        logger.warn(
          `Failed to fetch subscription status. Status: ${response.status}`,
        );
        return null;
      }
      return SubscriptionStatusSchema.parse(await response.json());
    } catch (error) {
      logger.error("Failed to fetch subscription status", error);
      return null;
    }
  });

  typedHandle(systemContracts.openBillingAction, async (_event, value) => {
    const url = parseBillingActionUrl(value);
    if (IS_TEST_BUILD) {
      logger.debug("E2E test mode: skipped opening billing action URL", url);
      return;
    }
    await shell.openExternal(url);
  });

  typedHandle(
    audioContracts.transcribeAudio,
    async (_event, input: TranscribeAudioParams) => {
      const settings = readSettings();
      const apiKey = settings.providerSettings?.auto?.apiKey?.value;

      if (!apiKey || !settings.enableKapablePro) {
        throw new KapableError(
          "KapAble Pro is not enabled. Voice-to-text requires a Pro subscription.",
          KapableErrorKind.Auth,
        );
      }

      validateAudioTranscriptionRequest(input);

      const audioBuffer = Buffer.from(
        input.audioData.buffer,
        input.audioData.byteOffset,
        input.audioData.byteLength,
      );

      const text = await transcribeWithKapableEngine(
        audioBuffer,
        input.filename,
        input.requestId,
        {
          apiKey,
          baseURL: getKapableEngineBaseUrl(),
          kapableOptions: {},
          settings,
        },
      );

      return { text };
    },
  );
}
