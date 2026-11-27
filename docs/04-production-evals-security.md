# Module 4 — Production Engineering, Evals, and Security

## Evals

- Use a representative dataset with ground truth and adversarial scenarios.
- Track metrics by class and severity, not only aggregate accuracy.
- Regression tests compare changes in prompts, models, and tools.
- An LLM-as-judge needs explicit criteria and calibration against human-reviewed examples.

## Security

- Enforce least privilege and isolate read-only tools.
- Treat logs, files, and tool results as untrusted inputs because they may contain prompt injection.
- Validate inputs, constrain outputs, minimize data access, redact secrets, and audit actions.
- Use timeouts, bounded retries, observability, and escalation paths.

## Practice

Run `python labs/lab05_evals.py` and `pytest -q tests/`. The evaluation contains an intentional failure that should be diagnosed before being fixed.
