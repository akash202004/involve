'use client'
import React, { useState } from 'react';
import useDashboardData from '../../hooks/useDashboardData';
import { UsersTable } from '../../components/UsersTable';
import { ExclamationTriangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const UsersPage: React.FC = () => {
  const { users, loading, error, usingDummyData } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  if (loading) return (
    <div className="p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
      <p className="text-gray-600">Loading users...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage your community of {users.length} users</p>
        </div>
        
        {usingDummyData && (
          <div className="flex items-center bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">Showing demo data</span>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && !usingDummyData && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Users Table Component */}
      <div className={`bg-white p-6 rounded-xl shadow-sm ${usingDummyData ? 'border-l-4 border-amber-400' : ''}`}>
        <UsersTable 
          users={users} 
          isDemo={usingDummyData}
          searchTerm={searchTerm}
          activeFilter={activeFilter}
          onSearchChange={setSearchTerm}
          onFilterChange={setActiveFilter}
        />
      </div>
    </div>
  );
};

export default UsersPage;