import { describe, expect, it } from "vitest";

import { DEFAULT_THEME_ID, themesData, type Theme } from "./themes";

/** Icons AuxiliaryActionsMenu's THEME_ICONS map knows how to render. */
const RENDERABLE_ICONS = new Set([
  "palette",
  "book-open",
  "square",
  "cloud",
  "layout-grid",
  "shapes",
  "terminal",
]);

function themeById(id: string): Theme {
  const theme = themesData.find((t) => t.id === id);
  if (!theme) throw new Error(`no theme with id "${id}"`);
  return theme;
}

describe("themesData", () => {
  it("offers more than one design direction", () => {
    // With a single theme, every app KapAble generated looked the same —
    // one prompt, appended to every build, prescribing one art direction.
    expect(themesData.length).toBeGreaterThan(1);
  });

  it("still contains the default, since saved apps reference it by id", () => {
    expect(themeById(DEFAULT_THEME_ID)).toBeDefined();
  });

  it("gives every theme a unique id", () => {
    const ids = themesData.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("names an icon the menu can actually draw", () => {
    // AuxiliaryActionsMenu resolves theme.icon through an explicit map; an
    // unknown name falls back to the palette glyph, which would make two
    // themes indistinguishable in the picker.
    for (const theme of themesData) {
      expect(RENDERABLE_ICONS).toContain(theme.icon);
    }
  });

  it("gives every theme a name and a description for the picker", () => {
    for (const theme of themesData) {
      expect(theme.name.trim()).not.toBe("");
      expect(theme.description.trim()).not.toBe("");
    }
  });

  it("wraps every prompt in the theme envelope the system prompt expects", () => {
    for (const theme of themesData) {
      expect(theme.prompt).toContain("<theme>");
      expect(theme.prompt).toContain("</theme>");
      expect(theme.prompt).toContain("<rules>");
    }
  });

  it("carries the contrast floor into every theme, not just the default", () => {
    // A theme is an art direction, not permission to ship unreadable text.
    for (const theme of themesData) {
      expect(theme.prompt).toMatch(/contrast/i);
    }
  });

  it("keeps every theme mobile-first", () => {
    for (const theme of themesData) {
      expect(theme.prompt).toMatch(/mobile-first/i);
    }
  });

  it("makes each theme prescribe a genuinely different look", () => {
    // Guards against themes that differ only in name. Each of these is a
    // decision that visibly changes the generated UI, and no two built-ins
    // should land on the same combination.
    const fingerprints = themesData.map((theme) => {
      const p = theme.prompt.toLowerCase();
      return JSON.stringify({
        serif: p.includes("serif"),
        mono: p.includes("monospace"),
        rounded: /rounded|pill-shaped|generously rounded/.test(p),
        sharp: /border-radius is 0|no rounded corners/.test(p),
        dense: /density|compact/.test(p),
        dark: /dark-surface-first|deep neutral ground/.test(p),
        pastel: p.includes("pastel"),
        saturated: /saturated|multi-color/.test(p),
      });
    });
    expect(new Set(fingerprints).size).toBe(themesData.length);
  });

  it("does not restyle apps already on the default theme", () => {
    // Every app created before the other themes existed is pinned to this
    // one. Adding siblings must not rewrite the prompt it generates against.
    const defaultPrompt = themeById(DEFAULT_THEME_ID).prompt;
    expect(defaultPrompt).toContain("### Default Theme");
    expect(defaultPrompt).toContain("planning_questionnaire");
    expect(defaultPrompt).toContain("Analyze the industry and target users");
    expect(defaultPrompt).toContain(
      "Visuals are essential: Use images to create mood, context, and appeal.",
    );
  });
});
