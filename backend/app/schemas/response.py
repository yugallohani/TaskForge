"""
Response Schemas
Standard response formats for API endpoints
"""

from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel

DataT = TypeVar('DataT')


class ErrorDetail(BaseModel):
    """Error detail schema"""
    code: str
    message: str
    details: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: ErrorDetail


class SuccessResponse(BaseModel, Generic[DataT]):
    """Standard success response"""
    success: bool = True
    data: DataT
    message: Optional[str] = None


class PaginationMeta(BaseModel):
    """Pagination metadata"""
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedData(BaseModel, Generic[DataT]):
    """Paginated data container"""
    items: List[DataT]
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedResponse(BaseModel, Generic[DataT]):
    """Standard paginated response"""
    success: bool = True
    data: PaginatedData[DataT]
