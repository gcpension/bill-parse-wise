import { useState } from 'react';
import { ArrowRight, RotateCcw, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/Layout';
import { SavingsHero } from '@/components/modern/SavingsHero';
import { CategoryCard } from '@/components/modern/CategoryCard';
import { Zap, Smartphone, Wifi } from 'lucide-react';
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

interface AnalysisResultsProps {
  results: AnalysisResult[];
  onBackToInput: () => void;
}

const categoryConfig = {
  electricity: { icon: Zap, name: 'חשמל', color: 'yellow' },
  cellular: { icon: Smartphone, name: 'סלולר', color: 'blue' },
  internet: { icon: Wifi, name: 'אינטרנט', color: 'green' }
};

export const AnalysisResults = ({ results, onBackToInput }: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const totalMonthlySavings = results.reduce((sum, result) => sum + result.monthlySavings, 0);
  const totalAnnualSavings = results.reduce((sum, result) => sum + result.annualSavings, 0);

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              תוצאות הניתוח שלך
            </h1>
            <p className="text-muted-foreground text-lg">
              ניתחנו את ההוצאות שלך ומצאנו לך הזדמנויות חיסכון מדהימות
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

        {/* Savings Hero */}
        <SavingsHero
          totalMonthlySavings={totalMonthlySavings}
          totalAnnualSavings={totalAnnualSavings}
          resultsCount={results.length}
        />

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <span>תצוגה כללית</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2 py-3">
              <span>פירוט מלא</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              {results.map((result, index) => {
                const config = categoryConfig[result.category];
                return (
                  <CategoryCard
                    key={result.category}
                    category={result.category}
                    currentProvider={result.currentProvider}
                    currentAmount={result.currentAmount}
                    recommendedPlan={result.recommendedPlan}
                    monthlySavings={result.monthlySavings}
                    annualSavings={result.annualSavings}
                    allProviders={result.allProviders}
                    icon={config.icon}
                    name={config.name}
                    index={index}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid gap-8">
              {results.map((result, index) => {
                const config = categoryConfig[result.category];
                return (
                  <div key={result.category} className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl">
                      <config.icon className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">{config.name} - ניתוח מפורט</h3>
                    </div>
                    
                    <CategoryCard
                      category={result.category}
                      currentProvider={result.currentProvider}
                      currentAmount={result.currentAmount}
                      recommendedPlan={result.recommendedPlan}
                      monthlySavings={result.monthlySavings}
                      annualSavings={result.annualSavings}
                      allProviders={result.allProviders}
                      icon={config.icon}
                      name={config.name}
                      index={index}
                    />
                    
                    {/* Additional detailed analysis */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-accent/30">
                        <h4 className="font-semibold mb-2">סיכום החיסכון</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>חיסכון חודשי:</span>
                            <span className="font-semibold text-success">₪{result.monthlySavings.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>חיסכון שנתי:</span>
                            <span className="font-semibold text-success">₪{result.annualSavings.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>אחוז חיסכון:</span>
                            <span className="font-semibold">{Math.round((result.monthlySavings / result.currentAmount) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-accent/30">
                        <h4 className="font-semibold mb-2">מידע נוסף</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>ספקים זמינים:</span>
                            <span className="font-semibold">{result.allProviders.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>זמן החזר השקעה:</span>
                            <span className="font-semibold">מיידי</span>
                          </div>
                          <div className="flex justify-between">
                            <span>רמת קושי מעבר:</span>
                            <span className="font-semibold text-success">קל</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-primary/5 to-primary-glow/5 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">הצעדים הבאים</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h4 className="font-semibold">בחר חבילה</h4>
              <p className="text-sm text-muted-foreground">
                בחר את החבילה המתאימה לך מהתוצאות למעלה
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h4 className="font-semibold">צור קשר</h4>
              <p className="text-sm text-muted-foreground">
                פנה לספק החדש והתחל את תהליך המעבר
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h4 className="font-semibold">התחל לחסוך</h4>
              <p className="text-sm text-muted-foreground">
                תהנה מהחיסכון החודשי החל מהחשבון הבא
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
              <ArrowRight className="ml-2 h-5 w-5" />
              התחל לחסוך עכשיו
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};