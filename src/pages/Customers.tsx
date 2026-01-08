"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Search, Plus, Edit, Trash2, Phone, Mail, Calendar, Star } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { customerService, Customer } from "@/lib/customer-service";
import { toast } from "sonner";
import { externalApiService } from "@/lib/external-api-service";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'totalVisits' | 'totalSpent' | 'favoriteItems' | 'lastVisit' | 'membership'>>({ name: "", email: "", phone: "" });

  useEffect(() => {
    // Initialize with some mock customers
    const mockCustomers: Customer[] = [
      {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        phone: "(555) 123-4567",
        totalVisits: 5,
        totalSpent: 250.50,
        favoriteItems: ["Pad Thai", "Tom Yum Soup"],
        lastVisit: "2024-06-15",
        membership: "regular"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "(555) 234-5678",
        totalVisits: 12,
        totalSpent: 680.75,
        favoriteItems: ["Green Curry", "Mango Sticky Rice"],
        lastVisit: "2024-06-20",
        membership: "premium"
      },
      {
        id: 3,
        name: "Michael Chen",
        email: "michael@example.com",
        phone: "(555) 345-6789",
        totalVisits: 8,
        totalSpent: 420.30,
        favoriteItems: ["Massaman Curry", "Thai Iced Tea"],
        lastVisit: "2024-06-18",
        membership: "vip"
      }
    ];
    setCustomers(mockCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Add customer to local storage
      const newCustomerWithDefaults: Customer = {
        ...newCustomer,
        id: Math.max(0, ...customers.map(c => c.id)) + 1,
        totalVisits: 0,
        totalSpent: 0,
        favoriteItems: [],
        lastVisit: new Date().toISOString().split('T')[0],
        membership: 'regular'
      };

      // Send customer data to external API (with all required fields)
      await externalApiService.createCustomer(newCustomerWithDefaults);

      // Update local state
      setCustomers([...customers, newCustomerWithDefaults]);
      setNewCustomer({ name: "", email: "", phone: "" });
      toast.success('Customer added successfully');
    } catch (error) {
      toast.error("Failed to add customer");
    }
  };

  const handleDeleteCustomer = (id: number) => {
    try {
      setCustomers(customers.filter(customer => customer.id !== id));
      toast.success('Customer deleted successfully');
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  const getMembershipColor = (membership: string) => {
    switch (membership) {
      case "vip":
        return "bg-purple-100 text-purple-800";
      case "premium":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-2">Manage customer information and preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Customer List
                  </div>
                  <span className="text-sm font-normal text-gray-500">
                    {customers.length} customers
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{customer.name}</h3>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getMembershipColor(customer.membership)}`}>
                              {customer.membership.charAt(0).toUpperCase() + customer.membership.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            <span className="mr-3">{customer.email}</span>
                            <Phone className="h-4 w-4 mr-1" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center mt-2 text-sm">
                            <span className="mr-4">
                              <span className="font-medium">{customer.totalVisits}</span> visits
                            </span>
                            <span className="mr-4">
                              <span className="font-medium">${customer.totalSpent.toFixed(2)}</span> spent
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Last: {customer.lastVisit}</span>
                            </span>
                          </div>
                          {customer.favoriteItems.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Favorites: </span>
                              <span className="text-sm">
                                {customer.favoriteItems.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>
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
          {/* Add New Customer */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="e.g., john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="e.g., (555) 123-4567"
                  />
                </div>
                <Button className="w-full" onClick={handleAddCustomer}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </CardContent>
            </Card>
            {/* Customer Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold">{customers.length}</div>
                    <div className="text-sm text-gray-600">Total Customers</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {customers.filter(c => c.membership === "vip").length}
                    </div>
                    <div className="text-sm text-gray-600">VIP Members</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold">
                      ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Spend per Customer</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round(customers.reduce((sum, c) => sum + c.totalVisits, 0) / customers.length || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Visits per Customer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Membership Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Regular</span>
                    <span className="text-sm text-gray-500">
                      {customers.filter(c => c.membership === "regular").length} customers
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span>Premium</span>
                    <span className="text-sm text-gray-500">
                      {customers.filter(c => c.membership === "premium").length} customers
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span>VIP</span>
                    <span className="text-sm text-gray-500">
                      {customers.filter(c => c.membership === "vip").length} customers
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
