from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import json
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import os
from enum import Enum

# Import database models and session
from database import SessionLocal, engine, Base
from models import Task, Robot, AssignmentLog

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tom Yum Robot Control Center API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# In-memory data storage for demo purposes
# In production, this would be stored in the database
class TaskState(str, Enum):
    WAITING = "WAITING"
    READY = "READY"
    CLAIMED = "CLAIMED"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    DONE = "DONE"

class TaskType(str, Enum):
    ORDERING = "ordering"
    DELIVERY = "delivery"
    COLLECTION = "collection"
    PAYMENT = "payment"
    CHARGING = "charging"

class RobotStatus(str, Enum):
    IDLE = "IDLE"
    MOVING = "MOVING"
    CHARGING = "CHARGING"
    ERROR = "ERROR"

# Global state management
class SystemState:
    def __init__(self):
        self.robots: List[Dict[str, Any]] = [
            {
                "id": "R1",
                "current_location": "Kitchen",
                "battery_level": 85,
                "status": RobotStatus.IDLE,
                "current_task_id": None,
                "last_active": datetime.now()
            },
            {
                "id": "R2",
                "current_location": "Charging Station",
                "battery_level": 30,
                "status": RobotStatus.CHARGING,
                "current_task_id": None,
                "last_active": datetime.now()
            },
            {
                "id": "R3",
                "current_location": "Table 3",
                "battery_level": 67,
                "status": RobotStatus.MOVING,
                "current_task_id": "T-102",
                "last_active": datetime.now()
            },
            {
                "id": "R4",
                "current_location": "Base Station",
                "battery_level": 92,
                "status": RobotStatus.IDLE,
                "current_task_id": None,
                "last_active": datetime.now()
            }
        ]
        
        self.tasks: List[Dict[str, Any]] = [
            {
                "id": "T-101",
                "type": TaskType.DELIVERY,
                "base_priority": 100,
                "release_time": datetime.now() - timedelta(minutes=10),
                "deadline": datetime.now() + timedelta(minutes=10),
                "operator_override": 0,
                "effective_priority": 105,
                "waypoints": ["Kitchen", "Station A", "Table 5"],
                "state": TaskState.RUNNING,
                "assigned_robot": "R1",
                "created_at": datetime.now() - timedelta(minutes=15)
            },
            {
                "id": "T-102",
                "type": TaskType.COLLECTION,
                "base_priority": 50,
                "release_time": datetime.now() - timedelta(minutes=5),
                "deadline": datetime.now() + timedelta(minutes=15),
                "operator_override": 0,
                "effective_priority": 75,
                "waypoints": ["Table 3", "Washing Machine"],
                "state": TaskState.READY,
                "assigned_robot": None,
                "created_at": datetime.now() - timedelta(minutes=10)
            },
            {
                "id": "T-103",
                "type": TaskType.ORDERING,
                "base_priority": 70,
                "release_time": datetime.now() + timedelta(minutes=5),
                "deadline": datetime.now() + timedelta(minutes=20),
                "operator_override": 0,
                "effective_priority": 65,
                "waypoints": ["Table 2"],
                "state": TaskState.WAITING,
                "assigned_robot": None,
                "created_at": datetime.now()
            },
            {
                "id": "T-104",
                "type": TaskType.PAYMENT,
                "base_priority": 60,
                "release_time": datetime.now(),
                "deadline": datetime.now() + timedelta(minutes=15),
                "operator_override": 0,
                "effective_priority": 60,
                "waypoints": ["Reception", "Table 7"],
                "state": TaskState.READY,
                "assigned_robot": None,
                "created_at": datetime.now() - timedelta(minutes=2)
            },
            {
                "id": "T-105",
                "type": TaskType.CHARGING,
                "base_priority": 40,
                "release_time": datetime.now(),
                "deadline": datetime.now() + timedelta(minutes=30),
                "operator_override": 0,
                "effective_priority": 40,
                "waypoints": ["Charging Station"],
                "state": TaskState.READY,
                "assigned_robot": None,
                "created_at": datetime.now() - timedelta(minutes=1)
            }
        ]
        
        self.assignment_logs: List[Dict[str, Any]] = [
            {
                "id": 1,
                "task_id": "T-101",
                "robot_id": "R1",
                "assignment_time": datetime.now() - timedelta(minutes=15),
                "score": 105,
                "reason": "High priority delivery task",
                "effective_priority": 105
            },
            {
                "id": 2,
                "task_id": "T-102",
                "robot_id": "R3",
                "assignment_time": datetime.now() - timedelta(minutes=10),
                "score": 75,
                "reason": "Collection task with medium priority",
                "effective_priority": 75
            }
        ]
        
        self.charging_stations: List[Dict[str, Any]] = [
            {
                "id": "station_1",
                "status": "occupied",
                "robot_id": "R2",
                "charging_level": 30,
                "max_capacity": 100
            },
            {
                "id": "station_2",
                "status": "available",
                "robot_id": None,
                "charging_level": 100,
                "max_capacity": 100
            }
        ]
        
        self.tables: List[Dict[str, Any]] = [
            {"id": "T1", "name": "Table 1", "status": "available", "position": {"x": 100, "y": 200}},
            {"id": "T2", "name": "Table 2", "status": "occupied", "position": {"x": 150, "y": 250}},
            {"id": "T3", "name": "Table 3", "status": "reserved", "position": {"x": 200, "y": 300}},
            {"id": "T4", "name": "Table 4", "status": "available", "position": {"x": 250, "y": 200}},
            {"id": "T5", "name": "Table 5", "status": "occupied", "position": {"x": 300, "y": 250}}
        ]
        
        self.points: List[Dict[str, Any]] = [
            {"id": "P1", "name": "Kitchen", "type": "kitchen", "position": {"x": 50, "y": 50}},
            {"id": "P2", "name": "Reception", "type": "billing", "position": {"x": 300, "y": 50}},
            {"id": "P3", "name": "Charging Station", "type": "charging", "position": {"x": 200, "y": 350}},
            {"id": "P4", "name": "Washing Machine", "type": "collection", "position": {"x": 350, "y": 350}},
            {"id": "P5", "name": "Station A", "type": "delivery", "position": {"x": 150, "y": 100}}
        ]
        
        self.orders: List[Dict[str, Any]] = [
            {
                "id": "O1",
                "table_id": "T1",
                "items": [{"name": "Pad Thai", "quantity": 2}],
                "status": "preparing",
                "created_at": datetime.now() - timedelta(minutes=15)
            },
            {
                "id": "O2",
                "table_id": "T3",
                "items": [{"name": "Tom Yum Soup", "quantity": 1}],
                "status": "ready",
                "created_at": datetime.now() - timedelta(minutes=5)
            }
        ]
        
        self.active_connections: List[WebSocket] = []

