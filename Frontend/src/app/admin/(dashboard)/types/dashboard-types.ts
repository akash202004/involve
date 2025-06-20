export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    joinDate: Date;
    bookings: number;
  }
  
  export interface Worker {
    id: string;
    name: string;
    email: string;
    phone: string;
    serviceType: 'mechanic' | 'electrician' | 'plumber' | 'other';
    rating: number;
    jobsCompleted: number;
    joinDate: Date;
  }
  
  export interface Review {
    id: string;
    userId: string;
    userName: string;
    workerId: string;
    workerName: string;
    rating: number;
    comment: string;
    date: Date;
    serviceType: string;
  }
  
  export interface ServiceTrend {
    serviceType: string;
    count: number;
    growth: number;
  }
  
  export interface GrowthData {
    current: number;
    previous: number;
    change: number;
  }
  
  export interface DashboardStats {
    totalUsers: GrowthData;
    totalWorkers: GrowthData;
    totalBookings: GrowthData;
    trendingServices: ServiceTrend[];
    recentReviews: Review[];
  }