# Products Inventory API

A REST API for managing a product inventory, built with Node.js, Express, and MongoDB.

## Overview

This service exposes a small inventory backend: users can register and log in,
and authenticated **admin** users can create, update, and delete products, while
the product catalog is readable by anyone. Authentication is handled with JWT,
and authorization is enforced through route middleware. Product writes are
validated before they reach the database, and the product listing endpoint is
paginated.

## Features

- User registration and login with hashed passwords (bcrypt).
- Stateless authentication using JSON Web Tokens.
- Role-based authorization (`user` / `admin`); only admins can modify products.
- Full product CRUD with request validation via `express-validator`.
- Paginated, sorted product listing (10 per page, newest first).

## Tech stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB via Mongoose
- **Auth:** jsonwebtoken, bcryptjs
- **Validation:** express-validator

## Getting started

### Prerequisites

- Node.js
- A MongoDB connection string (local or MongoDB Atlas)

### Install

```bash
npm install
```

### Configure

Create a `.env` file in the project root (see `.env.example`):

```bash
PORT=3000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### Run

```bash
npm run dev    # start with nodemon (auto-reload)
npm start      # start with node
```

The server listens on `PORT` (default `3000`).

## API

| Method | Endpoint         | Auth         | Description                       |
| ------ | ---------------- | ------------ | --------------------------------- |
| POST   | `/auth/register` | Public       | Register a new user               |
| POST   | `/auth/login`    | Public       | Log in and receive a JWT          |
| GET    | `/products`      | Public       | List products (paginated)         |
| GET    | `/products/:id`  | Public       | Get a single product              |
| POST   | `/products`      | Admin        | Create a product                  |
| PUT    | `/products/:id`  | Admin        | Update a product                  |
| DELETE | `/products/:id`  | Admin        | Delete a product                  |

Protected routes expect an `Authorization: Bearer <token>` header.

### Example

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123","role":"admin"}'

# Log in to get a token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123"}'

# Create a product (admin only)
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Keyboard","category":"Electronics","price":49.99,"quantity":100}'
```

## Project structure

```
config/       MongoDB connection
controllers/  Route handlers (auth, products)
middleware/   JWT/role guards, product validation
models/       Mongoose schemas (User, Product)
routes/       Express routers
server.js     App entry point
```

See [Query-Optimizations.md](Query-Optimizations.md) for notes on indexing,
caching, and pagination strategies for high-traffic scenarios.
