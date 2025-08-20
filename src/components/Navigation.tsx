import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const navigation = [
  { name: 'דשבורד', href: '/', icon: LayoutDashboard },
  { name: 'העלאת חשבוניות', href: '/upload', icon: Upload },
  { name: 'השוואת עלויות', href: '/compare', icon: BarChart3 },
  { name: 'הגדרות', href: '/settings', icon: Settings },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className="text-xl font-bold text-primary">
              מחשבון חיסכון
            </Link>
            
            <div className="hidden md:flex space-x-4 rtl:space-x-reverse">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.!==ref !== '/' && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
