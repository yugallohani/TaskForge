"""
Task Schemas
Pydantic models for task-related requests and responses
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date, datetime


class TaskBase(BaseModel):
    """Base task fields"""
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    priority: str = Field(..., pattern=r'^(low|medium|high)$')
    due_date: date
    
    @field_validator('due_date')
    @classmethod
    def validate_due_date(cls, v: date) -> date:
        """Validate due date is not in the past"""
        if v < date.today():
            raise ValueError('Due date cannot be in the past')
        return v


class TaskCreate(TaskBase):
    """Schema for creating a new task"""
    pass


class TaskUpdate(BaseModel):
    """Schema for updating a task"""
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    status: Optional[str] = Field(None, pattern=r'^(pending|in-progress|completed|cancelled)$')
    priority: Optional[str] = Field(None, pattern=r'^(low|medium|high)$')
    due_date: Optional[date] = None
    
    @field_validator('due_date')
    @classmethod
    def validate_due_date(cls, v: Optional[date]) -> Optional[date]:
        """Validate due date is not in the past"""
        if v and v < date.today():
            raise ValueError('Due date cannot be in the past')
        return v


class TaskResponse(BaseModel):
    """Schema for task response"""
    id: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: date
    assigned_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TaskSummary(BaseModel):
    """Schema for task summary statistics"""
    total: int
    pending: int
    in_progress: int
    completed: int
    overdue: int
