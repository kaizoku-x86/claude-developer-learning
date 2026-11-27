"""Fail-closed export of reviewed files from the private study repository.

Copy approved *file contents*, not commits or Git history. The public repository
and its quizzes, site configuration and licensing remain independently managed.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

APPROVED = (
    "docs/00-general-glossary.md",
    "docs/01-glossary.md",
    "docs/01-messages-api.md",
    "docs/02-glossary.md",
    "docs/02-prompting-agents-tools.md",
    "docs/02-structured-outputs.md",
    "docs/03-claude-code-mcp.md",
    "docs/03-claude-products.md",
    "docs/03-glossary.md",
    "docs/04-glossary.md",
    "docs/04-production-evals-security.md",
    "docs/05-accelerators-ip.md",
    "docs/05-glossary.md",
    "docs/07-architecture-case.md",
    "docs/assets/stylesheets/extra.css",
    "fixtures/incidents.json",
    "labs/__init__.py",
    "labs/lab01_api.py",
    "labs/lab02_agent.py",
    "labs/lab03_mcp.py",
    "labs/lab05_evals.py",
    "labs/lab06_security.py",
    "labs/lab08_prompt_validation.py",
    "labs/lab09_message_inspection.py",
    "tests/test_agent.py",
    "tests/test_study_examples.py",
)

BLOCKED = re.compile(
    r"(?:docs/)?notebooks/|00-pending-to-review\.md|"
    r"kaizoku-x86/claude-certified-developer-foundations|"
    r"(?i:BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY)|"
    r"(?i:sk-ant-[a-z0-9_-]{16,})|"
    r"(?i:password\s*[:=]\s*['\"][^'\"]+)",
)

REWRITES: dict[str, tuple[tuple[str, str], ...]] = {
    "docs/00-general-glossary.md": (
        ("- [Technical verification register (private study notebook)](notebooks/00-pending-to-review.md)\n", ""),
        ("Source: learner notes. Editorial corrections are described in their corresponding module pages.",
         "Definitions are maintained in the individual module guides; consult the linked official technical references for current API behavior."),
    ),
    "docs/02-prompting-agents-tools.md": (
        ("Notebook scenario:", "Scenario:"),
        ("The initial notebook defines `get_pod_logs` with", "Consider a tool `get_pod_logs` with"),
        ("These are **original practice scenarios based on the learner's watch-out example**, not questions taken from an official certification exam.",
         "These are **original practice scenarios**, not questions taken from an official certification exam."),
        ("Related learner notes: [Tool Use and Schema Design notebook](notebooks/02-tool-use-and-schema-design.md).\n", ""),
        ("## Lab ideas from the notebooks", "## Lab ideas"),
        ("The [Prompting Craft notebook](notebooks/02-prompting-craft.md) identifies a system prompt that requests extraction but does not specify the required format.",
         "A checkpoint scenario starts with a system prompt that requests extraction but does not specify the required format."),
    ),
    "docs/02-structured-outputs.md": (
        ("**Source:** the learner's [Structured Outputs notebook](notebooks/02-structured-outputs.md), including the 24-hour grammar-caching question. **References:**",
         "**References:**"),
        (" This is a curated explanation; the learner's original reasoning is tracked separately.", ""),
    ),
}


def public_version(path: str, content: str) -> str:
    if path not in APPROVED:
        raise ValueError(f"Not on publication allowlist: {path}")

    if path.endswith(".md"):
        for old, new in REWRITES.get(path, ()):
            content = content.replace(old, new)
        content = re.sub(r"(?<![(<])https?://[^\s)>,]+", lambda m: f"<{m.group(0)}>", content)
        if path == "docs/02-prompting-agents-tools.md":
            content = re.sub(r"^\*\*(Scenario [1-4] — [^\n*]+)\*\*$", r"#### \1", content, flags=re.M)
            content = re.sub(r"\n{3,}", "\n\n", content)
        content = content.rstrip() + "\n"

    if BLOCKED.search(content):
        raise ValueError(f"Sensitive or internal reference detected in {path}")
    return content


def export(source: Path, destination: Path, apply: bool = False) -> list[str]:
    changes: dict[str, str] = {}
    for path in APPROVED:
        src = source / path
        dest = destination / path
        if src.is_symlink() or not src.is_file():
            raise ValueError(f"Missing, symlinked, or unsupported source: {path}")
        content = public_version(path, src.read_text(encoding="utf-8"))
        existing = dest.read_text(encoding="utf-8") if dest.exists() else None
        if existing != content:
            changes[path] = content

    # Validate *every* output before writing *any* output.
    if apply:
        for path, content in changes.items():
            dest = destination / path
            if dest.is_symlink():
                raise ValueError(f"Refusing to overwrite symlink: {path}")
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(content, encoding="utf-8")
    return list(changes)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Path to checked-out private repository")
    parser.add_argument("--destination", type=Path, default=Path("."), help="Path to public repository")
    parser.add_argument("--apply", action="store_true", help="Write reviewed changes; default is dry-run")
    args = parser.parse_args()
    changes = export(args.source.resolve(), args.destination.resolve(), args.apply)
    print(("Updated" if args.apply else "Would update") + f" {len(changes)} allowed file(s)")
    for path in changes:
        print(f"- {path}")


if __name__ == "__main__":
    main()
