"""
Notification Schemas
Pydantic schemas for notification validation and serialization
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class NotificationCreate(BaseModel):
    """Schema for creating a notification"""
    recipient_id: Optional[str] = Field(None, description="Recipient user ID (None for all employees)")
    title: str = Field(..., min_length=3, max_length=255)
    message: str = Field(..., min_length=10)
    type: str = Field("info", pattern=r'^(info|warning|success|error)$')


class NotificationResponse(BaseModel):
    """Schema for notification response"""
    id: str
    sender_id: str
    recipient_id: Optional[str]
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class NotificationSummary(BaseModel):
    """Schema for notification summary"""
    total: int
    unread: int
    notifications: list[NotificationResponse]
