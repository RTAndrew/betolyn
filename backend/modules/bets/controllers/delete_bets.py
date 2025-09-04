from fastapi import APIRouter

# Create a router for DELETE operations
router = APIRouter(prefix="/api/bets", tags=["bets"])

@router.delete("/{bet_id}")
def delete_bet(bet_id: int):
    """Delete a specific bet"""
    return {"message": f"Bet {bet_id} deleted successfully"}
