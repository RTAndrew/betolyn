import os
from sqlmodel import create_engine, SQLModel, Session
from typing import Generator

# Import all models to ensure they are registered with SQLModel
from modules.auth.repositories.user_repository import UserRepository  # noqa: F401
from modules.bets.repositories import (  # noqa: F401
    bet_slips_items_repository as BetSlipItemsRepository,
    bet_slips_repository as BetSlipsRepository,
    criteria_repository as CriteriaRepository,
    criteria_odds_repository as CriteriaOddsRepository,
    match_repository as MatchRepository,
)


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

