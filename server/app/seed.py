from app.config import SessionLocal, engine
from app import models

def seed_exercises():
    db = SessionLocal()
    try:
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
            if not db.query(models.Exercise).filter(models.Exercise.name.ilike(ex["name"])).first():
                db.add(models.Exercise(**ex))
                added += 1
        db.commit()
        print(f"{added} exercises seeded.")
    finally:
        db.close()

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)  
    seed_exercises()
