"""
API Routes
FastAPI route handlers for all endpoints
"""

from .auth import router as auth_router
from .hr import router as hr_router
from .employee import router as employee_router

__all__ = ["auth_router", "hr_router", "employee_router"]
