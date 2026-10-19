# Complaint Tracker — Mid-Semester Implementation Plan

> **Status Key:** ✅ Done · ⚠️ Partially Done · ❌ Not Yet Implemented

**Course:** Software Engineering & Project Management  
**Deadline:** 3 October 2026  
**Dev Window:** Sept 27–30 (4 days)  
**Team Size:** 4 members (2 Frontend · 2 Backend)  
**Stack:** MERN (MongoDB · Express.js · React.js · Node.js)

---

## 1. Project Overview

**Problem Statement**  
Citizens lack a unified, transparent channel to file complaints with government/municipal bodies and track resolution progress — leading to ignored grievances, zero accountability, and public frustration.

**Solution**  
A web-based Complaint Tracker that allows the general public to register, file, and track complaints directed at specific departments/bodies, while giving officials a dashboard to manage, respond to, and resolve complaints with full transparency.

---

## 2. Scope for Mid-Semester (40–60% Completion)

### Features IN Scope

| #   | Feature                                                     | Priority | Status |
| --- | ----------------------------------------------------------- | -------- | ------ |
| 1   | User Registration & Login (public + official)               | Critical | ✅     |
| 2   | File a Complaint (category, description, location, attachment) | Critical | ✅     |
| 3   | Complaint Dashboard — user sees their complaints with status | Critical | ✅     |
| 4   | Admin/Official Dashboard — view, filter, assign, update complaints | Critical | ✅     |
| 5   | Status Tracking (Open → In Progress → Resolved → Closed)   | High     | ✅     |
| 6   | Complaint Detail View with timeline/history                 | High     | ✅     |
| 7   | Category & Department Mapping                               | High     | ✅     |

### Features OUT of Scope (End-Sem / Future)

| Feature                                | Status |
| -------------------------------------- | ------ |
| SMS/Email notifications                | ❌     |
| AI-based complaint categorization      | ❌     |
| Analytics & reports dashboard          | ❌     |
| Mobile app / PWA                       | ❌     |
| Multi-language support                 | ❌     |
| Public upvoting/community features     | ❌     |
| Integration with real government APIs  | ❌     |

---

## 3. Tech Stack — MERN

| Layer        | Technology             | Justification                              | Status |
| ------------ | ---------------------- | ------------------------------------------ | ------ |
| Frontend     | React.js (Vite)        | Component-based, fast HMR, massive ecosystem | ✅     |
| Styling      | Vanilla CSS            | Full control, no extra dependencies        | ✅     |
| Routing      | React Router v7        | Standard SPA routing for React             | ✅     |
| HTTP Client  | Axios                  | Cleaner API, interceptors for JWT          | ✅     |
| Backend      | Node.js + Express.js   | JS full-stack consistency, fast API dev    | ✅     |
| Database     | MongoDB (Mongoose)     | Flexible schema, Mongoose ODM             | ✅     |
| Auth         | JWT + bcryptjs         | Stateless auth, password hashing           | ✅     |
| File Upload  | Multer                 | Middleware for multipart/form-data         | ✅     |
| Version Control | Git + GitHub        | Contribution evidence for report           | ✅     |

---

## 4. Team Role Assignment

| Role               | ID       | Responsibilities                                                      |
| ------------------ | -------- | --------------------------------------------------------------------- |
| Frontend Lead (F1) | Member 1 | Auth pages, complaint form, routing, responsive layout, auth context  |
| Frontend Dev (F2)  | Member 2 | Dashboards (user + admin), complaint detail, landing page, components |
| Backend Lead (B1)  | Member 3 | DB schemas, auth APIs, complaint CRUD APIs, middleware                |
| Backend Dev (B2)   | Member 4 | Admin APIs, status workflow, file upload, seed data, testing, README  |

---

## 5. Day 1 — Foundation Day

**End-of-Day Goal:** User can register, login, and land on an empty dashboard shell. Backend fully serves auth APIs.

### Backend Tasks

#### B1-1 · Initialize Node.js + Express Project — ✅ DONE

- ✅ `npm init -y` inside server/ folder
- ✅ Install: express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken, multer
- ✅ Install dev: nodemon
- ✅ `server.js`: express/cors/dotenv, middleware, health-check route `GET /api/health`
- ✅ `config/db.js`: async function with `mongoose.connect(process.env.MONGO_URI)`
- ✅ `.env` with PORT, MONGO_URI, JWT_SECRET and `.env.example`
- ✅ `"dev": "nodemon server.js"` in package.json
- ❌ express-validator not installed (validation done manually instead)

