// ai-payment-reminder-whatsapp-template — AI sends a payment reminder via a pre-approved WhatsApp template.
// Payment reminder via a pre-approved WhatsApp template — no promotional content.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_WHATSAPP_SENDER; // registered WhatsApp sender number (E.164)

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
  const res = await fetch("https://api.transmitmessage.com/v2/whatsapp/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Kudosity WhatsApp failed: ${res.status} ${await res.text()}`);
  return res.json();
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
console.log("Payment reminder → WhatsApp template sent:", result.data?.id ?? result.id);
