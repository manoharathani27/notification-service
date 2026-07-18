require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const { connectDB, sequelize } = require('./config/database');
const { connectRedis } = require('./config/redis');
const logger = require('./config/logger');
const { initSocketService } = require('./services/socketService');
const { startWorker } = require('./workers/notificationWorker');

// Routes
const notificationRoutes = require('./routes/notificationRoutes');
const templateRoutes = require('./routes/templateRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/preferences', preferenceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    // Database is required
    await connectDB();
    await sequelize.sync({ alter: true });

    // Start the HTTP server immediately
    server.listen(PORT, () => {
      logger.info(`Notification Service running on port ${PORT}`);
    });

    // Initialize Socket.IO
    initSocketService(io);

    // Connect Redis in the background
    connectRedis()
      .then(() => {
        logger.info("Redis connected successfully");
        startWorker();
      })
      .catch((err) => {
        logger.error("Redis connection failed:", err.message);
        logger.warn("Application is running without Redis. Worker not started.");
      });

  } catch (err) {
    logger.error("Failed to connect PostgreSQL:", err);
    process.exit(1);
  }
}

bootstrap();

module.exports = { app, io };
