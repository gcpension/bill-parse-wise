import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Wifi, 
  Smartphone, 
  Droplet, 
  Flame, 
  Tv,
  Target,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

// Mock data - later will come from API
const mockData = {
  totalMonthly: 8450,
  lastMonth: 9120,
  annualSavings: 12000,
  categories: [
    { 
      name: 'חשמל', 
      amount: 380, 
      lastMonth: 420, 
      icon: Zap, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      savings: 40
    },
    { 
      name: 'אינטרנט', 
      amount: 120, 
      lastMonth: 120, 
      icon: Wifi, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      savings: 0
    },
    { 
      name: 'סלולר', 
      amount: 250, 
      lastMonth: 280, 
      icon: Smartphone, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      savings: 30
    },
    { 
      name: 'מים', 
      amount: 150, 
      lastMonth: 180, 
      icon: Droplet, 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      savings: 30
    },
    { 
      name: 'גז', 
      amount: 95, 
      lastMonth: 110, 
      icon: Flame, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      savings: 15
    },
    { 
      name: 'טלוויזיה', 
      amount: 89, 
      lastMonth: 89, 
      icon: Tv, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      savings: 0
    }
  ],
  savingsGoal: {
    target: 15000,
    current: 8750,
    progress: 58
  },
  recommendations: [
    {
      title: 'החלף ספק חשמל',
      description: 'חיסכון של עד ₪180 בחודש על ידי מעבר לספק חשמל חדש',
      savings: 180,
      priority: 'high'
    },
    {
      title: 'שדרג חבילת סלולר',
      description: 'מעבר לחבילה חדשה יחסוך לך ₪50 בחודש',
      savings: 50,
      priority: 'medium'
    },
    {
      title: 'התקן חסכן מים',
      description: 'השקעה חד-פעמית של ₪200 תחסוך ₪30 בחודש',
      savings: 30,
      priority: 'low'
    }
  ]
};

export const Dashboard = () => {
  const totalSavings = mockData.categories.reduce((sum, cat) => sum + cat.savings, 0);
  const savingsPercentage = ((mockData.lastMonth - mockData.totalMonthly) / mockData.lastMonth * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Action */}
      <div className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
            דשבורד חיסכון
          </h1>
          <p className="text-muted-foreground text-lg">
            מעקב אחר הוצאותיך והמלצות לחיסכון חכם
          </p>
        </div>
        
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link to="/upload">
            <Button size="lg" className="shadow-elegant animate-pulse-glow">
              <Upload className="ml-2 h-5 w-5" />
              העלה חשבונית חדשה
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            <Calendar className="ml-2 h-5 w-5" />
            דוח חודשי
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Monthly */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה״כ חודשי</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              {formatCurrency(mockData.totalMonthly)}
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-success">
              <TrendingDown className="h-4 w-4" />
              <span>{savingsPercentage.toFixed(1)}% מהחודש הקודם</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Savings */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חיסכון חודשי</CardTitle>
            <TrendingDown className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {formatCurrency(totalSavings)}
            </div>
            <p className="text-xs text-muted-foreground">
              יחסית לחודש הקודם
            </p>
          </CardContent>
        </Card>

        {/* Annual Projection */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חיסכון שנתי משוער</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(totalSavings * 12)}
            </div>
            <p className="text-xs text-muted-foreground">
              בהתבסס על המגמה הנוכחית
            </p>
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">יעד חיסכון שנתי</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockData.savingsGoal.progress}%
            </div>
            <Progress 
              value={mockData.savingsGoal.progress} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(mockData.savingsGoal.current)} מתוך {formatCurrency(mockData.savingsGoal.target)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Breakdown */}
      <Card className="shadow-card animate-scale-in">
        <CardHeader>
          <CardTitle className="text-xl">פירוט לפי קטגוריות</CardTitle>
          <p className="text-muted-foreground">השוואה לחודש הקודם והזדמנויות חיסכון</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockData.categories.map((category, index) => {
              const Icon = category.icon;
              const change = category.amount - category.lastMonth;
              const changePercentage = (change / category.lastMonth * 100);
              
              return (
                <div 
                  key={category.name} 
                  className={`p-4 rounded-xl ${category.bgColor} border border-border/50 transition-all duration-300 hover:shadow-elegant hover:scale-105`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className={`p-2 rounded-lg bg-white/80 ${category.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(category.amount)}
                        </p>
                      </div>
                    </div>
                    {category.savings > 0 && (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        -₪{category.savings}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      לעומת {formatCurrency(category.lastMonth)} בחודש הקודם
                    </span>
                    {change !== 0 && (
                      <div className={`flex items-center space-x-1 rtl:space-x-reverse ${
                        change < 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {change < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                        <span>{changePercentage.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-card animate-scale-in">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2 rtl:space-x-reverse">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span>המלצות לחיסכון</span>
          </CardTitle>
          <p className="text-muted-foreground">צעדים פשוטים לחיסכון משמעותי</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recommendations.map((rec, index) => (
              <div 
                key={index}
                className="p-4 border border-border rounded-xl hover:shadow-elegant transition-all duration-300 hover:bg-accent/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <h4 className="font-semibold text-foreground">{rec.title}</h4>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority === 'high' ? 'דחוף' : rec.priority === 'medium' ? 'בינוני' : 'נמוך'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{rec.description}</p>
                    <div className="text-success font-semibold">
                      חיסכון צפוי: {formatCurrency(rec.savings)} בחודש
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mr-4">
                    לפרטים
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};