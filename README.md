# Notification Service

A production-ready, cloud-deployed multi-channel notification microservice built with Node.js, Express.js, BullMQ, Redis, and PostgreSQL.

The service provides asynchronous notification processing for Email, SMS, and In-App notifications with JWT authentication, retry mechanisms, rate limiting, user preferences, templates, and delivery tracking.

The application is containerized using Docker and deployed on Google Cloud Platform (GCP).

---

## Live Deployment

The backend service is deployed on Google Cloud Run.

Health Check:

`https://notification-service-710340448406.asia-south1.run.app/health`

Expected response:

```json
{
  "status": "ok",
  "service": "notification-service"
}
```

---

## Architecture

```text
                     Client / Application
                             |
                             v
                    REST API Request
                             |
                             v
                  Google Cloud Run
                (Node.js + Express.js)
                             |
                 JWT Authentication
                             |
              +--------------+--------------+
              |                             |
              v                             v
       Cloud SQL                       BullMQ Queue
      (PostgreSQL)                          |
                                            v
                                    Memorystore Redis
                                            |
                                            v
                                   Notification Worker
                                            |
                          +-----------------+-----------------+
                          |                 |                 |
                          v                 v                 v
                        Email              SMS             In-App
                     Nodemailer          Twilio           Socket.io
                          |
                          v
                       Gmail SMTP

              Secrets -> GCP Secret Manager
              Images  -> Artifact Registry
```

---

## GCP Deployment Architecture

The production environment uses:

- Cloud Run - Hosts the containerized Node.js application
- Cloud SQL - Managed PostgreSQL database
- Memorystore for Redis - Redis backend for BullMQ
- Secret Manager - Secure storage for sensitive credentials
- Artifact Registry - Stores Docker container images
- VPC Networking - Allows Cloud Run to communicate with Redis using private networking

---

## Features

- Multi-channel notifications: Email, SMS, and In-App
- Asynchronous notification processing using BullMQ
- Redis-backed job queues
- Automatic retry mechanism for failed jobs
- PostgreSQL-based notification persistence
- JWT authentication
- User notification preferences
- Handlebars-based notification templates
- Per-user rate limiting
- Notification delivery tracking
- WebSocket-based In-App notifications
- Docker containerization
- Cloud-native deployment on GCP
- Secure credential management using Secret Manager

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Backend Framework | Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| Queue | BullMQ |
| Cache / Queue Backend | Redis |
| Authentication | JWT |
| Email | Nodemailer |
| SMS | Twilio |
| Real-Time Communication | Socket.io |
| Templates | Handlebars |
| Containerization | Docker |
| Cloud Platform | Google Cloud Platform |
| Compute | Cloud Run |
| Managed Database | Cloud SQL |
| Managed Redis | Memorystore for Redis |
| Container Registry | Artifact Registry |
| Secrets | Secret Manager |

---

## Notification Flow

```text
POST /api/notifications/send
          |
          v
    JWT Authentication
          |
          v
   Validate Request
          |
          v
 Save Notification
   in PostgreSQL
          |
          v
 Add Job to BullMQ
          |
          v
 Memorystore Redis
          |
          v
 Notification Worker
          |
          v
 Email / SMS / In-App
          |
          v
 Update Delivery Status
   in PostgreSQL
```

---

## Email Notification Flow

The Email notification workflow has been tested end-to-end in the deployed GCP environment.

```text
API Request
    |
    v
Cloud Run
    |
    v
BullMQ
    |
    v
Memorystore Redis
    |
    v
Notification Worker
    |
    v
Nodemailer
    |
    v
Gmail SMTP
    |
    v
Email Delivered
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- Docker (recommended)
- Gmail App Password for email delivery
- Twilio account (optional for SMS)

### Clone the repository

```bash
git clone https://github.com/manoharathani27/notification-service.git
cd notification-service
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy `.env.example` to `.env` and configure your local environment.

```bash
cp .env.example .env
```

Never commit the `.env` file to Git.

### Run locally

```bash
npm run dev
```

### Run using Docker Compose

```bash
docker-compose up --build
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get authenticated user |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notifications/send` | Queue a notification |
| GET | `/api/notifications/me` | Get user notifications |
| GET | `/api/notifications/status/:id` | Get notification status |
| GET | `/api/notifications/online-users` | Get online users |
| GET | `/api/notifications/rate-limit/:userId/:channel` | Check rate limit |

### Templates

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/templates` | Create template |
| GET | `/api/templates` | Get templates |
| GET | `/api/templates/:id` | Get template |
| PUT | `/api/templates/:id` | Update template |
| DELETE | `/api/templates/:id` | Delete template |

### Preferences

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/preferences` | Get notification preferences |
| PUT | `/api/preferences` | Update notification preferences |

---

## Example: Register User

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "your_secure_password"
}
```

---

## Example: Send Email Notification

Endpoint:

```text
POST /api/notifications/send
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

Request:

```json
{
  "userId": "USER_UUID",
  "channel": "email",
  "subject": "Notification Service Test",
  "content": "<h1>Hello!</h1><p>Your notification was processed successfully.</p>"
}
```

The API returns HTTP `202 Accepted` when the notification is successfully queued for asynchronous processing.

---

## Notification Lifecycle

```text
Queued
   |
   v
Processing
   |
   +------> Delivered
   |
   +------> Failed
              |
              v
             Retry
```

Notification status and delivery information are persisted in PostgreSQL.

---

## Security

The production deployment uses GCP Secret Manager for sensitive configuration.

Examples include:

- Database password
- JWT signing secret
- Gmail App Password

Secrets are injected securely into Cloud Run and are never committed to the repository.

The `.env` file is excluded using `.gitignore`.

---

## Cloud Deployment

The application Docker image is built locally and pushed to Google Artifact Registry.

```text
Source Code
    |
    v
Docker Image
    |
    v
Artifact Registry
    |
    v
Cloud Run
    |
    +----> Cloud SQL
    |
    +----> Memorystore Redis
    |
    +----> Secret Manager
```

---

## Future Improvements

- OpenAPI / Swagger documentation
- CI/CD using GitHub Actions
- Dedicated Cloud Run worker service
- Pub/Sub integration
- Dead Letter Queue support
- Monitoring and alerting
- Automated integration tests
- SMS production testing
- Frontend dashboard for notification management

---

## Author

**Manohar Mahadev Athani**

- GitHub: @manoharathani27
- LinkedIn: manoharathani