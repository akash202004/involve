import LineChart from '../components/LineChart'
import PieChart from '../components/PieChart'
import MapComponent from '../components/MapComponent'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { Suspense } from 'react'

// Mock data
const mockAnalyticsData = {
  monthlyRequests: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Service Requests',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(75, 192, 192)',
      }
    ]
  },
  revenueTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [12000, 19000, 15000, 20000, 18000, 22000],
        borderColor: 'rgb(53, 162, 235)',
      }
    ]
  },
  serviceDistribution: {
    labels: ['Plumbing', 'Electrical', 'Mechanic', 'AC Repair', 'Carpentry'],
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
    { lat: 19.0760, lng: 72.8777, count: 15 },  // Mumbai
    { lat: 28.7041, lng: 77.1025, count: 8 },   // Delhi
    { lat: 12.9716, lng: 77.5946, count: 12 },  // Bangalore
    { lat: 13.0827, lng: 80.2707, count: 5 },   // Chennai
  ]
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Advanced Analytics</h1>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Monthly Service Requests</h2>
            <LineChart data={mockAnalyticsData.monthlyRequests} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
            <LineChart data={mockAnalyticsData.revenueTrends} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Service Distribution</h2>
            <PieChart data={mockAnalyticsData.serviceDistribution} />
          </div>
          
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Geographical Distribution</h2>
            <MapComponent locations={mockAnalyticsData.locations} />
          </div>
        </div>
      </Suspense>
    </div>
  )
}