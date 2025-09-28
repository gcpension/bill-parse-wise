import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeLabels: Record<string, string> = {
  '/': 'דף הבית',
  '/all-plans': 'כל המסלולים',
  '/analyze': 'ניתוח חיסכון',
  '/magazine': 'מגזין',
  '/tips': 'טיפים',
  '/about': 'אודות',
  '/contact': 'צור קשר',
  '/help': 'עזרה',
  '/settings': 'הגדרות',
  '/switch-wizard': 'אשף מעבר',
  '/results-preview': 'תוצאות',
  '/saved-comparisons': 'השוואות שמורות',
};

export const BreadcrumbNavigation = ({ 
  items, 
  className = '' 
}: BreadcrumbNavigationProps) => {
  const location = useLocation();
  
  // Generate breadcrumbs from current path if items not provided
  const breadcrumbs = items || generateBreadcrumbs(location.pathname);
  
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={cn(
      'flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium mb-6 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50',
      className
    )}>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
          )}
          
          {index === breadcrumbs.length - 1 ? (
            // Current page (not clickable)
            <span className="flex items-center gap-2 text-foreground font-semibold">
              {item.icon}
              {item.label}
            </span>
          ) : (
            // Clickable breadcrumb
            <Link
              to={item.href}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline"
            >
              {item.icon}
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'דף הבית', href: '/', icon: <Home className="w-4 h-4" /> }
  ];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment;
    
    breadcrumbs.push({
      label,
      href: currentPath
    });
  });

  return breadcrumbs;
}