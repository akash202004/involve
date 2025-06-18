"use client";

import styles from './dashboard.module.css';
import { FiSun, FiMoon } from 'react-icons/fi';

interface ThemeToggleProps {
  theme: string;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button className={styles.themeToggleButton} onClick={onToggle} title="Toggle Theme">
      {theme === 'light' ? <FiMoon /> : <FiSun />}
    </button>
  );
}