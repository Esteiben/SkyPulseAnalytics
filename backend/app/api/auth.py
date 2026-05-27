from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.security import (
    PREDEFINED_USERS,
    create_access_token,
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user = PREDEFINED_USERS.get(req.email)
    if not user or user["password"] != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    access_token = create_access_token(
        data={"sub": req.email, "role": user["role"], "name": user["full_name"]}
    )
    return TokenResponse(
        access_token=access_token,
        full_name=user["full_name"],
        email=req.email,
        role=user["role"],
    )


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
