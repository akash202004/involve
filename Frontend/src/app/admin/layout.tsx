import React from 'react';
import Sidebar from './components/Sidebar';
import styles from './components/AdminDashboard.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      {children}
    </div>
  );
} 