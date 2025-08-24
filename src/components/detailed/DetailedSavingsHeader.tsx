import { TrendingUp, Star, Crown, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface DetailedSavingsHeaderProps {
  category: string;
  categoryName: string;
  monthlySavings: number;
  annualSavings: number;
  savingsPercentage: number;
  currentAmount: number;
  recommendedAmount: number;
}

export const DetailedSavingsHeader = ({
  category,
  categoryName,
  monthlySavings,
  annualSavings,
  savingsPercentage,
  currentAmount,
  recommendedAmount
}: DetailedSavingsHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-elegant mb-8">
      {/* Purple gradient background like the reference */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-royal-purple to-primary-glow"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-8 right-12 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full animate-bounce-gentle"></div>
      </div>
      
      <div className="relative p-8 text-white">
        {/* Header with stars like reference */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="h-6 w-6 text-golden-yellow fill-current" />
            <h1 className="text-3xl font-black">חיסכון {categoryName}</h1>
            <Star className="h-6 w-6 text-golden-yellow fill-current" />
          </div>
        </div>

        {/* Main savings display - like reference image */}
        <div className="text-center mb-8">
          <div className="text-6xl font-black text-white mb-2">
            ₪{monthlySavings.toFixed(2)}
          </div>
          <div className="text-xl text-white/90 mb-4">
            בכל חודש
          </div>
          <div className="text-2xl font-bold text-white/95">
            חיסכון שנתי ₪{annualSavings.toFixed(2)}
          </div>
        </div>

        {/* Savings percentage badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-success text-white px-6 py-3 rounded-full text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            {savingsPercentage}%
            <span className="text-sm font-normal">חיסכון חודשי</span>
          </div>
        </div>

        {/* Current vs Recommended comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-6">
            <div className="text-center">
              <div className="text-sm text-white/80 mb-2">התשלום שלכם נכחי</div>
              <div className="text-3xl font-black text-red-300 mb-2">
                ₪{currentAmount.toLocaleString()}
              </div>
              <div className="text-xs text-white/70">לחודש</div>
            </div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-6">
            <div className="text-center">
              <div className="text-sm text-white/80 mb-2">מחיר טלקום - במתן מומלץ</div>
              <div className="text-3xl font-black text-success mb-2">
                ₪{recommendedAmount.toLocaleString()}
              </div>
              <div className="text-xs text-white/70">לחודש</div>
              <Badge className="mt-2 bg-success/20 text-white border-success/30">
                <Crown className="mr-1 h-3 w-3" />
                מומלץ 3 קווים
              </Badge>
            </div>
          </Card>
        </div>

        {/* Additional info */}
        <div className="text-center">
          <div className="text-white/80 text-sm">
            * חיסכון מבוסס על ניתוח השוואת המחירים בשוק
          </div>
        </div>
      </div>
    </div>
  );
};