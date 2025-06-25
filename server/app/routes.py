from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from . import schema, crud, config, models
from .schema import ResetPasswordRequest, ResetPasswordData
from .config import get_db
from .models import User, Exercise
from sqlalchemy import func

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Home route
@router.get("/")
def home():
    return {"message": " Welcome to the FitFlex API "}

# Get current login user
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

# Register a new user
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

# Simulated reset link sender
@router.post("/reset-password-request")
def reset_password_request(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found.")
    print(f"[DEV] Simulate sending reset link to: {payload.email}")
    return {"message": "Reset link sent (simulated)."}

# Password reset handler
@router.post("/reset-password")
def reset_password(data: ResetPasswordData, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    user.password_hash = pwd_context.hash(data.new_password)
    db.commit()
    return {"message": "Password reset successfully."}

# Create a new workout
@router.post("/workouts")
def create_workout(workout: schema.WorkoutCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.create_workout(db, user_id=current_user.id, workout_data=workout)

# Get all workouts
@router.get("/workouts")
def get_workouts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.get_user_workouts(db, user_id=current_user.id)

# Get a specific workout
@router.get("/workouts/{workout_id}")
def get_workout(workout_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workout = crud.get_workout_by_id(db, workout_id)
    if not workout or workout.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

# Update a workout
@router.put("/workouts/{workout_id}")
def update_workout(workout_id: int, workout_data: schema.WorkoutUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_workout = crud.update_workout(db, workout_id, current_user.id, workout_data)
    if not updated_workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"message": "Workout updated successfully", "workout_id": workout_id}

# Delete a workout
@router.delete("/workouts/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.delete_workout(db, workout_id, current_user.id)

# Get all exercises
@router.get("/exercises")
def get_exercises(db: Session = Depends(get_db)):
    return db.query(models.Exercise).all()

# Seed sample exercises
@router.post("/seed-exercises")
def seed_exercises(db: Session = Depends(get_db)):
    exercises = [
        {"name": "Squats", "category": "Strength", "description": "Lower body strength"},
        {"name": "Push Ups", "category": "Strength", "description": "Upper body strength"},
        {"name": "Jumping Jacks", "category": "Cardio", "description": "Full-body cardio warm-up"},
        {"name": "Plank", "category": "Core", "description": "Core stability"},
        {"name": "Dumbbell Rows", "category": "Strength", "description": "Back and biceps"},
        {"name": "Lunges", "category": "Strength", "description": "Lower body strength"},
        {"name": "Leg Press", "category": "Strength", "description": "Quadriceps and hamstrings"},
        {"name": "Deadlifts", "category": "Strength", "description": "Lower back and leg strength"},
        {"name": "Calf Raises", "category": "Strength", "description": "Calf muscles"},
        {"name": "Bench Press", "category": "Strength", "description": "Upper body strength"},
        {"name": "Shoulder Press", "category": "Strength", "description": "Shoulders and triceps"},
        {"name": "Pull-ups", "category": "Strength", "description": "Upper back and biceps"},
        {"name": "Bicep Curls", "category": "Strength", "description": "Arm strength"},
        {"name": "Tricep Dips", "category": "Strength", "description": "Arm strength"},
        {"name": "Sit-ups", "category": "Core", "description": "Abdominal strength"},
        {"name": "Russian Twists", "category": "Core", "description": "Oblique strength"},
        {"name": "Leg Raises", "category": "Core", "description": "Lower abs"},
        {"name": "Bicycle Crunches", "category": "Core", "description": "Abdominal and oblique"},
        {"name": "Burpees", "category": "Cardio", "description": "Full-body cardio exercise"},
        {"name": "Mountain Climbers", "category": "Cardio", "description": "Full-body cardio exercise"},
        {"name": "Jump Squats", "category": "Cardio", "description": "Legs and cardio"},
        {"name": "High Knees", "category": "Cardio", "description": "Cardio endurance"},
        {"name": "Jump Rope", "category": "Cardio", "description": "Cardio endurance"},
        {"name": "Running (Treadmill)", "category": "Cardio", "description": "Cardio endurance"},
        {"name": "Rowing Machine", "category": "Cardio", "description": "Full-body cardio"},
        {"name": "Cycling", "category": "Cardio", "description": "Cardio endurance"},
    ]
    added = 0
    for ex in exercises:
        if not db.query(models.Exercise).filter(func.lower(models.Exercise.name) == ex["name"].lower()).first():
            db.add(models.Exercise(**ex))
            added += 1
    db.commit()
    return {"message": f"{added} exercises seeded."}

@router.delete("/exercises/delete-all")
def delete_all_exercises(db: Session = Depends(get_db)):
    deleted = db.query(models.Exercise).delete()
    db.commit()
    return {"message": f"{deleted} exercises deleted."}

# Get current user info
@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Dashboard stats
@router.get("/dashboard/stats")
def get_dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_workouts = db.query(models.Workout).filter(models.Workout.user_id == current_user.id).count()
    total_exercises = db.query(models.WorkoutExercise).join(models.Workout).filter(models.Workout.user_id == current_user.id).count()
    total_time_spent = db.query(func.sum(models.WorkoutExercise.duration)).join(models.Workout).filter(models.Workout.user_id == current_user.id).scalar() or 0
    latest_workout = db.query(models.Workout).filter(models.Workout.user_id == current_user.id).order_by(models.Workout.date.desc()).first()

    return {
        "total_workouts": total_workouts,
        "total_exercises": total_exercises,
        "total_time_spent_minutes": total_time_spent,
        "latest_workout": {
            "name": latest_workout.name if latest_workout else None,
            "date": latest_workout.date.strftime("%Y-%m-%d") if latest_workout else None
        }
    }