import { cleanFullResponse } from "@/ipc/utils/cleanFullResponse";
import { describe, it, expect } from "vitest";

describe("cleanFullResponse", () => {
  it("should replace < characters in kapable-write attributes", () => {
    const input = `<kapable-write path="src/file.tsx" description="Testing <a> tags.">content</kapable-write>`;
    const expected = `<kapable-write path="src/file.tsx" description="Testing ＜a＞ tags.">content</kapable-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should replace < characters in multiple attributes", () => {
    const input = `<kapable-write path="src/<component>.tsx" description="Testing <div> tags.">content</kapable-write>`;
    const expected = `<kapable-write path="src/＜component＞.tsx" description="Testing ＜div＞ tags.">content</kapable-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle multiple nested HTML tags in a single attribute", () => {
    const input = `<kapable-write path="src/file.tsx" description="Testing <div> and <span> and <a> tags.">content</kapable-write>`;
    const expected = `<kapable-write path="src/file.tsx" description="Testing ＜div＞ and ＜span＞ and ＜a＞ tags.">content</kapable-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle complex example with mixed content", () => {
    const input = `
      BEFORE TAG
  <kapable-write path="src/pages/locations/neighborhoods/louisville/Highlands.tsx" description="Updating Highlands neighborhood page to use <a> tags.">
import React from 'react';
</kapable-write>
AFTER TAG
    `;

    const expected = `
      BEFORE TAG
  <kapable-write path="src/pages/locations/neighborhoods/louisville/Highlands.tsx" description="Updating Highlands neighborhood page to use ＜a＞ tags.">
import React from 'react';
</kapable-write>
AFTER TAG
    `;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle other kapable tag types", () => {
    const input = `<kapable-rename from="src/<old>.tsx" to="src/<new>.tsx"></kapable-rename>`;
    const expected = `<kapable-rename from="src/＜old＞.tsx" to="src/＜new＞.tsx"></kapable-rename>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle kapable-delete tags", () => {
    const input = `<kapable-delete path="src/<component>.tsx"></kapable-delete>`;
    const expected = `<kapable-delete path="src/＜component＞.tsx"></kapable-delete>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should not affect content outside kapable tags", () => {
    const input = `Some text with <regular> HTML tags. <kapable-write path="test.tsx" description="With <nested> tags.">content</kapable-write> More <html> here.`;
    const expected = `Some text with <regular> HTML tags. <kapable-write path="test.tsx" description="With ＜nested＞ tags.">content</kapable-write> More <html> here.`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle empty attributes", () => {
    const input = `<kapable-write path="src/file.tsx">content</kapable-write>`;
    const expected = `<kapable-write path="src/file.tsx">content</kapable-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle attributes without < characters", () => {
    const input = `<kapable-write path="src/file.tsx" description="Normal description">content</kapable-write>`;
    const expected = `<kapable-write path="src/file.tsx" description="Normal description">content</kapable-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });
});
