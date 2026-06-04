require('dotenv').config();
const { Worker } = require('bullmq');
const Notification = require('../models/Notification');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { sendInAppNotification } = require('../services/socketService');
const { connectDB, sequelize } = require('../config/database');
const { connectRedis } = require('../config/redis');
const logger = require('../config/logger');
const { connection } = require('../config/queue');

async function processNotification(job) {
  const { notificationId, channel, subject, content, userEmail, userPhone, userId } = job.data;

  const notification = await Notification.findByPk(notificationId);
  if (!notification) throw new Error(`Notification ${notificationId} not found`);

  await notification.update({ attempts: notification.attempts + 1 });

  try {
    if (channel === 'email') {
      await sendEmail({ to: userEmail, subject, html: content });
    } else if (channel === 'sms') {
      if (!userPhone) throw new Error('User has no phone number');
      await sendSMS({ to: userPhone, body: content });
    } else if (channel === 'inapp') {
      sendInAppNotification(userId, { subject, content, notificationId });
    }

    await notification.update({ status: 'delivered', sentAt: new Date(), deliveredAt: new Date() });
    logger.info(`Notification ${notificationId} delivered via ${channel}`);
  } catch (err) {
    await notification.update({ status: 'failed', failureReason: err.message });
    logger.error(`Notification ${notificationId} failed: ${err.message}`);
    throw err; // triggers BullMQ retry
  }
}

function startWorker() {
  const worker = new Worker('notifications', processNotification, {
    connection,
    concurrency: 5
  });

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${err.message}`);
  });

  worker.on('error', (err) => {
    logger.error('Worker error:', err);
  });

  logger.info('Notification worker started');
  return worker;
}

// Allow running worker standalone
if (require.main === module) {
  (async () => {
    await connectDB();
    await sequelize.sync();
    await connectRedis();
    startWorker();
  })();
}

module.exports = { startWorker };
