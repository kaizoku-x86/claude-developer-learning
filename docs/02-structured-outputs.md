# Structured Outputs — JSON outputs, Strict Tool Use, and limitations

**References:** [Anthropic Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [Strict Tool Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use), and [Working with Messages](https://platform.claude.com/docs/en/build-with-claude/working-with-messages).

## Problem solved by Structured Outputs

Natural-language **output constraints** guide the response but do not guarantee that it can be parsed by downstream software. **Structured Outputs** uses *grammar-constrained sampling*: the API compiles a supported JSON Schema into a grammar that restricts generated tokens.

| Mechanism | Configuration | What it constrains |
|---|---|---|
| **JSON outputs** | `output_config.format` with `type: "json_schema"` and `schema` | The **final response** as schema-conformant JSON |
| **Strict Tool Use** | `strict: true` in each tool definition | **Tool arguments** according to the supported `input_schema` |

Both mechanisms **can be used together**. Structural validity does not imply that the content is correct or that the action is authorized: **schema conformance ≠ factual accuracy ≠ authorization**.

## JSON outputs — conceptual configuration

```python
# Parameters for client.messages.create(...)
output_config={
    "format": {
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "enum": ["BILLING", "TECHNICAL", "ESCALATION"],
                }
            },
            "required": ["category"],
            "additionalProperties": False,
        },
    }
}
```

Always validate content at the application boundary. **Documented caveat:** some `enum`/`const` string values may differ in capitalization; avoid enum values distinguished only by case and verify values before routing.

## Strict Tool Use — Kubernetes

The original `get_pod_logs` example provided `namespace` and `tail_lines` but did not identify a particular **pod**. A more complete definition is:

```json
{
  "name": "get_pod_logs",
  "description": "Read logs from a named Kubernetes pod",
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

A call with `"tail_lines": "last hundred"` violates the declared type; `"tail_lines": 100` is structurally valid. However, the executor **must** check namespace permissions, pod existence, and a safe line-count limit. Never fabricate a pod identifier when the request does not identify it.

## JSON Schema support is limited

- Object schemas specify `properties`, `required`, and `additionalProperties: false`.
- Constraints such as `minimum`, `maximum`, `minLength`, and `maxLength` are not directly grammar-enforced; there are also limitations on some combinations or recursive structures.
- Some SDKs transform typed schemas and add client-side validation, but **business rules and authorization still require application-side enforcement**.
- A schema-valid tool call can still be a dangerous or incorrect operation.

## Grammar compilation and caching

A new schema can add **initial compilation latency**. Compiled grammars are cached for **24 hours from their last use**, not merely for 24 hours after their first compilation. If the same schema is not used during that window, its cached grammar can expire and need recompilation. Structural schema changes or relevant tool-set changes can invalidate the cache earlier; changing only a schema's `name` or `description` does not invalidate the compiled grammar cache.

**Token costs:** Structured Outputs may add internal formatting instructions to `input_tokens`. Compilation may also add initial latency; do not assume there is a separate compilation fee unless documented. **Grammar cache ≠ prompt cache**: a change to `output_config.format` may affect prompt-cache reuse.

## Refusals, truncation, and incompatibilities

Structured conformance is not guaranteed when a response does not complete normally:

- `stop_reason: "refusal"`: a safety refusal can occur even with HTTP 200.
- `stop_reason: "max_tokens"`: the response can be incomplete. Check the stop reason before JSON parsing.

Compatibility summary:

- **Supported:** JSON outputs + Strict Tool Use.
- **Unsupported:** JSON outputs + Assistant Message Prefilling.
- **Not directly supported:** JSON outputs + native citations containing interleaved citation blocks.
- Assistant prefilling support varies by model/version; newer models may reject it. System instructions and few-shot examples are **not** assistant-message prefilling.

## Exam questions

1. **Which configuration constrains the final JSON response?** → `output_config.format`.
2. **Which configuration constrains tool arguments?** → `strict: true`.
3. **Does schema validity authorize production changes?** → No. The backend must authorize each operation.
4. **What happens after 24 hours without reusing a compiled grammar?** → The cache can expire and recompilation may be required.
5. **Can JSON outputs be combined with Assistant Message Prefilling?** → No.
6. **What should be checked before parsing Structured Outputs?** → `stop_reason`, particularly `refusal` and `max_tokens`.

## Official documentation

- [Structured Outputs — schemas, caching, errors, and compatibility](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Strict Tool Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)
- [Working with Messages — assistant prefilling](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)
