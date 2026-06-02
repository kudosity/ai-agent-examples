// ai-order-update-whatsapp-template — AI selects a pre-approved WhatsApp template for an order update.
// Customer messaging for AI workflows: an order status change drives a WhatsApp template send.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_WHATSAPP_SENDER; // registered WhatsApp sender number (E.164)

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
  const res = await fetch("https://api.transmitmessage.com/v2/whatsapp/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Kudosity WhatsApp failed: ${res.status} ${await res.text()}`);
  return res.json();
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
console.log("Order update → WhatsApp template sent:", result.data?.id ?? result.id);
