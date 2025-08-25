import { useState, useEffect } from 'react';
import { ArrowRight, Download, Share, RotateCcw, Zap, Smartphone, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/Layout';
import { DetailedSavingsHeader } from '@/components/detailed/DetailedSavingsHeader';
import { PlanComparisonTable } from '@/components/detailed/PlanComparisonTable';
import { useToast } from '@/hooks/use-toast';
import { ResultsHeader2025 } from '@/components/detailed/ResultsHeader2025';

interface AnalysisResult {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
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

import { Tv } from 'lucide-react';

const categoryConfig = {
  electricity: { icon: Zap, name: 'חשמל', color: 'golden' },
  cellular: { icon: Smartphone, name: 'סלולר', color: 'electric' },
  internet: { icon: Wifi, name: 'אינטרנט', color: 'vibrant' },
  tv: { icon: Tv, name: 'טלוויזיה וסטרימינג', color: 'purple' }
};

// Mock data for detailed plans
const generateDetailedPlans = (category: string, providers: any[]) => {
  return (providers || []).flatMap(provider => 
    (provider.plans || []).map((plan: any) => ({
      ...plan,
      provider: provider.name,
      rating: provider.rating,
      description: provider.description,
      features: plan.features || ['שירות לקוחות 24/7', 'התקנה חינם', 'אחריות מלאה'],
      data: category === 'cellular' ? (plan.data || 'ללא הגבלה') : undefined,
      minutes: category === 'cellular' ? (plan.minutes || 'ללא הגבלה') : undefined,
      sms: category === 'cellular' ? (plan.sms || 'ללא הגבלה') : undefined,
      originalPrice: plan.originalPrice,
      discount: plan.discount?.amount,
      recommended: plan.recommended || false,
      period: plan.period,
      currency: plan.currency,
      detailedDescription: plan.detailedDescription,
      targetAudience: plan.targetAudience,
      pros: plan.pros,
      cons: plan.cons,
      limitations: plan.limitations,
      savings: typeof plan.originalPrice === 'number' && plan.originalPrice > plan.price
        ? plan.originalPrice - plan.price
        : Math.max(0, Math.round(Math.random() * 200))
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
  useEffect(() => {
    document.title = `תוצאות ניתוח - חיסכון חודשי ₪${totalMonthlySavings.toLocaleString('he-IL')}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    const canonical = (document.querySelector('link[rel="canonical"]') as HTMLLinkElement) || document.createElement('link');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'גלה חיסכון חודשי ושנתי לפי קטגוריה והחלפת ספק - ניתוח מותאם אישית.');
    } else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = 'גלה חיסכון חודשי ושנתי לפי קטגוריה והחלפת ספק - ניתוח מותאם אישית.';
      document.head.appendChild(m);
    }
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href);
    if (!canonical.parentNode) document.head.appendChild(canonical);
  }, [totalMonthlySavings]);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <ResultsHeader2025 totalMonthlySavings={totalMonthlySavings} totalAnnualSavings={totalAnnualSavings} onShare={handleShare} onDownload={handleDownload} onBack={onBackToInput} />

        {/* Category Selection Tabs */}
        {results.length > 1 && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gradient-card rounded-xl">
              {results.map((result) => {
                const config = categoryConfig[result.category];
                const Icon = config.icon;
                return (
                  <TabsTrigger 
                    key={result.category} 
                    value={result.category}
                    className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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