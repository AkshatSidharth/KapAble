#!/usr/bin/env python3
"""Point in-app help links at KapAble's own docs.

Upstream deep-linked into dyad.sh's documentation site. The rebrand turned
those into kapable.sh URLs, a domain this fork does not own, so every "learn
more" in the product was a dead link. Each one is remapped onto the matching
section of docs/README.md, which ships in the repo.
"""

import os
import re
import subprocess

import pathlib

ROOT = str(pathlib.Path(__file__).resolve().parents[2])
DOCS = "https://github.com/AkshatSidharth/KapAble/blob/main/docs/README.md"
RELEASES = "https://github.com/AkshatSidharth/KapAble/releases"

# Longest patterns first: the bare /docs entry must not shadow the deep links.
MAPPING = [
    ("https://www.kapable.sh/docs/guides/migrate-restore#restoring-settings-from-backup", f"{DOCS}#backup-and-restore"),
    ("https://www.kapable.sh/docs/guides/large-apps#manual-context-management", f"{DOCS}#context-management-for-large-apps"),
    ("https://www.kapable.sh/docs/templates/portal#create-a-database-migration", f"{DOCS}#templates"),
    ("https://www.kapable.sh/docs/guides/ai-models/pro-modes#smart-context", f"{DOCS}#context-management-for-large-apps"),
    ("https://www.kapable.sh/docs/integrations/github#troubleshooting", f"{DOCS}#github"),
    ("https://kapable.sh/docs/integrations/supabase#no-publishable-keys", f"{DOCS}#supabase"),
    ("https://www.kapable.sh/docs/guides/ai-models/custom-models", f"{DOCS}#custom-and-local-models"),
    ("https://kapable.sh/docs/guides/mobile-app#upgrade-your-app", f"{DOCS}#upgrades"),
    ("https://kapable.sh/docs/guides/mobile-app#troubleshooting", f"{DOCS}#mobile-apps"),
    ("https://www.kapable.sh/docs/guides/security-review", f"{DOCS}#security-review"),
    ("https://kapable.sh/docs/policies/privacy-policy", f"{DOCS}#privacy-and-telemetry"),
    ("https://kapable.sh/docs/upgrades/select-component", f"{DOCS}#upgrades"),
    ("https://kapable.sh/docs/upgrades/pnpm-migration", f"{DOCS}#upgrades"),
    ("https://kapable.sh/docs/templates/add-template", f"{DOCS}#templates"),
    ("https://www.kapable.sh/docs/help#report-a-bug", f"{DOCS}#reporting-a-bug"),
    ("https://kapable.sh/docs/help/ai-rate-limit", f"{DOCS}#ai-rate-limits"),
    ("https://www.kapable.sh/docs/faq", f"{DOCS}#faq"),
    ("https://www.kapable.sh/docs", DOCS),
    ("https://kapable.sh/docs", DOCS),
]

# Release notes were served per-version by the docs site; point at GitHub
# releases instead.
RELEASE_PATTERN = re.compile(r"https://www\.kapable\.sh/docs/releases/?")


def main():
    files = subprocess.run(
        ["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, check=True
    ).stdout
    files = [p.decode() for p in files.split(b"\0") if p]

    changed = 0
    for rel in files:
        path = os.path.join(ROOT, rel)
        if not os.path.isfile(path) or os.path.islink(path):
            continue
        try:
            with open(path, "r", encoding="utf-8") as fh:
                text = fh.read()
        except (UnicodeDecodeError, OSError):
            continue
        if "kapable.sh/docs" not in text:
            continue
        original = text
        text = RELEASE_PATTERN.sub(f"{RELEASES}/tag/v", text)
        for old, new in MAPPING:
            text = text.replace(old, new)
        if text != original:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(text)
            changed += 1
    print(f"relinked {changed} files")


if __name__ == "__main__":
    main()
