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
cp ../.env.example ../.env   # then add your KUDOSITY_API_KEY and KUDOSITY_SENDER
node --env-file-if-exists=../.env app.js
```

**Required environment variables:** `KUDOSITY_API_KEY`, `KUDOSITY_SENDER`. Run it before setting
them and it exits with a clear message rather than making a network call.

## The API call

- `POST https://api.transmitmessage.com/v2/sms`
- Auth: `x-api-key` header
- Body: `{ sender, recipient, message }` (recipient in E.164 format)

## Using it as an OpenAI tool (function calling)

Expose `sendSMS(recipient, message)` to the model as a tool. Describe it once, then run the
function whenever the model calls it:

```js
const tools = [{
  type: "function",
  function: {
    name: "send_sms",
    description: "Send an SMS to a customer from the AI workflow.",
    parameters: {
      type: "object",
      properties: {
        recipient: { type: "string", description: "Phone number in E.164 format, e.g. 61412345678" },
        message: { type: "string", description: "The SMS body" },
      },
      required: ["recipient", "message"],
    },
  },
}];

// When the model returns a tool call for "send_sms", call sendSMS(args.recipient, args.message).
```

`app.js` keeps the example dependency-free by simulating the agent decision rather than calling
the OpenAI SDK — swap in your real agent loop and reuse `sendSMS()` unchanged.
