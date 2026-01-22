import React from 'react';
import { motion } from 'framer-motion';
import { Home, Grid3X3, Lightbulb, User, TrendingDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

const navItems = [
  { href: '/', label: 'בית', icon: Home },
  { href: '/all-plans', label: 'מסלולים', icon: Grid3X3 },
  { href: '/tips', label: 'טיפים', icon: Lightbulb },
  { href: '/about', label: 'אודות', icon: User },
];

interface MobileBottomNavProps {
  isHidden?: boolean;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ isHidden = false }) => {
  const location = useLocation();
  const { trigger } = useHapticFeedback();

  if (isHidden) return null;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      {/* Gradient fade above nav */}
      <div className="absolute bottom-full left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => trigger('light')}
                className={cn(
                  "flex flex-col items-center justify-center",
                  "min-w-[64px] min-h-[56px] rounded-2xl",
                  "transition-all duration-200",
                  "active:scale-95",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-xl",
                    "transition-all duration-200",
                    isActive && "bg-primary/10"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "scale-110"
                  )} />
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                
                <span className={cn(
                  "text-[10px] font-medium mt-0.5",
                  isActive && "font-bold"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
