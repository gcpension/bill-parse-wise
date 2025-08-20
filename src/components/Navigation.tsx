import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  Settings,
  TrendingDown
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
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
              <div className="p-2 gradient-primary rounded-lg shadow-glow transition-all duration-300 group-hover:scale-105">
                <TrendingDown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                  מחשבון חיסכון
                </h1>
                <p className="text-xs text-muted-foreground">חיסכון חכם</p>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-2 rtl:space-x-reverse">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-elegant'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="absolute inset-0 gradient-primary rounded-lg opacity-20 animate-pulse-glow" />
                    )}
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
