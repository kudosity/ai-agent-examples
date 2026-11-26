// ai-delivery-update-rcs — AI sends an RCS rich card delivery update, with buttons and an SMS fallback.
// Customer messaging for AI workflows: a delivery status change drives an RCS send.

const API_KEY = process.env.KUDOSITY_API_KEY;
const RCS_AGENT_ID = process.env.KUDOSITY_RCS_AGENT_ID; // RCS is sent through your RCS agent ID, not a phone number
const SMS_FALLBACK_SENDER = process.env.KUDOSITY_SENDER;

// Fail fast with a helpful message when configuration is missing.
const missing = Object.entries({
  KUDOSITY_API_KEY: API_KEY,
  KUDOSITY_RCS_AGENT_ID: RCS_AGENT_ID,
  KUDOSITY_SENDER: SMS_FALLBACK_SENDER,
})
  .filter(([, v]) => !v || v === "your_api_key_here")
  .map(([k]) => k);
if (missing.length) {
  console.error(`Missing config: ${missing.join(", ")}.`);
  console.error("Copy .env.example to .env, fill it in, then run: node --env-file-if-exists=.env app.js");
  process.exit(1);
}

// One response-handling pattern for every Kudosity call: throw on error (status + body),
// parse JSON safely, and unwrap the { data } envelope the WhatsApp/RCS endpoints use.
async function postToKudosity(path, body) {
  const res = await fetch(`https://api.transmitmessage.com${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Kudosity ${path} failed: ${res.status} ${text}`);
  const json = text ? JSON.parse(text) : {};
  return json.data ?? json;
}

// A rich card: a title, text, an optional image and up to 4 buttons. `chips` are suggested replies
// shown under the card (up to 11).
async function sendRichCard(agentId, recipient, card, chips, fallback, messageRef) {
  const body = {
    sender: agentId,             // RCS agent ID, not a number
    recipient,                   // E.164 format, e.g. 61438333061. Local format is rejected.
    content_type: "rich_card",   // also: "text" and "media"
    content: {
      rich_card: { standalone: { card_content: card } },
      suggestions: chips,
    },
    // A plain SMS for recipients who can't receive RCS. It needs a sender: without one,
    // the request is accepted but the SMS is never sent.
    sms_fallback: fallback,
  };
  if (messageRef) body.message_ref = messageRef;
  return postToKudosity("/v2/rcs/messages", body);
}

// --- AI workflow: delivery status change → AI composes update → send RCS rich card (SMS fallback) ---
const delivery = {
  order: "12345", status: "out for delivery", eta: "between 2pm and 4pm", recipient: "61438333061",
  trackUrl: "https://example.com/track/12345",
};
const ref = `order-${delivery.order}`;

const card = {
  title: `Your order is ${delivery.status}`,
  description: `Order #${delivery.order} arrives today ${delivery.eta}.`,
  suggestions: [
    // A button on the card that opens a link.
    { action: { text: "Track order", open_url_action: { url: delivery.trackUrl } } },
  ],
};
// Optional image. Kudosity fetches the file when you send, so it must be a public https URL
// that doesn't redirect. A URL it can't fetch fails the whole request with a 400.
if (process.env.DELIVERY_IMAGE_URL) card.media = { file_url: process.env.DELIVERY_IMAGE_URL };

// Suggested replies. When the recipient taps one, your webhook gets an RCS_INBOUND event with
// mo.content_type "SUGGESTION" and this postback_data. Route on postback_data, not on the label.
const chips = [
  { reply: { text: "Reschedule", postback_data: `${ref}:reschedule` } },
  { reply: { text: "Leave at door", postback_data: `${ref}:leave-at-door` } },
];

// Images, cards and buttons aren't carried over to SMS, so the fallback text stands on its own.
const fallback = {
  sender: SMS_FALLBACK_SENDER,
  message: `Your order #${delivery.order} is ${delivery.status}, arriving today ${delivery.eta}. Track: ${delivery.trackUrl}`,
};

const result = await sendRichCard(RCS_AGENT_ID, delivery.recipient, card, chips, fallback, ref);
// A message id means the message was accepted, not delivered. Delivery arrives on webhooks:
// RCS_STATUS for the RCS message, and SMS_STATUS (same id) if it falls back to SMS.
console.log("Delivery update → RCS rich card accepted — message id:", result.id);
