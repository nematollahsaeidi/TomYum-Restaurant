"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Battery, MapPin, Activity, AlertTriangle } from "lucide-react";
import { robotService } from "@/lib/robot-service";
import { toast } from "sonner";

interface Robot {
  id: string;
  name: string;
  status: "IDLE" | "MOVING" | "CHARGING" | "ERROR" | "COLLECTING";
  battery_level: number;
  current_location: string;
  last_task: string;
  next_task?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "MOVING": return "bg-blue-500";
    case "IDLE": return "bg-green-500";
    case "CHARGING": return "bg-yellow-500";
    case "COLLECTING": return "bg-purple-500";
    case "ERROR": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "MOVING": return "Delivering";
    case "IDLE": return "Idle";
    case "CHARGING": return "Charging";
    case "COLLECTING": return "Collecting";
    case "ERROR": return "Error";
    default: return "Unknown";
  }
};

export function RobotMonitor() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRobots();

    // Refresh robot data every 30 seconds
    const interval = setInterval(fetchRobots, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRobots = async () => {
    try {
      setLoading(true);
      const robotData = await robotService.getAllRobots();
      // Convert backend robot format to frontend format
      const convertedRobots = robotData.map((robot: any) => ({
        ...robot,
        name: `Robot ${robot.id.replace('R', '')}`,
        status: robot.status,
        battery_level: robot.battery_level,
        current_location: robot.current_location,
        last_task: robot.current_task_id ? `Task #${robot.current_task_id}` : "None"
      }));
      setRobots(convertedRobots);
    } catch (error) {
      toast.error("Failed to load robots");
      console.error("Error fetching robots:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Robot Status Monitor</CardTitle>
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
          <span>Robot Status Monitor</span>
          <Badge variant="secondary">{robots.length} robots active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {robots.map((robot) => (
            <div key={robot.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(robot.status)}`}></div>
                <div>
                  <h3 className="font-medium">{robot.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{robot.current_location}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full sm:w-auto sm:mx-4 mb-3 sm:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Battery</span>
                  <span className="text-sm">{robot.battery_level}%</span>
                </div>
                <Progress value={robot.battery_level} className="w-full" />
                {robot.battery_level < 30 && (
                  <div className="flex items-center mt-1 text-xs text-red-500">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Low battery
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="outline" className="capitalize mb-1">
                  {getStatusText(robot.status)}
                </Badge>
                <div className="text-xs text-gray-500 text-right">
                  <div>Last: {robot.last_task}</div>
                  {robot.next_task && <div>Next: {robot.next_task}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <Activity className="h-5 w-5 mx-auto text-blue-500 mb-1" />
            <div className="text-sm font-medium">
              {robots.filter(r => r.status === "MOVING").length}
            </div>
            <div className="text-xs text-gray-500">Delivering</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <Activity className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <div className="text-sm font-medium">
              {robots.filter(r => r.status === "IDLE").length}
            </div>
            <div className="text-xs text-gray-500">Idle</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg text-center">
            <Battery className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
            <div className="text-sm font-medium">
              {robots.filter(r => r.status === "CHARGING").length}
            </div>
            <div className="text-xs text-gray-500">Charging</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <Activity className="h-5 w-5 mx-auto text-purple-500 mb-1" />
            <div className="text-sm font-medium">
              {robots.filter(r => r.status === "COLLECTING").length}
            </div>
            <div className="text-xs text-gray-500">Collecting</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}