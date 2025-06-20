'use client'
import React from 'react';
import useDashboardData from '../../hooks/useDashboardData';
import ServiceTrendChart from '../../components/ServiceTrendChart';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Default service types for dummy data
const DEFAULT_SERVICES = [
  { serviceType: 'mechanic', count: 125, growth: 12 },
  { serviceType: 'electrician', count: 98, growth: 8 },
  { serviceType: 'plumber', count: 87, growth: -5 },
  { serviceType: 'carpenter', count: 64, growth: 25 },
  { serviceType: 'cleaner', count: 112, growth: 18 },
];

const ServicesPage: React.FC = () => {
  const { stats, loading, error, usingDummyData } = useDashboardData();

  // Use dummy data if in demo mode
  const displayStats = usingDummyData 
    ? { trendingServices: DEFAULT_SERVICES } 
    : stats;

  if (loading) return <div className="p-8 text-center">Loading services data...</div>;
  if (error && !usingDummyData) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!displayStats) return <div className="p-8 text-center">No services data available</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Trends</h1>
        {usingDummyData && (
          <div className="flex items-center bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            <span className="text-sm">Showing demo service data</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {displayStats.trendingServices.map((service) => (
          <div 
            key={service.serviceType} 
            className={`bg-white p-4 rounded-lg shadow ${usingDummyData ? 'border-l-4 border-yellow-400' : ''}`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 capitalize">{service.serviceType}</h3>
              {usingDummyData && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  Demo
                </span>
              )}
            </div>
            <div className="mt-2 flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{service.count}</p>
                <p className="text-sm text-gray-500">Total Bookings</p>
              </div>
              <div className={`flex items-center ${service.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-sm font-medium">
                  {service.growth >= 0 ? '+' : ''}{service.growth}%
                </span>
                <svg
                  className={`w-4 h-4 ml-1 ${service.growth >= 0 ? 'rotate-0' : 'rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`bg-white p-4 rounded-lg shadow ${usingDummyData ? 'border-l-4 border-yellow-400' : ''}`}>
        {usingDummyData && (
          <div className="mb-4 flex items-center bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            <span className="text-sm">Demo trend data visualization</span>
          </div>
        )}
        <ServiceTrendChart 
          services={displayStats.trendingServices} 
          isDemo={usingDummyData} 
        />
      </div>

      {usingDummyData && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-700">
          <p>This dashboard is currently displaying demonstration service data. When connected to your live API:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Real booking statistics will replace these demo numbers</li>
            <li>Growth percentages will reflect your actual business trends</li>
            <li>Charts will update with real-time data</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;