const Notification = require('../models/Notification');
const Preference = require('../models/Preference');
const User = require('../models/User');
const { notificationQueue } = require('../config/queue');
const { renderTemplate } = require('./templateService');
const { checkRateLimit } = require('./rateLimitService');
const logger = require('../config/logger');

async function sendNotification({ userId, channel, templateId, subject, content, variables = {}, metadata = {} }) {
  // 1. Check user exists
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  // 2. Check user preferences
  const prefs = await Preference.findOne({ where: { userId } });
  if (prefs) {
    const channelEnabled = {
      email: prefs.emailEnabled,
      sms: prefs.smsEnabled,
      inapp: prefs.inappEnabled
    };
    if (!channelEnabled[channel]) {
      return { success: false, message: `User has disabled ${channel} notifications` };
    }
  }

  // 3. Check rate limit
  const rateCheck = await checkRateLimit(userId, channel);
  if (!rateCheck.allowed) {
    return { success: false, message: rateCheck.message, retryAfter: rateCheck.retryAfter };
  }

  // 4. Render template if templateId is provided
  let finalContent = content;
  let finalSubject = subject;
  if (templateId) {
    const rendered = await renderTemplate(templateId, { ...variables, userName: user.name });
    finalContent = rendered.content;
    finalSubject = rendered.subject || subject;
  }

  // 5. Create notification record
  const notification = await Notification.create({
    userId,
    channel,
    templateId,
    subject: finalSubject,
    content: finalContent,
    status: 'queued',
    metadata: { ...metadata, userEmail: user.email, userPhone: user.phone }
  });

  // 6. Add to BullMQ queue
  await notificationQueue.add('send', {
    notificationId: notification.id,
    userId,
    channel,
    subject: finalSubject,
    content: finalContent,
    userEmail: user.email,
    userPhone: user.phone
  }, { jobId: notification.id });

  logger.info(`Notification ${notification.id} queued for user ${userId} via ${channel}`);
  return { success: true, notificationId: notification.id, status: 'queued' };
}

async function getNotificationStatus(notificationId) {
  const notification = await Notification.findByPk(notificationId);
  if (!notification) throw new Error('Notification not found');
  return notification;
}

async function getUserNotifications(userId, { page = 1, limit = 20, channel, status } = {}) {
  const where = { userId };
  if (channel) where.channel = channel;
  if (status) where.status = status;
  const offset = (page - 1) * limit;
  const { rows, count } = await Notification.findAndCountAll({
    where, order: [['createdAt', 'DESC']], limit: parseInt(limit), offset
  });
  return { notifications: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) };
}

module.exports = { sendNotification, getNotificationStatus, getUserNotifications };
