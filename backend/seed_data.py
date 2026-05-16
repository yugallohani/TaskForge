"""
Database Seed Script
Populates the database with realistic dummy data for testing and development

Usage:
    python seed_data.py              # Seed data
    python seed_data.py --clear      # Clear existing data first
"""

import sys
import argparse
from datetime import date, datetime, time, timedelta
from decimal import Decimal
import random

# Add app to path
sys.path.insert(0, '.')

from app.database import SessionLocal, init_db
from app.models.user import User, UserRole
from app.models.employee import Employee, EmployeeStatus
from app.models.attendance import Attendance, AttendanceStatus
from app.models.task import Task, TaskStatus, TaskPriority
from app.models.document import Document, DocumentCategory
from app.models.announcement import Announcement, AnnouncementPriority, TargetAudience
from app.core.security import get_password_hash


# Indian names for realistic data
FIRST_NAMES = [
    "Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Arjun", "Pooja",
    "Rohan", "Neha", "Karan", "Divya", "Aditya", "Riya", "Sanjay", "Kavya",
    "Rajesh", "Meera", "Nikhil", "Shreya"
]

LAST_NAMES = [
    "Sharma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Verma", "Joshi",
    "Mehta", "Nair", "Rao", "Iyer", "Desai", "Malhotra", "Chopra", "Kapoor"
]

DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance"]

POSITIONS = {
    "Engineering": ["Software Engineer", "Senior Developer", "Tech Lead", "QA Engineer"],
    "Sales": ["Sales Executive", "Account Manager", "Sales Manager", "Business Development"],
    "Marketing": ["Marketing Executive", "Content Writer", "Digital Marketer", "Marketing Manager"],
    "HR": ["HR Executive", "Recruiter", "HR Manager", "Training Coordinator"],
    "Finance": ["Accountant", "Financial Analyst", "Finance Manager", "Accounts Executive"]
}

TASK_TITLES = [
    "Complete project documentation",
    "Review code changes",
    "Prepare monthly report",
    "Client meeting preparation",
    "Update system requirements",
    "Team performance review",
    "Budget planning",
    "Training session",
    "Database optimization",
    "Security audit",
    "Marketing campaign planning",
    "Sales target analysis",
    "Employee onboarding",
    "System maintenance",
    "Quality assurance testing"
]

ANNOUNCEMENT_TITLES = [
    "Company Holiday Announcement",
    "New Policy Update",
    "Team Building Event",
    "System Maintenance Notice",
    "Performance Review Cycle",
    "Office Timing Change",
    "New Employee Welcome",
    "Training Program Launch",
    "Health & Safety Guidelines",
    "Year-End Celebration"
]


def clear_data(db):
    """Clear all existing data from database"""
    print("🗑️  Clearing existing data...")
    
    # Delete in reverse order of dependencies
    db.query(Announcement).delete()
    db.query(Document).delete()
    db.query(Task).delete()
    db.query(Attendance).delete()
    db.query(Employee).delete()
    db.query(User).delete()
    
    db.commit()
    print("✅ Data cleared successfully")


def create_hr_admin(db):
    """Create HR administrator account"""
    print("\n👤 Creating HR Administrator...")
    
    # Check if HR admin already exists
    existing = db.query(User).filter(User.email == "hr@staffsync.com").first()
    if existing:
        print("⚠️  HR admin already exists, skipping...")
        return existing
    
    hr_user = User(
        email="hr@staffsync.com",
        password_hash=get_password_hash("demo123"),
        name="HR Admin",
        role=UserRole.HR_ADMINISTRATOR,
        department="Human Resources",
        phone="+91-9876543210",
        is_active=True
    )
    
    db.add(hr_user)
    db.commit()
    db.refresh(hr_user)
    
    print(f"✅ HR Admin created: {hr_user.email} / demo123")
    return hr_user


