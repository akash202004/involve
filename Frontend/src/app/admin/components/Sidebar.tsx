'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, MessageSquare, Settings, Shield } from 'lucide-react';
import styles from './AdminDashboard.module.css';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/workers', label: 'Workers', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/complaints', label: 'Complaints', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <motion.aside className={`${styles.sidebar} mt-14`} >
      <div className='flex items-center p-5'>
      <Shield />
      <p className='text-xl font-bold'>Admin Panel</p>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar; 