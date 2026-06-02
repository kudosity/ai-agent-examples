// ai-appointment-reminder-sms — AI detects an upcoming appointment and sends a reminder SMS.
// Customer messaging for AI workflows: the calendar triggers the agent, the agent sends the SMS.

const API_KEY = process.env.KUDOSITY_API_KEY;
const SENDER = process.env.KUDOSITY_SENDER;
const REMIND_WITHIN_HOURS = 24;

async function sendReminderSMS(appointment) {
  const res = await fetch("https://api.transmitmessage.com/v2/sms", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({
      sender: SENDER,
      recipient: appointment.phone,
      message: `Reminder: your appointment is at ${appointment.time}, ${appointment.location}. Reply STOP to opt out.`,
    }),
  });
  if (!res.ok) throw new Error(`Kudosity SMS failed: ${res.status} ${await res.text()}`);
  return res.json();
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
  console.log("Upcoming appointment → reminder SMS sent:", result.id);
}
