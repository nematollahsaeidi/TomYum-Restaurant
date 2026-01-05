"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings, BarChart3 } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { TaskQueue } from "@/components/task-queue";
import { RobotMonitor } from "@/components/robot-monitor";
import { TaskForm } from "@/components/task-form";
import { SystemStatus } from "@/components/system-status";
import { reportingService } from "@/lib/reporting-service";
import { robotService } from "@/lib/robot-service";
import { taskService } from "@/lib/task-service";
import { queueService } from "@/lib/queue-service";

export default function Dashboard() {
  const [isSystemRunning, setIsSystemRunning] = useState(true);
  const [activeRobots, setActiveRobots] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [systemHealth, setSystemHealth] = useState(0);
  const [avgBattery, setAvgBattery] = useState(0);

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        // Get daily report for system stats
        const report = await reportingService.getDailyReport();
        setPendingTasks(report.total_tasks);
        setSystemHealth(report.system_health || 98);
        
        // Get robots for battery level
        const robots = await robotService.getAllRobots();
        setActiveRobots(robots.length);
        
        const totalBattery = robots.reduce((sum, robot) => sum + robot.battery_level, 0);
        setAvgBattery(robots.length ? Math.round(totalBattery / robots.length) : 0);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tom Yum Robot Control Center</h1>
            <p className="text-gray-600 mt-2">Manage autonomous delivery robots for restaurant operations</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button 
              onClick={() => setIsSystemRunning(!isSystemRunning)} 
              className={isSystemRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {isSystemRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause System
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start System
                </>
              )}
            </Button>
            <Button variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Queue
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </div>
        </div>
        
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{activeRobots}</h3>
                <p className="text-gray-500">Active Robots</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{pendingTasks}</h3>
                <p className="text-gray-500">Pending Tasks</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{systemHealth}%</h3>
                <p className="text-gray-500">System Health</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${isSystemRunning ? "bg-green-100" : "bg-red-100"}`}>
                <div className={`h-2 w-2 rounded-full ${isSystemRunning ? "bg-green-500" : "bg-red-500"}`}></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{isSystemRunning ? "Running" : "Paused"}</h3>
                <p className="text-gray-500">System Status</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TaskQueue />
            <TaskForm />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <RobotMonitor />
            <SystemStatus />
          </div>
        </div>
        
        <MadeWithDyad />
      </div>
    </div>
  );
}