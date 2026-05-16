# StaffSync Backend API

FastAPI-based backend for the StaffSync HR & Employee Management System.

## 🚀 Quick Start

### Prerequisites
- Python 3.10 or higher
- PostgreSQL 14+ (or SQLite for development)
- pip (Python package manager)

### Installation

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Initialize database**
```bash
# For SQLite (development)
# Database will be created automatically

# For PostgreSQL (production)
# Create database first:
# createdb staffsync_db

# Run migrations (coming soon)
# alembic upgrade head
```

6. **Run the server**
```bash
uvicorn app.main:app --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── database.py          # Database setup
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── employee.py
│   │   ├── attendance.py
│   │   ├── task.py
│   │   ├── document.py
│   │   ├── announcement.py
│   │   └── leave_request.py
│   ├── schemas/             # Pydantic schemas (coming soon)
│   ├── api/                 # API routes (coming soon)
│   ├── core/                # Core functionality (coming soon)
│   └── utils/               # Utilities (coming soon)
├── tests/                   # Tests (coming soon)
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## 🔧 Configuration

Edit `.env` file with your settings:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/staffsync_db

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing

### Quick API Test
```bash
# Make sure server is running first
python run.py

# In another terminal, run the test script
python test_api.py
```

### Manual Testing with cURL

**Signup:**
```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yugal@example.com",
    "password": "Test123456",
    "name": "Yugal Lohani",
    "phone": "+91-9876543210",
    "department": "Engineering"
  }'
```

**Login:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yugal@example.com",
    "password": "Test123456"
  }'
```

