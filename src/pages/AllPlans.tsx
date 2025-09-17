import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Smartphone, Wifi, Tv, Search, Filter, ArrowUpDown, Star, TrendingUp, Award, CheckCircle, Users, Sparkles } from "lucide-react";
import { Layout } from "@/components/Layout";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { SavingsComparisonHeader } from "@/components/SavingsComparisonHeader";
import AdvancedPlanFilters, { FilterOptions } from "@/components/plans/AdvancedPlanFilters";
import PlanComparison from "@/components/plans/PlanComparison";
import EnhancedPlanCard from "@/components/plans/EnhancedPlanCard";
import PlanRecommendations from "@/components/plans/PlanRecommendations";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface CategorySavings {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentAmount: number;
  newAmount: number;
  monthlySavings: number;
  currentProvider: string;
  newProvider: string;
}

interface AllPlansProps {
  initialSelectedCategories?: string[];
  savingsData?: CategorySavings[];
}

const AllPlans = ({ initialSelectedCategories = [], savingsData = [] }: AllPlansProps) => {
  // Get selected categories from localStorage if not provided as props
  const [selectedCategories, setSelectedCategoriesFromStorage] = useState<string[]>([]);
  const { isVisible: headerVisible, elementRef: headerRef } = useScrollAnimation();
  const { isVisible: filtersVisible, elementRef: filtersRef } = useScrollAnimation();
  const { isVisible: plansVisible, elementRef: plansRef } = useScrollAnimation();
  
  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const analysisData = JSON.parse(storedData);
        const categories = analysisData.map((item: any) => item.category);
        setSelectedCategoriesFromStorage(categories);
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, []);

  // Use provided categories or fallback to stored categories
  const effectiveCategories = initialSelectedCategories.length > 0 ? initialSelectedCategories : selectedCategories;
  
  // Set initial category based on analyzed categories
  const getInitialCategory = () => {
    if (effectiveCategories.length === 1) {
      const cat = effectiveCategories[0];
      if (cat === 'cellular') return 'mobile';
      if (cat === 'electricity' || cat === 'internet' || cat === 'tv') return cat as 'electricity' | 'internet' | 'tv';
    }
    if (effectiveCategories.length > 1) {
      // If multiple categories selected, show selected categories only
      return 'selected' as const;
    }
    // Default to all plans if no specific category
    return 'all' as const;
  };
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'selected' | 'electricity' | 'internet' | 'mobile' | 'tv'>(getInitialCategory());
  const [showAllCategories, setShowAllCategories] = useState(false); // Track if user explicitly chose to see all categories
  
  // Enhanced state for new features
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    category: getInitialCategory(),
    priceRange: [0, 500],
    minRating: 0,
    sortBy: 'popularity',
    providers: [],
    contractLength: [],
    features: [],
    showPopularOnly: false,
    showNewOnly: false
  });
  
  const [comparedPlans, setComparedPlans] = useState<ManualPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  useEffect(() => {
    document.title = "כל המסלולים | חסכונט";
  }, []);

  // Update filters when category changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, category: selectedCategory }));
  }, [selectedCategory, showAllCategories]);

  // Get available providers and features for filters
  const availableProviders = useMemo(() => 
    [...new Set(manualPlans.map(plan => plan.company))].sort()
  , []);
  
  const availableFeatures = useMemo(() => {
    const allFeatures = manualPlans.flatMap(plan => plan.features);
    return [...new Set(allFeatures)].sort().slice(0, 20); // Limit to most common features
  }, []);

  // Enhanced filtering and sorting logic
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = manualPlans;

    // Base category filtering with improved logic
    if (selectedCategory === 'all') {
      // Show all plans from all categories
      filtered = manualPlans;
    } else if (selectedCategory === 'selected') {
      // Show only plans from selected categories (priority display)
      const categoryMapping = { 'cellular': 'mobile' };
      const mappedCategories = effectiveCategories.map(cat => 
        categoryMapping[cat as keyof typeof categoryMapping] || cat
      );
      filtered = filtered.filter(plan => mappedCategories.includes(plan.category));
    } else {
      filtered = filtered.filter(plan => plan.category === selectedCategory);
    }

    // Apply advanced filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.company.toLowerCase().includes(query) ||
        plan.planName.toLowerCase().includes(query) ||
        plan.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    if (filters.providers.length > 0) {
      filtered = filtered.filter(plan => filters.providers.includes(plan.company));
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter(plan => 
        filters.features.some(feature => 
          plan.features.some(planFeature => planFeature.toLowerCase().includes(feature.toLowerCase()))
        )
      );
    }

    // Price filtering (convert price to number for comparison)
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
      filtered = filtered.filter(plan => {
        if (plan.category === 'electricity') return true; // Skip price filter for electricity
        const price = parseInt(plan.regularPrice.toString());
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Popularity and newness filters
    if (filters.showPopularOnly) {
      // Simulate popularity (in real app, this would be based on actual data)
      filtered = filtered.filter(() => Math.random() > 0.3); // Show ~70% as "popular"
    }

    if (filters.showNewOnly) {
      // Simulate new plans
      filtered = filtered.filter(() => Math.random() > 0.8); // Show ~20% as "new"
    }

    // Rating filter (simulate ratings)
    if (filters.minRating > 0) {
      filtered = filtered.filter(() => {
        const simulatedRating = Math.random() * 1.5 + 3.5;
        return simulatedRating >= filters.minRating;
      });
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          if (a.category === 'electricity' || b.category === 'electricity') return 0;
          return parseInt(a.regularPrice.toString()) - parseInt(b.regularPrice.toString());
        case 'rating':
          // Simulate rating-based sort
          return Math.random() - 0.5;
        case 'savings':
          // Simulate savings-based sort
          return Math.random() - 0.5;
        case 'popularity':
        default:
          // Simulate popularity-based sort
          return Math.random() - 0.5;
      }
    });

    return filtered;
  }, [selectedCategory, effectiveCategories, filters]);

  // Comparison handlers
  const handleCompareToggle = (plan: ManualPlan) => {
    if (comparedPlans.find(p => p.id === plan.id)) {
      setComparedPlans(prev => prev.filter(p => p.id !== plan.id));
    } else if (comparedPlans.length < 3) {
      setComparedPlans(prev => [...prev, plan]);
    }
  };

  const handleRemoveFromComparison = (planId: string) => {
    setComparedPlans(prev => prev.filter(p => p.id !== planId));
  };

  const handleClearComparison = () => {
    setComparedPlans([]);
  };

  // Handle plan selection from recommendations
  const handlePlanSelect = (plan: ManualPlan) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

  // User profile for recommendations (could be enhanced with real user data)
  const userProfile = useMemo(() => {
    if (effectiveCategories.length === 1) {
      return {
        category: effectiveCategories[0] === 'cellular' ? 'mobile' : effectiveCategories[0],
        budget: 200, // Could be derived from analysis
        usage: 'medium' as const
      };
    }
    return undefined;
  }, [effectiveCategories]);

  // Use the filtered plans
  const filteredPlans = filteredAndSortedPlans;

  const categoryLabels = {
    all: 'כל הקטגוריות',
    selected: 'הקטגוריות שנבחרו',
    electricity: 'חבילות חשמל',
    internet: 'חבילות אינטרנט',
    mobile: 'חבילות סלולר',
    tv: 'חבילות טלוויזיה וסטרימינג'
  };

  const getCategoryCounts = () => {
    const counts = {
      electricity: manualPlans.filter(p => p.category === 'electricity').length,
      internet: manualPlans.filter(p => p.category === 'internet').length,
      mobile: manualPlans.filter(p => p.category === 'mobile').length,
      tv: manualPlans.filter(p => p.category === 'tv').length,
    };
    return counts;
  };

  const counts = getCategoryCounts();

  return (
    <Layout>
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          {/* Savings Comparison Header - Only show if we have savings data */}
          {savingsData.length > 0 && (
            <SavingsComparisonHeader categorySavings={savingsData} />
          )}

          {/* Enhanced Header */}
          <header 
            ref={headerRef}
            className={`text-center mb-12 transition-all duration-1000 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-xl"></div>
              <Card className="relative bg-gradient-to-r from-card/90 to-accent/5 border-0 shadow-2xl backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-x">
                      {savingsData.length > 0 ? 'המסלולים המומלצים עבורכם' : 'כל המסלולים'}
                    </h1>
                    <Award className="w-8 h-8 text-primary animate-bounce-gentle" />
                  </div>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
                    {savingsData.length > 0 
                      ? 'בחרו את המסלולים שיחסכו לכם הכי הרבה כסף מהרשימה המותאמת אישית'
                      : `בחרו את המסלול המתאים לכם מבין ${manualPlans.length} המסלולים הזמינים`
                    }
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                      <div className="text-2xl font-bold text-primary">{manualPlans.length}</div>
                      <div className="text-sm text-muted-foreground">מסלולים</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-sm text-muted-foreground">שביעות רצון</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">₪2,400</div>
                      <div className="text-sm text-muted-foreground">חיסכון ממוצע</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600">50K+</div>
                      <div className="text-sm text-muted-foreground">לקוחות</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </header>

          {/* Smart Recommendations */}
          {filteredPlans.length > 0 && (
            <div 
              ref={filtersRef}
              className={`mb-12 transition-all duration-1000 ${
                filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Card className="bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 border-0 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Star className="w-6 h-6 text-accent" />
                    המלצות חכמות עבורכם
                    <Badge className="bg-accent/20 text-accent border-accent/30">AI</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PlanRecommendations
                    plans={filteredPlans}
                    userProfile={userProfile}
                    onPlanSelect={handlePlanSelect}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Filters Section */}
          <div className="mb-8">
            <Card className="bg-card/80 backdrop-blur-xl border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-primary" />
                  מסנני חיפוש מתקדמים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedPlanFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableProviders={availableProviders}
                  availableFeatures={availableFeatures}
                />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Category Filter */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-card/90 to-accent/5 border-0 shadow-lg backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  {effectiveCategories.length > 0 && (
                    <Button
                      variant={selectedCategory === 'selected' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedCategory('selected');
                        setShowAllCategories(false);
                      }}
                      className="group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-primary transition-all duration-300 font-bold hover:scale-105"
                    >
                      <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      <span>המסלולים שלכם ({effectiveCategories.length} קטגוריות)</span>
                    </Button>
                  )}
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowAllCategories(true);
                    }}
                    className="group bg-card/90 hover:bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
                  >
                    <TrendingUp className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>כל המסלולים ({manualPlans.length})</span>
                  </Button>
                  
                  {/* Category buttons with enhanced styling */}
                  <Button
                    variant={selectedCategory === 'electricity' ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedCategory('electricity');
                      setShowAllCategories(false);
                    }}
                    className={`group backdrop-blur-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                      selectedCategory === 'electricity' 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400 hover:from-yellow-500 hover:to-yellow-600 shadow-lg' 
                        : 'bg-yellow-50/80 border-yellow-200 hover:border-yellow-400 text-yellow-700 hover:bg-yellow-100/80 hover:shadow-md'
                    }`}
                  >
                    <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>חשמל ({counts.electricity})</span>
                  </Button>
                  
                  <Button
                    variant={selectedCategory === 'internet' ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedCategory('internet');
                      setShowAllCategories(false);
                    }}
                    className={`group backdrop-blur-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                      selectedCategory === 'internet' 
                        ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-white border-cyan-400 hover:from-cyan-500 hover:to-cyan-600 shadow-lg' 
                        : 'bg-cyan-50/80 border-cyan-200 hover:border-cyan-400 text-cyan-700 hover:bg-cyan-100/80 hover:shadow-md'
                    }`}
                  >
                    <Wifi className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>אינטרנט ({counts.internet})</span>
                  </Button>
                  
                  <Button
                    variant={selectedCategory === 'mobile' ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedCategory('mobile');
                      setShowAllCategories(false);
                    }}
                    className={`group backdrop-blur-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                      selectedCategory === 'mobile' 
                        ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border-purple-400 hover:from-purple-500 hover:to-purple-600 shadow-lg' 
                        : 'bg-purple-50/80 border-purple-200 hover:border-purple-400 text-purple-700 hover:bg-purple-100/80 hover:shadow-md'
                    }`}
                  >
                    <Smartphone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>סלולר ({counts.mobile})</span>
                  </Button>
                  
                  <Button
                    variant={selectedCategory === 'tv' ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedCategory('tv');
                      setShowAllCategories(false);
                    }}
                    className={`group backdrop-blur-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                      selectedCategory === 'tv' 
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-orange-400 hover:from-orange-500 hover:to-orange-600 shadow-lg' 
                        : 'bg-orange-50/80 border-orange-200 hover:border-orange-400 text-orange-700 hover:bg-orange-100/80 hover:shadow-md'
                    }`}
                  >
                    <Tv className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>טלוויזיה ({counts.tv})</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Category Title */}
          <div 
            ref={plansRef}
            className={`text-center mb-8 transition-all duration-1000 ${
              plansVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {categoryLabels[selectedCategory]}
                </h2>
                <Badge className="bg-accent/20 text-accent border-accent/30 text-lg px-4 py-2">
                  {filteredPlans.length} מסלולים זמינים
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Plans Grid - Group by category when showing multiple categories */}
          {(selectedCategory === 'all' && showAllCategories) || selectedCategory === 'selected' || effectiveCategories.length > 1 ? (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Group plans by category */}
              {['electricity', 'internet', 'mobile', 'tv'].map(category => {
                // Check if this category should be shown
                const filterCategory = category === 'mobile' ? 'cellular' : category;
                const shouldShowCategory = selectedCategory === 'all' || 
                                         selectedCategory === 'selected' ||
                                         effectiveCategories.includes(filterCategory);
                
                if (!shouldShowCategory) return null;
                
                const categoryPlans = filteredPlans.filter(plan => 
                  category === 'mobile' ? plan.category === 'mobile' : plan.category === category
                );
                
                if (categoryPlans.length === 0) return null;
                
                const getCategoryInfo = (cat: string) => {
                  switch(cat) {
                    case 'electricity': return { name: 'חשמל', color: 'border-yellow-400/30 bg-yellow-50/30', gradient: 'from-yellow-400 to-yellow-500' };
                    case 'mobile': return { name: 'סלולר', color: 'border-purple-400/30 bg-purple-50/30', gradient: 'from-purple-400 to-purple-500' };
                    case 'internet': return { name: 'אינטרנט', color: 'border-cyan-400/30 bg-cyan-50/30', gradient: 'from-cyan-400 to-cyan-500' };
                    case 'tv': return { name: 'טלוויזיה', color: 'border-orange-400/30 bg-orange-50/30', gradient: 'from-orange-400 to-orange-500' };
                    default: return { name: cat, color: 'border-gray-400/30 bg-gray-50/30', gradient: 'from-gray-400 to-gray-500' };
                  }
                };
                
                const categoryInfo = getCategoryInfo(category);
                
                return (
                  <div key={category} className={`p-6 rounded-xl border-2 ${categoryInfo.color} backdrop-blur-sm`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryInfo.gradient} text-white shadow-lg`}>
                        {category === 'electricity' && <Zap className="h-6 w-6" />}
                        {category === 'mobile' && <Smartphone className="h-6 w-6" />}
                        {category === 'internet' && <Wifi className="h-6 w-6" />}
                        {category === 'tv' && <Tv className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold bg-gradient-to-r ${categoryInfo.gradient} bg-clip-text text-transparent`}>
                          מסלולי {categoryInfo.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {categoryPlans.length} מסלולים מותאמים עבורך
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
                      {categoryPlans.map((plan, index) => (
                        <EnhancedPlanCard
                          key={plan.id}
                          plan={plan}
                          rank={index + 1}
                          isCompared={comparedPlans.some(p => p.id === plan.id)}
                          onCompareToggle={handleCompareToggle}
                          canCompare={comparedPlans.length < 3}
                          showSavings={savingsData.length > 0}
                          estimatedSavings={savingsData.find(s => 
                            (s.category === 'cellular' && plan.category === 'mobile') ||
                            s.category === plan.category
                          )?.monthlySavings}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 max-w-7xl mx-auto">
              {filteredPlans.map((plan, index) => (
              <EnhancedPlanCard
                key={plan.id}
                plan={plan}
                rank={index + 1}
                isCompared={comparedPlans.some(p => p.id === plan.id)}
                onCompareToggle={handleCompareToggle}
                canCompare={comparedPlans.length < 3}
                showSavings={savingsData.length > 0}
                estimatedSavings={savingsData.find(s => 
                  (s.category === 'cellular' && plan.category === 'mobile') ||
                  s.category === plan.category
                )?.monthlySavings}
                compact
              />
              ))}
            </section>
          )}

          {filteredPlans.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">לא נמצאו מסלולים בקטגוריה זו</p>
            </div>
          )}
        </div>

        {/* Plan Comparison Floating Panel */}
        <PlanComparison
          comparedPlans={comparedPlans}
          onRemovePlan={handleRemoveFromComparison}
          onClearAll={handleClearComparison}
        />

        {/* Enhanced Switch Request Form */}
        {selectedPlan && (
          <EnhancedSwitchRequestForm 
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedPlan(null);
            }}
            selectedPlan={selectedPlan}
          />
        )}
      </div>
    </Layout>
  );
};

export default AllPlans;