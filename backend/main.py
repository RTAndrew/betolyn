from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from modules.bets.controllers import router as bets_router
from modules.auth.controllers import router as auth_router
from modules.bets.controllers.matches_controllers import router as matches_router
from modules.bets.repositories.match_criteria_repository import MatchRepository
from utils.database import create_db_and_tables, get_session

app = FastAPI(
    title="React Native Example Backend",
    description="Backend API for the React Native Example app",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your app's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include the bets router
app.include_router(bets_router)
app.include_router(auth_router)
app.include_router(matches_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to React Native Example Backend API"}

@app.get("/seed")
def seed_matches(
    session: Annotated[Session, Depends(get_session)],
    response_model: list[MatchRepository],
):
    print("Saving matches")

    try:
        matches = [
            {
                "home_team": "Manchester United",
                "home_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061361/betolyn/team-badges/manchester_united.png",
                "away_team": "Newcastle United",
                "away_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061364/betolyn/team-badges/newcastle_united.png",
                "home_team_score": 2,
                "away_team_score": 1,
            },
            {
                "home_team": "Manchester City",
                "home_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061363/betolyn/team-badges/manchester_city.png",
                "away_team": "Wolverhampton WOL",
                "away_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061365/betolyn/team-badges/wolverhampton_wanderers.png",
                "home_team_score": 0,
                "away_team_score": 0,
            },
            {
                "home_team": "GD Interclube",
                "home_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061363/betolyn/team-badges/grupo_desportivo_interclube.png",
                "away_team": "Primeiro de Agosto",
                "away_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061366/betolyn/team-badges/cd_primeiro_de_agosto.png",
                "home_team_score": 1,
                "away_team_score": 1,
            },
            {
                "home_team": "Toulouse FC",
                "home_team_image_url": "https://a.espncdn.com/i/teamlogos/soccer/500/367.png",
                "away_team": "Paris Saint-Germain",
                "away_team_image_url": "https://a.espncdn.com/i/teamlogos/soccer/500/160.png",
                "home_team_score": 0,
                "away_team_score": 0,
            },
            {
                "home_team": "Lille OSC",
                "home_team_image_url": "https://a.espncdn.com/i/teamlogos/soccer/500/366.png",
                "away_team": "Olympique Lyonnais",
                "away_team_image_url": "https://a.espncdn.com/i/teamlogos/soccer/500/150.png",
                "home_team_score": 0,
                "away_team_score": 0,
            },
            {
                "home_team": "Anderson Silva",
                "home_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061357/betolyn/athletes/anderson_silva.png",
                "away_team": "Wanderlei Silva",
                "away_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061357/betolyn/athletes/wanderlei_silva.png",
                "home_team_score": 0,
                "away_team_score": 0,
            },
            {
                "home_team": "Conor McGregor",
                "home_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061357/betolyn/athletes/conor_mcgregor.png",
                "away_team": "Khabib Nurmagomedov",
                "away_team_image_url": "https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061357/betolyn/athletes/khabib_nurmagomedov.png",
                "home_team_score": 0,
                "away_team_score": 0,
            },
        ]

        saved_matches = []
        for match in matches:
            print(f"Saving match: {match}")
            new_match = MatchRepository(**match)
            session.add(new_match)
            session.commit()
            session.refresh(new_match)
            saved_matches.append(new_match.model_dump())

        return saved_matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to seed matches: {str(e)}")


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend"}

@app.get("/api/version")
def get_version():
    return {"version": "1.0.0", "service": "backend"}
