# Module 2 — Production-Grade Prompting, Agents, and Tool Use

## Production prompting

Specify the objective, context, boundaries, response format, and success criteria. Use examples when they clarify the target behavior. Validate structured results in code; prompting is **not** a security boundary.

## Tool-use loop

1. Send `messages` and tool definitions containing `input_schema`.
2. Inspect `stop_reason` and every `tool_use` content block.
3. Validate tool name, arguments, identity, authorization, and execution budget **before running tools**.
4. Append the original assistant response to the conversation history.
5. Return results as `tool_result` blocks referencing their `tool_use_id`, in a `user` role message.
6. Continue with bounded time, iteration, and stop criteria.

## Architecture choices

- **Deterministic pipeline:** predefined tasks, simpler auditing, and strict approvals.
- **Agent:** dynamically chosen steps based on discovered information and iterative work.
- **Multi-agent:** introduce specialization only when its benefit exceeds operational cost and complexity.

## Common mistakes

- Running arbitrary tools proposed by the model.
- Ignoring a second `tool_use` block.
- Breaking the `tool_use.id` ↔ `tool_result.tool_use_id` association.
- Retrying forever or giving a diagnostic agent write access to production resources.

Practice: `pytest -q tests/test_agent.py`.
Reference: <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>

## Debugging a prompt — support ticket classifier

Scenario: the router expects `BILLING`, `TECHNICAL`, or `ESCALATION`, but a vague instruction produces inconsistent capitalization or entire sentences. Add output constraints and delimited examples:

```text
System: Classify each ticket into exactly one of BILLING, TECHNICAL, ESCALATION. Return only the label.
<example><sample_input>Charged twice for April.</sample_input><ideal_output>BILLING</ideal_output></example>
<example><sample_input>The API returns 429.</sample_input><ideal_output>TECHNICAL</ideal_output></example>
<example><sample_input>I need a supervisor to resolve this dispute.</sample_input><ideal_output>ESCALATION</ideal_output></example>
User: <ticket>I was charged twice for the same month.</ticket>
```

**Curated improvement:** demonstrate all three classes and define precedence when a ticket fits multiple categories. Validate the label before the router. For a machine-enforced JSON contract, use JSON outputs with an enum-valued field and adapt the consumer accordingly.

Source: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).

## Strict Tool Use — Kubernetes example

Consider a tool `get_pod_logs` with `namespace` (string) and `tail_lines` (integer). Without Strict Tool Use, the model could supply the line count as text. However, the tool also needs a specific `pod`:

```json
{
  "name": "get_pod_logs",
  "description": "Retrieve logs from a named Kubernetes pod",
  "strict": true,
  "input_schema": {
    "type": "object",
    "properties": {
      "namespace": {"type": "string"},
      "pod": {"type": "string"},
      "tail_lines": {"type": "integer"}
    },
    "required": ["namespace", "pod", "tail_lines"],
    "additionalProperties": false
  }
}
```

A structurally valid call is `{"namespace":"production","pod":"api-123","tail_lines":100}`. The grammar prevents a string value for `tail_lines`. The backend still needs to validate identity, authorization, pod existence, and safe line-count limits. Numeric `minimum` and `maximum` constraints are not directly supported in the generation grammar. **Never invent a pod name** if the user did not identify it; resolve or request it.

