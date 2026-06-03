# ai-payment-reminder-whatsapp-template

**Send a payment reminder from an AI workflow** via a pre-approved WhatsApp template.

A billing/finance workflow detects an outstanding balance and sends a transactional payment
reminder over WhatsApp, with the customer's name, account, and balance filled into a
pre-approved template plus a secure "pay now" link.

```
Outstanding balance detected → AI selects payment-reminder template → send WhatsApp template
```

## Run it

```bash
node --env-file-if-exists=../.env app.js
```

**Required environment variables:** `KUDOSITY_API_KEY`, `KUDOSITY_WHATSAPP_SENDER`.

## Notes

- **Transactional message** — keep payment reminders free of promotional content. Messaging consent, sender registration, and opt-out requirements vary by country and channel; follow the rules that apply to your recipients and the policies for the WhatsApp template category you register.
- Same nested template envelope as [ai-order-update-whatsapp-template](../ai-order-update-whatsapp-template/): `content.template = { name, parameters }`, where `parameters` is a positional array of strings.
- `message_ref: "invoice-<id>"` lets delivery webhooks tie back to the invoice.
- The API call is `POST https://api.transmitmessage.com/v2/whatsapp/messages` with the `x-api-key` header.
