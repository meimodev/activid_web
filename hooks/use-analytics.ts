'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEngagement } from '@/lib/analytics';

/**
 * Hook to track scroll depth on a page
 * Reports at 25%, 50%, 75%, and 100% scroll milestones
 */
export function useScrollDepthTracking() {
  const pathname = usePathname();
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Reset tracked depths when page changes
    trackedDepths.current = new Set();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = Math.round((scrollTop / docHeight) * 100);

      // Track at 25%, 50%, 75%, 100% milestones
      const milestones = [25, 50, 75, 100];

      for (const milestone of milestones) {
        if (scrollPercentage >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          trackEngagement.scrollDepth(pathname || 'unknown', milestone);
        }
      }
    };

    // Debounce scroll handler
    let timeoutId: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname]);
}

/**
 * Hook to track time spent on page
 * Reports time when user leaves the page
 */
export function useTimeOnPageTracking() {
  const pathname = usePathname();
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackEngagement.timeOnPage(pathname || 'unknown', timeSpent);
      } else {
        // Reset timer when page becomes visible again
        startTime.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackEngagement.timeOnPage(pathname || 'unknown', timeSpent);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);
}

/**
 * Hook to track when an element enters the viewport
 * Useful for tracking section views
 */
export function useInViewTracking(
  ref: React.RefObject<HTMLElement | null>,
  trackingCallback: () => void,
  options?: IntersectionObserverInit
) {
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            trackingCallback();
          }
        });
      },
      {
        threshold: 0.3,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, trackingCallback, options]);
}

/**
 * Hook that returns a click handler for tracking external links
 */
export function useExternalLinkTracking() {
  return useCallback((url: string, linkText: string) => {
    trackEngagement.externalLinkClick(url, linkText);
  }, []);
}

/**
 * Hook that returns a click handler for tracking video plays
 */
export function useVideoPlayTracking() {
  return useCallback((videoTitle: string, videoLocation: string) => {
    trackEngagement.videoPlay(videoTitle, videoLocation);
  }, []);
}
