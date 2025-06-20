import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ServiceTrendChartProps {
  services: {
    serviceType: string;
    count: number;
    growth: number;
  }[];
  isDemo?: boolean;
}

const ServiceTrendChart: React.FC<ServiceTrendChartProps> = ({ services, isDemo = false }) => {
  const data = {
    labels: services.map(service => service.serviceType),
    datasets: [
      {
        label: 'Bookings',
        data: services.map(service => service.count),
        backgroundColor: isDemo 
          ? 'rgba(253, 230, 138, 0.7)' // Yellow for demo
          : 'rgba(99, 102, 241, 0.7)', // Indigo for real
        borderColor: isDemo 
          ? 'rgba(234, 179, 8, 1)' 
          : 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Growth %',
        data: services.map(service => service.growth),
        backgroundColor: isDemo 
          ? 'rgba(254, 243, 199, 0.7)' // Lighter yellow
          : 'rgba(14, 165, 233, 0.7)', // Blue for real
        borderColor: isDemo 
          ? 'rgba(234, 179, 8, 1)' 
          : 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: isDemo 
          ? 'Demo Service Trends (Sample Data)' 
          : 'Service Booking Trends',
        color: isDemo ? '#92400e' : '#111827', // Different text color for demo
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={isDemo ? 'opacity-90' : ''}>
      <Bar options={options} data={data} />
      {isDemo && (
        <div className="mt-2 text-xs text-center text-yellow-600">
          Chart displays sample data for demonstration purposes
        </div>
      )}
    </div>
  );
};

export default ServiceTrendChart;