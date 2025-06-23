"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Award,
  AlertTriangle,
  Calendar,
  BarChart3,
  LayoutDashboard,
  FileText,
  Settings,
  MessageSquare,
  Shield,
  Briefcase,
  Smile,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./AdminDashboard.module.css";

import StatsCard from "./StatsCard";
import WorkerList from "./WorkerList";
import RevenueChart from "./RevenueChart";
import MonthlyOrdersChart from "./MonthlyOrdersChart";
import TopWorkersChart from "./TopWorkersChart";
import ComplaintsList from "./ComplaintsList";
import DiscountStats from "./DiscountStats";

const GlobeSkeleton = () => (
  <div className={styles.globeSkeleton}>
    <div className={styles.scanner}></div>
    <p>Loading Planetary Grid...</p>
  </div>
);

const UserMap = dynamic(() => import("./UserMap"), {
  ssr: false,
  loading: () => <GlobeSkeleton />,
});

const mockData = {
  totalRevenue: 125000,
  platformRevenue: 12500,
  avgJobValue: 534,
  activeJobs: 18,
  userGrowth: 15,
  workerGrowth: 8,
  customerSatisfaction: 92,
  jobCompletionRate: 98,
  totalWorkers: 45,
  topWorkers: [
    {
      name: "John Doe",
      income: 15000,
      orders: 45,
      rating: 4.9,
      completionRate: 99,
    },
    {
      name: "Jane Smith",
      income: 14200,
      orders: 42,
      rating: 4.8,
      completionRate: 97,
    },
    {
      name: "Mike Johnson",
      income: 13800,
      orders: 38,
      rating: 4.8,
      completionRate: 96,
    },
    {
      name: "Sarah Wilson",
      income: 13200,
      orders: 35,
      rating: 4.7,
      completionRate: 98,
    },
    {
      name: "David Brown",
      income: 12800,
      orders: 32,
      rating: 4.9,
      completionRate: 100,
    },
  ],
  complaints: [
    {
      id: 1,
      workerName: "Mike Johnson",
      issue: "Late arrival",
      status: "Resolved" as const,
      date: "2024-07-15",
      priority: "Low",
    },
    {
      id: 2,
      workerName: "Chris Green",
      issue: "Poor service quality",
      status: "Pending" as const,
      date: "2024-07-14",
      priority: "High",
    },
    {
      id: 3,
      workerName: "Patricia White",
      issue: "Equipment damage",
      status: "Under Review" as const,
      date: "2024-07-13",
      priority: "Medium",
    },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 85000 },
    { month: "Feb", revenue: 95000 },
    { month: "Mar", revenue: 110000 },
    { month: "Apr", revenue: 105000 },
    { month: "May", revenue: 120000 },
    { month: "Jun", revenue: 125000 },
  ],
};

const mockLoginData = {
  monthly: [
    { label: "Week 1", logins: 120 },
    { label: "Week 2", logins: 180 },
    { label: "Week 3", logins: 150 },
    { label: "Week 4", logins: 210 },
  ],
  yearly: [
    { label: "Jan", logins: 400 },
    { label: "Feb", logins: 420 },
    { label: "Mar", logins: 480 },
    { label: "Apr", logins: 500 },
    { label: "May", logins: 530 },
    { label: "Jun", logins: 600 },
    { label: "Jul", logins: 650 },
    { label: "Aug", logins: 700 },
    { label: "Sep", logins: 670 },
    { label: "Oct", logins: 720 },
    { label: "Nov", logins: 750 },
    { label: "Dec", logins: 800 },
  ],
};

