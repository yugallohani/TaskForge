"""
Authentication API Routes
Endpoints for user authentication and authorization
"""

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User, UserRole
from ..models.employee import Employee, EmployeeStatus
from ..models.notification import Notification, NotificationType
from ..schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    TokenRefresh,
    TokenRefreshResponse,
)
from ..schemas.response import SuccessResponse
from ..core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from ..core.dependencies import get_current_active_user
from ..config import settings

router = APIRouter()


@router.post("/signup", response_model=SuccessResponse[TokenResponse], status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Employee Signup
    
    Create a new employee account and return authentication tokens
    
    - **email**: Valid email address (must be unique)
    - **password**: Strong password (min 8 chars, must contain letter and digit)
    - **name**: Full name
    - **phone**: Phone number (optional)
    - **department**: Department name
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        phone=user_data.phone,
        department=user_data.department,
        role=UserRole.EMPLOYEE,  # Default role for signup
        is_active=True,
    )
    
    db.add(new_user)
    db.flush()  # Flush to get user ID
    
    # Create employee record
    # Generate employee ID (format: EMP + 3-digit number)
    employee_count = db.query(Employee).count()
    employee_id = f"EMP{str(employee_count + 1).zfill(3)}"
    
    new_employee = Employee(
        user_id=new_user.id,
        employee_id=employee_id,
        position="Employee",  # Default position
        hire_date=datetime.utcnow().date(),
        status=EmployeeStatus.ACTIVE,
    )
    
    db.add(new_employee)
    db.commit()
    db.refresh(new_user)
    
    # Create notification for all HR administrators
    hr_users = db.query(User).filter(User.role == UserRole.HR_ADMINISTRATOR).all()
    for hr_user in hr_users:
        notification = Notification(
            sender_id=new_user.id,
            recipient_id=hr_user.id,
            title="New Employee Joined",
            message=f"{new_user.name} has created an account and joined the {new_user.department} department.",
            type=NotificationType.SUCCESS
        )
        db.add(notification)
    
    db.commit()
    
    # Create tokens
    token_data = {"sub": str(new_user.id), "email": new_user.email, "role": new_user.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Prepare response
    user_response = UserResponse.from_orm(new_user)
    token_response = TokenResponse(
        user=user_response,
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    
    return SuccessResponse(
        data=token_response,
        message="Account created successfully"
    )


@router.post("/login", response_model=SuccessResponse[TokenResponse])
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    User Login
    
    Authenticate user and return tokens
    
    - **email**: User email
    - **password**: User password
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    # Verify user exists and password is correct
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_CREDENTIALS",
                    "message": "Incorrect email or password",
                }
            }
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "success": False,
                "error": {
                    "code": "INACTIVE_ACCOUNT",
                    "message": "Account is inactive",
                }
            }
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    # Create tokens
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Prepare response
    user_response = UserResponse.from_orm(user)
    token_response = TokenResponse(
        user=user_response,
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    
    return SuccessResponse(
        data=token_response,
        message="Login successful"
    )


@router.post("/refresh", response_model=SuccessResponse[TokenRefreshResponse])
async def refresh_token(token_data: TokenRefresh, db: Session = Depends(get_db)):
    """
    Refresh Access Token
    
    Get a new access token using a refresh token
    
    - **refresh_token**: Valid refresh token
    """
    # Verify refresh token
    payload = verify_token(token_data.refresh_token, token_type="refresh")
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_TOKEN",
                    "message": "Invalid or expired refresh token",
                }
            }
        )
    
    # Get user ID from token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_TOKEN",
                    "message": "Invalid token payload",
                }
            }
        )
    
    # Verify user still exists and is active
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "USER_NOT_FOUND",
                    "message": "User not found or inactive",
                }
            }
        )
    
    # Create new access token
    new_token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
    new_access_token = create_access_token(new_token_data)
    
    # Prepare response
    refresh_response = TokenRefreshResponse(
        access_token=new_access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    
    return SuccessResponse(
        data=refresh_response,
        message="Token refreshed successfully"
    )


@router.post("/logout", response_model=SuccessResponse[dict])
async def logout(current_user: User = Depends(get_current_active_user)):
    """
    User Logout
    
    Logout current user (token invalidation would be implemented here)
    
    Note: In a production system, you would typically:
    - Add token to a blacklist
    - Or use a token revocation list
    - Or implement short-lived tokens with refresh rotation
    """
    # In a real implementation, you would invalidate the token here
    # For now, we just return success (client should delete the token)
    
    return SuccessResponse(
        data={},
        message="Logged out successfully"
    )


@router.get("/me", response_model=SuccessResponse[UserResponse])
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """
    Get Current User Profile
    
    Get the profile of the currently authenticated user
    
    Requires: Valid access token
    """
    user_response = UserResponse.from_orm(current_user)
    
    return SuccessResponse(
        data=user_response
    )
