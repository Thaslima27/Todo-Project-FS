from pydantic import BaseModel
from datetime import date


# -------------------
# USER
# -------------------
class UserCreate(BaseModel):
    name: str
    email: str
    password: str


# -------------------
# CATEGORY
# -------------------
class CategoryCreate(BaseModel):
    name: str


# -------------------
# TODO
# -------------------
class TodoCreate(BaseModel):
    title: str
    due_date: date   # 👈 VERY IMPORTANT
    category_id: int
    priority:str


# -------------------
# RESPONSE (optional but safe)
# -------------------
class TodoResponse(BaseModel):
    id: int
    title: str
    due_date: date
    user_id: int
    category_id: int

    class Config:
        from_attributes = True