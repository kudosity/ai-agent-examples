// ai-sales-followup-sms — send SMS from an AI workflow when lead scoring finds a high-value lead.
// Customer messaging for AI workflows: AI scores the lead, the action layer sends the follow-up.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_SENDER;
const SCORE_THRESHOLD = 80;

// Fail fast with a helpful message when configuration is missing.
const missing = Object.entries({ KUDOSITY_API_KEY: API_KEY, KUDOSITY_SENDER: SENDER })
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

// Mock AI lead scoring — in production this is your model or scoring service.
function scoreLead(lead) {
  return lead.budget > 5000 && lead.engaged ? 90 : 40;
}

async function sendFollowupSMS(lead) {
  return postToKudosity("/v2/sms", {
    sender: SENDER,
    recipient: lead.phone,
    message: `Hi ${lead.name}, thanks for your interest! A specialist will reach out shortly.`,
    message_ref: `lead-${lead.id}`, // echoed back in webhooks to link the message to your CRM
  });
}

// --- AI workflow: lead scoring → high-value lead detected → send SMS follow-up ---
const lead = { id: 4471, name: "Sam", phone: "61412345678", budget: 9000, engaged: true };
if (scoreLead(lead) >= SCORE_THRESHOLD) {
  const result = await sendFollowupSMS(lead);
  console.log("High-value lead detected → SMS follow-up sent — message id:", result.id);
}
