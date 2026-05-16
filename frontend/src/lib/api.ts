/**
 * API Client
 * Axios-based HTTP client with authentication and error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // Try to refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Service Functions

// ============================================================================
// Authentication
// ============================================================================

export const authAPI = {
  signup: async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    department: string;
  }) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};

// ============================================================================
// HR Portal
// ============================================================================

export const hrAPI = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/hr/dashboard/stats');
    return response.data;
  },

  getEmployees: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    department?: string;
    status?: string;
    sort_by?: string;
    sort_order?: string;
  }) => {
    const response = await apiClient.get('/hr/employees', { params });
    return response.data;
  },

  addEmployee: async (data: {
    name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    hire_date: string;
    salary?: number;
    password: string;
  }) => {
    const response = await apiClient.post('/hr/employees', data);
    return response.data;
  },

  updateEmployee: async (
    employeeId: string,
    data: {
      name?: string;
      phone?: string;
      department?: string;
      position?: string;
      salary?: number;
      status?: string;
      performance_score?: number;
    }
  ) => {
    const response = await apiClient.put(`/hr/employees/${employeeId}`, data);
    return response.data;
  },

  deleteEmployee: async (employeeId: string) => {
    const response = await apiClient.delete(`/hr/employees/${employeeId}`);
    return response.data;
  },

  getAttendance: async (params?: {
    page?: number;
    page_size?: number;
    employee_id?: string;
    department?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
  }) => {
    const response = await apiClient.get('/hr/attendance', { params });
    return response.data;
  },

  markAttendance: async (data: {
    employee_id: string;
    date: string;
    check_in?: string;
    check_out?: string;
    status: string;
    notes?: string;
  }) => {
    const response = await apiClient.post('/hr/attendance/mark', data);
    return response.data;
  },

  getAnalytics: async (params?: {
    start_date?: string;
    end_date?: string;
    department?: string;
  }) => {
    const response = await apiClient.get('/hr/analytics', { params });
    return response.data;
  },

  // Notifications
  sendNotification: async (data: {
    recipient_id?: string;
    title: string;
    message: string;
    type: string;
  }) => {
    const response = await apiClient.post('/hr/notifications', data);
    return response.data;
  },

  getSentNotifications: async (params?: { limit?: number }) => {
    const response = await apiClient.get('/hr/notifications/sent', { params });
    return response.data;
  },

  // HR Notifications (for receiving)
  getNotifications: async (params?: { limit?: number }) => {
    const response = await apiClient.get('/hr/notifications', { params });
    return response.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const response = await apiClient.put(`/hr/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await apiClient.put('/hr/notifications/read-all');
    return response.data;
  },

  // Recent Activity
  getRecentActivity: async (params?: { limit?: number }) => {
    const response = await apiClient.get('/hr/recent-activity', { params });
    return response.data;
  },

  // Leave Requests
  getLeaveRequests: async (params?: {
    status?: string;
    employee_id?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await apiClient.get('/hr/leave-requests', { params });
    return response.data;
  },

  updateLeaveStatus: async (leaveRequestId: string, data: {
    status: string;
    notes?: string;
  }) => {
    const response = await apiClient.put(`/hr/leave-requests/${leaveRequestId}/status`, data);
    return response.data;
  },
};

// ============================================================================
// Employee Portal
// ============================================================================

export const employeeAPI = {
  getDashboard: async () => {
    const response = await apiClient.get('/employee/dashboard');
    return response.data;
  },

  getAttendance: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await apiClient.get('/employee/attendance', { params });
    return response.data;
  },

  checkIn: async () => {
    const response = await apiClient.post('/employee/attendance/checkin');
    return response.data;
  },

  checkOut: async () => {
    const response = await apiClient.post('/employee/attendance/checkout');
    return response.data;
  },

  getTasks: async (params?: {
    status?: string;
    priority?: string;
    sort_by?: string;
  }) => {
    const response = await apiClient.get('/employee/tasks', { params });
    return response.data;
  },

  createTask: async (data: {
    title: string;
    description?: string;
    priority: string;
    due_date: string;
  }) => {
    const response = await apiClient.post('/employee/tasks', data);
    return response.data;
  },

  updateTask: async (
    taskId: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      due_date?: string;
    }
  ) => {
    const response = await apiClient.put(`/employee/tasks/${taskId}`, data);
    return response.data;
  },

  getDocuments: async (params?: { category?: string; search?: string }) => {
    const response = await apiClient.get('/employee/documents', { params });
    return response.data;
  },

  uploadDocument: async (data: FormData) => {
    const response = await apiClient.post('/employee/documents', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAnnouncements: async (params?: { page?: number; page_size?: number }) => {
    const response = await apiClient.get('/employee/announcements', { params });
    return response.data;
  },

  // Notifications
  getNotifications: async (params?: { unread_only?: boolean; limit?: number }) => {
    const response = await apiClient.get('/employee/notifications', { params });
    return response.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const response = await apiClient.put(`/employee/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await apiClient.put('/employee/notifications/read-all');
    return response.data;
  },

  // Leave Requests
  submitLeaveRequest: async (data: {
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
  }) => {
    const response = await apiClient.post('/employee/leave-requests', data);
    return response.data;
  },

  getLeaveRequests: async () => {
    const response = await apiClient.get('/employee/leave-requests');
    return response.data;
  },
};

// ============================================================================
// Error Handling Utilities
// ============================================================================

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ 
      error?: { 
        message?: string;
        details?: Array<{ loc: string[]; msg: string; type: string }>;
      }; 
      detail?: string;
      success?: boolean;
    }>;
    
    // Check for validation errors with details
    if (axiosError.response?.data?.error?.details && Array.isArray(axiosError.response.data.error.details)) {
      const details = axiosError.response.data.error.details;
      if (details.length > 0) {
        // Return the first validation error message
        return details[0].msg || 'Validation error';
      }
    }
    
    // Check for error message in response
    if (axiosError.response?.data?.error?.message) {
      return axiosError.response.data.error.message;
    }
    
    // Check for detail in response (string)
    if (axiosError.response?.data?.detail) {
      const detail = axiosError.response.data.detail;
      if (typeof detail === 'string') {
        return detail;
      }
    }
    
    // Default error messages by status code
    if (axiosError.response?.status === 400) {
      return 'Invalid request. Please check your input.';
    }
    if (axiosError.response?.status === 401) {
      return 'Unauthorized. Please login again.';
    }
    if (axiosError.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (axiosError.response?.status === 404) {
      return 'Resource not found.';
    }
    if (axiosError.response?.status === 422) {
      return 'Validation failed. Please check your input.';
    }
    if (axiosError.response?.status === 500) {
      return 'Server error. Please try again later.';
    }
    
    return axiosError.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

export default apiClient;
