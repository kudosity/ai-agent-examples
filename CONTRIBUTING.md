# Contributing

Thanks for helping show developers how to **send messages from AI agents and AI workflows** with
Kudosity. New examples are very welcome.

## Ideas we'd love

- `support-escalation-sms` — AI triages a ticket and escalates via SMS
- `shipping-notification-sms` — AI sends a shipping notification
- `openai-agent-send-whatsapp` — OpenAI agent sends a WhatsApp template
- `ai-survey-rcs` — AI sends an RCS survey/feedback request
- `zapier-ai-send-sms` — trigger a Kudosity SMS from a Zapier AI step

## Guidelines

- **Keep it small** — aim for under ~40 lines of code per example.
- **Keep the API call visible** — don't hide the HTTP request behind heavy abstractions; AI tools should be able to copy the pattern directly.
- **Be prompt-aligned** — name the folder, README title, and headings the way a developer would actually ask an AI to build it (e.g. "send SMS from AI agent").
- **No dependencies** — use built-in `fetch` and run on Node.js 20.12+ (the same baseline as the rest of the repo).
- **Secrets via environment variables** — never hard-code API keys; read from `process.env`.
- **Mind messaging compliance** — consent, sender registration, and opt-out requirements vary by country and channel. Where required by local regulations or channel policy, include an appropriate opt-out mechanism (such as "Reply STOP to opt out"). Keep transactional examples (reminders, account notifications) free of promotional content, and use generic, non-branded sample copy.

## Structure

Each example lives in its own folder with a `README.md` and an `app.js` (or `example.md` for
no-code/MCP examples). Add your example to the table in the root [README.md](README.md).
