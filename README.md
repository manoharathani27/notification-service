# Notification Service

A production-grade multi-channel notification microservice built with Node.js, BullMQ, Redis, and PostgreSQL. Supports Email, SMS, and In-App (WebSocket) delivery with retry logic, template engine, user preferences, and rate limiting.

---

## Architecture

```
Any Service  ──▶  POST /api/notifications/send
                          │
                    BullMQ Queue (Redis)
                          │
              ┌───────────┼───────────┐
        Email Worker   SMS Worker  In-App Worker
        (Nodemailer)   (Twilio)   (Socket.io)
              └───────────┼───────────┘
                    PostgreSQL
                 (Delivery Logs)
```

---

## Features

- **Multi-channel delivery** — Email (Nodemailer), SMS (Twilio), In-App (WebSocket)
- **Job Queue** — BullMQ with Redis for async processing and automatic retries
- **Template Engine** — Handlebars-based reusable templates stored in PostgreSQL
- **User Preferences** — Per-user opt-in/out per channel
- **Rate Limiting** — Redis-based counter (e.g. max 5 emails/hour per user)
- **Delivery Tracking** — Full lifecycle: `queued → sent → delivered → failed`
- **JWT Auth** — Secure all endpoints
- **Docker** — One command setup with Docker Compose

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Queue | BullMQ + Redis |
| Database | PostgreSQL + Sequelize |
| Real-time | Socket.io |
| Email | Nodemailer |
| SMS | Twilio |
| Templates | Handlebars |
| Auth | JWT |
| Containerization | Docker |

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- Redis
- (Optional) Twilio account for SMS

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/notification-service.git
cd notification-service
```

### 2. Setup environment

```bash
cp .env.example .env
# Fill in your DB, Redis, Email, and Twilio credentials
```

### 3. Run with Docker (recommended)

```bash
docker-compose up --build
```

### 4. Run locally

```bash
npm install
npm run dev
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notifications/send` | Send a notification |
| GET | `/api/notifications/me` | Get my notifications |
| GET | `/api/notifications/status/:id` | Get notification status |
| GET | `/api/notifications/rate-limit/:userId/:channel` | Check rate limit |

### Templates

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/templates` | Create a template |
| GET | `/api/templates` | List all templates |
| GET | `/api/templates/:id` | Get template by ID |
| PUT | `/api/templates/:id` | Update template |
| DELETE | `/api/templates/:id` | Delete template |

### Preferences

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/preferences` | Get my preferences |
| PUT | `/api/preferences` | Update my preferences |

---

## Example Requests

### Register
```json
POST /api/auth/register
{
  "name": "Manohar",
  "email": "manohar@example.com",
  "password": "securepassword",
  "phone": "+919353599181"
}
```

### Send Email Notification via Template
```json
POST /api/notifications/send
Authorization: Bearer <token>

{
  "userId": "uuid-of-user",
  "channel": "email",
  "templateId": "uuid-of-template",
  "variables": { "orderNumber": "ORD123", "amount": "499" }
}
```

### Send Direct In-App Notification
```json
POST /api/notifications/send
Authorization: Bearer <token>

{
  "userId": "uuid-of-user",
  "channel": "inapp",
  "subject": "New Message",
  "content": "You have a new message from Manohar."
}
```

### Update Preferences
```json
PUT /api/preferences
Authorization: Bearer <token>

{
  "emailEnabled": true,
  "smsEnabled": false,
  "inappEnabled": true
}
```

---

## Notification Lifecycle

```
queued  ──▶  sent  ──▶  delivered
                 └──▶  failed  ──▶  (retry x3)
```

Every state change is timestamped in PostgreSQL and queryable via `/status/:id`.

---

## WebSocket (In-App)

Connect with a valid JWT token:

```js
const socket = io('http://localhost:3000', {
  auth: { token: 'your_jwt_token' }
});

socket.on('notification', (data) => {
  console.log('New notification:', data);
});
```

---

## Rate Limits

| Channel | Limit |
|---|---|
| Email | 5 per hour per user |
| SMS | 3 per hour per user |
| In-App | 50 per hour per user |

Configurable via `.env` variables `MAX_EMAILS_PER_HOUR` and `MAX_SMS_PER_HOUR`.

---

## Author

**Manohar Mahadev Athani**
- GitHub: [@manoharathani27](https://github.com/manoharathani27)
- LinkedIn: [manoharathani](https://linkedin.com/in/manoharathani)
