"""
Attendance Schemas
Pydantic models for attendance-related requests and responses
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date, time, datetime
from decimal import Decimal


class AttendanceBase(BaseModel):
    """Base attendance fields"""
    date: date
    status: str = Field(..., pattern=r'^(present|absent|late|on_leave)$')
    
    @field_validator('date')
    @classmethod
    def validate_date(cls, v: date) -> date:
        """Validate date is not in the future"""
        if v > date.today():
            raise ValueError('Cannot mark attendance for future dates')
        return v


class AttendanceMarkManual(AttendanceBase):
    """Schema for manually marking attendance (HR)"""
    employee_id: str
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    notes: Optional[str] = Field(None, max_length=500)
    
    @field_validator('check_out')
    @classmethod
    def validate_checkout(cls, v: Optional[time], info) -> Optional[time]:
        """Validate check-out is after check-in"""
        if v and 'check_in' in info.data and info.data['check_in']:
            if v <= info.data['check_in']:
                raise ValueError('Check-out time must be after check-in time')
        return v


class AttendanceResponse(BaseModel):
    """Schema for attendance response"""
    id: str
    employee_id: str
    employee_name: Optional[str] = None
    employee_department: Optional[str] = None
    date: date
    check_in: Optional[time]
    check_out: Optional[time]
    hours_worked: Optional[Decimal]
    status: str
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class AttendanceSummary(BaseModel):
    """Schema for attendance summary statistics"""
    total_days: int
    present: int
    absent: int
    late: int
    on_leave: int
    attendance_rate: float = Field(..., ge=0, le=100)
