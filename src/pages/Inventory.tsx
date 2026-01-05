"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, Plus, Edit, Trash2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { inventoryService, InventoryItem } from "@/lib/inventory-service";
import { toast } from "sonner";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id' | 'status'>>({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    minThreshold: 0,
    supplier: "",
    lastRestocked: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    try {
      const inventoryData = inventoryService.getItems();
      setInventory(inventoryData);
    } catch (error) {
      toast.error("Failed to load inventory");
      console.error("Error fetching inventory:", error);
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock": return "bg-green-100 text-green-800";
      case "low-stock": return "bg-yellow-100 text-yellow-800";
      case "out-of-stock": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in-stock": return "In Stock";
      case "low-stock": return "Low Stock";
      case "out-of-stock": return "Out of Stock";
      default: return "In Stock";
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.supplier) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      inventoryService.addItem(newItem);
      setNewItem({
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        minThreshold: 0,
        supplier: "",
        lastRestocked: new Date().toISOString().split('T')[0]
      });
      fetchInventory(); // Refresh the list
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleDeleteItem = (id: number) => {
    try {
      inventoryService.deleteItem(id);
      fetchInventory(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const lowStockItems = inventory.filter(item => item.status === "low-stock").length;
  const outOfStockItems = inventory.filter(item => item.status === "out-of-stock").length;
  const totalItems = inventory.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Track and manage restaurant inventory</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{totalItems}</h3>
                <p className="text-gray-500">Total Items</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{lowStockItems}</h3>
                <p className="text-gray-500">Low Stock Items</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{outOfStockItems}</h3>
                <p className="text-gray-500">Out of Stock</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {Math.round(((totalItems - lowStockItems - outOfStockItems) / totalItems) * 100)}%
                </h3>
                <p className="text-gray-500">In Stock</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5" /> Inventory Items
                  </div>
                  <span className="text-sm font-normal text-gray-500">
                    {filteredInventory.length} items
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search inventory..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-10" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredInventory.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{item.name}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="mr-3">Category: {item.category}</span>
                            <span>Supplier: {item.supplier}</span>
                          </div>
                          <div className="flex items-center mt-2 text-sm">
                            <span className="mr-4">
                              <span className="font-medium">{item.quantity}</span> {item.unit}
                            </span>
                            <span className="mr-4">
                              Min: <span className="font-medium">{item.minThreshold}</span> {item.unit}
                            </span>
                            <span className="text-gray-500">Last restocked: {item.lastRestocked}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Add New Item */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" /> Add New Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input 
                    id="name" 
                    value={newItem.name} 
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                    placeholder="e.g., Shrimp" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      value={newItem.category} 
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})} 
                      placeholder="e.g., Protein" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input 
                      id="supplier" 
                      value={newItem.supplier} 
                      onChange={(e) => setNewItem({...newItem, supplier: e.target.value})} 
                      placeholder="e.g., Ocean Fresh" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      value={newItem.quantity || ""} 
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input 
                      id="unit" 
                      value={newItem.unit} 
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})} 
                      placeholder="e.g., lbs" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Min Threshold</Label>
                    <Input 
                      id="threshold" 
                      type="number" 
                      value={newItem.minThreshold || ""} 
                      onChange={(e) => setNewItem({...newItem, minThreshold: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </CardContent>
            </Card>
            
            {/* Inventory Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(inventory.map(item => item.category))).map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span>{category}</span>
                      <span className="text-sm text-gray-500">
                        {inventory.filter(item => item.category === category).length} items
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" /> Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventory
                    .filter(item => item.status === "low-stock" || item.status === "out-of-stock")
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            item.status === "out-of-stock" ? "text-red-500" : "text-yellow-500"
                          }`}>
                            {item.quantity} {item.unit}
                          </div>
                          <div className="text-xs text-gray-500">Min: {item.minThreshold}</div>
                        </div>
                      </div>
                    ))}
                  {inventory.filter(item => item.status === "low-stock" || item.status === "out-of-stock").length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No low stock items
                    </div>
                  )}
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