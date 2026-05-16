<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" />
</p>

<h1 align="center">⚡ TaskForge</h1>

<p align="center">
  <strong>A modern, full-stack workforce management platform built for teams that move fast.</strong><br/>
  Role-based dashboards · Real-time attendance · Task pipelines · Leave management
</p>

<p align="center">
  <a href="https://intelligent-fulfillment-production-5ef7.up.railway.app">🌐 Live Demo</a> &nbsp;·&nbsp;
  <a href="https://taskforge-production-5bfc.up.railway.app/docs">📖 API Docs</a> &nbsp;·&nbsp;
  <a href="#-quick-start">🚀 Quick Start</a>
</p>

---

## 📸 Screenshots

### Homepage
<img src="screenshots/homepage.png" alt="TaskForge Homepage" width="100%" />

### Admin Dashboard
<img src="screenshots/admin.png" alt="Admin Dashboard" width="100%" />

### Member — Project View
<img src="screenshots/project-member.png" alt="Member Project View" width="100%" />

---

## 🎯 What is TaskForge?

TaskForge is a production-ready HR and workforce management system with **two distinct portals**:

| Portal | Who it's for | What they can do |
|--------|-------------|-----------------|
| **Admin (HR)** | Managers & HR staff | Manage employees, track attendance, assign tasks, handle leave requests, view analytics |
| **Member (Employee)** | Team members | Punch in/out, manage tasks, submit leave requests, view projects, upload documents |

All data is **real and persistent** — stored in a PostgreSQL database on Railway. Every action (creating employees, marking attendance, approving leaves) is saved in real-time.

---

## 🔑 Access the Live App

### Admin Portal

Use the pre-configured demo credentials:

```
Email:    hr@staffsync.com
Password: demo123
```

### Member Portal

**Create your own account** — click "Sign Up" on the homepage, fill in your details, and you're in.

> Members who sign up are automatically registered as employees. The admin will see new signups in their dashboard.

---

## ✨ Key Features

### 👔 Admin (HR) Portal

| Feature | Description |
|---------|-------------|
| **Dashboard Analytics** | Real-time stats — total employees, attendance rate, department distribution, monthly trends |
| **Employee Management** | Add, edit, deactivate employees. Full CRUD with search, filter, and pagination |
| **Attendance Tracking** | View all employee attendance records. Manually mark attendance for any employee |
| **Task Assignment** | Create and assign tasks to employees with priority levels and deadlines |
| **Leave Management** | Review, approve, or reject leave requests submitted by members |
| **Notifications** | Send notifications to individual employees or broadcast to all |
| **Project Pipelines** | Organize work into Eval and Generalist project categories |
| **AI Insights** | Analytics-driven insights on workforce performance |
| **Access Requests** | Manage new member access and role assignments |

### 👤 Member (Employee) Portal

| Feature | Description |
|---------|-------------|
| **Punch In / Punch Out** | One-click attendance marking. Late detection if check-in is after 9:30 AM |
| **Attendance History** | View personal attendance records with monthly summaries and rates |
| **Task Management** | View assigned tasks, create personal tasks, update status (pending → in-progress → completed) |
| **Leave Requests** | Submit leave requests (sick, vacation, personal, emergency) with date ranges and reasons |
| **Document Upload** | Upload and manage personal documents (contracts, reports, policies) |
| **Announcements** | View company-wide announcements from HR |
| **Notifications** | Receive real-time notifications from admin |
| **Projects & Work Sessions** | Participate in assigned projects, track work sessions and activity |

---

## 🔄 How It Works — Core Workflows

