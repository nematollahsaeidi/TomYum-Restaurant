import { toast } from 'sonner';

export interface Payment {
  id: string;
  customer: string;
  table: string;
  amount: number;
  method: 'credit' | 'cash' | 'mobile';
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  items: string[];
}

// In a real implementation, this would connect to an API
// For now, we'll simulate with local storage
export const paymentService = {
  // Process new payment
  processNewPayment: (paymentData: Omit<Payment, 'id' | 'timestamp' | 'status'>) => {
    const payments = paymentService.getPayments();
    const newPayment: Payment = {
      ...paymentData,
      id: `TXN-${payments.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'completed'
    };
    
    const updatedPayments = [...payments, newPayment];
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    toast.success('Payment processed successfully');
    return newPayment;
  },

  // Update payment status
  updatePaymentStatus: (id: string, status: 'completed' | 'pending' | 'failed') => {
    const payments = paymentService.getPayments();
    const updatedPayments = payments.map(payment => 
      payment.id === id ? { ...payment, status } : payment
    );
    
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    toast.success(`Payment status updated to ${status}`);
    return updatedPayments.find(p => p.id === id);
  },

  // Get all payments
  getPayments: (): Payment[] => {
    const payments = localStorage.getItem('payments');
    return payments ? JSON.parse(payments) : [];
  },

  // Filter payments by status
  filterPayments: (status: string): Payment[] => {
    const payments = paymentService.getPayments();
    return payments.filter(payment => payment.status === status);
  }
};