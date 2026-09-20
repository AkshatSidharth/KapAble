import { defineHandler } from "nitro";

import { getDb } from "../../db";

/**
 * Proves the whole server path works: the route is reachable, the database
 * opens, and migrations have run. Useful to curl when `/api/*` starts
 * returning HTML, which means `nitro()` has fallen out of the Vite plugin
 * list (see vite.config.ts) rather than anything being wrong with the route.
 *
 * Safe to delete once the app has routes of its own.
 */
export default defineHandler(() => {
  const db = getDb();
  const { user_version: schemaVersion } = db
    .prepare("PRAGMA user_version")
    .get() as { user_version: number };

  return {
    ok: true,
    schemaVersion,
    time: new Date().toISOString(),
  };
});
