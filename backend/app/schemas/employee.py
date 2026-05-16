"""
Employee Schemas
Pydantic models for employee-related requests and responses
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
import re


class EmployeeBase(BaseModel):
    """Base employee fields"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., pattern=r'^\+?[\d\s\-()]+$')
    department: str = Field(..., min_length=2, max_length=100)
    position: str = Field(..., min_length=2, max_length=100)
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        """Validate phone number format"""
        # Remove spaces, dashes, parentheses
        cleaned = re.sub(r'[\s\-()]', '', v)
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise ValueError('Phone number must be 10-15 digits')
        return v


class EmployeeCreate(EmployeeBase):
    """Schema for creating a new employee"""
    hire_date: date
    salary: Optional[Decimal] = Field(None, ge=0)
    password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('salary')
    @classmethod
    def validate_salary(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        """Round salary to 2 decimal places"""
        if v is not None:
            return round(v, 2)
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength"""
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @field_validator('hire_date')
    @classmethod
    def validate_hire_date(cls, v: date) -> date:
        """Validate hire date is not in the future"""
        if v > date.today():
            raise ValueError('Hire date cannot be in the future')
        return v


class EmployeeUpdate(BaseModel):
    """Schema for updating an employee"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^\+?[\d\s\-()]+$')
    department: Optional[str] = Field(None, min_length=2, max_length=100)
    position: Optional[str] = Field(None, min_length=2, max_length=100)
    salary: Optional[Decimal] = Field(None, ge=0)
    status: Optional[str] = Field(None, pattern=r'^(active|inactive|on_leave)$')
    performance_score: Optional[Decimal] = Field(None, ge=0, le=100)
    
    @field_validator('salary')
    @classmethod
    def validate_salary(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        """Round salary to 2 decimal places"""
        if v is not None:
            return round(v, 2)
        return v
    
    @field_validator('performance_score')
    @classmethod
    def validate_performance_score(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        """Round performance score to 1 decimal place"""
        if v is not None:
            return round(v, 1)
        return v
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """Validate phone number format"""
        if v is None:
            return v
        cleaned = re.sub(r'[\s\-()]', '', v)
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise ValueError('Phone number must be 10-15 digits')
        return v


class EmployeeResponse(BaseModel):
    """Schema for employee response"""
    id: str
    employee_id: str
    name: str
    email: str
    phone: str
    department: str
    position: str
    hire_date: date
    salary: Optional[Decimal]
    status: str
    performance_score: Optional[Decimal]
    created_at: datetime
    
    class Config:
        from_attributes = True


class EmployeeListItem(BaseModel):
    """Schema for employee list item (simplified)"""
    id: str
    employee_id: str
    name: str
    email: str
    phone: str
    department: str
    position: str
    hire_date: date
    status: str
    
    class Config:
        from_attributes = True
