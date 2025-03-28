from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    session_id: str = None  # For future session management

class ChatResponse(BaseModel):
    response: str
    history: list[str]
    session_id: str