import { queueApi } from './api';
import { toast } from 'sonner';

export interface AssignmentLogEntry {
  id: number;
  task_id: string;
  robot_id: string;
  assignment_time: string;
  score: number;
  reason: string;
  effective_priority: number;
}

export const queueService = {
  // Get all queue tasks
  getQueueTasks: async () => {
    try {
      const response = await queueApi.getQueueTasks();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch queue tasks');
      throw error;
    }
  },

  // Get ready tasks
  getReadyTasks: async () => {
    try {
      const response = await queueApi.getReadyTasks();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch ready tasks');
      throw error;
    }
  },

  // Get assignment log
  getAssignmentLog: async () => {
    try {
      const response = await queueApi.getAssignmentLog();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch assignment log');
      throw error;
    }
  }
};