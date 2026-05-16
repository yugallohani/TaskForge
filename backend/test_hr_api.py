"""
HR API Test Script
Tests all HR portal endpoints
"""

import requests
import json
from datetime import date, timedelta

# Configuration
BASE_URL = "http://localhost:8000/api"
HR_EMAIL = "hr@staffsync.com"
HR_PASSWORD = "demo123"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'


def print_success(message):
    print(f"{GREEN}✓ {message}{RESET}")


def print_error(message):
    print(f"{RED}✗ {message}{RESET}")


def print_info(message):
    print(f"{BLUE}ℹ {message}{RESET}")


def test_hr_endpoints():
    """Test all HR endpoints"""
    
    print("\n" + "="*60)
    print("HR API ENDPOINT TESTS")
    print("="*60 + "\n")
    
    # Step 1: Login as HR
    print_info("Step 1: Login as HR Administrator")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": HR_EMAIL, "password": HR_PASSWORD}
        )
        
        if response.status_code == 200:
            data = response.json()
            access_token = data["data"]["access_token"]
            print_success(f"Logged in as: {data['data']['user']['name']}")
            print_success(f"Role: {data['data']['user']['role']}")
        else:
            print_error(f"Login failed: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print_error(f"Login error: {str(e)}")
        return
    
    # Headers with token
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Get Dashboard Stats
    print_info("\nStep 2: Get HR Dashboard Statistics")
    try:
        response = requests.get(f"{BASE_URL}/hr/dashboard/stats", headers=headers)
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Total Employees: {data['total_employees']}")
            print_success(f"Active Employees: {data['active_employees']}")
            print_success(f"Today's Attendance Rate: {data['today_attendance']['attendance_rate']}%")
            print_success(f"Departments: {len(data['departments'])}")
        else:
            print_error(f"Dashboard stats failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"Dashboard stats error: {str(e)}")
    
    # Step 3: List All Employees
    print_info("\nStep 3: List All Employees (Page 1)")
    try:
        response = requests.get(
            f"{BASE_URL}/hr/employees",
            params={"page": 1, "page_size": 5},
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Total Employees: {data['total']}")
            print_success(f"Page: {data['page']}/{data['total_pages']}")
            print_success(f"Showing {len(data['items'])} employees")
            for emp in data['items'][:3]:
                print(f"  - {emp['name']} ({emp['department']}) - {emp['status']}")
        else:
            print_error(f"List employees failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"List employees error: {str(e)}")
    
    # Step 4: Search Employees
    print_info("\nStep 4: Search Employees by Department")
    try:
        response = requests.get(
            f"{BASE_URL}/hr/employees",
            params={"department": "Engineering", "page_size": 3},
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Found {data['total']} Engineering employees")
            for emp in data['items']:
                print(f"  - {emp['name']} - {emp['position']}")
        else:
            print_error(f"Search employees failed: {response.status_code}")
    except Exception as e:
        print_error(f"Search employees error: {str(e)}")
    
    # Step 5: Add New Employee
    print_info("\nStep 5: Add New Employee")
    new_employee = {
        "name": "Test Employee",
        "email": f"test.employee.{date.today().strftime('%Y%m%d')}@example.com",
        "phone": "+91-9876543210",
        "department": "Engineering",
        "position": "Junior Developer",
        "hire_date": date.today().isoformat(),
        "salary": 50000,
        "password": "Test123456"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/hr/employees",
            json=new_employee,
            headers=headers
        )
        if response.status_code == 201:
            data = response.json()["data"]
            new_emp_id = data["id"]
            print_success(f"Employee created: {data['name']}")
            print_success(f"Employee ID: {data['employee_id']}")
            print_success(f"UUID: {new_emp_id}")
        else:
            print_error(f"Add employee failed: {response.status_code}")
            print(response.text)
            new_emp_id = None
    except Exception as e:
        print_error(f"Add employee error: {str(e)}")
        new_emp_id = None
    
    # Step 6: Update Employee (if created)
    if new_emp_id:
        print_info("\nStep 6: Update Employee")
        update_data = {
            "position": "Senior Developer",
            "salary": 75000,
            "performance_score": 85.5
        }
        
        try:
            response = requests.put(
                f"{BASE_URL}/hr/employees/{new_emp_id}",
                json=update_data,
                headers=headers
            )
            if response.status_code == 200:
                data = response.json()["data"]
                print_success(f"Employee updated: {data['name']}")
                print_success(f"New Position: {data['position']}")
                print_success(f"New Salary: ${data['salary']}")
                print_success(f"Performance Score: {data['performance_score']}")
            else:
                print_error(f"Update employee failed: {response.status_code}")
                print(response.text)
        except Exception as e:
            print_error(f"Update employee error: {str(e)}")
    
    # Step 7: View All Attendance
    print_info("\nStep 7: View All Attendance Records")
    try:
        today = date.today()
        week_ago = today - timedelta(days=7)
        
        response = requests.get(
            f"{BASE_URL}/hr/attendance",
            params={
                "start_date": week_ago.isoformat(),
                "end_date": today.isoformat(),
                "page_size": 5
            },
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Total Attendance Records: {data['total']}")
            print_success(f"Summary - Present: {data['summary']['present']}, Absent: {data['summary']['absent']}")
            print_success(f"Showing {len(data['items'])} records")
            for att in data['items'][:3]:
                print(f"  - {att['employee']['name']} on {att['date']}: {att['status']}")
        else:
            print_error(f"View attendance failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"View attendance error: {str(e)}")
    
    # Step 8: Mark Attendance Manually
    if new_emp_id:
        print_info("\nStep 8: Mark Attendance Manually")
        attendance_data = {
            "employee_id": new_emp_id,
            "date": date.today().isoformat(),
            "check_in": "09:00:00",
            "check_out": "18:00:00",
            "status": "present",
            "notes": "Manually marked by HR for testing"
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/hr/attendance/mark",
                json=attendance_data,
                headers=headers
            )
            if response.status_code == 201:
                data = response.json()["data"]
                print_success(f"Attendance marked for: {data['date']}")
                print_success(f"Check-in: {data['check_in']}")
                print_success(f"Check-out: {data['check_out']}")
                print_success(f"Hours Worked: {data['hours_worked']}")
                print_success(f"Status: {data['status']}")
            else:
                print_error(f"Mark attendance failed: {response.status_code}")
                print(response.text)
        except Exception as e:
            print_error(f"Mark attendance error: {str(e)}")
    
    # Step 9: Get HR Analytics
    print_info("\nStep 9: Get HR Analytics")
    try:
        thirty_days_ago = date.today() - timedelta(days=30)
        
        response = requests.get(
            f"{BASE_URL}/hr/analytics",
            params={
                "start_date": thirty_days_ago.isoformat(),
                "end_date": date.today().isoformat()
            },
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()["data"]
            print_success(f"Attendance Trends: {len(data['attendance_trends'])} days")
            print_success(f"Department Comparison: {len(data['department_comparison'])} departments")
            print_success(f"Top Performers: {len(data['top_performers'])} employees")
            print_success(f"Attendance Issues: {len(data['attendance_issues'])} employees")
            print_success(f"Average Hours: {data['average_hours_per_employee']} hours/employee")
            
            if data['top_performers']:
                print("\n  Top 3 Performers:")
                for perf in data['top_performers'][:3]:
                    print(f"    - {perf['name']}: {perf['attendance_rate']}%")
        else:
            print_error(f"Get analytics failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print_error(f"Get analytics error: {str(e)}")
    
    # Step 10: Delete Employee (if created)
    if new_emp_id:
        print_info("\nStep 10: Deactivate Employee")
        try:
            response = requests.delete(
                f"{BASE_URL}/hr/employees/{new_emp_id}",
                headers=headers
            )
            if response.status_code == 200:
                print_success("Employee deactivated successfully")
            else:
                print_error(f"Delete employee failed: {response.status_code}")
                print(response.text)
        except Exception as e:
            print_error(f"Delete employee error: {str(e)}")
    
    print("\n" + "="*60)
    print("HR API TESTS COMPLETED")
    print("="*60 + "\n")


if __name__ == "__main__":
    print("\n🧪 Starting HR API Tests...")
    print("Make sure the backend server is running on http://localhost:8000")
    
    try:
        # Check if server is running
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print_success("Server is running!")
            test_hr_endpoints()
        else:
            print_error("Server is not responding correctly")
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to server. Please start the backend server first:")
        print("  cd backend && python run.py")
