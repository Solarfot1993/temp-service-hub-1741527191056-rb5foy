import { supabase } from '../lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  serviceId?: string;
}

export const fetchPortfolioByProviderId = async (providerId: string): Promise<PortfolioItem[]> => {
  try {
    // In a real application, this would be a database query
    // For now, we'll return mock data based on the provider ID
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock portfolio items for different providers
    const portfolioItems: Record<string, PortfolioItem[]> = {
      '00000000-0000-0000-0000-000000000011': [
        {
          id: '1',
          title: 'House Cleaning Project',
          description: 'A thorough cleaning of a 3-bedroom house in downtown.',
          imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          serviceId: '11111111-1111-1111-1111-111111111111'
        },
        {
          id: '2',
          title: 'Office Cleaning',
          description: 'Commercial cleaning for a tech startup office.',
          imageUrl: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          serviceId: '11111111-1111-1111-1111-111111111111'
        },
        {
          id: '3',
          title: 'Deep Cleaning Results',
          description: 'Before and after results of our deep cleaning service.',
          imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          serviceId: '11111111-1111-1111-1111-111111111111'
        }
      ],
      '00000000-0000-0000-0000-000000000012': [
        {
          id: '4',
          title: 'Bathroom Plumbing Repair',
          description: 'Fixed a leaking sink and replaced old pipes.',
          imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          serviceId: '22222222-2222-2222-2222-222222222222'
        },
        {
          id: '5',
          title: 'Kitchen Sink Installation',
          description: 'Installed a new kitchen sink with modern fixtures.',
          imageUrl: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          serviceId: '22222222-2222-2222-2222-222222222222'
        }
      ],
      '00000000-0000-0000-0000-000000000014': [
        {
          id: '6',
          title: 'Professional Headshot',
          description: 'Corporate headshot for a business executive.',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
          serviceId: '44444444-4444-4444-4444-444444444444'
        },
        {
          id: '7',
          title: 'Family Portrait',
          description: 'Outdoor family portrait session at the park.',
          imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          serviceId: '44444444-4444-4444-4444-444444444444'
        },
        {
          id: '8',
          title: 'Product Photography',
          description: 'Professional product photos for an e-commerce website.',
          imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80',
          serviceId: '44444444-4444-4444-4444-444444444444'
        }
      ],
      '00000000-0000-0000-0000-000000000015': [
        {
          id: '9',
          title: 'Garden Transformation',
          description: 'Complete garden makeover for a residential client.',
          imageUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
          serviceId: '55555555-5555-5555-5555-555555555555'
        },
        {
          id: '10',
          title: 'Lawn Maintenance',
          description: 'Regular lawn care for a commercial property.',
          imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          serviceId: '55555555-5555-5555-5555-555555555555'
        }
      ]
    };
    
    // Return portfolio items for the requested provider, or an empty array if none exist
    return portfolioItems[providerId] || [];
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    throw error;
  }
};

export const fetchPortfolioByServiceId = async (serviceId: string): Promise<PortfolioItem[]> => {
  try {
    // In a real application, this would be a database query
    // For now, we'll simulate by fetching all portfolio items and filtering
    
    // Get the service to find the provider
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('provider_id')
      .eq('id', serviceId)
      .single();
    
    if (serviceError) {
      throw serviceError;
    }
    
    if (!serviceData) {
      return [];
    }
    
    // Get all portfolio items for this provider
    const allItems = await fetchPortfolioByProviderId(serviceData.provider_id);
    
    // Filter to only include items for this service or with no service specified
    return allItems.filter(item => !item.serviceId || item.serviceId === serviceId);
  } catch (error) {
    console.error('Error fetching portfolio items by service:', error);
    throw error;
  }
};

export const createPortfolioItem = async (
  providerId: string,
  item: {
    title: string;
    description?: string;
    imageUrl: string;
    serviceId?: string;
  }
): Promise<PortfolioItem> => {
  try {
    // In a real application, this would insert into a database
    // For now, we'll just return a mock response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      ...item
    };
    
    return newItem;
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    throw error;
  }
};

export const deletePortfolioItem = async (id: string): Promise<boolean> => {
  try {
    // In a real application, this would delete from a database
    // For now, we'll just return a mock response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    throw error;
  }
};