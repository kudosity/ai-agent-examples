# claude-mcp-send-sms — config & usage

Connect the Kudosity MCP server to your AI tool to **send SMS from AI agents** with no code.

## Claude Desktop

Add this to your `claude_desktop_config.json` (v2 auth uses the `x-api-key` header):

```json
{
  "mcpServers": {
    "kudosity": {
      "command": "npx",
      "args": ["mcp-remote", "https://developers.kudosity.com/mcp", "--header", "x-api-key: ${KUDOSITY_API_KEY}"],
      "env": { "KUDOSITY_API_KEY": "YOUR_API_KEY" }
    }
  }
}
```

## Cursor / Windsurf

```json
{
  "mcpServers": {
    "kudosity": { "url": "https://developers.kudosity.com/mcp" }
  }
}
```

## Claude Code (CLI)

```bash
claude mcp add kudosity --scope project -- npx mcp-remote https://developers.kudosity.com/mcp
```

## Example prompts

Once connected, the AI can send messages as a tool. Try:

- "Send an SMS from AI agent to +61412345678: 'Your appointment is confirmed for 2pm tomorrow.'"
- "Text our high-value lead at +61400111222 a follow-up message."
- "Send an order-shipped update to this customer over SMS."

The assistant calls the Kudosity MCP tool, which hits `POST /v2/sms` under the hood.
