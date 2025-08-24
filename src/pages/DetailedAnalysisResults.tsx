import { useState } from 'react';
import { ArrowRight, Download, Share, RotateCcw, Zap, Smartphone, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/Layout';
import { DetailedSavingsHeader } from '@/components/detailed/DetailedSavingsHeader';
import { PlanComparisonTable } from '@/components/detailed/PlanComparisonTable';
import { useToast } from '@/hooks/use-toast';

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

interface DetailedAnalysisResultsProps {
  results: AnalysisResult[];
  onBackToInput: () => void;
}

const categoryConfig = {
  electricity: { icon: Zap, name: 'חשמל', color: 'golden' },
  cellular: { icon: Smartphone, name: 'סלולר', color: 'electric' },
  internet: { icon: Wifi, name: 'אינטרנט', color: 'vibrant' }
};

// Mock data for detailed plans
const generateDetailedPlans = (category: string, providers: any[]) => {
  return providers.flatMap(provider => 
    provider.plans.map((plan: any) => ({
      ...plan,
      provider: provider.name,
      rating: provider.rating,
      description: provider.description,
      features: plan.features || ['שירות לקוחות 24/7', 'התקנה חינם', 'אחריות מלאה'],
      data: category === 'cellular' ? (plan.data || 'ללא הגבלה') : undefined,
      minutes: category === 'cellular' ? (plan.minutes || 'ללא הגבלה') : undefined,
      sms: category === 'cellular' ? (plan.sms || 'ללא הגבלה') : undefined,
      savings: Math.max(0, Math.random() * 200)
    }))
  ).sort((a, b) => a.price - b.price);
};

export const DetailedAnalysisResults = ({ results, onBackToInput }: DetailedAnalysisResultsProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(results[0]?.category || 'cellular');
  const { toast } = useToast();

  const totalMonthlySavings = results.reduce((sum, result) => sum + result.monthlySavings, 0);
  const totalAnnualSavings = results.reduce((sum, result) => sum + result.annualSavings, 0);

  const currentResult = results.find(r => r.category === activeCategory) || results[0];
  const categoryInfo = categoryConfig[currentResult.category];
  
  const detailedPlans = generateDetailedPlans(currentResult.category, currentResult.allProviders);
  const savingsPercentage = Math.round((currentResult.monthlySavings / currentResult.currentAmount) * 100);

  const handleShare = () => {
    toast({
      title: "שותף בהצלחה! 📤",
      description: "הקישור לתוצאות נשמר ללוח",
    });
  };

  const handleDownload = () => {
    toast({
      title: "מוריד דוח... 📄",
      description: "הדוח יישמר במחשב שלך בקרוב",
    });
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              תוצאות הניתוח המפורט
            </h1>
            <p className="text-muted-foreground text-lg">
              ניתוח מקיף של כל האפשרויות הזמינות עבורך
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleShare}>
              <Share className="ml-2 h-4 w-4" />
              שתף
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="ml-2 h-4 w-4" />
              הורד דוח
            </Button>
            <Button variant="outline" onClick={onBackToInput}>
              <RotateCcw className="ml-2 h-4 w-4" />
              נתח עוד
            </Button>
          </div>
        </div>

        {/* Category Selection Tabs */}
        {results.length > 1 && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gradient-to-r from-accent/50 to-accent/30">
              {results.map((result) => {
                const config = categoryConfig[result.category];
                const Icon = config.icon;
                return (
                  <TabsTrigger 
                    key={result.category} 
                    value={result.category}
                    className="flex items-center space-x-2 rtl:space-x-reverse py-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-base font-semibold">{config.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        )}

        {/* Detailed Savings Header */}
        <DetailedSavingsHeader
          category={currentResult.category}
          categoryName={categoryInfo.name}
          monthlySavings={currentResult.monthlySavings}
          annualSavings={currentResult.annualSavings}
          savingsPercentage={savingsPercentage}
          currentAmount={currentResult.currentAmount}
          recommendedAmount={currentResult.recommendedPlan?.price || 0}
        />

        {/* Plan Comparison Table */}
        <PlanComparisonTable
          category={currentResult.category}
          categoryName={categoryInfo.name}
          currentProvider={currentResult.currentProvider}
          currentAmount={currentResult.currentAmount}
          plans={detailedPlans}
        />

        {/* Total Savings Summary */}
        {results.length > 1 && (
          <div className="bg-gradient-to-br from-success/10 to-success-glow/10 rounded-xl p-8 border border-success/20">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-success">
                סה"כ חיסכון מכל השירותים
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-success">
                    ₪{totalMonthlySavings.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">חיסכון חודשי</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-success">
                    ₪{totalAnnualSavings.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">חיסכון שנתי</div>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-success to-success-glow hover:from-success-glow hover:to-success">
                <ArrowRight className="ml-2 h-5 w-5" />
                התחל לחסוך עכשיו
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};