# Initialize system state
system_state = SystemState()

# WebSocket manager for real-time updates
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Models
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Table(BaseModel):
    id: str
    name: str
    status: str
    position: dict

class Point(BaseModel):
    id: str
    name: str
    type: str
    position: dict

class Order(BaseModel):
    id: str
    table_id: str
    items: List[dict]
    status: str
    created_at: datetime

class TaskCreate(BaseModel):
    type: str
    table: str
    priority: str

class RobotCommand(BaseModel):
    command: str

class PriorityUpdate(BaseModel):
    boost: int
    reason: str

class TaskOverride(BaseModel):
    boost: int
    reason: str

# Serve main pages - catch-all route for SPA
def get_html_content(filename):
    try:
        with open(f"frontend/{filename}", "r") as file:
            return HTMLResponse(content=file.read())
    except FileNotFoundError:
        # If specific file not found, serve index.html for SPA routing
        with open("frontend/index.html", "r") as file:
            return HTMLResponse(content=file.read())

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return get_html_content("index.html")

@app.get("/queue", response_class=HTMLResponse)
async def read_queue():
    return get_html_content("queue.html")

@app.get("/task-details", response_class=HTMLResponse)
async def read_task_details():
    return get_html_content("task-details.html")

@app.get("/reports", response_class=HTMLResponse)
async def read_reports():
    return get_html_content("reports.html")

@app.get("/analytics", response_class=HTMLResponse)
async def read_analytics():
    return get_html_content("reports.html")

# Authentication endpoints
@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # In a real application, you would verify credentials against a database
    # For demo purposes, we'll accept any non-empty username/password
    if not form_data.username or not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate a fake token for demo
    token = str(uuid.uuid4())
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # In a real application, you would verify the token
    return {"username": "admin", "role": "administrator"}

# Tables endpoints
@app.get("/api/tables", response_model=List[Table])
async def get_tables():
    return system_state.tables

@app.get("/api/tables/{table_id}")
async def get_table(table_id: str):
    table = next((t for t in system_state.tables if t["id"] == table_id), None)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return table

# Points endpoints
@app.get("/api/points", response_model=List[Point])
async def get_points():
    return system_state.points

