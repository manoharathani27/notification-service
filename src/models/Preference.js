const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Preference = sequelize.define('Preference', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
  emailEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  smsEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  inappEnabled: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

module.exports = Preference;
