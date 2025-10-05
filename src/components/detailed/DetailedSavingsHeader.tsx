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
    <section className="relative overflow-hidden rounded-2xl shadow-elegant mb-6 bg-gradient-success text-success-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary-glow/30 blur-2xl"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-success-glow/30 blur-2xl"></div>
      </div>
      
      <div className="relative p-4 md:p-6">
        {/* Header with stars like reference */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-4 w-4 text-golden-yellow fill-current" />
            <h1 className="text-xl font-black">חיסכון {categoryName}</h1>
            <Star className="h-4 w-4 text-golden-yellow fill-current" />
          </div>
        </div>

        {/* Main savings display - like reference image */}
        <div className="text-center mb-4">
          <div className="text-3xl md:text-4xl font-black text-success-foreground mb-1">
            ₪{monthlySavings.toFixed(2)}
          </div>
          <div className="text-sm text-success-foreground/90 mb-2">
            בכל חודש
          </div>
          <div className="text-lg font-bold text-success-foreground/95">
            חיסכון שנתי ₪{annualSavings.toFixed(2)}
          </div>
        </div>

        {/* Savings percentage badge */}
        <div className="flex justify-center mb-4">
          <div className="bg-success text-success-foreground px-4 py-2 rounded-full text-base font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {savingsPercentage}%
            <span className="text-xs font-normal">חיסכון חודשי</span>
          </div>
        </div>

        {/* Current vs Recommended comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-3">
            <div className="text-center">
              <div className="text-xs text-success-foreground/80 mb-1">התשלום שלכם נכחי</div>
              <div className="text-xl font-black text-destructive/80 mb-1">
                ₪{currentAmount.toLocaleString()}
              </div>
              <div className="text-xs text-success-foreground/70">לחודש</div>
            </div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-3">
            <div className="text-center">
              <div className="text-xs text-success-foreground/80 mb-1">מחיר טלקום - במתן מומלץ</div>
              <div className="text-xl font-black text-success mb-1">
                ₪{recommendedAmount.toLocaleString()}
              </div>
              <div className="text-xs text-success-foreground/70">לחודש</div>
              <Badge className="mt-1 bg-success/20 text-success-foreground border-success/30 text-xs px-2 py-0.5">
                <Crown className="mr-1 h-3 w-3" />
                מומלץ 3 קווים
              </Badge>
            </div>
          </Card>
        </div>

        {/* Additional info */}
        <div className="text-center">
          <div className="text-white/80 text-xs">
            * חיסכון מבוסס על ניתוח השוואת המחירים בשוק
          </div>
        </div>
      </div>
    </section>
  );
};