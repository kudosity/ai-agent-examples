# claude-mcp-send-sms

**Send SMS from AI agents** by adding Kudosity as a messaging tool over MCP.

The [Model Context Protocol](https://modelcontextprotocol.io) lets AI tools call external
services directly. Kudosity ships a hosted MCP server, so once it's connected your AI assistant
can send SMS (and more) as a native tool — no code required. This is the messaging action layer
for AI agents, available straight inside Claude Desktop, Cursor, and Windsurf.

## What it enables

Once connected, you can prompt your assistant in plain language:

> "Send an SMS to +61412345678 letting them know their order has shipped."

and it will call the Kudosity MCP tool to send the message.

## Setup

See [example.md](example.md) for the MCP config JSON for Claude Desktop, Cursor, and Windsurf,
plus the CLI install command and example prompts.

- **MCP endpoint:** `https://developers.kudosity.com/mcp`
- **Auth:** `x-api-key` header (v2)
