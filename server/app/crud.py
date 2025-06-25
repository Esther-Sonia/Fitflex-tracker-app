from sqlalchemy.orm import Session
from passlib.context import CryptContext
from . import models, schema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schema.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        age=user.age,
        weight=user.weight,
        gender=user.gender
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_workout(db: Session, user_id: int, workout_data: schema.WorkoutCreate):
    workout = models.Workout(name=workout_data.name, date=workout_data.date, user_id=user_id)
    db.add(workout)
    db.flush()
    for we in workout_data.exercises:
        db_we = models.WorkoutExercise(
            workout_id=workout.id,
            exercise_id=we.exercise_id,
            duration=we.duration
        )
        db.add(db_we)
    db.commit()
    return workout

def get_user_workouts(db: Session, user_id: int):
    workouts = db.query(models.Workout).filter(models.Workout.user_id == user_id).all()
    
    result = []
    for workout in workouts:
        exercises = []
        total_duration = 0

        for we in workout.workout_exercises:
            exercise = db.query(models.Exercise).filter(models.Exercise.id == we.exercise_id).first()
            exercises.append({
                "name": exercise.name,
                "duration": we.duration,
                "exercise_id": we.exercise_id  
            })
            total_duration += we.duration

        result.append({
            "id": workout.id,
            "name": workout.name,
            "date": workout.date,
            "user_id": workout.user_id,
            "exercises": exercises,
            "total_duration": total_duration
        })

    return result

def delete_workout(db: Session, workout_id: int, user_id: int):
    workout = db.query(models.Workout).filter_by(id=workout_id, user_id=user_id).first()
    if not workout:
        return None
    db.delete(workout)
    db.commit()
    return workout        

    return result

def update_workout(db: Session, workout_id: int, user_id: int, workout_data: schema.WorkoutUpdate):
    # Get the existing workout
    workout = db.query(models.Workout).filter_by(id=workout_id, user_id=user_id).first()
    if not workout:
        return None
    
    # Update workout basic info
    workout.name = workout_data.name
    workout.date = workout_data.date
    
    # Delete existing workout exercises
    db.query(models.WorkoutExercise).filter_by(workout_id=workout_id).delete()
    
    # Add new exercises
    for we in workout_data.exercises:
        db_we = models.WorkoutExercise(
            workout_id=workout.id,
            exercise_id=we.exercise_id,
            duration=we.duration
        )
        db.add(db_we)
    
    db.commit()
    db.refresh(workout)
    return workout