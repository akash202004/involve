import DataTable from '../components/DataTable'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { Suspense } from 'react'

// Mock data
const mockWorkers = [
  {
    id: 'worker-1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh@example.com',
    phoneNumber: '9876543210',
    specializations: ['Plumber', 'Electrician'],
    rating: 4.5,
    jobsCompleted: 42,
    createdAt: '2023-01-15T10:30:00Z'
  },
  {
    id: 'worker-2',
    firstName: 'Suresh',
    lastName: 'Patel',
    email: 'suresh@example.com',
    phoneNumber: '8765432109',
    specializations: ['Mechanic'],
    rating: 4.2,
    jobsCompleted: 28,
    createdAt: '2023-02-20T11:15:00Z'
  },
]

export default function WorkersPage() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phoneNumber' },
    { header: 'Specializations', accessor: 'specializations' },
    { header: 'Rating', accessor: 'rating' },
    { header: 'Jobs Completed', accessor: 'jobsCompleted' },
    { header: 'Joined', accessor: 'createdAt' },
  ]

  const data = mockWorkers.map(worker => ({
    id: worker.id.slice(0, 8),
    name: `${worker.firstName} ${worker.lastName}`,
    email: worker.email,
    phoneNumber: worker.phoneNumber,
    specializations: worker.specializations.join(', ') || 'None',
    rating: worker.rating ? `${worker.rating.toFixed(1)} ★` : 'Not rated',
    jobsCompleted: worker.jobsCompleted,
    createdAt: new Date(worker.createdAt).toLocaleDateString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workers Management</h1>
      </div>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <DataTable 
          columns={columns} 
          data={data} 
          viewPath="/admin/workers" 
          searchKeys={['name', 'email', 'phoneNumber', 'specializations']}
        />
      </Suspense>
    </div>
  )
}