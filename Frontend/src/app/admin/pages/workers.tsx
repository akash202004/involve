'use client'
import React from 'react';
import useDashboardData from '../hooks/useDashboardData';
import { WorkersTable } from '../components/WorkersTable';

const WorkersPage: React.FC = () => {
  const { workers, loading, error } = useDashboardData();

  if (loading) return <div className="p-8 text-center">Loading workers...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Workers Management</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <WorkersTable workers={workers} />
      </div>
    </div>
  );
};

export default WorkersPage;