# Kudosity AI Agent Examples

**Send SMS, MMS, WhatsApp, and RCS from AI agents and AI workflows — with Kudosity.**

This repo is a set of small, copy-paste-ready examples showing how an AI agent or AI
workflow contacts a customer through the [Kudosity](https://kudosity.com) messaging API.
Kudosity is the **messaging action layer for AI agents**: when your agent decides to reach
a customer, these patterns turn that decision into a real SMS, MMS, WhatsApp, or RCS message.

Each example is one short, dependency-free Node.js file. The HTTP call to Kudosity is kept
visible and easy to copy — drop it straight into your own AI workflow.

## Requirements

- **Node.js 20.12+** — examples use the built-in `fetch` and the `--env-file-if-exists` flag, so there's nothing to install.

## Quickstart

1. **Sign up** for a trial at [kudosity.com/trial](https://kudosity.com/trial).
2. **Get your API key** from the dashboard under **Settings → API Settings**.
3. **Register a sender** (a number or alphanumeric sender ID) for your destination country.
4. **Configure your environment:**
   ```bash
   cp .env.example .env
   # then edit .env with your API key and sender
   ```
5. **Run an example:**
   ```bash
   node --env-file-if-exists=.env openai-agent-send-sms/app.js
   # or, equivalently: npm run send-sms
   ```

Run any example before filling in `.env` and it exits immediately with a clear message telling
you which variables to set — it won't make a network call.

## Configuration

Every example reads its credentials from environment variables (see [`.env.example`](.env.example)):

| Variable | Used by | Notes |
|---|---|---|
| `KUDOSITY_API_KEY` | all examples | Your API key (Settings → API Settings). |
| `KUDOSITY_SENDER` | SMS, MMS, and RCS SMS-fallback | A number or alphanumeric sender ID registered to your account. |
| `KUDOSITY_WHATSAPP_SENDER` | WhatsApp examples | Your registered WhatsApp Business number (E.164). |
| `KUDOSITY_RCS_AGENT_ID` | RCS examples | Your registered RCS agent ID — RCS sends through an agent, not a number. |

## Examples

| Example | Channel | What it shows |
|---|---|---|
| [openai-agent-send-sms](openai-agent-send-sms/) | SMS | An AI agent decision triggers a `sendSMS()` call — the core "send SMS from AI workflow" pattern |
| [claude-mcp-send-sms](claude-mcp-send-sms/) | SMS (MCP) | Use Kudosity as a messaging tool inside Claude / Cursor / Windsurf via MCP — no code |
| [ai-sales-followup-sms](ai-sales-followup-sms/) | SMS | AI lead scoring detects a high-value lead and sends an SMS follow-up |
| [ai-appointment-reminder-sms](ai-appointment-reminder-sms/) | SMS | AI detects an upcoming appointment and sends a reminder SMS |
| [ai-product-launch-mms](ai-product-launch-mms/) | MMS | An AI marketing workflow generates a message and sends an MMS with an image |
| [ai-order-update-whatsapp-template](ai-order-update-whatsapp-template/) | WhatsApp | AI selects a pre-approved WhatsApp template for an order status update |
| [ai-payment-reminder-whatsapp-template](ai-payment-reminder-whatsapp-template/) | WhatsApp | AI sends a transactional payment reminder via a pre-approved WhatsApp template |
| [ai-delivery-update-rcs](ai-delivery-update-rcs/) | RCS | AI sends a rich RCS delivery update with automatic SMS fallback |
| [ai-payment-reminder-rcs](ai-payment-reminder-rcs/) | RCS | AI sends a transactional payment reminder over RCS with SMS fallback |

## How it works

Every example follows the same shape — an **AI agent SMS example** you can lift directly:

```
AI agent / workflow decision  →  send<Channel>() function  →  Kudosity API
```

- **Base URL:** `https://api.transmitmessage.com`
- **Auth:** `x-api-key` header
- **Endpoints:** `/v2/sms`, `/v2/mms`, `/v2/whatsapp/messages`, `/v2/rcs/messages`

## Resources

- [Developer portal](https://developers.kudosity.com/)
- [Trial signup](https://kudosity.com/trial)
- [MCP endpoint](https://developers.kudosity.com/mcp)
- [LLM reference (`llms.txt`)](https://developers.kudosity.com/llms.txt)
- OpenAPI specs: [v1](https://developers.kudosity.com/openapi/api_documentation.yml) · [v2](https://developers.kudosity.com/openapi/public-openapi.yaml)

## Contributing

New examples welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Keep them small, dependency-free,
and prompt-aligned (named the way developers actually ask an AI to build them).

## License

[MIT](LICENSE)
