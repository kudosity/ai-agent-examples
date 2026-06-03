# ai-delivery-update-rcs

**Send an RCS message from an AI workflow** — a rich delivery update with automatic SMS fallback.

A delivery/logistics workflow composes a status update and sends it over RCS. Recipients on
non-RCS-capable devices automatically receive an equivalent SMS instead, so the message always
lands. This is customer messaging for AI workflows over RCS.

```
Delivery status change → AI composes update → send RCS (SMS fallback if not RCS-capable)
```

## Run it

```bash
node --env-file-if-exists=../.env app.js
```

**Required environment variables:** `KUDOSITY_API_KEY`, `KUDOSITY_RCS_AGENT_ID`, `KUDOSITY_SENDER` (for SMS fallback).

## What's different about RCS

- **`sender` is a registered RCS agent ID, not a phone number** (e.g. `DemoSender`). Set it via `KUDOSITY_RCS_AGENT_ID`.
- `content_type: "text"` with `content.text.message` (up to 3072 chars, full UTF-8 + emoji).
- `sms_fallback` (`{ sender, message }`) is sent automatically when the recipient can't receive RCS — always set it.
- The API call is `POST https://api.transmitmessage.com/v2/rcs/messages` with the `x-api-key` header.
