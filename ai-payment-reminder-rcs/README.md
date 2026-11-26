# ai-payment-reminder-rcs

**Send a payment reminder from an AI workflow over RCS** — branded sender, a **Pay now** button, and an SMS fallback.

A billing/finance workflow composes a transactional payment reminder and sends it over RCS as a
text message with two suggestions under it: a **Pay now** button that opens the payment page, and
a **Need more time** reply. Recipients who can't receive RCS get the reminder by SMS, with the
payment link in the text, so it always reaches the customer.

```
Outstanding balance detected → AI composes reminder → send RCS (SMS fallback if not RCS-capable)
```

## Run it

```bash
node --env-file-if-exists=../.env app.js
```

**Required environment variables:** `KUDOSITY_API_KEY`, `KUDOSITY_RCS_AGENT_ID`, `KUDOSITY_SENDER` (for SMS fallback).

## Notes

- **Transactional message** — keep payment reminders free of promotional content. Messaging consent, sender registration, and opt-out requirements vary by country and channel; follow the rules that apply to your recipients. Where required, include an appropriate opt-out mechanism such as "Reply STOP to opt out".
- **`sender` is your RCS agent ID, not a phone number** (set via `KUDOSITY_RCS_AGENT_ID`). You create, test and launch the agent in the Kudosity app.
- **Suggestions** go in `content.suggestions`, up to 11 under a message. An `action` opens a URL or dials a number; a `reply` sends its label back. A tapped suggestion arrives on your webhook as an `RCS_INBOUND` event with `mo.content_type` set to `SUGGESTION` and your `postback_data`.
- **Always set `sms_fallback`, with a `sender` and a `message`.** Without the sender, the request is accepted but the SMS is never sent. Buttons aren't carried over to SMS, so the fallback text includes the payment link.
- `message_ref: "invoice-<id>"` ties delivery webhooks back to the invoice.
- The API call is `POST https://api.transmitmessage.com/v2/rcs/messages` with the `x-api-key` header.
