from sqlalchemy.orm import Session
from .import models


# -------------------
# USER
# -------------------

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session,name: str, email: str, password: str):
    user = models.User(name=name, email=email, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# -------------------
# CATEGORY
# -------------------

def create_category(db: Session, name: str):
    category = models.Category(name=name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_categories(db: Session):
    return db.query(models.Category).all()


# -------------------
# TODO
# -------------------

def create_todo(db: Session, todo, user_id: int):
    new_todo = models.Todo(
        title=todo.title,
        due_date=todo.due_date,
        user_id=user_id,
        priority=todo.priority,
        category_id=todo.category_id
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


def get_user_todos(db: Session, user_id: int):
    return db.query(models.Todo).filter(models.Todo.user_id == user_id).all()