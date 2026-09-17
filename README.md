# KapAble

**KapAble is a local, open-source AI app builder.** Describe an app in plain
language and KapAble writes the code onto your machine, installs it, and runs a
live preview you can click through — like Lovable, v0 or Bolt, except your code
stays on your machine and the only thing sent anywhere is the prompt context
you give to the AI provider you chose.

- ⚡️ **Local first** — your code, your keys, your machine. No lock-in.
- 🔑 **Bring your own key** — Anthropic, OpenAI, Google, xAI, Bedrock, Azure,
  OpenRouter, or any OpenAI-compatible endpoint. Local models via Ollama or
  LM Studio work too, fully offline.
- 🖱 **Click to edit** — select a component in the live preview and tell the
  agent what to change about it.
- 🗄 **Real integrations** — GitHub, Supabase and Neon, so generated apps ship
  with auth and a database rather than mock data.
- 📵 **No analytics** — this fork sends none. See
  [Privacy and telemetry](./docs/README.md#privacy-and-telemetry).

---

## Quick start

Requires **Node.js 24** (Node 26+ is not supported yet) and **git**.

```bash
git clone https://github.com/AkshatSidharth/KapAble.git
cd KapAble
npm install
npm start
```

Then add an AI provider key in **Settings → AI** and describe the app you want.

New here? [`docs/DEMO.md`](./docs/DEMO.md) is a five-minute scripted
walkthrough that takes you from a blank window to a working app with a
database.

Full documentation lives in [`docs/README.md`](./docs/README.md).

## Common commands

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm start`         | Run the app in development mode with hot reload           |
| `npm test`          | Unit and integration tests (vitest)                       |
| `npm run ts`        | Typecheck the app and the workers                         |
| `npm run lint`      | Lint with oxlint                                          |
| `npm run fmt`       | Format with oxfmt                                         |
| `npm run presubmit` | Format check + lint, as CI runs them                      |
| `npm run package`   | Build an unpacked desktop app into `./out`                |
| `npm run make`      | Build installers for the current platform                 |
| `npm run e2e`       | Playwright end-to-end tests (needs `npm run build` first) |

Native modules (`better-sqlite3`, `node-pty`) compile during `npm install`, so
the first install needs a C++ toolchain and network access.

## Configuration

KapAble runs entirely on bring-your-own-key and needs no server-side
configuration. Copy `.env.example` to `.env` if you would rather supply
provider keys through the environment than through the UI.

A set of optional hosted features — a managed LLM gateway, remote model and MCP
catalogs, OAuth brokers, auto-update — are **off by default** because KapAble
does not operate those services. Each turns on by pointing an environment
variable at your own deployment; see
[Hosted services](./docs/README.md#hosted-services) for the list.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Architecture notes and decision
records are in [`docs/`](./docs/).

## Relationship to Dyad

KapAble is a fork of [Dyad](https://github.com/dyad-sh/dyad) (v1.16.0),
rebranded and reconfigured to run standalone. Significant changes from
upstream:

- Rebranded throughout — product name, UI copy across all six locales,
  identifiers, tags, protocol scheme and on-disk paths.
- Analytics removed. Upstream compiled in its own PostHog project key; this
  fork ships with none and makes no analytics requests.
- Hosted-service endpoints are no longer hard-coded to a domain this project
  does not own. They are declared in
  [`src/constants/brand.ts`](./src/constants/brand.ts), default to unset, and
  degrade to local behaviour instead of failing against a dead host.
- Auto-update is off unless an update feed is configured.
- In-app help links point at this repository's own docs.

Things deliberately left on upstream identifiers, because they are external
contracts rather than branding: the `@dyad-sh/*` npm packages, the
`data-dyad-*` attributes the component tagger injects into generated apps, and
the `dyad-sh/*` starter template repositories cloned at runtime.

## License

This repository carries two licenses, both inherited from upstream:

- Everything **outside `src/pro/`** is Apache 2.0 — see [LICENSE](./LICENSE).
- Everything **inside `src/pro/`** is fair-source under the
  [Functional Source License 1.1 (Apache 2.0 future license)](https://fsl.software/)
  — see [src/pro/LICENSE](./src/pro/LICENSE).

The FSL permits internal use, non-commercial education and non-commercial
research, but **not** a "Competing Use" — shipping a commercial product that
substitutes for Dyad — until each version's Apache 2.0 conversion two years
after its release. If KapAble is ever commercialised, `src/pro/` needs to be
removed or separately licensed first. Copyright notices for
Dyad Tech, Inc. are retained as both licenses require; see [NOTICE](./NOTICE).
