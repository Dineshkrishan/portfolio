from fastapi import APIRouter, HTTPException, status
from backend.models import ContactMessageRequest, ContactMessageResponse
from backend.database import save_contact_message, get_all_messages
from typing import List, Dict, Any

router = APIRouter(prefix="/api/contact", tags=["Contact Inquiries"])

@router.post("", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_form(payload: ContactMessageRequest):
    """
    Submits a new recruitment or interview message to Dinesh's portfolio.
    Saves persistent message into data/messages.json database.
    """
    try:
        saved_msg = save_contact_message(
            name=payload.name,
            email=payload.email,
            subject=payload.subject,
            message=payload.message
        )
        return ContactMessageResponse(
            status="success",
            message=f"Thank you {payload.name}! Your inquiry has been sent to G. Dinesh Krishan.",
            id=saved_msg["id"],
            timestamp=saved_msg["timestamp"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit message: {str(e)}"
        )

@router.get("/messages", response_model=List[Dict[str, Any]])
def list_contact_messages():
    """
    Retrieves all received contact form inquiries.
    """
    return get_all_messages()
