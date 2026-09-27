# 🏛️ Complaint Tracker

> Bridging the gap between citizens and government bodies — a transparent platform for filing, tracking, and resolving public complaints.

---

## 📌 About

Complaint Tracker is a full-stack web application that enables the general public to register complaints directed at specific government departments, and track their resolution in real-time. Officials and admins get a dedicated dashboard to manage, respond to, and resolve complaints with complete transparency.

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Vite) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT + bcryptjs |
| **File Upload** | Multer |

## 📁 Project Structure

```
Complaint_Tracker/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── context/         # React Context (Auth)
│   │   ├── services/        # API service functions
│   │   └── utils/           # Helpers & constants
│   └── package.json
│
├── server/                  # Node.js + Express Backend
│   ├── config/              # DB connection & constants
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth, roles, validation, upload
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── utils/               # Seed data & helpers
│   ├── uploads/             # Complaint attachments
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (Atlas free tier or local installation)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/Complaint_Tracker.git
cd Complaint_Tracker
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env        # Fill in your MongoDB URI and JWT secret
npm run seed                 # Seed database with sample data
npm run dev                  # Starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev                  # Starts on http://localhost:5173
```

### 4. Sample Credentials (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tracker.com | admin123 |
| Public User | user1@test.com | user123 |

## ✨ Features

- [x] User Registration & Login (JWT Auth)
- [x] File Complaints (with category, department, location, attachments)
- [x] User Dashboard — track all your complaints
- [x] Admin Dashboard — view, filter, assign, and manage complaints
- [x] Status Tracking (Open → In Progress → Resolved → Closed)
- [x] Complaint Detail View with timeline/history
- [x] Role-based Access Control (Public, Official, Admin)
- [x] File Uploads for complaint evidence
- [ ] Email/SMS Notifications *(planned)*
- [ ] Analytics Dashboard *(planned)*

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/complaints` | File a complaint |
| GET | `/api/complaints` | List user's complaints |
| GET | `/api/complaints/:id` | Complaint details |
| PATCH | `/api/complaints/:id/status` | Update status |
| GET | `/api/admin/complaints` | All complaints (admin) |
| GET | `/api/departments` | List departments |

## 👥 Team

| Member | Role |
|--------|------|
| Member 1 | Frontend Lead |
| Member 2 | Frontend Developer |
| Member 3 | Backend Lead |
| Member 4 | Backend Developer |

## 📄 License

This project is developed as part of the **Software Engineering & Project Management** course (Mid-Semester Evaluation).
