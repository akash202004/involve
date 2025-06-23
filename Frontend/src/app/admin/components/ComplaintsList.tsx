'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, CheckCircle, Clock, User } from 'lucide-react';

type Complaint = {
  id: number;
  workerName: string;
  issue: string;
  status: 'Resolved' | 'Pending' | 'Under Review';
  date: string;
  priority: 'High' | 'Medium' | 'Low';
};

interface ComplaintsListProps {
  complaints: Complaint[];
}

const statusConfig = {
    Resolved: { icon: CheckCircle, color: 'text-green-500', label: 'Resolved' },
    Pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
    'Under Review': { icon: AlertOctagon, color: 'text-blue-500', label: 'Under Review' },
};
  
const priorityConfig = {
    High: 'border-l-red-500',
    Medium: 'border-l-yellow-400',
    Low: 'border-l-gray-300',
};

const ComplaintsList: React.FC<ComplaintsListProps> = ({ complaints }) => {
  if (!complaints || complaints.length === 0) {
    return <p className="text-gray-500 text-center py-8">No complaints recorded.</p>;
  }

  return (
    <div className="space-y-3 -mx-4 px-4 h-full overflow-y-auto">
      {complaints.map((complaint, index) => {
        const StatusIcon = statusConfig[complaint.status].icon;
        const statusColor = statusConfig[complaint.status].color;
        
        return (
            <motion.div
                key={complaint.id}
                className={`flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border-l-4 ${priorityConfig[complaint.priority]}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${statusColor} bg-opacity-10`}>
                    <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-gray-800 truncate">{complaint.issue}</p>
                        <p className="text-xs text-gray-500">{complaint.date}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        Assigned to: <span className="font-medium">{complaint.workerName}</span>
                    </p>
                </div>
          </motion.div>
        )
      })}
    </div>
  );
};

export default ComplaintsList;