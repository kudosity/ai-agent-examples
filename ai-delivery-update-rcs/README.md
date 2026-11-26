# ai-delivery-update-rcs

**Send an RCS rich card from an AI workflow** — a delivery update with a tracking button, suggested
replies and an SMS fallback.

A delivery/logistics workflow composes a status update and sends it as an RCS rich card. The card
has a **Track order** button, and two suggested replies sit under it. Recipients who can't receive
RCS get a plain SMS instead, so the message always lands.

```
Delivery status change → AI composes update → send RCS rich card (SMS fallback if RCS can't deliver)
```

## Run it

```bash
node --env-file-if-exists=../.env app.js
```

**Required environment variables:** `KUDOSITY_API_KEY`, `KUDOSITY_RCS_AGENT_ID`, `KUDOSITY_SENDER` (for SMS fallback).

**Optional:** `DELIVERY_IMAGE_URL` adds an image to the card. It must be a public `https` URL that
doesn't redirect. Kudosity fetches the file when you send, and a URL it can't fetch fails the request.

## What's different about RCS

- **`sender` is your RCS agent ID, not a phone number** (e.g. `DemoSender`). Set it via
  `KUDOSITY_RCS_AGENT_ID`. You create, test and launch the agent in the Kudosity app; until it's
  launched, it can message its test devices only.
- **`content_type` is `text`, `media` or `rich_card`.** This example sends a `rich_card` with one
  card. Use `rich_card.carousel.card_contents` for 2 to 10 cards.
- **Buttons and suggested replies.** A card takes up to 4 `suggestions`. Up to 11 more go under the
  message in `content.suggestions`. Each is a `reply`, or an `action` that opens a URL or dials a number.
- **`sms_fallback` needs a `sender` and a `message`.** Without the sender, the request is accepted
  but the SMS is never sent. Images, cards and buttons aren't carried over, so write the SMS to stand
  on its own.
- **The recipient must be in E.164 format**, such as `61438333061`. Local format is rejected.
- The API call is `POST https://api.transmitmessage.com/v2/rcs/messages` with the `x-api-key` header.

## After the send

A message `id` means the message was accepted, not delivered. Subscribe a
[webhook](https://developers.kudosity.com/reference/about-webhooks) to follow it:

- `RCS_STATUS` reports `SENT`, `DELIVERED` and `READ`.
- `SMS_STATUS` reports the fallback SMS, with the same `id`, if the RCS message can't be delivered.
- `RCS_INBOUND` reports a tapped suggestion, with `mo.content_type` set to `SUGGESTION` and your
  `postback_data`.

See the [RCS Message Guide](https://developers.kudosity.com/docs/rcs-message-guide) for every format.
