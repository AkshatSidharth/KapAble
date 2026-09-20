import { describe, expect, it } from "vitest";

import { normalizeCaptureUrl } from "./local_page_capture";
import { KapableError, KapableErrorKind } from "@/errors/kapable_error";

/**
 * The capture itself needs a live Electron BrowserWindow, so these cover the
 * part that decides what is allowed to be loaded at all — which is where a
 * mistake would be a security bug rather than a broken screenshot.
 */
describe("normalizeCaptureUrl", () => {
  it("accepts a bare domain, since that is what people type", () => {
    // The tool's own description tells the model not to require a scheme.
    expect(normalizeCaptureUrl("example.com")).toBe("https://example.com/");
    expect(normalizeCaptureUrl("  example.com/pricing  ")).toBe(
      "https://example.com/pricing",
    );
  });

  it("assumes https rather than http for a bare domain", () => {
    expect(normalizeCaptureUrl("example.com")).toMatch(/^https:/);
  });

  it("preserves an explicit scheme, path and query", () => {
    expect(normalizeCaptureUrl("http://localhost:3000/app?tab=2")).toBe(
      "http://localhost:3000/app?tab=2",
    );
  });

  it.each(["file:///etc/passwd", "kapable-media://x", "javascript:alert(1)"])(
    "refuses %s",
    (url) => {
      // file:// would turn a screenshot request into a local file read, and
      // custom schemes reach the app's own protocol handlers.
      expect(() => normalizeCaptureUrl(url)).toThrow(KapableError);
      try {
        normalizeCaptureUrl(url);
      } catch (error) {
        expect((error as KapableError).kind).toBe(KapableErrorKind.Validation);
      }
    },
  );

  it("refuses an empty or whitespace-only url", () => {
    expect(() => normalizeCaptureUrl("")).toThrow(KapableError);
    expect(() => normalizeCaptureUrl("   ")).toThrow(KapableError);
  });

  it("refuses something that cannot be parsed as a url at all", () => {
    expect(() => normalizeCaptureUrl("http://")).toThrow(KapableError);
  });
});
