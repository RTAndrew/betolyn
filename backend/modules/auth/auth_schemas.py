from pydantic import BaseModel


class SignUpRequest(BaseModel):
    username: str
    email: str

class SignUpResponse(BaseModel):
    username: str
    email: str