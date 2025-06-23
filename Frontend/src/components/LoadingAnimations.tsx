import React from "react";

// Progress Bar Animation
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
}> = ({ progress, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
};

// Spinning Loader with Progress
export const SpinningProgress: React.FC<{
  progress: number;
  size?: "sm" | "md" | "lg";
}> = ({ progress, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

        {/* Progress circle */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin"
          style={{
            background: `conic-gradient(from 0deg, #f59e0b ${
              progress * 3.6
            }deg, transparent ${progress * 3.6}deg)`,
          }}
        ></div>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Pulsing Dots Animation
export const PulsingDots: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div
        className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
};

// Bouncing Balls Animation
export const BouncingBalls: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div
        className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
        style={{ animationDelay: "100ms" }}
      ></div>
      <div
        className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
        style={{ animationDelay: "200ms" }}
      ></div>
    </div>
  );
};

// Wave Animation
export const WaveAnimation: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div
        className="w-1 h-4 bg-yellow-500 rounded-full animate-pulse"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-1 h-4 bg-yellow-500 rounded-full animate-pulse"
        style={{ animationDelay: "100ms" }}
      ></div>
      <div
        className="w-1 h-4 bg-yellow-500 rounded-full animate-pulse"
        style={{ animationDelay: "200ms" }}
      ></div>
      <div
        className="w-1 h-4 bg-yellow-500 rounded-full animate-pulse"
        style={{ animationDelay: "300ms" }}
      ></div>
      <div
        className="w-1 h-4 bg-yellow-500 rounded-full animate-pulse"
        style={{ animationDelay: "400ms" }}
      ></div>
    </div>
  );
};

// Booking Progress Animation
export const BookingProgress: React.FC<{
  stage:
    | "initiating"
    | "getting-location"
    | "creating-user"
    | "creating-job"
    | "redirecting";
  className?: string;
}> = ({ stage, className = "" }) => {
  const stages = [
    { key: "initiating", label: "Initiating Booking", progress: 20 },
    { key: "getting-location", label: "Getting Location", progress: 40 },
    { key: "creating-user", label: "Setting Up User", progress: 60 },
    { key: "creating-job", label: "Creating Job", progress: 80 },
    { key: "redirecting", label: "Redirecting to Tracking", progress: 100 },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === stage);
  const currentProgress = stages[currentStageIndex]?.progress || 0;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {stages[currentStageIndex]?.label || "Processing..."}
        </h3>
      </div>

      <div className="space-y-3">
        <ProgressBar progress={currentProgress} />

        <div className="flex justify-center">
          <SpinningProgress progress={currentProgress} size="md" />
        </div>

        <div className="flex justify-center">
          <PulsingDots />
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex justify-between text-xs text-gray-500">
        {stages.map((s, index) => (
          <div
            key={s.key}
            className={`text-center ${
              index <= currentStageIndex ? "text-yellow-600" : ""
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                index <= currentStageIndex ? "bg-yellow-500" : "bg-gray-300"
              }`}
            ></div>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Page Load Animation
export const PageLoadAnimation: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
        <div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-yellow-400 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading...</h3>
        <WaveAnimation className="justify-center" />
      </div>
    </div>
  );
};

// Button Loading State
export const ButtonLoader: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Processing...</span>
    </div>
  );
};
