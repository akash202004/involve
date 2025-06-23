'use client';

import React from 'react';
import Image from 'next/image';

type Worker = {
  name: string;
  income: number;
  orders: number;
};

interface WorkerListProps {
  workers: Worker[];
}

const WorkerList: React.FC<WorkerListProps> = ({ workers }) => {
  if (!workers || workers.length === 0) {
    return <p className="text-gray-500 text-center py-4">No workers available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Worker</th>
            <th scope="col" className="px-6 py-3">Income</th>
            <th scope="col" className="px-6 py-3">Orders</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={`https://i.pravatar.cc/40?u=${worker.name}`}
                      alt={worker.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-base font-semibold">{worker.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">₹{worker.income.toLocaleString()}</td>
              <td className="px-6 py-4">{worker.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkerList; 