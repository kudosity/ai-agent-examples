# ai-product-launch-mms

**Send an MMS from an AI workflow** — an AI marketing agent generates the copy and sends an
image-rich MMS through Kudosity.

```
AI marketing campaign → generate message → send MMS with image
```

## Run it

```bash
node --env-file=../.env app.js
```

## Notes

- **MMS currently delivers to Australia only.**
- `content_urls` takes a single media file (absolute URL, up to 400 KB — jpg, png, gif, MP3, or MP4).
- `subject` is limited to 20 ASCII characters.
- The API call is `POST https://api.transmitmessage.com/v2/mms` with the `x-api-key` header.
