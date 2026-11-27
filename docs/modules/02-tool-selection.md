# Module 2 — Tool Selection and Schema Design

## Tool descriptions are decision boundaries

Tool descriptions should specify **when to use** a tool and **when not to use it**. Two tools that both promise to “find information” may be difficult to distinguish if their descriptions do not explain which information source to consult.

| Tool | Use when | Avoid when |
|---|---|---|
| `search_docs` | The answer requires documentation absent from the current context. | The answer is already available in the supplied session context. |
| `get_context_summary` | The needed information is available in retained session history. | The answer needs new external information. |

**The failure is often a tool-description issue, not an argument-schema issue.** `strict: true` can constrain tool arguments, but it does not by itself define which of two semantically overlapping tools is appropriate.

## The application owns the loop

For client-side tools, a model can request a `tool_use` call; the application validates and executes the operation, returns a matching `tool_result`, and sends a subsequent API request. The tool's schema does not grant the user permission to execute it.

## Official references

- [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
- [Structured Outputs and Strict Tool Use](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
