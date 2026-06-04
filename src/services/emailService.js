const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: `"Notification Service" <${process.env.EMAIL_FROM}>`,
    to,
    subject: subject || 'Notification',
    html
  });
  logger.info(`Email sent to ${to} — MessageId: ${info.messageId}`);
  return info;
}

async function verifyConnection() {
  await transporter.verify();
  logger.info('Email transporter verified');
}

module.exports = { sendEmail, verifyConnection };
