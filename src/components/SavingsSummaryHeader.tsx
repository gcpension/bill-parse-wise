import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, Calendar, Sparkles } from 'lucide-react';

interface SavingsSummaryHeaderProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  resultCount: number;
}

export const SavingsSummaryHeader = ({ 
  totalMonthlySavings, 
  totalAnnualSavings, 
  resultCount 
}: SavingsSummaryHeaderProps) => {
  if (totalMonthlySavings <= 0) {
    return (
      <div className="bg-gradient-to-r from-muted/50 via-background to-muted/50 rounded-2xl p-8 border border-border/50">
        <div className="text-center space-y-4">
          <div className="p-4 bg-muted rounded-full w-fit mx-auto">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">תוצאות הניתוח</h2>
          <p className="text-muted-foreground">
            בדקנו {resultCount} שירותים - נראה שכרגע אתה במחירים סבירים
          </p>
        </div>
      </div>
    );
  }

  const bonusEquivalent = Math.round(totalAnnualSavings / 1000);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-success/20 via-primary-glow/10 to-success/15 rounded-3xl p-10 border-2 border-success/30 shadow-2xl">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-success/20 to-transparent rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/15 to-transparent rounded-full translate-y-24 -translate-x-24 animate-pulse delay-1000"></div>
      
      {/* Floating Money Icons */}
      <div className="absolute top-4 left-4 text-3xl animate-bounce">💰</div>
      <div className="absolute top-8 right-8 text-2xl animate-bounce delay-500">🎉</div>
      <div className="absolute bottom-4 right-4 text-3xl animate-bounce delay-1000">💎</div>

      <div className="relative z-10 text-center space-y-8">
        {/* Success Badge */}
        <div className="flex justify-center">
          <Badge className="bg-gradient-to-r from-success to-success-foreground text-white px-6 py-3 text-lg font-bold shadow-lg animate-pulse">
            <Sparkles className="h-5 w-5 ml-2" />
            מצאנו לך חיסכון מעולה!
          </Badge>
        </div>

        <div>
          <h2 className="text-5xl font-black bg-gradient-to-r from-success via-primary to-success bg-clip-text text-transparent mb-4">
            סיכום החיסכון שלך
          </h2>
          <p className="text-xl text-muted-foreground">
            ניתחנו {resultCount} שירותים ומצאנו לך דרכים לחסוך כסף רב!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Monthly Savings */}
          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-success/30 shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5"></div>
            <CardContent className="relative p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-success to-success-foreground rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-2 font-medium">חיסכון חודשי כולל</p>
              <p className="text-4xl font-black text-success mb-2">
                {formatCurrency(totalMonthlySavings)}
              </p>
              <p className="text-xs text-success/80">בכל חודש</p>
            </CardContent>
          </Card>

          {/* Annual Savings */}
          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-glow/10"></div>
            <CardContent className="relative p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-primary to-primary-glow rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-2 font-medium">חיסכון שנתי כולל</p>
              <p className="text-4xl font-black text-primary mb-2">
                {formatCurrency(totalAnnualSavings)}
              </p>
              <p className="text-xs text-primary/80">בשנה שלמה</p>
            </CardContent>
          </Card>

          {/* Bonus Equivalent - Updated Design */}
          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-emerald-500/30 shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10"></div>
            <CardContent className="relative p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-2 font-medium">שווה ערך</p>
              <p className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-2">
                {bonusEquivalent}
              </p>
              <p className="text-xs text-emerald-600/80">משכורות נוספות</p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Message */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-success/30 max-w-2xl mx-auto">
          <p className="text-xl font-bold text-success mb-2">
            🎊 מזל טוב! זה כמו לקבל בונוס של {formatCurrency(totalAnnualSavings)} בשנה!
          </p>
          <p className="text-muted-foreground">
            התוצאות מבוססות על השוואה מדויקת עם המחירים בשוק הישראלי
          </p>
        </div>
      </div>
    </div>
  );
};