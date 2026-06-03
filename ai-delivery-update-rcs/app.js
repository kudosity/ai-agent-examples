// ai-delivery-update-rcs — AI sends a rich RCS delivery update with SMS fallback for non-RCS devices.
// Customer messaging for AI workflows: a delivery status change drives an RCS send.

const API_KEY = process.env.KUDOSITY_API_KEY;
const RCS_AGENT_ID = process.env.KUDOSITY_RCS_AGENT_ID; // RCS is sent through a registered agent ID, not a phone number
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

async function sendRCS(agentId, recipient, message, fallbackSender, messageRef) {
  const body = {
    sender: agentId,             // RCS agent ID, not a number
    recipient,
    content_type: "text",        // currently the only supported RCS content type
    content: { text: { message } },
    // SMS fallback so recipients on non-RCS-capable devices still get the message.
    sms_fallback: { sender: fallbackSender, message },
  };
  if (messageRef) body.message_ref = messageRef;
  return postToKudosity("/v2/rcs/messages", body);
}

// --- AI workflow: delivery status change → AI composes update → send RCS (SMS fallback) ---
const delivery = { order: "12345", status: "out for delivery", eta: "2pm", recipient: "61438333061" };
const message = `Your order #${delivery.order} is ${delivery.status}, ETA ${delivery.eta}.`;
const result = await sendRCS(RCS_AGENT_ID, delivery.recipient, message, SMS_FALLBACK_SENDER, `order-${delivery.order}`);
console.log("Delivery update → RCS sent — message id:", result.id);
