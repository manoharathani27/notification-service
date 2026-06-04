const twilio = require('twilio');
const logger = require('../config/logger');

let client;

function getTwilioClient() {
  if (!client) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return client;
}

async function sendSMS({ to, body }) {
  const twilioClient = getTwilioClient();
  const message = await twilioClient.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });
  logger.info(`SMS sent to ${to} — SID: ${message.sid}`);
  return message;
}

module.exports = { sendSMS };
