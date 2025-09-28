import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calculator, 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv, 
  BookOpen, 
  TrendingDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  gradient: string;
  popular?: boolean;
}

const quickActions: QuickAction[] = [
  {
    title: 'ניתוח חיסכון',
    description: 'קבלו ניתוח מלא של ההוצאות שלכם',
    icon: <Calculator className="w-6 h-6" />,
    href: '/analyze',
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-500',
    popular: true
  },
  {
    title: 'מסלולי חשמל',
    description: 'השוואת ספקי חשמל ואנרגיה',
    icon: <Zap className="w-6 h-6" />,
    href: '/all-plans?category=electricity',
    color: 'text-yellow-600',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'מסלולי אינטרנט',
    description: 'מצאו את חבילת הגלישה המושלמת',
    icon: <Wifi className="w-6 h-6" />,
    href: '/all-plans?category=internet',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'מסלולי סלולר',
    description: 'השוואת חברות סלולר ומסלולים',
    icon: <Smartphone className="w-6 h-6" />,
    href: '/all-plans?category=mobile',
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'מסלולי טלוויזיה',
    description: 'חבילות טלוויזיה ושירותי סטרימינג',
    icon: <Tv className="w-6 h-6" />,
    href: '/all-plans?category=tv',
    color: 'text-red-600',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    title: 'טיפים לחיסכון',
    description: 'מדריכים ועצות מקצועיות',
    icon: <BookOpen className="w-6 h-6" />,
    href: '/tips',
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-purple-500'
  }
];

interface QuickActionsProps {
  className?: string;
  variant?: 'grid' | 'horizontal';
  showTitle?: boolean;
}

export const QuickActions = ({ 
  className = '', 
  variant = 'grid',
  showTitle = true 
}: QuickActionsProps) => {
  const navigate = useNavigate();

  const handleActionClick = (href: string) => {
    navigate(href);
  };

  if (variant === 'horizontal') {
    return (
      <div className={cn('w-full', className)}>
        {showTitle && (
          <h2 className="text-xl font-bold text-foreground mb-4 font-heebo">
            פעולות מהירות
          </h2>
        )}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.slice(0, 4).map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleActionClick(action.href)}
              className="flex-shrink-0 h-auto p-4 flex flex-col items-center gap-2 min-w-[120px] hover:scale-105 transition-all duration-300"
            >
              <div className={cn('p-2 rounded-lg', `bg-gradient-to-r ${action.gradient} text-white`)}>
                {action.icon}
              </div>
              <span className="text-xs font-medium text-center">{action.title}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3 font-heebo">
            פעולות מהירות
          </h2>
          <p className="text-muted-foreground font-assistant">
            בחרו את הפעולה שתרצו לבצע כדי להתחיל לחסוך
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/50 relative overflow-hidden"
            onClick={() => handleActionClick(action.href)}
          >
            {action.popular && (
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  פופולרי
                </div>
              </div>
            )}
            
            <div className={cn(
              'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300',
              `bg-gradient-to-br ${action.gradient}`
            )} />
            
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'p-3 rounded-xl transition-all duration-300 group-hover:scale-110',
                  `bg-gradient-to-r ${action.gradient} text-white shadow-lg`
                )}>
                  {action.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300 group-hover:translate-x-1" />
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-2 font-heebo">
                {action.title}
              </h3>
              
              <p className="text-muted-foreground text-sm font-assistant">
                {action.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};