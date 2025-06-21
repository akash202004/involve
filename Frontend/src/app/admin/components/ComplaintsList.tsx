import React from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Complaint {
  id: number;
  workerName: string;
  issue: string;
  status: 'Resolved' | 'Pending' | 'Under Review';
  date: string;
}

interface ComplaintsListProps {
  complaints: Complaint[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Resolved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'Under Review':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Under Review':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ComplaintsList({ complaints }: ComplaintsListProps) {
  // Validate data
  if (!complaints || !Array.isArray(complaints)) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No complaints data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
          <p>No complaints reported</p>
        </div>
      ) : (
        complaints.map((complaint) => (
          <div 
            key={complaint.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <h3 className="font-semibold text-gray-900">{complaint.workerName}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{complaint.issue}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>ID: #{complaint.id}</span>
              <span>{new Date(complaint.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      )}
      
      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="text-sm text-red-800">
          <strong>Total Complaints:</strong> {complaints.length} this month
        </div>
        <div className="text-xs text-red-600 mt-1">
          {complaints.filter(c => c.status === 'Resolved').length} resolved
        </div>
      </div>
    </div>
  );
} 