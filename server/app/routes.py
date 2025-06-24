from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from . import schema, crud, config, models
from .config import get_db
from .models import User

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Home route
@router.get("/")
def home():
    return {"message": " Welcome to the FitFlex API "}


#Get current login user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user



#  Register a new user
@router.post("/register")
def register(user: schema.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

# Login and generate JWT
@router.post("/login", response_model=schema.Token)
def login(user: schema.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not crud.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    to_encode = {
        "sub": db_user.username,
        "exp": datetime.utcnow() + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    token = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": db_user.username
    }

# Creation of new workout of current user
@router.post("/workouts")
def create_workout(
    workout: schema.WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_workout(db, user_id=current_user.id, workout_data=workout)

# Get workouts for current user
@router.get("/workouts")
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_user_workouts(db, user_id=current_user.id)

#  Get one workout by ID
@router.get("/workouts/{workout_id}")
def get_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = crud.get_workout_by_id(db, workout_id)
    if not workout or workout.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

#  Update a workout
@router.put("/workouts/{workout_id}")
def update_workout(
    workout_id: int,
    workout_data: schema.WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.update_workout(db, workout_id, workout_data, current_user.id)

#  Delete a workout
@router.delete("/workouts/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.delete_workout(db, workout_id, current_user.id)

#  List all available exercises
@router.get("/exercises")
def get_exercises(db: Session = Depends(get_db)):
    return db.query(models.Exercise).all()

#  Seed sample exercises
@router.post("/seed-exercises")
def seed_exercises(db: Session = Depends(get_db)):
    unique_exercises = [
        {"name": "Squats", "category": "Strength", "description": "Lower body strength"},
        {"name": "Push-ups", "category": "Strength", "description": "Upper body strength"},
        {"name": "Jumping Jacks", "category": "Cardio", "description": "Full-body cardio warm-up"},
        {"name": "Plank", "category": "Core", "description": "Core stability"},
        {"name": "Dumbbell Rows", "category": "Strength", "description": "Back and biceps strength"},
        {"name": "Lunges", "category": "Strength", "description": "Leg strength and balance"},
        {"name": "Leg Press", "category": "Strength", "description": "Lower body machine workout"},
        {"name": "Deadlifts", "category": "Strength", "description": "Full body power exercise"},
        {"name": "Calf Raises", "category": "Strength", "description": "Calf muscle isolation"},
        {"name": "Bench Press", "category": "Strength", "description": "Chest and triceps strength"},
        {"name": "Shoulder Press", "category": "Strength", "description": "Deltoid and triceps focus"},
        {"name": "Pull-ups", "category": "Strength", "description": "Back and arm strength"},
        {"name": "Bicep Curls", "category": "Strength", "description": "Bicep isolation exercise"},
        {"name": "Tricep Dips", "category": "Strength", "description": "Triceps bodyweight exercise"},
        {"name": "Sit-ups", "category": "Core", "description": "Abdominal exercise"},
        {"name": "Russian Twists", "category": "Core", "description": "Oblique exercise"},
        {"name": "Leg Raises", "category": "Core", "description": "Lower ab exercise"},
        {"name": "Bicycle Crunches", "category": "Core", "description": "Dynamic core workout"},
        {"name": "Burpees", "category": "HIIT", "description": "Full body explosive move"},
        {"name": "Mountain Climbers", "category": "HIIT", "description": "Cardio and core activation"},
        {"name": "Jump Squats", "category": "HIIT", "description": "Explosive lower body"},
        {"name": "High Knees", "category": "HIIT", "description": "Cardio burst exercise"},
        {"name": "Jump Rope", "category": "Cardio", "description": "Cardio endurance workout"},
        {"name": "Running (Treadmill)", "category": "Cardio", "description": "Endurance training"},
        {"name": "Rowing Machine", "category": "Cardio", "description": "Full body cardio machine"},
        {"name": "Cycling", "category": "Cardio", "description": "Lower body cardio endurance"},
    ]

    added = 0
    for ex in unique_exercises:
        existing = db.query(models.Exercise).filter_by(name=ex["name"]).first()
        if not existing:
            db.add(models.Exercise(**ex))
            added += 1

    db.commit()
    return {"message": f"{added} unique exercises seeded successfully."}


#  Get current user info
@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user