// ai-payment-reminder-rcs — AI sends a payment reminder over RCS with SMS fallback.
// A transactional payment reminder over RCS, with SMS fallback for non-RCS devices.

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
    content_type: "text",
    content: { text: { message } },
    // SMS fallback so recipients on non-RCS-capable devices still get the reminder.
    sms_fallback: { sender: fallbackSender, message },
  };
  if (messageRef) body.message_ref = messageRef;
  return postToKudosity("/v2/rcs/messages", body);
}

// --- AI workflow: outstanding balance detected → AI composes reminder → send RCS (SMS fallback) ---
const account = {
  name: "John", last4: "4444", balance: "$150.00",
  payUrl: "https://pay.example.com/abcd", invoiceId: "7782", recipient: "61438333061",
};
const message = `Hi ${account.name}, payment reminder for your account ending ${account.last4}. ` +
  `Balance: ${account.balance}. Pay securely: ${account.payUrl}.`;

const result = await sendRCS(RCS_AGENT_ID, account.recipient, message, SMS_FALLBACK_SENDER, `invoice-${account.invoiceId}`);
console.log("Payment reminder → RCS sent — message id:", result.id);
