import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file in the current folder
load_dotenv()

# Import the Gemini logic function
from problem_identifier import get_service_keyword_from_gemini

# Initialize the Flask app
app = Flask(__name__)
# Enable CORS to allow requests from your frontend
CORS(app)

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    This function handles requests to the /api/analyze endpoint.
    """
    file_path = None
    try:
        # Get the description from the form data
        description = request.form.get('description', '')

        # Check if a file was sent
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '':
                # Save the file temporarily
                unique_filename = f"{uuid.uuid4()}_{file.filename}"
                file_path = os.path.join(TEMP_DIR, unique_filename)
                file.save(file_path)

        # Get the analysis from the REAL Gemini API
        result = get_service_keyword_from_gemini(user_prompt=description, file_path=file_path)

        # Return the result as a JSON response
        return jsonify(result)

    except Exception as e:
        print(f"An error occurred: {e}")
        # Return a JSON error response with a 500 status code
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up by deleting the temporary file if it exists
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

# This block allows you to run the server by typing "python main.py"
if __name__ == "__main__":
    # Running in debug mode gives you helpful error messages
    # and automatically reloads the server when you make changes.
    app.run(port=8000, debug=True)