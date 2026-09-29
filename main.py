import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.routers import contact, simulators, portfolio

app = FastAPI(
    title="G. Dinesh Krishan — Portfolio API & AI Microservices",
    description="Full-stack FastAPI backend powering G. Dinesh Krishan's portfolio: contact form persistence, Signature Forgery 6-metric evaluation engine, RAG PDF Chatbot search, and InvestIQ Multi-Agent Orchestrator.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS — read allowed origins from env; defaults to ["*"] for dev convenience
cors_origins_raw = os.environ.get("CORS_ORIGINS", "*")
cors_origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(contact.router)
app.include_router(simulators.router)
app.include_router(portfolio.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "service": "G. Dinesh Krishan Portfolio Backend API",
        "version": "2.0.0",
        "docs": "/docs"
    }

# Mount static frontend files (index.html, style.css, script.js, images, resume)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="static")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

