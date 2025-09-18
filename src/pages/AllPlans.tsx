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

           {/* Innovative Savings Display */}
           {mockSavingsData.length > 0 && (
             <div className="mb-12">
               <div className="text-center mb-8">
                 <h2 className="text-xl font-bold text-foreground mb-2">החיסכון שלכם</h2>
                 <p className="text-muted-foreground">כמה אתם משלמים היום מול כמה תוכלו לחסוך</p>
               </div>
               
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                 {mockSavingsData.map((savings, index) => {
                   const currentMonthly = Math.round(savings.currentMonthly);
                   const recommendedMonthly = Math.round(savings.recommendedMonthly);
                   const monthlySavings = Math.round(savings.monthlySavings);
                   const annualSavings = Math.round(savings.annualSavings);
                   const savingsPercentage = Math.round((monthlySavings / currentMonthly) * 100);
                   
                   return (
                     <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-white via-accent/5 to-white border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                       {/* Background decoration */}
                       <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
                       <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-success/20 to-primary/20 rounded-full blur-xl"></div>
                       
                       <CardContent className="p-8 relative z-10">
                         <div className="text-center mb-6">
                           <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                             <span className="text-2xl font-black text-white">
                               {savings.category.charAt(0)}
                             </span>
                           </div>
                           <h3 className="text-lg font-bold text-foreground">{savings.category}</h3>
                         </div>

                         {/* Current Payment */}
                         <div className="space-y-4 mb-6">
                           <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                             <div className="text-center">
                               <p className="text-sm text-destructive/80 mb-1">מה שאתם משלמים היום</p>
                               <div className="flex items-center justify-center gap-3">
                                 <div>
                                   <div className="text-2xl font-black text-destructive">₪{currentMonthly.toLocaleString()}</div>
                                   <div className="text-xs text-destructive/60">לחודש</div>
                                 </div>
                                 <div className="w-px h-8 bg-destructive/30"></div>
                                 <div>
                                   <div className="text-xl font-bold text-destructive">₪{(currentMonthly * 12).toLocaleString()}</div>
                                   <div className="text-xs text-destructive/60">לשנה</div>
                                 </div>
                               </div>
                             </div>
                           </div>

                           {/* Savings Arrow */}
                           <div className="flex justify-center">
                             <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                               <ArrowRight className="w-6 h-6 text-white transform rotate-90" />
                             </div>
                           </div>

                           {/* New Payment */}
                           <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                             <div className="text-center">
                               <p className="text-sm text-success/80 mb-1">עם המסלול החדש</p>
                               <div className="flex items-center justify-center gap-3">
                                 <div>
                                   <div className="text-2xl font-black text-success">₪{recommendedMonthly.toLocaleString()}</div>
                                   <div className="text-xs text-success/60">לחודש</div>
                                 </div>
                                 <div className="w-px h-8 bg-success/30"></div>
                                 <div>
                                   <div className="text-xl font-bold text-success">₪{(recommendedMonthly * 12).toLocaleString()}</div>
                                   <div className="text-xs text-success/60">לשנה</div>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Savings Highlight */}
                         <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-success/10 border-2 border-primary/30 rounded-2xl p-6 text-center">
                           <div className="flex items-center justify-center gap-2 mb-3">
                             <Crown className="w-5 h-5 text-primary animate-pulse" />
                             <span className="text-sm font-bold text-primary">החיסכון שלכם</span>
                           </div>
                           
                           <div className="space-y-2">
                             <div className="text-3xl font-black bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                               ₪{monthlySavings.toLocaleString()}
                             </div>
                             <div className="text-sm text-muted-foreground">לחודש</div>
                             
                             <div className="flex items-center justify-center gap-4 mt-4">
                               <div className="text-center">
                                 <div className="text-xl font-black text-success">₪{annualSavings.toLocaleString()}</div>
                                 <div className="text-xs text-muted-foreground">לשנה</div>
                               </div>
                               <div className="w-px h-8 bg-border"></div>
                               <div className="text-center">
                                 <div className="text-xl font-black text-primary">{savingsPercentage}%</div>
                                 <div className="text-xs text-muted-foreground">חיסכון</div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   );
                 })}
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
                  <section key={category} className={`${categoryBgPatterns[category as keyof typeof categoryBgPatterns]} rounded-3xl p-8 border-2 border-white/60 shadow-2xl backdrop-blur-sm`}>
                    {/* Elegant Category Header */}
                    <div className="mb-8">
                      <div className={`bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} rounded-xl p-6 text-white shadow-lg relative overflow-hidden`}>
                        {/* Subtle background decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
                        
                        <div className="relative">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                                {categoryIcons[category as keyof typeof categoryIcons]}
                              </div>
                              <div>
                                <h2 className="text-xl lg:text-2xl font-bold mb-2">
                                  {categoryLabelsHebrew[category as keyof typeof categoryLabelsHebrew]}
                                </h2>
                                <div className="flex flex-wrap items-center gap-3">
                                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-sm">
                                    <Users className="w-3 h-3" />
                                    <span className="font-medium">
                                      {Object.values(companiesInCategory).flat().length} מסלולים
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-sm">
                                    <Award className="w-3 h-3" />
                                    <span className="font-medium">
                                      {Object.keys(companiesInCategory).length} חברות
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Category Stats */}
                            <div className="flex items-center gap-3">
                              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-md">
                                <div className="text-lg font-bold mb-1">
                                  {Object.keys(companiesInCategory).length}
                                </div>
                                <div className="text-xs font-medium text-white/80">ספקים</div>
                              </div>
                              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-md">
                                <div className="text-lg font-bold mb-1">
                                  {category !== 'electricity' ? (
                                    `₪${Math.min(...Object.values(companiesInCategory).flat().map(p => p.regularPrice)) || 0}`
                                  ) : (
                                    `${Math.max(...Object.values(companiesInCategory).flat().map(p => parseInt(p.speed.replace('%', '')) || 0))}%`
                                  )}
                                </div>
                                <div className="text-xs font-medium text-white/80">
                                  {category === 'electricity' ? 'הנחה עד' : 'החל מ-'}
                                </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(companiesInCategory)
                            .sort(([,a], [,b]) => b.length - a.length)
                            .map(([company, companyPlans]) => {
                              const minPrice = Math.min(...companyPlans.map(p => p.regularPrice));
                              const avgRating = (Math.random() * 1.5 + 3.5).toFixed(1);
                              
                              return (
                                <Card 
                                  key={`${category}-${company}`}
                                  className="group bg-white/90 backdrop-blur-sm border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                  onClick={() => setSelectedCompany(company)}
                                >
                                  <CardContent className="p-8">
                                    <div className="flex items-start gap-4 mb-6">
                                      <div className={`w-16 h-16 bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} rounded-2xl flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-all duration-300`}>
                                        <span className="text-2xl font-black text-white">
                                          {company.slice(0, 2)}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                          {company}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                          <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                                          <Badge className="bg-success/10 text-success border-success/30 text-xs">מומלץ</Badge>
                                        </div>
                                        <p className="text-gray-600 font-medium text-sm">
                                          {companyPlans.length} מסלולים זמינים
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-success/10 to-green-100/50 rounded-xl border border-success/20">
                                        <div>
                                          <p className="text-sm font-medium text-gray-600 mb-1">מחיר התחלתי</p>
                                          <div className="text-2xl font-black text-success">
                                            {category !== 'electricity' ? `₪${minPrice}/חודש` : `${Math.max(...companyPlans.map(p => parseInt(p.speed.replace('%', '')) || 0))}% הנחה`}
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-lg font-black text-primary">
                                            {Math.floor(Math.random() * 30) + 70}%
                                          </div>
                                          <div className="text-xs text-gray-600">פופולריות</div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-success" />
                                        <span>מסלולים מומלצים במיוחד</span>
                                      </div>
                                      
                                      <Button 
                                        className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedCompany(company);
                                        }}
                                      >
                                        צפה במסלולים
                                        <Sparkles className="w-4 h-4 mr-2" />
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