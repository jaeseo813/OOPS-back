from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.schemas import UserCreate, UserResponse, Token, UserLogin
from app.services.auth_service import register, login, check_username
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["계정"])

@router.post("/signup", status_code=201)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    user = register(db, user_data)
    token = create_access_token(data={"sub": user.username})
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "profile_image": user.profile_image,
            "liked_post_ids": [],
            "bad_posts": []
        },
        "access_token": token
    }


@router.post("/login", response_model=Token)
def login_user(form_data: UserLogin, db: Session = Depends(get_db)):
    return login(db, form_data.username, form_data.password)


@router.get("/check-id")
def check_id(username: str, db: Session = Depends(get_db)):
    return check_username(db, username)