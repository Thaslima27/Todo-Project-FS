from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from . import crud, models
from .database import SessionLocal

# password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# jwt config
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 2

# oauth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# -------------------------
# PASSWORD
# -------------------------
def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


# -------------------------
# TOKEN
# -------------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# -------------------------
# SIGNUP
# -------------------------
def signup_user(db: Session, email: str, password: str):
    existing = crud.get_user_by_email(db, email)

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = crud.create_user(db, email, hash_password(password))
    return user


# -------------------------
# LOGIN
# -------------------------
def login_user(db: Session, email: str, password: str):
    user = crud.get_user_by_email(db, email)

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})  # 👈 IMPORTANT
    return {"access_token": token, "token_type": "bearer"}


# -------------------------
# GET CURRENT USER
# -------------------------
def get_current_user(token: str = Depends(oauth2_scheme)):
    db = SessionLocal()

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        user = db.query(models.User).filter(models.User.id == int(user_id)).first()

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return user  # 👈 MUST return user object

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )