// Performance testing utility for measuring page load times and performance metrics
import React, { useRef, useEffect } from 'react';

export interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const measurePagePerformance = (): PerformanceMetrics => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  const firstPaint = paint.find(entry => entry.name === 'first-paint');
  const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint');
  
  return {
    pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
    timeToInteractive: navigation.domInteractive - navigation.fetchStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : 0,
    largestContentfulPaint: 0, // Would need to be measured over time
    cumulativeLayoutShift: 0, // Would need to be measured over time
    firstInputDelay: 0, // Would need to be measured over time
  };
};

export const logPerformanceMetrics = (pageName: string) => {
  const metrics = measurePagePerformance();
  
  console.log(`🚀 Performance Metrics for ${pageName}:`, {
    'Page Load Time': `${metrics.pageLoadTime.toFixed(2)}ms`,
    'Time to Interactive': `${metrics.timeToInteractive.toFixed(2)}ms`,
    'DOM Content Loaded': `${metrics.domContentLoaded.toFixed(2)}ms`,
    'First Contentful Paint': `${metrics.firstContentfulPaint.toFixed(2)}ms`,
  });
  
  // Log performance grade
  const grade = getPerformanceGrade(metrics);
  console.log(`📊 Performance Grade: ${grade}`);
  
  return metrics;
};

export const getPerformanceGrade = (metrics: PerformanceMetrics): string => {
  const { timeToInteractive, firstContentfulPaint } = metrics;
  
  if (timeToInteractive < 2000 && firstContentfulPaint < 1500) {
    return 'A+ (Excellent)';
  } else if (timeToInteractive < 3500 && firstContentfulPaint < 2500) {
    return 'A (Good)';
  } else if (timeToInteractive < 5000 && firstContentfulPaint < 4000) {
    return 'B (Average)';
  } else if (timeToInteractive < 7000 && firstContentfulPaint < 6000) {
    return 'C (Poor)';
  } else {
    return 'D (Very Poor)';
  }
};

export const measureComponentRenderTime = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    console.log(`⚡ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    
    if (renderTime > 16) {
      console.warn(`⚠️ ${componentName} render time exceeds 16ms (60fps threshold)`);
    }
    
    return renderTime;
  };
};

export const measureAsyncOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ ${operationName} completed in ${duration.toFixed(2)}ms`);
    
    if (duration > 1000) {
      console.warn(`⚠️ ${operationName} took longer than 1 second`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};

// Hook for measuring component performance
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    console.log(`⚡ ${componentName} mounted in ${renderTime.toFixed(2)}ms`);
    
    return () => {
      console.log(`🗑️ ${componentName} unmounted`);
    };
  }, [componentName]);
};

// Performance monitoring for React components
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const startTime = useRef(performance.now());
    
    useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      console.log(`⚡ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    });
    
    return <WrappedComponent {...props} />;
  });
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).performanceTest = {
    measurePagePerformance,
    logPerformanceMetrics,
    getPerformanceGrade,
    measureComponentRenderTime,
    measureAsyncOperation,
  };
} 