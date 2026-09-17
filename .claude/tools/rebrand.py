#!/usr/bin/env python3
"""Rebrand the imported dyad tree to KapAble.

Casing policy:
  dyad              -> kapable          (identifiers, tags, paths, env fragments)
  DYAD              -> KAPABLE          (constants / env vars)
  Dyad (in-word)    -> Kapable          (e.g. DyadError -> KapableError)
  Dyad (standalone) -> KapAble          (display/product name)

Anything in PROTECTED_LITERALS is an external contract (published npm package
ids, attributes emitted by a third-party plugin, remote template repos,
upstream provenance links, legal attribution) and is restored verbatim.
"""

import os
import re
import subprocess
import sys

ROOT = "/home/user/KapAble"

# --- Files never rewritten -------------------------------------------------
# Lockfiles hold base64 integrity hashes that can legitimately contain the
# substring "dyad"; rewriting them would corrupt the hash. They are patched
# surgically afterwards. License/attribution files must stay verbatim.
SKIP_EXACT = {
    "LICENSE",
    "NOTICE",
    "src/pro/LICENSE",
    "packages/@dyad-sh/react-vite-component-tagger/LICENSE",
    "packages/@dyad-sh/nextjs-webpack-component-tagger/LICENSE",
}
SKIP_SUFFIX = ("package-lock.json", "pnpm-lock.yaml", "yarn.lock")
# Vendored copies of packages published to npm under the @dyad-sh scope. Their
# id and docs describe the *published* artifact, so they are left alone.
SKIP_PREFIX = ("packages/@dyad-sh/",)

# --- Literals that must survive the rename ---------------------------------
PROTECTED_LITERALS = [
    # Published npm packages resolved from the registry (and their scope dir).
    "@dyad-sh",
    # Attributes injected by @dyad-sh/*-component-tagger into user apps and
    # read back by the preview component selector / visual editor / recorder.
    "data-dyad-id",
    "data-dyad-name",
    "data-dyad-",
    # Remote starter templates cloned at runtime; not ours to rename.
    "dyad-sh/nextjs-template",
    "dyad-sh/react-vite-nitro",
    "dyad-sh/portal-mini-store-template",
    # Upstream community / provenance links.
    "r/dyadbuilders",
    "x.com/dyad_sh",
    "deepwiki.com/dyad-sh/dyad",
    # Copyright holder - Apache-2.0 requires the notice be preserved.
    "Dyad Tech, Inc.",
    "Dyad contributors",
]

# Upstream provenance links (PRs / numbered issues / CI runs) stay accurate
# rather than being rewritten into KapAble references that never existed.
PROTECTED_PATTERNS = [
    re.compile(r"github\.com/dyad-sh/dyad/pull/\d+(?:#\w+)?"),
    re.compile(r"github\.com/dyad-sh/dyad/issues/\d+(?:#[\w-]+)?"),
    re.compile(r"github\.com/dyad-sh/dyad/actions/runs/\d+"),
]

SENTINEL = "\x00PROT{}\x00"


def protect(text):
    saved = []

    def stash(match):
        saved.append(match.group(0))
        return SENTINEL.format(len(saved) - 1)

    for pat in PROTECTED_PATTERNS:
        text = pat.sub(stash, text)
    for lit in PROTECTED_LITERALS:
        text = re.sub(re.escape(lit), stash, text)
    return text, saved


def restore(text, saved):
    for i, val in enumerate(saved):
        text = text.replace(SENTINEL.format(i), val)
    return text


WORD = r"[A-Za-z0-9_]"


def rename_text(text):
    text, saved = protect(text)
    text = text.replace("DYAD", "KAPABLE")
    # "Dyad" glued to another word character on either side is an identifier.
    text = re.sub(rf"(?<={WORD})Dyad", "Kapable", text)
    text = re.sub(rf"Dyad(?={WORD})", "Kapable", text)
    # What is left is the standalone product name.
    text = text.replace("Dyad", "KapAble")
    text = text.replace("dyad", "kapable")
    return restore(text, saved)


def rename_path_component(name):
    """Paths stay lowercase-ish; never emit the display spelling in a filename."""
    name, saved = protect(name)
    name = name.replace("DYAD", "KAPABLE")
    name = name.replace("Dyad", "Kapable")
    name = name.replace("dyad", "kapable")
    return restore(name, saved)


def is_binary(path):
    try:
        with open(path, "rb") as fh:
            return b"\0" in fh.read(8192)
    except OSError:
        return True


def tracked_files():
    out = subprocess.run(
        ["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, check=True
    ).stdout
    return [p.decode() for p in out.split(b"\0") if p]


def main():
    files = tracked_files()
    changed_content = 0

    for rel in files:
        if rel in SKIP_EXACT or rel.endswith(SKIP_SUFFIX) or rel.startswith(SKIP_PREFIX):
            continue
        abs_path = os.path.join(ROOT, rel)
        if not os.path.isfile(abs_path) or os.path.islink(abs_path):
            continue
        if is_binary(abs_path):
            continue
        with open(abs_path, "r", encoding="utf-8", errors="surrogateescape") as fh:
            original = fh.read()
        if "dyad" not in original.lower():
            continue
        updated = rename_text(original)
        if updated != original:
            with open(abs_path, "w", encoding="utf-8", errors="surrogateescape") as fh:
                fh.write(updated)
            changed_content += 1

    print(f"content rewritten in {changed_content} files")

    # --- path renames ------------------------------------------------------
    # Rename shallowest dyad-bearing path component first and re-list after
    # every move, so parent renames never invalidate the queued child paths.
    renamed = 0
    while True:
        target = None
        for rel in tracked_files():
            if rel.startswith(SKIP_PREFIX):
                continue
            parts = rel.split("/")
            for depth, part in enumerate(parts):
                if "dyad" not in part.lower():
                    continue
                new_part = rename_path_component(part)
                if new_part == part:
                    continue
                old_rel = "/".join(parts[: depth + 1])
                new_rel = "/".join(parts[:depth] + [new_part])
                target = (old_rel, new_rel)
                break
            if target:
                break
        if not target:
            break
        old_rel, new_rel = target
        src, dst = os.path.join(ROOT, old_rel), os.path.join(ROOT, new_rel)
        if not os.path.exists(src) or os.path.exists(dst):
            raise SystemExit(f"cannot rename {old_rel} -> {new_rel}")
        subprocess.run(["git", "mv", old_rel, new_rel], cwd=ROOT, check=True)
        renamed += 1

    print(f"renamed {renamed} paths")
    return 0


if __name__ == "__main__":
    sys.exit(main())