#### B1-2 · Design & Implement MongoDB Schemas — ✅ DONE

- ✅ `models/User.js`: name, email (unique), password, role enum, department
- ✅ Pre-save hook: hash password with bcryptjs
- ✅ Instance method `matchPassword()` using `bcrypt.compare()`
- ✅ `models/Complaint.js`: title, description, category, department ref, status enum, priority enum, location, attachments, filedBy, assignedTo, timeline sub-docs
- ✅ Pre-save hook: push initial timeline entry on new complaint
- ✅ `models/Department.js`: name (unique), code (unique), categories, contactEmail
- ✅ All schemas use `{ timestamps: true }`
- ⚠️ User role enum uses `student/faculty/staff/admin` instead of planned `public/official/admin`
- ⚠️ User `phone` field not in schema (plan had it)
- ⚠️ User `department` is String, not ObjectId ref (plan had ObjectId ref)

#### B1-3 · Implement Registration API — ✅ DONE

- ✅ `controllers/authController.js` with `register` function
- ✅ Check if user exists → 400
- ✅ Create user → password auto-hashed by pre-save hook
- ✅ Generate JWT with `jwt.sign()`
- ✅ Return 201 with user data + token
- ✅ Route: `POST /api/auth/register`

#### B1-4 · Implement Login API — ✅ DONE

- ✅ `login`: find user, compare password, return JWT
- ✅ `getMe`: return `req.user`
- ✅ Routes: `POST /api/auth/login`, `GET /api/auth/me`
- ✅ Additional: `updateProfile` and `changePassword` endpoints (beyond original plan)

#### B2-1 · Auth Middleware + Role Check — ✅ DONE

- ✅ `middleware/authMiddleware.js` — `protect` function: extract Bearer token, verify, attach user
- ✅ `authorize(...roles)`: check `req.user.role` against allowed roles → 403
- ⚠️ `errorHandler.js` not a separate file — error handling is inline in `server.js` (global 404 + 500 handlers present)

#### B2-2 · Seed Data Script — ✅ DONE

- ✅ `utils/seedData.js`: connects to MongoDB
- ✅ 6 departments with relevant categories
- ✅ Admin user: `admin@tracker.com` / `admin123`
- ✅ 1 staff user: `pwd.staff@tracker.com` / `staff123`
- ✅ 1 citizen user: `citizen@tracker.com` / `user123`
- ✅ `"seed": "node utils/seedData.js"` in package.json
- ⚠️ Only 1 staff + 1 citizen seeded (plan had 2 officials + 2 public users)

#### B2-3 · Setup CORS & Config — ⚠️ PARTIAL

- ✅ CORS configured in `server.js` for `http://localhost:5173`
- ❌ `config/constants.js` with categories/statuses/priorities not created (values are inline in models)
- ✅ `.gitignore` includes node_modules/, .env

### Frontend Tasks

#### F1-1 · Initialize React (Vite) Project — ✅ DONE

- ✅ Vite + React project created
- ✅ Installed: react-router-dom, axios
- ✅ Folder structure: components/, pages/, context/, services/, utils/
- ✅ `App.jsx` with BrowserRouter and Routes
- ✅ `services/api.js`: axios instance with baseURL + JWT interceptor
- ❌ react-icons not installed (using emoji icons instead)
- ❌ react-toastify not installed (using inline error messages instead)

#### F1-2 · Design System — Global CSS — ⚠️ PARTIAL

- ✅ Global `index.css` with basic styles
- ⚠️ No Google Font imported (plan had Inter)
- ⚠️ No CSS variables defined (plan had full design token system)
- ⚠️ No utility classes defined (plan had .btn, .badge, etc.)
- ✅ Component-level CSS files for each page/component (per-file approach instead of design system)

#### F1-3 · Build Registration Page — ✅ DONE

- ✅ `pages/Register.jsx` with fields: Name, Email, Password
- ✅ useState for fields + error handling
- ✅ On submit: API call → save token → redirect to `/`
- ✅ Link: 'Already have an account? Login here'
- ❌ Phone and Confirm Password fields not included
- ❌ No toast notifications (inline error display instead)

#### F1-4 · Build Login Page — ✅ DONE

