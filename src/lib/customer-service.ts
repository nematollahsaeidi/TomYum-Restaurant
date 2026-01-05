import { toast } from 'sonner';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  favoriteItems: string[];
  lastVisit: string;
  membership: 'regular' | 'premium' | 'vip';
}

// In a real implementation, this would connect to an API
// For now, we'll simulate with local storage
export const customerService = {
  // Add new customer
  addCustomer: (customerData: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent' | 'favoriteItems' | 'lastVisit' | 'membership'>) => {
    const customers = customerService.getCustomers();
    const newCustomer: Customer = {
      ...customerData,
      id: Math.max(0, ...customers.map(c => c.id)) + 1,
      totalVisits: 0,
      totalSpent: 0,
      favoriteItems: [],
      lastVisit: new Date().toISOString().split('T')[0],
      membership: 'regular'
    };
    
    const updatedCustomers = [...customers, newCustomer];
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    toast.success('Customer added successfully');
    return newCustomer;
  },

  // Update customer information
  updateCustomer: (id: number, customerData: Partial<Customer>) => {
    const customers = customerService.getCustomers();
    const updatedCustomers = customers.map(customer => 
      customer.id === id ? { ...customer, ...customerData } : customer
    );
    
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    toast.success('Customer updated successfully');
    return updatedCustomers.find(c => c.id === id);
  },

  // Delete customer
  deleteCustomer: (id: number) => {
    const customers = customerService.getCustomers();
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    toast.success('Customer deleted successfully');
    return updatedCustomers;
  },

  // Get all customers
  getCustomers: (): Customer[] => {
    const customers = localStorage.getItem('customers');
    return customers ? JSON.parse(customers) : [];
  },

  // Filter customers by membership
  filterCustomers: (membership: string): Customer[] => {
    const customers = customerService.getCustomers();
    return customers.filter(customer => customer.membership === membership);
  }
};