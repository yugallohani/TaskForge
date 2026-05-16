# StaffSync - HR & Employee Management System

A modern, fully functional HR and Employee Management System with separate portals for HR administrators and employees.

## 🌐 Live Application

**Frontend (Vercel):** https://staff-sync-ldc9.vercel.app  
**Backend API (Render):** https://staffsync-backend-w5dd.onrender.com  
**API Documentation:** https://staffsync-backend-w5dd.onrender.com/docs

> **Note:** The backend is hosted on Render's free tier. The first request after 15 minutes of inactivity may take ~30 seconds as the server wakes up.

---

## ⚠️ Important: About the Data

**The application is fully dynamic and functional** - all data is stored in a real PostgreSQL database and can be created, updated, and deleted through the interface.

**Dummy Data for Testing:**
The HR portal currently shows 4 pre-loaded employees with Indian names. This dummy data was added for testing and demonstration purposes only. The system is **not static** - you can:
- Add new employees
- Edit existing employee information
- Delete employees
- Mark attendance
- All changes are saved to the database in real-time

The dummy data simply provides a starting point to explore the features without having to manually create test data.

---

## 📸 Application Screenshots

### Homepage
![Homepage](screenshots/homepage.png)
*Modern landing page with clear navigation to HR and Employee portals*

### HR Portal Dashboard
![HR Dashboard](screenshots/hr%20portal.png)
*Comprehensive HR dashboard with real-time statistics, attendance charts, and recent activity feed*

### Employee Portal Dashboard
![Employee Dashboard](screenshots/employee%20portal.png)
*Personalized employee dashboard with performance metrics, tasks, and quick actions*

---

## 📖 About the Project

StaffSync is a complete HR management solution that provides two distinct portals:

### HR Portal
HR administrators can:
- View dashboard with real-time statistics
- Manage employees (add, edit, delete)
- Track and mark attendance
- View recent activity feed
- Access employee performance data

### Employee Portal
Employees can:
- View personalized dashboard
- Check in/out for attendance
- View attendance history
- Manage tasks
- Upload and view documents
- Read company announcements

---

## 🏗️ Project Structure

```
StaffSync/
├── backend/          # FastAPI backend server
│   ├── app/
│   │   ├── api/      # API endpoints (auth, hr, employee)
│   │   ├── models/   # Database models
│   │   ├── schemas/  # Request/response schemas
│   │   └── core/     # Security and authentication
│   └── requirements.txt
│
└── frontend/         # React frontend application
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/ # Reusable components
    │   └── lib/      # API client and utilities
    └── package.json
```

---

## � Technology Stack

**Backend:**
- FastAPI (Python web framework)
- PostgreSQL (Production database)
- SQLAlchemy (ORM)
- JWT (Authentication)
- Pydantic (Data validation)

**Frontend:**
- React with TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- Axios (API calls)
- React Router (Navigation)

---

## 🔑 Login Credentials

### HR Portal
**You must use the dummy credentials to access the HR portal:**
```
Email: hr@staffsync.com
Password: demo123
```

### Employee Portal
**You have two options:**

**Option 1: Create Your Own Account (Recommended)**

- Click "Sign Up" on the homepage
- Fill in your details
- Login with your new credentials

**Option 2: Use Dummy Employee Account**
```
Email: rahul.sharma@staffsync.com
Password: employee123
```

> **Note:** Creating your own account is recommended to experience the full registration flow and have personalized data.

---

## 🚀 Running Locally

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python run.py
```

Backend runs at: http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## � Key Features

✅ **Authentication System**
- Secure login/signup
- JWT token-based authentication
- Role-based access control (HR/Employee)

✅ **HR Dashboard**
- Real-time statistics
- Employee management (CRUD operations)
- Attendance tracking and marking
- Recent activity feed

✅ **Employee Dashboard**
- Personal attendance tracking
- Self-service check-in/check-out
- Task management
- Document uploads
- Company announcements

✅ **Fully Responsive**
- Works on desktop, tablet, and mobile devices

---

## 🗄️ Database

**Production:** PostgreSQL on Render  
**Development:** SQLite (local)

The database includes:
- Users and authentication
- Employee profiles
- Attendance records
- Tasks and documents
- Announcements

---

## 📡 API Endpoints

The backend provides RESTful APIs for:

**Authentication:**
- POST `/api/auth/login` - User login
- POST `/api/auth/signup` - User registration
- GET `/api/auth/me` - Get current user

**HR Portal:**
- GET `/api/hr/dashboard/stats` - Dashboard statistics
- GET `/api/hr/employees` - List all employees
- POST `/api/hr/employees` - Add new employee
- PUT `/api/hr/employees/{id}` - Update employee
- DELETE `/api/hr/employees/{id}` - Delete employee
- GET `/api/hr/attendance` - View attendance records
- POST `/api/hr/attendance/mark` - Mark attendance

**Employee Portal:**
- GET `/api/employee/dashboard` - Employee dashboard
- POST `/api/employee/attendance/checkin` - Check in
- POST `/api/employee/attendance/checkout` - Check out
- GET `/api/employee/attendance` - View attendance history
- GET `/api/employee/tasks` - View tasks
- GET `/api/employee/documents` - View documents

Full API documentation available at: https://staffsync-backend-w5dd.onrender.com/docs

---

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected API endpoints
- CORS configured for frontend domain
- Input validation on all endpoints

---

## 📱 Screenshots

Visit the live application to see:
- Modern, clean user interface
- Responsive design
- Intuitive navigation
- Real-time data updates

---

## 🛠️ Development

The project follows best practices:
- Clean code structure
- Separation of concerns
- RESTful API design
- Component-based frontend architecture
- Environment-based configuration

---

## 📝 License

This project is open source and available for educational purposes.

---

## 👨‍💻 Author

Developed as a full-stack HR management solution demonstrating modern web development practices.

---

**StaffSync** - Simplifying HR Management
