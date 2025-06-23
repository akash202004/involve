'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, TrendingUp, User } from 'lucide-react';

interface WorkerData {
  name: string;
  income: number;
  rating: number;
  completionRate: number;
}

interface TopWorkersChartProps {
  data: WorkerData[];
}

const TopWorkersChart: React.FC<TopWorkersChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No worker data available.</p>;
  }

  const sortedData = [...data].sort((a, b) => b.income - a.income);

  return (
    <div className="space-y-4 -mx-4 px-4 h-full overflow-y-auto">
      {sortedData.map((worker, index) => (
        <motion.div
          key={worker.name}
          className="flex items-center space-x-4 p-3 rounded-xl transition-colors hover:bg-gray-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{worker.name}</p>
            <div className="flex items-center text-xs text-gray-500 space-x-2">
                <div className="flex items-center" title="Rating">
                    <Star className="w-3 h-3 text-amber-400 mr-1" fill="currentColor" />
                    <span>{worker.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center" title="Completion Rate">
                    <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                    <span>{worker.completionRate}%</span>
                </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">₹{worker.income.toLocaleString()}</p>
            {index === 0 && (
              <div className="flex items-center justify-end text-xs text-amber-500 font-semibold mt-1">
                <Award className="w-3 h-3 mr-1" />
                Top Performer
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TopWorkersChart; 