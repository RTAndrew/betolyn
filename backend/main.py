from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.bets.controllers import router as bets_router
from modules.auth.controllers import router as auth_router
from modules.bets.controllers.matches_controllers import router as matches_router
from utils.database import create_db_and_tables

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

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend"}

@app.get("/api/version")
def get_version():
    return {"version": "1.0.0", "service": "backend"}
