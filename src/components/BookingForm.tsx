import React, { useState } from 'react';
import { format } from 'date-fns';
import { Service } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';
import PaymentWrapper from './PaymentWrapper';

interface BookingFormProps {
  service: Service;
}

const BookingForm: React.FC<BookingFormProps> = ({ service }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hours, setHours] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Extract the provider ID from the service
      // In a real app, the service would have a dedicated provider_id field
      const providerId = service.providerName === 'CleanPro Services' ? '00000000-0000-0000-0000-000000000011' :
                         service.providerName === 'Quick Fix Plumbing' ? '00000000-0000-0000-0000-000000000012' :
                         service.providerName === 'Dr. Michael Chen' ? '00000000-0000-0000-0000-000000000013' :
                         service.providerName === 'Elena Rodriguez Photography' ? '00000000-0000-0000-0000-000000000014' :
                         service.providerName === 'Green Thumb Landscaping' ? '00000000-0000-0000-0000-000000000015' :
                         service.providerName === 'Bright Spark Electric' ? '00000000-0000-0000-0000-000000000016' :
                         service.providerName === 'Pristine Auto Detailing' ? '00000000-0000-0000-0000-000000000017' :
                         service.providerName === 'Digital Craft Studios' ? '00000000-0000-0000-0000-000000000018' :
                         service.providerName === 'Fitness With Sarah' ? '00000000-0000-0000-0000-000000000019' :
                         service.providerName === 'Tech Support Wizards' ? '00000000-0000-0000-0000-000000000020' :
                         '00000000-0000-0000-0000-000000000011'; // Default to first provider if not found
      
      console.log("Creating booking with provider ID:", providerId);
      
      const booking = await createBooking({
        serviceId: service.id,
        userId: user.id,
        providerId: providerId,
        date,
        time,
        duration: hours,
        price: service.price * hours,
        notes: notes || undefined
      });
      
      console.log("Booking created:", booking);
      setBookingId(booking.id);
      setShowPayment(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSuccess(true);
    
    // Reset form
    setDate('');
    setTime('');
    setHours(1);
    setNotes('');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  // Calculate total price and ensure it's a valid number
  const totalPrice = service.price * hours;
  const formattedTotalPrice = isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2);
  const formattedServicePrice = isNaN(service.price) ? '0.00' : service.price.toFixed(2);
  
  // Get tomorrow's date as the minimum date for booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = format(tomorrow, 'yyyy-MM-dd');

  if (success) {
     return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Booking Successful!</h3>
        <p className="text-green-700 mb-4">
          Your booking request has been sent to the service provider.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Book Another Time
        </button>
      </div>
    );
  }

  if (showPayment) {
    return (
      <PaymentWrapper
        bookingId={bookingId}
        amount={totalPrice}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Book This Service</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (hours)
          </label>
          <input
            type="number"
            id="hours"
            min="1"
            max="8"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Price per hour:</span>
            <span className="font-medium">${formattedServicePrice}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-700">Hours:</span>
            <span className="font-medium">{hours}</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Total:</span>
            <span className="font-bold text-indigo-600">${formattedTotalPrice}</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } transition-colors`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;