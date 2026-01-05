"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, PieChart, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { reportingService } from "@/lib/reporting-service";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Mock data for charts (in a real app, this would come from the API)
const taskCompletionData = [
  { day: "Mon", completed: 24, pending: 6 },
  { day: "Tue", completed: 32, pending: 4 },
  { day: "Wed", completed: 28, pending: 8 },
  { day: "Thu", completed: 35, pending: 3 },
  { day: "Fri", completed: 42, pending: 5 },
  { day: "Sat", completed: 38, pending: 9 },
  { day: "Sun", completed: 30, pending: 7 },
];

const taskTypeData = [
  { type: "Delivery", count: 45, percentage: 45 },
  { type: "Collection", count: 25, percentage: 25 },
  { type: "Ordering", count: 20, percentage: 20 },
  { type: "Payment", count: 10, percentage: 10 },
];

export default function AnalyticsPage() {
  const [reportData, setReportData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    avgCompletionTime: "0 min",
    activeRobots: 0,
    systemHealth: 0
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const dailyReport = await reportingService.getDailyReport();
      const taskStats = await reportingService.getTaskStatistics();
      const perfReport = await reportingService.getPerformanceReport();
      
      const totalTasks = dailyReport.total_tasks;
      const completedTasks = dailyReport.completed_tasks;
      const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      setReportData({
        totalTasks,
        completedTasks,
        completionRate,
        avgCompletionTime: dailyReport.avg_completion_time,
        activeRobots: parseInt(dailyReport.robot_utilization) || 0,
        systemHealth: perfReport.system_health
      });
    } catch (error) {
      toast.error("Failed to load analytics data");
      console.error("Error fetching report data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Performance metrics and insights</p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalTasks}</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.completionRate}%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.avgCompletionTime}</div>
              <p className="text-xs text-muted-foreground">-1.3 min from target</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Robots</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.activeRobots}</div>
              <p className="text-xs text-muted-foreground">All operational</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Task Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between pt-4">
                {taskCompletionData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 px-1">
                    <div className="flex items-end justify-center h-40 w-full">
                      <div 
                        className="w-3/4 bg-green-500 rounded-t mr-1" 
                        style={{ height: `${(day.completed / 50) * 100}%` }}
                      ></div>
                      <div 
                        className="w-3/4 bg-yellow-500 rounded-t" 
                        style={{ height: `${(day.pending / 50) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-2 text-gray-500">{day.day}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                  <span className="text-xs">Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <PieChart className="h-32 w-32 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {taskTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded mr-2 ${
                        index === 0 ? "bg-blue-500" : 
                        index === 1 ? "bg-purple-500" : 
                        index === 2 ? "bg-green-500" : "bg-yellow-500"
                      }`}></div>
                      <span>{item.type}</span>
                    </div>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Task Status Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Task Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">187</div>
                    <div className="text-gray-500">Completed Today</div>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-gray-500">In Progress</div>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">7</div>
                    <div className="text-gray-500">Delayed</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <MadeWithDyad />
      </div>
    </div>
  );
}