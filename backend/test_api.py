"""
Quick API Test Script
Test the authentication endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_health():
    """Test health check endpoint"""
    print("\n🔍 Testing Health Check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_signup():
    """Test user signup"""
    print("\n📝 Testing User Signup...")
    data = {
        "email": "test@example.com",
        "password": "Test123456",
        "name": "Test User",
        "phone": "+91-9876543210",
        "department": "Engineering"
    }
    response = requests.post(f"{BASE_URL}/auth/signup", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        return response.json()["data"]["access_token"]
    return None

def test_login():
    """Test user login"""
    print("\n🔐 Testing User Login...")
    data = {
        "email": "test@example.com",
        "password": "Test123456"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        return response.json()["data"]["access_token"]
    return None

def test_get_me(token):
    """Test get current user"""
    print("\n👤 Testing Get Current User...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_logout(token):
    """Test logout"""
    print("\n🚪 Testing Logout...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/auth/logout", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

if __name__ == "__main__":
    print("=" * 50)
    print("🧪 StaffSync API Test Suite")
    print("=" * 50)
    
    try:
        # Test health check
        if not test_health():
            print("\n❌ Health check failed!")
            exit(1)
        
        # Test signup
        token = test_signup()
        if not token:
            print("\n⚠️  Signup failed or user already exists, trying login...")
            token = test_login()
        
        if not token:
            print("\n❌ Could not get authentication token!")
            exit(1)
        
        # Test get current user
        if not test_get_me(token):
            print("\n❌ Get current user failed!")
            exit(1)
        
        # Test logout
        if not test_logout(token):
            print("\n❌ Logout failed!")
            exit(1)
        
        print("\n" + "=" * 50)
        print("✅ All tests passed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Could not connect to API!")
        print("Make sure the server is running: python run.py")
        exit(1)
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        exit(1)
