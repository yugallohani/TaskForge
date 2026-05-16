"""
Leave Request Schemas
Pydantic models for leave request validation and serialization
"""

from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class LeaveRequestCreate(BaseModel):
    """Schema for creating a leave request"""
    leave_type: str = Field(..., description="Type of leave (sick, vacation, personal, emergency)")
    start_date: date = Field(..., description="Leave start date")
    end_date: date = Field(..., description="Leave end date")
    reason: str = Field(..., min_length=10, max_length=500, description="Reason for leave")


class LeaveRequestUpdate(BaseModel):
    """Schema for updating leave request status"""
    status: str = Field(..., pattern=r'^(approved|rejected)$', description="New status")
    notes: Optional[str] = Field(None, max_length=500, description="HR notes")


class LeaveRequestResponse(BaseModel):
    """Schema for leave request response"""
    id: str
    employee_id: str
    employee_name: str
    leave_type: str
    start_date: str
    end_date: str
    reason: str
    status: str
    created_at: str
    reviewed_at: Optional[str] = None
    reviewed_by: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True
