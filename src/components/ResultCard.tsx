import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Sparkles, Star, Target, Award, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ComparisonView } from './ComparisonView';
import { PlanSelector } from './PlanSelector';
import { DigitalSignature } from './DigitalSignature';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface AnalysisResult {
  category: 'electricity' | 'cellular' | 'internet';
  currentAmount: number;
  currentProvider: string;
  recommendedPlan: any;
  monthlySavings: number;
  annualSavings: number;
  allProviders: any[];
  fileId?: string;
}

interface ResultCardProps {
  result: AnalysisResult;
  index: number;
}

const categoryIcons = {
  electricity: '⚡',
  cellular: '📱',
  internet: '🌐'
};

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט'
};

const categoryGradients = {
  electricity: 'from-yellow-400 via-orange-500 to-red-500',
  cellular: 'from-blue-400 via-purple-500 to-pink-500',
  internet: 'from-green-400 via-teal-500 to-blue-500'
};

export const ResultCard = ({ result, index }: ResultCardProps) => {
  const gradientClass = categoryGradients[result.category];
  const savingsPercentage = ((result.monthlySavings / result.currentAmount) * 100);
  const { toast } = useToast();
  
  return (
    <div className="group relative animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
      {/* Magical background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-glow/10 to-success/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-105"></div>
      
      <Card className="relative shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border-0 bg-gradient-to-br from-background/95 via-background to-background/90 backdrop-blur-sm">
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}></div>
        
        {/* Floating decoration elements */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <div className={`w-32 h-32 bg-gradient-to-br ${gradientClass} rounded-full blur-2xl animate-pulse`}></div>
        </div>
        <div className="absolute bottom-8 left-8 opacity-5 group-hover:opacity-15 transition-opacity duration-700">
          <div className={`w-24 h-24 bg-gradient-to-tr ${gradientClass} rounded-full blur-xl animate-pulse delay-500`}></div>
        </div>

        <CardHeader className="relative z-10 pb-6">
          <div className="flex items-start justify-between">
            {/* Enhanced category display */}
            <div className="flex items-center gap-6">
              <div className="relative group/icon">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} rounded-2xl blur-lg opacity-50 group-hover/icon:opacity-80 transition-opacity duration-300 scale-110`}></div>
                <div className={`relative p-6 bg-gradient-to-br ${gradientClass} rounded-2xl shadow-xl flex items-center justify-center text-5xl group-hover/icon:scale-110 transition-transform duration-300`}>
                  {categoryIcons[result.category]}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl font-black">
                    {categoryNames[result.category]}
                  </CardTitle>
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <p className="text-muted-foreground text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  ספק נוכחי: <span className="font-semibold">{result.currentProvider}</span>
                </p>
              </div>
            </div>
            
            {/* Enhanced savings badge */}
            {result.monthlySavings > 0 && (
              <div className="text-left space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-success/20 rounded-2xl blur-lg animate-pulse"></div>
                  <Badge className="relative bg-gradient-to-r from-success via-success/90 to-success/80 text-white text-lg px-6 py-3 shadow-xl animate-bounce border-0">
                    <Award className="ml-2 h-5 w-5" />
                    חיסכון: {formatCurrency(result.monthlySavings)}/חודש
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-success animate-pulse">
                    -{savingsPercentage.toFixed(1)}%
                  </div>
                  <p className="text-xs text-success/70 font-medium">חיסכון</p>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-8 pt-0">
          {/* Enhanced Comparison View */}
          <div className="relative">
            <ComparisonView
              currentProvider={result.currentProvider}
              currentAmount={result.currentAmount}
              recommendedPlan={result.recommendedPlan}
              monthlySavings={result.monthlySavings}
              annualSavings={result.annualSavings}
            />
          </div>

          {/* Enhanced Savings Breakdown */}
          {result.monthlySavings > 0 && (
            <Card className="bg-gradient-to-br from-success/15 via-success/8 to-success/5 border-success/20 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Star className="h-6 w-6 text-success animate-pulse" />
                  <h4 className="text-2xl font-bold text-success">פירוט החיסכון המדהים</h4>
                  <Star className="h-6 w-6 text-success animate-pulse delay-300" />
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-success/20 hover:border-success/40 transition-colors duration-300">
                    <Target className="h-8 w-8 text-success mx-auto mb-3" />
                    <p className="text-sm text-success/70 mb-2 font-medium">חיסכון חודשי</p>
                    <p className="text-3xl font-black text-success">
                      {formatCurrency(result.monthlySavings)}
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors duration-300">
                    <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-sm text-primary/70 mb-2 font-medium">חיסכון שנתי</p>
                    <p className="text-3xl font-black text-primary">
                      {formatCurrency(result.annualSavings)}
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-warning/20 hover:border-warning/40 transition-colors duration-300">
                    <TrendingDown className="h-8 w-8 text-warning-foreground mx-auto mb-3" />
                    <p className="text-sm text-warning-foreground/70 mb-2 font-medium">אחוז חיסכון</p>
                    <p className="text-3xl font-black text-warning-foreground">
                      {((result.monthlySavings / result.currentAmount) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center p-4 bg-gradient-to-r from-white/20 to-white/10 rounded-xl border border-white/20">
                  <p className="text-lg font-bold text-success">
                    🎉 תחסוך {formatCurrency(result.annualSavings * 5)} ב-5 השנים הקרובות!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Action Buttons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative group/signature">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-2xl blur-lg opacity-0 group-hover/signature:opacity-100 transition-opacity duration-300"></div>
              <DigitalSignature
                category={result.category}
                currentProvider={result.currentProvider}
                newProvider={result.recommendedPlan?.providerName || ''}
                newPlan={result.recommendedPlan?.name || ''}
                monthlySavings={result.monthlySavings}
              />
            </div>
            
            <div className="relative group/selector">
              <div className="absolute inset-0 bg-gradient-to-r from-success/20 to-success/10 rounded-2xl blur-lg opacity-0 group-hover/selector:opacity-100 transition-opacity duration-300"></div>
              <PlanSelector
                category={result.category}
                currentAmount={result.currentAmount}
                onPlanSelect={(provider, plan) => {
                  toast({
                    title: "🎉 תכנית נבחרה בהצלחה!",
                    description: `בחרת את ${plan.name} מ${provider.name}. מומלץ להמשיך עם החתימה הדיגיטלית.`,
                  });
                }}
              />
            </div>
          </div>
          
          {/* Call to action */}
          <div className="text-center pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary via-primary-glow to-success hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-8 py-4 rounded-2xl"
            >
              <ArrowRight className="ml-2 h-5 w-5" />
              התחל לחסוך עכשיו!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};