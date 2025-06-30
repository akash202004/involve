"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import styles from './dashboard.module.css';

interface ThemeToggleProps {
  theme: string;
  onToggle: () => void;
  disabled?: boolean;
}

export default function ThemeToggle({ 
  theme, 
  onToggle,
  disabled = false
}: ThemeToggleProps) {
  return (
    <button 
      className={`${styles.iconButton} ${styles.themeToggle}`} 
      onClick={onToggle}
      disabled={disabled}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <FiMoon /> : <FiSun />}
    </button>
  );
}