@app.get("/api/points/{point_id}")
async def get_point(point_id: str):
    point = next((p for p in system_state.points if p["id"] == point_id), None)
    if not point:
        raise HTTPException(status_code=404, detail="Point not found")
    return point

@app.get("/api/points/type/{point_type}", response_model=List[Point])
async def get_points_by_type(point_type: str):
    points = [p for p in system_state.points if p["type"] == point_type]
    return points

# Orders endpoints
@app.get("/api/orders", response_model=List[Order])
async def get_orders():
    return system_state.orders

@app.get("/api/orders/{order_id}")
async def get_order(order_id: str):
    order = next((o for o in system_state.orders if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Tasks endpoints
@app.get("/api/tasks", response_model=List[dict])
async def get_tasks():
    return system_state.tasks

@app.get("/api/tasks/{task_id}")
async def get_task(task_id: str):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/api/tasks", response_model=dict)
async def create_task(task: TaskCreate):
    # Determine base priority based on task type
    base_priority_map = {
        "delivery": 100,
        "payment": 80,
        "ordering": 70,
        "collection": 50,
        "charging": 40
    }
    
    base_priority = base_priority_map.get(task.type, 50)
    
    new_task = {
        "id": f"T-{len(system_state.tasks) + 100}",
        "type": task.type,
        "base_priority": base_priority,
        "release_time": datetime.now(),
        "deadline": datetime.now() + timedelta(minutes=15),
        "operator_override": 0,
        "effective_priority": base_priority,
        "waypoints": [task.table],
        "state": TaskState.READY,
        "assigned_robot": None,
        "created_at": datetime.now()
    }
    
    system_state.tasks.append(new_task)
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "task_created",
        "data": new_task
    }))
    
    return new_task

@app.put("/api/tasks/{task_id}/status")
async def update_task_status(task_id: str, status_update: dict):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    new_state = status_update.get("state")
    if new_state and new_state in TaskState.__members__.values():
        old_state = task["state"]
        task["state"] = new_state
        
        # Update robot status if task is assigned
        if task["assigned_robot"] and new_state == TaskState.RUNNING:
            robot = next((r for r in system_state.robots if r["id"] == task["assigned_robot"]), None)
            if robot:
                robot["status"] = RobotStatus.MOVING
                robot["current_task_id"] = task_id
        elif new_state == TaskState.DONE:
            # Free up robot
            robot = next((r for r in system_state.robots if r["id"] == task["assigned_robot"]), None)
            if robot:
                robot["status"] = RobotStatus.IDLE
                robot["current_task_id"] = None
                robot["last_active"] = datetime.now()
        elif new_state == TaskState.PAUSED:
            # Update robot status if assigned
            if task["assigned_robot"]:
                robot = next((r for r in system_state.robots if r["id"] == task["assigned_robot"]), None)
                if robot:
                    robot["status"] = RobotStatus.IDLE
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "task_updated",
        "data": task
    }))
    
    return {"message": "Task status updated", "task": task}

# Robots endpoints
@app.get("/api/robots", response_model=List[dict])
async def get_robots():
    return system_state.robots

@app.get("/api/robots/{robot_id}")
async def get_robot(robot_id: str):
    robot = next((r for r in system_state.robots if r["id"] == robot_id), None)
    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")
    return robot

@app.post("/api/robots/{robot_id}/command")
async def send_robot_command(robot_id: str, command: RobotCommand):
    robot = next((r for r in system_state.robots if r["id"] == robot_id), None)
    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")
    
    # Update robot status based on command
    if command.command == "RETURN_TO_BASE":
        robot["status"] = RobotStatus.MOVING
        robot["current_location"] = "Returning to base"
    elif command.command == "START_CHARGING":
        robot["status"] = RobotStatus.CHARGING
        robot["current_location"] = "Charging Station"
        # Update charging station status
        for station in system_state.charging_stations:
            if station["status"] == "available":
                station["status"] = "occupied"
                station["robot_id"] = robot_id
                break
    elif command.command == "STOP_CHARGING":
        robot["status"] = RobotStatus.IDLE
        robot["current_location"] = "Base Station"
        # Update charging station status
        for station in system_state.charging_stations:
            if station["robot_id"] == robot_id:
                station["status"] = "available"
                station["robot_id"] = None
                break
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "robot_updated",
        "data": robot
    }))
    
    return {"message": f"Command {command.command} sent to robot {robot_id}"}

# Queue management endpoints
@app.get("/api/queue/tasks")
async def get_queue_tasks():
    return system_state.tasks

