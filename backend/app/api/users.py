from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import User
from app.schemas.schemas import UserResponse, ProfileUpdate, PasswordUpdate, PostResponse, CommentResponse
from app.services import user_service

router = APIRouter(prefix="/users", tags=["사용자"])

@router.get("/me", response_model=UserResponse)
def get_me_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return user_service.get_me(db, current_user)

@router.delete("/me")
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return user_service.delete_user(db, current_user)

from app.core.security import create_access_token

@router.put("/me/profile")
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = user_service.update_profile(db, current_user, profile_data)
    new_token = create_access_token(data={"sub": user.username})
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "profile_image": user.profile_image,
            "liked_post_ids": [like.post_id for like in user.likes],
            "bad_posts": [bad.post_id for bad in user.bads]
        },
        "access_token": new_token
    }


@router.put("/me/password")
def update_password(
    password_data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return user_service.update_password(db, current_user, password_data)


@router.get("/me/posts", response_model=list[PostResponse])
def get_my_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return user_service.get_my_posts(db, current_user)


@router.delete("/me/posts")
def delete_my_posts(
    post_ids: list[int],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return user_service.delete_my_posts(db, current_user, post_ids)


@router.get("/me/comments", response_model=list[CommentResponse])
def get_my_comments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return user_service.get_my_comments(db, current_user)


@router.delete("/me/comments")
def delete_my_comments(
    comment_ids: list[int],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return user_service.delete_my_comments(db, current_user, comment_ids)


@router.get("/me/likes", response_model=list[PostResponse])
def get_my_likes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return user_service.get_my_likes(db, current_user)

@router.get("", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users