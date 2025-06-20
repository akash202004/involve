import Link from 'next/link'

export interface Job {
  id: string
  user: string
  worker: string
  service: string
  date: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  amount: number
}

interface RecentJobsProps {
  jobs: Job[]
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{job.id.slice(0, 8)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.user}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.worker}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{job.service}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(job.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[job.status]}`}>
                  {job.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{job.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link 
                  href={`/admin/jobs/${job.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}