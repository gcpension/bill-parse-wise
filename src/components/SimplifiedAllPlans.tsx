import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Star, TrendingUp, CheckCircle, Zap, Smartphone, Wifi, Tv } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { ExpressForm } from "@/components/ExpressForm";
import { cn } from "@/lib/utils";
import { EnhancedNavigation } from "@/components/ui/enhanced-navigation";

type CategoryType = 'electricity' | 'internet' | 'mobile' | 'tv';

export const SimplifiedAllPlans = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [currentUserPrice, setCurrentUserPrice] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);

  // Load data from Quick Start
  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const firstCategory = parsedData[0].category;
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'mobile',
            'electricity': 'electricity',
            'internet': 'internet',
            'tv': 'tv'
          };
          setSelectedCategory(categoryMapping[firstCategory] || firstCategory as CategoryType);
          setCurrentUserPrice(parsedData[0].amount || '');
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, []);

  const categoryConfig = {
    electricity: { label: 'חשמל', icon: <Zap className="w-6 h-6" /> },
    internet: { label: 'אינטרנט', icon: <Wifi className="w-6 h-6" /> },
    mobile: { label: 'סלולר', icon: <Smartphone className="w-6 h-6" /> },
    tv: { label: 'טלוויזיה', icon: <Tv className="w-6 h-6" /> }
  };

  // Get top 3 cheapest plans
  const top3Plans = selectedCategory 
    ? manualPlans
        .filter(p => p.category === selectedCategory && p.regularPrice > 0)
        .sort((a, b) => a.regularPrice - b.regularPrice)
        .slice(0, 3)
    : [];

  const handleSelectPlan = (plan: ManualPlan) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

  const calculateSavings = (planPrice: number) => {
    if (!currentUserPrice || parseFloat(currentUserPrice) <= 0) return 0;
    return Math.max(0, (parseFloat(currentUserPrice) - planPrice) * 12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <EnhancedNavigation />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Category Selection */}
        {!selectedCategory && (
          <div className="text-center mb-16 animate-fade-in">
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-purple-600 animate-pulse" />
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              באיזה שירות תרצו לחסוך?
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              בחרו קטגוריה ונראה לכם את 3 המסלולים הזולים ביותר
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedCategory(key as CategoryType)}
                  className="h-40 flex-col gap-4 text-xl font-bold bg-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 text-purple-700 hover:text-white border-4 border-purple-200 hover:border-transparent shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                >
                  {config.icon}
                  {config.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Top 3 Plans Display */}
        {selectedCategory && (
          <div className="animate-fade-in">
            {/* Hero Header */}
            <div className="text-center mb-16">
              <Badge className="mb-4 text-lg px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                {categoryConfig[selectedCategory].label}
              </Badge>
              
              <h1 className="text-6xl font-black text-gray-900 mb-6">
                3 המסלולים הזולים ביותר
              </h1>

              {currentUserPrice && parseFloat(currentUserPrice) > 0 && (
                <div className="inline-block bg-white rounded-3xl px-12 py-6 shadow-2xl border-4 border-green-300">
                  <p className="text-lg text-gray-600 mb-2">החיסכון השנתי שלכם:</p>
                  <div className="text-7xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₪{calculateSavings(top3Plans[0]?.regularPrice || 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">בשנה הראשונה!</p>
                </div>
              )}
            </div>

            {/* Top 3 Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {top3Plans.map((plan, index) => {
                const savings = calculateSavings(plan.regularPrice);
                const isTop = index === 0;

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-4",
                      isTop
                        ? "border-8 border-green-400 shadow-2xl scale-110 bg-gradient-to-br from-green-50 to-emerald-50"
                        : "border-4 border-purple-300 shadow-xl bg-white"
                    )}
                  >
                    {/* Glow Effect for #1 */}
                    {isTop && (
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-400 blur-2xl opacity-40 animate-pulse" />
                    )}

                    <CardContent className="relative z-10 p-8">
                      {/* Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <Badge
                          className={cn(
                            "text-xl font-black px-6 py-3",
                            isTop
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                              : "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                          )}
                        >
                          {isTop ? '🏆 הזול ביותר!' : `#${index + 1}`}
                        </Badge>
                        {isTop && (
                          <Star className="w-12 h-12 text-yellow-500 fill-yellow-500 animate-spin-slow" />
                        )}
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {plan.planName}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6">{plan.company}</p>

                      {/* Price */}
                      <div className="bg-white/80 rounded-2xl p-6 mb-6 border-2 border-gray-200">
                        <div className="flex items-baseline justify-center gap-2 mb-3">
                          <span className="text-6xl font-black text-purple-600">
                            ₪{plan.regularPrice}
                          </span>
                          <span className="text-xl text-gray-500">/חודש</span>
                        </div>
                        {savings > 0 && (
                          <div className="bg-green-100 rounded-xl px-4 py-3 inline-block">
                            <p className="text-sm text-gray-600 mb-1">חיסכון שנתי</p>
                            <div className="text-3xl font-black text-green-600">
                              ₪{savings.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="mb-6 space-y-2">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button
                        onClick={() => handleSelectPlan(plan)}
                        className={cn(
                          "w-full h-20 text-2xl font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105",
                          isTop
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                            : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                        )}
                      >
                        <TrendingUp className="ml-3 h-8 w-8" />
                        עברו עכשיו וחסכו!
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <Button
                onClick={() => top3Plans[0] && handleSelectPlan(top3Plans[0])}
                className="h-28 px-24 text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-green-500 hover:from-purple-700 hover:via-pink-600 hover:to-green-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 rounded-3xl"
              >
                <Sparkles className="ml-4 h-12 w-12" />
                עברו למסלול הזול ביותר!
              </Button>
              <p className="text-lg text-gray-600 mt-6 font-bold animate-pulse">
                ⚡ התהליך לוקח פחות מ-3 דקות
              </p>
            </div>

            {/* Change Category Button */}
            <div className="text-center mt-12">
              <Button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentUserPrice('');
                }}
                variant="outline"
                className="text-lg px-8 py-6"
              >
                שנו קטגוריה
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Express Form */}
      {selectedPlan && (
        <ExpressForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPlan(null);
          }}
          selectedPlan={selectedPlan}
        />
      )}

      {/* Mobile Sticky CTA */}
      {selectedCategory && top3Plans[0] && currentUserPrice && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 to-emerald-600 p-4 shadow-2xl">
          <Button
            onClick={() => handleSelectPlan(top3Plans[0])}
            className="w-full h-16 text-xl font-bold bg-white text-green-600 hover:bg-gray-50"
          >
            <div className="flex flex-col items-center">
              <span>חסכו עכשיו!</span>
              <span className="text-2xl font-black">
                ₪{calculateSavings(top3Plans[0].regularPrice).toLocaleString()}
              </span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};
