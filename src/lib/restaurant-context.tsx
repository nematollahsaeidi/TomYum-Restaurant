"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
interface Position {
  x: number;
  y: number;
}

interface Robot {
  id: number;
  name: string;
  status: "idle" | "delivering" | "collecting" | "charging" | "error";
  battery: number;
  position: Position;
  target?: Position;
  currentTaskId?: number;
  lastActive: Date;
}

interface Task {
  id: number;
  type: "ordering" | "delivery" | "collection" | "payment" | "charging";
  priority: "high" | "medium" | "low" | "dynamic";
  status: "queued" | "in-progress" | "completed";
  table: string;
  time: string;
  effectivePriority: number;
  assignedRobotId?: number;
}

interface Table {
  id: number;
  name: string;
  position: Position;
  chairs: { id: number; position: Position }[];
}

interface ChargingStation {
  id: number;
  name: string;
  position: Position;
  status: "available" | "occupied";
  robotId?: number;
}

interface Kitchen {
  id: number;
  name: string;
  position: Position;
  size: { width: number; height: number };
}

interface RestaurantState {
  robots: Robot[];
  tasks: Task[];
  tables: Table[];
  chargingStations: ChargingStation[];
  kitchen: Kitchen;
  isSystemRunning: boolean;
}

interface RestaurantContextType extends RestaurantState {
  addRobot: (robot: Omit<Robot, "id" | "lastActive">) => void;
  updateRobot: (id: number, updates: Partial<Robot>) => void;
  removeRobot: (id: number) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  removeTask: (id: number) => void;
  assignTaskToRobot: (taskId: number, robotId: number) => void;
  setSystemRunning: (running: boolean) => void;
  moveRobot: (robotId: number, target: Position) => void;
}

// Initial data
const initialTables: Table[] = [
  { 
    id: 1, 
    name: "Table 1", 
    position: { x: 200, y: 150 },
    chairs: [
      { id: 1, position: { x: 180, y: 130 } },
      { id: 2, position: { x: 220, y: 130 } },
      { id: 3, position: { x: 180, y: 170 } },
      { id: 4, position: { x: 220, y: 170 } }
    ]
  },
  { 
    id: 2, 
    name: "Table 2", 
    position: { x: 400, y: 150 },
    chairs: [
      { id: 5, position: { x: 380, y: 130 } },
      { id: 6, position: { x: 420, y: 130 } },
      { id: 7, position: { x: 380, y: 170 } },
      { id: 8, position: { x: 420, y: 170 } }
    ]
  },
  { 
    id: 3, 
    name: "Table 3", 
    position: { x: 200, y: 300 },
    chairs: [
      { id: 9, position: { x: 180, y: 280 } },
      { id: 10, position: { x: 220, y: 280 } },
      { id: 11, position: { x: 180, y: 320 } },
      { id: 12, position: { x: 220, y: 320 } }
    ]
  },
  { 
    id: 4, 
    name: "Table 4", 
    position: { x: 500, y: 300 },
    chairs: [
      { id: 13, position: { x: 480, y: 280 } },
      { id: 14, position: { x: 520, y: 280 } },
      { id: 15, position: { x: 480, y: 320 } },
      { id: 16, position: { x: 520, y: 320 } }
    ]
  },
  { 
    id: 5, 
    name: "Table 5", 
    position: { x: 350, y: 400 },
    chairs: [
      { id: 17, position: { x: 330, y: 380 } },
      { id: 18, position: { x: 370, y: 380 } },
      { id: 19, position: { x: 330, y: 420 } },
      { id: 20, position: { x: 370, y: 420 } }
    ]
  }
];

const initialChargingStations: ChargingStation[] = [
  { id: 1, name: "Charging Station 1", position: { x: 600, y: 450 }, status: "occupied", robotId: 3 },
  { id: 2, name: "Charging Station 2", position: { x: 650, y: 450 }, status: "available" }
];

const initialKitchen: Kitchen = {
  id: 1,
  name: "Kitchen",
  position: { x: 50, y: 50 },
  size: { width: 120, height: 120 }
};

