# Capstone — AI Incident Triage

Design an assistant that receives synthetic Kubernetes alerts, reads deployment status and logs, and proposes mitigations. It must **not execute changes**.

## Deliverables

1. Component diagram, trust boundaries, and agent-loop flow.
2. `get_incident` and `get_pod_logs` schemas; identity and authorization controls.
3. Strategy for tool failures, timeouts, token budgets, and maximum agent iterations.
4. Evaluation set with at least 10 cases, including prompt injection and false positives.
5. Cost model, logs, traces, alerts, and approval workflow for changes.

## Scoring rubric (100 points)

- Architecture: 20; security: 25; reliability: 20; evaluation: 20; operations: 15.
- Mandatory requirements: no cluster writes, no exposed secrets, authorized tool calls, and no infinite retries.
- Target score: **at least 85 points** while meeting every mandatory requirement.
