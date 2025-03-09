import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, MessageSquare, Upload, Plus, Trash2, Edit, DollarSign, Zap } from 'lucide-react';
import { fetchProviderServices } from '../services/serviceService';
import ServiceCard from '../components/ServiceCard';
import PortfolioGallery from '../components/PortfolioGallery';
import PortfolioUploader from '../components/PortfolioUploader';
import BookingRequestsList from '../components/BookingRequestsList';
import { Service } from '../types';
import { fetchProviderBookings } from '../services/bookingService';
import MessageButton from './components/MessageButton';
import PaymentMethodForm from './components/PaymentMethodForm';
import PaymentMethodsList from './components/PaymentMethodsList';

const Profile: React.FC = () => {
  const { profile, user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [providerBookings, setProviderBookings] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [providerBookingsLoading, setProviderBookingsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: '',
    location: '',
    provider_bio: profile?.provider_bio || '',
    weekly_budget: profile?.weekly_budget || 100,
    max_lead_price: profile?.max_lead_price || 10
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<{id: string, title: string, description: string, imageUrl: string, serviceId?: string}[]>([]);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        provider_bio: profile.provider_bio || '',
        weekly_budget: profile?.weekly_budget || 100,
        max_lead_price: profile?.max_lead_price || 10
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user && activeTab === 'bookings') {
      fetchUserBookings();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && profile?.is_provider && activeTab === 'requests') {
      fetchBookingRequests();
    }
  }, [user, profile, activeTab]);

  useEffect(() => {
    if (user && profile?.is_provider && activeTab === 'services') {
      fetchServices();
    }
  }, [user, profile, activeTab]);

  useEffect(() => {
    if (user && profile?.is_provider && activeTab === 'portfolio') {
      fetchPortfolio();
    }
  }, [user, profile, activeTab]);

  useEffect(() => {
    if (user && activeTab === 'payment-methods') {
      fetchPaymentMethods();
    }
  }, [user, activeTab]);

  const fetchUserBookings = async () => {
    if (!user) return;
    
    setBookingsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services:service_id (
            title,
            image_url
          ),
          provider:provider_id (
            full_name
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchBookingRequests = async () => {
    if (!user) return;
    
    setProviderBookingsLoading(true);
    try {
      const bookingsData = await fetchProviderBookings(user.id);
      setProviderBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
    } finally {
      setProviderBookingsLoading(false);
    }
  };

  const fetchServices = async () => {
    if (!user) return;
    
    setServicesLoading(true);
    try {
      const data = await fetchProviderServices(user.id);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchPortfolio = async () => {
    if (!user) return;
    
    try {
      // This would be a real API call in a production app
      // For now, we'll use mock data
      setPortfolioItems([
        {
          id: '1',
          title: 'Previous Project 1',
          description: 'A successful project completed for a client in New York.',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        {
          id: '2',
          title: 'Previous Project 2',
          description: 'A complex project that showcases our attention to detail.',
          imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        }
      ]);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    setPaymentMethodsLoading(true);
    try {
      // This would be a real API call in a production app
      // For now, we'll use mock data
      setPaymentMethods([
        {
          id: '1',
          type: 'card',
          cardName: 'John Doe',
          cardNumber: '4242424242424242',
          expiryDate: '12/25',
          isDefault: true
        },
        {
          id: '2',
          type: 'bank',
          accountName: 'John Doe',
          accountNumber: '9876543210',
          bankName: 'Bank of America',
          routingNumber: '123456789',
          isDefault: false
        }
      ]);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddPortfolioItem = (newItem: {id: string, title: string, description: string, imageUrl: string, serviceId?: string}) => {
    setPortfolioItems(prev => [...prev, newItem]);
    setShowPortfolioForm(false);
  };

  const handleDeletePortfolioItem = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };

  const handlePaymentMethodSuccess = () => {
    setShowAddPaymentForm(false);
    fetchPaymentMethods();
  };

  const handlePaymentMethodsUpdate = () => {
    fetchPaymentMethods();
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError('');
    
    if (!user) return;
    
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        provider_bio: formData.provider_bio,
        phone: formData.phone,
        location: formData.location,
        weekly_budget: parseFloat(formData.weekly_budget.toString()),
        max_lead_price: parseFloat(formData.max_lead_price.toString())
      });
      
      if (error) {
        setUpdateError(error.message || 'Failed to update profile');
      } else {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update profile');
    }
  };

  if (!profile) {
    return null; // This should be handled by the ProtectedRoute component
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 px-6 py-16">
          <div className="flex flex-col items-center">
            <img
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&size=128&background=random`}
              alt={profile.full_name}
              className="w-24 h-24 rounded-full border-4 border-white mb-4"
            />
            <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
            <p className="text-indigo-100">{profile.email}</p>
            <p className="mt-2 px-3 py-1 bg-indigo-500 rounded-full text-white text-sm">
              {profile.is_provider ? 'Service Provider' : 'Customer'}
            </p>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Bookings
            </button>
            {profile.is_provider && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Booking Requests
              </button>
            )}
            {profile.is_provider && (
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'leads'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Leads
              </button>
            )}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('payment-methods')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'payment-methods'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Account Settings
            </button>
            {profile.is_provider && (
              <>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'services'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Services
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'portfolio'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Portfolio
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">My Bookings</h2>
              
              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
                  <Link
                    to="/services"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Browse Services
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{booking.services?.title || 'Service'}</h3>
                          <p className="text-gray-600">{booking.provider?.full_name || 'Provider'}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={18} className="mr-2" />
                          <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock size={18} className="mr-2" />
                          <span>{booking.time} ({booking.duration} hours)</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={18} className="mr-2" />
                          <span>Online</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-medium text-gray-900">${booking.price.toFixed(2)}</span>
                        <div className="flex space-x-2">
                          {booking.status === 'Upcoming' && (
                            <>
                              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                Reschedule
                              </button>
                              <button className="px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50">
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'Completed' && !booking.reviewed && (
                            <button className="px-3 py-1 bg-indigo-600 rounded-md text-sm text-white hover:bg-indigo-700">
                              Leave Review
                            </button>
                          )}
                          <Link 
                            to={`/messages/${booking.provider_id}`}
                            className="px-3 py-1 border border-indigo-300 rounded-md text-sm text-indigo-700 hover:bg-indigo-50 flex items-center"
                          >
                            <MessageSquare size={14} className="mr-1" />
                            Message
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'requests' && profile.is_provider && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Booking Requests</h2>
              
              {providerBookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <BookingRequestsList 
                  bookings={providerBookings} 
                  onStatusChange={fetchBookingRequests}
                />
              )}
            </div>
          )}
          
          {activeTab === 'leads' && profile.is_provider && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Leads</h2>
              
              <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Lead Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="weekly_budget" className="block text-sm font-medium text-gray-700 mb-1">
                      Weekly Budget
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="weekly_budget"
                        id="weekly_budget"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        value={formData.weekly_budget}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="max_lead_price" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Lead Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="max_lead_price"
                        id="max_lead_price"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        value={formData.max_lead_price}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;