@app.get("/api/queue/tasks/ready")
async def get_ready_tasks():
    return [t for t in system_state.tasks if t["state"] == TaskState.READY]

@app.put("/api/queue/tasks/{task_id}/priority")
async def update_task_priority(task_id: str, priority_data: PriorityUpdate):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Apply operator override
    task["operator_override"] = priority_data.boost
    task["effective_priority"] = task["base_priority"] + priority_data.boost
    
    # Log the override
    log_entry = {
        "id": len(system_state.assignment_logs) + 1,
        "task_id": task_id,
        "robot_id": task.get("assigned_robot"),
        "assignment_time": datetime.now(),
        "score": task["effective_priority"],
        "reason": priority_data.reason,
        "effective_priority": task["effective_priority"]
    }
    
    system_state.assignment_logs.append(log_entry)
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "task_priority_updated",
        "data": task
    }))
    
    return {"message": "Task priority updated", "task": task, "log": log_entry}

@app.post("/api/queue/tasks/{task_id}/override")
async def apply_task_override(task_id: str, override_data: TaskOverride):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Mark as critical
    task["operator_override"] = override_data.boost
    task["effective_priority"] = task["base_priority"] + override_data.boost
    task["state"] = TaskState.READY  # Make sure it's ready
    
    # Log the override
    log_entry = {
        "id": len(system_state.assignment_logs) + 1,
        "task_id": task_id,
        "robot_id": task.get("assigned_robot"),
        "assignment_time": datetime.now(),
        "score": task["effective_priority"],
        "reason": override_data.reason,
        "effective_priority": task["effective_priority"]
    }
    
    system_state.assignment_logs.append(log_entry)
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "task_override_applied",
        "data": task
    }))
    
    return {"message": "Task marked as critical", "task": task, "log": log_entry}

@app.delete("/api/queue/tasks/{task_id}/override")
async def remove_task_override(task_id: str):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Remove override
    task["operator_override"] = 0
    task["effective_priority"] = task["base_priority"]
    
    # Log the removal
    log_entry = {
        "id": len(system_state.assignment_logs) + 1,
        "task_id": task_id,
        "robot_id": task.get("assigned_robot"),
        "assignment_time": datetime.now(),
        "score": task["effective_priority"],
        "reason": "Operator override removed",
        "effective_priority": task["effective_priority"]
    }
    
    system_state.assignment_logs.append(log_entry)
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "task_override_removed",
        "data": task
    }))
    
    return {"message": "Task override removed", "task": task, "log": log_entry}

@app.get("/api/queue/assignment-log")
async def get_assignment_log():
    return system_state.assignment_logs

# Charging management endpoints
@app.get("/api/charging/status")
async def get_charging_status():
    return {
        "stations": system_state.charging_stations,
        "policy": {
            "min_battery_threshold": 30,
            "max_concurrent_charging": 1,
            "charging_priority": "battery_level",
            "auto_charging_enabled": True
        }
    }

@app.get("/api/charging/policy")
async def get_charging_policy():
    return {
        "min_battery_threshold": 30,
        "max_concurrent_charging": 1,
        "charging_priority": "battery_level",
        "auto_charging_enabled": True
    }

@app.post("/api/charging/manual-request")
async def request_manual_charging(robot_data: dict):
    robot_id = robot_data.get("robot_id")
    if not robot_id:
        raise HTTPException(status_code=400, detail="Robot ID is required")
    
    robot = next((r for r in system_state.robots if r["id"] == robot_id), None)
    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")
    
    # Find available charging station
    available_station = next((s for s in system_state.charging_stations if s["status"] == "available"), None)
    if not available_station:
        return {"message": "No charging stations available", "success": False}
    
    # Assign robot to charging station
    available_station["status"] = "occupied"
    available_station["robot_id"] = robot_id
    
    # Update robot status
    robot["status"] = RobotStatus.CHARGING
    robot["current_location"] = "Charging Station"
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "charging_updated",
        "data": {
            "robot": robot,
            "station": available_station
        }
    }))
    
    return {"message": f"Manual charging request for robot {robot_id} accepted", "success": True}

# Task state machine endpoints
@app.post("/api/tasks/{task_id}/confirm-step")
async def confirm_task_step(task_id: str):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # For demo, we'll just log the confirmation
    log_entry = {
        "id": len(system_state.assignment_logs) + 1,
        "task_id": task_id,
        "robot_id": task.get("assigned_robot"),
        "assignment_time": datetime.now(),
        "score": task["effective_priority"],
        "reason": f"Step confirmed for task {task_id}",
        "effective_priority": task["effective_priority"]
    }
    
    system_state.assignment_logs.append(log_entry)
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "task_step_confirmed",
        "data": task
    }))
    
    return {"message": f"Step confirmed for task {task_id}", "task": task, "log": log_entry}

