'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Download, ChevronDown, BarChart2, Users, DollarSign, PieChart } from 'lucide-react';
import styles from '../components/AdminDashboard.module.css';
import reportStyles from './reports.module.css';

const reportTemplates = [
    { title: 'Financial Summary', icon: PieChart, description: 'Revenue, expenses, and profit over a selected period.' },
    { title: 'Worker Payroll', icon: DollarSign, description: 'Detailed breakdown of payments to all workers.' },
    { title: 'User Growth', icon: Users, description: 'Analysis of new user acquisition and retention.' },
    { title: 'Job Completion', icon: BarChart2, description: 'Statistics on completed, canceled, and pending jobs.' },
];

const mockReports = [
    { id: 1, name: 'Q2 2024 Financial Summary', type: 'Financial', date: '2024-07-01', format: 'PDF', status: 'Completed' },
    { id: 2, name: 'June 2024 Worker Performance', type: 'Worker', date: '2024-07-01', format: 'CSV', status: 'Completed' },
    { id: 3, name: 'User Growth Report (July)', type: 'User', date: 'In Progress', format: 'PDF', status: 'Generating' },
    { id: 4, name: 'Q1 2024 Financial Summary', type: 'Financial', date: '2024-04-01', format: 'PDF', status: 'Completed' },
];

const ReportsTable = ({ reports }: { reports: typeof mockReports }) => (
    <div className={reportStyles.tableContainer}>
        <table className={reportStyles.table}>
            <thead>
                <tr>
                    <th>Report Name</th>
                    <th>Date</th>
                    <th>Format</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {reports.map(report => (
                    <tr key={report.id}>
                        <td className={reportStyles.reportNameCell}>
                            <FileText size={16} />
                            {report.name}
                        </td>
                        <td>{report.date}</td>
                        <td>
                            <span className={`${reportStyles.formatBadge} ${report.format === 'PDF' ? reportStyles.formatPdf : reportStyles.formatCsv}`}>
                                {report.format}
                            </span>
                        </td>
                        <td>
                            <span className={`${reportStyles.statusBadge} ${report.status === 'Completed' ? reportStyles.statusCompleted : reportStyles.statusGenerating}`}>
                                {report.status}
                            </span>
                        </td>
                        <td>
                            {report.status === 'Completed' && (
                                <button className={reportStyles.downloadButton}><Download size={16}/> Download</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export default function ReportsPage() {
    const [reports] = useState(mockReports);
  
    return (
      <motion.main 
        className={styles.mainContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
            <h1 className={styles.headerTitle}>Reports & Analytics</h1>
        </div>
        
        <div className={reportStyles.templatesContainer}>
            <h2 className={reportStyles.sectionTitle}>Start with a template</h2>
            <div className={reportStyles.templatesGrid}>
                {reportTemplates.map(template => (
                    <div key={template.title} className={reportStyles.templateCard}>
                        <div className={reportStyles.templateIcon}><template.icon /></div>
                        <h3 className={reportStyles.templateTitle}>{template.title}</h3>
                        <p className={reportStyles.templateDescription}>{template.description}</p>
                        <button className={reportStyles.templateButton}>Generate <ChevronDown size={14}/></button>
                    </div>
                ))}
            </div>
        </div>

        <div className={reportStyles.recentReportsContainer}>
            <div className={reportStyles.sectionHeader}>
                <h2 className={reportStyles.sectionTitle}>Recent Reports</h2>
                <button className={reportStyles.viewAllButton}>View All</button>
            </div>
            <div className={`${styles.card} ${reportStyles.card}`}>
                <ReportsTable reports={reports} />
            </div>
        </div>

      </motion.main>
    );
} 