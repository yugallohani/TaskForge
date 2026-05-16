"""
Employee Portal API Endpoints
Endpoints for employees to manage their own data and tasks
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc
from typing import List, Optional
from datetime import date, datetime, time as dt_time, timedelta
from decimal import Decimal
import uuid
import os

from ..database import get_db
from ..models.user import User, UserRole
from ..models.employee import Employee
from ..models.attendance import Attendance, AttendanceStatus
from ..models.task import Task, TaskStatus, TaskPriority
from ..models.document import Document, DocumentCategory
from ..models.announcement import Announcement, TargetAudience
from ..models.notification import Notification, NotificationType
from ..schemas.response import SuccessResponse, PaginatedResponse
from ..schemas.attendance import AttendanceResponse, AttendanceSummary
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskSummary
from ..schemas.document import DocumentCreate, DocumentResponse
from ..schemas.announcement import AnnouncementResponse
from ..schemas.notification import NotificationResponse, NotificationSummary
from ..core.dependencies import get_current_active_user


router = APIRouter()


# ============================================================================
# Employee Dashboard
# ============================================================================

@router.get("/dashboard", response_model=SuccessResponse)
async def get_employee_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get employee dashboard data
    
    Returns:
    - User profile
    - Today's attendance status
    - Performance metrics
    - Today's schedule (tasks due today)
    - Recent announcements
    - Pending tasks count
    - Attendance summary (current month)
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Today's attendance
    today = date.today()
    today_attendance = db.query(Attendance).filter(
        and_(
            Attendance.employee_id == employee.id,
            Attendance.date == today
        )
    ).first()
    
    attendance_status = {
        "checked_in": bool(today_attendance and today_attendance.check_in),
        "check_in_time": str(today_attendance.check_in) if today_attendance and today_attendance.check_in else None,
        "checked_out": bool(today_attendance and today_attendance.check_out),
        "check_out_time": str(today_attendance.check_out) if today_attendance and today_attendance.check_out else None
    }
    
    # Performance metrics
    # Calculate tasks completed this month
    month_start = today.replace(day=1)
    completed_tasks = db.query(Task).filter(
        and_(
            Task.employee_id == employee.id,
            Task.status == TaskStatus.COMPLETED,
            Task.updated_at >= month_start
        )
    ).count()
    
    # Calculate attendance rate for current month
    month_attendance = db.query(Attendance).filter(
        and_(
            Attendance.employee_id == employee.id,
            Attendance.date >= month_start,
            Attendance.date <= today
        )
    ).all()
    
    present_days = sum(1 for a in month_attendance if a.status in [AttendanceStatus.PRESENT, AttendanceStatus.LATE])
    total_days = len(month_attendance)
    attendance_rate = round((present_days / total_days * 100) if total_days > 0 else 0, 1)
    
    # Productivity score (simple calculation based on tasks and attendance)
    productivity_score = min(100, int((completed_tasks * 10 + attendance_rate) / 2))
    
    performance_metrics = {
        "tasks_completed": completed_tasks,
        "productivity_score": productivity_score,
        "goals_achieved": completed_tasks // 5  # Simple goal calculation
    }
    
    # Today's schedule (tasks due today)
    today_tasks = db.query(Task).filter(
        and_(
            Task.employee_id == employee.id,
            Task.due_date == today,
            Task.status != TaskStatus.COMPLETED
        )
    ).all()
    
    today_schedule = []
    for task in today_tasks:
        today_schedule.append({
            "id": str(task.id),
            "type": "task",
            "title": task.title,
            "priority": task.priority.value,
            "status": task.status.value
        })
    
    # Recent announcements (last 5)
    recent_announcements = db.query(Announcement).filter(
        or_(
            Announcement.target_audience == TargetAudience.ALL,
            Announcement.target_audience == TargetAudience.EMPLOYEES
        )
    ).order_by(desc(Announcement.created_at)).limit(5).all()
    
    announcements_list = []
    for ann in recent_announcements:
        announcements_list.append({
            "id": str(ann.id),
            "title": ann.title,
            "content": ann.content[:200] + "..." if len(ann.content) > 200 else ann.content,
            "priority": ann.priority.value,
            "created_at": ann.created_at.isoformat()
        })
    
    # Pending tasks count
    pending_tasks = db.query(Task).filter(
        and_(
            Task.employee_id == employee.id,
            Task.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS])
        )
    ).count()
    
    # Attendance summary for current month
    attendance_summary = {
        "month": today.strftime("%B %Y"),
        "present": sum(1 for a in month_attendance if a.status == AttendanceStatus.PRESENT),
        "absent": sum(1 for a in month_attendance if a.status == AttendanceStatus.ABSENT),
        "late": sum(1 for a in month_attendance if a.status == AttendanceStatus.LATE),
        "on_leave": sum(1 for a in month_attendance if a.status == AttendanceStatus.ON_LEAVE),
        "attendance_rate": attendance_rate
    }
    
    return {
        "success": True,
        "data": {
            "user": {
                "name": current_user.name,
                "role": employee.position,
                "department": current_user.department
            },
            "today_attendance": attendance_status,
            "performance_metrics": performance_metrics,
            "today_schedule": today_schedule,
            "recent_announcements": announcements_list,
            "pending_tasks": pending_tasks,
            "attendance_summary": attendance_summary
        }
    }


# ============================================================================
# Attendance Management
# ============================================================================

@router.get("/attendance", response_model=SuccessResponse)
async def view_my_attendance(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get personal attendance history
    
    Query Parameters:
    - start_date: From date (default: current month start)
    - end_date: To date (default: today)
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Default date range
    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date.replace(day=1)
    
    # Get attendance records
    attendance_records = db.query(Attendance).filter(
        and_(
            Attendance.employee_id == employee.id,
            Attendance.date >= start_date,
            Attendance.date <= end_date
        )
    ).order_by(desc(Attendance.date)).all()
    
    # Format records
    records = []
    for att in attendance_records:
        records.append({
            "id": str(att.id),
            "date": att.date.isoformat(),
            "check_in": str(att.check_in) if att.check_in else None,
            "check_out": str(att.check_out) if att.check_out else None,
            "hours_worked": float(att.hours_worked) if att.hours_worked else None,
            "status": att.status.value
        })
    
    # Calculate summary
    total_days = len(attendance_records)
    present = sum(1 for a in attendance_records if a.status == AttendanceStatus.PRESENT)
    absent = sum(1 for a in attendance_records if a.status == AttendanceStatus.ABSENT)
    late = sum(1 for a in attendance_records if a.status == AttendanceStatus.LATE)
    on_leave = sum(1 for a in attendance_records if a.status == AttendanceStatus.ON_LEAVE)
    total_hours = sum(float(a.hours_worked) for a in attendance_records if a.hours_worked)
    attendance_rate = round(((present + late) / total_days * 100) if total_days > 0 else 0, 1)
    
    summary = {
        "total_days": total_days,
        "present": present,
        "absent": absent,
        "late": late,
        "on_leave": on_leave,
        "total_hours": round(total_hours, 2),
        "attendance_rate": attendance_rate
    }
    
    return {
        "success": True,
        "data": {
            "records": records,
            "summary": summary
        }
    }


@router.post("/attendance/checkin", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def check_in(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Mark check-in for today
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    today = date.today()
    now = datetime.now().time()
    
    # Check if already checked in
    existing = db.query(Attendance).filter(
        and_(
            Attendance.employee_id == employee.id,
            Attendance.date == today
        )
    ).first()
    
    if existing and existing.check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already checked in today"
        )
    
    # Determine status (late if after 9:30 AM)
    late_threshold = dt_time(9, 30, 0)
    status_value = AttendanceStatus.LATE if now > late_threshold else AttendanceStatus.PRESENT
    
    if existing:
        # Update existing record
        existing.check_in = now
        existing.status = status_value
        db.commit()
        db.refresh(existing)
        attendance_record = existing
    else:
        # Create new record
        new_attendance = Attendance(
            employee_id=employee.id,
            date=today,
            check_in=now,
            status=status_value
        )
        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)
        attendance_record = new_attendance
    
    return {
        "success": True,
        "data": {
            "id": str(attendance_record.id),
            "date": attendance_record.date.isoformat(),
            "check_in": str(attendance_record.check_in),
            "status": attendance_record.status.value
        },
        "message": "Checked in successfully"
    }


@router.post("/attendance/checkout", response_model=SuccessResponse)
async def check_out(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Mark check-out for today
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    today = date.today()
    now = datetime.now().time()
    
    # Check if checked in
    attendance = db.query(Attendance).filter(
        and_(
            Attendance.employee_id == employee.id,
            Attendance.date == today
        )
    ).first()
    
    if not attendance or not attendance.check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not checked in yet"
        )
    
    if attendance.check_out:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already checked out today"
        )
    
    # Update check-out time
    attendance.check_out = now
    
    # Calculate hours worked
    check_in_dt = datetime.combine(today, attendance.check_in)
    check_out_dt = datetime.combine(today, now)
    hours_worked = Decimal((check_out_dt - check_in_dt).total_seconds() / 3600)
    attendance.hours_worked = hours_worked
    
    db.commit()
    db.refresh(attendance)
    
    return {
        "success": True,
        "data": {
            "id": str(attendance.id),
            "date": attendance.date.isoformat(),
            "check_in": str(attendance.check_in),
            "check_out": str(attendance.check_out),
            "hours_worked": float(attendance.hours_worked),
            "status": attendance.status.value
        },
        "message": "Checked out successfully"
    }


# ============================================================================
# Task Management
# ============================================================================

@router.get("/tasks", response_model=SuccessResponse)
async def view_my_tasks(
    status: Optional[str] = Query(None, pattern=r'^(pending|in-progress|completed|cancelled)$'),
    priority: Optional[str] = Query(None, pattern=r'^(low|medium|high)$'),
    sort_by: Optional[str] = Query("due_date", pattern=r'^(due_date|priority|created_at)$'),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get personal tasks
    
    Query Parameters:
    - status: Filter by status
    - priority: Filter by priority
    - sort_by: Sort field (due_date, priority, created_at)
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Base query
    query = db.query(Task).filter(Task.employee_id == employee.id)
    
    # Apply filters
    if status:
        query = query.filter(Task.status == status)
    
    if priority:
        query = query.filter(Task.priority == priority)
    
    # Apply sorting
    if sort_by == "due_date":
        query = query.order_by(Task.due_date)
    elif sort_by == "priority":
        # High -> Medium -> Low
        query = query.order_by(
            func.case(
                (Task.priority == TaskPriority.HIGH, 1),
                (Task.priority == TaskPriority.MEDIUM, 2),
                (Task.priority == TaskPriority.LOW, 3)
            )
        )
    else:
        query = query.order_by(desc(Task.created_at))
    
    tasks = query.all()
    
    # Format tasks
    tasks_list = []
    for task in tasks:
        assigner_name = task.assigner.name if task.assigner else "Self"
        tasks_list.append({
            "id": str(task.id),
            "title": task.title,
            "description": task.description,
            "status": task.status.value,
            "priority": task.priority.value,
            "due_date": task.due_date.isoformat(),
            "created_at": task.created_at.isoformat(),
            "assigned_by": assigner_name
        })
    
    # Calculate summary
    all_tasks = db.query(Task).filter(Task.employee_id == employee.id).all()
    today = date.today()
    
    summary = {
        "total": len(all_tasks),
        "pending": sum(1 for t in all_tasks if t.status == TaskStatus.PENDING),
        "in_progress": sum(1 for t in all_tasks if t.status == TaskStatus.IN_PROGRESS),
        "completed": sum(1 for t in all_tasks if t.status == TaskStatus.COMPLETED),
        "overdue": sum(1 for t in all_tasks if t.due_date < today and t.status != TaskStatus.COMPLETED)
    }
    
    return {
        "success": True,
        "data": {
            "tasks": tasks_list,
            "summary": summary
        }
    }


@router.post("/tasks", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a personal task
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Create task
    new_task = Task(
        employee_id=employee.id,
        title=task_data.title,
        description=task_data.description,
        priority=TaskPriority(task_data.priority),
        due_date=task_data.due_date,
        status=TaskStatus.PENDING,
        assigned_by=current_user.id  # Self-assigned
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    return {
        "success": True,
        "data": {
            "id": str(new_task.id),
            "title": new_task.title,
            "description": new_task.description,
            "status": new_task.status.value,
            "priority": new_task.priority.value,
            "due_date": new_task.due_date.isoformat(),
            "created_at": new_task.created_at.isoformat()
        },
        "message": "Task created successfully"
    }


@router.put("/tasks/{task_id}", response_model=SuccessResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update task details
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Find task
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )
    
    task = db.query(Task).filter(
        and_(
            Task.id == task_uuid,
            Task.employee_id == employee.id
        )
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update fields
    if task_data.title:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.status:
        task.status = TaskStatus(task_data.status)
    if task_data.priority:
        task.priority = TaskPriority(task_data.priority)
    if task_data.due_date:
        task.due_date = task_data.due_date
    
    db.commit()
    db.refresh(task)
    
    return {
        "success": True,
        "data": {
            "id": str(task.id),
            "title": task.title,
            "status": task.status.value,
            "priority": task.priority.value,
            "due_date": task.due_date.isoformat(),
            "updated_at": task.updated_at.isoformat()
        },
        "message": "Task updated successfully"
    }


# ============================================================================
# Document Management
# ============================================================================

@router.get("/documents", response_model=SuccessResponse)
async def view_my_documents(
    category: Optional[str] = Query(None, pattern=r'^(contract|policy|report|other)$'),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get personal documents
    
    Query Parameters:
    - category: Filter by category
    - search: Search by title
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Base query
    query = db.query(Document).filter(Document.employee_id == employee.id)
    
    # Apply filters
    if category:
        query = query.filter(Document.category == category)
    
    if search:
        query = query.filter(Document.title.ilike(f"%{search}%"))
    
    # Order by upload date descending
    documents = query.order_by(desc(Document.uploaded_at)).all()
    
    # Format documents
    documents_list = []
    for doc in documents:
        uploader_name = doc.uploader.name if doc.uploader else "Unknown"
        documents_list.append({
            "id": str(doc.id),
            "title": doc.title,
            "category": doc.category.value,
            "file_name": doc.file_name,
            "file_size": doc.file_size,
            "file_url": f"/uploads/documents/{doc.file_name}",
            "uploaded_by": uploader_name,
            "uploaded_at": doc.uploaded_at.isoformat()
        })
    
    return {
        "success": True,
        "data": {
            "documents": documents_list,
            "total": len(documents_list)
        }
    }


@router.post("/documents", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    title: str = Query(..., min_length=3, max_length=255),
    category: str = Query(..., pattern=r'^(contract|policy|report|other)$'),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Upload a document
    
    Note: This is a simplified implementation. In production, you would:
    - Store files in cloud storage (S3, etc.)
    - Implement virus scanning
    - Add more file type validation
    """
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Validate file type
    allowed_extensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg']
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024  # 10MB in bytes
    file_content = await file.read()
    file_size = len(file_content)
    
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 10MB limit"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = f"uploads/documents/{unique_filename}"
    
    # In a real implementation, save to disk or cloud storage
    # For now, we'll just store the metadata
    
    # Create document record
    new_document = Document(
        employee_id=employee.id,
        uploaded_by=current_user.id,
        title=title,
        category=DocumentCategory(category),
        file_name=unique_filename,
        file_path=file_path,
        file_size=file_size
    )
    
    db.add(new_document)
    db.commit()
    db.refresh(new_document)
    
    return {
        "success": True,
        "data": {
            "id": str(new_document.id),
            "title": new_document.title,
            "category": new_document.category.value,
            "file_name": new_document.file_name,
            "file_size": new_document.file_size,
            "file_url": f"/uploads/documents/{new_document.file_name}",
            "uploaded_at": new_document.uploaded_at.isoformat()
        },
        "message": "Document uploaded successfully"
    }


