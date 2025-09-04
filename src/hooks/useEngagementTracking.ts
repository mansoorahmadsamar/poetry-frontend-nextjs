import { useCallback, useRef, useEffect, useState } from "react";
import { useAuth } from "@/stores/auth";
import { ActivityType, TargetType, TrackEngagementRequest } from "@/types/profile";

interface EngagementConfig {
  enableAutoTracking?: boolean;
  sessionId?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
}

export function useEngagementTracking(config: EngagementConfig = {}) {
  const { trackEngagement, isAuthenticated } = useAuth();
  const viewTimers = useRef<Map<string, number>>(new Map());
  const { enableAutoTracking = true, sessionId, deviceType = 'desktop' } = config;

  // Generate session ID if not provided - handle SSR
  const currentSessionId = useRef<string>();
  
  useEffect(() => {
    if (!currentSessionId.current) {
      currentSessionId.current = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }, [sessionId]);

  // Detect device type if not provided - use state to handle SSR
  const [detectedDeviceType, setDetectedDeviceType] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !deviceType) {
      const userAgent = window.navigator.userAgent;
      if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        setDetectedDeviceType('tablet');
      } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
        setDetectedDeviceType('mobile');
      } else {
        setDetectedDeviceType('desktop');
      }
    }
  }, [deviceType]);

  const currentDeviceType = deviceType || detectedDeviceType;

  // Track any engagement activity
  const track = useCallback(async (params: {
    activityType: ActivityType;
    targetType: TargetType;
    targetId: number;
    durationSeconds?: number;
    metadata?: Record<string, any>;
  }) => {
    if (!isAuthenticated || !enableAutoTracking) return;

    const engagementData: TrackEngagementRequest = {
      activityType: params.activityType,
      targetType: params.targetType,
      targetId: params.targetId,
      durationSeconds: params.durationSeconds,
      sessionId: currentSessionId.current || 'unknown',
      deviceType: currentDeviceType,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    };

    try {
      await trackEngagement(engagementData);
    } catch (error) {
      console.error('Failed to track engagement:', error);
    }
  }, [trackEngagement, isAuthenticated, enableAutoTracking, currentDeviceType]);

  // Track view start (returns cleanup function)
  const trackViewStart = useCallback((targetType: TargetType, targetId: number, metadata?: Record<string, any>) => {
    if (!isAuthenticated || !enableAutoTracking) return () => {};

    const key = `${targetType}_${targetId}`;
    const startTime = Date.now();
    
    viewTimers.current.set(key, startTime);

    // Return cleanup function to track view end
    return () => {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000);
      
      // Only track views longer than 3 seconds
      if (duration >= 3) {
        track({
          activityType: 'VIEW',
          targetType,
          targetId,
          durationSeconds: duration,
          metadata,
        });
      }
      
      viewTimers.current.delete(key);
    };
  }, [track, isAuthenticated, enableAutoTracking]);

  // Track like action
  const trackLike = useCallback(async (targetType: TargetType, targetId: number, metadata?: Record<string, any>) => {
    await track({
      activityType: 'LIKE',
      targetType,
      targetId,
      metadata,
    });
  }, [track]);

  // Track unlike action
  const trackUnlike = useCallback(async (targetType: TargetType, targetId: number, metadata?: Record<string, any>) => {
    await track({
      activityType: 'UNLIKE',
      targetType,
      targetId,
      metadata,
    });
  }, [track]);

  // Track bookmark action
  const trackBookmark = useCallback(async (targetType: TargetType, targetId: number, metadata?: Record<string, any>) => {
    await track({
      activityType: 'BOOKMARK',
      targetType,
      targetId,
      metadata,
    });
  }, [track]);

  // Track unbookmark action
  const trackUnbookmark = useCallback(async (targetType: TargetType, targetId: number, metadata?: Record<string, any>) => {
    await track({
      activityType: 'UNBOOKMARK',
      targetType,
      targetId,
      metadata,
    });
  }, [track]);

  // Track share action
  const trackShare = useCallback(async (targetType: TargetType, targetId: number, metadata?: Record<string, any>) => {
    await track({
      activityType: 'SHARE',
      targetType,
      targetId,
      metadata,
    });
  }, [track]);

  // Track search action
  const trackSearch = useCallback(async (query: string, metadata?: Record<string, any>) => {
    await track({
      activityType: 'SEARCH',
      targetType: 'USER', // Search doesn't have a specific target
      targetId: 0,
      metadata: { query, ...metadata },
    });
  }, [track]);

  // Track follow poet action
  const trackFollowPoet = useCallback(async (poetId: number, metadata?: Record<string, any>) => {
    await track({
      activityType: 'FOLLOW_POET',
      targetType: 'POET',
      targetId: poetId,
      metadata,
    });
  }, [track]);

  // Track unfollow poet action
  const trackUnfollowPoet = useCallback(async (poetId: number, metadata?: Record<string, any>) => {
    await track({
      activityType: 'UNFOLLOW_POET',
      targetType: 'POET',
      targetId: poetId,
      metadata,
    });
  }, [track]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Track any remaining view times
      viewTimers.current.forEach((startTime, key) => {
        const [targetType, targetId] = key.split('_');
        const duration = Math.floor((Date.now() - startTime) / 1000);
        
        if (duration >= 3) {
          track({
            activityType: 'VIEW',
            targetType: targetType as TargetType,
            targetId: parseInt(targetId),
            durationSeconds: duration,
          });
        }
      });
      
      viewTimers.current.clear();
    };
  }, [track]);

  return {
    track,
    trackViewStart,
    trackLike,
    trackUnlike,
    trackBookmark,
    trackUnbookmark,
    trackShare,
    trackSearch,
    trackFollowPoet,
    trackUnfollowPoet,
    sessionId: currentSessionId.current || 'unknown',
    deviceType: currentDeviceType,
  };
}

// Hook for automatic view tracking with intersection observer
export function useViewTracking(
  targetType: TargetType,
  targetId: number,
  options: {
    threshold?: number;
    rootMargin?: string;
    metadata?: Record<string, any>;
    enabled?: boolean;
  } = {}
) {
  const { trackViewStart } = useEngagementTracking();
  const elementRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  const {
    threshold = 0.5,
    rootMargin = '0px',
    metadata,
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        if (entry.isIntersecting) {
          // Start tracking when element comes into view
          if (!cleanupRef.current) {
            cleanupRef.current = trackViewStart(targetType, targetId, metadata);
          }
        } else {
          // Stop tracking when element leaves view
          if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [targetType, targetId, threshold, rootMargin, metadata, enabled, trackViewStart]);

  return elementRef;
}

// Hook for tracking user session behavior
export function useSessionTracking() {
  const sessionStartTime = useRef<number>();
  const pageViews = useRef(0);
  const { isAuthenticated } = useAuth();
  
  // Initialize session start time on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStartTime.current) {
      sessionStartTime.current = Date.now();
    }
  }, []);

  const getSessionDuration = useCallback(() => {
    if (!sessionStartTime.current) return 0;
    return Math.floor((Date.now() - sessionStartTime.current) / 1000);
  }, []);

  const incrementPageViews = useCallback(() => {
    pageViews.current += 1;
  }, []);

  const getSessionStats = useCallback(() => {
    return {
      duration: getSessionDuration(),
      pageViews: pageViews.current,
      isAuthenticated,
    };
  }, [getSessionDuration, isAuthenticated]);

  // Track page views automatically on mount
  useEffect(() => {
    incrementPageViews();
  }, [incrementPageViews]);

  return {
    getSessionDuration,
    incrementPageViews,
    getSessionStats,
  };
}