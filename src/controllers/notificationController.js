const { sendNotification, getNotificationStatus, getUserNotifications } = require('../services/notificationService');
const { getRateLimitStatus } = require('../services/rateLimitService');
const { getOnlineUsers } = require('../services/socketService');

async function send(req, res) {
  try {
    const { userId, channel, templateId, subject, content, variables, metadata } = req.body;
    if (!userId || !channel) {
      return res.status(400).json({ success: false, message: 'userId and channel are required' });
    }
    if (!['email', 'sms', 'inapp'].includes(channel)) {
      return res.status(400).json({ success: false, message: 'channel must be email, sms, or inapp' });
    }
    if (!templateId && !content) {
      return res.status(400).json({ success: false, message: 'Either templateId or content is required' });
    }
    const result = await sendNotification({ userId, channel, templateId, subject, content, variables, metadata });
    const statusCode = result.success ? 202 : 429;
    res.status(statusCode).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getStatus(req, res) {
  try {
    const notification = await getNotificationStatus(req.params.id);
    res.json({ success: true, notification });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
}

async function getMyNotifications(req, res) {
  try {
    const { page, limit, channel, status } = req.query;
    const result = await getUserNotifications(req.user.id, { page, limit, channel, status });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getRateLimit(req, res) {
  try {
    const { userId, channel } = req.params;
    const status = await getRateLimitStatus(userId, channel);
    res.json({ success: true, rateLimit: status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getOnline(req, res) {
  res.json({ success: true, onlineUsers: getOnlineUsers() });
}

module.exports = { send, getStatus, getMyNotifications, getRateLimit, getOnline };
