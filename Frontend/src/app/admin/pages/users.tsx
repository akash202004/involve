'use client'
import React from 'react';
import useDashboardData from '../hooks/useDashboardData';
import { UsersTable } from '../components/UsersTable';

const UsersPage: React.FC = () => {
  const { users, loading, error } = useDashboardData();

  if (loading) return <div className="p-8 text-center">Loading users...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users Management</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default UsersPage;