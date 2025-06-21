'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, TrendingDown } from 'lucide-react';

interface DiscountStatsProps {
  totalDiscounts: number;
}

export default function DiscountStats({ totalDiscounts }: DiscountStatsProps) {
  // Validate data
  if (!totalDiscounts || totalDiscounts <= 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No discount data available</p>
      </div>
    );
  }

  // Mock data for discount breakdown - replace with actual data
  const discountData = [
    { name: 'First-time Users', value: totalDiscounts * 0.4, color: '#ef4444' },
    { name: 'Loyal Customers', value: totalDiscounts * 0.3, color: '#f59e0b' },
    { name: 'Seasonal Offers', value: totalDiscounts * 0.2, color: '#8b5cf6' },
    { name: 'Referral Bonus', value: totalDiscounts * 0.1, color: '#10b981' }
  ];

  const formatTooltip = (value: number) => {
    return [`$${value.toLocaleString()}`, 'Discount'];
  };

  return (
    <div className="space-y-4">
      {/* Total Discount Display */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <TrendingDown className="h-6 w-6 text-red-500" />
          <span className="text-2xl font-bold text-gray-900">
            ${totalDiscounts.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-600">Total Discounts Given</p>
      </div>

      {/* Pie Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={discountData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {discountData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {discountData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-medium text-gray-900">
              ${item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="text-sm text-red-800">
          <strong>Average Discount:</strong> ${(totalDiscounts / 4).toLocaleString()}
        </div>
        <div className="text-xs text-red-600 mt-1">
          Most popular: First-time Users (40%)
        </div>
      </div>
    </div>
  );
} 