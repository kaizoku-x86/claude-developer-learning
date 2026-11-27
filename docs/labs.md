# Hands-on Labs

This repository includes small Python exercises. Unless noted otherwise, they use **fictional incident data** and require no API key or production infrastructure.

## Setup

```bash
python -m pip install -r requirements-labs.txt
python -m pytest -q
```

Install optional API/MCP dependencies only for labs that require them:

```bash
python -m pip install -r requirements-api.txt
```

## Available labs

| Lab | File | Topic | Runtime |
|---|---|---|---|
| 01 | `labs/lab01_api.py` | Messages API request and response handling | Anthropic API key and model ID required |
| 02 | `labs/lab02_agent.py` | Agent tool-use loop and result IDs | Offline |
| 02A | `labs/lab02_tool_selection.py` | Explicit routing boundaries | Offline |
| 03 | `labs/lab03_mcp.py` | MCP server exposing a fictional incident catalog | Local MCP-compatible client |
| 05 | `labs/lab05_evals.py` | Evaluation metrics and deliberate regression | Offline |
| 06 | `labs/lab06_security.py` | Authorization and untrusted logs | Offline |
| 08 | `labs/lab08_prompt_validation.py` | Prompt output and JSON validation | Offline |
| 09 | `labs/lab09_message_inspection.py` | Stop reasons and text blocks | Offline |

**Watch out:** Lab 05 deliberately fails an assertion when run as a standalone script; use the example to investigate the evaluation failure. The unit tests themselves assert the expected failure metrics.

## Practice extension

Extend the tool-selection simulator with a scenario where older session context has been truncated. Verify that your application does not pretend to know information that was never supplied and does not bypass backend access checks.

All fixtures are fictional. No real customer incidents or production cluster credentials are included.
