# 🗂️ Complaint Tracker

A full-stack **Complaint Management System** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). The platform enables citizens/students to file, track, and manage complaints across multiple government/institutional departments, while providing staff and administrators with tools to triage, assign, and resolve issues efficiently.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [Running the Application](#-running-the-application)
- [Sample Login Credentials](#-sample-login-credentials)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Frontend Pages & Components](#-frontend-pages--components)
- [Role-Based Access Control](#-role-based-access-control)
- [Status Workflow](#-status-workflow)
- [Testing](#-testing)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

### Authentication & Authorization
- **User Registration** — New users can sign up with name, email, and password (default role: `student`).
- **User Login** — Secure login with email/password, returning a JWT token.
- **JWT-Based Auth** — All protected routes require a valid Bearer token.
- **Role-Based Access Control (RBAC)** — Four roles: `student`, `faculty`, `staff`, `admin`, each with specific permissions.
- **Protected Routes** — Frontend guards pages by role; unauthorized users are redirected.
- **Profile Management** — Users can update their name and department.
- **Password Change** — Authenticated users can change their password securely.

### Complaint Management
- **File a Complaint** — Users can submit complaints with:
  - Title & detailed description
  - Department selection (dynamically loaded from DB)
  - Category selection (populated based on chosen department)
  - Priority level (Low / Medium / High / Urgent)
  - File attachments (up to 3 files — images, PDFs, documents; max 5 MB each)
- **View My Complaints** — Students/faculty see only their own complaints.
- **Complaint Details View** — Detailed page showing full complaint info, status badges, priority, department, filed-by info, attachments, location data, and timeline history.
- **Filter Complaints** — Client-side filtering by status (`Open`, `In Progress`, `Resolved`, `Closed`) on the dashboard.

### Staff Features
- **Staff Dashboard** — Staff members see only complaints assigned to them.
- **Quick Stats** — At-a-glance counts of total assigned, open, in-progress, and resolved complaints.
- **Status Transitions** — Staff can update complaint status following the defined workflow (with optional comments).
- **Status Filtering** — Filter assigned complaints by status with badge counts on tabs.

### Admin Features
- **Admin Dashboard** — Overview panel with:
  - Total complaints, open, in-progress, resolved, closed counts
  - Total registered users and departments
  - Department-wise complaint breakdown table (with status counts per department)
  - Recent complaints list (latest 5)
- **All Complaints View** — Full table of every complaint in the system with:
  - Search by title/description (server-side regex search)
  - Filter by status, department, and priority
  - Clear-filters functionality
  - Tabular view with title, filed-by, department, status badges, priority badges, assignee, date, and action links
- **Assign Staff** — Admin can assign any complaint to a staff member from a dropdown of all staff users.
- **User Management** — Admin can view all users and update user roles.

### Complaint Timeline
- **Automatic Timeline Entry** — When a complaint is created, an initial timeline entry is auto-generated.
- **Timeline Updates** — Each status change or staff assignment appends a timestamped entry with:
  - New status
  - Comment/note
  - Who made the update (name + role)
  - Timestamp
- **Visual Timeline** — Frontend renders a vertical timeline with status-colored icons, connectors, and formatted dates.

### File Uploads
- **Multer Integration** — Server-side file handling with disk storage.
- **File Validation** — Only JPEG, JPG, PNG, GIF, PDF, DOC, DOCX files accepted.
- **Size Limit** — Maximum 5 MB per file, up to 3 attachments per complaint.
- **Unique Filenames** — Files are stored with timestamp-based unique names to prevent collisions.
- **Static Serving** — Uploaded files are served via `/uploads/` static route.

### UI/UX
- **Responsive Navigation Bar** — Role-aware navbar showing relevant links per user type.
- **Complaint Cards** — Reusable card component with status colors, priority badges, truncated descriptions, and "View Details" links.
- **Loading & Error States** — All pages handle loading spinners and error messages gracefully.
- **Empty States** — Friendly messages and CTAs when no data is available.

---

## 🛠️ Tech Stack

| Layer         | Technology                                                                 |
|---------------|---------------------------------------------------------------------------|
| **Frontend**  | React 19, React Router v7, Axios, Vite 8, Tailwind CSS 4                 |
| **Backend**   | Node.js, Express.js 4                                                     |
| **Database**  | MongoDB with Mongoose 8 ODM                                              |
| **Auth**      | JSON Web Tokens (jsonwebtoken), bcryptjs                                  |
| **Uploads**   | Multer 2                                                                  |
| **Dev Tools** | Nodemon, oxlint, Vite HMR                                                |

---

## 📁 Project Structure

```
Complaint_Tracker/
├── client/                          # React Frontend (Vite)
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── public/                      # Static public assets
│   └── src/
│       ├── main.jsx                 # React entry point
│       ├── App.jsx                  # Root component with routing
│       ├── index.css                # Tailwind CSS entry point and global base styles
│       ├── context/
│       │   ├── AuthContext.jsx      # Auth state management (React Context)
│       │   └── ToastContext.jsx     # Global success/error notifications
│       ├── services/
│       │   └── api.js               # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── Navbar.jsx           # Navigation bar (role-aware)
│       │   ├── ProtectedRoute.jsx   # Route guard (auth + RBAC)
│       │   ├── Footer.jsx           # Site footer
│       │   ├── ErrorBoundary.jsx   # React render-error fallback
│       │   ├── LoadingState.jsx     # Shared skeleton loading UI
│       │   ├── StatusBadge.jsx      # Shared status badge
│       │   ├── ComplaintCard.jsx     # Reusable complaint card
│       │   ├── TimelineView.jsx     # Complaint timeline renderer
│       │   ├── StatusUpdater.jsx    # Status transition UI (staff/admin)
│       │   └── AssignStaff.jsx      # Staff assignment dropdown (admin)
│       ├── pages/
│       │   ├── Login.jsx            # Login page
│       │   ├── Register.jsx         # Registration page
│       │   ├── LandingPage.jsx      # Public overview and registration CTA
│       │   ├── NotFound.jsx         # Styled 404 page
│       │   ├── AccountSettings.jsx  # Profile and password settings
│       │   ├── UserManagement.jsx   # Admin user and role management
│       │   ├── StudentDashboard.jsx # Student/citizen complaint list
│       │   ├── FileComplaint.jsx    # File new complaint form
│       │   ├── ComplaintDetails.jsx # Detailed complaint view
│       │   ├── StaffDashboard.jsx   # Staff assigned complaints
│       │   ├── AdminDashboard.jsx   # Admin overview panel
│       │   └── AllComplaints.jsx    # Admin: all complaints table
│       └── utils/                   # Client-side utilities (reserved)
│
├── server/                          # Express Backend
│   ├── server.js                    # App entry point & middleware setup
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Environment variable template
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User schema (with password hashing)
│   │   ├── Complaint.js             # Complaint schema (with timeline)
│   │   └── Department.js            # Department schema (with categories)
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (register, login, profile)
│   │   ├── complaintController.js   # CRUD + status + assignment logic
│   │   ├── adminController.js       # Stats, all complaints, user mgmt
│   │   └── departmentController.js  # Department listing
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/*
│   │   ├── complaintRoutes.js       # /api/complaints/*
│   │   ├── adminRoutes.js           # /api/admin/*
│   │   └── departmentRoutes.js      # /api/departments/*
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification & role authorization
│   │   └── upload.js                # Multer file upload config
│   ├── utils/
│   │   └── seedData.js              # Database seed script
│   ├── uploads/                     # Uploaded files directory
│   └── tests/
│       └── verify.js                # End-to-end API verification script
│
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** ≥ 6.x (local instance or MongoDB Atlas)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PiyushKumar2024/Complaint_Tracker.git
cd Complaint_Tracker
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

```bash
cd ../server
cp .env.example .env
```

Edit the `.env` file with your own values (see [Environment Variables](#-environment-variables)).

---

## 🔐 Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/complaint_tracker
JWT_SECRET=supersecretjwtkey_change_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

| Variable      | Description                              | Default                                         |
|---------------|------------------------------------------|-------------------------------------------------|
| `PORT`        | Server port                              | `5000`                                          |
| `MONGO_URI`   | MongoDB connection string                | `mongodb://127.0.0.1:27017/complaint_tracker`   |
| `JWT_SECRET`  | Secret key for signing JWT tokens        | `supersecretjwtkey_change_in_production`        |
| `CLIENT_URL`  | Frontend URL for CORS                    | `http://localhost:5173`                         |
| `NODE_ENV`    | Environment mode                         | `development`                                   |

The frontend defaults to `http://localhost:5000/api`. To use a different backend, set
`VITE_API_URL` in `client/.env.local` to the backend API base URL, including `/api`.

---

## 🌱 Database Seeding

Seed the database with sample departments, an admin user, a staff user, and a citizen user:

```bash
cd server
npm run seed
```

This creates:

**6 Departments** with pre-defined categories:

| Department              | Code | Categories                                                                    |
|-------------------------|------|-------------------------------------------------------------------------------|
| Public Works            | PWD  | Roads, Bridges, Buildings, Potholes, Footpaths                                |
| Water Supply & Sewage   | WS   | Water Leakage, No Water Supply, Contaminated Water, Drainage Overflow, Sewage Blockage |
| Electricity Board       | EB   | Power Outage, Street Lights, Fallen Wire, Faulty Meter, Voltage Fluctuation   |
| Health & Sanitation     | HD   | Garbage Accumulation, Dead Animals, Mosquito Breeding, Public Toilet Hygiene, Hospital Complaints |
| Transport & Traffic     | TR   | Broken Traffic Signal, Public Bus Delay, Illegal Parking, Auto/Taxi Overcharging |
| Municipal Corporation   | MC   | Encroachment, Illegal Construction, Park Maintenance, Stray Cattle/Dogs       |

**3 Default Users** (see [Sample Login Credentials](#-sample-login-credentials)).

---

## ▶️ Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The API server starts at **http://localhost:5000**. Health check: `GET http://localhost:5000/api/health`

### Start the Frontend Dev Server

```bash
cd client
npm run dev
```

The React app starts at **http://localhost:5173**.

---

## 🔑 Sample Login Credentials

After running the seed script, these accounts are available:

| Role    | Name                 | Email                   | Password   |
|---------|----------------------|-------------------------|------------|
| Admin   | System Administrator | `admin@tracker.com`     | `admin123` |
| Staff   | PWD Field Officer    | `pwd.staff@tracker.com` | `staff123` |
| Student | Rahul Sharma         | `citizen@tracker.com`   | `user123`  |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Health Check

| Method | Endpoint       | Auth | Description               |
|--------|----------------|------|---------------------------|
| GET    | `/api/health`  | No   | Server status check       |

### Authentication (`/api/auth`)

| Method | Endpoint                  | Auth     | Description                    |
|--------|---------------------------|----------|--------------------------------|
| POST   | `/auth/register`          | No       | Register a new user            |
| POST   | `/auth/login`             | No       | Login and receive JWT token    |
| GET    | `/auth/me`                | Required | Get current user profile       |
| PUT    | `/auth/profile`           | Required | Update profile (name, dept)    |
| PUT    | `/auth/change-password`   | Required | Change password                |

### Departments (`/api/departments`)

| Method | Endpoint             | Auth | Description                      |
|--------|----------------------|------|----------------------------------|
| GET    | `/departments`       | No   | List all departments + categories|
| GET    | `/departments/:id`   | No   | Get single department by ID      |

### Complaints (`/api/complaints`)

| Method | Endpoint                      | Auth          | Description                              |
|--------|-------------------------------|---------------|------------------------------------------|
| POST   | `/complaints`                 | Required      | File a new complaint (multipart/form-data) |
| GET    | `/complaints`                 | Required      | Get user's complaints (filtered by role) |
| GET    | `/complaints/:id`             | Required      | Get complaint details by ID              |
| PATCH  | `/complaints/:id/status`      | Staff/Admin   | Update complaint status                  |
| PATCH  | `/complaints/:id/assign`      | Admin only    | Assign complaint to a staff member       |
| DELETE | `/complaints/:id`             | Admin only    | Delete a complaint                       |

### Admin (`/api/admin`)

| Method | Endpoint                  | Auth        | Description                              |
|--------|---------------------------|-------------|------------------------------------------|
| GET    | `/admin/stats`            | Admin only  | Dashboard stats (overview, dept breakdown, recent) |
| GET    | `/admin/complaints`       | Staff/Admin | All complaints with search & filters     |
| GET    | `/admin/users`            | Admin only  | List all users (filter by role)          |
| PATCH  | `/admin/users/:id/role`   | Admin only  | Update a user's role                     |

---

## 🗄️ Database Schema

### User

```
{
  name:       String (required, trimmed)
  email:      String (required, unique, lowercase)
  phone:      String (optional)
  password:   String (required, min 6 chars, auto-hashed via bcrypt)
  role:       Enum ['student', 'faculty', 'staff', 'admin'] (default: 'student')
  department: String (default: 'General')
  timestamps: { createdAt, updatedAt }
}
```

### Complaint

```
{
  title:        String (required)
  description:  String (required)
  category:     String (required)
  department:   ObjectId → Department (required)
  status:       Enum ['Open', 'In Progress', 'Resolved', 'Closed'] (default: 'Open')
  priority:     Enum ['Low', 'Medium', 'High', 'Urgent'] (default: 'Medium')
  location: {
    address:    String
    city:       String
    pincode:    String
  }
  attachments:  [String]              // File paths
  filedBy:      ObjectId → User       (required)
  assignedTo:   ObjectId → User       (optional)
  timeline: [{
    status:     String (required)
    comment:    String
    updatedBy:  ObjectId → User
    timestamp:  Date (default: now)
  }]
  timestamps: { createdAt, updatedAt }
}
```

### Department

```
{
  name:          String (required, unique)
  code:          String (required, unique, uppercase)
  categories:    [String]
  contactEmail:  String
  timestamps:    { createdAt, updatedAt }
}
```

---

## 🖥️ Frontend Pages & Components

### Pages

| Page                | Route                | Access         | Description                                        |
|---------------------|----------------------|----------------|----------------------------------------------------|
| Landing Page        | `/`                  | Public         | Public overview, features, and registration CTA    |
| Login               | `/login`             | Public         | Email/password login form                          |
| Register            | `/register`          | Public         | New user registration form                         |
| Student Dashboard   | `/dashboard`         | Authenticated  | User's complaints, filters, counts, and sorting    |
| File Complaint      | `/file-complaint`    | Authenticated  | Multi-field complaint submission form              |
| Complaint Details   | `/complaint/:id`     | Authenticated  | Full complaint details with timeline & sidebar     |
| Staff Dashboard     | `/staff`             | Staff, Admin   | Complaints assigned to the logged-in staff member  |
| Admin Dashboard     | `/admin`             | Admin only     | Stats cards, dept-wise table, recent complaints    |
| All Complaints      | `/admin/complaints`  | Admin only     | Searchable/filterable table of all complaints      |
| User Management     | `/admin/users`       | Admin only     | Review user accounts and update roles              |
| Account Settings    | `/settings`          | Authenticated  | Update profile information and change password     |
| Not Found           | `*`                  | Public         | Styled 404 page for unknown routes                 |

### Reusable Components

| Component       | Purpose                                                    |
|-----------------|------------------------------------------------------------|
| `Navbar`        | Role-aware navigation with conditional links and logout    |
| `Footer`        | Shared site footer                                         |
| `ProtectedRoute`| Auth guard with optional role-based access restriction     |
| `ComplaintCard`  | Card UI for complaint summary (used in dashboards)        |
| `StatusBadge`   | Consistent status label and color                         |
| `TimelineView`   | Vertical timeline renderer with status icons & connectors |
| `StatusUpdater`  | Status transition buttons with comment field              |
| `AssignStaff`    | Staff assignment dropdown with current assignee display   |
| `LoadingState`  | Shared skeleton loading presentation                      |
| `ErrorBoundary` | Fallback UI for unexpected rendering errors               |

---

## 🔒 Role-Based Access Control

| Feature                      | Student | Faculty | Staff | Admin |
|------------------------------|---------|---------|-------|-------|
| Register / Login             | ✅      | ✅      | ✅    | ✅    |
| File a Complaint             | ✅      | ✅      | ✅    | ✅    |
| View Own Complaints          | ✅      | ✅      | ✅    | ✅    |
| View All Complaints          | ❌      | ❌      | ✅    | ✅    |
| Update Complaint Status      | ❌      | ❌      | ✅    | ✅    |
| Assign Staff to Complaint    | ❌      | ❌      | ❌    | ✅    |
| Delete Complaint             | ❌      | ❌      | ❌    | ✅    |
| View Admin Dashboard & Stats | ❌      | ❌      | ❌    | ✅    |
| Manage Users / Roles         | ❌      | ❌      | ❌    | ✅    |
| View Staff Dashboard         | ❌      | ❌      | ✅    | ✅    |

---

## 🔄 Status Workflow

Complaints follow a strictly enforced linear transition:

```
   ┌──────┐     ┌─────────────┐     ┌──────────┐     ┌────────┐
   │ Open │ ──▶ │ In Progress │ ──▶ │ Resolved │ ──▶ │ Closed │
   └──────┘     └─────────────┘     └──────────┘     └────────┘
```

- **Open** → can only move to **In Progress**
- **In Progress** → can only move to **Resolved**
- **Resolved** → can only move to **Closed**
- **Closed** → no further transitions

Each transition:
- Is validated on the server side
- Appends a timeline entry with status, comment, user, and timestamp
- Can only be performed by **staff** or **admin** roles

---

## 🧪 Testing

### End-to-End API Verification

An automated test script covers the critical end-to-end flow:

```bash
cd server
node tests/verify.js
```

**Test Flow:**
1. **Login as Citizen** — Verifies student/citizen login
2. **Create Complaint** — Fetches departments, creates a new complaint under PWD
3. **Login as Admin** — Verifies admin login
4. **Update Status** — Transitions complaint from `Open` → `In Progress`
5. **Verify Timeline** — Confirms timeline entries and latest comment
6. **Admin Stats** — Retrieves and validates dashboard statistics

> **Prerequisite:** The server must be running and the database must be seeded before running tests.

---

## 📸 Screenshots

> *Screenshots can be added here to showcase the Login page, Student Dashboard, File Complaint form, Complaint Details with Timeline, Admin Dashboard, and All Complaints table.*

---

## 📄 License

This project is licensed under the **ISC License**.
