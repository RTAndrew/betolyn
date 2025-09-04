from fastapi import APIRouter
from .sign_up_controller import router as sign_up_router

router = APIRouter()
router.include_router(sign_up_router)


# Export the main router
__all__ = ["router"]
