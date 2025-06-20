'use client';
import { useEffect, useState } from 'react';
import { DashboardStats, User, Worker, Review } from '../(dashboard)/types/dashboard-types';

// Dummy data generators
const generateDummyUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
    bookings: Math.floor(Math.random() * 20),
  }));
};

const generateDummyWorkers = (count: number): Worker[] => {
  const serviceTypes = ['mechanic', 'electrician', 'plumber', 'carpenter', 'cleaner'];
  return Array.from({ length: count }, (_, i) => ({
    id: `worker-${i + 1}`,
    name: `Worker ${i + 1}`,
    email: `worker${i + 1}@example.com`,
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)] as any,
    rating: Number((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3.0 and 5.0
    jobsCompleted: Math.floor(Math.random() * 50),
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
  }));
};

const generateDummyReviews = (count: number, users: User[], workers: Worker[]): Review[] => {
  return Array.from({ length: count }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    const worker = workers[Math.floor(Math.random() * workers.length)];
    return {
      id: `review-${i + 1}`,
      userId: user.id,
      userName: user.name,
      workerId: worker.id,
      workerName: worker.name,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: [
        'Great service!',
        'Very professional',
        'Would recommend',
        'Arrived on time',
        'Fixed the issue quickly',
        'Fair pricing',
        'Excellent work',
      ][Math.floor(Math.random() * 7)],
      date: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
      serviceType: worker.serviceType,
    };
  });
};

const generateDummyStats = (users: User[], workers: Worker[], reviews: Review[]): DashboardStats => {
  const trendingServices = ['mechanic', 'electrician', 'plumber'].map(serviceType => {
    const count = reviews.filter(r => r.serviceType === serviceType).length;
    return {
      serviceType,
      count,
      growth: Math.floor(Math.random() * 100) - 20, // Random growth between -20% and 80%
    };
  });

  return {
    totalUsers: {
      current: users.length,
      previous: Math.floor(users.length * 0.8), // Assume 20% growth
      change: 20,
    },
    totalWorkers: {
      current: workers.length,
      previous: Math.floor(workers.length * 0.9), // Assume 10% growth
      change: 10,
    },
    totalBookings: {
      current: users.reduce((sum, user) => sum + user.bookings, 0),
      previous: Math.floor(users.reduce((sum, user) => sum + user.bookings, 0) * 0.85), // Assume 15% growth
      change: 15,
    },
    trendingServices,
    recentReviews: reviews.slice(0, 5),
  };
};

const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch real data first
        const [statsResponse, usersResponse, workersResponse, reviewsResponse] = await Promise.all([
          fetch('/api/admin/stats').then(res => res.ok ? res.json() : Promise.reject('Stats API failed')),
          fetch('/api/admin/users').then(res => res.ok ? res.json() : Promise.reject('Users API failed')),
          fetch('/api/admin/workers').then(res => res.ok ? res.json() : Promise.reject('Workers API failed')),
          fetch('/api/admin/reviews').then(res => res.ok ? res.json() : Promise.reject('Reviews API failed')),
        ]);

        setStats(statsResponse);
        setUsers(usersResponse);
        setWorkers(workersResponse);
        setReviews(reviewsResponse);
      } catch (err) {
        console.error('API failed, using dummy data:', err);
        setError('Failed to fetch dashboard data. Showing demo data instead.');
        setUsingDummyData(true);
        
        // Generate dummy data
        const dummyUsers = generateDummyUsers(50);
        const dummyWorkers = generateDummyWorkers(20);
        const dummyReviews = generateDummyReviews(100, dummyUsers, dummyWorkers);
        const dummyStats = generateDummyStats(dummyUsers, dummyWorkers, dummyReviews);
        
        setUsers(dummyUsers);
        setWorkers(dummyWorkers);
        setReviews(dummyReviews);
        setStats(dummyStats);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, users, workers, reviews, loading, error, usingDummyData };
};

export default useDashboardData;