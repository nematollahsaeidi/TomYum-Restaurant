"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils, BatteryCharging, Bot, Play, Pause } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

interface Robot {
  id: number;
  name: string;
  status: "idle" | "delivering" | "collecting" | "charging" | "error";
  battery: number;
  position: { x: number; y: number };
  target?: { x: number; y: number };
  currentTask?: string;
}

interface Table {
  id: number;
  name: string;
  position: { x: number; y: number };
  chairs: { id: number; position: { x: number; y: number } }[];
}

interface ChargingStation {
  id: number;
  name: string;
  position: { x: number; y: number };
  status: "available" | "occupied";
  robotId?: number;
}

interface Kitchen {
  id: number;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const MapPage = () => {
  const [isSystemRunning, setIsSystemRunning] = useState(true);
  const [robots, setRobots] = useState<Robot[]>([
    { id: 1, name: "Robot Alpha", status: "delivering", battery: 85, position: { x: 300, y: 200 }, target: { x: 400, y: 150 }, currentTask: "Delivering to Table 2" },
    { id: 2, name: "Robot Beta", status: "idle", battery: 92, position: { x: 150, y: 400 }, currentTask: "Idle" },
    { id: 3, name: "Robot Gamma", status: "charging", battery: 30, position: { x: 600, y: 450 }, currentTask: "Charging" },
    { id: 4, name: "Robot Delta", status: "collecting", battery: 67, position: { x: 500, y: 100 }, target: { x: 200, y: 300 }, currentTask: "Collecting from Table 4" },
  ]);

  const [tables] = useState<Table[]>([
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
  ]);

  const [chargingStations] = useState<ChargingStation[]>([
    { id: 1, name: "Charging Station 1", position: { x: 600, y: 450 }, status: "occupied", robotId: 3 },
    { id: 2, name: "Charging Station 2", position: { x: 650, y: 450 }, status: "available" }
  ]);

  const [kitchen] = useState<Kitchen>({
    id: 1,
    name: "Kitchen",
    position: { x: 50, y: 50 },
    size: { width: 120, height: 120 }
  });

  // Simulate robot movement
  useEffect(() => {
    if (!isSystemRunning) return;

    const interval = setInterval(() => {
      setRobots(prevRobots => 
        prevRobots.map(robot => {
          if (robot.status === "delivering" || robot.status === "collecting") {
            // Move robot towards target
            if (robot.target) {
              const dx = robot.target.x - robot.position.x;
              const dy = robot.target.y - robot.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 5) {
                // Move towards target
                return {
                  ...robot,
                  position: {
                    x: robot.position.x + (dx / distance) * 2,
                    y: robot.position.y + (dy / distance) * 2
                  }
                };
              }
            }
          }
          return robot;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isSystemRunning]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivering": return "bg-blue-500";
      case "idle": return "bg-green-500";
      case "charging": return "bg-yellow-500";
      case "collecting": return "bg-purple-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivering": return "Delivering";
      case "idle": return "Idle";
      case "charging": return "Charging";
      case "collecting": return "Collecting";
      case "error": return "Error";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restaurant Map</h1>
            <p className="text-gray-600 mt-2">Real-time view of restaurant layout and robot positions</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" /> Restaurant Layout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  {/* Kitchen */}
                  <div 
                    className="absolute bg-orange-200 border-2 border-orange-400 flex items-center justify-center"
                    style={{
                      left: `${kitchen.position.x}px`,
                      top: `${kitchen.position.y}px`,
                      width: `${kitchen.size.width}px`,
                      height: `${kitchen.size.height}px`
                    }}
                  >
                    <div className="text-center">
                      <Utensils className="mx-auto h-8 w-8 text-orange-600" />
                      <span className="font-bold text-orange-800">{kitchen.name}</span>
                    </div>
                  </div>

                  {/* Tables */}
                  {tables.map(table => (
                    <div key={table.id}>
                      {/* Table */}
                      <div 
                        className="absolute bg-amber-100 border-2 border-amber-300 rounded flex items-center justify-center"
                        style={{
                          left: `${table.position.x - 30}px`,
                          top: `${table.position.y - 20}px`,
                          width: '60px',
                          height: '40px'
                        }}
                      >
                        <span className="font-bold text-amber-800 text-sm">{table.name}</span>
                      </div>
                      
                      {/* Chairs */}
                      {table.chairs.map(chair => (
                        <div 
                          key={chair.id}
                          className="absolute bg-gray-300 border border-gray-400 rounded-full"
                          style={{
                            left: `${chair.position.x - 10}px`,
                            top: `${chair.position.y - 10}px`,
                            width: '20px',
                            height: '20px'
                          }}
                        >
                          <span className="text-xs text-gray-700 absolute -top-5 left-1/2 transform -translate-x-1/2">
                            C{chair.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Charging Stations */}
                  {chargingStations.map(station => (
                    <div 
                      key={station.id}
                      className={`absolute border-2 rounded flex items-center justify-center ${
                        station.status === "available" 
                          ? "bg-green-100 border-green-400" 
                          : "bg-yellow-100 border-yellow-400"
                      }`}
                      style={{
                        left: `${station.position.x - 35}px`,
                        top: `${station.position.y - 25}px`,
                        width: '70px',
                        height: '50px'
                      }}
                    >
                      <div className="text-center">
                        <BatteryCharging className="mx-auto h-5 w-5 text-gray-700" />
                        <span className="font-bold text-gray-800 text-xs">{station.name}</span>
                        {station.robotId && (
                          <div className="text-xs text-gray-600">R{station.robotId}</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Robots */}
                  {robots.map(robot => (
                    <div key={robot.id}>
                      <div 
                        className={`absolute rounded-full flex items-center justify-center border-2 ${getStatusColor(robot.status)} border-white shadow-lg`}
                        style={{
                          left: `${robot.position.x - 15}px`,
                          top: `${robot.position.y - 15}px`,
                          width: '30px',
                          height: '30px'
                        }}
                      >
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div 
                        className="absolute text-xs font-bold bg-white px-1 rounded whitespace-nowrap"
                        style={{
                          left: `${robot.position.x + 20}px`,
                          top: `${robot.position.y - 10}px`
                        }}
                      >
                        {robot.name}
                      </div>
                    </div>
                  ))}

                  {/* Robot paths (for visualization) */}
                  {robots.map(robot => {
                    if (robot.target && (robot.status === "delivering" || robot.status === "collecting")) {
                      return (
                        <svg 
                          key={`path-${robot.id}`} 
                          className="absolute top-0 left-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 10 }}
                        >
                          <line 
                            x1={robot.position.x} 
                            y1={robot.position.y} 
                            x2={robot.target.x} 
                            y2={robot.target.y} 
                            stroke="#94a3b8" 
                            strokeWidth="2" 
                            strokeDasharray="5,5"
                          />
                        </svg>
                      );
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Robot Status Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5" /> Robot Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {robots.map(robot => (
                    <div key={robot.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(robot.status)}`}></div>
                        <div>
                          <h3 className="font-medium">{robot.name}</h3>
                          <p className="text-sm text-gray-500">{robot.currentTask}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{robot.battery}%</div>
                        <div className="text-xs text-gray-500">Battery</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Map Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-200 border border-amber-400 mr-2"></div>
                    <span className="text-sm">Tables</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 border border-gray-400 rounded-full mr-2"></div>
                    <span className="text-sm">Chairs (C1, C2, etc.)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-200 border border-orange-400 mr-2"></div>
                    <span className="text-sm">Kitchen</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-400 mr-2"></div>
                    <span className="text-sm">Charging Station</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Robots</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Active Robots</span>
                    <Badge variant="secondary">4</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Tables</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Charging Stations</span>
                    <Badge variant="secondary">2</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>System Status</span>
                    <Badge variant={isSystemRunning ? "default" : "destructive"}>
                      {isSystemRunning ? "Running" : "Paused"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default MapPage;