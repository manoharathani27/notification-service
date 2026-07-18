const { Sequelize } = require("sequelize");
const logger = require("./logger");

const config = {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

if (process.env.INSTANCE_CONNECTION_NAME) {
  config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
  config.host = process.env.DB_HOST || "localhost";
  config.port = process.env.DB_PORT || 5432;
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  config
);

async function connectDB() {
  await sequelize.authenticate();
  logger.info("PostgreSQL connected successfully");
}

module.exports = { sequelize, connectDB };