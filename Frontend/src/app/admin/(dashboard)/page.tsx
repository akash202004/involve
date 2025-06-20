'use client'
import AnalyticsCard from '../components/AnalyticsCard';
import GrowthRateChart from '../components/GrowthRateChart';
import ServiceTrendChart from '../components/ServiceTrendChart';
import RecentReviews from '../components/RecentReviews';
import {
  UsersIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function OverviewPage() {
  // Your data fetching and state management here
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Users"
          value={245}
          change={22.5}
          icon={<UsersIcon className="h-5 w-5 text-indigo-600" />}
        />
        {/* Other cards */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <GrowthRateChart
            userGrowth={[20, 35, 50, 70, 100, 150]}
            workerGrowth={[5, 15, 25, 40, 60, 90]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
        <ServiceTrendChart
  services={[
    { serviceType: 'mechanic', count: 156, growth: 18 },
    { serviceType: 'electrician', count: 128, growth: 12 },
    { serviceType: 'plumber', count: 95, growth: -5 },
  ]}
/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Bookings content */}
        </div>
        <div>
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
    // Add more reviews as needed
  ]}
/>
        </div>
      </div>
    </div>
  );
}