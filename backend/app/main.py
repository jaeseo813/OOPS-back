from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from app.db.database import engine, SessionLocal
from app.models.models import Base
from app.api import auth, users, posts, comments
from app.services.scraping_service import scrape_notices

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Oops Board API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(comments.router)

def scheduled_scrape():
    db = SessionLocal()
    try:
        scrape_notices(db)
    finally:
        db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_scrape, "interval", hours=1)
scheduler.start()

@app.on_event("startup")
def startup_event():
    scheduled_scrape()

@app.get("/")
def root():
    return {"message": "Oops Board API is running"}