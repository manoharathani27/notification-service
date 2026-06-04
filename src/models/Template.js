const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Template = sequelize.define('Template', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  channel: { type: DataTypes.ENUM('email', 'sms', 'inapp'), allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: true },  // for email only
  body: { type: DataTypes.TEXT, allowNull: false },       // Handlebars template
  variables: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] }
}, { timestamps: true });

module.exports = Template;
