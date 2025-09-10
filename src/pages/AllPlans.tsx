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
  }, [selectedCategory]);

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

    // Base category filtering (preserve existing logic)
    if (selectedCategory === 'all') {
      if (initialSelectedCategories.length > 0) {
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
              onClick={() => setSelectedCategory('all')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
            >
              <span>הכל ({manualPlans.length})</span>
            </Button>
            <Button
              variant={selectedCategory === 'electricity' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('electricity')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>חשמל ({counts.electricity})</span>
            </Button>
            <Button
              variant={selectedCategory === 'internet' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('internet')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <Wifi className="h-4 w-4" />
              <span>אינטרנט ({counts.internet})</span>
            </Button>
            <Button
              variant={selectedCategory === 'mobile' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('mobile')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              <span>סלולר ({counts.mobile})</span>
            </Button>
            <Button
              variant={selectedCategory === 'tv' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('tv')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
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

          {/* Plans Grid */}
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