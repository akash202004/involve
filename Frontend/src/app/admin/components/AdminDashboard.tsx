'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Award, 
  AlertTriangle,
  Calendar,
  BarChart3
} from 'lucide-react';
import StatsCard from './StatsCard';
import WorkerList from './WorkerList';
import RevenueChart from './RevenueChart';
import MonthlyOrdersChart from './MonthlyOrdersChart';
import TopWorkersChart from './TopWorkersChart';
import ComplaintsList from './ComplaintsList';
import DiscountStats from './DiscountStats';

// Mock data - replace with actual API calls
const mockData = {
  totalWorkers: 45,
  avgIncome: 8500,
  highestIncome: 15000,
  monthlyOrders: 234,
  totalRevenue: 125000,
  totalDiscounts: 8500,
  topWorkers: [
    { name: 'John Doe', income: 15000, orders: 45 },
    { name: 'Jane Smith', income: 14200, orders: 42 },
    { name: 'Mike Johnson', income: 13800, orders: 38 },
    { name: 'Sarah Wilson', income: 13200, orders: 35 },
    { name: 'David Brown', income: 12800, orders: 32 }
  ],
  complaints: [
    { id: 1, workerName: 'John Doe', issue: 'Late arrival', status: 'Resolved' as const, date: '2024-01-15' },
    { id: 2, workerName: 'Mike Johnson', issue: 'Poor service quality', status: 'Pending' as const, date: '2024-01-14' },
    { id: 3, workerName: 'Sarah Wilson', issue: 'Equipment damage', status: 'Under Review' as const, date: '2024-01-13' }
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 135000 },
    { month: 'Mar', revenue: 142000 },
    { month: 'Apr', revenue: 138000 },
    { month: 'May', revenue: 145000 },
    { month: 'Jun', revenue: 152000 }
  ],
  monthlyOrdersData: [
    { month: 'Jan', orders: 210 },
    { month: 'Feb', orders: 225 },
    { month: 'Mar', orders: 240 },
    { month: 'Apr', orders: 235 },
    { month: 'May', orders: 250 },
    { month: 'Jun', orders: 265 }
  ]
};

export default function AdminDashboard() {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API calls
    setLoading(true);
    setError(null);
    
    try {
      setTimeout(() => {
        setData(mockData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Validate that data exists
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor your workforce, revenue, and business metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Workers"
          value={data.totalWorkers}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Avg Income"
          value={`$${data.avgIncome.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Highest Income"
          value={`$${data.highestIncome.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          color="yellow"
        />
        <StatsCard
          title="Monthly Orders"
          value={data.monthlyOrders}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
            <div className="text-2xl font-bold text-green-600">
              ${data.totalRevenue.toLocaleString()}
            </div>
          </div>
          <RevenueChart data={data.monthlyRevenue} />
        </div>

        {/* Top Workers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Top Workers</h2>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          <TopWorkersChart data={data.topWorkers} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Orders Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Orders</h2>
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <MonthlyOrdersChart data={data.monthlyOrdersData} />
        </div>

        {/* Discount Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Discounts Given</h2>
            <BarChart3 className="h-5 w-5 text-red-500" />
          </div>
          <DiscountStats totalDiscounts={data.totalDiscounts} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Worker List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Worker Details</h2>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <WorkerList workers={data.topWorkers} />
        </div>

        {/* Complaints */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Complaints</h2>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <ComplaintsList complaints={data.complaints} />
        </div>
      </div>
    </div>
  );
} 