- ✅ `pages/Login.jsx` with Email + Password
- ✅ On submit: API call, save token, redirect to `/`
- ✅ Link: 'Don't have an account? Register here'
- ⚠️ No role-based redirect (all users go to `/` — plan had admin→/admin, public→/dashboard)

#### F2-1 · Build Landing Page — ❌ NOT DONE

- ❌ No dedicated landing page (hero section, how-it-works, features, stats, CTA banner)
- ⚠️ `/` directly shows the Student Dashboard for logged-in users

#### F2-2 · Build Reusable Components — ⚠️ PARTIAL

- ✅ `Navbar.jsx`: logo, role-conditional links, logout button
- ❌ No Footer component
- ❌ No standalone StatusBadge component (status rendering is inline in components)
- ❌ No Loader/Spinner component (loading states are inline text)
- ✅ `ProtectedRoute.jsx`: checks auth + optional role-based access
- ⚠️ Navbar: no hamburger menu, no glass-morphism, no sticky behavior

#### F1-5 · Connect Auth Forms to Backend — ✅ DONE

- ✅ Auth forms connected via `AuthContext` + `api.js`
- ✅ Full flow: Register → redirect → Refresh → still logged in (token persistence)
- ❌ No separate `authService.js` (logic is in AuthContext directly)
- ❌ No react-toastify setup

**✅ Day 1 Checkpoint:** Backend auth APIs working · Frontend auth pages connected · User can register/login · Protected routes active · Seed data ready

---

## 6. Day 2 — Core Feature Day

**End-of-Day Goal:** ⭐ END-TO-END FEATURE COMPLETE — User registers → files complaint → sees it on dashboard.

### Backend Tasks

#### B1-5 · Create Complaint API — ✅ DONE

- ✅ `controllers/complaintController.js` with `createComplaint`
- ✅ Validate required fields, verify department is valid
- ✅ `Complaint.create()` with `filedBy: req.user._id`
- ✅ Pre-save hook auto-adds initial timeline entry
- ✅ Return 201 with populated complaint
- ✅ Route: `POST /api/complaints`

#### B1-6 · List & Get Complaint APIs — ✅ DONE

- ✅ `getComplaints`: filter by `filedBy` for students/faculty, support query params
- ✅ `getComplaintById`: populate all refs (filedBy, department, assignedTo, timeline.updatedBy)
- ✅ Access check: students/faculty can only view their own complaints
- ✅ Routes: `GET /api/complaints`, `GET /api/complaints/:id`
- ❌ No pagination (all results returned)

#### B1-7 · Complaint Timeline & Status Update — ✅ DONE

- ✅ `updateComplaintStatus`: validate status transitions (Open→In Progress→Resolved→Closed)
- ✅ Reject invalid transitions
- ✅ Push timeline entry with status, comment, updatedBy, timestamp
- ✅ Route: `PATCH /api/complaints/:id/status` (staff + admin only)

#### B2-4 · File Upload Endpoint — ✅ DONE

- ✅ `middleware/upload.js` using Multer with diskStorage
- ✅ Filename: timestamp-random + original extension
- ✅ File filter: jpeg, jpg, png, gif, pdf, doc, docx
- ✅ Size limit: 5MB per file
- ✅ `uploads/` served statically
- ✅ `upload.array('attachments', 3)` middleware on complaint creation

#### B2-5 · Department APIs — ✅ DONE

- ✅ `controllers/departmentController.js`
- ✅ `getAllDepartments`: sorted by name, no auth required
- ✅ `getDepartmentById`: single department
- ✅ Routes: `GET /api/departments`, `GET /api/departments/:id`

### Frontend Tasks

#### F1-6 · Auth Context (State Management) — ✅ DONE

- ✅ `context/AuthContext.jsx` with createContext + AuthProvider
- ✅ State: user (null), loading (true)
- ✅ On mount: check localStorage token → fetch `/auth/me`
- ✅ Provide `login()`, `register()`, `logout()` functions
- ✅ Wrapped in `<AuthProvider>` in main.jsx
- ⚠️ No custom `useAuth()` hook exported (consumers use `useContext(AuthContext)` directly)

#### F1-7 · Build File Complaint Page — ✅ DONE

- ✅ `pages/FileComplaint.jsx` with form fields: Title, Department, Category, Priority, Description, Attachments
- ✅ Department dropdown loaded from API
- ✅ Category filtered by selected department
- ✅ File input: max 3 files
- ✅ FormData with multipart header on submit
- ✅ Success → redirect to `/dashboard`; Error → show message
- ❌ Location fields (Address, City, Pincode) not in the form UI (schema supports it)
- ❌ No file preview thumbnails
- ❌ No client-side validation for description length (min 20 chars)