**Get Current User:**
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Unit Tests (coming soon)
```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## 🗄️ Database Models

### Core Models
- **User**: Authentication and basic profile
- **Employee**: Extended employee information
- **Attendance**: Daily attendance records
- **Task**: Task management
- **Document**: Document storage metadata
- **Announcement**: Company announcements
- **LeaveRequest**: Leave request management

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:
1. Login/Signup returns access token and refresh token
2. Include access token in Authorization header: `Bearer <token>`
3. Access token expires in 30 minutes
4. Use refresh token to get new access token

## 📝 Development Status

### ✅ Phase 1: Backend Setup & Foundation (COMPLETE)
- [x] Project structure
- [x] Configuration management
- [x] Database setup
- [x] All database models (7 models)
- [x] CORS configuration
- [x] Error handling middleware
- [x] Health check endpoint

### ✅ Phase 2: Authentication & Security (COMPLETE)
- [x] Password hashing with bcrypt
- [x] JWT token generation and verification
- [x] Access token and refresh token system
- [x] Authentication dependencies
- [x] Role-based authorization
- [x] Pydantic schemas for requests/responses
- [x] Authentication endpoints:
  - [x] POST /api/auth/signup - Employee registration
  - [x] POST /api/auth/login - User login
  - [x] POST /api/auth/refresh - Refresh access token
  - [x] POST /api/auth/logout - User logout
  - [x] GET /api/auth/me - Get current user profile

### 🚧 Phase 3: HR Portal Endpoints (NEXT)
- [ ] HR Dashboard statistics
- [ ] Employee management (CRUD)
- [ ] Attendance management
- [ ] HR Analytics

### 🚧 Phase 4: Employee Portal Endpoints
- [ ] Employee dashboard
- [ ] Attendance (check-in/check-out)
- [ ] Task management
- [ ] Document management
- [ ] Announcements
- [ ] Leave requests

### 🚧 Phase 5: Data Seeding
- [ ] Seed script for dummy data
- [ ] 15 employees with realistic data
- [ ] 60 days of attendance records
- [ ] Tasks, documents, announcements

### 🚧 Phase 6: Frontend Integration
- [ ] API client setup
- [ ] Update authentication flow
- [ ] Connect all components to API

### 🚧 Phase 7: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] API endpoint tests

### 🚧 Phase 8: Deployment
- [ ] Production configuration
- [ ] Database migrations
- [ ] Deployment guide

## 🤝 Contributing

1. Follow PEP 8 style guide
2. Add docstrings to all functions
3. Write tests for new features
4. Update documentation

## 📄 License

Proprietary - StaffSync

## 🆘 Support

For issues or questions, contact the development team.


## 🎉 Phase 3 Complete: HR Portal Endpoints

Phase 3 is now complete with 8 fully functional HR portal endpoints:

### Implemented Endpoints

1. **GET `/api/hr/dashboard/stats`** - Dashboard statistics
2. **GET `/api/hr/employees`** - List employees (paginated, searchable, filterable)
3. **POST `/api/hr/employees`** - Add new employee
4. **PUT `/api/hr/employees/{id}`** - Update employee
5. **DELETE `/api/hr/employees/{id}`** - Deactivate employee
6. **GET `/api/hr/attendance`** - View all attendance records
7. **POST `/api/hr/attendance/mark`** - Mark attendance manually
8. **GET `/api/hr/analytics`** - HR analytics and insights

### Testing

Test all HR endpoints:
```bash
python test_hr_api.py
```

### What's Working

✅ Complete employee management (CRUD)  
✅ Attendance tracking and reporting  
✅ Dashboard statistics with trends  
✅ Analytics (top performers, attendance issues)  
✅ Search, filter, sort, pagination  
✅ Role-based authorization (HR only)  
✅ Comprehensive validation  
✅ Auto-generated employee IDs  
✅ Hours worked calculation  
✅ Soft delete (deactivation)  

See `PHASE_3_COMPLETE.md` for detailed documentation.

---

## 🎉 Phase 4 Complete: Employee Portal Endpoints

Phase 4 is now complete with 10 fully functional Employee portal endpoints:

### Implemented Endpoints

1. **GET `/api/employee/dashboard`** - Employee dashboard with metrics
2. **GET `/api/employee/attendance`** - View personal attendance history
3. **POST `/api/employee/attendance/checkin`** - Check in for today
4. **POST `/api/employee/attendance/checkout`** - Check out for today
5. **GET `/api/employee/tasks`** - View personal tasks
6. **POST `/api/employee/tasks`** - Create personal task
7. **PUT `/api/employee/tasks/{id}`** - Update task
8. **GET `/api/employee/documents`** - View personal documents
9. **POST `/api/employee/documents`** - Upload document
10. **GET `/api/employee/announcements`** - View company announcements

### Testing

Test all Employee endpoints:
```bash
python test_employee_api.py
```

### What's Working

✅ Complete dashboard with performance metrics  
✅ Self-service attendance (check-in/out)  
✅ Automatic hours calculation  
✅ Late status detection (after 9:30 AM)  
✅ Task management (create, update, view)  
✅ Document upload with validation  
✅ Announcements viewing  
✅ Data isolation (employees see only their data)  
✅ Overdue task detection  
✅ Monthly attendance summary  

See `PHASE_4_COMPLETE.md` for detailed documentation.

---

**Next**: Phase 5 - Data Seeding


## 🎉 Phase 5 Complete: Data Seeding

Phase 5 is now complete with a comprehensive database seeding script:

### Seed Script Features

- **1 HR Administrator** - hr@staffsync.com / demo123
- **15 Employees** - Realistic Indian names, distributed across departments
- **~900 Attendance Records** - 60 days of historical data with realistic patterns
- **40 Tasks** - Distributed across employees with varied statuses
- **30 Documents** - Different categories and file types
- **10 Announcements** - Company-wide communications

### Usage

Seed the database:
```bash
python seed_data.py
```

Clear and reseed:
```bash
python seed_data.py --clear
```

### What Gets Created

✅ Realistic Indian names and emails  
✅ 85-95% attendance rate per employee  
✅ Check-in times: 8:00 AM - 9:30 AM  
✅ Check-out times: 5:00 PM - 7:00 PM  
✅ Automatic hours calculation  
✅ Late status detection  
✅ Weekend skipping  
✅ Task status distribution (40% pending, 30% in-progress, 30% completed)  
✅ Document categories (contract, policy, report, other)  
✅ Announcements with priorities  

### Login Credentials

**HR Administrator:**
- Email: `hr@staffsync.com`
- Password: `demo123`

**Employees:**
- Email: `[firstname].[lastname][number]@staffsync.com`
- Password: `employee123`
- Example: `rahul.sharma0@staffsync.com`

See `PHASE_5_COMPLETE.md` for detailed documentation.

---

**Next**: Phase 6 - Frontend Integration
