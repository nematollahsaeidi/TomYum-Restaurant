"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BatteryCharging, Battery, Plug, Zap, Play, Pause } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

interface ChargingStation {
  id: number;
  name: string;
  status: "available" | "charging" | "offline";
  robotId?: number;
  robotName?: string;
  batteryLevel?: number;
  chargingRate?: number;
  timeRemaining?: string;
}

const chargingStations: ChargingStation[] = [
  {
    id: 1,
    name: "Station Alpha",
    status: "charging",
    robotId: 3,
    robotName: "Robot Gamma",
    batteryLevel: 30,
    chargingRate: 85,
    timeRemaining: "12 min"
  },
  {
    id: 2,
    name: "Station Beta",
    status: "available"
  },
  {
    id: 3,
    name: "Station Gamma",
    status: "offline"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "charging":
      return "bg-blue-500";
    case "offline":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Available";
    case "charging":
      return "Charging";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
};

export default function ChargingPage() {
  const [isChargingEnabled, setIsChargingEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Charging Management</h1>
            <p className="text-gray-600 mt-2">Monitor and control robot charging stations</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              onClick={() => setIsChargingEnabled(!isChargingEnabled)}
              className={isChargingEnabled ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {isChargingEnabled ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause Charging
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Enable Charging
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <BatteryCharging className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">2</h3>
                <p className="text-gray-500">Active Stations</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Plug className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">1</h3>
                <p className="text-gray-500">Available Stations</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">85%</h3>
                <p className="text-gray-500">Avg Charging Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Charging Stations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BatteryCharging className="mr-2 h-5 w-5" /> Charging Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chargingStations.map((station) => (
                    <div key={station.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(station.status)}`}></div>
                        <div>
                          <h3 className="font-medium">{station.name}</h3>
                          <p className="text-sm text-gray-500">{getStatusText(station.status)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {station.robotName && (
                          <div className="text-right">
                            <div className="font-medium">{station.robotName}</div>
                            <div className="text-sm text-gray-500">Robot</div>
                          </div>
                        )}
                        <Badge variant="outline" className="capitalize">
                          {station.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Battery Robots */}
            <Card>
              <CardHeader>
                <CardTitle>Low Battery Robots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Battery className="h-5 w-5 text-red-500" />
                      <div>
                        <h3 className="font-medium">Robot Gamma</h3>
                        <p className="text-sm text-gray-500">Table 3</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium text-red-500">28%</div>
                        <div className="text-xs text-gray-500">Battery</div>
                      </div>
                      <Button size="sm">Send to Charge</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Battery className="h-5 w-5 text-orange-500" />
                      <div>
                        <h3 className="font-medium">Robot Delta</h3>
                        <p className="text-sm text-gray-500">Table 7</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium text-orange-500">35%</div>
                        <div className="text-xs text-gray-500">Battery</div>
                      </div>
                      <Button size="sm" variant="outline">Monitor</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charging Details */}
          <div className="space-y-6">
            {/* Active Charging */}
            <Card>
              <CardHeader>
                <CardTitle>Active Charging</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Robot Gamma</h3>
                      <Badge>Charging</Badge>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Battery Level</span>
                        <span>30% → 85%</span>
                      </div>
                      <Progress value={85} className="bg-blue-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Time Remaining</div>
                        <div className="font-medium">12 minutes</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Charging Rate</div>
                        <div className="font-medium">85%/hr</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">Pause Charging</Button>
                    <Button>Complete Early</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charging Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Charging Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Robot Alpha</h3>
                      <p className="text-sm text-gray-500">Scheduled for 18:30</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Robot Beta</h3>
                      <p className="text-sm text-gray-500">Scheduled for 19:15</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Robot Epsilon</h3>
                      <p className="text-sm text-gray-500">Scheduled for 20:00</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charging Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Charging Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                    <div>
                      <h3 className="font-medium">Auto Charging</h3>
                      <p className="text-sm text-gray-500">Robots automatically charge when battery drops below 30%</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <div>
                      <h3 className="font-medium">Priority Charging</h3>
                      <p className="text-sm text-gray-500">Higher priority tasks get charging preference</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mt-2 mr-3"></div>
                    <div>
                      <h3 className="font-medium">Scheduled Charging</h3>
                      <p className="text-sm text-gray-500">Non-urgent charging during low-activity periods</p>
                    </div>
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
}