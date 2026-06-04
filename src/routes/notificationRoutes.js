const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { send, getStatus, getMyNotifications, getRateLimit, getOnline } = require('../controllers/notificationController');

router.post('/send', auth, send);
router.get('/me', auth, getMyNotifications);
router.get('/online-users', auth, getOnline);
router.get('/status/:id', auth, getStatus);
router.get('/rate-limit/:userId/:channel', auth, getRateLimit);

module.exports = router;
