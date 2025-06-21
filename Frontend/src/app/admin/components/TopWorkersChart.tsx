'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WorkerData {
  name: string;
  income: number;
  orders: number;
}

interface TopWorkersChartProps {
  data: WorkerData[];
}

export default function TopWorkersChart({ data }: TopWorkersChartProps) {
  // Validate data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const formatTooltip = (value: number, name: string) => {
    if (name === 'income') {
      return [`$${value.toLocaleString()}`, 'Income'];
    }
    return [value, 'Orders'];
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={data} 
        layout="horizontal"
        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          type="number"
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <YAxis 
          type="category"
          dataKey="name" 
          stroke="#6b7280"
          fontSize={12}
          width={70}
        />
        <Tooltip 
          formatter={formatTooltip}
          labelStyle={{ color: '#374151' }}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Bar 
          dataKey="income" 
          fill="#f59e0b" 
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 