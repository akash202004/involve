'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Ticket, Clock, AlertTriangle, ChevronDown } from 'lucide-react';
import styles from '../components/AdminDashboard.module.css';
import complaintStyles from './complaints.module.css';

const mockComplaints = [
    { id: 'C-001', subject: 'Service not as described', user: 'Alice Martin', worker: 'John Doe', date: '2024-07-20', priority: 'High', status: 'Open' },
    { id: 'C-002', subject: 'Worker arrived late', user: 'Bob Johnson', worker: 'Jane Smith', date: '2024-07-19', priority: 'Medium', status: 'In Progress' },
    { id: 'C-003', subject: 'Item damaged during service', user: 'Charlie Brown', worker: 'Mike Johnson', date: '2024-07-18', priority: 'High', status: 'Open' },
    { id: 'C-004', subject: 'Billing discrepancy', user: 'Diana Prince', worker: 'Sarah Wilson', date: '2024-07-18', priority: 'Low', status: 'Resolved' },
    { id: 'C-005', subject: 'Unprofessional behavior', user: 'Eve Adams', worker: 'David Brown', date: '2024-07-17', priority: 'Medium', status: 'Resolved' },
];

const ComplaintStat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className={complaintStyles.statCard}>
        <div className={complaintStyles.statIcon}>{icon}</div>
        <div>
            <p className={complaintStyles.statLabel}>{label}</p>
            <p className={complaintStyles.statValue}>{value}</p>
        </div>
    </div>
);

const ComplaintsTable = ({ complaints }: { complaints: typeof mockComplaints }) => {
    
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Open': return complaintStyles.statusOpen;
            case 'In Progress': return complaintStyles.statusInProgress;
            case 'Resolved': return complaintStyles.statusResolved;
            default: return '';
        }
    };
    
    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'High': return complaintStyles.priorityHigh;
            case 'Medium': return complaintStyles.priorityMedium;
            case 'Low': return complaintStyles.priorityLow;
            default: return '';
        }
    };

    return (
        <div className={complaintStyles.tableContainer}>
            <table className={complaintStyles.table}>
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Subject</th>
                        <th>Customer / Worker</th>
                        <th>Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map(item => (
                        <tr key={item.id}>
                            <td className={complaintStyles.ticketId}>{item.id}</td>
                            <td>{item.subject}</td>
                            <td>
                                <div className={complaintStyles.userWorkerCell}>
                                    <span>{item.user}</span>
                                    <span className={complaintStyles.workerName}>{item.worker}</span>
                                </div>
                            </td>
                            <td>{item.date}</td>
                            <td>
                                <span className={`${complaintStyles.priorityBadge} ${getPriorityClass(item.priority)}`}>
                                    {item.priority}
                                </span>
                            </td>
                            <td>
                                <span className={`${complaintStyles.statusBadge} ${getStatusClass(item.status)}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td>
                                <button className={complaintStyles.actionButton}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function ComplaintsPage() {
    const [complaints] = useState(mockComplaints);
  
    return (
      <motion.main 
        className={styles.mainContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
            <h1 className={styles.headerTitle}>Complaints</h1>
        </div>
        
        <div className={complaintStyles.statsGrid}>
            <ComplaintStat icon={<Ticket/>} label="Open Tickets" value={complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length} />
            <ComplaintStat icon={<Clock/>} label="Avg. Resolution Time" value="2.1 Days" />
            <ComplaintStat icon={<AlertTriangle/>} label="High Priority" value={complaints.filter(c => c.priority === 'High').length} />
        </div>
        
        <div className={`${styles.card} ${complaintStyles.card}`}>
            <div className={complaintStyles.cardHeader}>
                <div className={complaintStyles.searchContainer}>
                    <Search className={complaintStyles.searchIcon} />
                    <input type="text" placeholder="Search by subject, user, or worker..." className={complaintStyles.searchInput} />
                </div>
                <div className={complaintStyles.filters}>
                    <button className={complaintStyles.filterButton}>Status <ChevronDown size={16}/></button>
                    <button className={complaintStyles.filterButton}>Priority <ChevronDown size={16}/></button>
                </div>
            </div>
            <ComplaintsTable complaints={complaints} />
        </div>

      </motion.main>
    );
  } 