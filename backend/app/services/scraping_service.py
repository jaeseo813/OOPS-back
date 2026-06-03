import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
from app.models.models import Post
from datetime import datetime

NOTICE_URL = "https://computer.hufs.ac.kr/computer/10058/subview.do"
ADMIN_USER_ID = 1  # oops_admin 유저 id


def scrape_notices(db: Session):
    try:
        response = requests.get(NOTICE_URL, timeout=10)
        response.encoding = "utf-8"
        soup = BeautifulSoup(response.text, "html.parser")

        rows = soup.select("table tbody tr")

        for row in rows:
            cols = row.select("td")
            if len(cols) < 4:
                continue

            number = cols[0].get_text(strip=True)
            title_tag = cols[1].select_one("a")
            if not title_tag:
                continue

            title = title_tag.get_text(strip=True)
            link = "https://computer.hufs.ac.kr" + title_tag.get("href", "")
            date_str = cols[3].get_text(strip=True)

            # 이미 존재하는 공지사항이면 스킵
            existing = db.query(Post).filter(
                Post.title == title,
                Post.category == "notice"
            ).first()
            if existing:
                continue

            try:
                created_at = datetime.strptime(date_str, "%Y.%m.%d")
            except:
                created_at = datetime.utcnow()

            post = Post(
                title=title,
                content=link,  # 링크를 content로 저장
                author_id=ADMIN_USER_ID,
                category="notice",
                created_at=created_at
            )
            db.add(post)

        db.commit()

    except Exception as e:
        print(f"스크래핑 오류: {e}")