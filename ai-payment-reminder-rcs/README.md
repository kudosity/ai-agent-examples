# ai-payment-reminder-rcs

**Send a payment reminder from an AI workflow over RCS** — branded sender, with SMS fallback.

A billing/finance workflow composes a transactional payment reminder and sends it over RCS.
Recipients on non-RCS-capable devices automatically receive the same reminder via SMS, so it
always reaches the customer.

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
- **`sender` is a registered RCS agent ID, not a phone number** (set via `KUDOSITY_RCS_AGENT_ID`).
- Always set `sms_fallback` so the reminder still lands on non-RCS devices.
- `message_ref: "invoice-<id>"` ties delivery webhooks back to the invoice.
- The API call is `POST https://api.transmitmessage.com/v2/rcs/messages` with the `x-api-key` header.