#### F2-3 · Build User Dashboard — ✅ DONE

- ✅ `pages/StudentDashboard.jsx`
- ✅ Header with 'File New Complaint' button
- ✅ Filter tabs: All / Open / In Progress / Resolved / Closed
- ✅ Fetch from `GET /complaints` on mount
- ✅ Empty state: 'No complaints found' + CTA to file first complaint
- ✅ Map complaints to `<ComplaintCard />`
- ✅ Loading state
- ❌ No summary stats row (Total, Open, In Progress, Resolved counts)
- ❌ No Category dropdown filter
- ❌ No Sort option (Newest/Oldest)

#### F2-4 · Build Complaint Card Component — ✅ DONE

- ✅ `components/ComplaintCard.jsx`: title, status badge, truncated description, department, category, date, priority badge, 'View Details' link
- ✅ Status badge with color coding
- ✅ Priority badge (high priority highlighted)
- ❌ No hover translateY animation
- ❌ No left border color based on status
- ❌ No location/city display on card

**✅ Day 2 Checkpoint:** ⭐ END-TO-END FEATURE: Register → Login → File Complaint → See on Dashboard · File uploads working · Departments load dynamically

---

## 7. Day 3 — Admin & Detail Day

**End-of-Day Goal:** Admin dashboard functional, complaint detail page with timeline, role-based access complete, responsive design.

### Backend Tasks

#### B1-8 · Admin Routes — List All Complaints — ✅ DONE

- ✅ `controllers/adminController.js`
- ✅ `getAllComplaints`: admin/staff accessible, supports query params (status, department, category, priority, search)
- ✅ `getStats` (was `getComplaintStats`): aggregation — counts by status + department-wise breakdown + recent complaints
- ✅ Routes: `GET /api/admin/complaints`, `GET /api/admin/stats`
- ❌ No server-side pagination (?page, ?limit) — all results returned
- ✅ Additional: `getAllUsers` and `updateUserRole` endpoints (beyond original plan)

#### B1-9 · Admin — Assign & Respond — ⚠️ PARTIAL

- ✅ `assignComplaint`: takes complaintId + staffId, update assignedTo, add timeline entry
- ✅ Route: `PATCH /api/complaints/:id/assign`
- ❌ `addResponse` (POST /:id/response) — not implemented as a separate endpoint (comments added via status update instead)

#### B2-6 · Input Validation — ❌ NOT DONE

- ❌ express-validator not installed
- ❌ No `middleware/validators.js` with validateRegister, validateComplaint
- ⚠️ Basic validation exists inline in controllers (required field checks)

#### B2-7 · Write Unit Tests — ⚠️ PARTIAL

- ❌ Jest + Supertest not installed
- ❌ No `tests/auth.test.js` or `tests/complaint.test.js`
- ✅ `tests/verify.js`: Manual E2E verification script covering login, create complaint, status update, timeline, admin stats

### Frontend Tasks

#### F2-5 · Build Admin Dashboard — ✅ DONE

- ✅ `pages/AdminDashboard.jsx`
- ✅ Stats cards: Total, Open, In Progress, Resolved, Closed, Total Users
- ✅ Department-wise breakdown table
- ✅ Recent complaints list (latest 5) with ComplaintCard
- ✅ 'View All Complaints' link
- ✅ Protected route (admin only)
- ❌ No search input on dashboard (search is on AllComplaints page)

#### F2-6 · Build Complaint Detail Page — ✅ DONE

- ✅ `pages/ComplaintDetails.jsx` — fetch from `/complaints/:id`
- ✅ Two-column layout: main content + sidebar
- ✅ Status + priority badges, category badge
- ✅ Full description display
- ✅ Attachments with download links
- ✅ Location display (if available)
- ✅ Timeline section with `<TimelineView />`
- ✅ Sidebar: Filed by, Email, Department, Assigned to, Filed On, Last Updated
- ✅ Back button navigation
- ❌ Admin actions not visible on detail page (StatusUpdater & AssignStaff components exist but are not wired into ComplaintDetails)

#### F1-8 · Protected Routes & Role-Based Nav — ✅ DONE

