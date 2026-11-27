# Module 2 — Prompting, iteration, and troubleshooting

**Source:** the *Debugging a prompt* table and terms from `Glosary.docx`. The source's four main symptoms are preserved and extended to integration failures.

## Techniques

- **Zero-shot:** an instruction without examples.
- **One-shot:** one input/output example.
- **Few-shot / multi-shot:** several representative examples; these may improve accuracy or formatting but consume context, so evaluate their benefit. Do not assume that one or two examples are universally optimal.
- **Prompt iteration:** modify specific prompt elements, retest against the same evaluation set, and check for regressions.
- **Task decomposition:** break a complex task into independently verifiable stages.
- **Hallucination vs grounding:** source-based grounding can reduce unsupported claims, but does not replace factual verification.

## Troubleshooting table

| Symptom | Likely cause | Appropriate action | Validation |
|---|---|---|---|
| Incorrect output format | Vague output contract | Specify schema/format; use Structured Outputs where supported | Parser/schema tests |
| Scope drift, wrong tone, or ambiguity | Unclear limits or instructions | Rewrite constraints and goals | Regression evaluations |
| Correct task, wrong structure | Missing demonstration of target pattern | Add representative few-shot examples | Variation tests |
| Mistakes on exceptions | Edge cases not covered | Add edge cases and targeted tests | Adversarial examples |
| Invented information | Insufficient or irrelevant evidence | Use reliable retrieval, grounding, explicit unknowns | Source verification |
| Outdated responses | Stale reference documents | Refresh sources and versions | Compare with current sources |
| Incomplete output | `max_tokens` or context limits | Check `stop_reason` and limits | Truncation tests |
| Wrong tool selected | Ambiguous tool name, description, or schema | Improve tool definitions and executor controls | Tool-choice evaluations |
| HTTP 429 / 5xx | Rate limit or transient server failure | Bounded retry with backoff and jitter | Failure-injection tests and metrics |
| Permission violations | Authorization attempted only through prompting | Enforce backend permissions | Access-denial tests |
| Inconsistent answers | Non-determinism | Evaluate repeatability across cases | Automated and human evaluations |

## Exercise

`python labs/lab08_prompt_validation.py` constructs a prompt containing an untrusted log, checks JSON with a simplified schema, and detects incorrectly typed fields. **Prompt instructions do NOT replace output validation or authorization checks.**

## Review questions

1. A report contains references, but none support its conclusion. What failed? **Grounding and claim verification.**
2. A malicious log makes the model propose `delete_namespace`. What prevents damage? **Authorization enforced by the tool executor**, not only prompt instructions.
3. JSON contains `requires_approval: "false"` as a string. What should happen? **Safely reject or normalize using type validation** before consuming it.
4. A changed prompt breaks a previously passing case. What do you need? **Regression evaluation.**

## Official references

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>

## Four-technique debugging workflow

Identify the symptom, apply the smallest relevant fix, retest against the same evaluation set, and check for regressions.

| Technique | When to use it |
|---|---|
| [System prompt](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | Shared role, scope, and behavioral rules; Messages API calls must supply required instructions on each independent request, even if the application reuses a template. |
| [XML tags](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | Separate instructions, context, examples, and variable inputs; not a security boundary. |
| [Few-shot / multi-shot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | Demonstrate target patterns and edge cases with several examples; one pair is one-shot. |
| [Output constraints](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | Specify formatting, fields, types, and missing-value behavior; prose constraints do not formally guarantee conformance. |

For machine-parseable contracts, use [Structured Outputs](02-structured-outputs.md) where appropriate. See [Production-Grade Prompting](02-prompting-agents-tools.md) for examples.

### Clarifications from the notebook

- **System prompt:** reusing an application template does not give a stateless API call automatic memory.
- **XML tags:** delimit `instructions`, `context`, `examples`, and `input`; do not grant permissions or prevent prompt injection on their own.
- **One-shot vs few-shot:** one input/output pair is **one-shot**; multiple pairs are **few-shot**.
- **Output constraints:** natural-language rules help guide output, but a machine contract requires a supported schema.

**Debugging rule:** identify the issue → apply the smallest fix → test representative cases → check regressions. Not every problem is a prompt-writing problem.

[Source — Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
