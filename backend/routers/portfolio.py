from fastapi import APIRouter
from fastapi.responses import FileResponse
import os
from typing import Dict, Any, List

router = APIRouter(prefix="/api/portfolio", tags=["Portfolio Information"])

RESUME_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "G_Dinesh_Krishan_Resume.pdf")

@router.get("/stats", response_model=Dict[str, Any])
def get_portfolio_stats():
    """
    Returns candidate metrics (CGPA, Repositories, Traineeship Products, Certifications).
    """
    return {
        "candidate": "G. Dinesh Krishan",
        "degree": "B.E. Artificial Intelligence and Machine Learning",
        "cgpa": 8.01,
        "cgpa_max": 10.0,
        "github_repos_count": 11,
        "traineeship_products_count": 2,
        "certifications_count": 5,
        "available_for_roles": True,
        "graduation_year": 2026,
        "location": "Bengaluru, India"
    }

@router.get("/repos", response_model=List[Dict[str, Any]])
def get_repositories():
    """
    Returns 11 featured public engineering repositories.
    """
    return [
        {
            "name": "Signature Recognition System",
            "repo_url": "https://github.com/Dineshkrishan/Image-processing",
            "category": "cv",
            "tech_stack": ["Kotlin", "Python", "OpenCV", "Flask", "Chaquopy"],
            "description": "Signature forgery detection system (Flask web app + native Android Kotlin via Chaquopy) using a 6-metric similarity engine across 16x16 grid."
        },
        {
            "name": "Multi-Agent Investment System",
            "repo_url": "https://github.com/Dineshkrishan/Orchestrated-Multi-Agent-Investment-System",
            "category": "aiml",
            "tech_stack": ["Python", "Multi-Agent AI", "Pandas", "NumPy"],
            "description": "3-agent orchestration framework in Python that autonomously monitors market trends, strategizes, and generates investment predictions."
        },
        {
            "name": "RAG PDF Chatbot",
            "repo_url": "https://github.com/Dineshkrishan/RAG",
            "category": "aiml",
            "tech_stack": ["Python", "LangChain", "FAISS Vector DB", "Streamlit"],
            "description": "RAG-based PDF chatbot supporting document uploads up to 200MB using LangChain & FAISS vector search with Mistral 7B."
        },
        {
            "name": "Fraud Detection System",
            "repo_url": "https://github.com/Dineshkrishan/Fraud-Detection-System-for-Financial-Transactions",
            "category": "aiml",
            "tech_stack": ["Jupyter Notebook", "Scikit-Learn", "Fraud Analytics", "Pandas"],
            "description": "Machine learning transaction classifier designed to detect fraudulent financial activity using anomaly detection algorithms."
        },
        {
            "name": "revplay Music Platform",
            "repo_url": "https://github.com/Dineshkrishan/revplay",
            "category": "web",
            "tech_stack": ["JavaScript", "React.js", "RESTful API", "Traineeship"],
            "description": "Music streaming platform developed during internship featuring a RESTful API backend and a React-based UI."
        },
        {
            "name": "Asset Flow Management",
            "repo_url": "https://github.com/Dineshkrishan/Asset_flow_management",
            "category": "web",
            "tech_stack": ["JavaScript", "FastAPI", "MongoDB", "Ollama LLM"],
            "description": "Financial intelligence platform built using FastAPI, React/Vite, and MongoDB, integrated with a local Ollama LLM AI advisor."
        },
        {
            "name": "AI Resume Analyzer",
            "repo_url": "https://github.com/Dineshkrishan/AI-Resume-Analyzer-main",
            "category": "aiml",
            "tech_stack": ["Python", "NLP", "Streamlit", "PyPDF2"],
            "description": "NLP pipeline that parses PDF candidate resumes, extracts skill entities, evaluates qualifications against job specs, and provides ATS feedback."
        },
        {
            "name": "Hand Gesture Recognition",
            "repo_url": "https://github.com/Dineshkrishan/Hand-gesture-recognition-using-mediapipe-main",
            "category": "cv",
            "tech_stack": ["Jupyter Notebook", "MediaPipe", "OpenCV", "Real-Time CV"],
            "description": "Computer vision hand gesture recognition system utilizing Google MediaPipe hand landmark tracking and OpenCV."
        },
        {
            "name": "ML Predictive Models",
            "repo_url": "https://github.com/Dineshkrishan/ML-projects",
            "category": "aiml",
            "tech_stack": ["Jupyter Notebook", "Scikit-Learn", "Regression Models", "Pandas"],
            "description": "Machine learning predictive models featuring car scrap price estimation algorithms and land property valuation models."
        },
        {
            "name": "To-Do List Java App",
            "repo_url": "https://github.com/Dineshkrishan/To-do-list-application",
            "category": "web",
            "tech_stack": ["Java", "OOPs", "Data Structures"],
            "description": "Task lifecycle application built in Java demonstrating Object-Oriented Programming (OOP) principles and structured design."
        },
        {
            "name": "AWS Cloud Architecture",
            "repo_url": "https://github.com/Dineshkrishan/AWS",
            "category": "web",
            "tech_stack": ["AWS", "Cloud Infrastructure"],
            "description": "Cloud infrastructure configurations, deployment workflows, and container management resources built for cloud-native web applications."
        }
    ]

@router.get("/resume/download")
def download_resume():
    """
    Downloads candidate PDF resume file directly.
    """
    if os.path.exists(RESUME_PATH):
        return FileResponse(
            path=RESUME_PATH,
            filename="G_Dinesh_Krishan_Resume.pdf",
            media_type="application/pdf"
        )
    return {"error": "Resume file not found"}
