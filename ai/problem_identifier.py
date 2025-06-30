import os
import requests
from typing import Optional, Dict, List

# Define the categories and subcategories
CATEGORIES = [
    { "id": "plumber", "name": "Plumber", "icon": "💧" },
    { "id": "electrician", "name": "Electrician", "icon": "⚡" },
    { "id": "carpenter", "name": "Carpenter", "icon": "🔨" },
    { "id": "mechanic", "name": "Mechanic", "icon": "🔧" },
    { "id": "mens_grooming", "name": "Men's Grooming", "icon": "💈" },
    { "id": "women_grooming", "name": "Women's Grooming", "icon": "💅" },
]

# Subcategory mapping
SUBCATEGORY_MAP = {
    "plumber": ["Tap Repair", "Pipe Repair", "Toilet Repair", "Drain Cleaning", "Water Heater"],
    "electrician": ["Wiring", "Switch Repair", "Fan Installation", "Light Installation", "MCB Repair"],
    "carpenter": ["Furniture Repair", "Door Repair", "Window Repair", "Cabinet Installation", "Shelf Installation"],
    "mechanic": ["Car Service", "Bike Service", "AC Service", "Oil Change", "Tire Service"],
    "mens_grooming": ["Haircut", "Shave", "Facial", "Hair Color", "Head Massage"],
    "women_grooming": ["Facial", "Hair Color", "Body Massage", "Manicure", "Pedicure"],
}

# Restrict to only the first 4 subcategories for each category
ALLOWED_SUBCATEGORIES = {
    "plumber": ["tape_repair", "leak_fixing", "pipe_installation", "drain_cleaning"],
    "electrician": ["electrical_repair", "wiring_installation", "switch_and_socket_repair", "fan_installation"],
    "carpenter": ["wood_work", "furniture_assembly", "road_repair", "window_repair"],
    "mechanic": ["car_service", "bike_service", "emergency_service", "tire_change"],
    "mens_grooming": ["haircut", "saving", "full_body_massage", "facial"],
    "women_grooming": ["facial", "hair_color", "body_massage", "car_service"],
}

ALLOWED_CATEGORIES = set(ALLOWED_SUBCATEGORIES.keys())

# Keyword mapping for category detection
KEYWORD_MAPPING = {
    # Plumber keywords
    "plumber": "plumber",
    "plumbing": "plumber",
    "tap": "plumber",
    "tape": "plumber",
    "leak": "plumber",
    "pipe": "plumber",
    "drain": "plumber",
    "toilet": "plumber",
    "water heater": "plumber",
    "geyser": "plumber",
    "faucet": "plumber",
    "sink": "plumber",
    "shower": "plumber",
    "bathroom": "plumber",
    "kitchen": "plumber",
    "water": "plumber",
    
    # Electrician keywords
    "electrician": "electrician",
    "electrical": "electrician",
    "wire": "electrician",
    "wiring": "electrician",
    "switch": "electrician",
    "socket": "electrician",
    "fan": "electrician",
    "light": "electrician",
    "mcb": "electrician",
    "fuse": "electrician",
    "circuit": "electrician",
    "power": "electrician",
    "voltage": "electrician",
    "outlet": "electrician",
    "bulb": "electrician",
    "lamp": "electrician",
    
    # Carpenter keywords
    "carpenter": "carpenter",
    "carpentry": "carpenter",
    "wood": "carpenter",
    "furniture": "carpenter",
    "cabinet": "carpenter",
    "shelf": "carpenter",
    "shelves": "carpenter",
    "window": "carpenter",
    "door": "carpenter",
    "table": "carpenter",
    "chair": "carpenter",
    "bed": "carpenter",
    "wardrobe": "carpenter",
    "wooden": "carpenter",
    "assembly": "carpenter",
    
    # Mechanic keywords
    "mechanic": "mechanic",
    "car": "mechanic",
    "bike": "mechanic",
    "vehicle": "mechanic",
    "engine": "mechanic",
    "tire": "mechanic",
    "tyre": "mechanic",
    "brake": "mechanic",
    "service": "mechanic",
    "automobile": "mechanic",
    "motorcycle": "mechanic",
    "scooter": "mechanic",
    "oil": "mechanic",
    "battery": "mechanic",
    "clutch": "mechanic",
    "gearbox": "mechanic",
    "emergency": "mechanic",
    
    # Men's grooming keywords
    "mens_grooming": "mens_grooming",
    "men_grooming": "mens_grooming",
    "haircut": "mens_grooming",
    "shaving": "mens_grooming",
    "beard": "mens_grooming",
    "massage": "mens_grooming",
    "barber": "mens_grooming",
    "hair": "mens_grooming",
    "facial": "mens_grooming",
    "trim": "mens_grooming",
    "grooming": "mens_grooming",
    "hair color": "mens_grooming",
    "haircolour": "mens_grooming",
    
    # Women's grooming keywords
    "women_grooming": "women_grooming",
    "women_grooming": "women_grooming",
    "salon": "women_grooming",
    "beauty": "women_grooming",
    "spa": "women_grooming",
    "makeup": "women_grooming",
    "manicure": "women_grooming",
    "pedicure": "women_grooming",
    "waxing": "women_grooming",
    "threading": "women_grooming",
    "body massage": "women_grooming",
    "facial": "women_grooming",
    "hair color": "women_grooming",
    "haircolour": "women_grooming",
}

