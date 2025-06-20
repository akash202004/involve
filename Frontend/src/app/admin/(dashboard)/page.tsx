'use client'
import AnalyticsCard from '../components/AnalyticsCard';
import GrowthRateChart from '../components/GrowthRateChart';
import RecentReviews from '../components/RecentReviews';
import {
  UsersIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function OverviewPage() {
  const serviceData = [
    { name: 'Mechanics', value: 156, color: '#6366F1', growth: 18 },
    { name: 'Electricians', value: 128, color: '#3B82F6', growth: 12 },
    { name: 'Plumbers', value: 95, color: '#10B981', growth: -5 },
    { name: 'Cleaners', value: 78, color: '#F59E0B', growth: 8 },
    { name: 'Others', value: 64, color: '#EC4899', growth: 3 }
  ];

  const COLORS = serviceData.map(item => item.color);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard <span className="text-indigo-600">Overview</span>
          </h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-sm font-medium text-indigo-600 border border-indigo-100">
            Live Data
          </span>
          <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-sm font-medium text-green-600 border border-green-100">
            All Systems OK
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Users"
          value={245}
          change={22.5}
          icon={<UsersIcon className="h-6 w-6 text-indigo-600" />}
          className="hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
        />
        <AnalyticsCard
          title="Active Workers"
          value={128}
          change={8.2}
          icon={<WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />}
          className="hover:shadow-lg hover:border-blue-200 transition-all duration-300"
        />
        <AnalyticsCard
          title="Avg. Response Time"
          value={32}
          change={-12.4}
          icon={<ClockIcon className="h-6 w-6 text-amber-600" />}
          className="hover:shadow-lg hover:border-amber-200 transition-all duration-300"
        />
        <AnalyticsCard
          title="Completed Jobs"
          value={189}
          change={18.7}
          icon={<ChartBarIcon className="h-6 w-6 text-green-600" />}
          className="hover:shadow-lg hover:border-green-200 transition-all duration-300"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
              Growth Rate
            </h2>
            <select className="text-sm bg-gray-50 border-gray-200 rounded-lg px-3 py-1 focus:ring-indigo-500 focus:border-indigo-500">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <GrowthRateChart
            userGrowth={[20, 35, 50, 70, 100, 150]}
            workerGrowth={[5, 15, 25, 40, 60, 90]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            className="h-64"
          />
        </div>

        {/* Service Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              Service Distribution
            </h2>
            <div className="relative">
              <select className="appearance-none text-sm bg-gray-50 border-gray-200 rounded-lg px-3 py-1 pr-8 focus:ring-indigo-500 focus:border-indigo-500">
                <option>By Volume</option>
                <option>By Revenue</option>
              </select>
              <ChevronDownIcon className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row h-64">
            <div className="w-full lg:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} services`, 'Count']}
                    labelFormatter={(label) => `Service: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:pl-6">
              <div className="space-y-3">
                {serviceData.map((service, index) => (
                  <div key={service.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium text-gray-700 truncate">{service.name}</span>
                        <span className="text-sm font-semibold ml-2">{service.value}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        {service.growth > 0 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${service.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(service.growth)}% {service.growth > 0 ? 'growth' : 'decline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Reviews</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View All →
          </button>
        </div>
        <RecentReviews
          reviews={[
            {
              id: 'review-1',
              userId: 'user-12',
              userName: 'Alex Johnson',
              workerId: 'worker-5',
              workerName: 'Mike Smith',
              rating: 5,
              comment: 'Excellent service! Fixed my car quickly.',
              date: new Date(Date.now() - 86400000),
              serviceType: 'mechanic',
            },
            {
              id: 'review-2',
              userId: 'user-15',
              userName: 'Sarah Williams',
              workerId: 'worker-8',
              workerName: 'James Wilson',
              rating: 4,
              comment: 'Great work, but arrived 15 minutes late.',
              date: new Date(Date.now() - 172800000),
              serviceType: 'electrician',
            },
          ]}
        />
      </div>
    </div>
  );
}