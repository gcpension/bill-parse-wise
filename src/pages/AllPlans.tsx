import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowLeft, Sparkles, TrendingUp, Zap } from "lucide-react";
import { manualPlans } from "@/data/manual-plans";
import DetailedAIComparison from "@/components/plans/DetailedAIComparison";
import { RecommendationContext } from "@/lib/recommendationEngine";
import { useSavingsData } from "@/hooks/useSavingsData";
import { usePageMeta } from "@/hooks/usePageMeta";

const AllPlans = () => {
  const [showComparison, setShowComparison] = useState(false);
  const { savingsData } = useSavingsData();

  // Set page meta
  usePageMeta({
    title: 'השוואה חכמה | EasySwitch',
    description: 'השוואת מסלולים חכמה מבוססת AI - מצא את המסלול הטוב ביותר עבורך עם ניתוח מתקדם.'
  });

  // Default user context for AI analysis
  const userContext: RecommendationContext = {
    category: 'electricity',
    currentProvider: 'חברת החשמל',
    currentAmount: 350,
    usage: 'medium',
    budget: 300,
    priorities: ['price', 'reliability'],
    familySize: 4,
    homeType: 'house'
  };

  // Get electricity plans for comparison
  const electricityPlans = manualPlans.filter(plan => plan.category === 'electricity').slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-purple-200/30 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-purple-600 font-heebo">EasySwitch</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">דף הבית</a>
              <a href="/all-plans" className="text-purple-600 font-medium hover:text-purple-700 transition-colors font-heebo">כל המסלולים</a>
              <a href="/service-request" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">בקשת שירות</a>
              <a href="/magazine" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">מגזין</a>
              <a href="/tips" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">טיפים</a>
              <a href="/about" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">אודות</a>
              <a href="/contact" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">צור קשר</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 lg:px-6 max-w-7xl py-16">
        {!showComparison ? (
          /* Smart Comparison Banner - Main Display */
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-white font-heebo mb-4">
                    השוואה חכמה
                  </h1>
                  <p className="text-xl text-purple-100 font-assistant mb-2">
                    השווה מסלולים עם AI מתקדם
                  </p>
                  <p className="text-lg text-purple-200 font-assistant">
                    ניתוח מעמיק ומותאם אישית
                  </p>
                </div>

                {/* Savings Preview */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-white font-heebo">109₪</div>
                      <div className="text-sm text-purple-200">חיסכון חודשי</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white font-heebo">1,308₪</div>
                      <div className="text-sm text-purple-200">חיסכון שנתי</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white font-heebo">31%</div>
                      <div className="text-sm text-purple-200">אחוז חיסכון</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-white">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-purple-200" />
                    <span className="font-assistant">ניתוח מיידי</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-200" />
                    <span className="font-assistant">המלצות מותאמות</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-purple-200" />
                    <span className="font-assistant">טכנולוגיית AI</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-purple-50 font-bold text-xl px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowComparison(true)}
                >
                  <Brain className="w-6 h-6 ml-3" />
                  התחל השוואה חכמה
                </Button>

                <p className="text-sm text-purple-200 mt-4 font-assistant">
                  ללא עלות • ללא התחייבות • תוצאות מיידיות
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Smart Comparison Results */
          <div className="space-y-8">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => setShowComparison(false)}
              className="mb-6 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              חזור לדף הראשי
            </Button>

            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Brain className="w-12 h-12 text-purple-600" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent font-heebo">
                  תוצאות ההשוואה החכמה
                </h1>
              </div>
              <p className="text-xl text-muted-foreground font-assistant max-w-3xl mx-auto">
                ניתוח מתקדם מבוסס AI של מסלולי החשמל הטובים ביותר עבורך
              </p>
            </div>

            {/* AI Comparison Component */}
            <DetailedAIComparison
              plans={electricityPlans}
              userContext={userContext}
              category="electricity"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPlans;