# Module 4 — Governance, Evaluation, and Security

Learner notes reorganized from `Glosary.docx`.

## Core concepts

- **Human-in-the-loop:** require human review or approval when consequences warrant it.
- **Least privilege:** give users, agents, and tools only the required permissions.
- **Governance:** security, privacy, traceability, and approval policies.
- **Escalation:** hand off work when risk, uncertainty, or complexity requires it.
- **Connectors:** integrate external sources while respecting authorization boundaries.
- **Model-graded judge:** evaluate model outputs using another model and an explicit rubric; calibrate against labeled cases and human review rather than assuming infallibility.
- **Evaluation:** compare behavior against requirements before deployment and after model or prompt changes.
- **Monitoring:** track failures, cost, latency, and quality in production.

## Key distinctions

- Grounding is not verification.
- Prompting is not access control.
- Automation does not necessarily mean autonomy.
- Self-reported confidence is not evidence of accuracy.
- Evaluation does not replace monitoring.

## Examples and tests

- `python labs/lab08_prompt_validation.py` validates structure, types, and fields but **does not independently prove a diagnosis is factually correct**.
- `python labs/lab05_evals.py` contains an intentionally incorrect critical-case classification to show how overall accuracy can hide serious failures in high-risk cases.

## Review questions

1. An answer cites an irrelevant page. Is it trustworthy just because it has a citation? **No; verify that the evidence supports the claim.**
2. A read-only agent proposes restarting a deployment. May it do so? **No; backend authorization must prevent the action.**
3. Overall accuracy is 95%, but critical incidents have a high failure rate. What should be prioritized? **Segmented, risk-weighted metrics and safeguards for critical cases.**
4. A model was evaluated before deployment. Why monitor it afterward? **Drift, operational incidents, latency, cost, and data changes.**

References:

- https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
