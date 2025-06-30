import React from "react";
import styles from "./GoLiveButton.module.css";
import { FiRadio } from "react-icons/fi";

interface GoLiveButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const GoLiveButton: React.FC<GoLiveButtonProps> = ({ onClick, children, style, className, disabled }) => (
  <button
    type="button"
    className={`${styles.goLiveButton} ${className || ""}`.trim()}
    onClick={onClick}
    style={style}
    disabled={disabled}
  >
    <FiRadio style={{ marginRight: 6, fontSize: "1.1em" }} />
    {children || "Go Live"}
  </button>
);

export default GoLiveButton; 