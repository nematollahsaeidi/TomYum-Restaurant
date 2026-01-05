"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Utensils, Package, CreditCard, BatteryCharging, Clock } from "lucide-react";
import { taskService } from "@/lib/task-service";
import { toast } from "sonner";

interface TaskFormData {
  type: "ordering" | "delivery" | "collection" | "payment" | "charging";
  table: string;
  priority: "high" | "medium" | "low";
  notes: string;
  immediate: boolean;
  estimatedTime?: string;
}

const getTaskIcon = (type: string) => {
  switch (type) {
    case "delivery": return <Utensils className="h-4 w-4" />;
    case "collection": return <Package className="h-4 w-4" />;
    case "ordering": return <Utensils className="h-4 w-4" />;
    case "payment": return <CreditCard className="h-4 w-4" />;
    case "charging": return <BatteryCharging className="h-4 w-4" />;
    default: return <Utensils className="h-4 w-4" />;
  }
};

export function TaskForm() {
  const [formData, setFormData] = useState<TaskFormData>({
    type: "ordering",
    table: "",
    priority: "medium",
    notes: "",
    immediate: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await taskService.createTask({
        type: formData.type,
        table: formData.table,
        priority: formData.priority
      });
      
      toast.success(`New ${formData.type} task created for ${formData.table || 'selected table'}`);
      
      // Reset form
      setFormData({
        type: "ordering",
        table: "",
        priority: "medium",
        notes: "",
        immediate: false,
      });
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleChange = (field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
        <CardDescription>Add a new task to the robot queue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Task Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: any) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordering">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2" /> Ordering
                    </div>
                  </SelectItem>
                  <SelectItem value="delivery">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2" /> Food Delivery
                    </div>
                  </SelectItem>
                  <SelectItem value="collection">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2" /> Dish Collection
                    </div>
                  </SelectItem>
                  <SelectItem value="payment">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" /> Payment
                    </div>
                  </SelectItem>
                  <SelectItem value="charging">
                    <div className="flex items-center">
                      <BatteryCharging className="h-4 w-4 mr-2" /> Charging
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="table">Table Number</Label>
              <Input 
                id="table" 
                placeholder="e.g., Table 5" 
                value={formData.table} 
                onChange={(e) => handleChange("table", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: any) => handleChange("priority", value)}
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
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (optional)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="estimatedTime" 
                  placeholder="e.g., 10 min" 
                  className="pl-10" 
                  value={formData.estimatedTime || ""} 
                  onChange={(e) => handleChange("estimatedTime", e.target.value)} 
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Any special instructions for this task..." 
              value={formData.notes} 
              onChange={(e) => handleChange("notes", e.target.value)} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="immediate" 
                checked={formData.immediate} 
                onCheckedChange={(checked) => handleChange("immediate", checked)} 
              />
              <Label htmlFor="immediate">Execute Immediately</Label>
            </div>
            <Button type="submit" className="flex items-center">
              {getTaskIcon(formData.type)}
              <span className="ml-2">Create Task</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}