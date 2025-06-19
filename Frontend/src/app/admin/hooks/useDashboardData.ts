'use client'
import { useEffect, useState } from 'react';
import { DashboardStats, User, Worker, Review } from '../types/dashboard-types';

const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls to your backend
        const statsResponse = await fetch('/api/admin/stats');
        const statsData = await statsResponse.json();
        
        const usersResponse = await fetch('/api/admin/users');
        const usersData = await usersResponse.json();
        
        const workersResponse = await fetch('/api/admin/workers');
        const workersData = await workersResponse.json();
        
        const reviewsResponse = await fetch('/api/admin/reviews');
        const reviewsData = await reviewsResponse.json();

        setStats(statsData);
        setUsers(usersData);
        setWorkers(workersData);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, users, workers, reviews, loading, error };
};

export default useDashboardData;