from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
def read_root():
    return {"message": "Welcome to React Native Example Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend"}

@app.get("/api/version")
def get_version():
    return {"version": "1.0.0", "service": "backend"}
