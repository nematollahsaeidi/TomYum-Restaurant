"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Utensils, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { initialMenuItems, MenuItem } from "@/lib/menu-data";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    subcategory: "",
    popular: false,
    vegetarian: false
  });

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSave = () => {
    if (editingItem) {
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    const newItemWithId: MenuItem = {
      ...newItem,
      id: Math.max(0, ...menuItems.map(item => item.id)) + 1
    };
    setMenuItems([...menuItems, newItemWithId]);
    setNewItem({
      name: "",
      description: "",
      price: 0,
      category: "",
      subcategory: "",
      popular: false,
      vegetarian: false
    });
  };

  const handleInputChange = (field: keyof MenuItem, value: string | number | boolean) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  const handleNewInputChange = (field: keyof Omit<MenuItem, 'id'>, value: string | number | boolean) => {
    setNewItem({ ...newItem, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-2">Manage restaurant menu items for robot ordering system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5" />
                    Menu Items
                  </div>
                  <span className="text-sm font-normal text-gray-500">
                    {menuItems.length} items
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      {editingItem && editingItem.id === item.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${item.id}`}>Name</Label>
                              <Input
                                id={`name-${item.id}`}
                                value={editingItem.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`price-${item.id}`}>Price ($)</Label>
                              <Input
                                id={`price-${item.id}`}
                                type="number"
                                step="0.01"
                                value={editingItem.price}
                                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`description-${item.id}`}>Description</Label>
                            <Textarea
                              id={`description-${item.id}`}
                              value={editingItem.description}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`category-${item.id}`}>Category</Label>
                              <Input
                                id={`category-${item.id}`}
                                value={editingItem.category}
                                onChange={(e) => handleInputChange("category", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`subcategory-${item.id}`}>Subcategory</Label>
                              <Input
                                id={`subcategory-${item.id}`}
                                value={editingItem.subcategory}
                                onChange={(e) => handleInputChange("subcategory", e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`popular-${item.id}`}
                                checked={editingItem.popular}
                                onChange={(e) => handleInputChange("popular", e.target.checked)}
                                className="h-4 w-4"
                              />
                              <Label htmlFor={`popular-${item.id}`}>Popular Item</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`vegetarian-${item.id}`}
                                checked={editingItem.vegetarian}
                                onChange={(e) => handleInputChange("vegetarian", e.target.checked)}
                                className="h-4 w-4"
                              />
                              <Label htmlFor={`vegetarian-${item.id}`}>Vegetarian</Label>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={handleCancel}>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button onClick={handleSave}>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{item.name}</h3>
                              {item.popular && (
                                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                  Popular
                                </span>
                              )}
                              {item.vegetarian && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Veg
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            <div className="flex items-center mt-2">
                              <span className="font-medium">${item.price.toFixed(2)}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{item.category}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{item.subcategory}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
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
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Name</Label>
                  <Input
                    id="new-name"
                    value={newItem.name}
                    onChange={(e) => handleNewInputChange("name", e.target.value)}
                    placeholder="e.g., Tom Yum Soup"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    value={newItem.description}
                    onChange={(e) => handleNewInputChange("description", e.target.value)}
                    placeholder="Describe the item..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-price">Price ($)</Label>
                    <Input
                      id="new-price"
                      type="number"
                      step="0.01"
                      value={newItem.price || ""}
                      onChange={(e) => handleNewInputChange("price", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-category">Category</Label>
                    <Input
                      id="new-category"
                      value={newItem.category}
                      onChange={(e) => handleNewInputChange("category", e.target.value)}
                      placeholder="e.g., Soups"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-subcategory">Subcategory</Label>
                    <Input
                      id="new-subcategory"
                      value={newItem.subcategory}
                      onChange={(e) => handleNewInputChange("subcategory", e.target.value)}
                      placeholder="e.g., Spicy"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="new-popular"
                      checked={newItem.popular}
                      onChange={(e) => handleNewInputChange("popular", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="new-popular">Popular Item</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="new-vegetarian"
                    checked={newItem.vegetarian}
                    onChange={(e) => handleNewInputChange("vegetarian", e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="new-vegetarian">Vegetarian</Label>
                </div>
                <Button className="w-full" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Menu Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(menuItems.map(item => item.category))).map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span>{category}</span>
                      <span className="text-sm text-gray-500">
                        {menuItems.filter(item => item.category === category).length} items
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Menu Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Menu Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Items</span>
                    <span className="font-medium">{menuItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Popular Items</span>
                    <span className="font-medium">
                      {menuItems.filter(item => item.popular).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vegetarian Items</span>
                    <span className="font-medium">
                      {menuItems.filter(item => item.vegetarian).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories</span>
                    <span className="font-medium">
                      {new Set(menuItems.map(item => item.category)).size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Price</span>
                    <span className="font-medium">
                      ${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length || 0).toFixed(2)}
                    </span>
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