# Private-to-Public Publication Policy

The public repository is maintained independently of the private study workspace. Only explicitly approved and independently reviewable educational assets may be synchronized.

## Approved source

`kaizoku-x86/claude-certified-developer-foundations` on `master`.

## Exact allowlist

Copy these source files into the **same relative paths** in this public repository after a content and link review:

- `docs/00-general-glossary.md`
- `docs/01-glossary.md`
- `docs/01-messages-api.md`
- `docs/02-glossary.md`
- `docs/02-prompting-agents-tools.md`
- `docs/02-structured-outputs.md`
- `docs/03-claude-code-mcp.md`
- `docs/03-claude-products.md`
- `docs/03-glossary.md`
- `docs/04-glossary.md`
- `docs/04-production-evals-security.md`
- `docs/05-accelerators-ip.md`
- `docs/05-glossary.md`
- `docs/07-architecture-case.md`
- `docs/assets/stylesheets/extra.css`
- `fixtures/incidents.json`
- `labs/__init__.py`
- `labs/lab01_api.py`
- `labs/lab02_agent.py`
- `labs/lab03_mcp.py`
- `labs/lab05_evals.py`
- `labs/lab06_security.py`
- `labs/lab08_prompt_validation.py`
- `labs/lab09_message_inspection.py`
- `tests/test_agent.py`
- `tests/test_study_examples.py`

Never copy other files merely because they are within `docs/`, `labs/`, or `tests/`.

## Explicit exclusions

- **Never** copy `docs/notebooks/`, review registers, `CLAUDE.md`, `.env*`, private root README, private MkDocs settings, private CI workflows, Git metadata, commit messages, issues, pull requests, or private revision history.
- Do not copy references or links to excluded notebook documents; rewrite explanatory prose for the public audience and use publicly accessible official references.
- Do not copy third-party course text, question banks, copyrighted exam questions, credential material, internal services, customer data, or personal study progress.
- Treat every changed source file as **unreviewed** until checked; do not publish files containing private content or unresolved sensitive references.
- Keep the public site's `docs/index.md`, `docs/modules/`, `docs/quizzes/`, `docs/labs.md`, `README.md`, `mkdocs.yml`, workflows, and license files **public-owned**. Never overwrite them from the private source.
- Publication changes must be forward-only and use a new public commit. **Never** merge/fork/push the private branch or its Git history.
- If validation fails or content is ambiguous, skip the affected file(s), do not force publication, and report the blocker.

## Publication checks

1. Compare exact allowed source files with their public variants; apply the explicitly documented public wording adaptations.
2. Scan for `docs/notebooks`, `notebooks/`, private links, credentials, secrets and sensitive identifiers; a match must be resolved before publishing.
3. Check relative Markdown links and official sources; ensure there is no reference to files absent from the public repository.
4. Check GitHub Actions results: Python unit tests, strict MkDocs build, Markdown lint.
5. Commit only changed approved files. Preserve public-authored quizzes and guides.
6. Keep a brief public commit message, with no private commit SHAs or private study details.

This document is the source-of-truth policy for automated synchronization. Changes to the allowlist or publication boundaries require explicit user authorization.
