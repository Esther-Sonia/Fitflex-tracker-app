from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .config import engine
from app.routes import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        "http://localhost:3000",                      # Local frontend
        "https://fitflex-tracker-app.vercel.app"      # Deployed Vercel frontend
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)