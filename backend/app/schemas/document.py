"""
Document Schemas
Pydantic models for document-related requests and responses
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DocumentBase(BaseModel):
    """Base document fields"""
    title: str = Field(..., min_length=3, max_length=255)
    category: str = Field(..., pattern=r'^(contract|policy|report|other)$')


class DocumentCreate(DocumentBase):
    """Schema for creating a document (metadata only, file handled separately)"""
    pass


class DocumentResponse(BaseModel):
    """Schema for document response"""
    id: str
    title: str
    category: str
    file_name: str
    file_size: int
    file_url: str
    uploaded_by: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True
