# Tech Stack

- You are building a **full-stack** React application: a browser UI in `src/` and a Nitro server with its own database in `server/`.
- Use TypeScript.
- Use React Router. KEEP the routes in src/App.tsx
- Always put client source code in the src folder.
- Put pages into src/pages/
- Put components into src/components/
- The main page (default page) is src/pages/Index.tsx
- UPDATE the main page to include the new components. OTHERWISE, the user can NOT see any components!
- ALWAYS try to use the shadcn/ui library.
- Tailwind CSS: always use Tailwind CSS for styling components. Utilize Tailwind classes extensively for layout, spacing, colors, and other design aspects.

Available packages and libraries:

- The lucide-react package is installed for icons.
- You ALREADY have ALL the shadcn/ui components and their dependencies installed. So you don't need to install them again.
- You have ALL the necessary Radix UI components installed.
- Use prebuilt components from the shadcn/ui library after importing them. Note that these files shouldn't be edited, so make new components if you need to change them.
- `@tanstack/react-query` is installed — use it for every call into `/api/`.

<!-- nitro:start -->

## Build the backend, not just the screens

This app has a working server and database from the very first prompt. There is nothing to install, connect, or sign up for before using them.

**Any state the user would expect to still be there after a refresh belongs in the database, behind an API route.** That covers lists, items, records, settings, uploads, accounts, drafts, scores, bookings — anything the app "has".

So, whenever a request implies data:

1. Add a table to `MIGRATIONS` in `server/db.ts`.
2. Add the routes under `server/routes/api/` that read and write it.
3. Have the UI call those routes through `@tanstack/react-query`.

Never fake it. Do NOT hold that data in `useState`, a module-level array, a hardcoded fixture, or `localStorage`, and do NOT leave a "wire this up to a backend later" comment. A prototype that forgets everything on refresh is a failed result, not a first step.

`useState` remains correct for genuinely transient UI state: which tab is open, whether a dialog is showing, the current value of an input being typed into.

## Nitro Server Layer

This project has a Nitro server layer for backend API routes. A `nitro.config.ts` at the app root sets `serverDir: "./server"` — do not move or remove it.

### vite.config.ts

`vite.config.ts` already has `import { nitro } from "nitro/vite"` — a **named** import; `nitro/vite` has no default export — and registers `nitro()` as the LAST entry in the `plugins` array. Do not move it earlier — it must run after Vite's module-transform middleware, otherwise Nitro's SPA fallback intercepts Vite internal URLs (`/src/*.tsx`, `/@vite/client`, `/@react-refresh`, `/@fs/*`) and returns `index.html`, breaking the preview.

### API Route Conventions

- Write routes in `server/routes/api/` (NEVER top-level `/api/`).
- Dynamic routes: `[param].ts`. Method-specific: `hello.get.ts`, `hello.post.ts`.
- Runtime config: `useRuntimeConfig()` (env vars prefixed with `NITRO_`).

### Imports — read carefully

Imports come from two different sources:

- `defineHandler` and `useRuntimeConfig` are imported from **`"nitro"`**.
- **Every request/response helper comes from `"nitro/h3"`** — Nitro v3 re-exports h3 utilities through that subpath. Common ones: `readBody`, `readValidatedBody`, `getQuery`, `getRouterParam`, `getRouterParams`, `createError`, `sendError`, `setResponseStatus`, `getRequestHeaders`, `getRequestURL`, `setCookie`, `getCookie`, `deleteCookie`.

## The database

`server/db.ts` owns a SQLite database, using `node:sqlite` from the Node runtime itself. There is no driver to install and no connection string to configure.

### Adding a table

Append a SQL string to the `MIGRATIONS` array in `server/db.ts`. Never edit or reorder an entry that is already there — each one runs exactly once and the database records how many have run, so an edited entry never reaches a database that already applied it.

Never issue `CREATE TABLE` from inside a route handler.

### Querying

`getDb()` returns the open, migrated database. Use `.prepare(...)` with **bound parameters** — never build SQL by concatenating values, which is how injection gets in:

```ts
const db = getDb();
db.prepare("INSERT INTO notes (title) VALUES (?)").run(title); // correct
db.prepare(`INSERT INTO notes (title) VALUES ('${title}')`).run(); // NEVER
```

`.get()` returns one row, `.all()` returns every row, `.run()` performs a write and reports `changes` and `lastInsertRowid`.

Worked example — `server/routes/api/notes.post.ts`:

```ts
import { defineHandler } from "nitro";
import { readBody, createError } from "nitro/h3";

import { getDb } from "../../db";

export default defineHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event);
  const title = body?.title?.trim();
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: "title is required" });
  }

  const result = getDb()
    .prepare("INSERT INTO notes (title) VALUES (?)")
    .run(title);

  return { id: Number(result.lastInsertRowid), title };
});
```

Validate what comes in off the wire before it reaches the database — `zod` is installed. Return a `createError({ statusCode: 400 })` rather than storing something malformed.

### Server-side packages

Any package used inside `server/` (auth SDKs, third-party API clients) must be in `package.json`. Add it before writing the first server file that imports it. NEVER import these from `src/` — code under `src/` ships to the browser, so importing server packages there leaks them and usually breaks the build.

### Common mistakes

- `import { readBody } from "nitro"` → wrong. h3 utilities are not exported from `"nitro"`. Use `"nitro/h3"`.
- `import { readBody } from "h3"` → wrong. Even though Nitro is built on h3, you import through `"nitro/h3"` (the version Nitro re-exports), not `"h3"` directly.
- `nitro()` placed before `react()` in `plugins` → wrong. Must be the LAST entry, otherwise the SPA fallback intercepts Vite internals.
- Omitting `nitro()` from `vite.config.ts` entirely → `/api/*` returns `index.html` instead of JSON.
- Importing `server/db.ts`, any server-only package, or a server-only env var (secrets, `DATABASE_PATH`) from `src/` → wrong. The Vite client bundle is public; this leaks them, and `node:sqlite` does not exist in a browser. Server code lives in `server/` only.
- Creating a table from a route handler instead of adding it to `MIGRATIONS` → wrong. It re-runs on every request and leaves the schema unversioned.

<!-- nitro:end -->
