"""
Employee API Test Script
Tests all Employee portal endpoints
"""

import requests
import json
from datetime import date, timedelta

# Configuration
BASE_URL = "http://localhost:8000/api"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RESET = '\033[0m'


def print_success(message):
    print(f"{GREEN}✓ {message}{RESET}")


def print_error(message):
    print(f"{RED}✗ {message}{RESET}")


def print_info(message):
    print(f"{BLUE}ℹ {message}{RESET}")


def print_warning(message):
    print(f"{YELLOW}⚠ {message}{RESET}")


def test_employee_endpoints():
    """Test all Employee endpoints"""
    
    print("\n" + "="*60)
    print("EMPLOYEE API ENDPOINT TESTS")
    print("="*60 + "\n")
    
    # Step 1: Create a test employee account
    print_info("Step 1: Create Test Employee Account")
    test_email = f"test.emp.{date.today().strftime('%Y%m%d')}@example.com"
    signup_data = {
        "email": test_email,
        "password": "Test123456",
        "name": "Test Employee",
        "phone": "+91-9876543210",
        "department": "Engineering"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        if response.status_code == 201:
            data = response.json()
            access_token = data["data"]["access_token"]
            employee_name = data["data"]["user"]["name"]
            print_success(f"Account created: {employee_name}")
            print_success(f"Email: {test_email}")
        else:
            # Try to login if account already exists
            print_warning("Account may already exist, trying to login...")
            response = requests.post(
                f"{BASE_URL}/auth/login",
                json={"email": test_email, "password": "Test123456"}
            )
            if response.status_code == 200:
                data = response.json()
                access_token = data["data"]["access_token"]
                employee_name = data["data"]["user"]["name"]
                print_success(f"Logged in as: {employee_name}")
            else:
                print_error(f"Failed to create/login: {response.status_code}")
                print(response.text)
                return
    except Exception as e:
        print_error(f"Signup/Login error: {str(e)}")
        return
    
    # Headers with token
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Get Employee Dashboard
    print_info("\nStep 2: Get Employee Dashboard")
    try:
        response = requests.get(f"{BASE_URL}/employee/dashboard", headers=headers)
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"User: {data['user']['name']} - {data['user']['role']}")
            print_success(f"Department: {data['user']['department']}")
            print_success(f"Checked In Today: {data['today_attendance']['checked_in']}")
            print_success(f"Pending Tasks: {data['pending_tasks']}")
            print_success(f"Attendance Rate: {data['attendance_summary']['attendance_rate']}%")
            print_success(f"Recent Announcements: {len(data['recent_announcements'])}")
        else:
            print_error(f"Dashboard failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"Dashboard error: {str(e)}")
    
    # Step 3: Check In
    print_info("\nStep 3: Check In")
    try:
        response = requests.post(f"{BASE_URL}/employee/attendance/checkin", headers=headers)
        if response.status_code == 201:
            data = response.json()["data"]
            print_success(f"Checked in at: {data['check_in']}")
            print_success(f"Status: {data['status']}")
        elif response.status_code == 400:
            print_warning("Already checked in today")
        else:
            print_error(f"Check-in failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"Check-in error: {str(e)}")
    
    # Step 4: View My Attendance
    print_info("\nStep 4: View My Attendance History")
    try:
        response = requests.get(f"{BASE_URL}/employee/attendance", headers=headers)
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Total Days: {data['summary']['total_days']}")
            print_success(f"Present: {data['summary']['present']}")
            print_success(f"Attendance Rate: {data['summary']['attendance_rate']}%")
            print_success(f"Total Hours: {data['summary']['total_hours']}")
            if data['records']:
                print(f"  Latest: {data['records'][0]['date']} - {data['records'][0]['status']}")
        else:
            print_error(f"View attendance failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"View attendance error: {str(e)}")
    
    # Step 5: Create Task
    print_info("\nStep 5: Create Personal Task")
    task_data = {
        "title": "Complete API Testing",
        "description": "Test all employee portal endpoints",
        "priority": "high",
        "due_date": (date.today() + timedelta(days=7)).isoformat()
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/employee/tasks",
            json=task_data,
            headers=headers
        )
        if response.status_code == 201:
            data = response.json()["data"]
            task_id = data["id"]
            print_success(f"Task created: {data['title']}")
            print_success(f"Priority: {data['priority']}")
            print_success(f"Due Date: {data['due_date']}")
            print_success(f"Task ID: {task_id}")
        else:
            print_error(f"Create task failed: {response.status_code}")
            print(response.text)
            task_id = None
    except Exception as e:
        print_error(f"Create task error: {str(e)}")
        task_id = None
    
    # Step 6: View My Tasks
    print_info("\nStep 6: View My Tasks")
    try:
        response = requests.get(f"{BASE_URL}/employee/tasks", headers=headers)
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Total Tasks: {data['summary']['total']}")
            print_success(f"Pending: {data['summary']['pending']}")
            print_success(f"In Progress: {data['summary']['in_progress']}")
            print_success(f"Completed: {data['summary']['completed']}")
            print_success(f"Overdue: {data['summary']['overdue']}")
            if data['tasks']:
                print(f"\n  Tasks:")
                for task in data['tasks'][:3]:
                    print(f"    - {task['title']} ({task['priority']}) - {task['status']}")
        else:
            print_error(f"View tasks failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"View tasks error: {str(e)}")
    
    # Step 7: Update Task (if created)
    if task_id:
        print_info("\nStep 7: Update Task Status")
        update_data = {
            "status": "in-progress"
        }
        
        try:
            response = requests.put(
                f"{BASE_URL}/employee/tasks/{task_id}",
                json=update_data,
                headers=headers
            )
            if response.status_code == 200:
                data = response.json()["data"]
                print_success(f"Task updated: {data['title']}")
                print_success(f"New Status: {data['status']}")
            else:
                print_error(f"Update task failed: {response.status_code}")
                print(response.text)
        except Exception as e:
            print_error(f"Update task error: {str(e)}")
    
    # Step 8: View My Documents
    print_info("\nStep 8: View My Documents")
    try:
        response = requests.get(f"{BASE_URL}/employee/documents", headers=headers)
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Total Documents: {data['total']}")
            if data['documents']:
                print(f"\n  Documents:")
                for doc in data['documents'][:3]:
                    print(f"    - {doc['title']} ({doc['category']}) - {doc['file_size']} bytes")
            else:
                print_warning("No documents found")
        else:
            print_error(f"View documents failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"View documents error: {str(e)}")
    
    # Step 9: Upload Document (simulated)
    print_info("\nStep 9: Upload Document")
    print_warning("Document upload requires multipart/form-data")
    print_warning("Use Swagger UI or Postman for file upload testing")
    print_info("Endpoint: POST /api/employee/documents")
    print_info("Parameters: title, category, file")
    
    # Step 10: View Announcements
    print_info("\nStep 10: View Company Announcements")
    try:
        response = requests.get(
            f"{BASE_URL}/employee/announcements",
            params={"page": 1, "page_size": 5},
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Total Announcements: {data['total']}")
            print_success(f"Unread: {data['unread_count']}")
            if data['items']:
                print(f"\n  Recent Announcements:")
                for ann in data['items'][:3]:
                    print(f"    - {ann['title']} ({ann['priority']})")
                    print(f"      {ann['content'][:80]}...")
            else:
                print_warning("No announcements found")
        else:
            print_error(f"View announcements failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"View announcements error: {str(e)}")
    
    # Step 11: Check Out
    print_info("\nStep 11: Check Out")
    try:
        response = requests.post(f"{BASE_URL}/employee/attendance/checkout", headers=headers)
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Checked out at: {data['check_out']}")
            print_success(f"Hours Worked: {data['hours_worked']}")
            print_success(f"Status: {data['status']}")
        elif response.status_code == 400:
            print_warning("Already checked out or not checked in")
        else:
            print_error(f"Check-out failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"Check-out error: {str(e)}")
    
    print("\n" + "="*60)
    print("EMPLOYEE API TESTS COMPLETED")
    print("="*60 + "\n")
    
    print_info("Test Account Details:")
    print(f"  Email: {test_email}")
    print(f"  Password: Test123456")
    print(f"  You can use these credentials to test in Swagger UI")


if __name__ == "__main__":
    print("\n🧪 Starting Employee API Tests...")
    print("Make sure the backend server is running on http://localhost:8000")
    
    try:
        # Check if server is running
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print_success("Server is running!")
            test_employee_endpoints()
        else:
            print_error("Server is not responding correctly")
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to server. Please start the backend server first:")
        print("  cd backend && python run.py")
