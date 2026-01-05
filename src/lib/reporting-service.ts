import { reportsApi } from './api';
import { toast } from 'sonner';

export interface DailyReport {
  date: string;
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  avg_completion_time: string;
  robot_utilization: string;
}

export interface TaskStatistics {
  delivery_tasks: number;
  collection_tasks: number;
  ordering_tasks: number;
  payment_tasks: number;
  charging_tasks: number;
}

export interface PerformanceReport {
  system_health: number;
  avg_response_time: string;
  peak_load_time: string;
  error_rate: string;
  uptime: string;
}

export const reportingService = {
  // Get daily report
  getDailyReport: async (): Promise<DailyReport> => {
    try {
      const response = await reportsApi.getDailyReport();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch daily report');
      throw error;
    }
  },

  // Get task statistics
  getTaskStatistics: async (): Promise<TaskStatistics> => {
    try {
      const response = await reportsApi.getTaskStatistics();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch task statistics');
      throw error;
    }
  },

  // Get performance report
  getPerformanceReport: async (): Promise<PerformanceReport> => {
    try {
      const response = await reportsApi.getPerformanceReport();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch performance report');
      throw error;
    }
  }
};