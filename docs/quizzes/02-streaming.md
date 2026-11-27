# Module 2 — Streaming and Tool Use

<quiz>
The API emits several `content_block_delta` events for a `tool_use` block. What should an application do with partial tool-input JSON?

- [ ] Execute the tool after the first fragment.
- [x] Accumulate fragments and parse the completed input after the block closes.
- [ ] Persist each delta as an independent tool call.
- [ ] Ignore all deltas and assume an empty input.

A `tool_use` input may be split across multiple fragments. **`content_block_stop`** marks completion of the block; only then should accumulated tool input be parsed and validated.
</quiz>

<quiz>
Which event updates the streamed message's `stop_reason`?

- [ ] `message_start`
- [ ] `content_block_start`
- [x] `message_delta`
- [ ] `message_stop`

`message_delta` supplies top-level updates such as `stop_reason` and usage. `message_stop` signals the end of the stream.
</quiz>

<quiz>
When Claude emits a `tool_use` block for a client-side tool, what must happen before Claude can use the resulting data?

- [x] The application executes an authorized tool call and returns a matching `tool_result` in a later request.
- [ ] The model automatically executes arbitrary code in the application.
- [ ] The application changes the original tool ID before responding.
- [ ] A `tool_result` is unnecessary if the tool succeeded.

The application owns client-side tool execution and passes back a `tool_result` linked through `tool_use_id`.
</quiz>

## References

- [Streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)
- [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