def create_employees(db, count=4):
    """Create employee accounts"""
    print(f"\n👥 Creating {count} employees...")
    
    employees = []
    today = date.today()
    
    # Specific 4 employees with Indian names
    employee_data = [
        {
            "first_name": "Rahul",
            "last_name": "Sharma",
            "department": "Engineering",
            "position": "Software Engineer",
            "salary": 75000
        },
        {
            "first_name": "Priya",
            "last_name": "Patel",
            "department": "Marketing",
            "position": "Marketing Manager",
            "salary": 65000
        },
        {
            "first_name": "Amit",
            "last_name": "Kumar",
            "department": "Sales",
            "position": "Sales Executive",
            "salary": 55000
        },
        {
            "first_name": "Sneha",
            "last_name": "Gupta",
            "department": "HR",
            "position": "HR Executive",
            "salary": 60000
        }
    ]
    
    for i, emp_data in enumerate(employee_data):
        full_name = f"{emp_data['first_name']} {emp_data['last_name']}"
        email = f"{emp_data['first_name'].lower()}.{emp_data['last_name'].lower()}@staffsync.com"
        
        # Random hire date (6 months to 2 years ago)
        days_ago = random.randint(180, 730)
        hire_date = today - timedelta(days=days_ago)
        
        # Create user
        user = User(
            email=email,
            password_hash=get_password_hash("employee123"),
            name=full_name,
            role=UserRole.EMPLOYEE,
            department=emp_data['department'],
            phone=f"+91-{random.randint(7000000000, 9999999999)}",
            is_active=True
        )
        db.add(user)
        db.flush()
        
        # Generate employee ID
        employee_id = f"EMP-{hire_date.strftime('%Y%m%d')}-{i+1:04d}"
        
        # Create employee
        employee = Employee(
            user_id=user.id,
            employee_id=employee_id,
            position=emp_data['position'],
            hire_date=hire_date,
            salary=Decimal(emp_data['salary']),
            status=EmployeeStatus.ACTIVE,
            performance_score=Decimal(random.randint(75, 95))
        )
        db.add(employee)
        db.flush()
        
        employees.append((user, employee))
        print(f"  ✓ {full_name} ({emp_data['department']}) - {email}")
    
    db.commit()
    print(f"✅ {count} employees created (password: employee123)")
    return employees


def create_attendance_records(db, employees, days=60):
    """Create attendance records for the last N days"""
    print(f"\n📅 Creating {days} days of attendance records...")
    
    today = date.today()
    total_records = 0
    
    for user, employee in employees:
        # Each employee has 85-95% attendance rate
        attendance_rate = random.uniform(0.85, 0.95)
        
        for day_offset in range(days):
            current_date = today - timedelta(days=day_offset)
            
            # Skip weekends (Saturday=5, Sunday=6)
            if current_date.weekday() >= 5:
                continue
            
            # Randomly skip some days based on attendance rate
            if random.random() > attendance_rate:
                # Absent or on leave
                status = random.choice([AttendanceStatus.ABSENT, AttendanceStatus.ON_LEAVE])
                attendance = Attendance(
                    employee_id=employee.id,
                    date=current_date,
                    status=status
                )
                db.add(attendance)
                total_records += 1
                continue
            
            # Generate realistic check-in time (8:00 AM - 9:30 AM)
            check_in_hour = random.randint(8, 9)
            check_in_minute = random.randint(0, 59)
            
            # Determine if late (after 9:30 AM)
            if check_in_hour > 9 or (check_in_hour == 9 and check_in_minute > 30):
                status = AttendanceStatus.LATE
            else:
                status = AttendanceStatus.PRESENT
            
            check_in = time(check_in_hour, check_in_minute, 0)
            
            # Generate realistic check-out time (5:00 PM - 7:00 PM)
            check_out_hour = random.randint(17, 19)
            check_out_minute = random.randint(0, 59)
            check_out = time(check_out_hour, check_out_minute, 0)
            
            # Calculate hours worked
            check_in_dt = datetime.combine(current_date, check_in)
            check_out_dt = datetime.combine(current_date, check_out)
            hours_worked = Decimal((check_out_dt - check_in_dt).total_seconds() / 3600)
            
            attendance = Attendance(
                employee_id=employee.id,
                date=current_date,
                check_in=check_in,
                check_out=check_out,
                hours_worked=hours_worked,
                status=status
            )
            db.add(attendance)
            total_records += 1
    
    db.commit()
    print(f"✅ {total_records} attendance records created")


