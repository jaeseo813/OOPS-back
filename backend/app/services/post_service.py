from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Post, Like, Bad
from app.schemas.schemas import PostCreate, PostResponse
from typing import Optional


def make_post_response(post: Post) -> PostResponse:
    return PostResponse(
        id=post.id,
        title=post.title,
        content=post.content,
        created_at=post.created_at,
        author_id=post.author_id,
        like_count=len(post.likes),
        bad_count = post.bad_count,
        comment_count=len(post.comments),
        category=post.category,
        view_count=post.view_count
    )


def get_posts(db: Session, category: Optional[str] = None) -> list[PostResponse]:
    query = db.query(Post).order_by(Post.created_at.desc())
    if category:
        query = query.filter(Post.category == category)
    return [make_post_response(post) for post in query.all()]


def get_popular_posts(db: Session) -> list[PostResponse]:
    posts = db.query(Post).all()
    sorted_posts = sorted(posts, key=lambda p: len(p.likes), reverse=True)
    return [make_post_response(post) for post in sorted_posts[:10]]


def get_post(db: Session, post_id: int) -> PostResponse:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글이 없습니다"
        )
    post.view_count += 1
    db.commit()
    db.refresh(post)
    return make_post_response(post) 


def create_post(db: Session, post_data: PostCreate, author_id: int, category: str = "free") -> PostResponse:
    post = Post(
        title=post_data.title,
        content=post_data.content,
        author_id=author_id,
        category=category
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return make_post_response(post)


def update_post(db: Session, post_id: int, post_data: PostCreate, user_id: int) -> PostResponse:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글이 없습니다"
        )
    if post.author_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )
    post.title = post_data.title
    post.content = post_data.content
    db.commit()
    db.refresh(post)
    return make_post_response(post)


def delete_post(db: Session, post_id: int, user_id: int) -> dict:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글이 없습니다"
        )
    if post.author_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )
    db.delete(post)
    db.commit()
    return {"message": "게시글이 삭제됐습니다"}


def like_post(db: Session, post_id: int, user_id: int) -> dict:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글이 없습니다"
        )
    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == user_id
    ).first()
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 좋아요한 게시글입니다"
        )
    like = Like(post_id=post_id, user_id=user_id)
    db.add(like)
    db.commit()
    return {"message": "좋아요 완료"}


def unlike_post(db: Session, post_id: int, user_id: int) -> dict:
    like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == user_id
    ).first()
    if not like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="좋아요하지 않은 게시글입니다"
        )
    db.delete(like)
    db.commit()
    return {"message": "좋아요 취소"}


def bad_post(db: Session, post_id: int, user_id: int) -> dict:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글이 없습니다"
        )
    existing_bad = db.query(Bad).filter(
        Bad.post_id == post_id,
        Bad.user_id == user_id
    ).first()
    if existing_bad:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 비추천한 게시글입니다"
        )
    bad = Bad(post_id=post_id, user_id=user_id)
    db.add(bad)
    post.bad_count += 1
    db.commit()
    return {"message": "비추천 완료"}


def unbad_post(db: Session, post_id: int, user_id: int) -> dict:
    bad = db.query(Bad).filter(
        Bad.post_id == post_id,
        Bad.user_id == user_id
    ).first()
    if not bad:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="비추천하지 않은 게시글입니다"
        )
    db.delete(bad)
    post = db.query(Post).filter(Post.id == post_id).first()
    post.bad_count -= 1
    db.commit()
    return {"message": "비추천 취소"}


def search_posts(db: Session, keyword: str) -> list[PostResponse]:
    posts = db.query(Post).filter(
        Post.title.contains(keyword) | Post.content.contains(keyword)
    ).order_by(Post.created_at.desc()).all()
    return [make_post_response(post) for post in posts]