// ai-delivery-update-rcs — AI sends a rich RCS delivery update with SMS fallback for non-RCS devices.
// Customer messaging for AI workflows: a delivery status change drives an RCS send.

const API_KEY = process.env.KUDOSITY_API_KEY;
const RCS_AGENT_ID = process.env.KUDOSITY_RCS_AGENT_ID; // RCS is sent through a registered agent ID, not a phone number
const SMS_FALLBACK_SENDER = process.env.KUDOSITY_SENDER;

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
  const res = await fetch("https://api.transmitmessage.com/v2/rcs/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Kudosity RCS failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// --- AI workflow: delivery status change → AI composes update → send RCS (SMS fallback) ---
const delivery = { order: "12345", status: "out for delivery", eta: "2pm", recipient: "61438333061" };
const message = `Your order #${delivery.order} is ${delivery.status}, ETA ${delivery.eta}.`;
const result = await sendRCS(RCS_AGENT_ID, delivery.recipient, message, SMS_FALLBACK_SENDER, `order-${delivery.order}`);
console.log("Delivery update → RCS sent:", result.data?.id ?? result.id);
