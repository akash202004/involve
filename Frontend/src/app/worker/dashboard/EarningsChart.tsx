import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', earnings: 400 },
  { name: 'Tue', earnings: 700 },
  { name: 'Wed', earnings: 500 },
  { name: 'Thu', earnings: 900 },
  { name: 'Fri', earnings: 650 },
  { name: 'Sat', earnings: 1200 },
  { name: 'Sun', earnings: 800 },
];

export default function EarningsChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', border: '1px solid #e5e7eb', padding: 24, marginBottom: 24, minHeight: 250, maxWidth: 600, width: '100%' }}>
      <h3 style={{ marginBottom: 16, color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>Earnings Over Time</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#10b981" />
          <YAxis stroke="#10b981" />
          <Tooltip contentStyle={{ background: '#fff', border: '1px solid #10b981' }} />
          <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 