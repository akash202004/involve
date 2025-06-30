import os
import uuid
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Gemini translation imports
import google.generativeai as genai

# Load environment variables from .env file in the current folder
load_dotenv()

# Configure Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def translate_to_english(text):
    if not GEMINI_API_KEY:
        return text  # No translation if no key
    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"Translate this to English: {text}"
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[TRANSLATE ERROR] {e}")
        return text

from problem_identifier import get_service_keyword_fallback

app = Flask(__name__)
CORS(app)

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

def get_worker_name(worker_id):
    backend_url = os.getenv("BACKEND_URL", "http://localhost:5000")
    try:
        resp = requests.get(f"{backend_url}/api/v1/workers/{worker_id}")
        if resp.status_code == 200:
            data = resp.json()
            return f"{data.get('firstName', '')} {data.get('lastName', '')}".strip()
        else:
            print(f"Worker fetch failed for {worker_id}: {resp.status_code}")
    except Exception as e:
        print(f"Error fetching worker {worker_id}: {e}")
    return None

@app.route("/api/analyze", methods=["POST"])
def analyze():
    file_path = None
    try:
        description = request.form.get('description', '')
        if description:
            description = translate_to_english(description)

        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '':
                unique_filename = f"{uuid.uuid4()}_{file.filename}"
                file_path = os.path.join(TEMP_DIR, unique_filename)
                file.save(file_path)

        result = get_service_keyword_fallback(user_prompt=description, file_path=file_path)

        # Fetch worker names using workerId
        worker_names = []
        missing_worker_ids = []
        if result.get('workers') and result['workers'].get('data'):
            for w in result['workers']['data']:
                # If w is a string, just use it as the name
                if isinstance(w, str):
                    worker_names.append(w)
                else:
                    worker_id = w.get('workerId')
                    if not worker_id:
                        missing_worker_ids.append("(no workerId in specialization row)")
                        continue
                    name = get_worker_name(worker_id)
                    if name:
                        worker_names.append(name)
                    else:
                        missing_worker_ids.append(worker_id)

        # Compose a helpful message
        if not result.get('workers') or not result['workers'].get('data'):
            message = f"No specializations found for {result.get('categoryName', '')} - {result.get('subcategory', '')}."
        elif not worker_names:
            message = f"No workers found for {result.get('categoryName', '')} - {result.get('subcategory', '')}."
            if missing_worker_ids:
                message += f" (Missing or invalid worker IDs: {', '.join(missing_worker_ids)})"
        else:
            message = f"Found {len(worker_names)} workers for {result.get('categoryName', '')} - {result.get('subcategory', '')}"

        response = {
            'category': result.get('categoryName', ''),
            'subcategory': result.get('subcategory', ''),
            'worker_names': worker_names,
            'message': message
        }
        return jsonify(response)

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

if __name__ == "__main__":
    app.run(port=8000, debug=True)