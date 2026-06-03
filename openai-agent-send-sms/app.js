// openai-agent-send-sms — send SMS from an AI agent / AI workflow with Kudosity.
// Kudosity is the messaging action layer for AI agents: an agent decision becomes a real SMS.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_SENDER;

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

// AI agent calls this function to send SMS from an AI workflow.
async function sendSMS(recipient, message) {
  return postToKudosity("/v2/sms", { sender: SENDER, recipient, message });
}

// --- Simulated AI agent decision ---
// In a real AI workflow this is the output of an LLM / agent deciding to contact a customer.
const agentDecision = {
  shouldContact: true,
  recipient: "61412345678", // E.164 format
  message: "Hi! Your AI assistant here — your request has been confirmed.",
};

if (agentDecision.shouldContact) {
  const result = await sendSMS(agentDecision.recipient, agentDecision.message);
  console.log("Sent SMS from AI agent — message id:", result.id);
}