function UserLoginChart({
  data,
}: {
  data: { label: string; logins: number }[];
}) {
  return (
    <div style={{ width: "100%", height: 90, marginBottom: 12 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="label"
            stroke="#a1a1aa"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis hide domain={[0, "dataMax + 50"]} />
          <Tooltip
            content={({ active, payload }) =>
              active && payload && payload.length ? (
                <div
                  style={{
                    background: "#18181b",
                    color: "#fff",
                    borderRadius: 8,
                    padding: 6,
                    fontSize: 12,
                  }}
                >
                  Logins: <b>{payload[0].value}</b>
                </div>
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="logins"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const Sidebar = () => (
  <motion.aside className={styles.sidebar} variants={itemVariants}>
    <h2>
      <Shield />
      Admin Panel
    </h2>
    <nav className={styles.nav}>
      <a href="#" className={styles.active}>
        <LayoutDashboard />
        Dashboard
      </a>
      <a href="#">
        <Users />
        Workers
      </a>
      <a href="#">
        <FileText />
        Reports
      </a>
      <a href="#">
        <MessageSquare />
        Complaints
      </a>
      <a href="#">
        <Settings />
        Settings
      </a>
    </nav>
  </motion.aside>
);

const MainContent = ({
  data,
  isLoading,
  loginView,
  setLoginView,
}: {
  data: any;
  isLoading: boolean;
  loginView: "monthly" | "yearly";
  setLoginView: (v: "monthly" | "yearly") => void;
}) => {
  const Metric = ({
    title,
    value,
    change,
  }: {
    title: string;
    value: string;
    change?: string;
  }) => (
    <div className={styles.metric}>
      <h3 className={styles.metricTitle}>{title}</h3>
      <p className={styles.metricValue}>{value}</p>
      {change && (
        <p
          className={`${styles.metricChange} ${
            change.startsWith("+") ? styles.positive : styles.negative
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );

  const cardContent = (
    <>
      <motion.div className={styles.header} variants={itemVariants}>
        <h1 className={styles.headerTitle}>Overview</h1>
        <div className={styles.timePeriodSelector}>
          <button className={styles.timeButtonActive}>1M</button>
          <button className={styles.timeButton}>6M</button>
          <button className={styles.timeButton}>1Y</button>
          <button className={styles.timeButton}>All</button>
        </div>
      </motion.div>

      <motion.div className={styles.metricsGrid} variants={containerVariants}>
        <Metric
          title="Total Revenue"
          value={`₹${data.totalRevenue.toLocaleString()}`}
          change="+12.5%"
        />
        <Metric
          title="Platform Revenue"
          value={`₹${data.platformRevenue.toLocaleString()}`}
          change="+10.2%"
        />
        <Metric
          title="Avg. Job Value"
          value={`₹${data.avgJobValue.toLocaleString()}`}
          change="-1.8%"
        />
        <Metric title="Active Jobs" value={data.activeJobs} />
      </motion.div>

      <motion.div className={styles.mainGrid} variants={containerVariants}>
        <motion.div
          className={`${styles.card} ${styles.revenueCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Revenue Growth</h2>
          </div>
          <div className={styles.chartWrapper}>
            <RevenueChart data={data.monthlyRevenue} />
          </div>
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.topWorkersCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top Performers</h2>
            <a href="#" className={styles.viewAllLink}>
              View all
            </a>
          </div>
          <TopWorkersChart data={data.topWorkers} />
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.growthCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Platform Growth</h2>
          </div>
          <div className={styles.growthMetrics}>
            <div className={styles.growthItem}>
              <div className={styles.growthIcon}>
                <Users />
              </div>
              <div>
                <div className={styles.growthMetricLabel}>New Users</div>
                <div className={styles.growthMetricValue}>
                  {data.userGrowth}%
                </div>
              </div>
            </div>
            <div className={styles.growthItem}>
              <div className={styles.growthIcon}>
                <Briefcase />
              </div>
              <div>
                <div className={styles.growthMetricLabel}>New Workers</div>
                <div className={styles.growthMetricValue}>
                  {data.workerGrowth}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.satisfactionCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Satisfaction & Completion</h2>
          </div>
          <div className={styles.growthMetrics}>
            <div className={styles.growthItem}>
              <div className={styles.growthIcon}>
                <Smile />
              </div>
              <div>
                <p className={styles.growthLabel}>Customer Satisfaction</p>
                <p className={styles.growthValue}>
                  {data.customerSatisfaction}%
                </p>
              </div>
            </div>
            <div className={styles.growthItem}>
              <div className={styles.growthIcon}>
                <CheckCircle />
              </div>
              <div>
                <p className={styles.growthLabel}>Job Completion</p>
                <p className={styles.growthValue}>{data.jobCompletionRate}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.complaintsCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Complaints</h2>
            <a href="#" className={styles.viewAllLink}>
              View all
            </a>
          </div>
          <ComplaintsList complaints={data.complaints} />
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.quickInsightsCard}`}
          variants={itemVariants}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Quick Insights</h2>
          </div>
          <div className={styles.loginChartToggleRow}>
            <div className={styles.loginChartToggleGroup}>
              <button
                className={
                  loginView === "monthly" ? styles.toggleActive : styles.toggle
                }
                onClick={() => setLoginView("monthly")}
              >
                Monthly
              </button>
              <button
                className={
                  loginView === "yearly" ? styles.toggleActive : styles.toggle
                }
                onClick={() => setLoginView("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>
          <UserLoginChart
            data={mockLoginData[loginView as "monthly" | "yearly"]}
          />
          <ul className={styles.insightsList}>
            <li>
              <strong>Best Month:</strong>{" "}
              {
                data.monthlyRevenue.reduce(
                  (
                    best: { month: string; revenue: number },
                    curr: { month: string; revenue: number }
                  ) => (curr.revenue > best.revenue ? curr : best),
                  data.monthlyRevenue[0]
                ).month
              }
            </li>
            <li>
              <strong>Most Active Worker:</strong> {data.topWorkers[0].name}
            </li>
            <li>
              <strong>Highest Job Value:</strong> ₹{data.avgJobValue * 2}
            </li>
            <li>
              <strong>Open Complaints:</strong> {data.complaints.length}
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </>
  );

  const skeletonLoader = (
    <div className={styles.loadingState}>
      <p>Loading Dashboard...</p>
    </div>
  );

  return (
    <motion.main
      className={styles.mainContent}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {isLoading ? skeletonLoader : cardContent}
    </motion.main>
  );
};

export default function AdminDashboard() {
  const [data, setData] = useState(mockData);
  const [isLoading, setIsLoading] = useState(true);
  const [loginView, setLoginView] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainContent
      data={data}
      isLoading={isLoading}
      loginView={loginView}
      setLoginView={setLoginView}
    />
  );
}
