import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiCalendar,
  FiCreditCard,
  FiCheck,
  FiX,
  FiSearch,
  FiLoader,
} from "react-icons/fi";

// Modern Card Component with Hover Effects
export const ModernCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}> = ({ children, className = "", onClick, hover = true }) => {
  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              scale: 1.02,
            }
          : {}
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      layout
    >
      {children}
    </motion.div>
  );
};

// Modern Button Component
export const ModernButton: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  className = "",
  icon,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
    outline:
      "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mr-2"
        >
          <FiLoader className="w-4 h-4" />
        </motion.div>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

// Modern Input Component
export const ModernInput: React.FC<{
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  icon,
  className = "",
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <motion.input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-xl transition-all duration-300
            ${icon ? "pl-10" : ""}
            ${
              isFocused
                ? "border-yellow-500 ring-4 ring-yellow-500 ring-opacity-20"
                : "border-gray-200 hover:border-gray-300"
            }
            ${error ? "border-red-500" : ""}
            ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
            focus:outline-none
          `}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
        {error && (
          <motion.p
            className="text-red-500 text-sm mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
};

// Modern Select Component
export const ModernSelect: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder?: string;
  className?: string;
}> = ({ label, value, onChange, options, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-left hover:border-gray-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-20 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <span className={value ? "text-gray-900" : "text-gray-500"}>
              {value
                ? options.find((opt) => opt.value === value)?.label
                : placeholder}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiX className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  {option.icon && (
                    <span className="text-gray-400">{option.icon}</span>
                  )}
                  <span
                    className={
                      option.value === value
                        ? "text-yellow-600 font-medium"
                        : "text-gray-700"
                    }
                  >
                    {option.label}
                  </span>
                  {option.value === value && (
                    <FiCheck className="ml-auto w-4 h-4 text-yellow-600" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Modern Address Input with Auto-complete
export const ModernAddressInput: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (address: any) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
}> = ({
  label,
  value,
  onChange,
  onAddressSelect,
  placeholder,
  className = "",
  loading = false,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (inputValue: string) => {
    onChange(inputValue);

    if (inputValue.length > 2) {
      setIsLoading(true);
      try {
        // Simulate address search - replace with actual API call
        const mockSuggestions = [
          { id: 1, label: `${inputValue}, City, State`, value: inputValue },
          { id: 2, label: `${inputValue} Street, City`, value: inputValue },
          { id: 3, label: `${inputValue} Avenue, City`, value: inputValue },
        ];
        setSuggestions(mockSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FiMapPin className="w-5 h-5" />
        </div>
        <ModernInput
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder || "Enter your address"}
          className="pl-10"
        />

        {(isLoading || loading) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FiLoader className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  onClick={() => {
                    onChange(suggestion.label);
                    onAddressSelect?.(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{suggestion.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Modern Progress Steps Component
export const ModernProgressSteps: React.FC<{
  steps: { id: string; label: string; icon?: React.ReactNode }[];
  currentStep: number;
  className?: string;
}> = ({ steps, currentStep, className = "" }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              {index < currentStep ? (
                <FiCheck className="w-5 h-5" />
              ) : (
                step.icon || index + 1
              )}
            </motion.div>
            <motion.span
              className={`
                text-xs mt-2 text-center max-w-20
                ${index <= currentStep ? "text-gray-900" : "text-gray-500"}
              `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            >
              {step.label}
            </motion.span>
          </div>

          {index < steps.length - 1 && (
            <motion.div
              className={`
                w-16 h-0.5 mx-4
                ${index < currentStep ? "bg-green-500" : "bg-gray-200"}
              `}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Modern Notification Component
export const ModernNotification: React.FC<{
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}> = ({ type, title, message, onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const icons = {
    success: <FiCheck className="w-5 h-5" />,
    error: <FiX className="w-5 h-5" />,
    warning: <FiX className="w-5 h-5" />,
    info: <FiX className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl border-2 shadow-lg max-w-sm ${colors[type]}`}
        >
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 ${iconColors[type]}`}>
              {icons[type]}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
            </div>
            {onClose && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
