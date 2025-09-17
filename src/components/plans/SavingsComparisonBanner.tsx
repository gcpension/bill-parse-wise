import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, ArrowRight, Sparkles, Calculator, Crown, CheckCircle, Target, Zap } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

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
      {/* Ultra Clean Savings Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-accent/5 border-0 shadow-2xl backdrop-blur-xl">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-success/5 via-primary/5 to-success/5 opacity-30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-success/10 to-transparent rounded-full blur-3xl"></div>
        
        <CardContent className="relative p-12">
          {/* Compelling Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-success via-green-600 to-success bg-clip-text text-transparent">
                מזל טוב! זה החיסכון שלכם
              </h1>
              <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto">
              השוואת המחירים שלכם גילתה הזדמנות חיסכון משמעותית
            </p>
          </div>

          {/* Clean Price Comparison */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Before - Current Payment */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-destructive/10 to-red-100/50 rounded-3xl p-8 border-2 border-destructive/20 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-destructive text-destructive-foreground text-sm px-4 py-1">
                      לפני
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-destructive mb-4">התשלום הנוכחי שלכם</h3>
                  <div className="text-6xl font-black text-destructive mb-2">
                    ₪{animatedCurrentMonthly.toLocaleString()}
                  </div>
                  <div className="text-lg text-destructive/80 font-medium">לחודש</div>
                  <div className="mt-4 p-3 bg-destructive/10 rounded-xl">
                    <div className="text-2xl font-bold text-destructive">
                      ₪{(animatedCurrentMonthly * 12).toLocaleString()}
                    </div>
                    <div className="text-sm text-destructive/70">לשנה</div>
                  </div>
                </div>
              </div>

              {/* After - New Payment */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-success/10 to-green-100/50 rounded-3xl p-8 border-2 border-success/30 relative ring-2 ring-success/20">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-success text-white text-sm px-4 py-1">
                      אחרי
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-success mb-4">עם המסלולים החדשים</h3>
                  <div className="text-6xl font-black text-success mb-2">
                    ₪{animatedRecommendedMonthly.toLocaleString()}
                  </div>
                  <div className="text-lg text-success/80 font-medium">לחודש</div>
                  <div className="mt-4 p-3 bg-success/10 rounded-xl">
                    <div className="text-2xl font-bold text-success">
                      ₪{(animatedRecommendedMonthly * 12).toLocaleString()}
                    </div>
                    <div className="text-sm text-success/70">לשנה</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Savings Arrow */}
            <div className="flex justify-center my-8">
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-success/30">
                <TrendingDown className="w-8 h-8 text-success animate-bounce" />
                <div className="text-center">
                  <div className="text-3xl font-black text-success">
                    {savingsPercentage}% חיסכון
                  </div>
                  <div className="text-sm text-muted-foreground">פחות תשלום</div>
                </div>
                <ArrowRight className="w-8 h-8 text-success" />
              </div>
            </div>
          </div>

          {/* Main Savings Highlight - Ultra Prominent */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-success via-green-500 to-emerald-600 text-white shadow-3xl border-0 relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse"></div>
              
              <CardContent className="relative p-10 text-center">
                <div className="mb-6">
                  <Sparkles className="w-16 h-16 text-green-100 mx-auto animate-spin-slow" />
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-black mb-8 text-green-50">
                  החיסכון הכולל שלכם
                </h2>
                
                <div className="grid md:grid-cols-2 gap-12 mb-8">
                  {/* Monthly Savings */}
                  <div className="text-center">
                    <div className="bg-white/20 rounded-3xl p-8 backdrop-blur-sm">
                      <div className="text-7xl lg:text-8xl font-black text-white mb-3">
                        ₪{animatedMonthlySavings.toLocaleString()}
                      </div>
                      <div className="text-2xl text-green-100 font-bold">כל חודש</div>
                      <div className="text-green-200 mt-2">זה כמו לקבל מתנה!</div>
                    </div>
                  </div>
                  
                  {/* Annual Savings - The Big Number */}
                  <div className="text-center">
                    <div className="bg-white/30 rounded-3xl p-8 backdrop-blur-sm border-2 border-white/50">
                      <div className="text-7xl lg:text-8xl font-black text-white mb-3">
                        ₪{animatedAnnualSavings.toLocaleString()}
                      </div>
                      <div className="text-2xl text-green-100 font-bold">בשנה השלמה</div>
                      <div className="text-green-200 mt-2">חיסכון אמיתי לכל המשפחה!</div>
                    </div>
                  </div>
                </div>
                
                {/* Compelling Benefits */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-lg font-bold text-green-100">
                      🏖️ חופשה משפחתית
                    </div>
                    <div className="text-green-200 text-sm">עם החיסכון השנתי</div>
                  </div>
                  <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-lg font-bold text-green-100">
                      💰 קופת חיסכון
                    </div>
                    <div className="text-green-200 text-sm">לעתיד הילדים</div>
                  </div>
                  <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-lg font-bold text-green-100">
                      🎯 השקעה חכמה
                    </div>
                    <div className="text-green-200 text-sm">ברווחה כלכלית</div>
                  </div>
                </div>

                {/* Strong CTA */}
                <Button 
                  size="lg"
                  className="bg-white text-success hover:bg-green-50 font-black text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-2 border-white/30"
                >
                  <Crown className="w-6 h-6 mr-3" />
                  בואו נתחיל לחסוך עכשיו!
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};