'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

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

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, className }) => {
  return (
    <motion.div 
      className={`card statsCard ${className || ''}`}
      variants={itemVariants}
    >
      <div className="statsIcon">{icon}</div>
      <div>
        <p className="statsTitle">{title}</p>
        <p className="statsValue">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard; 