# back-end-test-vista

Node.js + TypeScript + Express + Prisma (MySQL) API for Companies and Services.

## Setup

```bash
npm install
cp .env.example .env        # edit DATABASE_URL if needed
docker compose up -d db     # optional: local MySQL (root/password, db vista_test)
npx prisma migrate dev --name init
npm run dev                 # http://localhost:3000
```

Production-style run:

```bash
npm run build
npm run prisma:deploy
npm start
```

Docker (API + MySQL): `docker compose up --build`

## Endpoints

| Method | Path            | Description                          | Success |
|--------|-----------------|--------------------------------------|---------|
| POST   | /companies      | Create company                       | 201     |
| GET    | /companies      | List companies with their services   | 200     |
| POST   | /services       | Create service under a company       | 201     |
| GET    | /services/:id   | Get service by ID                    | 200     |

Errors: `400` validation (`{ message, errors[] }`), `404` not found, `409` duplicate registrationNumber, `500` unexpected.

API docs: import `postman_collection.json` into Postman.
