import DashboardStats from './components/DashboardStats'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import MapComponent from './components/MapComponent'
import RecentJobs from './components/RecentJobs'

interface Job {
  id: string
  user: string
  worker: string
  service: string
  date: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  amount: number
}

interface Location {
  lat: number
  lng: number
  count: number
}

const mockDashboardData = {
  stats: {
    totalUsers: 1248,
    totalWorkers: 315,
    jobsToday: 47,
    revenueMonth: 128500,
    userGrowth: 12,
    workerGrowth: 8,
    jobGrowth: 15,
    revenueGrowth: 18
  },
  trends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Mechanic',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Electrician',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: 'rgb(53, 162, 235)',
      },
      {
        label: 'Plumber',
        data: [45, 25, 60, 36, 52, 35],
        borderColor: 'rgb(255, 99, 132)',
      }
    ]
  },
  serviceDistribution: {
    labels: ['Mechanic', 'Electrician', 'Plumber', 'Carpenter', 'AC Repair'],
    datasets: [
      {
        label: 'Service Distribution',
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
      }
    ]
  },
  locations: [
    { lat: 19.0760, lng: 72.8777, count: 15 },
    { lat: 28.7041, lng: 77.1025, count: 8 },
    { lat: 12.9716, lng: 77.5946, count: 12 },
    { lat: 13.0827, lng: 80.2707, count: 5 }
  ] as Location[],
  recentJobs: [
    {
      id: 'job-1',
      user: 'Amit Sharma',
      worker: 'Rajesh Kumar',
      service: 'Plumbing',
      date: '2023-06-15T14:30:00Z',
      status: 'completed',
      amount: 1200
    },
    {
      id: 'job-2',
      user: 'Priya Patel',
      worker: 'Suresh Patel',
      service: 'Car Repair',
      date: '2023-06-16T10:15:00Z',
      status: 'in_progress',
      amount: 2500
    },
    {
      id: 'job-3',
      user: 'Rahul Verma',
      worker: 'Vijay Singh',
      service: 'AC Repair',
      date: '2023-06-17T11:45:00Z',
      status: 'confirmed',
      amount: 1800
    }
  ] as Job[]
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
      
      <DashboardStats data={mockDashboardData.stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Service Requests Trend</h2>
          <LineChart data={mockDashboardData.trends} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Service Distribution</h2>
          <PieChart data={mockDashboardData.serviceDistribution} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Service Hotspots</h2>
        <MapComponent locations={mockDashboardData.locations} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
        <RecentJobs jobs={mockDashboardData.recentJobs} />
      </div>
    </div>
  )
}