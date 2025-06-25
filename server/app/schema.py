from pydantic import BaseModel, validator, EmailStr
from typing import List, Optional
from datetime import date

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    age: int
    weight: float
    gender: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str  


class ResetPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordData(BaseModel):
    email: EmailStr
    new_password: str


class WorkoutExerciseCreate(BaseModel):
    exercise_id: int
    duration: int 

    @validator('duration')
    def validate_duration(cls, v):
        if v <= 0:
            raise ValueError('Duration must be positive')
        return v


class WorkoutCreate(BaseModel):
    name: str
    date: str  
    exercises: List[WorkoutExerciseCreate]
    
    @validator('date')
    def validate_date(cls, v):
    
        from datetime import datetime
        try:
            return datetime.strptime(v, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
class WorkoutUpdate(BaseModel):
    name: str
    date: str  
    exercises: List[WorkoutExerciseCreate]
    
    @validator('date')
    def validate_date(cls, v):
        from datetime import datetime
        try:
            return datetime.strptime(v, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')