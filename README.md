🚢 OpenMarineTracker

A clean, production-ready API system for managing ships & users with JWT auth, secure validation, and a simple dashboard UI.

🔗 Live Demo

👉 https://openmarinetracker-production.up.railway.app/

(Includes an interactive HTML dashboard with user signup/login + ship CRUD UI.)

📦 GitHub Repository

👉 https://github.com/dhirj111/openmarinetracker

📘 Project Overview

OpenMarineTracker is a full backend + lightweight frontend project built to demonstrate:

REST API design

Secure authentication

MVC architecture

Validation & sanitization

MongoDB modelling

Role-based CRUD actions

Client-side dashboard for API testing

✨ Features
🔐 User Authentication

Register & Login with JWT tokens

Password hashing using bcryptjs

Email normalization + strict validation (Zod)

Secure cookie-based token support (optional)

🛡️ Security & Validation

✔ Zod schema validation for all fields
✔ Sanitization of email + trimming input
✔ Strict password policy
✔ Ownership checks for ship updates/deletes
✔ Centralized error handling
✔ Prevention of unauthorized access

🧱 Architecture (MVC + Clean Structure)
/controllers
/models
/routes
/middleware
/public (frontend)
server.js
.env


Controllers: Request handling & data flow

Models: Mongoose schemas + pre-save hooks

Middleware: Auth verification (JWT)

Routes: REST endpoints for users & ships

Public: Static dashboard for UI testing

🚀 API Endpoints
👤 User APIs
Method	Endpoint	Description
POST	/api/user/register	Register new user
POST	/api/user/login	Login & receive JWT
🚢 Ship APIs
Method	Endpoint	Description	Auth Required
GET	/api/ships	Get all ships	❌
GET	/api/ship/:id	Get single ship	❌
POST	/api/ship	Create new ship	✔
PUT	/api/ship/:id	Update ship	✔ (owner only)
DELETE	/api/ship/:id	Delete ship	✔ (owner only)


🗄️ Environment Variables

Create .env file:

PORT=8085
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

▶️ Run Locally
git clone https://github.com/dhirj111/openmarinetracker
cd openmarinetracker
npm install
npm start


Visit:
👉 http://localhost:8085

Auto-fill update fields

Popup messages for success/error
