// ai-product-launch-mms — an AI marketing workflow generates a message and sends MMS with an image.
// Customer messaging for AI workflows: the agent writes the copy, the action layer sends the MMS.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_SENDER;

async function sendMMS(recipient, subject, message, imageUrl) {
  const res = await fetch("https://api.transmitmessage.com/v2/mms", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({
      sender: SENDER,
      recipient,
      subject,                  // max 20 ASCII characters
      message,
      content_urls: [imageUrl], // one media file, absolute URL, up to 400 KB (jpg/png/gif/mp3/mp4)
    }),
  });
  if (!res.ok) throw new Error(`Kudosity MMS failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// --- AI marketing workflow: generate message → send MMS with image ---
// Note: MMS currently delivers to Australia only.
const campaign = { product: "AeroPro" };
const message = `Introducing ${campaign.product} — launching today. Tap to explore. Reply STOP to opt out.`;

const result = await sendMMS("61412345678", "New launch", message, "https://example.com/launch.jpg");
console.log("AI campaign → MMS sent:", result.id);
