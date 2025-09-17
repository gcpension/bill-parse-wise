import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, ArrowRight, Sparkles, Calculator, Crown, CheckCircle } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SavingsData {
  currentMonthly: number;
  recommendedMonthly: number;
  monthlySavings: number;
  annualSavings: number;
  currentProvider: string;
  recommendedProvider: string;
  category: string;
}

interface SavingsComparisonBannerProps {
  savingsData: SavingsData[];
  className?: string;
}

export const SavingsComparisonBanner = ({ savingsData, className = '' }: SavingsComparisonBannerProps) => {
  const { isVisible, elementRef } = useScrollAnimation();
  
  const totalCurrentMonthly = savingsData.reduce((sum, data) => sum + data.currentMonthly, 0);
  const totalRecommendedMonthly = savingsData.reduce((sum, data) => sum + data.recommendedMonthly, 0);
  const totalMonthlySavings = savingsData.reduce((sum, data) => sum + data.monthlySavings, 0);
  const totalAnnualSavings = savingsData.reduce((sum, data) => sum + data.annualSavings, 0);
  
  const animatedCurrentMonthly = useAnimatedCounter({ end: totalCurrentMonthly, duration: 2000 });
  const animatedRecommendedMonthly = useAnimatedCounter({ end: totalRecommendedMonthly, duration: 2000 });
  const animatedMonthlySavings = useAnimatedCounter({ end: totalMonthlySavings, duration: 2500 });
  const animatedAnnualSavings = useAnimatedCounter({ end: totalAnnualSavings, duration: 3000 });

  const savingsPercentage = totalCurrentMonthly > 0 ? Math.round((totalMonthlySavings / totalCurrentMonthly) * 100) : 0;

  return (
    <div 
      ref={elementRef}
      className={`mb-12 ${className} transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Main Savings Banner */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-green-600/5 border-0 shadow-2xl backdrop-blur-xl">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-600/10 opacity-50"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full blur-2xl"></div>
        
        <CardContent className="relative p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-green-500 animate-pulse" />
              <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                הניתוח שלכם מוכן!
              </h2>
              <Crown className="w-8 h-8 text-green-500 animate-bounce-gentle" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              מצאנו לכם הזדמנויות חיסכון מעולות. הנה ההשוואה בין מה שאתם משלמים היום למה שתוכלו לחסוך
            </p>
          </div>

          {/* Main Comparison */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {/* Current Payment */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-red-700">מה שאתם משלמים היום</h3>
                </div>
                <div className="text-4xl font-black text-red-600 mb-2">
                  ₪{animatedCurrentMonthly}
                </div>
                <p className="text-sm text-red-600/80">לחודש</p>
                <div className="text-xl font-bold text-red-500 mt-2">
                  ₪{(animatedCurrentMonthly * 12).toLocaleString()} בשנה
                </div>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <ArrowRight className="w-8 h-8 text-green-600 animate-pulse" />
                <Badge className="bg-green-100 text-green-700 border-green-300 text-lg px-4 py-2 font-bold">
                  חסכו {savingsPercentage}%
                </Badge>
              </div>
            </div>

            {/* Recommended Payment */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-green-700">עם המסלולים החדשים</h3>
                </div>
                <div className="text-4xl font-black text-green-600 mb-2">
                  ₪{animatedRecommendedMonthly}
                </div>
                <p className="text-sm text-green-600/80">לחודש</p>
                <div className="text-xl font-bold text-green-500 mt-2">
                  ₪{(animatedRecommendedMonthly * 12).toLocaleString()} בשנה
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Highlight */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <TrendingDown className="w-10 h-10 text-green-100" />
                <h3 className="text-2xl lg:text-3xl font-black">סך החיסכון שלכם</h3>
                <Sparkles className="w-10 h-10 text-green-100 animate-pulse" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl lg:text-6xl font-black mb-2 text-green-100">
                    ₪{animatedMonthlySavings}
                  </div>
                  <p className="text-xl text-green-200">לחודש</p>
                </div>
                <div>
                  <div className="text-5xl lg:text-6xl font-black mb-2 text-green-100">
                    ₪{animatedAnnualSavings.toLocaleString()}
                  </div>
                  <p className="text-xl text-green-200">לשנה</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <p className="text-lg text-green-100">
                  💡 <strong>טיפ:</strong> עם החיסכון השנתי שלכם תוכלו לממן חופשה משפחתית או לחסוך לעתיד!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          {savingsData.length > 1 && (
            <div className="mt-8">
              <h4 className="text-xl font-bold text-center mb-6 text-foreground">פירוט החיסכון לפי קטגוריה</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {savingsData.map((data, index) => (
                  <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <Badge className="mb-2 bg-primary/10 text-primary border-primary/30">
                        {data.category}
                      </Badge>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ₪{data.monthlySavings}
                      </div>
                      <p className="text-sm text-muted-foreground">חיסכון חודשי</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-8">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              בחרו את המסלולים החדשים שלכם
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};