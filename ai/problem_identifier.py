import os
import google.generativeai as genai
from typing import Optional, Dict
import requests

# Define your list of supported service keywords that match backend schema
SERVICE_KEYWORDS = [
    "plumber", "electrician", "carpenter", "mechanic", 
    "mens_grooming", "women_grooming"
]

# Mapping from AI-detected keywords to backend categories
KEYWORD_MAPPING = {
    # Plumbing related
    "plumber": "plumber",
    "plumbing": "plumber",
    "pipe": "plumber",
    "water": "plumber",
    "drain": "plumber",
    "toilet": "plumber",
    "tap": "plumber",
    "leak": "plumber",
    
    # Electrical related
    "electrician": "electrician",
    "electrical": "electrician",
    "wire": "electrician",
    "switch": "electrician",
    "socket": "electrician",
    "fan": "electrician",
    "light": "electrician",
    "mcb": "electrician",
    "fuse": "electrician",
    
    # Carpentry related
    "carpenter": "carpenter",
    "carpentry": "carpenter",
    "wood": "carpenter",
    "furniture": "carpenter",
    "cabinet": "carpenter",
    "shelf": "carpenter",
    "window": "carpenter",
    
    # Mechanical related
    "mechanic": "mechanic",
    "car": "mechanic",
    "bike": "mechanic",
    "vehicle": "mechanic",
    "engine": "mechanic",
    "tire": "mechanic",
    "brake": "mechanic",
    "service": "mechanic",
    
    # Grooming related
    "mens_grooming": "mens_grooming",
    "men_grooming": "mens_grooming",
    "haircut": "mens_grooming",
    "shaving": "mens_grooming",
    "beard": "mens_grooming",
    "massage": "mens_grooming",
    
    # Women grooming related
    "women_grooming": "women_grooming",
    "women_grooming": "women_grooming",
    "facial": "women_grooming",
    "hair_color": "women_grooming",
    "body_massage": "women_grooming",
    "salon": "women_grooming"
}

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured. Check your .env file in the 'ai' folder.")
genai.configure(api_key=api_key)

def get_workers_by_specialization(category: str) -> Dict:
    """
    Fetch workers from backend by specialization category
    """
    try:
        # Replace with your actual backend URL
        backend_url = os.getenv("BACKEND_URL", "http://localhost:3000")
        response = requests.get(f"{backend_url}/api/specializations/workers/{category}")
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to fetch workers: {response.status_code}"}
    except Exception as e:
        return {"error": f"Error connecting to backend: {str(e)}"}

def get_service_keyword_from_gemini(user_prompt: str, file_path: Optional[str] = None) -> Dict[str, str]:
    """
    Detect the language of the prompt, translate it if needed, and extract the most relevant service keyword.

    Args:
        user_prompt (str): The user's input.
        file_path (Optional[str]): Optional path to a file that should be included in the prompt.

    Returns:
        dict: A dictionary with the detected keyword and workers data.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = [
            (
                "You are a multilingual service-request interpreter.\n"
                "Step 1: Detect the language of the user's message. If it's not in English, translate it.\n"
                "Step 2: Based on the English request, choose the most relevant keyword from the list below.\n"
                "Only output the final keyword in lowercase. No extra text or explanation.\n\n"
                f"List: {', '.join(SERVICE_KEYWORDS)}\n"
                f"Request: \"{user_prompt}\""
            )
        ]

        if file_path:
            uploaded_file = genai.upload_file(path=file_path)
            prompt.append(uploaded_file)

        response = model.generate_content(prompt)
        raw_output = response.text.strip().lower().replace('.', '').replace('\n', '')

        # Validate or approximate match the output
        detected_category = None
        
        if raw_output in SERVICE_KEYWORDS:
            detected_category = raw_output
        else:
            # Try to find a match in the keyword mapping
            for keyword, category in KEYWORD_MAPPING.items():
                if keyword in raw_output:
                    detected_category = category
                    break

        if not detected_category:
            raise ValueError(f"Unexpected keyword returned by Gemini: '{raw_output}'")

        # Fetch workers from backend
        workers_data = get_workers_by_specialization(detected_category)
        
        return {
            "keyword": detected_category,
            "workers": workers_data
        }

    except Exception as e:
        print(f"[ERROR] Gemini processing failed: {e}")
        raise e
