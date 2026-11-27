# Public Release Checklist

This is a **new public repository**, not a fork, mirror, or branch of a personal study workspace.

- [x] Independently initialized Git history with no private notebook commits.
- [x] Added MIT licensing for code and CC BY 4.0 for original educational content.
- [x] Published only the allowlisted curated documents, fictional labs and tests.
- [x] Removed source references to personal notebooks and review ledgers from published guides.
- [ ] Verify automated CI checks remain green after each publication.
- [ ] Enable GitHub Pages in repository settings and verify the public URL.
- [ ] Check that public quizzes do not send personal results to a centralized server.

Before every future publication:

- [ ] Verify text, code, links, and images for copyright, privacy and confidential information.
- [ ] Confirm questions are independently authored, not copied from restricted course lessons or official exams.
- [ ] Never transfer private notebooks, review ledgers, draft notes or Git history.
- [ ] Inspect changed docs for links to private content, credentials or confidential identifiers.
- [ ] Check fictional fixtures do not contain production endpoints or secrets.
- [ ] Verify `mkdocs build --strict`, Python tests and Markdown lint.

See [PUBLICATION_POLICY.md](PUBLICATION_POLICY.md) for the exact approved source-file allowlist and publication boundaries.
