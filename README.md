# Claude Developer Learning Hub

Independent, community-maintained study resources for Claude development: curated reference guides, reproducible labs and interactive practice quizzes.

**Not official Anthropic certification content.** This project is not affiliated with or endorsed by Anthropic; practice questions are independently authored.

## Explore

- [Complete study guide](https://kaizoku-x86.github.io/claude-developer-learning/)
- [Module 2 — Tool Use and Agents](docs/02-prompting-agents-tools.md)
- [Interactive quizzes](docs/quizzes/index.md)
- [Offline and API labs](docs/labs.md)

## Local setup

```bash
python -m pip install -r requirements-docs.txt -r requirements-labs.txt
python -m pytest -q
python -m mkdocs serve
```

Visit <http://127.0.0.1:8000/>. API and MCP-specific labs have optional dependencies in `requirements-api.txt`.

## Content policy

Only reviewed and explicitly allowlisted materials are published from the separate private study workspace. Personal notebooks, verification registers and Git history are never transferred. The original practice questions and public guides can be edited independently of that source.

See [Publication Policy](PUBLICATION_POLICY.md), [Publication Checklist](PUBLICATION_CHECKLIST.md) and [Contribution Guide](CONTRIBUTING.md).

## License

- **Software, labs, tests and configuration:** [MIT](LICENSE).
- **Original educational guides, glossary text and practice questions:** [Creative Commons Attribution 4.0 International](LICENSE-DOCS.md).
- Linked external works retain their own terms.

## GitHub Pages

Enable **Settings → Pages → Build and deployment → GitHub Actions**. The repository's Pages workflow will then deploy the MkDocs site from `master`.
