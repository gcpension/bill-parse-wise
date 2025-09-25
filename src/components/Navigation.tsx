import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calculator, 
  Settings,
  TrendingDown,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Info,
  Phone,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileMenu } from './MobileMenu';

const navigation = [
  { name: 'בית', href: '/', icon: Home, color: 'primary' },
  { name: 'מגזין', href: '/magazine', icon: BookOpen, color: 'accent' },
  { name: 'טיפים', href: '/tips', icon: Lightbulb, color: 'success-foreground' },
  { name: 'ניתוח חיסכון', href: '/analyze', icon: Calculator, color: 'primary' },
  { name: 'כל המסלולים', href: '/all-plans', icon: TrendingDown, color: 'accent' },
  { name: 'אודות', href: '/about', icon: Info, color: 'muted-foreground' },
  { name: 'צור קשר', href: '/contact', icon: Phone, color: 'muted-foreground' },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="relative bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-xl border-b border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-0 z-50">
      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-60"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
              {/* Enhanced Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl shadow-elegant transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Enhanced Brand Name */}
              <div className="group">
                <h1 className="text-3xl font-brand font-black bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-x group-hover:scale-105 transition-transform duration-300">
                  EasySwitch
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground font-medium">מחשבון חיסכון חכם</p>
                  <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20 px-2 py-0.5">
                    AI
                  </Badge>
                </div>
              </div>
            </Link>
            
            {/* Enhanced Navigation */}
            <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'group relative flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105',
                      isActive
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-elegant transform scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:shadow-md'
                    )}
                  >
                    <div className={cn(
                      'p-1.5 rounded-lg transition-all duration-300',
                      isActive 
                        ? 'bg-white/20' 
                        : 'group-hover:bg-accent/20'
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl opacity-50 animate-pulse-glow"></div>
                    )}
                    
                    {/* Hover sparkle effect */}
                    <Sparkles className={cn(
                      'absolute -top-1 -right-1 h-3 w-3 transition-all duration-300',
                      isActive ? 'text-white opacity-100' : 'text-accent opacity-0 group-hover:opacity-100'
                    )} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu and CTA */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button 
              className="hidden md:flex bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-elegant hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold"
              onClick={() => navigate('/analyze')}
            >
              <Calculator className="w-4 h-4 mr-2" />
              התחל לחסוך
            </Button>
            
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};
