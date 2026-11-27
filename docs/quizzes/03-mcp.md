# Module 3 — MCP Concepts

<quiz>
What is the purpose of an MCP tool?

- [ ] Declare a static site URL.
- [ ] Specify a reusable prompt without execution.
- [x] Expose an operation that a capable MCP client can call.
- [ ] Replace all authorization checks in the target service.

MCP distinguishes **tools** (operations), **resources** (data), and **prompts** (templates). The server and downstream services still enforce permissions.
</quiz>

<quiz>
A local MCP server uses stdio transport. Which logging behavior can corrupt the transport?

- [x] Writing arbitrary human-readable logs to stdout mixed with protocol messages.
- [ ] Writing diagnostic logs to stderr.
- [ ] Returning valid protocol data on stdout.
- [ ] Sending authorized structured tool responses.

Protocol messages travel over stdout for stdio transport; incidental logging should use stderr.
</quiz>

## References

- [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)