Source: [Structured Outputs — Strict Tool Use](https://platform.claude.com/docs/en/build-with-claude/structured-outputs).

## Watch Out — Overlapping Tool Descriptions

**Exam focus:** tool selection, tool-description design, decision boundaries, and the difference between routing failures and argument-schema failures.

### Diagnostic scenario: redundant tool descriptions

A developer has repeatedly observed Claude calling `search_docs` even though the answer is already available in the conversation. The registered tools are described as follows:

> **Developer:** Why does Claude keep calling `search_docs` when the answer is already in the context?
>
> **Senior developer:** What does the description for `search_docs` say?
>
> **Developer:** "Use this to find information about the product."
>
> **Senior developer:** And `get_context_summary`?
>
> **Developer:** "Use this to retrieve relevant information from the current session."
>
> **Senior developer:** Both descriptions imply "find information." Define when **each tool must not be used**, not just when it should be used.

These descriptions lack a clear **decision boundary**. Tool names and parameter schemas may help, but overlapping purposes can still cause incorrect **tool selection**. Repeating the same request is not a reliable fix for a systematic routing problem.

### Clear inclusion and exclusion conditions

| Tool | When to use | When not to use |
|---|---|---|
| `search_docs` | The question requires documentation or information **not already available** in the provided session context. | The answer can be obtained from the existing session context. |
| `get_context_summary` | The relevant information is already available in the current session, and a summary or focused retrieval is useful. | Answering requires external documentation or new information that the session does not contain. |

Example tool descriptions, deliberately short and unambiguous:

> **`search_docs`** — Search documentation when answering requires content not present in the current conversation. Do not call this tool if the answer is already available in session context.
>
> **`get_context_summary`** — Summarize information already present in the current session. Do not use this tool to look up external or new information.

**Watch out:** These rules only work if the application exposes the relevant session context to Claude. If older turns have been truncated, Claude may no longer know that the answer was previously supplied. Tool availability, descriptions, and actual data access must agree; do not claim that a context-summary tool can retrieve data the application has not retained.

**When to merge tools:** If two tools remain difficult to distinguish after their inclusion and exclusion rules are clarified, consider a single tool with an explicit `type` or `mode` parameter. Merge only if their data-access and authorization boundaries permit it.

**Key takeaway:** A good tool description explains **when to call the tool** and **when not to call it**. Fix systematic tool-routing errors at the **tool-definition level**; `strict: true` addresses argument-schema conformance, not ambiguous tool purposes.

### Exam-style scenarios

These are **original practice scenarios**, not questions taken from an official certification exam.

#### Scenario 1 — Root-cause identification (single choice)

> Claude selects `search_docs` although a complete answer appears in the current conversation. The two tools have overlapping descriptions. What is the most targeted first change?
>
> A. Increase `max_tokens`.
>
> B. Add explicit inclusion and exclusion conditions to **both** tool descriptions.
>
> C. Enable `strict: true` on both tools without changing descriptions.
>
> D. Retry the request until Claude selects the expected tool.

<details>
<summary>Show answer and rationale</summary>

**Correct answer: B.** The observed issue is ambiguous tool selection, not a malformed argument. Clear decision boundaries target the failure directly.

</details>

#### Scenario 2 — Choosing a tool (single choice)

> The user asks about a product setting, but that setting is not described anywhere in the conversation. `get_context_summary` covers the existing conversation, while `search_docs` retrieves documentation. Which tool should Claude choose?
>
> A. `get_context_summary`, because all product questions are contextual.
>
> B. `search_docs`, because the required information is absent from the supplied context.
>
> C. Both tools, on every request.
>
> D. Neither tool, because tool use is prohibited for factual questions.

<details>
<summary>Show answer and rationale</summary>

**Correct answer: B.** The tool boundary depends on **where the needed information resides**, not merely on the topic of the question.

</details>

#### Scenario 3 — Choosing an architectural remedy (single choice)

> Two read-only tools continue to have essentially identical purposes, even after adding meaningful exclusions. Their authorization requirements are the same. What is a reasonable next design option?
>
> A. Merge them into one tool with an explicit `mode` parameter.
>
> B. Remove all descriptions and rely on function names.
>
> C. Make every parameter required.
>
> D. Increase the number of near-identical tools.

<details>
<summary>Show answer and rationale</summary>

**Correct answer: A.** If distinctions are artificial and permissions are compatible, combining tools can simplify routing. This is a design option, not a universal requirement.

</details>

#### Scenario 4 — Context availability (single choice)

> The descriptions are clear, but an application has dropped earlier conversation turns before sending its next API request. Claude searches externally for information that appeared only in the discarded turns. What should the developer investigate first?
>
> A. Whether prior context was supplied or reliably summarized in the new request.
>
> B. Whether `strict: true` was disabled.
>
> C. Whether the tool name contains an underscore.
>
> D. Whether the model's output JSON has additional properties.

<details>
<summary>Show answer and rationale</summary>

**Correct answer: A.** Exclusion conditions cannot operate on information the model was not given. Inspect the conversation-history and context-management strategy.

</details>

### Practical evaluation checklist

- Test a question **already answered in context** and verify that no unnecessary documentation search is requested.
- Test a question **absent from context** and verify that external retrieval is selected when appropriate.
- Test ambiguous wording, missing history, and misleadingly similar tool names.
- Measure **tool-selection accuracy** and unnecessary calls before and after editing descriptions.
- Check that backend permissions still prevent unintended operations, regardless of the tool selected.

## Lab ideas

- Given a faulty prompt, choose the smallest appropriate technique and justify the choice.
- Identify which technique a proposed solution uses, then measure results with normal and edge cases.
- Compare an enum-validated text router with JSON outputs that use an enum.
- Test arguments that are schema-valid but unauthorized by the tool executor.

## Structured Outputs and limits

The detailed notes on `JSON outputs`, `Strict Tool Use`, `grammar-constrained sampling`, grammar compilation and caching, `refusal`, `max_tokens`, and prefilling compatibility are maintained in the canonical [Structured Outputs guide](02-structured-outputs.md). Keep the practical examples here without duplicating the theory.

## Checkpoint — support-ticket extraction with output constraints

A checkpoint scenario starts with a system prompt that requests extraction but does not specify the required format. Unlike the single-label classifier, this task needs three fields. A minimal corrected instruction is:

```text
Extract exactly three fields from each ticket. Return only a JSON object:
- category: string, one of billing, technical, escalation.
- urgency: string, one of low, medium, high, critical.
- summary: string, one sentence describing the issue.
Do not include additional fields or surrounding text.
```

**Curated improvement:** define urgency criteria, category precedence, and what to do when fields are missing. A production deployment blocked by an API key failure may have category `technical`, but urgency depends on an explicit impact policy. Natural-language instructions do not guarantee valid JSON: use [JSON outputs](02-structured-outputs.md) for enforced machine-readable formats, then validate business rules. Include ambiguous and missing-data test cases.

Sources: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs).
