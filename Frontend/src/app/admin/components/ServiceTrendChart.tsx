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
}

const ServiceTrendChart: React.FC<ServiceTrendChartProps> = ({ services }) => {
  const data = {
    labels: services.map(service => service.serviceType),
    datasets: [
      {
        label: 'Bookings',
        data: services.map(service => service.count),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
      {
        label: 'Growth %',
        data: services.map(service => service.growth),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
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
        text: 'Service Trends & Growth',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default ServiceTrendChart;