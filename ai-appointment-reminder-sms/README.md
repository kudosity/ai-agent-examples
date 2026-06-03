# ai-appointment-reminder-sms

**Send a reminder SMS from an AI workflow** when an appointment is coming up.

The workflow checks how far away an appointment is; if it's within the reminder window, an AI
agent sends a reminder SMS with the time and location through Kudosity.

```
Calendar appointment → AI detects upcoming appointment → send reminder SMS
```

## Run it

```bash
node --env-file-if-exists=../.env app.js
```

**Required environment variables:** `KUDOSITY_API_KEY`, `KUDOSITY_SENDER`.

## Notes

- The reminder window is `REMIND_WITHIN_HOURS` (24h by default).
- The API call is `POST https://api.transmitmessage.com/v2/sms` with the `x-api-key` header.
