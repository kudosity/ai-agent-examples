// ai-appointment-reminder-sms — AI detects an upcoming appointment and sends a reminder SMS.
// Customer messaging for AI workflows: the calendar triggers the agent, the agent sends the SMS.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_SENDER;
const REMIND_WITHIN_HOURS = 24;

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

async function sendReminderSMS(appointment) {
  return postToKudosity("/v2/sms", {
    sender: SENDER,
    recipient: appointment.phone,
    message: `Reminder: your appointment is at ${appointment.time}, ${appointment.location}.`,
  });
}

// --- AI workflow: calendar appointment → AI detects it's soon → send reminder SMS ---
const appointment = {
  phone: "61412345678",
  time: "2pm tomorrow",
  location: "12 Main St, Sydney",
  startsAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours away
};

const hoursUntil = (appointment.startsAt - Date.now()) / (60 * 60 * 1000);
if (hoursUntil <= REMIND_WITHIN_HOURS) {
  const result = await sendReminderSMS(appointment);
  console.log("Upcoming appointment → reminder SMS sent — message id:", result.id);
}
