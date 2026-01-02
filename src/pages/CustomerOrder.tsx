"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Minus, 
  ShoppingCart,
  Utensils,
  GlassWater,
  Wine,
  Carrot,
  Beef,
  Candy,
  Leaf
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

// Mock menu data
const menuItems = [
  // Main Courses
  { id: 1, name: "Pad Thai", category: "main", subcategory: "noodles", price: 14.99, popular: true, vegetarian: false },
  { id: 2, name: "Green Curry", category: "main", subcategory: "curries", price: 13.99, popular: false, vegetarian: false },
  { id: 3, name: "Massaman Curry", category: "main", subcategory: "curries", price: 14.99, popular: true, vegetarian: false },
  { id: 4, name: "Vegetable Stir Fry", category: "main", subcategory: "vegetables", price: 12.99, popular: false, vegetarian: true },
  
  // Desserts
  { id: 5, name: "Mango Sticky Rice", category: "dessert", subcategory: "traditional", price: 6.99, popular: true, vegetarian: true },
  { id: 6, name: "Coconut Ice Cream", category: "dessert", subcategory: "ice-cream", price: 5.99, popular: false, vegetarian: true },
  
  // Alcoholic Drinks
  { id: 7, name: "Thai Beer", category: "alcoholic", subcategory: "beer", price: 4.99, popular: true, vegetarian: true },
  { id: 8, name: "Singha Beer", category: "alcoholic", subcategory: "beer", price: 5.99, popular: false, vegetarian: true },
  { id: 9, name: "Chang Beer", category: "alcoholic", subcategory: "beer", price: 5.49, popular: false, vegetarian: true },
  
  // Non-Alcoholic Drinks
  { id: 10, name: "Thai Iced Tea", category: "non-alcoholic", subcategory: "tea", price: 3.99, popular: true, vegetarian: true },
  { id: 11, name: "Coconut Water", category: "non-alcoholic", subcategory: "juice", price: 4.99, popular: false, vegetarian: true },
  { id: 12, name: "Lemonade", category: "non-alcoholic", subcategory: "juice", price: 3.49, popular: false, vegetarian: true },
  
  // Vegetarian Options
  { id: 13, name: "Tofu Satay", category: "vegetarian", subcategory: "appetizers", price: 8.99, popular: true, vegetarian: true },
  { id: 14, name: "Vegetable Spring Rolls", category: "vegetarian", subcategory: "appetizers", price: 7.99, popular: false, vegetarian: true },
  
  // Non-Vegetarian Options
  { id: 15, name: "Chicken Satay", category: "non-vegetarian", subcategory: "appetizers", price: 9.99, popular: true, vegetarian: false },
  { id: 16, name: "Fish Cakes", category: "non-vegetarian", subcategory: "appetizers", price: 8.99, popular: false, vegetarian: false },
];

// Categories with icons
const categories = [
  { id: "all", name: "All Items", icon: Utensils },
  { id: "main", name: "Main Course", icon: Utensils },
  { id: "dessert", name: "Dessert", icon: Candy },
  { id: "alcoholic", name: "Alcoholic", icon: Wine },
  { id: "non-alcoholic", name: "Non-Alcoholic", icon: GlassWater },
  { id: "vegetarian", name: "Vegetarian", icon: Leaf },
  { id: "non-vegetarian", name: "Non-Vegetarian", icon: Beef },
  { id: "vegetables", name: "Vegetables", icon: Carrot },
];

export default function CustomerOrder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<{id: number, name: string, price: number, quantity: number}[]>([]);
  const [tableNumber, setTableNumber] = useState("5");

  // Filter items based on search and category
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add item to cart
  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart(prevCart => {
      return prevCart.reduce((acc, cartItem) => {
        if (cartItem.id === id) {
          if (cartItem.quantity > 1) {
            return [...acc, { ...cartItem, quantity: cartItem.quantity - 1 }];
          }
          return acc; // Remove item if quantity is 1
        }
        return [...acc, cartItem];
      }, [] as typeof cart);
    });
  };

  // Calculate total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Submit order
  const submitOrder = () => {
    if (cart.length === 0) return;
    
    alert(`Order submitted for Table ${tableNumber}!\nTotal items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\nTotal: $${cartTotal.toFixed(2)}`);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tom Yum Thai Restaurant</h1>
          <p className="text-gray-600 mt-2">Table {tableNumber} - Order with Robot Assistant</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
            <p className="text-blue-800 font-medium">Robot is ready to take your order!</p>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="flex items-center"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <IconComponent className="h-4 w-4 mr-1" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span>{item.name}</span>
                  <Badge variant={item.popular ? "default" : "secondary"} className="text-xs">
                    ${item.price.toFixed(2)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {item.vegetarian && (
                      <Badge variant="outline" className="text-xs" title="Vegetarian">
                        <Leaf className="h-3 w-3 mr-1" /> Veg
                      </Badge>
                    )}
                    {item.popular && (
                      <Badge className="text-xs" title="Popular item">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(item)}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Your Order
              </span>
              <Badge variant="secondary">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          onClick={() => addToCart(menuItems.find(i => i.id === item.id)!)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={submitOrder}
                    disabled={cart.length === 0}
                  >
                    Submit Order to Kitchen
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea 
              placeholder="Any special requests or dietary restrictions?"
              className="w-full p-3 border rounded-lg min-h-[100px]"
            />
          </CardContent>
        </Card>

        <MadeWithDyad />
      </div>
    </div>
  );
}