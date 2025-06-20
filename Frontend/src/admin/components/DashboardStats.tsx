import { FiUsers, FiTool, FiDollarSign, FiCalendar } from 'react-icons/fi'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
}

function StatsCard({ title, value, icon, change }: StatsCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-green-500">{change}</p>
        </div>
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  )
}

interface DashboardStatsProps {
  data: {
    totalUsers: number
    totalWorkers: number
    jobsToday: number
    revenueMonth: number
    userGrowth: number
    workerGrowth: number
    jobGrowth: number
    revenueGrowth: number
  }
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      icon: <FiUsers className="h-5 w-5" />,
      change: `${data.userGrowth}% from last month`,
    },
    {
      title: 'Total Workers',
      value: data.totalWorkers,
      icon: <FiTool className="h-5 w-5" />,
      change: `${data.workerGrowth}% from last month`,
    },
    {
      title: "Today's Jobs",
      value: data.jobsToday,
      icon: <FiCalendar className="h-5 w-5" />,
      change: `${data.jobGrowth}% from yesterday`,
    },
    {
      title: 'Monthly Revenue',
      value: `₹${data.revenueMonth.toLocaleString()}`,
      icon: <FiDollarSign className="h-5 w-5" />,
      change: `${data.revenueGrowth}% from last month`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}