# ============================================================================
# Announcements
# ============================================================================

@router.get("/announcements", response_model=PaginatedResponse)
async def view_announcements(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get company announcements
    
    Query Parameters:
    - page: Page number
    - page_size: Items per page
    """
    
    # Base query - get announcements for all employees
    query = db.query(Announcement).filter(
        or_(
            Announcement.target_audience == TargetAudience.ALL,
            Announcement.target_audience == TargetAudience.EMPLOYEES
        )
    ).order_by(desc(Announcement.created_at))
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    announcements = query.offset(offset).limit(page_size).all()
    
    # Format announcements
    items = []
    for ann in announcements:
        creator_name = ann.creator.name if ann.creator else "Unknown"
        items.append({
            "id": str(ann.id),
            "title": ann.title,
            "content": ann.content,
            "priority": ann.priority.value,
            "created_by": creator_name,
            "created_at": ann.created_at.isoformat(),
            "is_read": False  # Future feature: track read status
        })
    
    total_pages = (total + page_size - 1) // page_size
    
    # Count unread (future feature)
    unread_count = 0
    
    return {
        "success": True,
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "unread_count": unread_count
        }
    }


# ============================================================================
# Notifications
# ============================================================================

@router.get("/notifications", response_model=SuccessResponse)
async def get_notifications(
    unread_only: bool = Query(False),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get notifications for the current user
    
    Query Parameters:
    - unread_only: Only return unread notifications
    - limit: Maximum number of notifications to return
    """
    
    # Base query - get notifications for this user or all employees (recipient_id is None)
    query = db.query(Notification).filter(
        or_(
            Notification.recipient_id == current_user.id,
            Notification.recipient_id == None
        )
    ).order_by(desc(Notification.created_at))
    
    # Filter by read status if requested
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    # Apply limit
    notifications = query.limit(limit).all()
    
    # Get unread count
    unread_count = db.query(Notification).filter(
        or_(
            Notification.recipient_id == current_user.id,
            Notification.recipient_id == None
        ),
        Notification.is_read == False
    ).count()
    
    # Format notifications
    items = []
    for notif in notifications:
        sender_name = notif.sender.name if notif.sender else "System"
        items.append({
            "id": str(notif.id),
            "sender_id": str(notif.sender_id),
            "sender_name": sender_name,
            "title": notif.title,
            "message": notif.message,
            "type": notif.type.value,
            "is_read": notif.is_read,
            "created_at": notif.created_at.isoformat(),
            "read_at": notif.read_at.isoformat() if notif.read_at else None
        })
    
    return {
        "success": True,
        "data": {
            "notifications": items,
            "total": len(items),
            "unread_count": unread_count
        }
    }


@router.put("/notifications/{notification_id}/read", response_model=SuccessResponse)
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Mark a notification as read
    """
    
    # Get notification
    notification = db.query(Notification).filter(
        Notification.id == uuid.UUID(notification_id)
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check if user has access to this notification
    if notification.recipient_id and notification.recipient_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this notification"
        )
    
    # Mark as read
    notification.is_read = True
    notification.read_at = datetime.utcnow()
    
    db.commit()
    
    return {
        "success": True,
        "message": "Notification marked as read"
    }


@router.put("/notifications/read-all", response_model=SuccessResponse)
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Mark all notifications as read for the current user
    """
    
    # Update all unread notifications for this user
    db.query(Notification).filter(
        or_(
            Notification.recipient_id == current_user.id,
            Notification.recipient_id == None
        ),
        Notification.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    }, synchronize_session=False)
    
    db.commit()
    
    return {
        "success": True,
        "message": "All notifications marked as read"
    }


