import DataTable from '../components/DataTable'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { Suspense } from 'react'

// Mock data
const mockJobs = [
  {
    id: 'job-1',
    userName: 'Amit Sharma',
    workerName: 'Rajesh Kumar',
    service: 'Plumbing',
    date: '2023-06-15T14:30:00Z',
    status: 'completed',
    amount: 1200,
    city: 'Mumbai'
  },
  {
    id: 'job-2',
    userName: 'Priya Patel',
    workerName: 'Suresh Patel',
    service: 'Car Repair',
    date: '2023-06-16T10:15:00Z',
    status: 'in_progress',
    amount: 2500,
    city: 'Delhi'
  },
]

export default function JobsPage() {
  const columns = [
    { header: 'Job ID', accessor: 'id' },
    { header: 'User', accessor: 'user' },
    { header: 'Worker', accessor: 'worker' },
    { header: 'Service', accessor: 'service' },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Location', accessor: 'location' },
  ]

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const data = mockJobs.map(job => ({
    id: job.id.slice(0, 8),
    user: job.userName,
    worker: job.workerName || 'Not assigned',
    service: job.service,
    date: new Date(job.date).toLocaleString(),
    status: (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[job.status]}`}>
        {job.status.replace('_', ' ')}
      </span>
    ),
    amount: `₹${job.amount}`,
    location: job.city || 'Unknown',
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jobs Management</h1>
      </div>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <DataTable 
          columns={columns} 
          data={data} 
          viewPath="/admin/jobs" 
          searchKeys={['user', 'worker', 'service', 'location', 'status']}
        />
      </Suspense>
    </div>
  )
}