import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link to={`/services/${service.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
        <div className="h-48 relative">
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 m-2 rounded-full">
            {service.category}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
          </div>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{service.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-700 ml-1">{service.rating} ({service.reviewCount})</span>
            </div>
            <span className="font-bold text-gray-900">${service.price}/hr</span>
          </div>
          <div className="mt-2 text-sm text-gray-500 flex items-center">
            <span>By {service.providerName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;