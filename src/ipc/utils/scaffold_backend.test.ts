import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { NITRO_RULES_START } from "./ai_rules_patcher";
import { detectFrameworkType } from "./framework_utils";
import { NITRO_START_COMMAND } from "@/lib/framework_constants";

/**
 * The scaffold ships a Nitro server layer and a SQLite database, so every app
 * KapAble creates can persist data from its first prompt rather than being a
 * UI over local state.
 *
 * These assertions guard the wiring that makes that true. Each one has a
 * specific failure it prevents, noted where it is not obvious.
 */
const SCAFFOLD = path.join(__dirname, "..", "..", "..", "scaffold");

function readScaffold(relativePath: string): string {
  return fs.readFileSync(path.join(SCAFFOLD, relativePath), "utf8");
}

describe("scaffold backend", () => {
  it("is detected as vite-nitro, so Build mode never refuses server code", () => {
    // getSystemPromptForChatMode only injects BUILD_SERVER_LAYER_NUDGE — the
    // paragraph telling the user to switch to Agent mode — for plain "vite"
    // apps. A scaffold that regressed to "vite" would start refusing backend
    // requests again in the default chat mode.
    expect(detectFrameworkType(SCAFFOLD)).toBe("vite-nitro");
  });

  it("registers nitro() last in the vite plugin list", () => {
    // Ahead of Vite's module-transform middleware, Nitro's SPA fallback
    // answers /@vite/client and /src/*.tsx with index.html, which leaves the
    // preview showing a blank page.
    const viteConfig = readScaffold("vite.config.ts");
    expect(viteConfig).toContain(`import { nitro } from "nitro/vite"`);
    expect(viteConfig).toMatch(/plugins:\s*\[[^\]]*nitro\(\),?\s*\]/);
  });

  it("imports the nitro plugin by name, not as a default export", () => {
    // `nitro/vite` exports { nitro } only. A default import type-checks and
    // then throws "does not provide an export named 'default'" at the moment
    // Vite loads the config, so the dev server never starts.
    expect(readScaffold("vite.config.ts")).not.toMatch(
      /import\s+nitro\s+from\s+["']nitro\/vite["']/,
    );
  });

  it("declares the nitro runtime and a start script for it", () => {
    const pkg = JSON.parse(readScaffold("package.json"));
    expect(pkg.dependencies).toHaveProperty("nitro");
    // jiti loads nitro.config.ts at runtime; without it Nitro cannot read its
    // own TypeScript config.
    expect(pkg.dependencies).toHaveProperty("jiti");
    // A Vite app is served as static files; with Nitro it is a server whose
    // entry point lives in the build output, and only this script says so.
    expect(pkg.scripts.start).toBe(NITRO_START_COMMAND);
  });

  it("points nitro at the server directory the routes live in", () => {
    expect(readScaffold("nitro.config.ts")).toContain(`serverDir: "./server"`);
    expect(fs.existsSync(path.join(SCAFFOLD, "server", "routes", "api"))).toBe(
      true,
    );
  });

  it("carries the nitro rules markers so the patcher leaves them alone", () => {
    // appendNitroRules is a no-op when NITRO_RULES_START is already present.
    // Without the marker, connecting Neon or calling enable_nitro would append
    // a second, conflicting copy of the server-layer conventions.
    expect(readScaffold("AI_RULES.md")).toContain(NITRO_RULES_START);
  });

  it("tells the model to persist data rather than fake it", () => {
    const aiRules = readScaffold("AI_RULES.md");
    expect(aiRules).toContain("server/db.ts");
    expect(aiRules).toContain("server/routes/api/");
    expect(aiRules).toMatch(/do NOT hold that data in `useState`/i);
  });

  it("keeps the database out of the browser bundle and out of git", () => {
    // node:sqlite does not exist in a browser, and the client bundle is
    // public, so a db.ts import from src/ both breaks the build and leaks
    // whatever the server reads.
    const srcFiles = fs.readdirSync(path.join(SCAFFOLD, "src"), {
      recursive: true,
      encoding: "utf8",
    });
    for (const file of srcFiles) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const contents = fs.readFileSync(
        path.join(SCAFFOLD, "src", file),
        "utf8",
      );
      expect(contents).not.toContain("node:sqlite");
      expect(contents).not.toMatch(/from\s+["'].*server\/db["']/);
    }
    expect(readScaffold(".gitignore")).toContain(".data");
  });

  it("starts with no migrations, so a new app has no tables it did not ask for", () => {
    const db = readScaffold("server/db.ts");
    const migrations = db.match(
      /const MIGRATIONS: string\[\] = \[([\s\S]*?)\n\];/,
    );
    expect(migrations).not.toBeNull();
    // Only commented-out example SQL may remain.
    const uncommented = migrations![1]
      .split("\n")
      .filter((line) => line.trim() && !line.trim().startsWith("//"));
    expect(uncommented).toEqual([]);
  });
});
