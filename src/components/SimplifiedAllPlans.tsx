import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Star, TrendingUp, CheckCircle, Zap, Smartphone, Wifi, Tv, ArrowRight, Flame, Rocket, Target } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { ExpressForm } from "@/components/ExpressForm";
import { cn } from "@/lib/utils";
import { EnhancedNavigation } from "@/components/ui/enhanced-navigation";
import { FloatingHelpButton } from "@/components/ui/floating-help-button";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <EnhancedNavigation />

      <div className="relative z-10">
        {/* Desktop Sidebar */}
        {selectedCategory && top3Plans.length > 0 && (
          <aside className="hidden xl:block xl:fixed xl:left-8 xl:top-32 xl:w-80 z-20">
            <div className="space-y-6 animate-slide-in-left">
              {/* Savings Hero Card */}
              <Card className="glass-card border-0 overflow-hidden shadow-elegant">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <Sparkles className="w-16 h-16 mx-auto text-purple-600 animate-pulse" />
                      <div className="absolute inset-0 bg-purple-400 blur-2xl opacity-30 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">החיסכון השנתי שלכם</h3>
                    {currentUserPrice && parseFloat(currentUserPrice) > 0 && (
                      <>
                        <div className="relative">
                          <div className="text-6xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-shimmer-text">
                            ₪{calculateSavings(top3Plans[0].regularPrice).toLocaleString()}
                          </div>
                          <div className="absolute inset-0 bg-green-400 blur-3xl opacity-20" />
                        </div>
                        <p className="text-sm text-gray-600">בשנה הראשונה!</p>
                        <Button 
                          onClick={() => handleSelectPlan(top3Plans[0])}
                          className="w-full h-14 text-lg font-bold btn-gradient group relative overflow-hidden shadow-xl"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <TrendingUp className="mr-2 h-6 w-6 relative z-10 group-hover:animate-bounce" />
                          <span className="relative z-10">עברו עכשיו!</span>
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top 3 Mini Cards */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  המסלולים המומלצים
                </h3>
                {top3Plans.map((plan, idx) => (
                  <Card 
                    key={plan.id}
                    className="glass-card hover:shadow-elegant transition-all duration-300 cursor-pointer group border-0"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        {idx === 0 && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 animate-pulse" />}
                        <Badge variant={idx === 0 ? "default" : "outline"} className="text-xs">
                          #{idx + 1}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-sm mb-2 truncate">{plan.planName}</h4>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-purple-600">₪{plan.regularPrice}</span>
                        <span className="text-xs text-gray-500">/חודש</span>
                      </div>
                      {currentUserPrice && (
                        <p className="text-xs text-green-600 font-semibold mt-2">
                          חיסכון: ₪{calculateSavings(plan.regularPrice).toLocaleString()} בשנה
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </aside>
        )}

        <div className={cn(
          "container mx-auto px-4 py-12 transition-all duration-300",
          selectedCategory && top3Plans.length > 0 ? "max-w-5xl xl:mr-96" : "max-w-6xl"
        )}>
          {/* Category Selection */}
          {!selectedCategory && (
            <div className="text-center mb-16 animate-fade-in">
              {/* Animated Hero Icon */}
              <div className="relative mb-8">
                <div className="relative inline-block">
                  <Sparkles className="w-24 h-24 mx-auto text-purple-600 animate-bounce-gentle" />
                  <div className="absolute inset-0 bg-purple-400 blur-3xl opacity-40 animate-pulse" />
                </div>
              </div>

              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 bg-clip-text text-transparent mb-6 animate-shimmer-text bg-300%">
                באיזה שירות תרצו לחסוך?
              </h1>
              <p className="text-2xl text-gray-600 mb-4 font-semibold">
                בחרו קטגוריה ונראה לכם את 3 המסלולים הזולים ביותר
              </p>
              <div className="flex items-center justify-center gap-2 text-green-600 mb-12">
                <Rocket className="w-6 h-6 animate-bounce" />
                <span className="text-lg font-bold">תוצאות מיידיות תוך שניות!</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {Object.entries(categoryConfig).map(([key, config], index) => (
                  <Button
                    key={key}
                    onClick={() => setSelectedCategory(key as CategoryType)}
                    className="h-48 flex-col gap-4 text-2xl font-black glass-card hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 text-purple-700 hover:text-white border-4 border-purple-300 hover:border-transparent shadow-elegant hover:shadow-glow transition-all duration-500 hover:scale-110 group relative overflow-hidden"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      {config.icon}
                    </div>
                    <span className="relative z-10">{config.label}</span>
                    <ArrowRight className="absolute bottom-4 right-4 w-6 h-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Top 3 Plans Display */}
          {selectedCategory && (
            <div className="animate-fade-in">
              {/* Enhanced Hero Header */}
              <div className="text-center mb-16 relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 opacity-10 blur-3xl animate-gradient-x bg-300%" />
                
                <div className="relative">
                  <Badge className="mb-6 text-xl px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl animate-scale-in">
                    <Target className="w-5 h-5 mr-2" />
                    {categoryConfig[selectedCategory].label}
                  </Badge>
                  
                  {/* Animated Crown */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Crown className="h-20 w-20 text-yellow-500 animate-bounce-gentle" />
                      <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 animate-pulse" />
                    </div>
                  </div>

                  <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 bg-clip-text text-transparent mb-8 animate-shimmer-text bg-300%">
                    3 המסלולים הזולים ביותר
                  </h1>

                  {currentUserPrice && parseFloat(currentUserPrice) > 0 && top3Plans[0] && (
                    <div className="inline-block glass-card rounded-3xl px-16 py-8 shadow-elegant border-4 border-green-300 relative overflow-hidden group">
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                          <p className="text-2xl text-gray-700 font-bold">החיסכון השנתי שלכם:</p>
                          <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                        </div>
                        <div className="relative">
                          <div className="text-8xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-shimmer-text bg-300%">
                            ₪{calculateSavings(top3Plans[0].regularPrice).toLocaleString()}
                          </div>
                          <div className="absolute inset-0 bg-green-400 blur-3xl opacity-20 animate-pulse" />
                        </div>
                        <p className="text-lg text-gray-600 mt-3 font-semibold">בשנה הראשונה בלבד!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Top 3 Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                {top3Plans.map((plan, index) => {
                  const savings = calculateSavings(plan.regularPrice);
                  const isTop = index === 0;

                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        "relative overflow-hidden transition-all duration-500 hover:shadow-elegant hover:-translate-y-6 group",
                        isTop
                          ? "border-8 border-green-400 shadow-elegant scale-110 glass-card"
                          : "border-4 border-purple-300 shadow-xl glass-card"
                      )}
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      {/* Enhanced Glow Effect */}
                      {isTop && (
                        <>
                          <div className="absolute -inset-3 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 blur-2xl opacity-50 animate-pulse animate-gradient-x bg-300%" />
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x bg-300%" />
                        </>
                      )}
                      {!isTop && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x bg-300%" />
                      )}

                      <CardContent className="relative z-10 p-10">
                        {/* Enhanced Badge */}
                        <div className="flex items-center justify-between mb-8">
                          <Badge
                            className={cn(
                              "text-xl font-black px-8 py-4 shadow-xl animate-pulse",
                              isTop
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                : "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                            )}
                          >
                            {isTop ? (
                              <div className="flex items-center gap-2">
                                <Crown className="w-6 h-6" />
                                הזול ביותר!
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                #{index + 1}
                              </div>
                            )}
                          </Badge>
                          {isTop && (
                            <div className="relative">
                              <Star className="w-14 h-14 text-yellow-500 fill-yellow-500 animate-spin-slow" />
                              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50" />
                            </div>
                          )}
                        </div>

                        {/* Enhanced Plan Info */}
                        <h3 className="text-3xl font-black text-gray-900 mb-3">
                          {plan.planName}
                        </h3>
                        <p className="text-xl text-gray-600 mb-8 font-semibold">{plan.company}</p>

                        {/* Enhanced Price Display */}
                        <div className="glass-card rounded-3xl p-8 mb-8 border-3 border-purple-200 relative overflow-hidden group/price">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover/price:opacity-100 transition-opacity duration-300" />
                          
                          <div className="relative z-10">
                            <div className="flex items-baseline justify-center gap-3 mb-4">
                              <span className={cn(
                                "text-7xl font-black",
                                isTop 
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                                  : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                              )}>
                                ₪{plan.regularPrice}
                              </span>
                              <span className="text-2xl text-gray-500 font-bold">/חודש</span>
                            </div>
                            {savings > 0 && (
                              <div className="glass-card px-6 py-4 rounded-2xl inline-block border-2 border-green-300">
                                <p className="text-sm text-gray-600 mb-1 font-semibold">חיסכון שנתי</p>
                                <div className={cn(
                                  "text-4xl font-black",
                                  isTop ? "text-green-600" : "text-purple-600"
                                )}>
                                  ₪{savings.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>
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

                        {/* Enhanced CTA Button */}
                        <Button
                          onClick={() => handleSelectPlan(plan)}
                          className={cn(
                            "w-full h-24 text-2xl font-black shadow-elegant hover:shadow-glow transition-all duration-500 hover:scale-105 group/btn relative overflow-hidden",
                            isTop
                              ? "btn-gradient bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                              : "btn-gradient bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                          )}
                        >
                          <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500 animate-gradient-x bg-300%" />
                          <TrendingUp className="ml-3 h-10 w-10 relative z-10 group-hover/btn:animate-bounce" />
                          <span className="relative z-10">עברו עכשיו וחסכו!</span>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

              {/* Enhanced Bottom CTA */}
              <div className="text-center mb-12">
                <div className="inline-block glass-card p-4 rounded-3xl border-4 border-purple-300">
                  <Button
                    onClick={() => top3Plans[0] && handleSelectPlan(top3Plans[0])}
                    className="h-32 px-32 text-5xl font-black btn-gradient relative overflow-hidden group shadow-elegant hover:shadow-glow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x bg-300%" />
                    <Sparkles className="ml-4 h-14 w-14 relative z-10 group-hover:animate-spin" />
                    <span className="relative z-10">עברו למסלול הזול ביותר!</span>
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-3 mt-8">
                  <Rocket className="w-8 h-8 text-green-600 animate-bounce" />
                  <p className="text-2xl text-gray-700 font-black animate-pulse">
                    ⚡ התהליך לוקח פחות מ-3 דקות
                  </p>
                  <Rocket className="w-8 h-8 text-green-600 animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>

              {/* Enhanced Change Category Button */}
              <div className="text-center">
                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentUserPrice('');
                  }}
                  variant="outline"
                  className="text-xl px-12 py-8 glass-card border-3 border-purple-300 hover:border-purple-500 transition-all duration-300"
                >
                  שנו קטגוריה
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Help Button */}
      <FloatingHelpButton />

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

      {/* Enhanced Mobile Sticky CTA */}
      {selectedCategory && top3Plans[0] && currentUserPrice && parseFloat(currentUserPrice) > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 animate-slide-in-bottom">
          <div className="p-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 shadow-elegant animate-gradient-x bg-300%">
            <div className="glass-card rounded-2xl p-2 border-2 border-white/30">
              <Button
                onClick={() => handleSelectPlan(top3Plans[0])}
                className="w-full h-20 bg-white text-green-600 hover:bg-gray-50 shadow-xl hover:scale-105 transition-transform duration-300"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Rocket className="h-6 w-6 animate-bounce" />
                    <span className="text-lg font-bold">חסכו עכשיו!</span>
                  </div>
                  <span className="text-3xl font-black text-green-600">
                    ₪{calculateSavings(top3Plans[0].regularPrice).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">בשנה</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
