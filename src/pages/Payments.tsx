"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Search, Filter, Download, Eye, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { paymentService, Payment } from "@/lib/payment-service";
import { toast } from "sonner";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    try {
      const paymentData = paymentService.getPayments();
      setPayments(paymentData);
    } catch (error) {
      toast.error("Failed to load payments");
      console.error("Error fetching payments:", error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "pending": return "Pending";
      case "failed": return "Failed";
      default: return "Completed";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "credit": return <CreditCard className="h-4 w-4 text-blue-500" />;
      case "cash": return <DollarSign className="h-4 w-4 text-green-500" />;
      case "mobile": return <CreditCard className="h-4 w-4 text-purple-500" />;
      default: return <CreditCard className="h-4 w-4 text-blue-500" />;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case "credit": return "Credit Card";
      case "cash": return "Cash";
      case "mobile": return "Mobile Payment";
      default: return "Credit Card";
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const pendingPayments = payments.filter(p => p.status === "pending").length;
  const failedPayments = payments.filter(p => p.status === "failed").length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-2">Process and track customer payments</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
                <p className="text-gray-500">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {payments.filter(p => p.status === "completed").length}
                </h3>
                <p className="text-gray-500">Completed Payments</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{pendingPayments}</h3>
                <p className="text-gray-500">Pending Payments</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{failedPayments}</h3>
                <p className="text-gray-500">Failed Payments</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" /> Recent Payments
                  </div>
                  <span className="text-sm font-normal text-gray-500">
                    {filteredPayments.length} transactions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search payments..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-10" 
                    />
                  </div>
                  <div>
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{payment.id}</h3>
                            <span className="ml-3 flex items-center text-sm">
                              {getStatusIcon(payment.status)}
                              <span className="ml-1">{getStatusText(payment.status)}</span>
                            </span>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="mr-3">Customer: {payment.customer}</span>
                            <span>Table: {payment.table}</span>
                          </div>
                          <div className="flex items-center mt-2 text-sm">
                            <span className="mr-4">
                              <span className="font-medium">${payment.amount.toFixed(2)}</span>
                            </span>
                            <span className="flex items-center mr-4">
                              {getMethodIcon(payment.method)}
                              <span className="ml-1">{getMethodText(payment.method)}</span>
                            </span>
                            <span className="text-gray-500">{payment.timestamp}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Items: </span>
                            <span className="text-sm">
                              {payment.items.join(", ")}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" /> Process New Payment
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" /> View Pending Payments
                </Button>
                <Button variant="outline" className="w-full">
                  <XCircle className="h-4 w-4 mr-2" /> Resolve Failed Payments
                </Button>
              </CardContent>
            </Card>
            
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Credit Cards</span>
                    </div>
                    <span className="font-medium">
                      {payments.filter(p => p.method === "credit").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                      <span>Cash</span>
                    </div>
                    <span className="font-medium">
                      {payments.filter(p => p.method === "cash").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
                      <span>Mobile Payments</span>
                    </div>
                    <span className="font-medium">
                      {payments.filter(p => p.method === "mobile").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm">Payment completed for Table 5</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm">New payment initiated for Table 7</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-red-500 mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm">Payment failed for Table 9</p>
                      <p className="text-xs text-gray-500">10 minutes ago</p>
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