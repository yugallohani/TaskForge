"""
HR Portal API Endpoints
Endpoints for HR administrators to manage employees, attendance, and analytics
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc, extract
from typing import List, Optional
from datetime import date, datetime, time as dt_time, timedelta
from decimal import Decimal
import uuid

from ..database import get_db
from ..models.user import User, UserRole
from ..models.employee import Employee, EmployeeStatus
from ..models.attendance import Attendance, AttendanceStatus
from ..models.notification import Notification, NotificationType
from ..schemas.response import SuccessResponse, PaginatedResponse
from ..schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse, EmployeeListItem
from ..schemas.attendance import AttendanceMarkManual, AttendanceResponse, AttendanceSummary
from ..schemas.notification import NotificationCreate, NotificationResponse
from ..core.dependencies import get_current_active_user, require_role
from ..core.security import get_password_hash


router = APIRouter()


# ============================================================================
# HR Dashboard
# ============================================================================

@router.get("/dashboard/stats", response_model=SuccessResponse)
async def get_dashboard_stats(
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Get HR dashboard statistics
    
    Returns:
    - Total employees count
    - Today's attendance statistics
    - Approved leave requests for today
    - Pending leave requests count
    - Department distribution
    - Monthly attendance trends (last 6 months)
    - Recent activities
    """
    from ..models.leave_request import LeaveRequest, LeaveStatus
    
    # Total employees
    total_employees = db.query(Employee).count()
    active_employees = db.query(Employee).filter(Employee.status == EmployeeStatus.ACTIVE).count()
    inactive_employees = total_employees - active_employees
    
    # Today's attendance
    today = date.today()
    today_attendance = db.query(Attendance).filter(Attendance.date == today).all()
    
    attendance_stats = {
        "present": sum(1 for a in today_attendance if a.status == AttendanceStatus.PRESENT),
        "absent": sum(1 for a in today_attendance if a.status == AttendanceStatus.ABSENT),
        "late": sum(1 for a in today_attendance if a.status == AttendanceStatus.LATE),
        "on_leave": sum(1 for a in today_attendance if a.status == AttendanceStatus.ON_LEAVE),
    }
    
    total_marked = len(today_attendance)
    attendance_stats["attendance_rate"] = round(
        ((attendance_stats["present"] + attendance_stats["late"]) / total_marked * 100) if total_marked > 0 else 0,
        1
    )
    
    # Department distribution
    dept_distribution = db.query(
        User.department,
        func.count(Employee.id).label('count')
    ).join(Employee, User.id == Employee.user_id).group_by(User.department).all()
    
    departments = {dept: count for dept, count in dept_distribution}
    
    # Monthly attendance trends (last 6 months)
    six_months_ago = today - timedelta(days=180)
    monthly_trends = []
    
    for i in range(6):
        month_start = (today.replace(day=1) - timedelta(days=30 * i)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        month_attendance = db.query(Attendance).filter(
            and_(
                Attendance.date >= month_start,
                Attendance.date <= month_end
            )
        ).all()
        
        if month_attendance:
            present_count = sum(1 for a in month_attendance if a.status in [AttendanceStatus.PRESENT, AttendanceStatus.LATE])
            total_count = len(month_attendance)
            rate = round((present_count / total_count * 100) if total_count > 0 else 0, 1)
        else:
            rate = 0
        
        monthly_trends.insert(0, {
            "month": month_start.strftime("%b %Y"),
            "rate": rate
        })
    
    # Calculate current month's average attendance (based on today's attendance rate)
    # This shows: (Present Today + Late Today) / Total Employees * 100
    if total_employees > 0:
        present_today = attendance_stats["present"] + attendance_stats["late"]
        monthly_attendance_avg = round((present_today / total_employees * 100), 1)
    else:
        monthly_attendance_avg = 0
    
    # Recent activities (last 10 attendance records)
    recent_attendance = db.query(Attendance).join(
        Employee, Attendance.employee_id == Employee.id
    ).join(
        User, Employee.user_id == User.id
    ).order_by(desc(Attendance.created_at)).limit(10).all()
    
    recent_activities = []
    for att in recent_attendance:
        employee_name = att.employee.user.name
        if att.check_in:
            recent_activities.append({
                "id": str(att.id),
                "type": "attendance",
                "description": f"{employee_name} checked in",
                "timestamp": att.created_at.isoformat()
            })
    
    # Leave requests statistics
    pending_leave_requests = db.query(LeaveRequest).filter(
        LeaveRequest.status == LeaveStatus.PENDING
    ).count()
    
    # Count employees on approved leave today
    approved_leaves_today = db.query(LeaveRequest).filter(
        and_(
            LeaveRequest.status == LeaveStatus.APPROVED,
            LeaveRequest.start_date <= today,
            LeaveRequest.end_date >= today
        )
    ).count()
    
    return {
        "success": True,
        "data": {
            "total_employees": total_employees,
            "active_employees": active_employees,
            "inactive_employees": inactive_employees,
            "today_attendance": attendance_stats,
            "pending_leave_requests": pending_leave_requests,
            "approved_leaves_today": approved_leaves_today,
            "departments": departments,
            "monthly_attendance_trend": monthly_trends,
            "monthly_attendance_avg": monthly_attendance_avg,
            "recent_activities": recent_activities
        }
    }


# ============================================================================
# Employee Management
# ============================================================================

@router.get("/employees", response_model=PaginatedResponse)
async def list_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    status: Optional[str] = Query(None, pattern=r'^(active|inactive|on_leave)$'),
    sort_by: Optional[str] = Query("created_at", pattern=r'^(name|hire_date|department|created_at)$'),
    sort_order: Optional[str] = Query("desc", pattern=r'^(asc|desc)$'),
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Get paginated list of all employees
    
    Query Parameters:
    - page: Page number (default: 1)
    - page_size: Items per page (default: 20, max: 100)
    - search: Search by name or email
    - department: Filter by department
    - status: Filter by status (active/inactive/on_leave)
    - sort_by: Sort field (name, hire_date, department, created_at) - default: created_at
    - sort_order: Sort order (asc/desc) - default: desc (newest first)
    """
    
    # Base query
    query = db.query(Employee).join(User, Employee.user_id == User.id)
    
    # Apply filters
    if search:
        search_filter = or_(
            User.name.ilike(f"%{search}%"),
            User.email.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if department:
        query = query.filter(User.department == department)
    
    if status:
        query = query.filter(Employee.status == status)
    
    # Apply sorting
    if sort_by == "name":
        sort_column = User.name
    elif sort_by == "hire_date":
        sort_column = Employee.hire_date
    elif sort_by == "department":
        sort_column = User.department
    elif sort_by == "created_at":
        sort_column = User.created_at
    else:
        sort_column = User.created_at
    
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(sort_column)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    employees = query.offset(offset).limit(page_size).all()
    
    # Format response
    items = []
    for emp in employees:
        items.append({
            "id": str(emp.id),
            "employee_id": emp.employee_id,
            "name": emp.user.name,
            "email": emp.user.email,
            "phone": emp.user.phone,
            "department": emp.user.department,
            "position": emp.position,
            "hire_date": emp.hire_date.isoformat(),
            "status": emp.status.value,
            "salary": float(emp.salary) if emp.salary else None
        })
    
    total_pages = (total + page_size - 1) // page_size
    
    return {
        "success": True,
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    }


@router.post("/employees", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def add_employee(
    employee_data: EmployeeCreate,
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Create a new employee
    
    Creates both User and Employee records
    """
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == employee_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "EMAIL_EXISTS",
                    "message": "Email already exists",
                    "details": None
                }
            }
        )
    
    # Generate employee ID (format: EMP-YYYYMMDD-XXXX)
    today_str = datetime.now().strftime("%Y%m%d")
    last_employee = db.query(Employee).filter(
        Employee.employee_id.like(f"EMP-{today_str}-%")
    ).order_by(desc(Employee.employee_id)).first()
    
    if last_employee:
        last_num = int(last_employee.employee_id.split('-')[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    
    employee_id = f"EMP-{today_str}-{new_num:04d}"
    
    # Create user
    new_user = User(
        email=employee_data.email,
        password_hash=get_password_hash(employee_data.password),
        name=employee_data.name,
        role=UserRole.EMPLOYEE,
        department=employee_data.department,
        phone=employee_data.phone,
        is_active=True
    )
    db.add(new_user)
    db.flush()  # Get user ID
    
    # Create employee
    new_employee = Employee(
        user_id=new_user.id,
        employee_id=employee_id,
        position=employee_data.position,
        hire_date=employee_data.hire_date,
        salary=employee_data.salary,
        status=EmployeeStatus.ACTIVE
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    return {
        "success": True,
        "data": {
            "id": str(new_employee.id),
            "employee_id": new_employee.employee_id,
            "name": new_user.name,
            "email": new_user.email,
            "phone": new_user.phone,
            "department": new_user.department,
            "position": new_employee.position,
            "hire_date": new_employee.hire_date.isoformat(),
            "status": new_employee.status.value,
            "salary": float(new_employee.salary) if new_employee.salary else None,
            "created_at": new_user.created_at.isoformat()
        },
        "message": "Employee created successfully"
    }


@router.put("/employees/{employee_id}", response_model=SuccessResponse)
async def update_employee(
    employee_id: str,
    employee_data: EmployeeUpdate,
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Update employee information
    """
    
    # Find employee
    try:
        emp_uuid = uuid.UUID(employee_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid employee ID format"
        )
    
    employee = db.query(Employee).filter(Employee.id == emp_uuid).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Update user fields
    user = employee.user
    if employee_data.name:
        user.name = employee_data.name
    if employee_data.phone:
        user.phone = employee_data.phone
    if employee_data.department:
        user.department = employee_data.department
    
    # Update employee fields
    if employee_data.position:
        employee.position = employee_data.position
    if employee_data.salary is not None:
        employee.salary = employee_data.salary
    if employee_data.status:
        employee.status = EmployeeStatus(employee_data.status)
    if employee_data.performance_score is not None:
        employee.performance_score = employee_data.performance_score
    
    db.commit()
    db.refresh(employee)
    
    return {
        "success": True,
        "data": {
            "id": str(employee.id),
            "employee_id": employee.employee_id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "department": user.department,
            "position": employee.position,
            "salary": float(employee.salary) if employee.salary else None,
            "status": employee.status.value,
            "performance_score": float(employee.performance_score) if employee.performance_score else None,
            "updated_at": datetime.now().isoformat()
        },
        "message": "Employee updated successfully"
    }


@router.delete("/employees/{employee_id}", response_model=SuccessResponse)
async def delete_employee(
    employee_id: str,
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Deactivate an employee (soft delete)
    """
    
    # Find employee
    try:
        emp_uuid = uuid.UUID(employee_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid employee ID format"
        )
    
    employee = db.query(Employee).filter(Employee.id == emp_uuid).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Soft delete - mark as inactive
    employee.status = EmployeeStatus.INACTIVE
    employee.user.is_active = False
    
    db.commit()
    
    return {
        "success": True,
        "message": "Employee deactivated successfully"
    }


# ============================================================================
# Attendance Management
# ============================================================================

@router.get("/attendance", response_model=PaginatedResponse)
async def view_all_attendance(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    employee_id: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    status: Optional[str] = Query(None, pattern=r'^(present|absent|late|on_leave)$'),
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Get attendance records for all employees
    
    Query Parameters:
    - page: Page number
    - page_size: Items per page
    - employee_id: Filter by employee
    - department: Filter by department
    - start_date: Filter from date
    - end_date: Filter to date
    - status: Filter by status
    """
    
    # Base query
    query = db.query(Attendance).join(
        Employee, Attendance.employee_id == Employee.id
    ).join(
        User, Employee.user_id == User.id
    )
    
    # Apply filters
    if employee_id:
        try:
            emp_uuid = uuid.UUID(employee_id)
            query = query.filter(Attendance.employee_id == emp_uuid)
        except ValueError:
            pass
    
    if department:
        query = query.filter(User.department == department)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    if status:
        query = query.filter(Attendance.status == status)
    
    # Order by date descending
    query = query.order_by(desc(Attendance.date), desc(Attendance.created_at))
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    attendance_records = query.offset(offset).limit(page_size).all()
    
    # Format response
    items = []
    for att in attendance_records:
        items.append({
            "id": str(att.id),
            "employee": {
                "id": str(att.employee.id),
                "name": att.employee.user.name,
                "department": att.employee.user.department
            },
            "date": att.date.isoformat(),
            "check_in": att.check_in.isoformat() if att.check_in else None,
            "check_out": att.check_out.isoformat() if att.check_out else None,
            "hours_worked": float(att.hours_worked) if att.hours_worked else None,
            "status": att.status.value,
            "notes": att.notes
        })
    
    # Calculate summary
    all_records = db.query(Attendance).filter(
        and_(
            Attendance.date >= (start_date or date.today() - timedelta(days=30)),
            Attendance.date <= (end_date or date.today())
        )
    ).all()
    
    summary = {
        "present": sum(1 for a in all_records if a.status == AttendanceStatus.PRESENT),
        "absent": sum(1 for a in all_records if a.status == AttendanceStatus.ABSENT),
        "late": sum(1 for a in all_records if a.status == AttendanceStatus.LATE),
        "on_leave": sum(1 for a in all_records if a.status == AttendanceStatus.ON_LEAVE)
    }
    
    total_pages = (total + page_size - 1) // page_size
    
    return {
        "success": True,
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "summary": summary
        }
    }


@router.post("/attendance/mark", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance_manual(
    attendance_data: AttendanceMarkManual,
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Manually mark attendance for an employee
    """
    
    # Validate employee exists
    try:
        emp_uuid = uuid.UUID(attendance_data.employee_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid employee ID format"
        )
    
    employee = db.query(Employee).filter(Employee.id == emp_uuid).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Check if attendance already exists for this date
    existing = db.query(Attendance).filter(
        and_(
            Attendance.employee_id == emp_uuid,
            Attendance.date == attendance_data.date
        )
    ).first()
    
    # Calculate hours worked
    hours_worked = None
    if attendance_data.check_in and attendance_data.check_out:
        check_in_dt = datetime.combine(attendance_data.date, attendance_data.check_in)
        check_out_dt = datetime.combine(attendance_data.date, attendance_data.check_out)
        hours_worked = Decimal((check_out_dt - check_in_dt).total_seconds() / 3600)
    
    if existing:
        # Update existing record
        existing.check_in = attendance_data.check_in
        existing.check_out = attendance_data.check_out
        existing.hours_worked = hours_worked
        existing.status = AttendanceStatus(attendance_data.status)
        existing.notes = attendance_data.notes
        existing.marked_by = current_user.id
        db.commit()
        db.refresh(existing)
        attendance_record = existing
    else:
        # Create new record
        new_attendance = Attendance(
            employee_id=emp_uuid,
            date=attendance_data.date,
            check_in=attendance_data.check_in,
            check_out=attendance_data.check_out,
            hours_worked=hours_worked,
            status=AttendanceStatus(attendance_data.status),
            notes=attendance_data.notes,
            marked_by=current_user.id
        )
        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)
        attendance_record = new_attendance
    
    return {
        "success": True,
        "data": {
            "id": str(attendance_record.id),
            "employee_id": str(attendance_record.employee_id),
            "date": attendance_record.date.isoformat(),
            "check_in": attendance_record.check_in.isoformat() if attendance_record.check_in else None,
            "check_out": attendance_record.check_out.isoformat() if attendance_record.check_out else None,
            "hours_worked": float(attendance_record.hours_worked) if attendance_record.hours_worked else None,
            "status": attendance_record.status.value,
            "notes": attendance_record.notes,
            "marked_by": current_user.name
        },
        "message": "Attendance marked successfully"
    }


# ============================================================================
# HR Analytics
# ============================================================================

@router.get("/analytics", response_model=SuccessResponse)
async def get_hr_analytics(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    department: Optional[str] = Query(None),
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Get detailed HR analytics data
    
    Query Parameters:
    - start_date: From date (default: 30 days ago)
    - end_date: To date (default: today)
    - department: Filter by department
    """
    
    # Default date range
    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    # Base query
    query = db.query(Attendance).join(
        Employee, Attendance.employee_id == Employee.id
    ).join(
        User, Employee.user_id == User.id
    ).filter(
        and_(
            Attendance.date >= start_date,
            Attendance.date <= end_date
        )
    )
    
    if department:
        query = query.filter(User.department == department)
    
    all_attendance = query.all()
    
    # Attendance trends (daily)
    attendance_trends = []
    current_date = start_date
    while current_date <= end_date:
        day_records = [a for a in all_attendance if a.date == current_date]
        if day_records:
            present_count = sum(1 for a in day_records if a.status in [AttendanceStatus.PRESENT, AttendanceStatus.LATE])
            total_count = len(day_records)
            rate = round((present_count / total_count * 100) if total_count > 0 else 0, 1)
        else:
            rate = 0
        
        attendance_trends.append({
            "date": current_date.isoformat(),
            "rate": rate
        })
        current_date += timedelta(days=1)
    
    # Department comparison
    dept_query = db.query(
        User.department,
        func.count(Attendance.id).label('total'),
        func.sum(
            func.case(
                (Attendance.status.in_([AttendanceStatus.PRESENT, AttendanceStatus.LATE]), 1),
                else_=0
            )
        ).label('present')
    ).join(
        Employee, Attendance.employee_id == Employee.id
    ).join(
        User, Employee.user_id == User.id
    ).filter(
        and_(
            Attendance.date >= start_date,
            Attendance.date <= end_date
        )
    ).group_by(User.department).all()
    
    department_comparison = []
    for dept, total, present in dept_query:
        rate = round((present / total * 100) if total > 0 else 0, 1)
        department_comparison.append({
            "department": dept,
            "attendance_rate": rate
        })
    
    # Top performers (by attendance rate)
    employee_stats = {}
    for att in all_attendance:
        emp_id = str(att.employee_id)
        if emp_id not in employee_stats:
            employee_stats[emp_id] = {
                "name": att.employee.user.name,
                "total": 0,
                "present": 0
            }
        employee_stats[emp_id]["total"] += 1
        if att.status in [AttendanceStatus.PRESENT, AttendanceStatus.LATE]:
            employee_stats[emp_id]["present"] += 1
    
    top_performers = []
    for emp_id, stats in employee_stats.items():
        rate = round((stats["present"] / stats["total"] * 100) if stats["total"] > 0 else 0, 1)
        top_performers.append({
            "employee_id": emp_id,
            "name": stats["name"],
            "attendance_rate": rate,
            "total_days": stats["total"]
        })
    
    top_performers.sort(key=lambda x: x["attendance_rate"], reverse=True)
    top_performers = top_performers[:10]  # Top 10
    
    # Attendance issues (low attendance)
    attendance_issues = []
    for emp_id, stats in employee_stats.items():
        rate = round((stats["present"] / stats["total"] * 100) if stats["total"] > 0 else 0, 1)
        if rate < 80:  # Less than 80% attendance
            absent_days = stats["total"] - stats["present"]
            late_days = sum(1 for a in all_attendance if str(a.employee_id) == emp_id and a.status == AttendanceStatus.LATE)
            attendance_issues.append({
                "employee_id": emp_id,
                "name": stats["name"],
                "absent_days": absent_days,
                "late_days": late_days
            })
    
    # Average hours per employee
    total_hours = sum(float(a.hours_worked) for a in all_attendance if a.hours_worked)
    avg_hours = round(total_hours / len(employee_stats) if employee_stats else 0, 1)
    
    # Peak hours (most common check-in and check-out times)
    check_ins = [a.check_in for a in all_attendance if a.check_in]
    check_outs = [a.check_out for a in all_attendance if a.check_out]
    
    peak_check_in = max(set(check_ins), key=check_ins.count).isoformat() if check_ins else "09:00:00"
    peak_check_out = max(set(check_outs), key=check_outs.count).isoformat() if check_outs else "18:00:00"
    
    return {
        "success": True,
        "data": {
            "attendance_trends": attendance_trends,
            "department_comparison": department_comparison,
            "top_performers": top_performers,
            "attendance_issues": attendance_issues,
            "leave_patterns": {
                "sick_leave": 0,  # Will be implemented with leave requests
                "vacation": 0,
                "personal": 0
            },
            "average_hours_per_employee": avg_hours,
            "peak_hours": {
                "check_in": peak_check_in,
                "check_out": peak_check_out
            }
        }
    }


# ============================================================================
# Notifications
# ============================================================================

@router.post("/notifications", response_model=SuccessResponse)
async def send_notification(
    data: NotificationCreate,
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Send a notification to an employee or all employees
    
    Body:
    - recipient_id: Employee user ID (None for all employees)
    - title: Notification title
    - message: Notification message
    - type: Notification type (info, warning, success, error)
    """
    
    # If recipient_id is provided, verify the user exists
    if data.recipient_id:
        recipient = db.query(User).filter(
            User.id == uuid.UUID(data.recipient_id),
            User.role == UserRole.EMPLOYEE
        ).first()
        
        if not recipient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipient employee not found"
            )
        
        recipient_uuid = uuid.UUID(data.recipient_id)
    else:
        recipient_uuid = None
    
    # Create notification
    notification = Notification(
        sender_id=current_user.id,
        recipient_id=recipient_uuid,
        title=data.title,
        message=data.message,
        type=NotificationType(data.type)
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    recipient_text = "all employees" if not data.recipient_id else "employee"
    
    return {
        "success": True,
        "data": {
            "id": str(notification.id),
            "title": notification.title,
            "message": notification.message,
            "type": notification.type.value,
            "created_at": notification.created_at.isoformat()
        },
        "message": f"Notification sent to {recipient_text}"
    }


@router.get("/notifications/sent", response_model=SuccessResponse)
async def get_sent_notifications(
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Get notifications sent by the current HR user
    """
    
    notifications = db.query(Notification).filter(
        Notification.sender_id == current_user.id
    ).order_by(desc(Notification.created_at)).limit(limit).all()
    
    items = []
    for notif in notifications:
        recipient_name = "All Employees"
        if notif.recipient_id:
            recipient = db.query(User).filter(User.id == notif.recipient_id).first()
            recipient_name = recipient.name if recipient else "Unknown"
        
        items.append({
            "id": str(notif.id),
            "recipient_name": recipient_name,
            "title": notif.title,
            "message": notif.message,
            "type": notif.type.value,
            "is_read": notif.is_read,
            "created_at": notif.created_at.isoformat()
        })
    
    return {
        "success": True,
        "data": {
            "notifications": items,
            "total": len(items)
        }
    }


@router.get("/notifications", response_model=SuccessResponse)
async def get_hr_notifications(
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Get notifications received by the current HR user
    """
    
    # Get notifications where HR is the recipient or recipient is None (broadcast)
    notifications = db.query(Notification).filter(
        or_(
            Notification.recipient_id == current_user.id,
            Notification.recipient_id == None
        )
    ).order_by(desc(Notification.created_at)).limit(limit).all()
    
    items = []
    unread_count = 0
    
    for notif in notifications:
        sender_name = "System"
        if notif.sender_id:
            sender = db.query(User).filter(User.id == notif.sender_id).first()
            sender_name = sender.name if sender else "Unknown"
        
        if not notif.is_read:
            unread_count += 1
        
        items.append({
            "id": str(notif.id),
            "sender_name": sender_name,
            "title": notif.title,
            "message": notif.message,
            "type": notif.type.value,
            "is_read": notif.is_read,
            "created_at": notif.created_at.isoformat()
        })
    
    return {
        "success": True,
        "data": {
            "notifications": items,
            "unread_count": unread_count,
            "total": len(items)
        }
    }


@router.put("/notifications/{notification_id}/read", response_model=SuccessResponse)
async def mark_hr_notification_read(
    notification_id: str,
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Mark a notification as read for HR user
    """
    
    try:
        notif_uuid = uuid.UUID(notification_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid notification ID format"
        )
    
    notification = db.query(Notification).filter(
        Notification.id == notif_uuid,
        or_(
            Notification.recipient_id == current_user.id,
            Notification.recipient_id == None
        )
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    notification.is_read = True
    notification.read_at = datetime.now()
    db.commit()
    
    return {
        "success": True,
        "message": "Notification marked as read"
    }


@router.put("/notifications/read-all", response_model=SuccessResponse)
async def mark_all_hr_notifications_read(
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Mark all notifications as read for HR user
    """
    
    notifications = db.query(Notification).filter(
        or_(
            Notification.recipient_id == current_user.id,
            Notification.recipient_id == None
        ),
        Notification.is_read == False
    ).all()
    
    for notif in notifications:
        notif.is_read = True
        notif.read_at = datetime.now()
    
    db.commit()
    
    return {
        "success": True,
        "message": "All notifications marked as read"
    }


# ============================================================================
# Recent Activity
# ============================================================================

@router.get("/recent-activity", response_model=SuccessResponse)
async def get_recent_activity(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(require_role(UserRole.HR_ADMINISTRATOR)),
    db: Session = Depends(get_db)
):
    """
    Get recent activity in the system
    
    Returns recent events like:
    - New employees created
    - Employee clock in (with time)
    - Employee clock out (with time)
    - Leave requests submitted
    """
    from ..models.leave_request import LeaveRequest
    
    activities = []
    
    # Helper function to format time difference
    def format_time_diff(timestamp):
        # Handle both timezone-aware and naive timestamps
        if timestamp.tzinfo is None:
            # Assume naive timestamps are in UTC
            timestamp = timestamp.replace(tzinfo=None)
        else:
            # Convert to naive UTC
            timestamp = timestamp.replace(tzinfo=None)
        
        now = datetime.utcnow()
        time_diff = now - timestamp
        
        if time_diff.total_seconds() < 0:
            return "just now"
        elif time_diff.total_seconds() < 3600:  # Less than 1 hour
            minutes = int(time_diff.total_seconds() / 60)
            if minutes == 0:
                return "just now"
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif time_diff.total_seconds() < 86400:  # Less than 1 day
            hours = int(time_diff.total_seconds() / 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        else:
            days = time_diff.days
            return f"{days} day{'s' if days != 1 else ''} ago"
    
    # 1. Get recent employees created (last 7 days)
    # Use naive datetime for comparison since DB stores naive timestamps
    now = datetime.utcnow()
    seven_days_ago = now - timedelta(days=7)
    recent_employees = db.query(Employee).join(User).filter(
        User.created_at >= seven_days_ago
    ).order_by(desc(User.created_at)).limit(10).all()
    
    for emp in recent_employees:
        activities.append({
            "id": f"emp_{emp.id}",
            "type": "employee_created",
            "message": f"New employee {emp.user.name} was added",
            "time": format_time_diff(emp.user.created_at),
            "timestamp": emp.user.created_at.isoformat(),
            "employee_name": emp.user.name
        })
    
    # 2. Get recent clock-ins and clock-outs (last 24 hours)
    yesterday = now - timedelta(days=1)
    recent_attendance = db.query(Attendance).join(Employee).join(User).filter(
        Attendance.created_at >= yesterday
    ).order_by(desc(Attendance.created_at)).limit(20).all()
    
    for att in recent_attendance:
        # Add clock-in activity if check_in exists
        if att.check_in:
            check_in_time = att.check_in.strftime("%I:%M %p")
            activities.append({
                "id": f"checkin_{att.id}",
                "type": "clock_in",
                "message": f"{att.employee.user.name} clocked in at {check_in_time}",
                "time": format_time_diff(att.created_at),
                "timestamp": att.created_at.isoformat(),
                "employee_name": att.employee.user.name,
                "clock_time": check_in_time
            })
        
        # Add clock-out activity if check_out exists
        if att.check_out:
            check_out_time = att.check_out.strftime("%I:%M %p")
            activities.append({
                "id": f"checkout_{att.id}",
                "type": "clock_out",
                "message": f"{att.employee.user.name} clocked out at {check_out_time}",
                "time": format_time_diff(att.created_at),
                "timestamp": att.created_at.isoformat(),
                "employee_name": att.employee.user.name,
                "clock_time": check_out_time
            })
    
    # 3. Get recent leave requests (last 7 days)
    recent_leave_requests = db.query(LeaveRequest).join(Employee).join(User).filter(
        LeaveRequest.submitted_at >= seven_days_ago
    ).order_by(desc(LeaveRequest.submitted_at)).limit(10).all()
    
    for lr in recent_leave_requests:
        # Format date range
        date_range = f"{lr.start_date.strftime('%b %d')} - {lr.end_date.strftime('%b %d')}"
        
        activities.append({
            "id": f"leave_{lr.id}",
            "type": "leave_request",
            "message": f"{lr.employee.user.name} requested {lr.type.value} leave ({date_range})",
            "time": format_time_diff(lr.submitted_at),
            "timestamp": lr.submitted_at.isoformat(),
            "employee_name": lr.employee.user.name,
            "leave_type": lr.type.value,
            "date_range": date_range
        })
    
    # Sort by timestamp (most recent first) and limit
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    activities = activities[:limit]
    
    return {
        "success": True,
        "data": {
            "activities": activities,
            "total": len(activities)
        }
    }


# ============================================================================
# Leave Requests Management
# ============================================================================

@router.get("/leave-requests", response_model=SuccessResponse)
async def get_leave_requests(
    status: Optional[str] = Query(None, pattern=r'^(pending|approved|rejected)$'),
    employee_id: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all leave requests (HR only)
    
    Query Parameters:
    - status: Filter by status (pending, approved, rejected)
    - employee_id: Filter by employee
    - page: Page number
    - page_size: Items per page
    """
    from ..models.leave_request import LeaveRequest
    
    # Verify HR role
    if current_user.role != UserRole.HR_ADMINISTRATOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR can access leave requests"
        )
    
    # Base query
    query = db.query(LeaveRequest).join(Employee).join(User)
    
    # Apply filters
    if status:
        from ..models.leave_request import LeaveStatus
        query = query.filter(LeaveRequest.status == LeaveStatus(status))
    
    if employee_id:
        try:
            emp_uuid = uuid.UUID(employee_id)
            query = query.filter(LeaveRequest.employee_id == emp_uuid)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid employee ID format"
            )
    
    # Get total count
    total = query.count()
    
    # Apply pagination and ordering
    offset = (page - 1) * page_size
    leave_requests = query.order_by(desc(LeaveRequest.submitted_at)).offset(offset).limit(page_size).all()
    
    # Format response
    items = []
    for lr in leave_requests:
        reviewer_name = lr.reviewer.name if lr.reviewer else None
        items.append({
            "id": str(lr.id),
            "employee_id": str(lr.employee_id),
            "employee_name": lr.employee.user.name,
            "employee_department": lr.employee.user.department,
            "leave_type": lr.type.value,
            "start_date": lr.start_date.isoformat(),
            "end_date": lr.end_date.isoformat(),
            "days": lr.days,
            "reason": lr.reason,
            "status": lr.status.value,
            "submitted_at": lr.submitted_at.isoformat(),
            "reviewed_at": lr.reviewed_at.isoformat() if lr.reviewed_at else None,
            "reviewed_by": reviewer_name,
            "notes": lr.notes
        })
    
    total_pages = (total + page_size - 1) // page_size
    
    # Get summary counts
    all_requests = db.query(LeaveRequest).all()
    from ..models.leave_request import LeaveStatus
    summary = {
        "total": len(all_requests),
        "pending": sum(1 for lr in all_requests if lr.status == LeaveStatus.PENDING),
        "approved": sum(1 for lr in all_requests if lr.status == LeaveStatus.APPROVED),
        "rejected": sum(1 for lr in all_requests if lr.status == LeaveStatus.REJECTED)
    }
    
    return {
        "success": True,
        "data": {
            "leave_requests": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "summary": summary
        }
    }


@router.put("/leave-requests/{leave_request_id}/status", response_model=SuccessResponse)
async def update_leave_request_status(
    leave_request_id: str,
    status_data: dict,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Approve or reject a leave request (HR only)
    
    Body:
    - status: New status (approved or rejected)
    - notes: Optional HR notes
    """
    from ..models.leave_request import LeaveRequest, LeaveStatus
    
    # Verify HR role
    if current_user.role != UserRole.HR_ADMINISTRATOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR can update leave requests"
        )
    
    # Find leave request
    try:
        lr_uuid = uuid.UUID(leave_request_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid leave request ID format"
        )
    
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == lr_uuid).first()
    
    if not leave_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    # Validate status
    new_status = status_data.get("status")
    if new_status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'approved' or 'rejected'"
        )
    
    # Update leave request
    leave_request.status = LeaveStatus(new_status)
    leave_request.reviewed_by = current_user.id
    leave_request.reviewed_at = datetime.utcnow()
    leave_request.notes = status_data.get("notes")
    
    db.commit()
    db.refresh(leave_request)
    
    # Send notification to employee
    notification = Notification(
        sender_id=current_user.id,
        recipient_id=leave_request.employee.user_id,
        title=f"Leave Request {new_status.title()}",
        message=f"Your leave request from {leave_request.start_date} to {leave_request.end_date} has been {new_status}.",
        type=NotificationType.SUCCESS if new_status == "approved" else NotificationType.WARNING
    )
    db.add(notification)
    db.commit()
    
    return {
        "success": True,
        "data": {
            "id": str(leave_request.id),
            "status": leave_request.status.value,
            "reviewed_at": leave_request.reviewed_at.isoformat(),
            "reviewed_by": current_user.name
        },
        "message": f"Leave request {new_status} successfully"
    }
