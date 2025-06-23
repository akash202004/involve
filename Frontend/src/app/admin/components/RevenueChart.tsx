'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#18181b', color: '#fff', borderRadius: 8, padding: 12, minWidth: 120, border: '1px solid #6366f1', boxShadow: '0 2px 12px #6366f122' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#6366f1' }}>
          ₹{payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No revenue data available.</p>
      </div>
    );
  }

  const formatYAxis = (tickItem: number) => {
    return `₹${(tickItem / 1000)}k`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barCategoryGap={"20%"}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.95}/>
            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis 
          dataKey="month" 
          stroke="#a1a1aa"
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#a1a1aa"
          fontSize={13}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatYAxis}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="revenue"
          radius={[10, 10, 6, 6]}
          fill="url(#barGradient)"
          barSize={32}
          isAnimationActive={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
} 