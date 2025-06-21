import os
import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured. Check your .env file in the 'ai' folder.")
    
genai.configure(api_key=api_key)

SERVICE_KEYWORDS = [
    "plumber", "mechanic", "diesel_mechanic", "motorcycle_mechanic",
    "heavy_vehicle_mechanic", "transmission_specialist", "brake_and_suspension_mechanic",
    "auto_body_mechanic", "auto_electrician", "tire_and_wheel_technician",
    "fleet_mechanic", "home_salon_men", "home_salon_female", "home_appliance_worker"
]

def get_service_keyword_from_gemini(user_prompt: str, file_path: str = None) -> dict:
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # NEW POWERFUL PROMPT: It tells Gemini to translate first!
        prompt = [
            f"You are a multi-language service-request analyzer. Your task is two-fold. First, detect the language of the user's request. If it is not English, translate it to English. Second, using the English version of the request, identify the single most relevant service keyword from this list: {', '.join(SERVICE_KEYWORDS)}. Your final output must be ONLY the single keyword in lowercase, with no other text, explanation, or punctuation.",
            f"User's request: '{user_prompt}'"
        ]

        if file_path:
            uploaded_file = genai.upload_file(path=file_path)
            prompt.append(uploaded_file)

        response = model.generate_content(prompt)
        generated_keyword = response.text.strip().lower().replace('.', '')

        if generated_keyword in SERVICE_KEYWORDS:
            return {"keyword": generated_keyword}
        else: 
            for key in SERVICE_KEYWORDS:
                if key in generated_keyword:
                    return {"keyword": key}
            raise ValueError(f"AI returned an unexpected value: '{generated_keyword}'")

    except Exception as e:
        print(f"Error during Gemini call: {e}")
        raise e