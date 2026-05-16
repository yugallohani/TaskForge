"""
Announcement Model
Company-wide announcements
"""

from sqlalchemy import Column, String, Text, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from ..database import Base


class AnnouncementPriority(str, enum.Enum):
    """Announcement priority enumeration"""
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class TargetAudience(str, enum.Enum):
    """Target audience enumeration"""
    ALL = "all"
    HR = "hr"
    EMPLOYEES = "employees"


class Announcement(Base):
    """Announcement model for company communications"""
    
    __tablename__ = "announcements"
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Foreign Keys
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=False)
    
    # Announcement Data
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    priority = Column(Enum(AnnouncementPriority), default=AnnouncementPriority.NORMAL, nullable=False, index=True)
    target_audience = Column(Enum(TargetAudience), default=TargetAudience.ALL, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    creator = relationship("User", back_populates="created_announcements", foreign_keys=[created_by])
    
    def __repr__(self):
        return f"<Announcement(id={self.id}, title={self.title}, priority={self.priority})>"
