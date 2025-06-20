import DataTable from '../components/DataTable'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { Suspense } from 'react'

// Mock data
const mockTransactions = [
  {
    id: 'txn-1',
    jobId: 'job-1',
    amount: 1200,
    status: 'captured',
    method: 'upi',
    createdAt: '2023-06-15T14:35:00Z',
    userName: 'Amit Sharma'
  },
  {
    id: 'txn-2',
    jobId: 'job-2',
    amount: 2500,
    status: 'authorized',
    method: 'card',
    createdAt: '2023-06-16T10:20:00Z',
    userName: 'Priya Patel'
  },
]

export default function TransactionsPage() {
  const columns = [
    { header: 'Transaction ID', accessor: 'id' },
    { header: 'Job ID', accessor: 'jobId' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Status', accessor: 'status' },
    { header: 'Method', accessor: 'method' },
    { header: 'Date', accessor: 'date' },
    { header: 'User', accessor: 'user' },
  ]

  const statusStyles = {
    created: 'bg-gray-100 text-gray-800',
    authorized: 'bg-blue-100 text-blue-800',
    captured: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  const methodStyles = {
    card: 'bg-purple-100 text-purple-800',
    upi: 'bg-indigo-100 text-indigo-800',
    netbanking: 'bg-blue-100 text-blue-800',
    wallet: 'bg-yellow-100 text-yellow-800',
  }

  const data = mockTransactions.map(tx => ({
    id: tx.id.slice(0, 8),
    jobId: tx.jobId.slice(0, 8),
    amount: `₹${tx.amount}`,
    status: (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[tx.status]}`}>
        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
      </span>
    ),
    method: (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${methodStyles[tx.method]}`}>
        {tx.method.charAt(0).toUpperCase() + tx.method.slice(1)}
      </span>
    ),
    date: new Date(tx.createdAt).toLocaleString(),
    user: tx.userName,
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <DataTable 
          columns={columns} 
          data={data} 
          viewPath="/admin/transactions" 
          searchKeys={['id', 'jobId', 'status', 'method', 'user']}
        />
      </Suspense>
    </div>
  )
}