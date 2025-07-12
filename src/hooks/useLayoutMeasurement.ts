import { useCallback, useRef, useState } from 'react';

interface UseLayoutMeasurementOptions {
  debounceMs?: number;
  throttleMs?: number;
}

export function useLayoutMeasurement(options: UseLayoutMeasurementOptions = {}) {
  const { debounceMs = 16, throttleMs = 100 } = options;
  const [measurements, setMeasurements] = useState<{ width: number; height: number; scrollWidth: number; scrollHeight: number } | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastMeasureTime = useRef<number>(0);
  
  const measureElement = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    
    const now = Date.now();
    const timeSinceLastMeasure = now - lastMeasureTime.current;
    
    // Throttle measurements to prevent excessive reflows
    if (timeSinceLastMeasure < throttleMs) {
      return;
    }
    
    // Clear any pending measurement
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce the measurement
    timeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        if (element) {
          const rect = element.getBoundingClientRect();
          setMeasurements({
            width: rect.width,
            height: rect.height,
            scrollWidth: element.scrollWidth,
            scrollHeight: element.scrollHeight
          });
          lastMeasureTime.current = Date.now();
        }
      });
    }, debounceMs);
  }, [debounceMs, throttleMs]);
  
  const checkOverflow = useCallback((element: HTMLElement | null) => {
    if (!element) return false;
    
    const now = Date.now();
    const timeSinceLastMeasure = now - lastMeasureTime.current;
    
    // Throttle overflow checks
    if (timeSinceLastMeasure < throttleMs) {
      return measurements ? measurements.scrollWidth > measurements.width : false;
    }
    
    // Clear any pending measurement
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    return new Promise<boolean>((resolve) => {
      timeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          if (element) {
            const isOverflowing = element.scrollWidth > element.clientWidth;
            lastMeasureTime.current = Date.now();
            resolve(isOverflowing);
          } else {
            resolve(false);
          }
        });
      }, debounceMs);
    });
  }, [debounceMs, throttleMs, measurements]);
  
  return { measureElement, checkOverflow, measurements };
} 