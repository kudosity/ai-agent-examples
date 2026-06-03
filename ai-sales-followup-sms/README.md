# ai-sales-followup-sms

**Send SMS from an AI workflow** when lead scoring detects a high-value lead.

An AI scores an incoming lead; if it clears the threshold, the workflow sends an SMS follow-up
through Kudosity. This is customer messaging for AI workflows — the action layer that turns a
scoring decision into a real conversation.

```
AI lead scoring → high-value lead detected → send SMS follow-up
```

## Run it

```bash
node --env-file-if-exists=../.env app.js
```

**Required environment variables:** `KUDOSITY_API_KEY`, `KUDOSITY_SENDER`.

## Notes

- Uses `message_ref: "lead-<id>"` so delivery and link-hit webhooks can be tied back to the lead in your CRM.
- The API call is `POST https://api.transmitmessage.com/v2/sms` with the `x-api-key` header.