- ✅ `ProtectedRoute` uses AuthContext, handles loading state, accepts `allowedRoles` prop
- ✅ Redirects unauthenticated users to `/login`
- ✅ Redirects unauthorized roles to `/`
- ✅ Navbar shows different links by role (student, staff, admin)
- ✅ Logout clears state + redirects to `/login`
- ❌ No toast message on unauthorized redirect

#### F1-9 · Responsive Design Pass — ❌ NOT DONE

- ❌ No media queries for tablet (768px) or mobile (480px)
- ❌ No hamburger menu on mobile
- ❌ No responsive grid changes
- ❌ No mobile card-view alternative for admin table
- ❌ Not tested at different widths

#### F1-10 · Micro-Animations & Polish — ❌ NOT DONE

- ❌ No card hover translateY animation
- ❌ No button scale on hover
- ❌ No page fade-in animation
- ❌ No status badge pulse animation
- ❌ No form input focus transitions
- ❌ No navbar slide-down animation
- ❌ No loading skeletons

**⚠️ Day 3 Checkpoint:** Admin dashboard with filters ✅ · Status update + assign ✅ · Detail page with timeline ✅ · Role-based access ✅ · Responsive ❌ · Polished UI ❌

---

## 8. Day 4 — Testing & Documentation

**End-of-Day Goal:** Bug-free, demo-ready application with README, test cases, and seed data.

### Backend Tasks

#### B1-10 · Complete Test Cases + Test Table — ⚠️ PARTIAL

- ❌ No automated test suite (Jest/Supertest)
- ✅ Manual E2E verification script (`tests/verify.js`) covering: login, complaint creation, status update, timeline verification, admin stats
- ❌ No test case table document with 15–20 test cases
- ❌ No terminal screenshots for test evidence

#### B1-11 · Fix Integration Bugs — ✅ DONE

- ✅ E2E flow works: register → login → file complaint → view dashboard → view detail
- ✅ Admin flow works: login → dashboard → filter → view all complaints
- ✅ File upload works
- ✅ Error cases handled (wrong login, missing fields, unauthorized)

#### B2-9 · Write README.md — ✅ DONE

- ✅ Comprehensive README.md at project root
- ✅ Sections: Project Title, Tech Stack, Prerequisites, Setup & Installation, Sample Credentials, API Documentation, Project Structure, Database Schema
- ✅ Clear setup instructions for running from scratch
- ✅ Includes `npm run seed` step

#### B2-10 · Create Demo Seed Data — ⚠️ PARTIAL

- ✅ 6 departments with categories
- ✅ 1 admin, 1 staff, 1 citizen user
- ❌ No 8–10 sample complaints with different statuses
- ❌ No complaints with multiple timeline entries pre-seeded

#### B1-12 · Security Review — ⚠️ PARTIAL

- ⚠️ JWT_SECRET has fallback hardcoded value `'secretkey'` in code
- ✅ .env is in .gitignore
- ✅ Admin routes have proper role checks
- ✅ Students can only view their own complaints
- ❌ No NoSQL injection vector check
- ❌ No express-rate-limit on auth routes

### Frontend Tasks

#### F1-11 · End-to-End Testing — ⚠️ PARTIAL

- ✅ Core flows tested and working
- ✅ Loading states display correctly
- ✅ Error states display correctly
- ✅ Role-based access enforced (students cannot access /admin)
- ❌ No formal documentation of bugs found
- ❌ Token expiry behavior not explicitly tested

#### F1-12 · Fix UI Bugs — ⚠️ PARTIAL

- ✅ Core pages render correctly
- ❌ No cross-browser testing (Chrome, Firefox, Edge)
- ❌ Responsive issues not addressed
- ❌ Font/color consistency not verified across all pages

#### F1-13 · Empty States, 404, Error Boundaries — ⚠️ PARTIAL

- ❌ No styled 404 page (`NotFound.jsx`) — fallback redirects to `/`
- ✅ Dashboard empty state: 'No complaints found' + CTA
- ✅ Admin empty state: 'No complaints match your filters'
- ❌ No React Error Boundary in App.jsx

#### F2-9 · Screenshot Capture — ❌ NOT DONE

- ❌ No screenshots taken
- ❌ No screenshots/ folder

**⚠️ Day 4 Checkpoint:** All bugs fixed ⚠️ · Test cases documented ⚠️ · README complete ✅ · Rich seed data ⚠️ · Security reviewed ⚠️ · Screenshots captured ❌

---

## 9. Staff Dashboard — BONUS (Beyond Original Plan) ✅

