# Module 1 — API, models, tokens, and execution modes

**Source:** personal notes in `Glosary.docx`. **Review:** checked against official documentation on November 24, 2026.

## Tokens and context window

- **Token:** a model representation and consumption-accounting unit; not equivalent to one character or word.
- **Context window:** context capacity for input and output. `max_tokens` specifies an output-generation limit and is **not** synonymous with context window size.
- **Stop reasons:** `end_turn` (assistant turn completed), `tool_use` (requested client-side tools), `max_tokens` (generation limit), and `model_context_window_exceeded` (context exhausted). The correct value includes `_exceeded`.
- With certain Claude 4.5+ models, the API can accept a request even when *input tokens + max_tokens* exceed context capacity, then stop with `model_context_window_exceeded`. Other invalid requests can receive HTTP 400. Never generalize a single behavior to every model/version.

## Sampling, temperature, and non-determinism

- **Sampling:** token selection from a probability distribution.
- **Low temperature (where supported):** generally favors more probable tokens; it does not make the distribution more uniform.
- **High temperature (where supported):** may increase variability; it does not guarantee creativity or factual correctness.
- **API compatibility:** API version `2026-10-21` removed `temperature`, `top_p`, and `top_k` as request parameters; using them returns HTTP 400. Do not include these fields in examples targeting that version.
- **Non-determinism:** repeating a prompt does not guarantee identical responses. Evaluate representative cases using metrics and reference answers; a `model-graded judge` is optional, not mandatory.

## REST, SDK, synchronous, streaming, async, and batches

| Mode | Behavior | Common use |
|---|---|---|
| REST HTTP | Direct HTTP requests to the API | Integrations requiring explicit HTTP handling |
| SDK | Client library wrapping HTTP operations | Less boilerplate; does not bypass REST |
| Synchronous | Wait for a full response | Simple interactive requests |
| Streaming | Receive incremental SSE events | Incremental display and processing |
| Async SDK | Run and await asynchronous operations without blocking the execution thread | Controlled concurrency |
| Message Batches API | Submit **multiple independent requests** for deferred processing | Large-scale workloads without immediate results |

## Model families

- **Fable:** previously documented as an official Anthropic model family for demanding reasoning and longer agentic tasks; availability must be checked for the relevant API and account.
- **Opus:** high-capability model family for complex reasoning and coding.
- **Sonnet:** balanced family suited to many tasks.
- **Haiku:** efficiency-oriented family for latency-sensitive and high-volume work.
- Select a model using **evaluations**: minimum acceptable quality, cost, latency, and feature support. Model family and thinking configuration are separate concerns. Do not conflate Claude.ai plans with API access.

## Exercises

- `python labs/lab09_message_inspection.py`: classify `stop_reason` values without an API key.
- `python labs/lab01_api.py`: use the SDK against the API (requires credentials and an available model).

## Review questions

1. **Single choice:** `stop_reason=max_tokens` means: A) tool call; B) potentially truncated output due to generation limit; C) revoked authorization.
2. **Single choice:** an SDK: A) bypasses REST; B) automatically implements organizational authorization; C) abstracts HTTP API operations.
3. **Single choice:** in API version 2026-10-21, including `temperature` causes: A) HTTP 400; B) stable sampling; C) streaming.
4. **Single choice:** Message Batches is appropriate for: A) a single instant-response request; B) multiple asynchronous requests; C) temperature controls.

**Answer key:** 1B, 2C, 3A, 4B.

## Official references

- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>
- <https://platform.claude.com/docs/en/api/migration-2026-10-21>
- <https://platform.claude.com/docs/en/models/overview>
- <https://platform.claude.com/docs/en/build-with-claude/streaming>
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
