import { tasksApi, queueApi, taskStateMachineApi } from './api';
import { toast } from 'sonner';

export interface Task {
  id: string;
  type: 'ordering' | 'delivery' | 'collection' | 'payment' | 'charging';
  base_priority: number;
  release_time: string;
  deadline: string;
  operator_override: number;
  effective_priority: number;
  waypoints: string[];
  state: 'WAITING' | 'READY' | 'CLAIMED' | 'RUNNING' | 'PAUSED' | 'DONE';
  assigned_robot: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateData {
  type: string;
  table: string;
  priority: string;
}

export interface PriorityUpdateData {
  boost: number;
  reason: string;
}

export interface TaskOverrideData {
  boost: number;
  reason: string;
}

export const taskService = {
  // Create a new task
  createTask: async (taskData: TaskCreateData) => {
    try {
      const response = await tasksApi.createTask(taskData);
      toast.success('Task created successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  },

  // Update task status
  updateTaskStatus: async (taskId: string, status: string) => {
    try {
      const response = await tasksApi.updateTaskStatus(taskId, { state: status });
      toast.success('Task status updated');
      return response.data;
    } catch (error) {
      toast.error('Failed to update task status');
      throw error;
    }
  },

  // Update task priority
  updateTaskPriority: async (taskId: string, priorityData: PriorityUpdateData) => {
    try {
      const response = await queueApi.updateTaskPriority(taskId, priorityData);
      toast.success('Task priority updated');
      return response.data;
    } catch (error) {
      toast.error('Failed to update task priority');
      throw error;
    }
  },

  // Apply task override
  applyTaskOverride: async (taskId: string, overrideData: TaskOverrideData) => {
    try {
      const response = await queueApi.applyTaskOverride(taskId, overrideData);
      toast.success('Task override applied');
      return response.data;
    } catch (error) {
      toast.error('Failed to apply task override');
      throw error;
    }
  },

  // Remove task override
  removeTaskOverride: async (taskId: string) => {
    try {
      const response = await queueApi.removeTaskOverride(taskId);
      toast.success('Task override removed');
      return response.data;
    } catch (error) {
      toast.error('Failed to remove task override');
      throw error;
    }
  },

  // Move task up in queue (UI only)
  moveTaskUp: (tasks: Task[], taskId: string): Task[] => {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index <= 0) return tasks;
    
    const newTasks = [...tasks];
    [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
    return newTasks;
  },

  // Move task down in queue (UI only)
  moveTaskDown: (tasks: Task[], taskId: string): Task[] => {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index === -1 || index === tasks.length - 1) return tasks;
    
    const newTasks = [...tasks];
    [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
    return newTasks;
  },

  // Mark task as critical (applies high priority override)
  markAsCritical: async (taskId: string) => {
    return taskService.applyTaskOverride(taskId, {
      boost: 50,
      reason: 'Operator marked as critical'
    });
  },

  // Confirm task step
  confirmTaskStep: async (taskId: string) => {
    try {
      const response = await taskStateMachineApi.confirmTaskStep(taskId);
      toast.success('Task step confirmed');
      return response.data;
    } catch (error) {
      toast.error('Failed to confirm task step');
      throw error;
    }
  },

  // Pause task
  pauseTask: async (taskId: string) => {
    try {
      const response = await taskStateMachineApi.pauseTask(taskId);
      toast.success('Task paused');
      return response.data;
    } catch (error) {
      toast.error('Failed to pause task');
      throw error;
    }
  },

  // Resume task
  resumeTask: async (taskId: string) => {
    try {
      const response = await taskStateMachineApi.resumeTask(taskId);
      toast.success('Task resumed');
      return response.data;
    } catch (error) {
      toast.error('Failed to resume task');
      throw error;
    }
  }
};