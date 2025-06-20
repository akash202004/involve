import DataTable from '../components/DataTable'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { Suspense } from 'react'

// Mock data
const mockUsers = [
  {
    id: 'user-1',
    firstName: 'Amit',
    lastName: 'Sharma',
    email: 'amit@example.com',
    phoneNumber: '9876543210',
    city: 'Mumbai',
    createdAt: '2023-01-10T09:15:00Z'
  },
  {
    id: 'user-2',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya@example.com',
    phoneNumber: '8765432109',
    city: 'Delhi',
    createdAt: '2023-02-15T11:30:00Z'
  },
  {
    id: 'user-3',
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul@example.com',
    phoneNumber: '7654321098',
    city: 'Bangalore',
    createdAt: '2023-03-20T14:45:00Z'
  }
]

export default function UsersPage() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phoneNumber' },
    { header: 'Location', accessor: 'city' },
    { header: 'Joined', accessor: 'createdAt' },
  ]

  const data = mockUsers.map(user => ({
    id: user.id.slice(0, 8),
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phoneNumber: user.phoneNumber,
    city: user.city || 'Unknown',
    createdAt: new Date(user.createdAt).toLocaleDateString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <DataTable 
          columns={columns} 
          data={data} 
          viewPath="/admin/users" 
          searchKeys={['name', 'email', 'phoneNumber', 'city']}
        />
      </Suspense>
    </div>
  )
}