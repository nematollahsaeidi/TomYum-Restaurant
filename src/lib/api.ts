import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

// Add a request interceptor to handle authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authApi = {
  login: (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return apiClient.post('/auth/login', formData);
  },
  logout: () => {
    return apiClient.post('/auth/logout');
  },
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  }
};

// Tables endpoints
export const tablesApi = {
  getTables: () => {
    return apiClient.get('/tables');
  },
  getTable: (id: string) => {
    return apiClient.get(`/tables/${id}`);
  }
};

// Points endpoints
export const pointsApi = {
  getPoints: () => {
    return apiClient.get('/points');
  },
  getPoint: (id: string) => {
    return apiClient.get(`/points/${id}`);
  },
  getPointsByType: (type: string) => {
    return apiClient.get(`/points/type/${type}`);
  }
};

// Orders endpoints
export const ordersApi = {
  getOrders: () => {
    return apiClient.get('/orders');
  },
  getOrder: (id: string) => {
    return apiClient.get(`/orders/${id}`);
  }
};

// Tasks endpoints
export const tasksApi = {
  getTasks: () => {
    return apiClient.get('/tasks');
  },
  getTask: (id: string) => {
    return apiClient.get(`/tasks/${id}`);
  },
  createTask: (taskData: any) => {
    return apiClient.post('/tasks', taskData);
  },
  updateTaskStatus: (id: string, statusData: any) => {
    return apiClient.put(`/tasks/${id}/status`, statusData);
  }
};

// Robots endpoints
export const robotsApi = {
  getRobots: () => {
    return apiClient.get('/robots');
  },
  getRobot: (id: string) => {
    return apiClient.get(`/robots/${id}`);
  },
  sendRobotCommand: (id: string, commandData: any) => {
    return apiClient.post(`/robots/${id}/command`, commandData);
  }
};

// Queue management endpoints
export const queueApi = {
  getQueueTasks: () => {
    return apiClient.get('/queue/tasks');
  },
  getReadyTasks: () => {
    return apiClient.get('/queue/tasks/ready');
  },
  updateTaskPriority: (id: string, priorityData: any) => {
    return apiClient.put(`/queue/tasks/${id}/priority`, priorityData);
  },
  applyTaskOverride: (id: string, overrideData: any) => {
    return apiClient.post(`/queue/tasks/${id}/override`, overrideData);
  },
  removeTaskOverride: (id: string) => {
    return apiClient.delete(`/queue/tasks/${id}/override`);
  },
  getAssignmentLog: () => {
    return apiClient.get('/queue/assignment-log');
  }
};

// Charging management endpoints
export const chargingApi = {
  getChargingStatus: () => {
    return apiClient.get('/charging/status');
  },
  getChargingPolicy: () => {
    return apiClient.get('/charging/policy');
  },
  requestManualCharging: (robotData: any) => {
    return apiClient.post('/charging/manual-request', robotData);
  }
};

// Task state machine endpoints
export const taskStateMachineApi = {
  confirmTaskStep: (id: string) => {
    return apiClient.post(`/tasks/${id}/confirm-step`);
  },
  getCurrentTaskStep: (id: string) => {
    return apiClient.get(`/tasks/${id}/current-step`);
  },
  pauseTask: (id: string) => {
    return apiClient.put(`/tasks/${id}/pause`);
  },
  resumeTask: (id: string) => {
    return apiClient.put(`/tasks/${id}/resume`);
  }
};

// Reports endpoints
export const reportsApi = {
  getDailyReport: () => {
    return apiClient.get('/reports/daily');
  },
  getTaskStatistics: () => {
    return apiClient.get('/reports/tasks');
  },
  getPerformanceReport: () => {
    return apiClient.get('/reports/performance');
  }
};

export default apiClient;