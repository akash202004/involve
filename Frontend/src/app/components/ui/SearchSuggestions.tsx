"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchServices, MAIN_SERVICES, type ServiceDetails } from '@/lib/services';

interface SearchSuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
}) => {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<Array<{ service: ServiceDetails; type: 'main' | 'detailed' }>>([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchServices(searchQuery);
      setSuggestions(results);
      setShowAllServices(false);
    } else {
      setSuggestions([]);
      setShowAllServices(true);
    }
  }, [searchQuery]);

  const handleServiceClick = (service: ServiceDetails) => {
    // Navigate to booking services page with the service
    router.push(`/booking/services?service=${encodeURIComponent(service.name)}`);
    onClose();
    onSearchChange('');
  };

  const handleMainServiceClick = (mainService: typeof MAIN_SERVICES[0]) => {
    router.push(mainService.route);
    onClose();
    onSearchChange('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchServices(searchQuery);
      if (results.length > 0) {
        handleServiceClick(results[0].service);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div 
        ref={searchRef}
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden"
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for services..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                autoFocus
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="submit"
              className="ml-3 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto max-h-[60vh]">
          {searchQuery.trim() ? (
            // Search results
            <div className="p-4">
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Search Results ({suggestions.length})
                  </h3>
                  {suggestions.map((result, index) => (
                    <div
                      key={`${result.service.name}-${index}`}
                      onClick={() => handleServiceClick(result.service)}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="text-2xl mr-3">{result.service.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.service.name}</div>
                        <div className="text-sm text-gray-500">{result.service.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {result.service.category} • ₹{result.service.price} • {result.service.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">No services found</div>
                  <div className="text-sm text-gray-500">Try searching for a different service</div>
                </div>
              )}
            </div>
          ) : (
            // Popular services when no search query
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Popular Services</h3>
              <div className="grid grid-cols-2 gap-3">
                {MAIN_SERVICES.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleMainServiceClick(service)}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                      <img src={service.icon} alt={service.title} className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-medium text-gray-900 text-center">{service.title}</div>
                    {service.isNew && (
                      <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full mt-1">
                        NEW
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Service Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Hair Services', 'Grooming Services', 'Massage Services', 'Cleaning Services', 'Appliance Repair', 'Plumbing Services', 'Electrical Services', 'Carpenter Services', 'Painting Services', 'Pest Control', 'Mechanic Services'].map((category) => (
                    <div
                      key={category}
                      onClick={() => onSearchChange(category)}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            Press Enter to search or click on a service to book
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions; 