from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

class ContactMessageRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, example="Hiring Manager")
    email: str = Field(..., example="manager@techcorp.com")
    subject: str = Field(..., min_length=2, max_length=200, example="Software Engineering Interview Role")
    message: str = Field(..., min_length=5, max_length=2000, example="We reviewed your portfolio and would like to invite you for an interview.")

class ContactMessageResponse(BaseModel):
    status: str
    message: str
    id: str
    timestamp: str

class SignatureTestRequest(BaseModel):
    is_genuine: bool = Field(True, description="Toggle test sample: True for genuine baseline, False for forged")
    custom_signature_b64: Optional[str] = Field(None, description="Optional Base64 encoded image string for live custom analysis")

class RAGQueryRequest(BaseModel):
    query: str = Field(..., example="What is the multi-agent orchestration architecture?")
    top_k: int = Field(3, ge=1, le=10)

class RAGQueryResponse(BaseModel):
    query: str
    answer: str
    similarity_score: float
    citation: str
    retrieved_chunks: List[Dict[str, Any]]

class AgentStepLog(BaseModel):
    agent_id: str
    agent_name: str
    status: str
    action: str
    details: str
    timestamp: str

class InvestIQRunResponse(BaseModel):
    run_id: str
    timestamp: str
    agents_summary: List[Dict[str, Any]]
    execution_logs: List[AgentStepLog]
    final_prediction_score: float
    market_sentiment: str
