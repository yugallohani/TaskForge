"""
Announcement Schemas
Pydantic models for announcement-related requests and responses
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AnnouncementResponse(BaseModel):
    """Schema for announcement response"""
    id: str
    title: str
    content: str
    priority: str
    target_audience: str
    created_by: str
    created_at: datetime
    
    class Config:
        from_attributes = True
