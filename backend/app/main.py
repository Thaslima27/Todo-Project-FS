from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base, SessionLocal
from . import schemas, crud, auth
from .models import Todo   # ✅ IMPORTANT

app = FastAPI()

# create tables
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------
# AUTH
# -------------------

@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return auth.signup_user(db, user.email, user.password)


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return auth.login_user(
        db,
        email=form_data.username,
        password=form_data.password
    )


# -------------------
# CATEGORY
# -------------------

@app.post("/categories")
def create_category(cat: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, cat.name)


# -------------------
# TODO
# -------------------

@app.post("/todos")
def create_todo(
    todo: schemas.TodoCreate,
    user = Depends(auth.get_current_user),   # ✅ FIX
    db: Session = Depends(get_db)
):
    return crud.create_todo(db, todo, user.id)


@app.get("/todos")
def get_todos(
    user = Depends(auth.get_current_user),   # ✅ FIX
    db: Session = Depends(get_db)
):
    return crud.get_user_todos(db, user.id)


# -------------------
# DELETE TODO
# -------------------

@app.delete("/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    user = Depends(auth.get_current_user),   # ✅ FIX
    db: Session = Depends(get_db)
):
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.user_id == user.id
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()

    return {"message": "Todo deleted"}