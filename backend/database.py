import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Any

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
MESSAGES_FILE = os.path.join(DATA_DIR, "messages.json")

def ensure_data_dir():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)

def save_contact_message(name: str, email: str, subject: str, message: str) -> Dict[str, Any]:
    ensure_data_dir()
    
    msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    timestamp = datetime.now().isoformat()

    new_msg = {
        "id": msg_id,
        "name": name.strip(),
        "email": email.strip(),
        "subject": subject.strip(),
        "message": message.strip(),
        "timestamp": timestamp,
        "read": False
    }

    try:
        with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
            messages = json.load(f)
    except Exception:
        messages = []

    messages.append(new_msg)

    with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
        json.dump(messages, f, indent=2, ensure_ascii=False)

    return new_msg

def get_all_messages() -> List[Dict[str, Any]]:
    ensure_data_dir()
    try:
        with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []
