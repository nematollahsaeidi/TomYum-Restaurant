"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  Package, 
  CreditCard, 
  BatteryCharging, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle 
} from "lucide-react";
import { taskService } from "@/lib/task-service";
import { queueService } from "@/lib/queue-service";
import { toast } from "sonner";

interface Task {
  id: string;
  type: "ordering" | "delivery" | "collection" | "payment" | "charging";
  priority: "high" | "medium" | "low" | "dynamic";
  state: "WAITING" | "READY" | "CLAIMED" | "RUNNING" | "PAUSED" | "DONE";
  table: string;
  time: string;
  effective_priority: number;
  base_priority: number;
  operator_override: number;
  waypoints: string[];
  release_time: string;
  deadline: string;
  assigned_robot: string | null;
  created_at: string;
  updated_at: string;
}

const getTaskIcon = (type: string) => {
  switch (type) {
    case "delivery": return <Utensils className="h-4 w-4" />;
    case "collection": return <Package className="h-4 w-4" />;
    case "ordering": return <Utensils className="h-4 w-4" />;
    case "payment": return <CreditCard className="h-4 w-4" />;
    case "charging": return <BatteryCharging className="h-4 w-4" />;
    default: return <AlertTriangle className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-500";
    case "medium": return "bg-orange-500";
    case "low": return "bg-green-500";
    case "dynamic": return "bg-blue-500";
    default: return "bg-gray-500";
  }
};

export function TaskQueue() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const taskData = await queueService.getQueueTasks();
      // Convert backend task format to frontend format
      const convertedTasks = taskData.map((task: any) => ({
        ...task,
        priority: task.operator_override > 30 ? "high" : 
                  task.effective_priority > 80 ? "high" : 
                  task.effective_priority > 60 ? "medium" : "low"
      }));
      setTasks(convertedTasks);
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const moveTaskUp = async (id: string) => {
    try {
      const updatedTasks = taskService.moveTaskUp(tasks, id);
      setTasks(updatedTasks);
      toast.success("Task moved up in queue");
    } catch (error) {
      toast.error("Failed to move task");
    }
  };

  const moveTaskDown = async (id: string) => {
    try {
      const updatedTasks = taskService.moveTaskDown(tasks, id);
      setTasks(updatedTasks);
      toast.success("Task moved down in queue");
    } catch (error) {
      toast.error("Failed to move task");
    }
  };

  const markAsCritical = async (id: string) => {
    try {
      await taskService.markAsCritical(id);
      toast.success("Task marked as critical");
      // Refresh tasks to show updated priority
      fetchTasks();
    } catch (error) {
      toast.error("Failed to mark task as critical");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Queue Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Task Queue Management</span>
          <Badge variant="secondary">{tasks.length} tasks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                selectedTask === task.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedTask(task.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getPriorityColor(task.priority)}`}>
                  {getTaskIcon(task.type)}
                </div>
                <div>
                  <h3 className="font-medium capitalize">{task.type} Task</h3>
                  <p className="text-sm text-gray-500">{task.table}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <Badge variant="outline" className="capitalize">
                    {task.priority}
                  </Badge>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-medium">{task.time}</div>
                  <div className="text-xs text-gray-500">ETA</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">P{task.effective_priority}</div>
                  <div className="text-xs text-gray-500">Priority</div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTaskUp(task.id);
                    }}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTaskDown(task.id);
                    }}
                    disabled={index === tasks.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="hidden md:flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsCritical(task.id);
                  }}
                >
                  <AlertCircle className="h-3 w-3 mr-1" /> Critical
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Queue Management Guide</h4>
          <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
            <li>Tasks are prioritized automatically based on business rules</li>
            <li>Use arrow buttons to manually reorder tasks when needed</li>
            <li>Mark tasks as "Critical" for immediate attention</li>
            <li>System prevents conflicts and ensures safe robot operation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}