import { useState } from 'react';
import { ArrowRight, RotateCcw, Download, Share, Sparkles, Award, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { SavingsHero } from '@/components/modern/SavingsHero';
import { CategoryCard } from '@/components/modern/CategoryCard';
import { Zap, Smartphone, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

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

interface AnalysisResultsProps {
  results: AnalysisResult[];
  onBackToInput: () => void;
}

import { Tv } from 'lucide-react';

const categoryConfig = {
  electricity: { icon: Zap, name: 'חשמל', color: 'yellow' },
  cellular: { icon: Smartphone, name: 'סלולר', color: 'blue' },
  internet: { icon: Wifi, name: 'אינטרנט', color: 'green' },
  tv: { icon: Tv, name: 'טלוויזיה וסטרימינג', color: 'purple' }
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

  const animatedMonthlySavings = useAnimatedCounter({ 
    end: totalMonthlySavings, 
    duration: 2000 
  });
  
  const animatedAnnualSavings = useAnimatedCounter({ 
    end: totalAnnualSavings, 
    duration: 2500 
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-success/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-success/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 space-y-12 animate-fade-in p-6">
          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-success rounded-full blur-2xl opacity-20 animate-pulse scale-150"></div>
              <div className="relative bg-gradient-to-r from-primary via-primary-glow to-success p-6 rounded-full shadow-2xl">
                <Sparkles className="h-16 w-16 text-white animate-bounce" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl font-black bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent">
                תוצאות מדהימות!
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                מצאנו לך הזדמנויות חיסכון פנטסטיות שיחסכו לך אלפי שקלים בשנה
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="lg" onClick={handleShare} className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <Share className="ml-2 h-5 w-5" />
                שתף עם חברים
              </Button>
              <Button variant="outline" size="lg" onClick={handleDownload} className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <Download className="ml-2 h-5 w-5" />
                הורד דוח PDF
              </Button>
              <Button size="lg" onClick={onBackToInput} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg">
                <RotateCcw className="ml-2 h-5 w-5" />
                נתח עוד שירותים
              </Button>
            </div>
          </div>

          {/* Enhanced Savings Summary */}
          <Card className="shadow-2xl bg-gradient-to-br from-success/20 via-success/10 to-transparent border-success/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-success/20 to-transparent rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
            
            <CardContent className="p-12 relative z-10">
              <div className="text-center space-y-8">
                <div className="flex items-center justify-center gap-4">
                  <Award className="h-12 w-12 text-success animate-bounce" />
                  <h2 className="text-4xl font-black text-success">החיסכון הכולל שלך</h2>
                  <Award className="h-12 w-12 text-success animate-bounce delay-300" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/5 rounded-3xl blur-lg group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-success/30 hover:border-success/50 transition-all duration-500">
                      <Target className="h-8 w-8 text-success mx-auto mb-4" />
                      <p className="text-7xl font-black text-success mb-2 animate-pulse">
                        {formatCurrency(animatedMonthlySavings)}
                      </p>
                      <p className="text-xl text-success/80 font-bold">חיסכון חודשי</p>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-lg group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-primary/30 hover:border-primary/50 transition-all duration-500">
                      <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
                      <p className="text-7xl font-black text-primary mb-2 animate-pulse">
                        {formatCurrency(animatedAnnualSavings)}
                      </p>
                      <p className="text-xl text-primary/80 font-bold">חיסכון שנתי</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <p className="text-2xl font-bold text-success mb-2">
                    🎉 מדהים! תוכל לחסוך {formatCurrency(animatedAnnualSavings)} בשנה הקרובה
                  </p>
                  <p className="text-lg text-muted-foreground">
                    זה כמו לקבל {Math.round(animatedAnnualSavings / 3000)} משכורות נוספות!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Results Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-2 shadow-lg">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-3 py-4 px-8 rounded-xl text-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>תצוגה כללית</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="detailed" 
                  className="flex items-center gap-3 py-4 px-8 rounded-xl text-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Target className="h-5 w-5" />
                  <span>פירוט מלא</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid gap-8">
                {results.map((result, index) => {
                  const config = categoryConfig[result.category];
                  return (
                    <div key={result.category} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
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
                    </div>
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

          {/* Enhanced Next Steps */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary-glow/5 to-success/10 border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary-glow to-success"></div>
            
            <CardContent className="p-12 relative z-10">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                    <h3 className="text-4xl font-black bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                      הצעדים הבאים
                    </h3>
                    <Sparkles className="h-8 w-8 text-primary animate-pulse delay-500" />
                  </div>
                  <p className="text-xl text-muted-foreground">בואו נתחיל לחסוך יחד!</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="group text-center space-y-4 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary-glow text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                        1
                      </div>
                    </div>
                    <h4 className="text-xl font-bold">בחר את החבילה המושלמת</h4>
                    <p className="text-muted-foreground">
                      בחר את החבילה עם החיסכון הגדול ביותר מהתוצאות למעלה
                    </p>
                  </div>
                  
                  <div className="group text-center space-y-4 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/20 to-primary-glow/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary-glow to-primary text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                        2
                      </div>
                    </div>
                    <h4 className="text-xl font-bold">צור קשר מיידי</h4>
                    <p className="text-muted-foreground">
                      פנה לספק החדש והתחל את תהליך המעבר הפשוט
                    </p>
                  </div>
                  
                  <div className="group text-center space-y-4 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-success to-success/80 text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                        3
                      </div>
                    </div>
                    <h4 className="text-xl font-bold">התחל לחסוך מיד</h4>
                    <p className="text-muted-foreground">
                      תהנה מהחיסכון החודשי החל מהחשבון הבא שלך
                    </p>
                  </div>
                </div>
                
                <div className="pt-8">
                  <Button size="lg" className="bg-gradient-to-r from-primary via-primary-glow to-success hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-12 py-6 rounded-2xl">
                    <ArrowRight className="ml-3 h-6 w-6" />
                    בואו נתחיל לחסוך יחד!
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};