> This feature was **not in the original plan** but was implemented:

- ✅ `StaffDashboard.jsx` — shows complaints assigned to the logged-in staff member
- ✅ Quick stats: total assigned, open, in-progress, resolved counts
- ✅ Filter tabs with status-based badge counts
- ✅ Route: `/staff` (protected for staff + admin roles)

---

## 10. All Complaints Table — BONUS (Beyond Original Plan) ✅

> Extended admin feature beyond the original plan:

- ✅ `AllComplaints.jsx` — full table view of all system complaints
- ✅ Search bar (by title/description)
- ✅ Multi-filter: Status, Department, Priority
- ✅ Clear filters button
- ✅ Tabular view with status/priority badges

---

## Summary: Implementation Progress

### Overall Completion: ~70%

| Area                          | Status    | Notes                                           |
| ----------------------------- | --------- | ----------------------------------------------- |
| **Backend Auth APIs**         | ✅ 100%   | Register, login, profile, password change       |
| **Backend Complaint APIs**    | ✅ 95%    | CRUD, status, assign, delete (missing: response endpoint, pagination) |
| **Backend Admin APIs**        | ✅ 95%    | Stats, all complaints, users, role mgmt         |
| **Backend File Upload**       | ✅ 100%   | Multer, validation, static serving              |
| **Backend Seed Data**         | ⚠️ 70%   | Departments + users done; no sample complaints  |
| **Backend Testing**           | ⚠️ 30%   | Manual verify script only; no automated tests   |
| **Backend Input Validation**  | ❌ 20%    | No express-validator; basic inline checks only  |
| **Frontend Auth Pages**       | ✅ 90%    | Login + Register (missing: phone, toasts)       |
| **Frontend Dashboards**       | ✅ 90%    | Student, Staff, Admin dashboards                |
| **Frontend Complaint Form**   | ✅ 85%    | Missing: location fields, file preview          |
| **Frontend Detail Page**      | ✅ 85%    | Missing: admin actions on detail page           |
| **Frontend Responsive**       | ❌ 0%     | No media queries or mobile layout               |
| **Frontend Animations**       | ❌ 0%     | No micro-animations or polish                   |
| **Frontend Landing Page**     | ❌ 0%     | No public landing/marketing page                |
| **README & Docs**             | ✅ 100%   | Comprehensive README created                    |

---

## What Can Still Be Implemented (Remaining Work)

### High Priority (Should Do)

1. **Responsive Design** — Add media queries for tablet (768px) and mobile (480px) breakpoints, hamburger menu
2. **Landing Page** — Public-facing landing page with hero section, how-it-works, features, stats
3. **Wire Admin Actions on Detail Page** — Connect `StatusUpdater` and `AssignStaff` components to `ComplaintDetails.jsx`
4. **Input Validation** — Install express-validator, add proper server-side validation middleware
5. **Automated Testing** — Install Jest + Supertest, write 15–20 test cases
6. **Enhanced Seed Data** — Add 8–10 sample complaints with varied statuses and timeline entries
7. **Security Hardening** — Remove hardcoded JWT fallback, add express-rate-limit, NoSQL injection checks

### Medium Priority (Nice to Have)

8. **Toast Notifications** — Install react-toastify for success/error feedback
9. **Official Response Endpoint** — `POST /complaints/:id/response` for adding comments without status change
10. **Server-side Pagination** — Add `?page` and `?limit` support to list endpoints
11. **404 Page** — Create `NotFound.jsx` with styled content
12. **Error Boundaries** — Add React Error Boundary wrapper in App.jsx
13. **Loading Skeletons** — Replace text-based loading with skeleton UI
14. **Design System** — CSS variables, Google Fonts, utility classes
15. **Location Fields in Form** — Add Address/City/Pincode inputs to FileComplaint

### Low Priority (End-Sem Scope)

16. **Micro-Animations** — Hover effects, fade-in, badge pulse, button scale
17. **Email/SMS Notifications** — On complaint status changes
18. **Analytics Dashboard** — Charts for complaint trends, resolution times
19. **AI Categorization** — Auto-suggest department/category from description
20. **PWA Support** — Offline capability, installable on mobile
21. **Multi-language Support** — i18n framework integration
22. **Public Upvoting** — Community engagement features
23. **Export Reports** — PDF/CSV export of complaints
24. **Dark Mode Toggle** — User-selectable theme
25. **Complaint Search (Student)** — Let students search their own complaints
