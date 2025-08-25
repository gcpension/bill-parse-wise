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
    <section className="relative overflow-hidden rounded-3xl shadow-elegant mb-8 bg-gradient-success text-success-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-primary-glow/30 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-success-glow/30 blur-3xl"></div>
      </div>
      
      <div className="relative p-8">
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
          <div className="text-6xl font-black text-success-foreground mb-2">
            ₪{monthlySavings.toFixed(2)}
          </div>
          <div className="text-xl text-success-foreground/90 mb-4">
            בכל חודש
          </div>
          <div className="text-2xl font-bold text-success-foreground/95">
            חיסכון שנתי ₪{annualSavings.toFixed(2)}
          </div>
        </div>

        {/* Savings percentage badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-success text-success-foreground px-6 py-3 rounded-full text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            {savingsPercentage}%
            <span className="text-sm font-normal">חיסכון חודשי</span>
          </div>
        </div>

        {/* Current vs Recommended comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-6">
            <div className="text-center">
              <div className="text-sm text-success-foreground/80 mb-2">התשלום שלכם נכחי</div>
              <div className="text-3xl font-black text-destructive/80 mb-2">
                ₪{currentAmount.toLocaleString()}
              </div>
              <div className="text-xs text-success-foreground/70">לחודש</div>
            </div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-6">
            <div className="text-center">
              <div className="text-sm text-success-foreground/80 mb-2">מחיר טלקום - במתן מומלץ</div>
              <div className="text-3xl font-black text-success mb-2">
                ₪{recommendedAmount.toLocaleString()}
              </div>
              <div className="text-xs text-success-foreground/70">לחודש</div>
              <Badge className="mt-2 bg-success/20 text-success-foreground border-success/30">
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
    </section>
  );
};