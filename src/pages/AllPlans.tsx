import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Zap, Smartphone, Wifi, Tv, ArrowLeft, Sparkles, Star, Filter, Search, X, Plus, Minus, TrendingDown, CheckCircle2, ArrowRight } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PersonalizedRecommendationEngine, UserProfile, PersonalizedRecommendation } from "@/lib/personalizedRecommendations";
import { RecommendationResults } from "@/components/plans/RecommendationResults";
import { PersonalizedRecommendationWizard } from "@/components/PersonalizedRecommendationWizard";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/Layout";

type CategoryType = 'electricity' | 'internet' | 'mobile' | 'tv';

const AllPlans = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [comparedPlans, setComparedPlans] = useState<ManualPlan[]>([]);
  const [showPersonalizedWizard, setShowPersonalizedWizard] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [showPersonalizedResults, setShowPersonalizedResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedUserProfile, setSavedUserProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<ManualPlan | null>(null);

  // Load Quick Flow data if available
  useEffect(() => {
    const quickFlowData = localStorage.getItem('quickFlowData');
    if (quickFlowData) {
      try {
        const data = JSON.parse(quickFlowData);
        if (data.detectedCategory) {
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'mobile',
            'electricity': 'electricity',
            'internet': 'internet',
            'tv': 'tv'
          };
          setSelectedCategory(categoryMapping[data.detectedCategory] || data.detectedCategory as CategoryType);
        }
        localStorage.removeItem('quickFlowData');
      } catch (error) {
        console.error('Error loading Quick Flow data:', error);
      }
    }
  }, []);

  // Set page meta
  usePageMeta({
    title: 'כל התוכניות | EasySwitch',
    description: 'מרכז התוכניות החכם - השוואה מבוססת AI והמלצות מותאמות אישית.'
  });

  const categoryConfig = {
    electricity: {
      label: 'חשמל',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    internet: {
      label: 'אינטרנט',
      icon: Wifi,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    mobile: {
      label: 'סלולר',
      icon: Smartphone,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    tv: {
      label: 'טלוויזיה',
      icon: Tv,
      gradient: 'from-green-500 to-teal-600',
      bgGradient: 'from-green-50 to-teal-50'
    }
  };

  const filteredPlans = useMemo(() => {
    if (!selectedCategory) return [];
    
    return manualPlans.filter(plan => {
      if (plan.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          plan.company.toLowerCase().includes(query) ||
          plan.planName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (plan.regularPrice > 0) {
        if (plan.regularPrice < priceRange[0] || plan.regularPrice > priceRange[1]) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => (a.regularPrice || 0) - (b.regularPrice || 0));
  }, [selectedCategory, searchQuery, priceRange]);

  const handlePersonalizedRecommendation = async (userProfile: UserProfile, categories: CategoryType[]) => {
    setIsAnalyzing(true);
    setShowPersonalizedWizard(false);
    setSavedUserProfile(userProfile);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const allRecommendations: PersonalizedRecommendation[] = [];
      
      for (const category of categories) {
        const categoryPlans = manualPlans.filter(p => p.category === category);
        if (categoryPlans.length === 0) continue;
        
        const recommendations = PersonalizedRecommendationEngine.generatePersonalizedRecommendations(
          categoryPlans, 
          userProfile, 
          category as string
        );
        allRecommendations.push(...recommendations);
      }
      
      setPersonalizedRecommendations(allRecommendations);
      setIsAnalyzing(false);
      setShowPersonalizedResults(true);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setIsAnalyzing(false);
    }
  };

  const handleSelectForSwitch = (plan: ManualPlan) => {
    localStorage.setItem('selectedPlanForSwitch', JSON.stringify({
      planName: plan.planName,
      company: plan.company,
      price: plan.regularPrice,
      category: plan.category,
      features: plan.features,
      switchType: 'switch'
    }));
    window.location.href = '/service-request';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Modern Header */}
          <div className="mb-16 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">מערכת חכמה להשוואת תוכניות</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                מצא את התוכנית
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                המושלמת עבורך
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              השווה מאות תוכניות מהספקים המובילים בישראל בממשק אינטראקטיבי ומתקדם
            </p>
          </div>

          {/* Category Selection - Modern Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {(Object.entries(categoryConfig) as [CategoryType, typeof categoryConfig[CategoryType]][]).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = selectedCategory === key;
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    "group relative p-8 rounded-2xl border-2 transition-all duration-300 hover-lift",
                    isSelected 
                      ? `border-transparent bg-gradient-to-br ${config.gradient} text-white shadow-2xl` 
                      : "border-slate-200 bg-white hover:border-primary/50 hover:shadow-xl"
                  )}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                      "p-4 rounded-2xl transition-all duration-300",
                      isSelected 
                        ? "bg-white/20 backdrop-blur-sm" 
                        : `bg-gradient-to-br ${config.gradient} text-white group-hover:scale-110`
                    )}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <div className="text-center">
                      <h3 className={cn(
                        "text-xl font-bold mb-1",
                        isSelected ? "text-white" : "text-slate-900"
                      )}>
                        {config.label}
                      </h3>
                      <p className={cn(
                        "text-sm",
                        isSelected ? "text-white/80" : "text-slate-500"
                      )}>
                        {filteredPlans.filter(p => p.category === key).length} תוכניות
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Plans Grid */}
          {selectedCategory && filteredPlans.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900">
                  תוכניות {categoryConfig[selectedCategory].label}
                </h2>
                <Badge variant="secondary" className="text-base px-4 py-2">
                  {filteredPlans.length} תוכניות זמינות
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.slice(0, 12).map((plan) => (
                  <Card 
                    key={plan.id} 
                    className="group relative overflow-hidden hover-lift border-2 hover:border-primary/50 transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {/* Company Badge */}
                        <div className="flex items-start justify-between">
                          <Badge className={cn(
                            "px-4 py-1.5 text-sm font-semibold bg-gradient-to-r",
                            categoryConfig[selectedCategory].gradient,
                            "text-white"
                          )}>
                            {plan.company}
                          </Badge>
                        </div>

                        {/* Plan Name */}
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                            {plan.planName}
                          </h3>
                        </div>

                        {/* Price */}
                        {plan.regularPrice > 0 && (
                          <div className="relative">
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                ₪{plan.regularPrice}
                              </span>
                              <span className="text-slate-500 text-lg">/חודש</span>
                            </div>
                            {plan.introPrice && plan.introPrice < plan.regularPrice && (
                              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                                <TrendingDown className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">
                                  מחיר מבצע ₪{plan.introPrice}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Features */}
                        <div className="space-y-2 pt-4 border-t-2 border-slate-100">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                              <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <Button 
                          onClick={() => handleSelectForSwitch(plan)}
                          className={cn(
                            "w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all",
                            "bg-gradient-to-r",
                            categoryConfig[selectedCategory].gradient,
                            "text-white group-hover:scale-105"
                          )}
                        >
                          בחר תוכנית זו
                          <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedCategory && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                בחר קטגוריה להתחלה
              </h3>
              <p className="text-slate-600 text-lg">
                לחץ על אחת הקטגוריות למעלה כדי לראות את כל התוכניות הזמינות
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
        {showPersonalizedResults && (
          <RecommendationResults
            isOpen={showPersonalizedResults}
            onClose={() => setShowPersonalizedResults(false)}
            recommendations={personalizedRecommendations}
            plans={manualPlans}
            onPlanSelect={handleSelectForSwitch}
            userLocation={savedUserProfile?.location}
          />
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="p-10 max-w-md w-full glass-effect">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">מנתח את הבקשה שלך</h3>
                  <p className="text-slate-600">
                    מחפש את התוכניות הטובות ביותר עבורך
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {showPersonalizedWizard && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
            <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
              <Card className="w-full max-w-4xl glass-effect">
                <CardHeader className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-4"
                    onClick={() => setShowPersonalizedWizard(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <CardTitle className="text-center text-3xl">אשף המלצות מותאמות אישית</CardTitle>
                </CardHeader>
                <CardContent>
                  <PersonalizedRecommendationWizard
                    categories={['electricity', 'mobile', 'internet', 'tv']}
                    onClose={() => setShowPersonalizedWizard(false)}
                    onComplete={(profile, categories) => {
                      handlePersonalizedRecommendation(profile, categories);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllPlans;
