import { describe, expect, it } from "vitest";

import { getSystemPromptForChatMode } from "./system_prompt";
import {
  constructBuildAgentPrompt,
  constructLocalAgentPrompt,
} from "./local_agent_prompt";
import { UI_REPLICATION_GUIDANCE } from "./ui_replication_prompt";

/**
 * Pasting a screenshot already put the image in front of the model; what was
 * missing was anything telling it that the image is a specification. These
 * pin that guidance to every mode a person could paste one into.
 */
const MARKER = "# Building from a screenshot";

describe("UI replication guidance", () => {
  it("reaches Build mode, where a pasted screenshot is most likely to land", () => {
    const prompt = getSystemPromptForChatMode({
      chatMode: "build",
      enableTurboEditsV2: false,
    });
    expect(prompt).toContain(MARKER);
  });

  it("reaches Agent mode", () => {
    expect(constructLocalAgentPrompt(undefined)).toContain(MARKER);
  });

  it("reaches the build-agent loop", () => {
    expect(constructBuildAgentPrompt(undefined)).toContain(MARKER);
  });

  it("tells the model to match the design rather than approximate it", () => {
    expect(UI_REPLICATION_GUIDANCE).toMatch(/not merely be in its spirit/i);
    expect(UI_REPLICATION_GUIDANCE).toMatch(
      /Use the exact text visible in the image/i,
    );
  });

  it("keeps the model off external image URLs, which break", () => {
    expect(UI_REPLICATION_GUIDANCE).toMatch(/do not hotlink external image/i);
  });

  it("does not let a screenshot excuse a fake app", () => {
    // A screenshot shows one frozen moment; without this the model happily
    // hardcodes the visible rows to match the picture.
    expect(UI_REPLICATION_GUIDANCE).toMatch(/survive a refresh/i);
    expect(UI_REPLICATION_GUIDANCE).toMatch(/not in hardcoded fixtures/i);
  });

  it("ignores device frames and browser chrome around the design", () => {
    expect(UI_REPLICATION_GUIDANCE).toMatch(
      /device frame, browser chrome, OS status bar/i,
    );
  });
});
