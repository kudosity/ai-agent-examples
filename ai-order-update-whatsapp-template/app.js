// ai-order-update-whatsapp-template — AI selects a pre-approved WhatsApp template for an order update.
// Customer messaging for AI workflows: an order status change drives a WhatsApp template send.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_WHATSAPP_SENDER; // registered WhatsApp sender number (E.164)

// Fail fast with a helpful message when configuration is missing.
const missing = Object.entries({ KUDOSITY_API_KEY: API_KEY, KUDOSITY_WHATSAPP_SENDER: SENDER })
  .filter(([, v]) => !v || v === "your_api_key_here")
  .map(([k]) => k);
if (missing.length) {
  console.error(`Missing config: ${missing.join(", ")}.`);
  console.error("Copy .env.example to .env, fill it in, then run: node --env-file-if-exists=.env app.js");
  process.exit(1);
}

// One response-handling pattern for every Kudosity call: throw on error (status + body),
// parse JSON safely, and unwrap the { data } envelope the WhatsApp/RCS endpoints use so the
// caller always gets a flat result object.
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

// WhatsApp template messages must use a pre-approved template name.
async function sendWhatsAppTemplate(sender, recipient, templateName, templateParams, messageRef) {
  const body = {
    sender,
    recipient,
    content_type: "template",
    // Nested envelope — the most common gotcha. parameters fill {1}, {2}, ... in order (strings).
    content: { template: { name: templateName, parameters: templateParams } },
  };
  if (messageRef) body.message_ref = messageRef;
  return postToKudosity("/v2/whatsapp/messages", body);
}

// --- AI workflow: order status update → AI selects template → send WhatsApp template ---
const order = { number: "12345", status: "shipped", recipient: "61411122211" };
const result = await sendWhatsAppTemplate(
  SENDER,
  order.recipient,
  "order_update",                       // pre-approved template, e.g. "Order {1} is now {2}."
  [`#${order.number}`, order.status],   // positional parameters → {1}, {2}
  `order-${order.number}`,
);
console.log("Order update → WhatsApp template sent — message id:", result.id);