@app.get("/api/tasks/{task_id}/current-step")
async def get_current_task_step(task_id: str):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Determine current step based on task type and state
    if task["type"] == TaskType.DELIVERY:
        if task["state"] == TaskState.RUNNING:
            return {"step": 2, "total_steps": 3, "description": "At Station A - Awaiting Operator Verification"}
        elif task["state"] == TaskState.DONE:
            return {"step": 3, "total_steps": 3, "description": "Delivered to customer table"}
        else:
            return {"step": 1, "total_steps": 3, "description": "Moving to Kitchen"}
    elif task["type"] == TaskType.COLLECTION:
        if task["state"] == TaskState.RUNNING:
            return {"step": 1, "total_steps": 2, "description": "Moving to customer table"}
        elif task["state"] == TaskState.DONE:
            return {"step": 2, "total_steps": 2, "description": "Collected dishes from table"}
        else:
            return {"step": 0, "total_steps": 2, "description": "Waiting for assignment"}
    
    return {"step": 1, "total_steps": 1, "description": "Initial step"}

@app.put("/api/tasks/{task_id}/pause")
async def pause_task(task_id: str):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task["state"] = TaskState.PAUSED
    
    # Update robot status if assigned
    if task["assigned_robot"]:
        robot = next((r for r in system_state.robots if r["id"] == task["assigned_robot"]), None)
        if robot:
            robot["status"] = RobotStatus.IDLE
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "task_paused",
        "data": task
    }))
    
    return {"message": f"Task {task_id} paused", "task": task}

@app.put("/api/tasks/{task_id}/resume")
async def resume_task(task_id: str):
    task = next((t for t in system_state.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task["state"] = TaskState.READY
    
    # Broadcast update to all connected clients
    await manager.broadcast(json.dumps({
        "type": "task_resumed",
        "data": task
    }))
    
    return {"message": f"Task {task_id} resumed", "task": task}

# Reports endpoints
@app.get("/api/reports/daily")
async def get_daily_report():
    # Calculate daily statistics
    total_tasks = len(system_state.tasks)
    completed_tasks = len([t for t in system_state.tasks if t["state"] == TaskState.DONE])
    failed_tasks = len([t for t in system_state.tasks if t["state"] == TaskState.PAUSED])
    
    # Calculate average completion time (simplified)
    avg_completion_time = "2.5 minutes"
    
    # Calculate robot utilization
    active_robots = len([r for r in system_state.robots if r["status"] != RobotStatus.IDLE])
    robot_utilization = f"{int((active_robots / len(system_state.robots)) * 100)}%"
    
    return {
        "date": datetime.now().date().isoformat(),
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "failed_tasks": failed_tasks,
        "avg_completion_time": avg_completion_time,
        "robot_utilization": robot_utilization
    }

@app.get("/api/reports/tasks")
async def get_task_statistics():
    # Count tasks by type
    delivery_tasks = len([t for t in system_state.tasks if t["type"] == TaskType.DELIVERY])
    collection_tasks = len([t for t in system_state.tasks if t["type"] == TaskType.COLLECTION])
    ordering_tasks = len([t for t in system_state.tasks if t["type"] == TaskType.ORDERING])
    payment_tasks = len([t for t in system_state.tasks if t["type"] == TaskType.PAYMENT])
    charging_tasks = len([t for t in system_state.tasks if t["type"] == TaskType.CHARGING])
    
    return {
        "delivery_tasks": delivery_tasks,
        "collection_tasks": collection_tasks,
        "ordering_tasks": ordering_tasks,
        "payment_tasks": payment_tasks,
        "charging_tasks": charging_tasks
    }

@app.get("/api/reports/performance")
async def get_performance_report():
    # Calculate system health (simplified)
    system_health = 98
    
    # Average response time (simplified)
    avg_response_time = "0.2s"
    
    # Peak load time (simplified)
    peak_load_time = "18:30"
    
    # Error rate (simplified)
    error_rate = "0.5%"
    
    # Uptime (simplified)
    uptime = "99.9%"
    
    return {
        "system_health": system_health,
        "avg_response_time": avg_response_time,
        "peak_load_time": peak_load_time,
        "error_rate": error_rate,
        "uptime": uptime
    }

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo the message back (in a real app, you might process it)
            await manager.send_personal_message(f"You sent: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("A client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)