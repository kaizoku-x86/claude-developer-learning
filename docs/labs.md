# Offline Labs

Labs run locally with fictional data and do not require an API key.

## Lab 02 — Tool routing and schema boundaries

The sample in `labs/lab02_tool_selection.py` implements a small deterministic routing policy that demonstrates **in-context vs external information** as separate tool choices. It is deliberately *not* a Claude implementation.

Run the lab and tests:

```bash
python labs/lab02_tool_selection.py
python -m pytest -q
```

Extend it with a new scenario in which context is truncated. Add assertions that the selected tool does not exceed the caller's permissions.
