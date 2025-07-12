import { useCallback, useRef } from 'react';

interface UseOptimizedScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  debounceMs?: number;
}

export function useOptimizedScroll(options: UseOptimizedScrollOptions = {}) {
  const {
    behavior = 'instant',
    block = 'nearest',
    inline = 'nearest',
    debounceMs = 16
  } = options;
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastScrollTime = useRef<number>(0);
  
  const scrollToElement = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTime.current;
    
    // Clear any pending scroll
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // If we've scrolled recently, debounce it
    if (timeSinceLastScroll < debounceMs) {
      timeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior, block, inline });
          lastScrollTime.current = Date.now();
        });
      }, debounceMs - timeSinceLastScroll);
    } else {
      // Otherwise, scroll immediately
      requestAnimationFrame(() => {
        element.scrollIntoView({ behavior, block, inline });
        lastScrollTime.current = Date.now();
      });
    }
  }, [behavior, block, inline, debounceMs]);
  
  return scrollToElement;
} 