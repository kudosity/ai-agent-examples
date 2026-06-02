# openai-agent-send-sms

**Send SMS from an AI agent / AI workflow** with Kudosity.

This is the core pattern: an AI agent decides to contact a customer, and a `sendSMS()` function
turns that decision into a real text message via the Kudosity API. It's the messaging action
layer for AI agents — wire it into an OpenAI function call, a tool, or any agent loop.

```
AI agent decision → sendSMS() → Kudosity API
```

## Run it

```bash
cp ../.env.example ../.env   # add your KUDOSITY_API_KEY and KUDOSITY_SENDER
node --env-file=../.env app.js
```

## The API call

- `POST https://api.transmitmessage.com/v2/sms`
- Auth: `x-api-key` header
- Body: `{ sender, recipient, message }` (recipient in E.164 format)

To use this as an OpenAI tool, expose `sendSMS(recipient, message)` as a function the model can
call when it decides a customer should be contacted.
