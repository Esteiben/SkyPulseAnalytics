from fastapi import Header, Depends, HTTPException, status
from app.core.security import decode_access_token, PREDEFINED_USERS

AUTH_HEADER_ERROR = "Not authenticated"


def get_token_from_header(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=AUTH_HEADER_ERROR,
        )
    return authorization[7:]


def get_current_user(token: str = Depends(get_token_from_header)) -> dict:
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    email = payload.get("sub")
    user = PREDEFINED_USERS.get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return {
        "email": email,
        "full_name": user["full_name"],
        "role": user["role"],
    }
