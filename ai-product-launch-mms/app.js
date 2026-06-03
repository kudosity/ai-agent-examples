// ai-product-launch-mms — an AI marketing workflow generates a message and sends MMS with an image.
// Customer messaging for AI workflows: the agent writes the copy, the action layer sends the MMS.

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

async function sendMMS(recipient, subject, message, imageUrl) {
  return postToKudosity("/v2/mms", {
    sender: SENDER,
    recipient,
    subject,                  // max 20 ASCII characters
    message,
    content_urls: [imageUrl], // one media file, absolute URL, up to 400 KB (jpg/png/gif/mp3/mp4)
  });
}

// --- AI marketing workflow: generate message → send MMS with image ---
// Note: MMS currently delivers to Australia only.
const campaign = { product: "AeroPro" };
const message = `Introducing ${campaign.product} — launching today. Tap to explore.`;

const result = await sendMMS("61412345678", "New launch", message, "https://example.com/launch.jpg");
console.log("AI campaign → MMS sent — message id:", result.id);
