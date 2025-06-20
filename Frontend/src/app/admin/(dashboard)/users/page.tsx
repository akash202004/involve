'use client'
import React from 'react';
import useDashboardData from '../../hooks/useDashboardData';
import { UsersTable } from '../../components/UsersTable';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const UsersPage: React.FC = () => {
  const { users, loading, error, usingDummyData } = useDashboardData();

  if (loading) return <div className="p-8 text-center">Loading users...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        {usingDummyData && (
          <div className="flex items-center bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            <span className="text-sm">Showing demo data</span>
          </div>
        )}
      </div>

      {error && !usingDummyData ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <div className={`bg-white shadow rounded-lg overflow-hidden ${
          usingDummyData ? 'border-l-4 border-yellow-400' : ''
        }`}>
          <UsersTable users={users} isDemo={usingDummyData} />
        </div>
      )}
    </div>
  );
};

export default UsersPage;