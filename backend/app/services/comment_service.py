from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Comment, Post, CommentLike
from app.schemas.schemas import CommentCreate, CommentResponse


def make_comment_response(comment: Comment) -> CommentResponse:
    return CommentResponse(
        id=comment.id,
        content=comment.content,
        created_at=comment.created_at,
        author_id=comment.author_id,
        post_id=comment.post_id,
        parent_id=comment.parent_id,
        like_count=len(comment.likes)
    )


def get_comments(db: Session, post_id: int) -> list[CommentResponse]:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글이 없습니다"
        )
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()
    return [make_comment_response(comment) for comment in comments]


def create_comment(db: Session, post_id: int, comment_data: CommentCreate, author_id: int) -> CommentResponse:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글이 없습니다"
        )
    comment = Comment(
        content=comment_data.content,
        post_id=post_id,
        author_id=author_id,
        parent_id=comment_data.parent_id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return make_comment_response(comment)


def update_comment(db: Session, post_id: int, comment_id: int, comment_data: CommentCreate, user_id: int) -> CommentResponse:
    comment = db.query(Comment).filter(
        Comment.id == comment_id,
        Comment.post_id == post_id
    ).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="댓글이 없습니다"
        )
    if comment.author_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )
    comment.content = comment_data.content
    db.commit()
    db.refresh(comment)
    return make_comment_response(comment)


def delete_comment(db: Session, post_id: int, comment_id: int, user_id: int) -> dict:
    comment = db.query(Comment).filter(
        Comment.id == comment_id,
        Comment.post_id == post_id
    ).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="댓글이 없습니다"
        )
    if comment.author_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )
    db.delete(comment)
    db.commit()
    return {"message": "댓글이 삭제됐습니다"}


def like_comment(db: Session, comment_id: int, user_id: int) -> dict:
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="댓글이 없습니다"
        )
    existing_like = db.query(CommentLike).filter(
        CommentLike.comment_id == comment_id,
        CommentLike.user_id == user_id
    ).first()
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 좋아요한 댓글입니다"
        )
    like = CommentLike(comment_id=comment_id, user_id=user_id)
    db.add(like)
    db.commit()
    return {"message": "좋아요 완료"}


def unlike_comment(db: Session, comment_id: int, user_id: int) -> dict:
    like = db.query(CommentLike).filter(
        CommentLike.comment_id == comment_id,
        CommentLike.user_id == user_id
    ).first()
    if not like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="좋아요하지 않은 댓글입니다"
        )
    db.delete(like)
    db.commit()
    return {"message": "좋아요 취소"}