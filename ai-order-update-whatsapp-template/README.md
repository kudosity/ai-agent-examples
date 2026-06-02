# ai-order-update-whatsapp-template

**Send a WhatsApp template from an AI workflow** when an order status changes.

An order status update triggers the AI to pick a pre-approved WhatsApp template and send it with
the order's details filled in. This is customer messaging for AI workflows over WhatsApp.

```
Order status update → AI selects template → send WhatsApp template message
```

## Run it

```bash
node --env-file=../.env app.js
```

## How WhatsApp templates work here

- **Required body:** `sender`, `recipient`, `content_type`, `content`.
- For a template, `content_type: "template"` and the content is a **nested envelope**:
  ```json
  { "template": { "name": "order_update", "parameters": ["#12345", "shipped"] } }
  ```
- `parameters` is a positional array of **strings** that fill `{1}`, `{2}`, … in the template; the count must match.
- The template `name` must be **pre-approved** in your WhatsApp Business account.
- The API call is `POST https://api.transmitmessage.com/v2/whatsapp/messages` with the `x-api-key` header.
