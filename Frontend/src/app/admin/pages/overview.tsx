'use client'
import React from 'react';
import useDashboardData from '../hooks/useDashboardData';
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

const OverviewPage: React.FC = () => {
  const { stats, reviews, loading, error } = useDashboardData();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!stats) return <div className="p-8 text-center">No data available</div>;

  // Mock data for the growth chart (in a real app, this would come from your API)
  const growthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const userGrowthData = [30, 45, 60, 80, 110, 150];
  const workerGrowthData = [10, 20, 35, 50, 70, 100];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Users"
          value={stats.totalUsers.current}
          change={stats.totalUsers.change}
          icon={<UsersIcon className="h-5 w-5 text-indigo-600" />}
        />
        <AnalyticsCard
          title="Total Workers"
          value={stats.totalWorkers.current}
          change={stats.totalWorkers.change}
          icon={<WrenchScrewdriverIcon className="h-5 w-5 text-blue-500" />}
        />
        <AnalyticsCard
          title="Total Bookings"
          value={stats.totalBookings.current}
          change={stats.totalBookings.change}
          icon={<ClockIcon className="h-5 w-5 text-green-500" />}
        />
        <AnalyticsCard
          title="Avg. Rating"
          value="4.5"
          change={2.5}
          icon={<ChartBarIcon className="h-5 w-5 text-yellow-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <GrowthRateChart
            userGrowth={userGrowthData}
            workerGrowth={workerGrowthData}
            labels={growthLabels}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <ServiceTrendChart services={stats.trendingServices} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* You would add a bookings table or other content here */}
        </div>
        <div>
          <RecentReviews reviews={reviews.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;