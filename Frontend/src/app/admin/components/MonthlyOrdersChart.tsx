'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrdersData {
  month: string;
  orders: number;
}

interface MonthlyOrdersChartProps {
  data: OrdersData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700">
          <p className="font-bold text-white">{label}</p>
          <p className="text-sm text-cyan-400">{`Orders: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const getPath = (x: number, y: number, width: number, height: number) => {
    const radius = 6;
    return `M${x},${y + height}
            L${x},${y + radius}
            A${radius},${radius},0,0,1,${x + radius},${y}
            L${x + width - radius},${y}
            A${radius},${radius},0,0,1,${x + width},${y + radius}
            L${x + width},${y + height}
            Z`;
  };
  
  const RoundedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

export default function MonthlyOrdersChart({ data }: MonthlyOrdersChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-400">No order data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false}/>
        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={CustomTooltip} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} />
        <Bar 
            dataKey="orders" 
            fill="url(#colorOrders)" 
            shape={<RoundedBar />} 
            animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 