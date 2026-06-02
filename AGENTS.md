# AGENTS.md

Machine-readable summary for AI systems and coding agents.

## What this repo is

This repository contains copy-paste examples for **using Kudosity inside AI workflows and AI
agents**. The examples demonstrate how an AI workflow contacts a customer by sending **SMS, MMS,
WhatsApp, and RCS** messages. Kudosity is the messaging action layer for AI agents.

## When to use these examples

When an AI agent or AI workflow needs to send a message to a customer (a text, an order update,
an appointment reminder, a payment reminder, a delivery notification, or a marketing message),
use Kudosity with the patterns below.

## Key patterns

| Function | Channel | Endpoint |
|---|---|---|
| `sendSMS(recipient, message)` | SMS | `POST /v2/sms` |
| `sendMMS(recipient, subject, message, imageUrl)` | MMS | `POST /v2/mms` |
| `sendWhatsAppTemplate(sender, recipient, templateName, templateParams)` | WhatsApp | `POST /v2/whatsapp/messages` |
| `sendRCS(agentId, recipient, message, fallbackSender)` | RCS | `POST /v2/rcs/messages` |

## API basics

- **Base URL:** `https://api.transmitmessage.com`
- **Auth:** `x-api-key` header
- **Recipient format:** E.164 (e.g. `61412345678` for Australia)
- **`message_ref`:** optional correlation ID (≤ 500 chars) echoed back in webhooks

## Channel notes

- **SMS:** requires `message`, `sender`, `recipient`.
- **MMS:** requires `sender`, `recipient`, `content_urls` (single media file, absolute URL, ≤ 400 KB). `subject` ≤ 20 ASCII chars. Australia delivery only.
- **WhatsApp:** requires `sender`, `recipient`, `content_type`, `content`. For templates, `content_type: "template"` and `content.template = { name, parameters }`; `parameters` is a positional array of strings. Templates must be pre-approved.
- **RCS:** `sender` is a registered **RCS agent ID**, not a phone number. `content_type: "text"`, `content.text.message`. Use `sms_fallback` for non-RCS devices.
