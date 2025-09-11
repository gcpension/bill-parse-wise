import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Smartphone, Wifi, Tv, Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { SavingsComparisonHeader } from "@/components/SavingsComparisonHeader";
import AdvancedPlanFilters, { FilterOptions } from "@/components/plans/AdvancedPlanFilters";
import PlanComparison from "@/components/plans/PlanComparison";
import EnhancedPlanCard from "@/components/plans/EnhancedPlanCard";
import PlanRecommendations from "@/components/plans/PlanRecommendations";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";

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
  // Set initial category based on analyzed categories
  const getInitialCategory = () => {
    if (initialSelectedCategories.length === 1) {
      const cat = initialSelectedCategories[0];
      if (cat === 'cellular') return 'mobile';
      if (cat === 'electricity' || cat === 'internet' || cat === 'tv') return cat as 'electricity' | 'internet' | 'tv';
    }
    if (initialSelectedCategories.length > 1) {
      // If multiple categories selected, show all plans
      return 'all' as const;
    }
    // Default to all plans if no specific category
    return 'all' as const;
  };
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'electricity' | 'internet' | 'mobile' | 'tv'>(getInitialCategory());
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
      // If user explicitly chose "all" or no categories were initially selected, show everything
      if (showAllCategories || initialSelectedCategories.length === 0) {
        // Show all plans from all categories
        filtered = manualPlans;
      } else {
        // Show only plans from initially selected categories (default behavior)
        const categoryMapping = { 'cellular': 'mobile' };
        const mappedCategories = initialSelectedCategories.map(cat => 
          categoryMapping[cat as keyof typeof categoryMapping] || cat
        );
        filtered = filtered.filter(plan => mappedCategories.includes(plan.category));
      }
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
  }, [selectedCategory, initialSelectedCategories, filters]);

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
    if (initialSelectedCategories.length === 1) {
      return {
        category: initialSelectedCategories[0] === 'cellular' ? 'mobile' : initialSelectedCategories[0],
        budget: 200, // Could be derived from analysis
        usage: 'medium' as const
      };
    }
    return undefined;
  }, [initialSelectedCategories]);

  // Use the filtered plans
  const filteredPlans = filteredAndSortedPlans;

  const categoryLabels = {
    all: 'כל הקטגוריות',
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
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4 py-12">
          {/* Savings Comparison Header - Only show if we have savings data */}
          {savingsData.length > 0 && (
            <SavingsComparisonHeader categorySavings={savingsData} />
          )}

          {/* Header */}
          <header className="text-center mb-8">
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-3">
                {savingsData.length > 0 ? 'המסלולים המומלצים עבורך' : 'כל המסלולים'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {savingsData.length > 0 
                  ? 'בחר את המסלולים שיחסכו לך הכי הרבה כסף מהרשימה המותאמת אישית'
                  : `בחר את המסלול המתאים לך מבין ${manualPlans.length} המסלולים הזמינים`
                }
              </p>
            </div>
          </header>

          {/* Smart Recommendations */}
          {filteredPlans.length > 0 && (
            <div className="mb-8">
              <PlanRecommendations
                plans={filteredPlans}
                userProfile={userProfile}
                onPlanSelect={handlePlanSelect}
              />
            </div>
          )}

          {/* Advanced Filters */}
          <div className="mb-8">
            <AdvancedPlanFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableProviders={availableProviders}
              availableFeatures={availableFeatures}
            />
          </div>

          {/* Quick Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory('all');
                setShowAllCategories(true); // User explicitly wants to see all categories
              }}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
            >
              <span>כל המסלולים ({manualPlans.length})</span>
            </Button>
            {initialSelectedCategories.length > 0 && (
              <Button
                variant={selectedCategory === 'all' && !showAllCategories ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedCategory('all');
                  setShowAllCategories(false); // Show only initially selected categories
                }}
                className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
              >
                <span>הקטגוריות שנבחרו ({initialSelectedCategories.length})</span>
              </Button>
            )}
            <Button
              variant={selectedCategory === 'electricity' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory('electricity');
                setShowAllCategories(false);
              }}
              className={`backdrop-blur-sm transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === 'electricity' 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400 hover:from-yellow-500 hover:to-yellow-600' 
                  : 'bg-yellow-50/70 border-yellow-200 hover:border-yellow-400 text-yellow-700 hover:bg-yellow-100/70'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>חשמל ({counts.electricity})</span>
            </Button>
            <Button
              variant={selectedCategory === 'internet' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory('internet');
                setShowAllCategories(false);
              }}
              className={`backdrop-blur-sm transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === 'internet' 
                  ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-white border-cyan-400 hover:from-cyan-500 hover:to-cyan-600' 
                  : 'bg-cyan-50/70 border-cyan-200 hover:border-cyan-400 text-cyan-700 hover:bg-cyan-100/70'
              }`}
            >
              <Wifi className="h-4 w-4" />
              <span>אינטרנט ({counts.internet})</span>
            </Button>
            <Button
              variant={selectedCategory === 'mobile' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory('mobile');
                setShowAllCategories(false);
              }}
              className={`backdrop-blur-sm transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === 'mobile' 
                  ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border-purple-400 hover:from-purple-500 hover:to-purple-600' 
                  : 'bg-purple-50/70 border-purple-200 hover:border-purple-400 text-purple-700 hover:bg-purple-100/70'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>סלולר ({counts.mobile})</span>
            </Button>
            <Button
              variant={selectedCategory === 'tv' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory('tv');
                setShowAllCategories(false);
              }}
              className={`backdrop-blur-sm transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === 'tv' 
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-orange-400 hover:from-orange-500 hover:to-orange-600' 
                  : 'bg-orange-50/70 border-orange-200 hover:border-orange-400 text-orange-700 hover:bg-orange-100/70'
              }`}
            >
              <Tv className="h-4 w-4" />
              <span>טלוויזיה ({counts.tv})</span>
            </Button>
          </div>

          {/* Category Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {categoryLabels[selectedCategory]} ({filteredPlans.length})
            </h2>
          </div>

          {/* Plans Grid - Group by category when showing multiple categories */}
          {(selectedCategory === 'all' && showAllCategories) || (selectedCategory === 'all' && initialSelectedCategories.length > 1) ? (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Group plans by category */}
              {['electricity', 'internet', 'mobile', 'tv'].map(category => {
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
                          {categoryInfo.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {categoryPlans.length} מסלולים זמינים
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
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