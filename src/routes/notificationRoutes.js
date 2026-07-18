const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  send,
  getStatus,
  getMyNotifications,
  getRateLimit,
  getOnline
} = require('../controllers/notificationController');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: APIs for sending and managing notifications
 */

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Queue a notification for asynchronous delivery
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - channel
 *               - content
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "00000000-0000-0000-0000-000000000000"
 *               channel:
 *                 type: string
 *                 enum: [email, sms, inapp]
 *                 example: email
 *               subject:
 *                 type: string
 *                 example: Test Notification
 *               content:
 *                 type: string
 *                 example: "<h1>Hello!</h1><p>This is a test notification.</p>"
 *               templateId:
 *                 type: string
 *                 format: uuid
 *               variables:
 *                 type: object
 *                 additionalProperties: true
 *               metadata:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       202:
 *         description: Notification successfully queued
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.post('/send', auth, send);

/**
 * @swagger
 * /api/notifications/me:
 *   get:
 *     summary: Get notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [email, sms, inapp]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User notifications returned successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, getMyNotifications);

/**
 * @swagger
 * /api/notifications/status/{id}:
 *   get:
 *     summary: Get notification delivery status
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification status returned successfully
 *       404:
 *         description: Notification not found
 */
router.get('/status/:id', auth, getStatus);

/**
 * @swagger
 * /api/notifications/online-users:
 *   get:
 *     summary: Get currently connected online users
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Online users returned successfully
 */
router.get('/online-users', auth, getOnline);

/**
 * @swagger
 * /api/notifications/rate-limit/{userId}/{channel}:
 *   get:
 *     summary: Check notification rate limit for a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *           enum: [email, sms, inapp]
 *     responses:
 *       200:
 *         description: Rate limit status returned successfully
 */
router.get('/rate-limit/:userId/:channel', auth, getRateLimit);

module.exports = router;