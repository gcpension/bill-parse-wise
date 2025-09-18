import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Smartphone, Wifi, Tv, Search, Filter, ArrowUpDown, Star, TrendingUp, Award, CheckCircle, Users, Sparkles, Crown } from "lucide-react";
import { Layout } from "@/components/Layout";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { SavingsComparisonHeader } from "@/components/SavingsComparisonHeader";
import { SavingsComparisonBanner } from "@/components/plans/SavingsComparisonBanner";
import AdvancedPlanFilters, { FilterOptions } from "@/components/plans/AdvancedPlanFilters";
import PlanComparison from "@/components/plans/PlanComparison";
import InteractivePlanCard from "@/components/plans/InteractivePlanCard";
import PlanRecommendations from "@/components/plans/PlanRecommendations";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface CategorySavings {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentAmount: number;
  recommendedAmount: number;
  monthlySavings: number;
  annualSavings: number;
}

interface SavingsData {
  currentMonthly: number;
  recommendedMonthly: number;
  monthlySavings: number;
  annualSavings: number;
  currentProvider: string;
  recommendedProvider: string;
  category: string;
}

interface AllPlansProps {
  savingsData?: SavingsData[];
  initialSelectedCategories?: string[];
}

const AllPlans = ({ savingsData = [], initialSelectedCategories = [] }: AllPlansProps) => {
  const [selectedCategories, setSelectedCategoriesFromStorage] = useState<string[]>([]);
  
  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const categories = parsedData.selectedCategories || [];
        setSelectedCategoriesFromStorage(categories);
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, []);

  // Use provided categories or fallback to stored categories
  const effectiveCategories = initialSelectedCategories.length > 0 ? initialSelectedCategories : selectedCategories;
  
  // Generate mock savings data if not provided
  const mockSavingsData = useMemo(() => {
    if (savingsData.length > 0) return savingsData;
    
    // Create mock data based on selected categories for demo
    if (effectiveCategories.length > 0) {
      return effectiveCategories.map(category => ({
        currentMonthly: 180 + Math.random() * 100,
        recommendedMonthly: 120 + Math.random() * 60,
        monthlySavings: 40 + Math.random() * 40,
        annualSavings: (40 + Math.random() * 40) * 12,
        currentProvider: 'ספק נוכחי',
        recommendedProvider: 'מסלול מומלץ',
        category: category === 'cellular' ? 'סלולר' : 
                  category === 'electricity' ? 'חשמל' :
                  category === 'internet' ? 'אינטרנט' :
                  category === 'tv' ? 'טלוויזיה' : category
      }));
    }
    
    return [];
  }, [savingsData, effectiveCategories]);
  
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
    // Default to selected categories if available, otherwise all plans
    return effectiveCategories.length > 0 ? 'selected' as const : 'all' as const;
  };
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'selected' | 'electricity' | 'internet' | 'mobile' | 'tv'>(() => getInitialCategory());
  const [showAllCategories, setShowAllCategories] = useState(() => effectiveCategories.length === 0); // Track if user explicitly chose to see all categories
  
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
      filtered = manualPlans.filter(plan => 
        mappedCategories.includes(plan.category)
      );
    } else {
      // Filter by specific category
      filtered = manualPlans.filter(plan => plan.category === selectedCategory);
    }

    // Search filtering
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.company.toLowerCase().includes(query) ||
        plan.planName.toLowerCase().includes(query) ||
        plan.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Provider filtering
    if (filters.providers.length > 0) {
      filtered = filtered.filter(plan => filters.providers.includes(plan.company));
    }

    // Feature filtering
    if (filters.features.length > 0) {
      filtered = filtered.filter(plan => 
        filters.features.some(feature => 
          plan.features.some(planFeature => 
            planFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    // Price range filtering (exclude electricity plans)
    filtered = filtered.filter(plan => {
      if (plan.category === 'electricity') return true; // Don't filter electricity by price
      return plan.regularPrice >= filters.priceRange[0] && plan.regularPrice <= filters.priceRange[1];
    });

    // Contract length filtering (simulated)
    if (filters.contractLength.length > 0) {
      // Simulate contract length filtering
      filtered = filtered.filter(() => Math.random() > 0.3);
    }

    // Popular plans only
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
      tv: manualPlans.filter(p => p.category === 'tv').length
    };
    
    return counts;
  };

  const counts = getCategoryCounts();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
        {/* Enhanced Savings Comparison Banner */}
        {mockSavingsData.length > 0 && (
          <SavingsComparisonBanner 
            savingsData={mockSavingsData}
            className="container mx-auto px-6"
          />
        )}

        {/* Enhanced Header Section */}
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              כל המסלולים המומלצים עבורכם
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              השוואת מסלולים חכמה וידידותית לפי הצרכים שלכם
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-card to-accent/5 border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-black text-primary mb-2">
                  {filteredPlans.length}
                </div>
                <p className="text-sm text-muted-foreground">מסלולים זמינים</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-card to-accent/5 border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-black text-success mb-2">
                  {availableProviders.length}
                </div>
                <p className="text-sm text-muted-foreground">חברות שירות</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-card to-accent/5 border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-black text-orange-600 mb-2">
                  {comparedPlans.length}/3
                </div>
                <p className="text-sm text-muted-foregreen">מסלולים בהשוואה</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-card to-accent/5 border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-black text-purple-600 mb-2">
                  4
                </div>
                <p className="text-sm text-muted-foreground">קטגוריות שירות</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Category Selection */}
          <div className="mb-8">
            <Tabs value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value as typeof selectedCategory);
              if (value === 'all') {
                setShowAllCategories(true);
              }
            }}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 bg-card/50 backdrop-blur-sm p-2 rounded-2xl border border-border/50">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl font-medium transition-all duration-300"
                >
                  כל הקטגוריות ({filteredPlans.length})
                </TabsTrigger>
                
                {effectiveCategories.length > 1 && (
                  <TabsTrigger 
                    value="selected"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-xl font-medium transition-all duration-300"
                  >
                    הקטגוריות שלכם ({effectiveCategories.length})
                  </TabsTrigger>
                )}
                
                <TabsTrigger 
                  value="electricity"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  חשמל ({counts.electricity})
                </TabsTrigger>
                
                <TabsTrigger 
                  value="internet"
                  className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300"
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  אינטרנט ({counts.internet})
                </TabsTrigger>
                
                <TabsTrigger 
                  value="mobile"
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  סלולר ({counts.mobile})
                </TabsTrigger>
                
                <TabsTrigger 
                  value="tv"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300"
                >
                  <Tv className="w-4 h-4 mr-2" />
                  טלוויזיה ({counts.tv})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Enhanced Filters */}
          <div className="mb-8">
            <AdvancedPlanFilters 
              filters={filters}
              onFiltersChange={setFilters}
              availableProviders={availableProviders}
              availableFeatures={availableFeatures}
            />
          </div>

          {/* AI Recommendations - Temporarily disabled */}
          {/* {userProfile && (
            <div className="mb-8">
              <PlanRecommendations 
                userProfile={userProfile}
                plans={filteredPlans}
                onPlanSelect={handlePlanSelect}
              />
            </div>
          )} */}

          {/* Plans Display - Group by Category (Sector) with Enhanced Design */}
          <div className="space-y-16 max-w-7xl mx-auto">
            {(() => {
              // First filter plans by selected category
              let categoryFilteredPlans = filteredPlans;
              
              if (selectedCategory !== 'all' && selectedCategory !== 'selected') {
                categoryFilteredPlans = filteredPlans.filter(plan => plan.category === selectedCategory);
              }

              // Group filtered plans by category first, then by company
              const plansByCategory = categoryFilteredPlans.reduce((acc, plan) => {
                if (!acc[plan.category]) {
                  acc[plan.category] = {};
                }
                if (!acc[plan.category][plan.company]) {
                  acc[plan.category][plan.company] = [];
                }
                acc[plan.category][plan.company].push(plan);
                return acc;
              }, {} as Record<string, Record<string, typeof categoryFilteredPlans>>);

              const categoryLabelsHebrew = {
                'electricity': 'מסלולי חשמל',
                'internet': 'מסלולי אינטרנט', 
                'mobile': 'מסלולי סלולר',
                'tv': 'מסלולי טלוויזיה וסטרימינג'
              };

              const categoryIcons = {
                'electricity': <Zap className="w-8 h-8" />,
                'internet': <Wifi className="w-8 h-8" />,
                'mobile': <Smartphone className="w-8 h-8" />,
                'tv': <Tv className="w-8 h-8" />
              };

              const categoryColors = {
                'electricity': 'from-yellow-500 via-yellow-400 to-amber-500',
                'internet': 'from-blue-500 via-cyan-400 to-teal-500',
                'mobile': 'from-purple-500 via-violet-400 to-fuchsia-500',
                'tv': 'from-orange-500 via-red-400 to-pink-500'
              };

              const categoryBgPatterns = {
                'electricity': 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50',
                'internet': 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
                'mobile': 'bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50',
                'tv': 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50'
              };

              return Object.entries(plansByCategory)
                .sort(([a], [b]) => {
                  // Sort categories by priority: electricity, internet, mobile, tv
                  const order = ['electricity', 'internet', 'mobile', 'tv'];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map(([category, companiesInCategory]) => (
                  <section key={category} className={`${categoryBgPatterns[category as keyof typeof categoryBgPatterns]} rounded-3xl p-8 border-2 border-white/60 shadow-2xl backdrop-blur-sm`}>
                    {/* Enhanced Category Header */}
                    <div className="mb-12">
                      <div className={`bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} rounded-2xl p-8 text-white shadow-xl relative overflow-hidden`}>
                        {/* Background decorative elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        
                        <div className="relative">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-center gap-6">
                              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/30 ring-4 ring-white/10">
                                {categoryIcons[category as keyof typeof categoryIcons]}
                              </div>
                              <div>
                                <h2 className="text-4xl lg:text-5xl font-black mb-3 tracking-tight">
                                  {categoryLabelsHebrew[category as keyof typeof categoryLabelsHebrew]}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4">
                                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                    <Users className="w-4 h-4" />
                                    <span className="text-lg font-bold">
                                      {Object.values(companiesInCategory).flat().length} מסלולים
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                    <Award className="w-4 h-4" />
                                    <span className="text-lg font-bold">
                                      {Object.keys(companiesInCategory).length} חברות
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Enhanced Category Stats */}
                            <div className="flex items-center gap-4">
                              <div className="text-center bg-white/25 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
                                <div className="text-3xl font-black mb-1">
                                  {Object.keys(companiesInCategory).length}
                                </div>
                                <div className="text-sm font-medium text-white/90">ספקים</div>
                              </div>
                              <div className="text-center bg-white/25 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
                                <div className="text-3xl font-black mb-1">
                                  {category !== 'electricity' ? (
                                    `₪${Math.min(...Object.values(companiesInCategory).flat().map(p => p.regularPrice)) || 0}`
                                  ) : (
                                    `${Math.max(...Object.values(companiesInCategory).flat().map(p => parseInt(p.speed.replace('%', '')) || 0))}%`
                                  )}
                                </div>
                                <div className="text-sm font-medium text-white/90">
                                  {category === 'electricity' ? 'הנחה עד' : 'החל מ-'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Companies in Category */}
                    <div className="space-y-10">
                      {Object.entries(companiesInCategory)
                        .sort(([,a], [,b]) => b.length - a.length)
                        .map(([company, companyPlans]) => {
                          const sortedPlans = companyPlans.sort((a, b) => {
                            if (a.category === 'electricity' || b.category === 'electricity') return 0;
                            return parseInt(a.regularPrice.toString()) - parseInt(b.regularPrice.toString());
                          });

                          return (
                            <div key={`${category}-${company}`} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white/60 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                              {/* Enhanced Company Header */}
                              <div className="bg-gradient-to-r from-white via-gray-50 to-white p-6 border-b border-gray-200/50">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="relative">
                                      <div className={`w-16 h-16 bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} rounded-2xl flex items-center justify-center shadow-lg border-2 border-white`}>
                                        <span className="text-2xl font-black text-white">
                                          {company.slice(0, 2)}
                                        </span>
                                      </div>
                                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">
                                        {company}
                                      </h3>
                                      <div className="flex flex-wrap items-center gap-3">
                                        <p className="text-gray-600 font-medium">
                                          {sortedPlans.length} מסלולים ב{categoryLabelsHebrew[category as keyof typeof categoryLabelsHebrew]?.replace('מסלולי ', '')}
                                        </p>
                                        <div className="flex items-center gap-1">
                                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                          <span className="text-sm font-bold text-gray-700">
                                            {(Math.random() * 1.5 + 3.5).toFixed(1)}
                                          </span>
                                        </div>
                                        <Badge className="bg-success/10 text-success border-success/30 font-medium">
                                          מומלץ
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Enhanced Price Badge */}
                                  <div className="flex items-center gap-3">
                                    {category !== 'electricity' && (
                                      <div className="text-center bg-success/10 border-2 border-success/20 rounded-xl p-3">
                                        <div className="text-2xl font-black text-success">
                                          ₪{Math.min(...sortedPlans.map(p => p.regularPrice))}
                                        </div>
                                        <div className="text-xs text-success/80 font-medium">החל מ- לחודש</div>
                                      </div>
                                    )}
                                    <div className="text-center bg-primary/10 border-2 border-primary/20 rounded-xl p-3">
                                      <div className="text-lg font-black text-primary">
                                        {Math.floor(Math.random() * 30) + 70}%
                                      </div>
                                      <div className="text-xs text-primary/80 font-medium">פופולריות</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Company Plans Grid */}
                              <div className="p-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                  {sortedPlans.map((plan, index) => (
                                    <div key={plan.id} className="relative">
                                      {index === 0 && (
                                        <div className="absolute -top-3 -right-3 z-10">
                                          <div className="bg-gradient-to-r from-success to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white">
                                            <Crown className="w-3 h-3 inline mr-1" />
                                            הכי מומלץ
                                          </div>
                                        </div>
                                      )}
                                      <InteractivePlanCard
                                        plan={plan}
                                        rank={index + 1}
                                        isCompared={comparedPlans.some(p => p.id === plan.id)}
                                        onCompareToggle={handleCompareToggle}
                                        canCompare={comparedPlans.length < 3}
                                        showSavings={mockSavingsData.length > 0}
                                        estimatedSavings={mockSavingsData.find(s => 
                                          (s.category === 'סלולר' && plan.category === 'mobile') ||
                                          s.category === plan.category
                                        )?.monthlySavings}
                                        onSelect={handlePlanSelect}
                                        isRecommended={index === 0}
                                        popularityScore={Math.floor(Math.random() * 40) + 60}
                                        className="hover:scale-105 transition-all duration-300 hover:shadow-xl"
                                      />
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Enhanced Company Summary */}
                                {sortedPlans.length > 0 && (
                                  <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl border-2 border-gray-200/50 shadow-inner">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                      <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                          <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                          <h4 className="text-xl font-black text-gray-900 mb-2">
                                            המסלול המוביל של {company}
                                          </h4>
                                          <p className="text-lg font-bold text-success mb-1">
                                            {sortedPlans[0].planName}
                                          </p>
                                          <p className="text-sm text-gray-600 font-medium">
                                            הבחירה הפופולרית ביותר - מותאם לרוב הלקוחות
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="text-center">
                                          <div className="text-3xl font-black text-success">
                                            ₪{sortedPlans[0].regularPrice}
                                            {sortedPlans[0].category === 'electricity' ? '' : '/חודש'}
                                          </div>
                                          {sortedPlans[0].introPrice > 0 && sortedPlans[0].introPrice !== sortedPlans[0].regularPrice && (
                                            <div className="text-sm text-gray-500 line-through">
                                              ₪{sortedPlans[0].introPrice}
                                            </div>
                                          )}
                                        </div>
                                        <Button 
                                          size="lg"
                                          className="bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-600/90 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                                          onClick={() => handlePlanSelect(sortedPlans[0])}
                                        >
                                          <TrendingUp className="w-5 h-5 mr-2" />
                                          בחר עכשיו
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </section>
                ));
            })()}
          </div>

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
          onPlanSelect={handlePlanSelect}
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