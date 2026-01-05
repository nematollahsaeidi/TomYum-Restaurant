import { robotsApi, chargingApi } from './api';
import { toast } from 'sonner';

export interface Robot {
  id: string;
  current_location: string;
  battery_level: number;
  status: 'IDLE' | 'MOVING' | 'CHARGING' | 'ERROR';
  current_task_id: string | null;
  last_active: string;
  created_at: string;
}

export interface RobotCommandData {
  command: string;
}

export interface ManualChargingData {
  robot_id: string;
}

export const robotService = {
  // Send command to robot
  sendRobotCommand: async (robotId: string, commandData: RobotCommandData) => {
    try {
      const response = await robotsApi.sendRobotCommand(robotId, commandData);
      toast.success(`Command sent to robot ${robotId}`);
      return response.data;
    } catch (error) {
      toast.error(`Failed to send command to robot ${robotId}`);
      throw error;
    }
  },

  // Get robot status
  getRobotStatus: async (robotId: string) => {
    try {
      const response = await robotsApi.getRobot(robotId);
      return response.data;
    } catch (error) {
      toast.error(`Failed to get status for robot ${robotId}`);
      throw error;
    }
  },

  // Get all robots
  getAllRobots: async () => {
    try {
      const response = await robotsApi.getRobots();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch robots');
      throw error;
    }
  },

  // Request manual charging
  requestManualCharging: async (robotData: ManualChargingData) => {
    try {
      const response = await chargingApi.requestManualCharging(robotData);
      if (response.data.success) {
        toast.success(`Manual charging requested for robot ${robotData.robot_id}`);
      } else {
        toast.warning(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error('Failed to request manual charging');
      throw error;
    }
  }
};