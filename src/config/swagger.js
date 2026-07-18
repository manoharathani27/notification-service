const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notification Service API",
      version: "1.0.0",
      description:
        "Multi-channel notification microservice built with Node.js, Express, BullMQ, Redis, PostgreSQL, and deployed on Google Cloud Platform.",
    },
    servers: [
      {
        url: "https://notification-service-710340448406.asia-south1.run.app",
        description: "Production - Google Cloud Run",
      },
      {
        url: "http://localhost:3000",
        description: "Local Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;