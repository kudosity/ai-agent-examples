// ai-payment-reminder-rcs — AI sends a payment reminder over RCS with SMS fallback.
// Transactional payment reminder over RCS with SMS fallback — no promotional content.

const API_KEY = process.env.KUDOSITY_API_KEY;
const RCS_AGENT_ID = process.env.KUDOSITY_RCS_AGENT_ID; // RCS is sent through a registered agent ID, not a phone number
const SMS_FALLBACK_SENDER = process.env.KUDOSITY_SENDER;

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
  const res = await fetch("https://api.transmitmessage.com/v2/rcs/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Kudosity RCS failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// --- AI workflow: outstanding balance detected → AI composes reminder → send RCS (SMS fallback) ---
const account = {
  name: "John", last4: "4444", balance: "$150.00",
  payUrl: "https://pay.example.com/abcd", invoiceId: "7782", recipient: "61438333061",
};
const message = `Hi ${account.name}, payment reminder for your account ending ${account.last4}. ` +
  `Balance: ${account.balance}. Pay securely: ${account.payUrl}. Reply STOP to opt out.`;

const result = await sendRCS(RCS_AGENT_ID, account.recipient, message, SMS_FALLBACK_SENDER, `invoice-${account.invoiceId}`);
console.log("Payment reminder → RCS sent:", result.data?.id ?? result.id);
