import os
from sqlmodel import create_engine, SQLModel, Session, text
from typing import Generator

# Import all models to ensure they are registered with SQLModel
from modules.bets.bets_repo import BetsRepository
from modules.auth.repositories.user_repository import UserRepositoy


# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://andersonlando@localhost:5432/betolyn")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)


def drop_all_tables():
    """Drop all database tables"""
    SQLModel.metadata.drop_all(engine)


def reset_database():
    """Reset the database by dropping all tables and recreating them"""
    print("Dropping all tables...")
    drop_all_tables()
    print("Creating all tables...")
    create_db_and_tables()
    print("Database reset completed successfully!")


def get_session() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session

