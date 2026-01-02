"use client";
import { Home, ListOrdered, Bot, Settings, BarChart3, Users, Utensils, Package, CreditCard, BatteryCharging, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Task Queue", icon: ListOrdered, href: "/tasks" },
  { name: "Robots", icon: Bot, href: "/robots" },
  { name: "Map", icon: Map, href: "/map" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Menu", icon: Utensils, href: "/menu" },
  { name: "Inventory", icon: Package, href: "/inventory" },
  { name: "Payments", icon: CreditCard, href: "/payments" },
  { name: "Charging", icon: BatteryCharging, href: "/charging" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Update active state when location changes
  useEffect(() => {
    // This will automatically update the UI when the route changes
  }, [location]);

  const handleClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="hidden md:block w-20 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-10">
      <div className="flex flex-col items-center py-6 space-y-6">
        <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
          TY
        </div>
        <TooltipProvider>
          <nav className="flex flex-col items-center space-y-4">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="icon"
                      className={`h-12 w-12 rounded-lg ${isActive ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => handleClick(item.href)}
                    >
                      <item.icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>
      </div>
    </div>
  );
}