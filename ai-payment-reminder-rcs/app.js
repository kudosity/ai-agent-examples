// ai-payment-reminder-rcs — AI sends a payment reminder over RCS with a Pay now button and an SMS fallback.
// A transactional payment reminder over RCS, with SMS fallback for non-RCS devices.

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

// A text message with suggestions under it (up to 11): replies, links and call buttons.
async function sendRCS(agentId, recipient, message, suggestions, fallback, messageRef) {
  const body = {
    sender: agentId,             // RCS agent ID, not a number
    recipient,                   // E.164 format, e.g. 61438333061. Local format is rejected.
    content_type: "text",        // also: "media" and "rich_card"
    content: { text: { message }, suggestions },
    // A plain SMS for recipients who can't receive RCS. It needs a sender: without one,
    // the request is accepted but the SMS is never sent.
    sms_fallback: fallback,
  };
  if (messageRef) body.message_ref = messageRef;
  return postToKudosity("/v2/rcs/messages", body);
}

// --- AI workflow: outstanding balance detected → AI composes reminder → send RCS (SMS fallback) ---
const account = {
  name: "John", last4: "4444", balance: "$150.00",
  payUrl: "https://pay.example.com/abcd", invoiceId: "7782", recipient: "61438333061",
};
const ref = `invoice-${account.invoiceId}`;
const message = `Hi ${account.name}, payment reminder for your account ending ${account.last4}. ` +
  `Balance: ${account.balance}.`;

const suggestions = [
  // Opens the payment page. The link lives on the button, so the RCS text doesn't need it.
  { action: { text: "Pay now", open_url_action: { url: account.payUrl } } },
  // A tap arrives on your webhook as an RCS_INBOUND event with mo.content_type "SUGGESTION"
  // and this postback_data. Route on postback_data, not on the label.
  { reply: { text: "Need more time", postback_data: `${ref}:extension` } },
];

// Buttons aren't carried over to SMS, so the fallback text includes the link.
const fallback = { sender: SMS_FALLBACK_SENDER, message: `${message} Pay securely: ${account.payUrl}` };

const result = await sendRCS(RCS_AGENT_ID, account.recipient, message, suggestions, fallback, ref);
// A message id means the message was accepted, not delivered. Delivery arrives on webhooks.
console.log("Payment reminder → RCS accepted — message id:", result.id);
