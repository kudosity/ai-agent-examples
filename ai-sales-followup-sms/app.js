// ai-sales-followup-sms — send SMS from an AI workflow when lead scoring finds a high-value lead.
// Customer messaging for AI workflows: AI scores the lead, the action layer sends the follow-up.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_SENDER;
const SCORE_THRESHOLD = 80;

// Mock AI lead scoring — in production this is your model or scoring service.
function scoreLead(lead) {
  return lead.budget > 5000 && lead.engaged ? 90 : 40;
}

async function sendFollowupSMS(lead) {
  const res = await fetch("https://api.transmitmessage.com/v2/sms", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({
      sender: SENDER,
      recipient: lead.phone,
      message: `Hi ${lead.name}, thanks for your interest! A specialist will reach out shortly. Reply STOP to opt out.`,
      message_ref: `lead-${lead.id}`, // echoed back in webhooks to link the message to your CRM
    }),
  });
  if (!res.ok) throw new Error(`Kudosity SMS failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// --- AI workflow: lead scoring → high-value lead detected → send SMS follow-up ---
const lead = { id: 4471, name: "Sam", phone: "61412345678", budget: 9000, engaged: true };
if (scoreLead(lead) >= SCORE_THRESHOLD) {
  const result = await sendFollowupSMS(lead);
  console.log("High-value lead detected → SMS follow-up sent:", result.id);
}
