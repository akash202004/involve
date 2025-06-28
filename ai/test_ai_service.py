#!/usr/bin/env python3
"""
Test script for AI service integration with backend
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_ai_service():
    """Test the AI service with different service requests"""
    
    # Test cases with different service requests
    test_cases = [
        {
            "description": "I need a plumber to fix my leaking tap",
            "expected_category": "plumber"
        },
        {
            "description": "My electrical switch is not working, need an electrician",
            "expected_category": "electrician"
        },
        {
            "description": "I want to get a haircut at home",
            "expected_category": "mens_grooming"
        },
        {
            "description": "Need someone to fix my car engine",
            "expected_category": "mechanic"
        },
        {
            "description": "I need furniture assembly help",
            "expected_category": "carpenter"
        }
    ]
    
    ai_service_url = "http://localhost:8000/api/analyze"
    
    print("🧪 Testing AI Service Integration")
    print("=" * 50)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 Test Case {i}: {test_case['description']}")
        print(f"Expected Category: {test_case['expected_category']}")
        
        try:
            # Send request to AI service
            response = requests.post(
                ai_service_url,
                data={'description': test_case['description']},
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                detected_category = result.get('keyword', 'unknown')
                workers_data = result.get('workers', {})
                
                print(f"✅ Detected Category: {detected_category}")
                
                if detected_category == test_case['expected_category']:
                    print("✅ Category Detection: PASSED")
                else:
                    print(f"❌ Category Detection: FAILED (Expected: {test_case['expected_category']}, Got: {detected_category})")
                
                # Check if workers data is returned
                if 'data' in workers_data and workers_data['data']:
                    print(f"✅ Workers Found: {len(workers_data['data'])} workers")
                elif 'error' in workers_data:
                    print(f"⚠️ Backend Error: {workers_data['error']}")
                else:
                    print("⚠️ No workers found for this category")
                    
            else:
                print(f"❌ AI Service Error: {response.status_code} - {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Connection Error: {e}")
        except Exception as e:
            print(f"❌ Unexpected Error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Testing Complete!")

def test_backend_directly():
    """Test backend specialization endpoint directly"""
    
    print("\n🔗 Testing Backend Specialization Endpoint")
    print("=" * 50)
    
    backend_url = os.getenv("BACKEND_URL", "http://localhost:3000")
    categories = ["plumber", "electrician", "carpenter", "mechanic", "mens_grooming", "women_grooming"]
    
    for category in categories:
        try:
            response = requests.get(f"{backend_url}/api/specializations/workers/{category}")
            
            if response.status_code == 200:
                data = response.json()
                worker_count = len(data.get('data', []))
                print(f"✅ {category}: {worker_count} workers found")
            elif response.status_code == 404:
                print(f"⚠️ {category}: No workers found")
            else:
                print(f"❌ {category}: Error {response.status_code}")
                
        except Exception as e:
            print(f"❌ {category}: Connection error - {e}")

if __name__ == "__main__":
    print("🚀 Starting AI Service Integration Tests")
    
    # Test backend directly first
    test_backend_directly()
    
    # Test AI service integration
    test_ai_service() 