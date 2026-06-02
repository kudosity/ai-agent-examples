// openai-agent-send-sms — send SMS from an AI agent / AI workflow with Kudosity.
// This is the messaging action layer for AI agents: an agent decision becomes a real SMS.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_SENDER;

// AI agent calls this function to send SMS from AI workflow.
async function sendSMS(recipient, message) {
  const res = await fetch("https://api.transmitmessage.com/v2/sms", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({ sender: SENDER, recipient, message }),
  });
  if (!res.ok) throw new Error(`Kudosity SMS failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// --- Simulated AI agent decision ---
// In a real AI workflow this is the output of an LLM / agent deciding to contact a customer.
const agentDecision = {
  shouldContact: true,
  recipient: "61412345678", // E.164 format
  message: "Hi! Your AI assistant here — your request has been confirmed. Reply STOP to opt out.",
};

if (agentDecision.shouldContact) {
  const result = await sendSMS(agentDecision.recipient, agentDecision.message);
  console.log("Sent SMS from AI agent:", result.id, result.status);
}
