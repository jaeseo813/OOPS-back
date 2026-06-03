from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_admin_user
from app.models.models import User
from app.schemas.schemas import PostCreate, PostResponse
from app.services import post_service
from typing import Optional


router = APIRouter(prefix="/posts", tags=["게시글"])


@router.get("/search", response_model=list[PostResponse])
def search_posts(keyword: str, db: Session = Depends(get_db)):
    return post_service.search_posts(db, keyword)


@router.get("/popular", response_model=list[PostResponse])
def get_popular_posts(db: Session = Depends(get_db)):
    return post_service.get_popular_posts(db)


@router.get("", response_model=list[PostResponse])
def get_posts(category: Optional[str] = None, db: Session = Depends(get_db)):
    return post_service.get_posts(db, category)


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    return post_service.get_post(db, post_id)


@router.post("", response_model=PostResponse, status_code=201)
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return post_service.create_post(db, post_data, current_user.id)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return post_service.update_post(db, post_id, post_data, current_user.id)


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return post_service.delete_post(db, post_id, current_user.id)


@router.post("/{post_id}/like")
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return post_service.like_post(db, post_id, current_user.id)


@router.post("/{post_id}/bad")
def bad_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return post_service.bad_post(db, post_id, current_user.id)


@router.post("/notice", response_model=PostResponse, status_code=201)
def create_notice(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    return post_service.create_post(db, post_data, current_user.id, category="notice")