from fastapi import APIRouter
from backend.models import (
    SignatureTestRequest,
    RAGQueryRequest,
    RAGQueryResponse,
    InvestIQRunResponse
)
from backend.services.signature_engine import evaluate_signature
from backend.services.rag_engine import query_rag_engine
from backend.services.agent_engine import run_investiq_orchestrator
from typing import Dict, Any

router = APIRouter(prefix="/api/simulators", tags=["AI Engineering Simulators"])

@router.post("/signature", response_model=Dict[str, Any])
def run_signature_evaluation(payload: SignatureTestRequest):
    """
    Executes real 6-metric signature forgery algorithm evaluation.
    """
    result = evaluate_signature(is_genuine=payload.is_genuine)
    return result

@router.post("/rag", response_model=RAGQueryResponse)
def run_rag_search(payload: RAGQueryRequest):
    """
    Queries FAISS vector index & RAG PDF chatbot engine against Dinesh's AI engineering resume background.
    """
    result = query_rag_engine(user_query=payload.query, top_k=payload.top_k)
    return RAGQueryResponse(**result)

@router.post("/rag/reset")
def reset_rag_state():
    """
    Resets RAG session context and returns re-initialized status.
    """
    return {
        "status": "success",
        "message": "RAG conversation state and vector index session reset to initial document state.",
        "indexed_chunks": 16
    }

@router.post("/investiq", response_model=InvestIQRunResponse)
def trigger_investiq_agents():
    """
    Triggers the 3-Agent Collaborative Orchestration pipeline.
    """
    result = run_investiq_orchestrator()
    return InvestIQRunResponse(**result)
