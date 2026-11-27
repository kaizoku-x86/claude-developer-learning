# Module 3 — Claude Code, MCP, and Integration

## Claude Code

- `CLAUDE.md`: reusable instructions and project context; not a substitute for technical access controls.
- Settings and hooks: configure permissions and run safeguards; check ordering and exact behavior in the installed version.
- In CI, enforce least privilege, pull request review, automated tests, and short-lived credentials or protected secrets.

## MCP

- **Tool:** executable operation, such as `get_incident`.
- **Resource:** retrievable information, such as `incidents://catalog`.
- **Prompt:** reusable prompt template, such as `incident_triage`.
- Authentication and authorization belong in the MCP server and the target systems, not in prompt text.
- With **stdio transport**, do not write arbitrary logs to stdout because they can corrupt protocol messages.

## Exercise

Run `python labs/lab03_mcp.py` in an MCP-compatible client; inspect tools, resources, and prompts. Add a read-only `list_incidents` tool with validated filters.

References: https://modelcontextprotocol.io/docs/getting-started/intro and https://code.claude.com/docs/en/overview
