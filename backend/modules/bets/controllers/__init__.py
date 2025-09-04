# This file makes the bets directory a Python package
from fastapi import APIRouter
from .get_bets import router as get_router
from .create_bets import router as create_router
from .update_bets import router as update_router
from .delete_bets import router as delete_router

# Combine all routers into one main router
router = APIRouter()
router.include_router(get_router)
router.include_router(create_router)
router.include_router(update_router)
router.include_router(delete_router)

# Export the main router
__all__ = ["router"]
