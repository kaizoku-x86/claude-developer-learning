# Glossary — Claude Certified Developer Foundations

This is not a transcript of the official certification examination.

## API, models, and execution

| Term | Definition |
|---|---|
| Token | A model representation and usage-accounting unit; characters and tokens do not map one-to-one. |
| Context window | The maximum supported context capacity for input and generated output, depending on model and mode. |
| Sampling | Selecting tokens according to a probability distribution. |
| Temperature | A sampling parameter on supported models/API versions; lower values favor high-probability tokens rather than making the distribution uniform. |
| Non-determinism | Equivalent requests can produce different outputs. |
| Model selection | Comparing quality, cost, latency, and operational requirements against representative workloads. |
| SDK vs REST | An SDK wraps HTTP API calls; it does not bypass REST, validation, or error handling. |
| Synchronous | Waiting for the complete API response. |
| Streaming | Processing incremental events, generally via Server-Sent Events (SSE). |
| Async/await | An asynchronous programming interface, distinct from batch processing. |
| Message Batches API | Sending multiple independent API requests for asynchronous processing and retrieving their results later. |

## Prompting

| Term | Definition |
|---|---|
| Hallucination | Unsupported or false information presented as fact. |
| Grounding | Connecting an answer to supplied or retrieved evidence. |
| Prompt iteration | Changing a particular aspect of a prompt and comparing results on an evaluation set. |
| Task decomposition | Breaking a complex task into testable steps. |
| Zero-shot | An instruction with no examples. |
| One-shot | A single example. |
| Few-shot / multi-shot | Several representative examples that may improve behavior but consume context and require evaluation. |
| Model-graded judge | A model applying a grading rubric, ideally calibrated against independently verified examples or human review. |

## Products, risk, and operations

| Term | Definition |
|---|---|
| Claude Projects | Shared project-level instructions and knowledge. |
| Artifacts | Generated deliverables and selected interactive prototypes. |
| Connectors | Permission-controlled access to external data and tools. |
| Human-in-the-loop | Human review or approval when risk justifies it. |
| Least privilege | Granting only the data access and operations needed for a task. |
| Governance | Policies for privacy, approval, accountability, and auditability. |
| Escalation | Handing off a task when the system cannot safely resolve it. |
| Evaluation | Testing behavior against predefined cases and criteria. |
| Monitoring | Observing a deployed system to detect failures and performance degradation. |

## Five exam distinctions

- **Grounding ≠ verification:** citations do not guarantee that a source supports a claim.
- **Prompting ≠ access control:** instructions do not replace technical authorization.
- **Automation ≠ autonomy:** automated sequences do not necessarily need an agent.
- **Model confidence ≠ factual accuracy:** expressed confidence is not evidence.
- **Evaluation ≠ monitoring:** predeployment testing and production observability are different activities.

## Study map

- [Module 1 glossary — API, models, and limits](01-glossary.md)
- [Module 2 glossary — Prompting and debugging](02-glossary.md)
- [Module 3 glossary — Integration, MCP, and Claude products](03-glossary.md)
- [Module 4 glossary — Evals and governance](04-glossary.md)
- [Module 5 glossary — Reuse and IP](05-glossary.md)

Definitions are maintained in the individual module guides; consult the linked official technical references for current API behavior.

## Structured Outputs and prompting techniques

| Term | Definition |
|---|---|
| [System prompt](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | Role and behavior instructions that apply to a request. |
| [XML tags](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | Delimiters separating sections of a prompt. |
| [Output constraints](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | Explicit output requirements; they are not a structural guarantee. |
| [Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | Schema-constrained generation mechanisms. |
| [JSON outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | Final response format configured through `output_config.format`. |
| [Strict Tool Use](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | Tool arguments conforming to a compatible input schema. |
| [Grammar-constrained sampling](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | Token generation restricted by a grammar derived from a schema. |

**Schema conformance ≠ semantic correctness ≠ authorization.**

## Additional Structured Outputs concepts

| Concept | Key takeaway | Reference |
|---|---|---|
| **Grammar compilation** | Turns compatible schemas into a generation grammar; initial compilation can add latency. | [Anthropic](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) |
| **Grammar cache** | Cached for 24 hours **from the last use**; structural changes can invalidate it. | [Anthropic](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) |
| **Schema limitations** | Not every JSON Schema rule is grammar-enforced; validate additional constraints in code. | [Anthropic](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) |
| **Assistant Message Prefilling** | Supplying the start of an assistant response; incompatible with `output_config.format` and unsupported by certain newer models. | [Anthropic](https://platform.claude.com/docs/en/build-with-claude/working-with-messages) |
| **Refusal / max_tokens** | `stop_reason: "refusal"` or `"max_tokens"` may prevent a complete schema-conformant response. | [Anthropic](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) |

[Detailed explanations and examples](02-structured-outputs.md).

## Module 3 — Integration, MCP, and Claude products

| Term | Definition |
|---|---|
| Claude Code | Coding assistant and development workflow using project context and tools. |
| CLAUDE.md | Project instruction file for Claude Code; not a permissions mechanism. |
| MCP (Model Context Protocol) | Protocol that connects applications and assistants to external capabilities and context. |
| MCP Tool | Executable operation exposed through an MCP server. |
| MCP Resource | Information made available for retrieval through MCP. |
| MCP Prompt | Reusable prompt template exposed through MCP. |
| Stdio transport | Transport using process standard input/output for MCP protocol messages. |

[Module 3 glossary](03-glossary.md)

## Module 5 — Accelerators and intellectual property

| Term | Definition |
|---|---|
| Accelerator | Reusable component, template, or workflow that reduces repeated implementation effort. |
| Reusable pattern | Repeatable design or implementation approach adaptable to multiple tasks. |
| Solution asset | Reusable implementation artifact such as a tool contract, starter template, or test suite. |
| Intellectual Property (IP) | Legal rights relating to protected creations and other intangible assets. |
| Client-specific IP | Deliverables subject to a client's ownership, confidentiality, or contract terms. |
| License | Conditions governing how material may be used, modified, or distributed. |

[Module 5 glossary](05-glossary.md)

## Module-specific glossaries

This general glossary consolidates the key terminology across all modules. Topic-focused definitions and references are available in [Module 1](01-glossary.md), [Module 2](02-glossary.md), [Module 3](03-glossary.md), [Module 4](04-glossary.md), and [Module 5](05-glossary.md).
