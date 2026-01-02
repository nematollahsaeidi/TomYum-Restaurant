"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils, BatteryCharging, Bot, Play, Pause } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useRestaurant } from "@/lib/restaurant-context";

const MapPage = () => {
  const {
    robots,
    tables,
    chargingStations,
    kitchen,
    lobby1,
    lobby2,
    corridor,
    isSystemRunning,
    setSystemRunning,
    updateRobot
  } = useRestaurant();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivering":
        return "bg-blue-500";
      case "idle":
        return "bg-green-500";
      case "charging":
        return "bg-yellow-500";
      case "collecting":
        return "bg-purple-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivering":
        return "Delivering";
      case "idle":
        return "Idle";
      case "charging":
        return "Charging";
      case "collecting":
        return "Collecting";
      case "error":
        return "Error";
      default:
        return "Unknown";
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
              onClick={() => setSystemRunning(!isSystemRunning)} 
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
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '700px' }}>
                  {/* Lobby 1 */}
                  <div 
                    className="absolute bg-amber-50 border-2 border-amber-200 flex items-center justify-center"
                    style={{ 
                      left: `${lobby1.position.x}px`, 
                      top: `${lobby1.position.y}px`, 
                      width: `${lobby1.size.width}px`, 
                      height: `${lobby1.size.height}px` 
                    }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-amber-800 text-sm">{lobby1.name}</span>
                    </div>
                  </div>
                  
                  {/* Lobby 2 */}
                  <div 
                    className="absolute bg-amber-50 border-2 border-amber-200 flex items-center justify-center"
                    style={{ 
                      left: `${lobby2.position.x}px`, 
                      top: `${lobby2.position.y}px`, 
                      width: `${lobby2.size.width}px`, 
                      height: `${lobby2.size.height}px` 
                    }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-amber-800 text-sm">{lobby2.name}</span>
                    </div>
                  </div>
                  
                  {/* Corridor */}
                  <div 
                    className="absolute bg-gray-200 border-2 border-gray-300 flex items-center justify-center"
                    style={{ 
                      left: `${corridor.position.x}px`, 
                      top: `${corridor.position.y}px`, 
                      width: `${corridor.size.width}px`, 
                      height: `${corridor.size.height}px` 
                    }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-gray-700 text-sm">{corridor.name}</span>
                    </div>
                  </div>
                  
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
                      <Utensils className="mx-auto h-6 w-6 text-orange-600" />
                      <span className="font-bold text-orange-800 text-xs">{kitchen.name}</span>
                    </div>
                  </div>
                  
                  {/* Tables */}
                  {tables.map(table => (
                    <div key={table.id}>
                      {/* Table */}
                      <div 
                        className="absolute bg-amber-100 border-2 border-amber-300 rounded flex items-center justify-center"
                        style={{ 
                          left: `${table.position.x - 40}px`, 
                          top: `${table.position.y - 25}px`, 
                          width: '80px', 
                          height: '50px' 
                        }}
                      >
                        <span className="font-bold text-amber-800 text-xs">{table.name}</span>
                      </div>
                      {/* Chairs */}
                      {table.chairs.map(chair => (
                        <div 
                          key={chair.id} 
                          className="absolute bg-gray-300 border border-gray-400 rounded-full"
                          style={{ 
                            left: `${chair.position.x - 12}px`, 
                            top: `${chair.position.y - 12}px`, 
                            width: '24px', 
                            height: '24px' 
                          }}
                        >
                          <span className="text-[10px] text-gray-700 absolute -top-4 left-1/2 transform -translate-x-1/2">
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
                        left: `${station.position.x - 45}px`, 
                        top: `${station.position.y - 30}px`, 
                        width: '90px', 
                        height: '60px' 
                      }}
                    >
                      <div className="text-center">
                        <BatteryCharging className="mx-auto h-5 w-5 text-gray-700" />
                        <span className="font-bold text-gray-800 text-xs">{station.name}</span>
                        {station.robotId && (
                          <div className="text-[10px] text-gray-600">R{station.robotId}</div>
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
                          left: `${robot.position.x - 18}px`, 
                          top: `${robot.position.y - 18}px`, 
                          width: '36px', 
                          height: '36px' 
                        }}
                      >
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute text-[10px] font-bold bg-white px-1 rounded whitespace-nowrap" 
                        style={{ 
                          left: `${robot.position.x + 25}px`, 
                          top: `${robot.position.y - 12}px` 
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
                          <h3 className="font-medium text-sm">{robot.name}</h3>
                          <p className="text-xs text-gray-500">
                            {robot.currentTaskId 
                              ? `Task #${robot.currentTaskId}` 
                              : "Idle"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{robot.battery}%</div>
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
                <CardTitle className="text-sm">Map Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-200 border border-amber-400 mr-2"></div>
                    <span className="text-xs">Lobbies</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-300 mr-2"></div>
                    <span className="text-xs">Corridor</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-100 border border-amber-300 mr-2"></div>
                    <span className="text-xs">Tables</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 border border-gray-400 rounded-full mr-2"></div>
                    <span className="text-xs">Chairs (C1, C2, etc.)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-200 border border-orange-400 mr-2"></div>
                    <span className="text-xs">Kitchen</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-400 mr-2"></div>
                    <span className="text-xs">Charging Station</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-xs">Robots</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Robots</span>
                    <Badge variant="secondary" className="text-xs">{robots.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tables</span>
                    <Badge variant="secondary" className="text-xs">{tables.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Charging Stations</span>
                    <Badge variant="secondary" className="text-xs">{chargingStations.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">System Status</span>
                    <Badge variant={isSystemRunning ? "default" : "destructive"} className="text-xs">
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