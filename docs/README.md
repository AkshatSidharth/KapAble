# KapAble docs

KapAble is a local, open-source AI app builder. You describe an app in plain
language; KapAble writes the code onto your machine and runs a live preview of
it. Everything — your code, your API keys, your prompts — stays on your
computer.

This page is the in-app help target: the "learn more" links inside KapAble
point at the sections below.

- [Getting started](#getting-started)
- [Bring your own API key](#bring-your-own-api-key)
- [Custom and local models](#custom-and-local-models)
- [AI rate limits](#ai-rate-limits)
- [Context management for large apps](#context-management-for-large-apps)
- [Templates](#templates)
- [Integrations](#integrations)
- [Mobile apps](#mobile-apps)
- [Security review](#security-review)
- [Upgrades](#upgrades)
- [Backup and restore](#backup-and-restore)
- [Privacy and telemetry](#privacy-and-telemetry)
- [Troubleshooting](#troubleshooting)
- [Reporting a bug](#reporting-a-bug)
- [FAQ](#faq)

For contributor-facing material — architecture, ADRs, i18n, the security
model — see [`architecture.md`](./architecture.md),
[`agent_architecture.md`](./agent_architecture.md), [`adrs/`](./adrs/),
[`i18n.md`](./i18n.md) and [`security.md`](./security.md).

---

## Getting started

Requirements: **Node.js 24** (Node 26 and newer are not supported yet) and
**git**.

```bash
npm install
npm start
```

`npm start` runs KapAble in development mode with hot reload. For a packaged
desktop build, see [Building a desktop app](#building-a-desktop-app).

The first launch walks you through picking an AI provider. Nothing is sent
anywhere until you add a key.

See [`DEMO.md`](./DEMO.md) for a scripted five-minute walkthrough.

## Bring your own API key

KapAble is bring-your-own-key. Open **Settings → AI** and paste a key from any
supported provider — Anthropic, OpenAI, Google, xAI, Azure, Amazon Bedrock,
OpenRouter, or any OpenAI-compatible endpoint.

Keys are stored with Electron's `safeStorage`, which is backed by the OS
keychain (Keychain on macOS, DPAPI on Windows, libsecret on Linux). They are
never transmitted anywhere except to the provider you configured.

You can also supply keys through the environment instead — copy `.env.example`
to `.env` and fill in `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` or `GOOGLE_API_KEY`.

## Custom and local models

**Settings → AI → Add custom provider** accepts any OpenAI-compatible base URL,
which covers Ollama, LM Studio, vLLM, LiteLLM and most self-hosted gateways.

For Ollama, set `OLLAMA_HOST` (default `http://127.0.0.1:11434`) and KapAble
will discover the models you have pulled.

Local models need no API key and no network access.

## AI rate limits

A rate-limit error comes from your AI provider, not from KapAble. Options:

- Wait and retry — most limits reset within a minute.
- Switch to a different provider or a smaller model in the model picker.
- Raise the limit on your provider account.
- Run a local model, which has no rate limit at all.

## Context management for large apps

Once an app grows past a few dozen files, sending the whole codebase with every
message gets slow and expensive. KapAble offers:

- **Codebase context** — automatic selection of the files relevant to your
  request.
- **Manual context** — pin specific files or folders in the context panel so
  they are always included.
- **Compaction** — older conversation turns are summarised to stay inside the
  model's context window.

For very large apps, prefer manual context: name the files you are working on
and exclude the rest.

## Templates

New apps start from a template. The built-in set covers React + Vite, Next.js
and a portal/storefront starter; they are cloned from public GitHub
repositories the first time you use them.

To add your own, use **Add template** in the app picker and give it any public
git repository URL. A template is a normal repository — KapAble copies it and
then edits it like any other app.

The Next.js portal template ships with database migrations; create a new
migration from the app's database panel rather than editing the schema by hand.

## Integrations

### GitHub

Connect a GitHub account to push apps to a repository. If the connection
fails, check that:

- the account has permission to create repositories in the target org;
- the repository name is not already taken;
- your token has not expired — disconnect and reconnect to refresh it.

### Supabase

Connecting Supabase lets KapAble provision tables, run SQL and wire auth into
generated apps.

If KapAble reports that it cannot find a **publishable key** for a project,
the project is usually paused, or you connected a different Supabase account
than the one that owns it. Resume the project in the Supabase dashboard, or
reconnect the correct account.

### Neon

Neon provides Postgres branches per app, so preview changes do not touch your
main database.

## Mobile apps

KapAble can wrap an app with Capacitor to run it on iOS and Android.

- **iOS** additionally needs macOS with Xcode installed.
- **Android** needs Android Studio and a configured SDK.
- If a build fails immediately, the native toolchain is usually missing or not
  on `PATH`; open the build log from the preview panel for the exact error.

To upgrade an app that was created before mobile support, use **Upgrades** in
the app settings and apply the Capacitor upgrade.

## Security review

KapAble can review a generated app for common problems — exposed secrets,
missing row-level security, unauthenticated endpoints, unsafe SQL.

Run it from the preview panel's **Security** tab. Findings link to the exact
file and line. Treat it as a first pass, not an audit: it catches frequent
mistakes, not everything.

## Upgrades

Apps carry the conventions of the KapAble version that created them. When those
conventions change, the app's settings show an **Upgrades** list:

- **Component selection** — adds the tagging plugin so you can click a
  component in the preview and edit it directly.
- **pnpm migration** — moves an app from npm to pnpm for faster installs.
- **Capacitor** — adds mobile support.

Each upgrade is a normal code change: review the diff before keeping it.

## Backup and restore

KapAble keeps its database, settings and app metadata under the user-data
directory:

| Platform | Location                                |
| -------- | --------------------------------------- |
| macOS    | `~/Library/Application Support/kapable` |
| Windows  | `%APPDATA%\kapable`                     |
| Linux    | `~/.config/kapable`                     |

Settings are backed up automatically before risky migrations. To restore, quit
KapAble, replace `settings.json` with the backup copy from the same directory,
and start it again. Your apps themselves live wherever you chose to put them
and are plain git repositories — back them up like any other code.

## Privacy and telemetry

**KapAble sends no analytics.** Upstream Dyad shipped with a PostHog project
key compiled in; this fork ships with none, so the analytics client is
constructed opted-out and issues no network requests.

If you want analytics for your own deployment, set `VITE_KAPABLE_POSTHOG_KEY`
(and optionally `VITE_KAPABLE_POSTHOG_HOST`) at build time. Even then, events
are only sent if the user also opts in from the telemetry banner.

What always stays local: your source code, your API keys, and your apps. Your
prompts do go to whichever AI provider you configured — that provider's
privacy policy applies to them.

Two other outbound requests exist and are worth knowing about, neither
carrying anything about you:

- The code editor (Monaco) is fetched from `cdn.jsdelivr.net` on first use, so
  the editor needs network access once. Everything else in the UI is bundled.
- Creating an app clones its starter template from GitHub and installs its
  dependencies from npm.

Verified by launching the app and recording every request it makes: with no
analytics key configured, zero requests go to any PostHog host.

## Troubleshooting

**The preview does not load.** KapAble needs Node.js on `PATH` to install
dependencies and run your app's dev server. Check **Settings → Node** — you
can point it at a specific Node binary or let KapAble manage one.

**"Port already in use".** Another process holds the preview port. Stop it, or
restart the app from the preview panel to pick a new port.

**Clicking a component in the preview does nothing.** The app needs the
component-tagger plugin. Apply the _component selection_ upgrade (see
[Upgrades](#upgrades)).

**Dependencies fail to install.** Open the build log in the preview panel. The
most common causes are no network access and a corporate proxy that needs
`HTTPS_PROXY` set.

**Hosted features are unavailable.** Managed accounts, the hosted LLM gateway,
OAuth brokers and auto-update are all disabled unless you configure endpoints
for them — see [Hosted services](#hosted-services) below.

## Hosted services

Upstream Dyad ran a set of hosted services. KapAble does not operate
equivalents, so each one is unset by default and its feature degrades cleanly
rather than calling a domain nobody owns. Point them at your own deployment
with these environment variables:

| Variable                     | Enables                                                                                                      | Behaviour when unset                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `KAPABLE_ENGINE_URL`         | Managed OpenAI-compatible LLM gateway                                                                        | Managed-model calls fail with a message naming this variable; bring-your-own-key is unaffected |
| `KAPABLE_API_URL`            | Model catalog, MCP catalog, desktop config, community templates, default build-approval list, credit balance | Bundled model list, built-in templates only, no auto-approved install scripts                  |
| `KAPABLE_ACCOUNT_URL`        | Subscription portal                                                                                          | Upgrade banners and Pro promos are hidden; other upgrade links point at this page              |
| `KAPABLE_OAUTH_URL`          | OAuth broker for Neon (and Supabase unless overridden)                                                       | One-click connect explains that an API key or token can be used instead                        |
| `KAPABLE_SUPABASE_OAUTH_URL` | Supabase OAuth broker, when separate                                                                         | Falls back to `KAPABLE_OAUTH_URL`                                                              |
| `KAPABLE_HELP_CHAT_URL`      | In-app help assistant                                                                                        | The assistant reports that it has no endpoint                                                  |
| `KAPABLE_LOG_UPLOAD_URL`     | Bug-report log bundle upload                                                                                 | The bundle is still built; attach it to an issue by hand                                       |
| `KAPABLE_UPDATE_FEED_URL`    | Electron auto-update feed                                                                                    | Auto-update stays off, with no background polling                                              |
| `VITE_KAPABLE_POSTHOG_KEY`   | Product analytics (build time)                                                                               | No analytics client is active and no requests are made                                         |

None of these are needed for the bring-your-own-key path, which is the
supported way to run KapAble today.

`KAPABLE_LANGUAGE_MODEL_CATALOG_URL`, `KAPABLE_MCP_CATALOG_URL`,
`KAPABLE_DESKTOP_CONFIG_URL` and `KAPABLE_USER_INFO_URL` override individual
endpoints and take precedence over `KAPABLE_API_URL`.

They are all declared in one place — [`src/constants/brand.ts`](../src/constants/brand.ts)
— so adding a hosted feature means adding it there rather than hard-coding a host.

## Building a desktop app

```bash
npm run package   # unpacked app in ./out
npm run make      # installers for the current platform
```

Packaging compiles native modules (`better-sqlite3`, `node-pty`) and downloads
an Electron binary, so the first run needs network access.

## Reporting a bug

Open an issue at
<https://github.com/AkshatSidharth/KapAble/issues>.

The **Help → Report a bug** dialog collects logs for you. Review the bundle
before attaching it — it can contain file paths and app names.

## FAQ

**Is KapAble free?** Yes, and open source. You pay only your AI provider for
tokens.

**Does my code leave my machine?** No. It is written to a normal directory on
your disk. Only the prompt context you send goes to your AI provider.

**Can I use it offline?** Yes, with a local model. Creating a _new_ app from a
template needs network access once, to clone the template and install
dependencies.

**Which model should I use?** Any frontier model works. Larger models write
better code on the first try; smaller ones are cheaper for small edits.

**How is this related to Dyad?** KapAble is a fork of
[Dyad](https://github.com/dyad-sh/dyad), rebranded and reconfigured to run
standalone. See the [NOTICE](../NOTICE) file for attribution and licensing.

## Brand assets

The mark lives in one place: [`assets/logo.svg`](../assets/logo.svg). It is
what the title bar and setup banner render, and the source the app icons are
built from.

To change it, replace that file and regenerate the icons:

```bash
node scripts/brand/generate-icons.mjs
```

That rewrites `assets/icon/logo.png`, `logo.ico` and `logo.icns` — Electron
Forge picks a different one per platform (`.icns` macOS, `.ico` Windows,
`.png` Linux), so all three have to be rebuilt or packaged builds keep
shipping the previous mark. The script renders through the Chromium that
Playwright already installs and writes the ICO/ICNS containers directly, so it
needs no image toolchain.

Colours are defined as design tokens at the top of
[`src/styles/globals.css`](../src/styles/globals.css) — `--brand-primary` and
`--brand-secondary`, with every other token derived from them. The comments
there record the measured contrast of each pairing and why dark mode uses the
brand secondary as `--primary`.
