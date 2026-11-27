# Module 1 — Messages API

## Essential concepts

- `messages.create(model, max_tokens, messages, system=...)` sends a model request.
- The `system` instructions are supplied as a top-level request field, not as a message with `role="system"`.
- A response can contain multiple `content` blocks, including `text`, `tool_use`, and others.
- `stop_reason="end_turn"` indicates the assistant completed its turn; `"tool_use"` means the model requested tools; `"max_tokens"` indicates the generation limit and a possible truncated response.
- `usage.input_tokens` and `usage.output_tokens` help track consumption; see the API reference for cache-related accounting.

## Error handling

Distinguish authentication failures, validation errors, HTTP 429 rate limits, timeouts, and 5xx server errors. Retry only transient errors with a bounded retry budget, backoff, and jitter. Never log API keys or sensitive payloads.

## Hands-on exercise

Run `python labs/lab01_api.py` after configuring `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL`. Try a small generation limit and explain what `max_tokens` means.

## Exam questions

1. Why is a response with `stop_reason="tool_use"` not necessarily the final answer?
2. Where does the response report token usage?
3. Why must an authorization failure not be retried as though it were transient?

Reference: https://platform.claude.com/docs/en/api/messages

## Structured Outputs

Two compatible mechanisms: **JSON outputs**, configured using `output_config.format` with `type: "json_schema"` and a compatible `schema`, constrain the final response; **Strict Tool Use**, configured with `strict: true` in a tool definition, constrains tool arguments. Both employ grammar-constrained sampling, but neither guarantees semantic accuracy or authorization. Handle refusals and incomplete responses before consumption. Only a supported subset of JSON Schema is enforced in generation.

Reference: [Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs). Tool example: [Module 2](02-prompting-agents-tools.md).

## Structured Outputs and stop reasons

Before treating a JSON response as a valid contract, inspect `stop_reason`. A safety refusal can return HTTP 200 with content outside the schema; `max_tokens` can leave an incomplete response. There are no API values called `stop_reason_refusal` or `stop_reason_max_tokens`: the field is `stop_reason`, and the relevant values are `"refusal"` and `"max_tokens"`.

Further reading: [Structured Outputs — errors and compatibility](02-structured-outputs.md). [Official reference](https://platform.claude.com/docs/en/build-with-claude/structured-outputs).