const initialTasks: Task[] = [
  { id: 1, type: "delivery", priority: "high", status: "in-progress", table: "Table 5", time: "2 min", effectivePriority: 95, assignedRobotId: 1 },
  { id: 2, type: "collection", priority: "medium", status: "queued", table: "Table 3", time: "5 min", effectivePriority: 75 },
  { id: 3, type: "ordering", priority: "medium", status: "queued", table: "Table 7", time: "8 min", effectivePriority: 70 },
  { id: 4, type: "payment", priority: "low", status: "queued", table: "Table 2", time: "12 min", effectivePriority: 50 },
  { id: 5, type: "charging", priority: "dynamic", status: "queued", table: "Charging Station", time: "15 min", effectivePriority: 40 },
  { id: 6, type: "ordering", priority: "medium", status: "queued", table: "Table 9", time: "10 min", effectivePriority: 65 },
  { id: 7, type: "delivery", priority: "high", status: "queued", table: "Table 1", time: "3 min", effectivePriority: 90 },
];

const initialRobots: Robot[] = [
  { id: 1, name: "Robot Alpha", status: "delivering", battery: 85, position: { x: 300, y: 200 }, target: { x: 400, y: 150 }, currentTaskId: 1, lastActive: new Date() },
  { id: 2, name: "Robot Beta", status: "idle", battery: 92, position: { x: 150, y: 400 }, lastActive: new Date() },
  { id: 3, name: "Robot Gamma", status: "charging", battery: 30, position: { x: 600, y: 450 }, currentTaskId: 5, lastActive: new Date() },
  { id: 4, name: "Robot Delta", status: "collecting", battery: 67, position: { x: 500, y: 100 }, target: { x: 200, y: 300 }, currentTaskId: 2, lastActive: new Date() },
];

// Context
const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RestaurantState>({
    robots: initialRobots,
    tasks: initialTasks,
    tables: initialTables,
    chargingStations: initialChargingStations,
    kitchen: initialKitchen,
    isSystemRunning: true
  });

  // Simulate robot movement
  useEffect(() => {
    if (!state.isSystemRunning) return;

    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        robots: prev.robots.map(robot => {
          if ((robot.status === "delivering" || robot.status === "collecting") && robot.target) {
            const dx = robot.target.x - robot.position.x;
            const dy = robot.target.y - robot.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
              return {
                ...robot,
                position: {
                  x: robot.position.x + (dx / distance) * 2,
                  y: robot.position.y + (dy / distance) * 2
                }
              };
            }
          }
          return robot;
        })
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [state.isSystemRunning]);

  // Context value
  const value: RestaurantContextType = {
    ...state,
    setSystemRunning: (running: boolean) => {
      setState(prev => ({ ...prev, isSystemRunning: running }));
    },
    addRobot: (robot) => {
      setState(prev => ({
        ...prev,
        robots: [
          ...prev.robots,
          {
            ...robot,
            id: Math.max(0, ...prev.robots.map(r => r.id)) + 1,
            lastActive: new Date()
          }
        ]
      }));
    },
    updateRobot: (id, updates) => {
      setState(prev => ({
        ...prev,
        robots: prev.robots.map(robot => 
          robot.id === id ? { ...robot, ...updates, lastActive: new Date() } : robot
        )
      }));
    },
    removeRobot: (id) => {
      setState(prev => ({
        ...prev,
        robots: prev.robots.filter(robot => robot.id !== id)
      }));
    },
    addTask: (task) => {
      setState(prev => ({
        ...prev,
        tasks: [
          ...prev.tasks,
          {
            ...task,
            id: Math.max(0, ...prev.tasks.map(t => t.id)) + 1
          }
        ]
      }));
    },
    updateTask: (id, updates) => {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      }));
    },
    removeTask: (id) => {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id)
      }));
    },
    assignTaskToRobot: (taskId, robotId) => {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === taskId ? { ...task, status: "in-progress", assignedRobotId: robotId } : task
        ),
        robots: prev.robots.map(robot => 
          robot.id === robotId ? { ...robot, status: "delivering", currentTaskId: taskId } : robot
        )
      }));
    },
    moveRobot: (robotId, target) => {
      setState(prev => ({
        ...prev,
        robots: prev.robots.map(robot => 
          robot.id === robotId ? { ...robot, target } : robot
        )
      }));
    }
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}