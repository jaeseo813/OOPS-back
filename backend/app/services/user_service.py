from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import User, Post, Comment
from app.schemas.schemas import ProfileUpdate, PasswordUpdate, UserResponse
from app.core.security import verify_password, get_password_hash


def get_me(db: Session, user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        profile_image=user.profile_image,
        liked_post_ids=[like.post_id for like in user.likes],
        bad_posts=[bad.post_id for bad in user.bads]
    )
    
def delete_user(db: Session, user: User) -> dict:
    db.delete(user)
    db.commit()
    return {"message": "회원탈퇴 완료"}


def update_profile(db: Session, user: User, profile_data: ProfileUpdate) -> User:
    if profile_data.username:
        existing = db.query(User).filter(User.username == profile_data.username).first()
        if existing and existing.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 사용 중인 아이디입니다"
            )
        user.username = profile_data.username

    if profile_data.profile_image is not None:
        user.profile_image = profile_data.profile_image

    db.commit()
    db.refresh(user)
    return user


def update_password(db: Session, user: User, password_data: PasswordUpdate) -> dict:
    if not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="현재 비밀번호가 틀렸습니다"
        )
    user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    return {"message": "비밀번호가 변경됐습니다"}


def get_my_posts(db: Session, user: User) -> list:
    return db.query(Post).filter(Post.author_id == user.id).all()


def delete_my_posts(db: Session, user: User, post_ids: list[int]) -> dict:
    posts = db.query(Post).filter(Post.id.in_(post_ids), Post.author_id == user.id).all()
    for post in posts:
        db.delete(post)
    db.commit()
    return {"message": f"{len(posts)}개의 게시글이 삭제됐습니다"}


def get_my_comments(db: Session, user: User) -> list:
    return db.query(Comment).filter(Comment.author_id == user.id).all()


def delete_my_comments(db: Session, user: User, comment_ids: list[int]) -> dict:
    comments = db.query(Comment).filter(Comment.id.in_(comment_ids), Comment.author_id == user.id).all()
    for comment in comments:
        db.delete(comment)
    db.commit()
    return {"message": f"{len(comments)}개의 댓글이 삭제됐습니다"}


def get_my_likes(db: Session, user: User) -> list:
    return [like.post for like in user.likes]