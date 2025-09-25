import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import BackToTop from './BackToTop';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: ReactNode;
  showBackToTop?: boolean;
  className?: string;
}

export const Layout = ({ children, showBackToTop = true, className = '' }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      {showBackToTop && <BackToTop />}
      <Toaster />
    </div>
  );
};