# Add synonym keywords for better subcategory matching
SUBCATEGORY_SYNONYMS = {
    "tape_repair": ["tap repair", "tape repair", "tap", "faucet"],
    "leak_fixing": ["leak", "leaking", "leak fixing", "drip", "water leak"],
    "pipe_installation": ["pipe", "pipe installation", "install pipe"],
    "drain_cleaning": ["drain", "drain cleaning", "clog", "unclog"],
    "electrical_repair": ["electrical repair", "electric repair", "electrician", "electric"],
    "wiring_installation": ["wiring", "wire", "wiring installation", "install wire"],
    "switch_and_socket_repair": ["switch", "socket", "switch repair", "socket repair"],
    "fan_installation": ["fan", "fan installation", "install fan"],
    "wood_work": ["wood", "wood work", "carpenter"],
    "furniture_assembly": ["furniture", "furniture assembly", "assemble furniture"],
    "road_repair": ["road", "road repair", "pothole"],
    "window_repair": ["window", "window repair"],
    "car_service": ["car", "car service", "car repair"],
    "bike_service": ["bike", "bike service", "bike repair"],
    "emergency_service": ["emergency", "urgent", "emergency service"],
    "tire_change": ["tire", "tyre", "tire change", "tyre change"],
    "haircut": ["haircut", "cut hair", "hair cut"],
    "saving": ["shave", "saving", "beard"],
    "full_body_massage": ["massage", "body massage", "full body massage"],
    "facial": ["facial", "face treatment"],
    "hair_color": ["hair color", "color hair", "dye hair"],
    "body_massage": ["body massage", "massage"],
}

def find_category(user_prompt: str) -> str:
    """Find the category based on user prompt"""
    user_prompt_lower = user_prompt.lower()
    
    for keyword, category in KEYWORD_MAPPING.items():
        if keyword in user_prompt_lower:
            return category
    
    return None

def find_subcategory(category: str, user_prompt: str) -> str:
    """Find the best matching subcategory from allowed subcategories for the category, using synonyms and keyword matching"""
    if category not in ALLOWED_SUBCATEGORIES:
        return None
    allowed_subs = ALLOWED_SUBCATEGORIES[category]
    user_prompt_lower = user_prompt.lower()
    # Try to match using synonyms first
    for sub in allowed_subs:
        for synonym in SUBCATEGORY_SYNONYMS.get(sub, []):
            if synonym in user_prompt_lower:
                return sub
    # Try to match any word in the subcategory name
    for sub in allowed_subs:
        for word in sub.replace('_', ' ').split():
            if word in user_prompt_lower:
                return sub
    # Fallback to first allowed if no match
    return allowed_subs[0]

