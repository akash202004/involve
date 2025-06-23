'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Moon, ShieldCheck, LogIn, Eye } from 'lucide-react';
import styles from '../components/AdminDashboard.module.css';
import settingsStyles from './settings.module.css';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <motion.main
      className={styles.mainContent}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Settings</h1>
      </div>

      <div className={settingsStyles.settingsGrid}>
        {/* Account Info */}
        <div className={`${styles.card} ${settingsStyles.card}`}>
          <h2 className={settingsStyles.sectionTitle}>Account Info</h2>
          <div className={settingsStyles.formGroup}>
            <label><User size={16}/> Name</label>
            <input className={settingsStyles.input} type="text" value="Admin User" readOnly />
          </div>
          <div className={settingsStyles.formGroup}>
            <label><Mail size={16}/> Email</label>
            <input className={settingsStyles.input} type="email" value="admin@example.com" readOnly />
          </div>
          <div className={settingsStyles.formGroup}>
            <label><Lock size={16}/> Password</label>
            <input className={settingsStyles.input} type="password" value="********" readOnly />
            <button className={settingsStyles.changeButton}>Change Password</button>
          </div>
        </div>

        {/* Platform Preferences */}
        <div className={`${styles.card} ${settingsStyles.card}`}>
          <h2 className={settingsStyles.sectionTitle}>Platform Preferences</h2>
          <div className={settingsStyles.preferenceRow}>
            <span><Bell size={16}/> Notifications</span>
            <label className={settingsStyles.switch}>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(v => !v)} />
              <span className={settingsStyles.slider}></span>
            </label>
          </div>
          <div className={settingsStyles.preferenceRow}>
            <span><Moon size={16}/> Dark Mode</span>
            <label className={settingsStyles.switch}>
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(v => !v)} />
              <span className={settingsStyles.slider}></span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className={`${styles.card} ${settingsStyles.card}`}>
          <h2 className={settingsStyles.sectionTitle}>Security</h2>
          <div className={settingsStyles.preferenceRow}>
            <span><ShieldCheck size={16}/> Two-Factor Authentication</span>
            <label className={settingsStyles.switch}>
              <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(v => !v)} />
              <span className={settingsStyles.slider}></span>
            </label>
          </div>
          <div className={settingsStyles.securityInfo}>
            <LogIn size={16}/> Last Login: <span>2024-07-20 14:32</span>
          </div>
          <div className={settingsStyles.securityInfo}>
            <Eye size={16}/> Last Password Change: <span>2024-06-10</span>
          </div>
        </div>
      </div>
    </motion.main>
  );
} 