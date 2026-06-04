const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

let ioInstance;
// Map of userId -> socketId
const onlineUsers = new Map();

function initSocketService(io) {
  ioInstance = io;

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    logger.info(`User ${socket.userId} connected via WebSocket`);

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      logger.info(`User ${socket.userId} disconnected`);
    });
  });
}

function sendInAppNotification(userId, payload) {
  if (!ioInstance) return false;
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    ioInstance.to(socketId).emit('notification', payload);
    logger.info(`In-app notification sent to user ${userId}`);
    return true;
  }
  logger.info(`User ${userId} not online — in-app notification not delivered`);
  return false;
}

function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}

module.exports = { initSocketService, sendInAppNotification, getOnlineUsers };