def create_tasks(db, employees, count=40):
    """Create tasks for employees"""
    print(f"\n📋 Creating {count} tasks...")
    
    today = date.today()
    
    for i in range(count):
        # Random employee
        user, employee = random.choice(employees)
        
        # Random task
        title = random.choice(TASK_TITLES)
        description = f"Task description for {title.lower()}"
        
        # Random status distribution (40% pending, 30% in-progress, 30% completed)
        status_choice = random.random()
        if status_choice < 0.4:
            status = TaskStatus.PENDING
        elif status_choice < 0.7:
            status = TaskStatus.IN_PROGRESS
        else:
            status = TaskStatus.COMPLETED
        
        # Random priority (30% low, 50% medium, 20% high)
        priority_choice = random.random()
        if priority_choice < 0.3:
            priority = TaskPriority.LOW
        elif priority_choice < 0.8:
            priority = TaskPriority.MEDIUM
        else:
            priority = TaskPriority.HIGH
        
        # Random due date (past week to next month)
        days_offset = random.randint(-7, 30)
        due_date = today + timedelta(days=days_offset)
        
        # Random creation date (1-30 days ago)
        created_days_ago = random.randint(1, 30)
        created_at = datetime.now() - timedelta(days=created_days_ago)
        
        task = Task(
            employee_id=employee.id,
            assigned_by=user.id,  # Self-assigned
            title=title,
            description=description,
            status=status,
            priority=priority,
            due_date=due_date,
            created_at=created_at
        )
        db.add(task)
    
    db.commit()
    print(f"✅ {count} tasks created")


def create_documents(db, employees, count=30):
    """Create document records"""
    print(f"\n📄 Creating {count} documents...")
    
    categories = list(DocumentCategory)
    
    for i in range(count):
        # Random employee
        user, employee = random.choice(employees)
        
        # Random category
        category = random.choice(categories)
        
        # Generate title based on category
        if category == DocumentCategory.CONTRACT:
            title = f"Employment Contract - {user.name}"
        elif category == DocumentCategory.POLICY:
            title = f"Policy Document {i+1}"
        elif category == DocumentCategory.REPORT:
            title = f"Monthly Report - {random.choice(['Q1', 'Q2', 'Q3', 'Q4'])}"
        else:
            title = f"Document {i+1}"
        
        # Random file details
        file_extensions = ['.pdf', '.docx', '.xlsx']
        file_ext = random.choice(file_extensions)
        file_name = f"doc_{i+1}_{random.randint(1000, 9999)}{file_ext}"
        file_path = f"uploads/documents/{file_name}"
        file_size = random.randint(50000, 5000000)  # 50KB to 5MB
        
        # Random upload date (last 6 months)
        days_ago = random.randint(1, 180)
        uploaded_at = datetime.now() - timedelta(days=days_ago)
        
        document = Document(
            employee_id=employee.id,
            uploaded_by=user.id,
            title=title,
            category=category,
            file_name=file_name,
            file_path=file_path,
            file_size=file_size,
            uploaded_at=uploaded_at
        )
        db.add(document)
    
    db.commit()
    print(f"✅ {count} documents created")


