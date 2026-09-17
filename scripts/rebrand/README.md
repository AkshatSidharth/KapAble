# Rebrand scripts

One-shot migration scripts used to turn the imported Dyad tree into KapAble.
They are kept so the rebrand can be re-applied when merging changes from
upstream, and so the rules behind it are auditable rather than folklore.

Both are idempotent: re-running them on an already-rebranded tree is a no-op.

## `rebrand.py`

Renames file contents and paths. Casing policy:

| Input                               | Output    | Used for                                            |
| ----------------------------------- | --------- | --------------------------------------------------- |
| `dyad`                              | `kapable` | identifiers, tags, paths, env fragments             |
| `DYAD`                              | `KAPABLE` | constants and environment variables                 |
| `Dyad` adjacent to a word character | `Kapable` | compound identifiers (`DyadError` → `KapableError`) |
| `Dyad` standing alone               | `KapAble` | the product name in user-facing copy                |

It deliberately preserves identifiers that are **external contracts**, not
branding — see `PROTECTED_LITERALS` and `PROTECTED_PATTERNS` in the script:

- the `@dyad-sh` npm scope (packages resolved from the registry);
- `data-dyad-id` / `data-dyad-name` / `data-dyad-runtime-id`, injected into
  generated apps by the published component tagger and read back by the preview
  component selector, visual editor and test recorder;
- the `dyad-sh/*` starter template repositories cloned at runtime;
- numbered upstream PR, issue and CI links, kept as accurate provenance;
- the Dyad Tech, Inc. copyright, which Apache-2.0 requires be retained.

Lockfiles are skipped entirely, because npm integrity hashes are base64 and can
contain the substring `dyad`; rewriting one would corrupt it. The handful of
real name fields in `package-lock.json` were patched by hand instead.

## `relink_docs.py`

Remaps in-app "learn more" links from the upstream documentation site onto the
matching section of `docs/README.md` in this repository.

## Re-applying after an upstream merge

```bash
git merge upstream/main          # expect conflicts on renamed paths
python3 scripts/rebrand/rebrand.py
python3 scripts/rebrand/relink_docs.py
npm run fmt && npm run ts && npm test
```

Then check for newly introduced hard-coded endpoints:

```bash
git grep -n "kapable\.sh"        # should return nothing
```

Anything that does turn up belongs in `src/constants/brand.ts` as a configurable
service, not as a literal.
