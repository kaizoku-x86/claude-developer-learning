# Claude Developer Learning Hub

An **independent, community-maintained study resource** for Claude development: technical guides, offline labs, and interactive practice quizzes.

This project is not affiliated with or endorsed by Anthropic. Questions are independently authored for practice; they are not official certification questions.

## What's included

- Curated technical documentation with official references
- Interactive quizzes with answer explanations
- Reproducible offline labs and Python tests
- A static documentation site built with MkDocs

## Develop locally

```bash
python -m pip install -r requirements-docs.txt -r requirements-labs.txt
python -m mkdocs serve
python -m pytest -q
```

Visit <http://127.0.0.1:8000/> to explore the learning site.

## Publishing and contribution policy

This is a new public repository with independent Git history. Never copy private notes, verification logs, credentials, or material from restricted courses. Publish only reviewed and original material.

Study content and exercises are in English. Prefer practical scenarios, clear explanations, and references to official documentation. A community license will be selected before accepting external contributions.

To enable GitHub Pages, choose **Settings → Pages → Build and deployment → Source: GitHub Actions**, then run the deployment workflow.

See [PUBLICATION_CHECKLIST.md](PUBLICATION_CHECKLIST.md) before publishing new material.
