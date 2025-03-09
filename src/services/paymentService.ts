import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentMethod } from '../types';

// Initialize Stripe with a fallback empty string to prevent errors
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = loadStripe(stripePublishableKey);

export const createPaymentIntent = async (bookingId: string, amount: number) => {
  try {
    console.log(`Creating payment intent for booking ${bookingId} with amount ${amount}`);
    
    // In a real application, this would be a server-side API call
    // For demo purposes, we're simulating the response
    
    // Normally, you would have a serverless function or API endpoint that:
    // 1. Creates a payment intent on Stripe
    // 2. Returns the client secret to the frontend
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    const clientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
    
    // Update booking with payment intent ID
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_intent_id: `pi_${Math.random().toString(36).substring(2)}`,
        payment_status: 'pending'
      })
      .eq('id', bookingId)
      .select();
    
    if (error) {
      console.error("Error updating booking with payment intent:", error);
      throw error;
    }
    
    console.log("Booking updated with payment intent:", data);
    return { clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const confirmPayment = async (bookingId: string) => {
  try {
    // In a real application, this would be handled by Stripe webhooks
    // For demo purposes, we're simulating a successful payment
    console.log("Confirming payment for booking:", bookingId);
    
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        status: 'Confirmed'  // Update the booking status to Confirmed after payment
      })
      .eq('id', bookingId)
      .select();
    
    if (error) {
      console.error("Error updating booking after payment:", error);
      throw error;
    }
    
    console.log("Booking updated after payment:", data);
    return true;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getStripe = () => stripePromise;

// Payment Methods Management
export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    // In a real application, this would fetch from your database
    // For demo purposes, we're returning mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        userId,
        type: 'card',
        cardName: 'John Doe',
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cvv: '123',
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId,
        type: 'bank',
        accountName: 'John Doe',
        accountNumber: '9876543210',
        bankName: 'Bank of America',
        routingNumber: '123456789',
        isDefault: false,
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    
    return mockPaymentMethods;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

export const savePaymentMethod = async (userId: string, paymentData: any): Promise<PaymentMethod> => {
  try {
    // In a real application, this would save to your database
    // For demo purposes, we're simulating a successful save
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Create a new payment method object
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      userId,
      ...paymentData,
      isDefault: false, // New payment methods are not default by default
      createdAt: new Date().toISOString()
    };
    
    return newPaymentMethod;
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (id: string): Promise<boolean> => {
  try {
    // In a real application, this would delete from your database
    // For demo purposes, we're simulating a successful delete
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (id: string): Promise<boolean> => {
  try {
    // In a real application, this would update your database
    // For demo purposes, we're simulating a successful update
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

// Lead payment processing
export const processLeadPayment = async (providerId: string, leadId: string, amount: number): Promise<boolean> => {
  try {
    console.log(`Processing lead payment for provider ${providerId}, lead ${leadId}, amount ${amount}`);
    
    // In a real application, this would charge the provider's default payment method
    // For demo purposes, we're simulating a successful payment
    
    // Update provider's lead balance
    const { data, error } = await supabase
      .from('profiles')
      .update({
        lead_balance: supabase.rpc('decrement_lead_balance', { amount })
      })
      .eq('id', providerId)
      .select();
    
    if (error) {
      console.error("Error updating lead balance:", error);
      throw error;
    }
    
    // Update the lead with payment information
    await supabase
      .from('messages')
      .update({
        lead_price: amount,
        lead_paid: true
      })
      .eq('id', leadId);
    
    console.log("Lead payment processed successfully");
    return true;
  } catch (error) {
    console.error('Error processing lead payment:', error);
    throw error;
  }
};