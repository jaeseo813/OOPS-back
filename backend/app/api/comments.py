from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import User
from app.schemas.schemas import CommentCreate, CommentResponse
from app.services import comment_service

router = APIRouter(prefix="/posts", tags=["댓글"])


@router.get("/{post_id}/comments", response_model=list[CommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    return comment_service.get_comments(db, post_id)


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=201)
def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return comment_service.create_comment(db, post_id, comment_data, current_user.id)


@router.put("/{post_id}/comments/{comment_id}", response_model=CommentResponse)
def update_comment(
    post_id: int,
    comment_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return comment_service.update_comment(db, post_id, comment_id, comment_data, current_user.id)


@router.delete("/{post_id}/comments/{comment_id}")
def delete_comment(
    post_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return comment_service.delete_comment(db, post_id, comment_id, current_user.id)


@router.post("/{post_id}/comments/{comment_id}/like")
def like_comment(
    post_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return comment_service.like_comment(db, comment_id, current_user.id)