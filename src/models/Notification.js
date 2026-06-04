const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  channel: { type: DataTypes.ENUM('email', 'sms', 'inapp'), allowNull: false },
  templateId: { type: DataTypes.UUID, allowNull: true },
  subject: { type: DataTypes.STRING, allowNull: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('queued', 'sent', 'delivered', 'failed'),
    defaultValue: 'queued'
  },
  attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  failureReason: { type: DataTypes.TEXT, allowNull: true },
  sentAt: { type: DataTypes.DATE, allowNull: true },
  deliveredAt: { type: DataTypes.DATE, allowNull: true },
  metadata: { type: DataTypes.JSONB, defaultValue: {} }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['channel'] }
  ]
});

module.exports = Notification;
