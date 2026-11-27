"""Validate that the public site does not include private notebook sources."""
from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
FORBIDDEN = re.compile(
    r"(?i:(?:docs/)?notebooks/|00-pending-to-review\.md|"
    r"BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|sk-ant-[a-z0-9_-]{16,})"
)


def main() -> None:
    if not DOCS.is_dir():
        raise SystemExit("docs directory missing")
    for path in DOCS.rglob("*"):
        if path.is_symlink():
            raise SystemExit(f"Symlink not allowed in public docs: {path.relative_to(ROOT)}")
        if path.is_file() and path.suffix.lower() == ".md":
            if FORBIDDEN.search(path.read_text(encoding="utf-8")):
                raise SystemExit(f"Forbidden private material reference: {path.relative_to(ROOT)}")
        if "notebooks" in path.parts:
            raise SystemExit(f"Private notebook path in public docs: {path.relative_to(ROOT)}")
    print("Public docs: no private notebook paths or references found.")


if __name__ == "__main__":
    main()
