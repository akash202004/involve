// src/app/worker/dashboard/ThemeToggle.tsx
"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import styles from './dashboard.module.css';

export default function ThemeToggle({ theme, onToggle }: { theme: string, onToggle: () => void }) {
    return (
        <button className={`${styles.iconButton} ${styles.themeToggle}`} onClick={onToggle} title="Toggle Theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
    );
}