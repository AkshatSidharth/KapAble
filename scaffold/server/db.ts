import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * The app's database: SQLite, held in a file on disk.
 *
 * `node:sqlite` ships inside Node itself, so there is no driver to install,
 * nothing to compile, and no account to connect — the app persists data the
 * moment it runs, online or offline.
 *
 * Point DATABASE_PATH at another file to move the database (a mounted volume
 * in production, a scratch file in tests). The directory is created on demand.
 */
const DATABASE_PATH = process.env.DATABASE_PATH ?? path.join(".data", "app.db");

/**
 * Schema history. Append a new entry for every schema change; never edit or
 * reorder the ones already here.
 *
 * Each entry runs exactly once, in order, and the database records how many
 * have run (SQLite's `user_version`). Editing an old entry therefore does
 * nothing to a database that already applied it, and the two would silently
 * disagree about their own shape.
 *
 * Add tables here and nowhere else — a `CREATE TABLE` issued from a route
 * runs on every request and is invisible to this history.
 */
const MIGRATIONS: string[] = [
  // Example — delete this once the app has real tables of its own:
  //
  // `CREATE TABLE notes (
  //    id         INTEGER PRIMARY KEY AUTOINCREMENT,
  //    title      TEXT    NOT NULL,
  //    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  //  )`,
];

let database: DatabaseSync | undefined;

function migrate(db: DatabaseSync): void {
  // `user_version` is a plain integer SQLite stores in the file header. It
  // counts how many entries of MIGRATIONS this database has already applied.
  const { user_version: applied } = db.prepare("PRAGMA user_version").get() as {
    user_version: number;
  };

  for (let version = applied; version < MIGRATIONS.length; version++) {
    // Each migration commits with the version bump that records it, so a
    // crash midway cannot leave the schema ahead of its own bookkeeping and
    // silently skip a migration on the next start.
    db.exec("BEGIN");
    try {
      db.exec(MIGRATIONS[version]);
      db.exec(`PRAGMA user_version = ${version + 1}`);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}

/**
 * The open database, migrated and ready to query.
 *
 * Server-side only. Importing this from anywhere under `src/` would ship it
 * to the browser, where `node:sqlite` does not exist.
 */
export function getDb(): DatabaseSync {
  if (!database) {
    mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
    database = new DatabaseSync(DATABASE_PATH);
    // WAL lets reads proceed while a write is in flight, which a dev server
    // reloading on every save does constantly.
    database.exec("PRAGMA journal_mode = WAL");
    database.exec("PRAGMA foreign_keys = ON");
    migrate(database);
  }
  return database;
}