# ============================================================================
# Leave Requests
# ============================================================================

@router.post("/leave-requests", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def submit_leave_request(
    leave_data: dict,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Submit a leave request
    
    Body:
    - leave_type: Type of leave (sick, vacation, personal, emergency)
    - start_date: Leave start date
    - end_date: Leave end date
    - reason: Reason for leave
    """
    from ..models.leave_request import LeaveRequest, LeaveStatus, LeaveType
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Validate dates
    start_date = datetime.strptime(leave_data["start_date"], "%Y-%m-%d").date()
    end_date = datetime.strptime(leave_data["end_date"], "%Y-%m-%d").date()
    
    if end_date < start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Calculate days
    days = (end_date - start_date).days + 1
    
    # Create leave request
    leave_request = LeaveRequest(
        employee_id=employee.id,
        type=LeaveType(leave_data["leave_type"]),
        start_date=start_date,
        end_date=end_date,
        days=days,
        reason=leave_data["reason"],
        status=LeaveStatus.PENDING
    )
    
    db.add(leave_request)
    db.commit()
    db.refresh(leave_request)
    
    return {
        "success": True,
        "data": {
            "id": str(leave_request.id),
            "status": leave_request.status.value,
            "start_date": leave_request.start_date.isoformat(),
            "end_date": leave_request.end_date.isoformat()
        },
        "message": "Leave request submitted successfully"
    }


@router.get("/leave-requests", response_model=SuccessResponse)
async def get_my_leave_requests(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get employee's own leave requests
    """
    from ..models.leave_request import LeaveRequest
    
    # Get employee record
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee record not found"
        )
    
    # Get leave requests
    leave_requests = db.query(LeaveRequest).filter(
        LeaveRequest.employee_id == employee.id
    ).order_by(desc(LeaveRequest.created_at)).all()
    
    items = []
    for lr in leave_requests:
        items.append({
            "id": str(lr.id),
            "leave_type": lr.type.value,
            "start_date": lr.start_date.isoformat(),
            "end_date": lr.end_date.isoformat(),
            "days": lr.days,
            "reason": lr.reason,
            "status": lr.status.value,
            "submitted_at": lr.submitted_at.isoformat(),
            "reviewed_at": lr.reviewed_at.isoformat() if lr.reviewed_at else None,
            "notes": lr.notes
        })
    
    return {
        "success": True,
        "data": {
            "leave_requests": items,
            "total": len(items)
        }
    }
