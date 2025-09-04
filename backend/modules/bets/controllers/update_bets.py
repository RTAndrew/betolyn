from fastapi import APIRouter

# Create a router for PUT/PATCH operations
router = APIRouter(prefix="/api/bets", tags=["bets"])

@router.put("/{bet_id}")
def update_bet(bet_id: int):
    """Update a specific bet"""
    return {"message": f"Bet {bet_id} updated successfully"}

@router.patch("/{bet_id}")
def partial_update_bet(bet_id: int):
    """Partially update a specific bet"""
    return {"message": f"Bet {bet_id} partially updated successfully"}
