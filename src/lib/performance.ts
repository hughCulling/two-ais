// Performance monitoring utilities for tracking reflow issues

interface PerformanceMetrics {
  reflowCount: number;
  reflowTime: number;
  lastReflowTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    reflowCount: 0,
    reflowTime: 0,
    lastReflowTime: 0
  };

  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initObserver();
  }

  private initObserver() {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        this.observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'measure') {
              const measure = entry as PerformanceMeasure;
              if (measure.name.includes('reflow') || measure.name.includes('layout')) {
                this.metrics.reflowCount++;
                this.metrics.reflowTime += measure.duration;
                this.metrics.lastReflowTime = measure.startTime;
                
                // Log significant reflows
                if (measure.duration > 16) { // More than one frame
                  console.warn(`Performance: Significant reflow detected`, {
                    name: measure.name,
                    duration: measure.duration,
                    startTime: measure.startTime
                  });
                }
              }
            }
          });
        });

        this.observer.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  }

  public startMeasure(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  public endMeasure(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public reset() {
    this.metrics = {
      reflowCount: 0,
      reflowTime: 0,
      lastReflowTime: 0
    };
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility function to measure layout operations
export function measureLayout<T>(name: string, operation: () => T): T {
  performanceMonitor.startMeasure(name);
  try {
    return operation();
  } finally {
    performanceMonitor.endMeasure(name);
  }
}

// Utility function to batch layout operations
export function batchLayoutOperations(operations: (() => void)[]) {
  requestAnimationFrame(() => {
    operations.forEach(operation => operation());
  });
}

// Utility function to debounce layout operations
export function debounceLayout<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      requestAnimationFrame(() => func(...args));
    }, wait);
  }) as T;
} 