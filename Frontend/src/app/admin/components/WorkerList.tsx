import React from 'react';
import { User, DollarSign, ShoppingCart } from 'lucide-react';

interface Worker {
  name: string;
  income: number;
  orders: number;
}

interface WorkerListProps {
  workers: Worker[];
}

export default function WorkerList({ workers }: WorkerListProps) {
  // Validate data
  if (!workers || !Array.isArray(workers) || workers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No worker data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workers.map((worker, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{worker.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span>${worker.income.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ShoppingCart className="h-3 w-3" />
                  <span>{worker.orders} orders</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              Rank #{index + 1}
            </div>
            <div className="text-xs text-gray-500">
              Top Performer
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm text-blue-800">
          <strong>Total Workers:</strong> {workers.length} active workers
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Showing top performers by income
        </div>
      </div>
    </div>
  );
} 