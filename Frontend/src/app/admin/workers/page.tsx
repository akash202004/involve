'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, SlidersHorizontal, Users, Briefcase, Star } from 'lucide-react';
import styles from '../components/AdminDashboard.module.css';
import workerStyles from './workers.module.css';

const mockWorkers = [
    { id: 1, name: 'John Doe', jobs: 45, rating: 4.9, status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', jobs: 42, rating: 4.8, status: 'Active', joinDate: '2023-02-20' },
    { id: 3, name: 'Mike Johnson', jobs: 38, rating: 4.8, status: 'On Break', joinDate: '2023-03-10' },
    { id: 4, name: 'Sarah Wilson', jobs: 35, rating: 4.7, status: 'Active', joinDate: '2023-04-05' },
    { id: 5, name: 'David Brown', jobs: 32, rating: 4.9, status: 'Inactive', joinDate: '2023-05-12' },
    { id: 6, name: 'Emily Davis', jobs: 28, rating: 4.6, status: 'Active', joinDate: '2023-06-18' },
    { id: 7, name: 'Chris Green', jobs: 25, rating: 4.5, status: 'Active', joinDate: '2023-07-22' },
];

const WorkerStat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className={workerStyles.statCard}>
        <div className={workerStyles.statIcon}>{icon}</div>
        <div>
            <p className={workerStyles.statLabel}>{label}</p>
            <p className={workerStyles.statValue}>{value}</p>
        </div>
    </div>
);

const WorkersTable = ({ workers }: { workers: typeof mockWorkers }) => {
    
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return workerStyles.statusActive;
            case 'On Break': return workerStyles.statusOnBreak;
            case 'Inactive': return workerStyles.statusInactive;
            default: return '';
        }
    };

    return (
        <div className={workerStyles.tableContainer}>
            <table className={workerStyles.table}>
                <thead>
                    <tr>
                        <th>Worker</th>
                        <th>Jobs Completed</th>
                        <th>Avg. Rating</th>
                        <th>Joined Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {workers.map(worker => (
                        <tr key={worker.id}>
                            <td>{worker.name}</td>
                            <td>{worker.jobs}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Star className={workerStyles.starIcon} /> {worker.rating.toFixed(1)}
                                </div>
                            </td>
                            <td>{worker.joinDate}</td>
                            <td>
                                <span className={`${workerStyles.statusBadge} ${getStatusClass(worker.status)}`}>
                                    {worker.status}
                                </span>
                            </td>
                            <td>
                                <button className={workerStyles.actionButton}>View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default function WorkersPage() {
    const [workers] = useState(mockWorkers);
  
    return (
      <motion.main 
        className={styles.mainContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
            <h1 className={styles.headerTitle}>Workers Management</h1>
            <div className={workerStyles.headerActions}>
                <button className={workerStyles.addUserButton}><UserPlus/> Add Worker</button>
            </div>
        </div>

        <div className={workerStyles.statsGrid}>
            <WorkerStat icon={<Users/>} label="Total Workers" value={workers.length} />
            <WorkerStat icon={<Briefcase/>} label="Active Workers" value={workers.filter(w => w.status === 'Active').length} />
            <WorkerStat icon={<Star/>} label="Avg. Rating" value="4.7" />
        </div>
        
        <div className={`${styles.card} ${workerStyles.card}`}>
            <div className={workerStyles.cardHeader}>
                <div className={workerStyles.searchContainer}>
                    <Search className={workerStyles.searchIcon} />
                    <input type="text" placeholder="Search for workers..." className={workerStyles.searchInput} />
                </div>
                <button className={workerStyles.filterButton}><SlidersHorizontal/> Filters</button>
            </div>
            
            <WorkersTable workers={workers} />
        </div>

      </motion.main>
    );
  } 