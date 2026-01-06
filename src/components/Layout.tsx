import { ReactNode, useEffect, useState, useCallback } from 'react';
import { Navigation } from './Navigation';
import BackToTop from './BackToTop';
import FloatingElements from './FloatingElements';
import { Toaster } from './ui/toaster';
import { useLocation } from 'react-router-dom';
import SwipeNavigationWrapper from './gestures/SwipeNavigationWrapper';
import PullToRefresh from './gestures/PullToRefresh';
import GestureHint from './gestures/GestureHint';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showBackToTop?: boolean;
  enablePullToRefresh?: boolean;
  enableSwipeNavigation?: boolean;
}

export const Layout = ({ 
  children, 
  className = '', 
  showBackToTop = true,
  enablePullToRefresh = false,
  enableSwipeNavigation = true,
}: LayoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const location = useLocation();

  // Show loading on route changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show swipe hint on internal pages (not home)
  useEffect(() => {
    if (location.pathname !== '/' && enableSwipeNavigation) {
      const seenHints = JSON.parse(localStorage.getItem('seenGestureHints') || '[]');
      if (!seenHints.includes('swipe-back')) {
        const timer = setTimeout(() => setShowSwipeHint(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, enableSwipeNavigation]);

  const handleRefresh = useCallback(async () => {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  }, []);

  const content = (
    <div className="min-h-screen bg-background">
      <FloatingElements />
      <Navigation />
      
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
        </div>
      )}
      
      <main className={`container mx-auto px-4 py-8 ${className}`}>
        {children}
      </main>
      
      {showBackToTop && <BackToTop />}
      <Toaster />
      
      {/* Gesture hints for mobile */}
      {showSwipeHint && <GestureHint type="swipe-back" show={showSwipeHint} onDismiss={() => setShowSwipeHint(false)} />}
    </div>
  );

  // Wrap with gestures based on props
  if (enableSwipeNavigation && enablePullToRefresh) {
    return (
      <SwipeNavigationWrapper>
        <PullToRefresh onRefresh={handleRefresh}>
          {content}
        </PullToRefresh>
      </SwipeNavigationWrapper>
    );
  }

  if (enableSwipeNavigation) {
    return <SwipeNavigationWrapper>{content}</SwipeNavigationWrapper>;
  }

  if (enablePullToRefresh) {
    return <PullToRefresh onRefresh={handleRefresh}>{content}</PullToRefresh>;
  }

  return content;
};