def get_workers_by_specialization(category: str, subcategory: str = None) -> Dict:
    """Fetch workers from backend by specialization. If no workers found for subcategory, fallback to category only."""
    try:
        backend_url = os.getenv("BACKEND_URL", "http://localhost:5000")
        if subcategory:
            # Convert display name to enum value
            subcategory_enum = get_subcategory_enum(subcategory)
            response = requests.get(f"{backend_url}/api/v1/specializations/workers/{category}/{subcategory_enum}")
            if response.status_code == 200 and response.json().get('data'):
                return response.json()
            # Fallback: try category only if no data found
            response = requests.get(f"{backend_url}/api/v1/specializations/workers/{category}")
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Failed to fetch workers: {response.status_code}", "data": []}
        else:
            response = requests.get(f"{backend_url}/api/v1/specializations/workers/{category}")
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Failed to fetch workers: {response.status_code}", "data": []}
    except Exception as e:
        return {"error": f"Error connecting to backend: {str(e)}", "data": []}

def get_subcategory_enum(display_name: str) -> str:
    """Convert display name to backend enum value"""
    enum_mapping = {
        # Plumber
        "Tap Repair": "tape_repair",
        "Pipe Repair": "pipe_installation",
        "Toilet Repair": "toilet_repair",
        "Drain Cleaning": "drain_cleaning",
        "Water Heater": "water_repair",
        
        # Electrician
        "Wiring": "wiring_installation",
        "Switch Repair": "switch_and_socket_repair",
        "Fan Installation": "fan_installation",
        "Light Installation": "light_installation",
        "MCB Repair": "mcb_or_fuse_repair",
        
        # Carpenter
        "Furniture Repair": "wood_work",
        "Door Repair": "window_repair",
        "Window Repair": "window_repair",
        "Cabinet Installation": "cabinate_installation",
        "Shelf Installation": "custom_shelves",
        
        # Mechanic
        "Car Service": "car_service",
        "Bike Service": "bike_service",
        "AC Service": "emergency_service",
        "Oil Change": "emergency_service",
        "Tire Service": "tire_change",
        
        # Men's Grooming
        "Haircut": "haircut",
        "Shave": "saving",
        "Facial": "facial",
        "Hair Color": "hair_color",
        "Head Massage": "full_body_massage",
        
        # Women's Grooming
        "Body Massage": "body_massage",
    }
    
    return enum_mapping.get(display_name, display_name.lower().replace(" ", "_"))

def get_service_keyword_fallback(user_prompt: str, file_path: Optional[str] = None) -> Dict[str, any]:
    """Main function to analyze user prompt and return results"""
    try:
        # Find category
        detected_category = find_category(user_prompt)
        if detected_category not in ALLOWED_CATEGORIES:
            detected_category = list(ALLOWED_CATEGORIES)[0]  # fallback to first allowed

        # Find subcategory
        detected_subcategory = find_subcategory(detected_category, user_prompt)
        allowed_subs = ALLOWED_SUBCATEGORIES[detected_category]
        if detected_subcategory not in allowed_subs:
            detected_subcategory = allowed_subs[0]  # fallback to first allowed

        # Get category name
        category_name = next((cat['name'] for cat in CATEGORIES if cat['id'] == detected_category), detected_category)

        # Fetch workers from backend
        workers_data = get_workers_by_specialization(detected_category, detected_subcategory)

        return {
            "category": detected_category,
            "categoryName": category_name,
            "subcategory": detected_subcategory,
            "workers": workers_data,
            "userPrompt": user_prompt
        }

    except Exception as e:
        print(f"[ERROR] Processing failed: {e}")
        raise e
