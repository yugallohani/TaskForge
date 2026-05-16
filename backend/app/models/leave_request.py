"""
Leave Request Model
Employee leave requests and approvals
"""

from sqlalchemy import Column, String, Text, Date, Integer, ForeignKey, Enum, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from ..database import Base


class LeaveType(str, enum.Enum):
    """Leave type enumeration"""
    SICK = "sick"
    VACATION = "vacation"
    PERSONAL = "personal"
    OTHER = "other"


class LeaveStatus(str, enum.Enum):
    """Leave request status enumeration"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class LeaveRequest(Base):
    """Leave request model for employee time off"""
    
    __tablename__ = "leave_requests"
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Foreign Keys
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Leave Request Data
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False, index=True)
    type = Column(Enum(LeaveType), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(Enum(LeaveStatus), default=LeaveStatus.PENDING, nullable=False, index=True)
    days = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('end_date >= start_date', name='check_date_range'),
        CheckConstraint('days > 0', name='check_positive_days'),
    )
    
    # Relationships
    employee = relationship("Employee", back_populates="leave_requests")
    reviewer = relationship("User", foreign_keys=[reviewed_by])
    
    def __repr__(self):
        return f"<LeaveRequest(id={self.id}, employee_id={self.employee_id}, status={self.status})>"
