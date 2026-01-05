"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, RotateCcw, Bell, Wifi, Battery, MapPin } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: "Tom Yum Thai Restaurant",
    maxRobots: 6,
    defaultPriority: "medium",
    notifications: true,
    autoCharging: true,
    batteryThreshold: 30,
    wifiNetwork: "RestaurantNetwork",
    wifiPassword: "securePassword123",
    deliveryInstructions: "Please deliver to the table and announce arrival with a beep.",
    collectionInstructions: "Collect all dishes and utensils from the table.",
  });

  const handleSave = () => {
    // In a real implementation, we would save to the backend
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    // In a real implementation, we would reset to defaults from the backend
    toast.info("Settings reset to defaults");
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure robot behavior and system preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" /> General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input 
                    id="restaurantName" 
                    value={settings.restaurantName} 
                    onChange={(e) => handleChange("restaurantName", e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxRobots">Maximum Robots</Label>
                    <Select 
                      value={settings.maxRobots.toString()} 
                      onValueChange={(value) => handleChange("maxRobots", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Robots</SelectItem>
                        <SelectItem value="5">5 Robots</SelectItem>
                        <SelectItem value="6">6 Robots</SelectItem>
                        <SelectItem value="7">7 Robots</SelectItem>
                        <SelectItem value="8">8 Robots</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultPriority">Default Task Priority</Label>
                    <Select 
                      value={settings.defaultPriority} 
                      onValueChange={(value) => handleChange("defaultPriority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Robot Behavior */}
            <Card>
              <CardHeader>
                <CardTitle>Robot Behavior</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Charging</Label>
                    <p className="text-sm text-gray-500">Enable automatic charging when battery is low</p>
                  </div>
                  <Switch 
                    checked={settings.autoCharging} 
                    onCheckedChange={(checked) => handleChange("autoCharging", checked)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batteryThreshold">Battery Threshold (%)</Label>
                  <Input 
                    id="batteryThreshold" 
                    type="number" 
                    min="10" 
                    max="50" 
                    value={settings.batteryThreshold} 
                    onChange={(e) => handleChange("batteryThreshold", parseInt(e.target.value) || 30)} 
                  />
                  <p className="text-sm text-gray-500">Robots will automatically charge when battery drops below this level</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                  <Textarea 
                    id="deliveryInstructions" 
                    value={settings.deliveryInstructions} 
                    onChange={(e) => handleChange("deliveryInstructions", e.target.value)} 
                    rows={3} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionInstructions">Collection Instructions</Label>
                  <Textarea 
                    id="collectionInstructions" 
                    value={settings.collectionInstructions} 
                    onChange={(e) => handleChange("collectionInstructions", e.target.value)} 
                    rows={3} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Network Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="mr-2 h-5 w-5" /> Network Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wifiNetwork">WiFi Network Name</Label>
                  <Input 
                    id="wifiNetwork" 
                    value={settings.wifiNetwork} 
                    onChange={(e) => handleChange("wifiNetwork", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wifiPassword">WiFi Password</Label>
                  <Input 
                    id="wifiPassword" 
                    type="password" 
                    value={settings.wifiPassword} 
                    onChange={(e) => handleChange("wifiPassword", e.target.value)} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save Settings
                </Button>
                <Button variant="outline" className="w-full" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch 
                    checked={settings.notifications} 
                    onCheckedChange={(checked) => handleChange("notifications", checked)} 
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Receive alerts for system events and maintenance needs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" /> Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium">Restaurant Address</div>
                    <div className="text-sm text-gray-600 mt-1">
                      123 Thai Street<br /> Bangkok, Thailand 10110
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Update Location</Button>
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