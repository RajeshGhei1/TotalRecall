
import { useEffect } from 'react';

export interface AutoTrackingOptions {
  enableAutoTracking?: boolean;
  trackScrolling?: boolean;
  trackClicks?: boolean;
  trackFormInteractions?: boolean;
}

export const useAutoTracking = (
  userId: string,
  options: AutoTrackingOptions,
  trackingMethods: {
    trackClick: (target: string, metadata?: Record<string, unknown>) => void;
    trackScrolling: (scrollPercentage: number, section: string) => void;
    trackFormInteraction: (formId: string, fieldName: string, action: string) => void;
  },
  setIsTracking: (tracking: boolean) => void
) => {
  const {
    enableAutoTracking = true,
    trackScrolling: enableScrollTracking = true,
    trackClicks: enableClickTracking = true,
    trackFormInteractions: enableFormTracking = true
  } = options;

  const { trackClick, trackScrolling, trackFormInteraction } = trackingMethods;

  useEffect(() => {
    if (!enableAutoTracking || !userId) return;

    setIsTracking(true);

    const handleClick = (event: MouseEvent) => {
      if (!enableClickTracking) return;
      
      const target = event.target as HTMLElement;
      const elementInfo = {
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 100)
      };
      
      trackClick('auto_click', elementInfo);
    };

    const handleScroll = () => {
      if (!enableScrollTracking) return;
      
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      trackScrolling(scrollPercentage, 'page');
    };

    const handleFormInteraction = (event: Event) => {
      if (!enableFormTracking) return;
      
      const target = event.target as HTMLInputElement;
      if (target.form) {
        const formId = target.form.id || 'unnamed_form';
        const fieldName = target.name || target.id || 'unnamed_field';
        trackFormInteraction(formId, fieldName, event.type);
      }
    };

    // Add event listeners
    if (enableClickTracking) {
      document.addEventListener('click', handleClick);
    }
    
    if (enableScrollTracking) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    if (enableFormTracking) {
      document.addEventListener('focus', handleFormInteraction, true);
      document.addEventListener('blur', handleFormInteraction, true);
      document.addEventListener('input', handleFormInteraction, true);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focus', handleFormInteraction, true);
      document.removeEventListener('blur', handleFormInteraction, true);
      document.removeEventListener('input', handleFormInteraction, true);
      setIsTracking(false);
    };
  }, [
    enableAutoTracking, 
    userId, 
    enableClickTracking, 
    enableScrollTracking, 
    enableFormTracking, 
    trackClick, 
    trackScrolling, 
    trackFormInteraction,
    setIsTracking
  ]);
};
