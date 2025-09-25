import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  Calculator, 
  BookOpen,
  Lightbulb,
  TrendingDown,
  Info,
  Phone,
  X,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'בית', href: '/', icon: Home, color: 'primary' },
  { name: 'כל המסלולים', href: '/all-plans', icon: TrendingDown, color: 'accent' },
  { name: 'ניתוח חיסכון', href: '/analyze', icon: Calculator, color: 'primary' },
  { name: 'מגזין', href: '/magazine', icon: BookOpen, color: 'accent' },
  { name: 'טיפים', href: '/tips', icon: Lightbulb, color: 'success-foreground' },
  { name: 'אודות', href: '/about', icon: Info, color: 'muted-foreground' },
  { name: 'צור קשר', href: '/contact', icon: Phone, color: 'muted-foreground' },
];

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="md:hidden p-2"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-gradient-to-b from-background to-accent/5">
        <SheetHeader className="mb-8">
          <SheetTitle className="flex items-center gap-3 text-right">
            <div className="p-2 bg-gradient-to-br from-primary via-accent to-primary rounded-lg shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EasySwitch
              </h2>
              <p className="text-sm text-muted-foreground">מחשבון חיסכון חכם</p>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 text-right font-medium transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg transform scale-105" 
                    : "hover:bg-accent/10 hover:scale-105"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  isActive 
                    ? "bg-white/20" 
                    : "group-hover:bg-accent/20"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.name}</span>
                {isActive && (
                  <Sparkles className="h-3 w-3 text-white opacity-80 mr-auto" />
                )}
              </Button>
            );
          })}
        </nav>
        
        {/* CTA Section */}
        <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <h3 className="font-bold text-primary mb-2">התחלת חיסכון</h3>
          <p className="text-sm text-muted-foreground mb-4">
            חסכו עד ₪2,400 בשנה על חשבונות הבית
          </p>
          <Button 
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold"
            onClick={() => handleNavigation('/analyze')}
          >
            <Calculator className="w-4 h-4 mr-2" />
            התחל עכשיו
          </Button>
        </div>
        
        {/* Contact Info */}
        <div className="mt-6 p-4 bg-muted/20 rounded-xl">
          <h4 className="font-semibold mb-2">צריכים עזרה?</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>📞 03-1234567</div>
            <div>📧 info@easyswitch.co.il</div>
            <div>💬 WhatsApp: 050-1234567</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};