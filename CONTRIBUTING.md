# Contributing

Before opening a pull request, please open an issue and discuss whether the change makes sense in KapAble. Ensuring a cohesive user experience sometimes means we can't include every possible feature or we need to consider the long-term design of how we want to support a feature area.

- For a high-level overview of how KapAble works, please see the [Architecture Guide](./docs/architecture.md). Understanding the architecture will help ensure your contributions align with the overall design of the project.
- For a detailed architecture on how the new local agent mode (aka Agent v2) works, please read the [Agent Architecture Guide](./docs/agent_architecture.md)
- For an in-depth overview of the KapAble codebase, see the DeepWiki documentation [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/dyad-sh/dyad) (upstream Dyad; most of it still applies)

> **Note:** By submitting a contribution within `src/pro`, you agree that such contribution is licensed under the Fair Source License (FSL) used by that directory.

## More than code contributions

Non-code contributions are just as welcome: reporting bugs, writing feature requests, and improving the docs.

## Development

KapAble is an Electron app.

**Prerequisites:** Node.js 24 (the `engines` field pins `>=24 <26` and
`engine-strict` is on, so a different major will refuse to install), git, and a
C++ toolchain for the native modules `better-sqlite3` and `node-pty`.

**Install dependencies:**

```sh
npm install
```

`npm install` also downloads an Electron binary, a bundled git for `dugite`,
and a ripgrep binary for `@vscode/ripgrep`, so the first install needs network
access.

**Create the userData directory (required for database)**

```sh
# Unix/macOS/Linux:
mkdir -p userData

# Windows PowerShell (run only if folder doesn't exist):
mkdir userData

# Windows Command Prompt (run only if folder doesn't exist):
md userData
```

**Generate DB migrations:**

If you change the DB schema (i.e. `src/db/schema.ts`), you will need to generate a DB migration.

```sh
npm run db:generate
```

> If you want to discard a DB migration, you will likely need to reset your database which you can do by deleting the file in `userData/sqlite.db`.

**Run locally:**

```sh
npm start
```

## Setup

If you'd like to contribute a pull request, we highly recommend setting the pre-commit hooks which will run the formatter and linter before each git commit. This is a great way of catching issues early on without waiting to run the GitHub Actions for your pull request.

Simply run this once in your repo:

```sh
npm run init-precommit
```

## Testing

### Unit tests

```sh
npm test
```

### E2E tests

Build the app for E2E testing:

```sh
npm run build
```

> Note: you only need to re-build the app when changing the app code. You don't need to re-build the app if you're just updating the tests.

Run the whole e2e test suite:

```sh
npm run e2e
```

Run a specific test file:

```sh
npm run e2e e2e-tests/context_manage.spec.ts
```

Update snapshots for a test:

```sh
npm run e2e e2e-tests/context_manage.spec.ts -- --update-snapshots
```

## Code reviews

KapAble relies on several AI code reviewers to catch issues. If a comment is irrelevant please leave a brief comment and mark the comment as resolved.

You can also do local code reviews with the following tools:

- Codex CLI - `codex` -> `/review`
- Claude Code CLI - `claude` -> `/review`

## Merging changes from upstream Dyad

KapAble is a fork of [Dyad](https://github.com/dyad-sh/dyad). To pull upstream
changes in, merge them and then re-apply the rebrand:

```sh
git merge upstream/main
python3 scripts/rebrand/rebrand.py
python3 scripts/rebrand/relink_docs.py
npm run fmt && npm run ts && npm test
```

Both scripts are idempotent. See
[`scripts/rebrand/README.md`](./scripts/rebrand/README.md) for what they
deliberately leave on upstream identifiers, and for the `rebrand:keep` marker
that exempts a line naming Dyad on purpose.

Afterwards, check that nothing reintroduced a hard-coded hosted endpoint:

```sh
git grep -n "kapable\.sh"   # should only match comments
```

Hosted services belong in
[`src/constants/brand.ts`](./src/constants/brand.ts), not as literals.