def create_announcements(db, hr_user, count=10):
    """Create company announcements"""
    print(f"\n📢 Creating {count} announcements...")
    
    for i in range(count):
        title = random.choice(ANNOUNCEMENT_TITLES)
        
        # Generate content based on title
        if "Holiday" in title:
            content = "The office will be closed on the upcoming holiday. Please plan your work accordingly."
        elif "Policy" in title:
            content = "We have updated our company policies. Please review the new guidelines in the employee handbook."
        elif "Event" in title:
            content = "Join us for our annual team building event next month. More details to follow."
        elif "Maintenance" in title:
            content = "System maintenance is scheduled for this weekend. Services may be temporarily unavailable."
        elif "Review" in title:
            content = "The annual performance review cycle has begun. Please complete your self-assessment by the deadline."
        else:
            content = f"Important announcement regarding {title.lower()}. Please read carefully and take necessary action."
        
        # Random priority (70% normal, 30% high)
        priority = AnnouncementPriority.HIGH if random.random() < 0.3 else AnnouncementPriority.NORMAL
        
        # Random target audience
        target = random.choice([TargetAudience.ALL, TargetAudience.EMPLOYEES])
        
        # Random creation date (last 3 months)
        days_ago = random.randint(1, 90)
        created_at = datetime.now() - timedelta(days=days_ago)
        
        announcement = Announcement(
            created_by=hr_user.id,
            title=title,
            content=content,
            priority=priority,
            target_audience=target,
            created_at=created_at
        )
        db.add(announcement)
    
    db.commit()
    print(f"✅ {count} announcements created")


def print_summary(db):
    """Print summary of seeded data"""
    print("\n" + "="*60)
    print("📊 DATABASE SEED SUMMARY")
    print("="*60)
    
    user_count = db.query(User).count()
    employee_count = db.query(Employee).count()
    attendance_count = db.query(Attendance).count()
    task_count = db.query(Task).count()
    document_count = db.query(Document).count()
    announcement_count = db.query(Announcement).count()
    
    print(f"\n✅ Users: {user_count}")
    print(f"   - 1 HR Administrator")
    print(f"   - {employee_count} Employees")
    print(f"\n✅ Attendance Records: {attendance_count}")
    print(f"✅ Tasks: {task_count}")
    print(f"✅ Documents: {document_count}")
    print(f"✅ Announcements: {announcement_count}")
    
    print("\n" + "="*60)
    print("🔑 LOGIN CREDENTIALS")
    print("="*60)
    print("\nHR Administrator:")
    print("  Email: hr@staffsync.com")
    print("  Password: demo123")
    print("\nEmployees:")
    print("  1. Rahul Sharma - rahul.sharma@staffsync.com / employee123")
    print("  2. Priya Patel - priya.patel@staffsync.com / employee123")
    print("  3. Amit Kumar - amit.kumar@staffsync.com / employee123")
    print("  4. Sneha Gupta - sneha.gupta@staffsync.com / employee123")
    print("\n" + "="*60 + "\n")


def main():
    """Main seed function"""
    parser = argparse.ArgumentParser(description='Seed database with dummy data')
    parser.add_argument('--clear', action='store_true', help='Clear existing data first')
    args = parser.parse_args()
    
    print("\n" + "="*60)
    print("🌱 STAFFSYNC DATABASE SEEDING")
    print("="*60)
    
    # Initialize database
    print("\n🔧 Initializing database...")
    init_db()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Clear data if requested
        if args.clear:
            clear_data(db)
        
        # Create HR admin
        hr_user = create_hr_admin(db)
        
        # Create employees
        employees = create_employees(db, count=4)
        
        # Create attendance records (60 days)
        create_attendance_records(db, employees, days=60)
        
        # Create tasks
        create_tasks(db, employees, count=40)
        
        # Create documents
        create_documents(db, employees, count=30)
        
        # Create announcements
        create_announcements(db, hr_user, count=10)
        
        # Print summary
        print_summary(db)
        
        print("✅ Database seeding completed successfully!\n")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
