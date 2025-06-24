# app/create_tables.py
#creates the database tables based on the models defined in the app
from app.models import Base
from app.config import engine

print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Database created sucessfully.")

