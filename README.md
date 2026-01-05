# 🍜 Tom Yum Robot Control Center

A smart delivery robot solution for Tom Yum Thai Restaurant built with React, TypeScript, and Tailwind CSS.

## 📋 Features

- Real-time robot monitoring
- Task queue management with priority system
- Analytics dashboard
- Charging station management
- Menu management
- Customer database
- Payment processing
- Inventory tracking
- Interactive restaurant map
- Drag & drop queue management
- Priority override system
- Detailed task tracking and explainability

## 🛠️ Technology Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

### Backend (Simulated)
- In-memory data structures simulating a backend
- WebSocket-like real-time updates through React context

## 📦 Prerequisites

- Node.js 18+
- npm or yarn

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tom-yum-robot-control
```

2. Install dependencies:
```bash
npm install
```

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🌐 Application Pages

- **Dashboard** (`/`) - Main overview of system status
- **Task Queue** (`/tasks`) - Manage and monitor task queue
- **Robots** (`/robots`) - Robot status monitoring
- **Map** (`/map`) - Interactive restaurant layout with robot positions
- **Analytics** (`/analytics`) - Performance metrics and insights
- **Customers** (`/customers`) - Customer database management
- **Menu** (`/menu`) - Restaurant menu management
- **Inventory** (`/inventory`) - Track restaurant inventory
- **Payments** (`/payments`) - Payment processing and tracking
- **Charging** (`/charging`) - Robot charging station management
- **Settings** (`/settings`) - System configuration
- **Customer Order** (`/customer-order`) - Customer-facing ordering interface

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components for each route
├── lib/              # Utility functions and context providers
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
├── App.tsx           # Main application component with routing
└── main.tsx          # Application entry point
```

## 🧪 Development

### Component Development

The application uses shadcn/ui components extensively. All UI components are built with Tailwind CSS classes for consistent styling.

### State Management

- React Context API for global state management
- useState and useEffect for local component state
- Restaurant context for simulating backend data

### Routing

React Router is used for client-side routing with the following routes defined in `src/App.tsx`.

## 🚢 Deployment

The application can be deployed to any static hosting service (Vercel, Netlify, etc.) since it's a client-side React application.

To build for production:
```bash
npm run build
```

## 🔐 Security

This is a frontend-only application with simulated backend data. In a production environment, you would need to:

1. Connect to a real backend API
2. Implement proper authentication
3. Add environment variables for API endpoints
4. Implement proper error handling

## 📡 API Endpoints

The application simulates a backend with the following API endpoints:

### Authentication
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### Tables
```
GET /api/tables
GET /api/tables/{table_id}
```

### Points
```
GET /api/points
GET /api/points/{point_id}
GET /api/points/type/{point_type}
```

### Orders
```
GET /api/orders
GET /api/orders/{order_id}
```

### Tasks
```
GET /api/tasks
GET /api/tasks/{task_id}
POST /api/tasks
PUT /api/tasks/{task_id}/status
```

### Robots
```
GET /api/robots
GET /api/robots/{robot_id}
POST /api/robots/{robot_id}/command
```

### Queue Management
```
GET /api/queue/tasks
GET /api/queue/tasks/ready
PUT /api/queue/tasks/{task_id}/priority
POST /api/queue/tasks/{task_id}/override
DELETE /api/queue/tasks/{task_id}/override
GET /api/queue/assignment-log
```

### Charging Management
```
GET /api/charging/status
GET /api/charging/policy
POST /api/charging/manual-request
```

### Task State Machine
```
POST /api/tasks/{task_id}/confirm-step
GET /api/tasks/{task_id}/current-step
PUT /api/tasks/{task_id}/pause
PUT /api/tasks/{task_id}/resume
```

### Reports
```
GET /api/reports/daily
GET /api/reports/tasks
GET /api/reports/performance
```

## 📊 Required Functions for UI Implementation

### Task Management Functions
```javascript
// Create a new task
async function createTask(taskData) {
  const result = await apiCall('/api/tasks', 'POST', taskData);
  return result;
}

// Update task status
async function updateTaskStatus(taskId, status) {
  const result = await apiCall(`/api/tasks/${taskId}/status`, 'PUT', { state: status });
  return result;
}

// Update task priority
async function updateTaskPriority(taskId, priorityData) {
  const result = await apiCall(`/api/queue/tasks/${taskId}/priority`, 'PUT', priorityData);
  return result;
}

// Apply task override
async function applyTaskOverride(taskId, overrideData) {
  const result = await apiCall(`/api/queue/tasks/${taskId}/override`, 'POST', overrideData);
  return result;
}

// Remove task override
async function removeTaskOverride(taskId) {
  const result = await apiCall(`/api/queue/tasks/${taskId}/override`, 'DELETE');
  return result;
}
```

### Robot Management Functions
```javascript
// Send command to robot
async function sendRobotCommand(robotId, command) {
  const result = await apiCall(`/api/robots/${robotId}/command`, 'POST', { command });
  return result;
}

// Get robot status
async function getRobotStatus(robotId) {
  const result = await apiCall(`/api/robots/${robotId}`);
  return result;
}

// Get all robots
async function getAllRobots() {
  const result = await apiCall('/api/robots');
  return result;
}
```

### Queue Management Functions
```javascript
// Get all queue tasks
async function getQueueTasks() {
  const result = await apiCall('/api/queue/tasks');
  return result;
}

// Get ready tasks
async function getReadyTasks() {
  const result = await apiCall('/api/queue/tasks/ready');
  return result;
}

// Get assignment log
async function getAssignmentLog() {
  const result = await apiCall('/api/queue/assignment-log');
  return result;
}
```

### Charging Management Functions
```javascript
// Get charging status
async function getChargingStatus() {
  const result = await apiCall('/api/charging/status');
  return result;
}

// Request manual charging
async function requestManualCharging(robotData) {
  const result = await apiCall('/api/charging/manual-request', 'POST', robotData);
  return result;
}
```

### Reporting Functions
```javascript
// Get daily report
async function getDailyReport() {
  const result = await apiCall('/api/reports/daily');
  return result;
}

// Get task statistics
async function getTaskStatistics() {
  const result = await apiCall('/api/reports/tasks');
  return result;
}

// Get performance report
async function getPerformanceReport() {
  const result = await apiCall('/api/reports/performance');
  return result;
}
```

## 📈 WebSocket Events

The application uses WebSocket for real-time updates:

```javascript
// Server to client events
socket.on('robot_updated', (data) => {
  // Robot status update
});

socket.on('task_created', (data) => {
  // New task created
});

socket.on('task_updated', (data) => {
  // Task status update
});

socket.on('task_priority_updated', (data) => {
  // Task priority update
});

socket.on('task_override_applied', (data) => {
  // Task override applied
});

socket.on('task_override_removed', (data) => {
  // Task override removed
});

socket.on('task_paused', (data) => {
  // Task paused
});

socket.on('task_resumed', (data) => {
  // Task resumed
});

socket.on('task_step_confirmed', (data) => {
  // Task step confirmed
});

socket.on('charging_updated', (data) => {
  // Charging status update
});

// Client to server events
socket.emit('operator_override', { taskId, newPriority });
socket.emit('manual_command', { robotId, command });
```

## 📄 License

This project is licensed for internal use by Tom Yum Thai Restaurant.