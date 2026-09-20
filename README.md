# AppliJobTrack — Job Application Tracker Portal

> A full-stack MERN application for tracking job applications, interview stages, offers, and job-search analytics.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=json-web-tokens)

---

## Problem Statement

Students and professionals often apply to multiple jobs through LinkedIn, Indeed, Naukri, company career portals, referrals, and other sources.

Without a centralized system:

- Applications can be forgotten
- Interview dates can be missed
- Application stages become difficult to track
- Offer deadlines can be overlooked
- It becomes difficult to understand job-search progress

**AppliJobTrack** provides a centralized dashboard for managing job applications and monitoring the complete application pipeline.

---

## Features

| Feature | Description |
|---|---|
| Authentication | JWT-based registration and login with bcrypt password hashing |
| Add Applications | Store company, role, location, salary, source, URL, and application details |
| Stage Tracking | Track applications through Saved -> Applied -> OA -> Interview -> Offer -> Accepted |
| Priority Flag | Mark important applications |
| Search & Filter | Search by company or role and filter applications by stage or source |
| Dashboard | View application statistics, recent applications, and source breakdown |
| Kanban Board | Visualize the application pipeline and move applications between stages |
| Reports & Analytics | View application trends and analytics using charts |
| Responsive UI | Designed for desktop and mobile screen sizes |

---

## Tech Stack

### Frontend

- React.js 18
- React Router v6
- Axios
- Recharts
- React Hot Toast
- Custom CSS

### Backend

- Node.js
- Express.js
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- Express Validator
- Morgan
- CORS
- dotenv

### Database

- MongoDB
- MongoDB Atlas or local MongoDB

---

## Project Structure

```text
AppliJobTrack/
|
+-- client/                         # React frontend
|   +-- public/
|   |   +-- index.html
|   |
|   +-- src/
|       +-- components/             # Reusable UI components
|       +-- context/                # Global authentication state
|       +-- pages/                  # Application pages
|       +-- services/               # Frontend service/API logic
|       +-- utils/                  # Utility functions
|       +-- App.js                  # Application routes
|       +-- index.js                # React entry point
|   |
|   +-- package.json
|
+-- server/                         # Express backend
|   +-- config/
|   |   +-- db.js                   # MongoDB connection
|   |
|   +-- controllers/
|   |   +-- authController.js
|   |   +-- applicationController.js
|   |   +-- dashboardController.js
|   |
|   +-- middleware/
|   |   +-- authMiddleware.js
|   |
|   +-- models/
|   |   +-- User.js
|   |   +-- JobApplication.js
|   |
|   +-- routes/
|   |   +-- authRoutes.js
|   |   +-- applicationRoutes.js
|   |   +-- dashboardRoutes.js
|   |
|   +-- .env.example
|   +-- index.js                    # Express server entry point
|   +-- package.json
|
+-- docs/                           # Project documentation/screenshots
+-- .gitignore
+-- README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get the currently authenticated user |

### Applications

All application endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | Get applications with filters |
| POST | `/api/applications` | Create a new application |
| GET | `/api/applications/:id` | Get a single application |
| PUT | `/api/applications/:id` | Update an application |
| DELETE | `/api/applications/:id` | Delete an application |
| PATCH | `/api/applications/:id/stage` | Update application stage |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Get dashboard analytics |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check whether the backend API is running |

Example response:

```json
{
  "success": true,
  "message": "AppliJobTrack API is running"
}
```

---

## Installation & Setup

### Prerequisites

Make sure the following are installed:

- Node.js 18 or higher
- npm
- MongoDB local server or MongoDB Atlas
- Git

### 1. Clone the repository

```bash
git clone https://github.com/vishuu-patil-001/AppliJobTrack.git
cd AppliJobTrack
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create:

```text
server/.env
```

Use the following structure:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/job_tracker
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> Never commit your actual `.env` file or private credentials to GitHub.

### 4. Start the backend

From the `server` directory:

```bash
npm start
```

For development with nodemon:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another PowerShell terminal:

```powershell
cd "C:\Users\vishw\Downloads\Projects\job-application-tracker-portal-main\client"
npm install
```

### 6. Start the frontend

```powershell
npm start
```

Frontend:

```text
http://localhost:3000
```

---

## Running the Project

You need two terminals during local development.

### Terminal 1 — Backend

```powershell
cd "C:\Users\vishw\Downloads\Projects\job-application-tracker-portal-main\server"
npm start
```

Expected output:

```text
Server running on port 5000
MongoDB connected: localhost
```

### Terminal 2 — Frontend

```powershell
cd "C:\Users\vishw\Downloads\Projects\job-application-tracker-portal-main\client"
npm start
```

Then open:

```text
http://localhost:3000
```

---

## MongoDB

The application uses MongoDB through Mongoose.

For local MongoDB:

```env
MONGO_URI=mongodb://localhost:27017/job_tracker
```

For MongoDB Atlas, replace the value with your Atlas connection string.

Keep database credentials private and do not upload them to GitHub.

---

## Application Flow

```text
Register
   |
   v
Login
   |
   v
JWT Authentication
   |
   v
Dashboard
   |
   v
Add Job Application
   |
   v
Track Application Stage
   |
   v
Interview / Offer
   |
   v
Accepted / Final Stage
   |
   v
View Reports & Analytics
```

---

## Application Stages

Applications can be tracked through the following stages:

```text
Saved
  |
  v
Applied
  |
  v
OA
  |
  v
Interview
  |
  v
Offer
  |
  v
Accepted
```

The Kanban board provides a visual representation of this pipeline.

---

## Security

The backend uses:

- JWT authentication
- bcrypt password hashing
- Protected API routes
- Environment variables for configuration
- CORS configuration
- Server-side request validation

Private configuration values should be stored in `server/.env` and excluded from Git.

---

## Screenshots

Project screenshots can be stored under:

```text
docs/screenshots/
```

Recommended screenshots include:

- Registration page
- Login page
- Dashboard
- Applications page
- Kanban board
- Add Application modal
- Reports and Analytics
- MongoDB collections

---

## Learning Outcomes

This project demonstrates practical experience with:

- Full-stack MERN application architecture
- React component development
- React Router
- Context API
- Axios API integration
- JWT authentication
- Password hashing with bcrypt
- REST API development with Express
- MongoDB and Mongoose
- CRUD operations
- Protected routes
- Dashboard analytics
- Data visualization with Recharts
- Responsive frontend development
- Git and GitHub version control

---

## Author

**Vishwjit Pandurang Upase**

GitHub:

https://github.com/vishuu-patil-001

LinkedIn:

https://www.linkedin.com/in/mr-vishwjit-p-upase

---

## Repository

GitHub repository:

https://github.com/vishuu-patil-001/AppliJobTrack


