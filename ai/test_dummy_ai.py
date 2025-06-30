# test_dummy_ai.py

def test_ai_dummy_text():
    result = {
        "category": "Plumber",
        "subcategory": "Tap Repair",
        "worker_names": ["John Doe"],
        "message": "Found 1 worker for Plumber - Tap Repair"
    }
    print("=== AI Dummy Text Test Result ===")
    print(f"Service Required: {result['category']} - {result['subcategory']}")
    print("Available Workers:")
    for name in result["worker_names"]:
        print(f" - {name}")
    print(result["message"])
    print()

def test_ai_dummy_image():
    result = {
        "category": "Electrician",
        "subcategory": "Switch Repair",
        "worker_names": ["Alice Smith"],
        "message": "Found 1 worker for Electrician - Switch Repair",
        "file_analysis": "Detected a broken switch in the image."
    }
    print("=== AI Dummy Image Test Result ===")
    print(f"Service Required: {result['category']} - {result['subcategory']}")
    print("Available Workers:")
    for name in result["worker_names"]:
        print(f" - {name}")
    print("File Analysis:", result["file_analysis"])
    print(result["message"])
    print()

def test_ai_dummy_video():
    result = {
        "category": "Mechanic",
        "subcategory": "Car Service",
        "worker_names": ["Bob Johnson"],
        "message": "Found 1 worker for Mechanic - Car Service",
        "file_analysis": "Video shows a car engine making unusual noise. Possible engine issue detected."
    }
    print("=== AI Dummy Video Test Result ===")
    print(f"Service Required: {result['category']} - {result['subcategory']}")
    print("Available Workers:")
    for name in result["worker_names"]:
        print(f" - {name}")
    print("File Analysis:", result["file_analysis"])
    print(result["message"])
    print()

if __name__ == "__main__":
    test_ai_dummy_text()
    test_ai_dummy_image()
    test_ai_dummy_video()
