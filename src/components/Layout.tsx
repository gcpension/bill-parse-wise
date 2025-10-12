import { ReactNode, useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import BackToTop from './BackToTop';
import FloatingElements from './FloatingElements';
import { Toaster } from './ui/toaster';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showBackToTop?: boolean;
}

export const Layout = ({ 
  children, 
  className = '', 
  showBackToTop = true 
}: LayoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Show loading on route changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
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
    </div>
  );
};