```
┌─────────────────────────────────────────────────────────────────┐
│                        MEMBER SIGNS UP                           │
├─────────────────────────────────────────────────────────────────┤
│  1. Member creates account → auto-registered as employee        │
│  2. Admin receives notification of new signup                   │
│  3. Member can immediately punch in, view tasks, submit leaves  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     ATTENDANCE FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│  Member: Punch In → Work → Punch Out                            │
│  Admin:  Views all attendance in dashboard + analytics           │
│  System: Auto-calculates hours worked, flags late arrivals       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     LEAVE REQUEST FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│  Member: Submits leave request (type, dates, reason)            │
│  Admin:  Reviews pending requests → Approves / Rejects          │
│  System: Updates attendance records, notifies member             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       TASK FLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│  Admin:  Creates task → assigns to employee with deadline       │
│  Member: Views task → updates status → marks complete           │
│  Both:   Can raise issues and track progress                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

```
TaskForge/
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── hr/          # Admin portal pages
│   │   │   ├── member/      # Member portal pages
│   │   │   └── employee/    # Employee sub-pages
│   │   ├── components/      # Reusable UI components (shadcn/ui)
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # API client, utilities
│   └── package.json
│
├── backend/                  # FastAPI Python server
│   ├── app/
│   │   ├── api/             # Route handlers (auth, hr, employee)
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── core/            # Auth, security, dependencies
│   │   ├── config.py        # Environment configuration
│   │   ├── database.py      # DB connection & session
│   │   └── main.py          # FastAPI app entry point
│   └── requirements.txt
│
└── screenshots/              # App screenshots
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui + Radix** | Accessible component library |
| **React Router v6** | Client-side routing |
| **TanStack Query** | Server state management |
| **Axios** | HTTP client |
| **Recharts** | Data visualization |
| **React Hook Form + Zod** | Form handling & validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | High-performance Python web framework |
| **SQLAlchemy 2.0** | ORM & database toolkit |
| **PostgreSQL** | Production database |
| **Pydantic v2** | Data validation & serialization |
| **JWT (python-jose)** | Token-based authentication |
| **Passlib + bcrypt** | Password hashing |
| **Alembic** | Database migrations |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Railway** | Hosting (frontend, backend, database) |
| **PostgreSQL on Railway** | Managed database with persistent volume |

---

## 📊 Data Points

| Metric | Value |
|--------|-------|
| API Endpoints | 25+ RESTful routes |
| Database Models | 8 (User, Employee, Attendance, Task, Document, Announcement, LeaveRequest, Notification) |
| Auth System | JWT with access + refresh tokens |
| Role Types | 2 (HR Administrator, Employee) |
| Leave Types | 4 (Sick, Vacation, Personal, Emergency) |
| Task Priorities | 3 (Low, Medium, High) |
| Task Statuses | 4 (Pending, In-Progress, Completed, Cancelled) |
| Attendance Statuses | 4 (Present, Absent, Late, On Leave) |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (or use SQLite for local dev)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Server starts at `http://localhost:8000` — API docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App starts at `http://localhost:5173`

---

## 🔒 Security

- **Password Hashing** — bcrypt with salt rounds
- **JWT Authentication** — Short-lived access tokens (30 min) + refresh tokens (7 days)
- **Role-Based Access Control** — HR and Employee roles with route-level protection
- **CORS** — Configured for specific allowed origins
- **Input Validation** — Pydantic schemas validate all incoming data
- **SQL Injection Protection** — SQLAlchemy ORM with parameterized queries

---

## 📡 API Overview

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **Auth** | `POST /api/auth/login` · `POST /api/auth/signup` · `POST /api/auth/refresh` · `GET /api/auth/me` | Authentication & user management |
| **HR Dashboard** | `GET /api/hr/dashboard/stats` · `GET /api/hr/analytics` | Real-time statistics & analytics |
| **Employees** | `GET/POST/PUT/DELETE /api/hr/employees` | Full employee CRUD |
| **Attendance** | `GET /api/hr/attendance` · `POST /api/hr/attendance/mark` | View & mark attendance |
| **Leave Requests** | `GET /api/hr/leave-requests` · `PUT /api/hr/leave-requests/{id}/status` | Manage leave approvals |
| **Employee Self-Service** | `POST /api/employee/attendance/checkin` · `POST /api/employee/attendance/checkout` | Punch in/out |
| **Tasks** | `GET/POST/PUT /api/employee/tasks` | Task management |
| **Documents** | `GET/POST /api/employee/documents` | Document uploads |
| **Notifications** | `POST /api/hr/notifications` · `GET /api/employee/notifications` | Send & receive notifications |

Full interactive documentation: [**Swagger UI →**](https://taskforge-production-5bfc.up.railway.app/docs)

---

## 🌐 Deployment

Both services are deployed on **Railway** with automatic deploys from the repository:

| Service | URL | Status |
|---------|-----|--------|
| Frontend | [intelligent-fulfillment-production-5ef7.up.railway.app](https://intelligent-fulfillment-production-5ef7.up.railway.app) | ● Online |
| Backend API | [taskforge-production-5bfc.up.railway.app](https://taskforge-production-5bfc.up.railway.app) | ● Online |
| PostgreSQL | Internal (Railway private network) | ● Online |

---

## 📝 License

This project is open source and available for educational and portfolio purposes.

---

<p align="center">
  Built with ☕ and modern web technologies<br/>
  <strong>TaskForge</strong> — Workforce management, simplified.
</p>
