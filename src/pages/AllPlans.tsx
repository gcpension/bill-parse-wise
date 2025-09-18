import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Smartphone, Wifi, Tv, Search, Filter, ArrowUpDown, Star, TrendingUp, Award, CheckCircle, Users, Sparkles, Crown, ArrowRight } from "lucide-react";
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
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
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

         {/* Elegant Header Section */}
         <div className="container mx-auto px-6 py-8">
           <div className="text-center mb-12">
             <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-foreground">
               כל המסלולים המומלצים עבורכם
             </h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               השוואת מסלולים חכמה וידידותית לפי הצרכים שלכם
             </p>
           </div>

           {/* Professional Savings Display */}
           {mockSavingsData.length > 0 && (
             <div className="mb-12">
               <div className="text-center mb-8">
                 <h2 className="text-lg font-semibold text-foreground mb-2">סיכום החיסכון שלכם</h2>
                 <p className="text-sm text-muted-foreground">השוואה בין המצב הנוכחי לבין המסלולים המומלצים</p>
               </div>
               
               <div className="max-w-4xl mx-auto">
                 <div className="grid gap-6">
                   {mockSavingsData.map((savings, index) => {
                     const currentMonthly = Math.round(savings.currentMonthly);
                     const recommendedMonthly = Math.round(savings.recommendedMonthly);
                     const monthlySavings = Math.round(savings.monthlySavings);
                     const annualSavings = Math.round(savings.annualSavings);
                     const savingsPercentage = Math.round((monthlySavings / currentMonthly) * 100);
                     
                     return (
                       <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                         <CardContent className="p-6">
                           <div className="flex items-center justify-between">
                             {/* Category Info */}
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                 <span className="text-lg font-semibold text-gray-600">
                                   {savings.category === 'סלולר' ? '📱' : 
                                    savings.category === 'חשמל' ? '⚡' :
                                    savings.category === 'אינטרנט' ? '🌐' :
                                    savings.category === 'טלוויזיה' ? '📺' : '🏠'}
                                 </span>
                               </div>
                               <div>
                                 <h3 className="font-semibold text-gray-900">{savings.category}</h3>
                                 <p className="text-sm text-gray-500">מסלולים מומלצים זמינים</p>
                               </div>
                             </div>

                             {/* Current vs New Payment */}
                             <div className="flex items-center gap-8">
                               <div className="text-center">
                                 <p className="text-xs text-gray-500 mb-1">תשלום נוכחי</p>
                                 <div className="text-lg font-bold text-gray-900">₪{currentMonthly.toLocaleString()}</div>
                                 <div className="text-xs text-gray-400">לחודש</div>
                               </div>
                               
                               <div className="flex items-center text-gray-400">
                                 <ArrowRight className="w-4 h-4" />
                               </div>
                               
                               <div className="text-center">
                                 <p className="text-xs text-gray-500 mb-1">תשלום חדש</p>
                                 <div className="text-lg font-bold text-blue-600">₪{recommendedMonthly.toLocaleString()}</div>
                                 <div className="text-xs text-gray-400">לחודש</div>
                               </div>
                               
                               {/* Savings Highlight */}
                               <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                                 <div className="text-xs text-green-600 font-medium mb-1">חיסכון</div>
                                 <div className="text-xl font-bold text-green-700">₪{monthlySavings.toLocaleString()}</div>
                                 <div className="text-xs text-green-600">{savingsPercentage}% לחודש</div>
                                 <div className="text-xs text-green-500 mt-1">₪{annualSavings.toLocaleString()} לשנה</div>
                               </div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     );
                   })}
                 </div>
               </div>
             </div>
           )}

           {/* Compact Stats */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             <div className="text-center p-4 bg-gradient-to-r from-card to-accent/5 rounded-xl border border-border/50 hover:shadow-lg transition-all duration-300">
               <div className="text-2xl font-bold text-primary mb-1">{filteredPlans.length}</div>
               <p className="text-sm text-muted-foreground">מסלולים זמינים</p>
             </div>
             
             <div className="text-center p-4 bg-gradient-to-r from-card to-accent/5 rounded-xl border border-border/50 hover:shadow-lg transition-all duration-300">
               <div className="text-2xl font-bold text-success mb-1">{availableProviders.length}</div>
               <p className="text-sm text-muted-foreground">חברות שירות</p>
             </div>
             
             <div className="text-center p-4 bg-gradient-to-r from-card to-accent/5 rounded-xl border border-border/50 hover:shadow-lg transition-all duration-300">
               <div className="text-2xl font-bold text-orange-600 mb-1">{comparedPlans.length}/3</div>
               <p className="text-sm text-muted-foreground">בהשוואה</p>
             </div>
             
             <div className="text-center p-4 bg-gradient-to-r from-card to-accent/5 rounded-xl border border-border/50 hover:shadow-lg transition-all duration-300">
               <div className="text-2xl font-bold text-purple-600 mb-1">4</div>
               <p className="text-sm text-muted-foreground">קטגוריות</p>
             </div>
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

          {/* Plans Display - Company Selection First */}
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
                  <section key={category} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-8">
                    {/* Professional Category Header */}
                    <div className="mb-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                              {categoryIcons[category as keyof typeof categoryIcons]}
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                {categoryLabelsHebrew[category as keyof typeof categoryLabelsHebrew]}
                              </h2>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{Object.values(companiesInCategory).flat().length} מסלולים</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  <span>{Object.keys(companiesInCategory).length} חברות</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Category Stats */}
                          <div className="flex items-center gap-3">
                            <div className="text-center bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                              <div className="text-sm font-semibold text-gray-900 mb-1">
                                {Object.keys(companiesInCategory).length}
                              </div>
                              <div className="text-xs text-gray-500">ספקים</div>
                            </div>
                            <div className="text-center bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                              <div className="text-sm font-semibold text-gray-900 mb-1">
                                {category !== 'electricity' ? (
                                  `₪${Math.min(...Object.values(companiesInCategory).flat().map(p => p.regularPrice)) || 0}`
                                ) : (
                                  `${Math.max(...Object.values(companiesInCategory).flat().map(p => parseInt(p.speed.replace('%', '')) || 0))}%`
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {category === 'electricity' ? 'הנחה עד' : 'החל מ-'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Company Selection or Plans Display */}
                    <div className="space-y-8">
                      {!selectedCompany ? (
                        // Show company grid when no company is selected
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(companiesInCategory)
                            .sort(([,a], [,b]) => b.length - a.length)
                            .map(([company, companyPlans]) => {
                              const minPrice = Math.min(...companyPlans.map(p => p.regularPrice));
                              const avgRating = (Math.random() * 1.5 + 3.5).toFixed(1);
                              
                              return (
                                <Card 
                                  key={`${category}-${company}`}
                                  className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 cursor-pointer group"
                                  onClick={() => setSelectedCompany(company)}
                                >
                                  <CardContent className="p-5">
                                    <div className="flex items-start gap-3 mb-4">
                                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 group-hover:bg-gray-200 transition-colors">
                                        <span className="text-lg font-bold text-gray-700">
                                          {company.slice(0, 2)}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                          {company}
                                        </h3>
                                        <div className="flex items-center gap-3 mb-2">
                                          <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span className="text-sm font-medium text-gray-700">{avgRating}</span>
                                          </div>
                                          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                                            מומלץ
                                          </Badge>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                          {companyPlans.length} מסלולים זמינים
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div>
                                          <p className="text-xs text-gray-600 mb-1">מחיר התחלתי</p>
                                          <div className="text-lg font-bold text-gray-900">
                                            {category !== 'electricity' ? `₪${minPrice}/חודש` : `${Math.max(...companyPlans.map(p => parseInt(p.speed.replace('%', '')) || 0))}% הנחה`}
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-blue-600">
                                            {Math.floor(Math.random() * 30) + 70}%
                                          </div>
                                          <div className="text-xs text-gray-500">פופולריות</div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>מסלולים מומלצים במיוחד</span>
                                      </div>
                                      
                                      <Button 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm transition-all duration-300 group-hover:bg-blue-700"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedCompany(company);
                                        }}
                                      >
                                        צפה במסלולים
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                        </div>
                      ) : (
                        // Show plans for selected company
                        <div className="space-y-8">
                          {/* Back button and company header */}
                          <div className="flex items-center gap-4 mb-8">
                            <Button 
                              variant="outline"
                              onClick={() => setSelectedCompany(null)}
                              className="flex items-center gap-2 hover:bg-primary/10"
                            >
                              ← חזרה לבחירת חברה
                            </Button>
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} rounded-xl flex items-center justify-center shadow-lg border-2 border-white`}>
                                <span className="text-lg font-black text-white">
                                  {selectedCompany.slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-2xl font-black text-gray-900">
                                  מסלולי {selectedCompany}
                                </h3>
                                <p className="text-gray-600">
                                  {companiesInCategory[selectedCompany]?.length} מסלולים זמינים
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Plans grid for selected company */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {companiesInCategory[selectedCompany]
                              ?.sort((a, b) => {
                                if (a.category === 'electricity' || b.category === 'electricity') return 0;
                                return parseInt(a.regularPrice.toString()) - parseInt(b.regularPrice.toString());
                              })
                              .map((plan, index) => (
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
                        </div>
                      )}
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