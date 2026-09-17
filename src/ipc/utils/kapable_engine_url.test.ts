import { afterEach, describe, expect, it } from "vitest";

import { getKapableEngineBaseUrl } from "./kapable_engine_url";
import { getLmStudioBaseUrl } from "./lm_studio_utils";

const originalKapableEngineUrl = process.env.KAPABLE_ENGINE_URL;
const originalLmStudioUrl = process.env.LM_STUDIO_BASE_URL_FOR_TESTING;

describe("call-time model service URLs", () => {
  afterEach(() => {
    if (originalKapableEngineUrl === undefined) {
      delete process.env.KAPABLE_ENGINE_URL;
    } else {
      process.env.KAPABLE_ENGINE_URL = originalKapableEngineUrl;
    }
    if (originalLmStudioUrl === undefined) {
      delete process.env.LM_STUDIO_BASE_URL_FOR_TESTING;
    } else {
      process.env.LM_STUDIO_BASE_URL_FOR_TESTING = originalLmStudioUrl;
    }
  });

  it("reads KAPABLE_ENGINE_URL when called", () => {
    process.env.KAPABLE_ENGINE_URL = "http://127.0.0.1:4321/v1";
    expect(getKapableEngineBaseUrl()).toBe("http://127.0.0.1:4321/v1");
  });

  it("throws instead of defaulting to a host KapAble does not run", () => {
    delete process.env.KAPABLE_ENGINE_URL;
    expect(() => getKapableEngineBaseUrl()).toThrow(/KAPABLE_ENGINE_URL/);
  });

  it("reads LM_STUDIO_BASE_URL_FOR_TESTING when called", () => {
    delete process.env.LM_STUDIO_BASE_URL_FOR_TESTING;
    expect(getLmStudioBaseUrl()).toBe("http://localhost:1234");

    process.env.LM_STUDIO_BASE_URL_FOR_TESTING = "http://127.0.0.1:9876";
    expect(getLmStudioBaseUrl()).toBe("http://127.0.0.1:9876");
  });
});
