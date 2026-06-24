# TaskFlow — Full-Stack MERN Task Manager

A modern, production-ready Task Manager web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Features secure JWT authentication, full CRUD operations, real-time filtering & sorting, a statistics dashboard, and a premium dark-mode UI with glassmorphism design.

## ✨ Features

### Authentication & Authorization
- **User Registration** — Sign up with name, email, and password (bcrypt-hashed)
- **User Login** — Secure JWT-based authentication
- **Protected Routes** — All task APIs require valid JWT tokens
- **Authorization** — Users can only access and modify their own tasks

### Task Management
- **Create Tasks** — Title, description, priority (Low/Medium/High), due date
- **Read Tasks** — Fetch all user tasks or single task by ID
- **Update Tasks** — Edit any task detail (owner-only)
- **Delete Tasks** — Delete individual tasks or bulk-delete completed tasks
- **Toggle Completion** — Mark tasks as completed or pending

### Filtering, Searching & Sorting
- **Filter** — All / Pending / Completed status pills
- **Search** — Real-time debounced search by title and description
- **Sort** — Newest, Oldest, Priority, Due Date

### Task Statistics Dashboard
- Total Tasks count
- Completed Tasks count
- Pending Tasks count
- Overdue Tasks count (past due date, not completed)

### Frontend
- React.js with Vite for fast development
- Premium dark-mode glassmorphism UI
- Animated background with floating gradient orbs
- Toast notifications for all actions
- Task cards with priority color indicators
- Modal-based task create/edit forms
- Loading skeletons during API calls
- Fully responsive (mobile, tablet, desktop)

### Backend
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication middleware
- Input validation with express-validator
- Global error handling middleware
- Clean, scalable folder structure

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js 19, Vite, React Router, Axios, React Hot Toast, React Icons, date-fns |
| **Backend** | Node.js, Express.js 4, Mongoose 8, JWT, bcryptjs |
| **Database** | MongoDB (Atlas or local) |
| **Styling** | Vanilla CSS with custom design system |
| **Auth** | JSON Web Tokens (JWT) |

---

## 📁 Project Structure

```
Task Manager Major/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, GetMe
│   │   └── taskController.js      # CRUD, Stats, Toggle, Bulk Delete
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── errorMiddleware.js     # Global error handler
│   │   └── validateMiddleware.js  # Request validation
│   ├── models/
│   │   ├── User.js                # User schema + bcrypt
│   │   └── Task.js                # Task schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express app entry
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js           # Axios with JWT interceptors
│   │   ├── components/            # UI components
│   │   ├── context/               # Auth & Task contexts
│   │   ├── hooks/                 # Custom hooks
│   │   ├── pages/                 # Route pages
│   │   ├── styles/index.css       # Design system
│   │   ├── utils/helpers.js       # Utility functions
│   │   ├── App.jsx                # Root + routing
│   │   └── main.jsx               # Vite entry
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) account)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Task Manager Major"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev    # Development (with nodemon)
npm start      # Production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.  
The Vite dev server proxies `/api` requests to `http://localhost:5000`.

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ Public |
| POST | `/api/auth/login` | Login user | ❌ Public |
| GET | `/api/auth/me` | Get current user profile | ✅ Required |

#### POST `/api/auth/register`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST `/api/auth/login`
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Task Endpoints

> All task endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with filters) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion |
| DELETE | `/api/tasks/completed/all` | Delete all completed tasks |
| GET | `/api/tasks/stats` | Get task statistics |

#### GET `/api/tasks` — Query Parameters
| Param | Values | Default |
|-------|--------|---------|
| `status` | `all`, `pending`, `completed` | `all` |
| `search` | any string (searches title & description) | — |
| `sort` | `newest`, `oldest`, `priority`, `dueDate` | `newest` |

**Example:** `GET /api/tasks?status=pending&sort=priority&search=homework`

#### POST `/api/tasks`
**Request Body:**
```json
{
  "title": "Complete project report",
  "description": "Write the final section",
  "priority": "high",
  "dueDate": "2025-01-15"
}
```

#### GET `/api/tasks/stats`
**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 4,
    "pending": 6,
    "overdue": 2
  }
}
```

---

### Error Responses

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error / Bad request |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not the task owner) |
| 404 | Resource not found |
| 500 | Server error |

---

## 🔐 Security Features

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT tokens with 30-day expiration
- Protected API routes with auth middleware
- Ownership validation before update/delete
- Input sanitization and validation
- Helmet.js for HTTP security headers
- CORS configuration

---

## 📱 Responsive Design

The UI is fully responsive and optimized for:
- 📱 Mobile (< 480px)
- 📱 Tablet (480px – 768px)
- 💻 Desktop (> 768px)

---

## 👤 Author

**Bibek Meher**

---

## 📄 License

This project is created for educational purposes as a college major project.

