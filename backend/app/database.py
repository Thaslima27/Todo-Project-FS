from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv 
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(BASE_DIR, ".env")

load_dotenv(env_path)

DATABASE_URL=os.getenv("DATABASE_URL")
print("DATABASE_URL:", DATABASE_URL)


engine = create_engine(
    DATABASE_URL,
    pool_size=5,          # keep small (Render safe)
    max_overflow=2,       # avoid too many extra connections
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False,bind=engine)

Base = declarative_base()