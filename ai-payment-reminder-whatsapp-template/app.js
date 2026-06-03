// ai-payment-reminder-whatsapp-template — AI sends a payment reminder via a pre-approved WhatsApp template.
// A transactional payment reminder sent through a pre-approved WhatsApp template.

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

// WhatsApp template messages must use a pre-approved template name.
async function sendWhatsAppTemplate(sender, recipient, templateName, templateParams, messageRef) {
  const body = {
    sender,
    recipient,
    content_type: "template",
    // Nested envelope — parameters fill {1}, {2}, ... in order (strings).
    content: { template: { name: templateName, parameters: templateParams } },
  };
  if (messageRef) body.message_ref = messageRef;
  return postToKudosity("/v2/whatsapp/messages", body);
}

// --- AI workflow: outstanding balance detected → send payment-reminder template ---
// Template, e.g.: "Hi {1}, this is a payment reminder for your account ending in {2}.
//                  Your current balance is {3}. Tap below to view your account and pay securely."
const account = { name: "John", last4: "4444", balance: "$150.00", invoiceId: "7782", recipient: "61411122211" };
const result = await sendWhatsAppTemplate(
  SENDER,
  account.recipient,
  "payment_reminder",
  [account.name, account.last4, account.balance], // positional → {1}, {2}, {3}
  `invoice-${account.invoiceId}`,
);
console.log("Payment reminder → WhatsApp template sent — message id:", result.id);
