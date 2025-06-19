'use client'
import React from 'react';
import useDashboardData from '../hooks/useDashboardData';
import ServiceTrendChart from '../components/ServiceTrendChart';

const ServicesPage: React.FC = () => {
  const { stats, loading, error } = useDashboardData();

  if (loading) return <div className="p-8 text-center">Loading services data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!stats) return <div className="p-8 text-center">No services data available</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Trends</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {stats.trendingServices.map((service) => (
          <div key={service.serviceType} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-900 capitalize">{service.serviceType}</h3>
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

      <div className="bg-white p-4 rounded-lg shadow">
        <ServiceTrendChart services={stats.trendingServices} />
      </div>
    </div>
  );
};

export default ServicesPage;