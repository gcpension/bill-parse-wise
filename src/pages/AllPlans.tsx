import { useEffect, useState, useMemo } from "react";
import electricityLogo from "@/assets/logos/electricity-logo.png";
import electraLogo from "@/assets/logos/electra-logo.png";
import bezeqLogo from "@/assets/logos/bezeq-logo.png";
import hotLogo from "@/assets/logos/hot-logo.svg";
import cellcomLogo from "@/assets/logos/cellcom-logo.svg";
import partnerLogo from "@/assets/logos/partner-logo.png";
import pelephoneLogo from "@/assets/logos/pelephone-logo.png";
import logo019 from "@/assets/logos/019-logo.png";
import ramiLevyLogo from "@/assets/logos/rami-levy-logo.png";
import yesLogo from "@/assets/logos/yes-logo.png";
import netflixLogo from "@/assets/logos/netflix-logo.svg";
import disneyLogo from "@/assets/logos/disney-logo.png";
import hboLogo from "@/assets/logos/hbo-logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Zap, Smartphone, Wifi, Tv, ArrowLeft, Building2, Crown, Award, CheckCircle, TrendingUp, Sparkles, Star, BarChart3, Filter, Search, Calculator, Brain, Target, Eye, X, Plus, Minus, Settings2, RefreshCw, User } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
import DetailedAIComparison from "@/components/plans/DetailedAIComparison";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RecommendationContext } from "@/lib/recommendationEngine";
import { cn } from "@/lib/utils";
import { SavingsComparisonBanner } from "@/components/plans/SavingsComparisonBanner";
import { useSavingsData } from "@/hooks/useSavingsData";
import { usePageMeta } from "@/hooks/usePageMeta";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { ComparisonAnalyzer } from "@/lib/comparisonAnalyzer";
import { PersonalizedRecommendationEngine, UserProfile, PersonalizedRecommendation } from "@/lib/personalizedRecommendations";
import { PersonalizedRecommendationBanner } from "@/components/PersonalizedRecommendationBanner";
import { RecommendationResults } from "@/components/plans/RecommendationResults";
import { EnhancedNavigation } from "@/components/ui/enhanced-navigation";
import { FloatingHelpButton } from "@/components/ui/floating-help-button";
import { PlanCard } from "@/components/plans/PlanCard";
import { PlanFilters } from "@/components/plans/PlanFilters";
import { ComparisonPanel } from "@/components/plans/ComparisonPanel";
import { RecommendationWizard } from "@/components/plans/RecommendationWizard";
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
type CategoryType = 'electricity' | 'internet' | 'mobile' | 'tv';
const AllPlans = ({
  savingsData = [],
  initialSelectedCategories = []
}: AllPlansProps) => {
  const {
    savingsData: persistedSavings
  } = useSavingsData();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<ManualPlan[]>([]);
  const [comparedPlans, setComparedPlans] = useState<ManualPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showPersonalizedWizard, setShowPersonalizedWizard] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [showPersonalizedResults, setShowPersonalizedResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // New state for enhanced features
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name' | 'features'>('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewedPlans, setViewedPlans] = useState<Set<string>>(new Set());
  const [currentUserPlan, setCurrentUserPlan] = useState({
    name: '',
    price: '',
    company: '',
    usage: 'medium'
  });
  const [userContext, setUserContext] = useState<RecommendationContext>({
    category: 'electricity',
    currentProvider: 'חברת החשמל',
    currentAmount: 200,
    usage: 'medium',
    budget: 200,
    priorities: ['price', 'reliability'],
    familySize: 2,
    homeType: 'apartment'
  });

  // Load stored data on mount
  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          // Set the first category as selected
          const firstCategory = parsedData[0].category;
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'mobile',
            'electricity': 'electricity',
            'internet': 'internet',
            'tv': 'tv'
          };
          setSelectedCategory(categoryMapping[firstCategory] || firstCategory as CategoryType);
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, []);

  // Set page meta
  usePageMeta({
    title: 'כל המסלולים | EasySwitch',
    description: 'מרכז המסלולים החכם - השוואה מבוססת AI, המלצות מותאמות אישית וכל המסלולים הטובים ביותר במקום אחד.'
  });
  useEffect(() => {
    document.title = "כל המסלולים | EasySwitch";
  }, []);

  // Enhanced filtering and sorting
  const {
    filteredPlans,
    groupedByCompany
  } = useMemo(() => {
    if (!selectedCategory) return {
      filteredPlans: [],
      groupedByCompany: {}
    };
    
    let filtered = manualPlans.filter(plan => {
      if (plan.category !== selectedCategory) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          plan.company.toLowerCase().includes(query) ||
          plan.planName.toLowerCase().includes(query) ||
          plan.features.some(f => f.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      // Price range filter
      if (plan.regularPrice > 0) {
        if (plan.regularPrice < priceRange[0] || plan.regularPrice > priceRange[1]) {
          return false;
        }
      }
      
      return true;
    });

    // Sort plans
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.regularPrice || 0) - (b.regularPrice || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.regularPrice || 0) - (a.regularPrice || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.planName.localeCompare(b.planName, 'he'));
        break;
      case 'features':
        filtered.sort((a, b) => b.features.length - a.features.length);
        break;
    }

    // Group by company
    const grouped = filtered.reduce((acc, plan) => {
      if (!acc[plan.company]) {
        acc[plan.company] = [];
      }
      acc[plan.company].push(plan);
      return acc;
    }, {} as Record<string, ManualPlan[]>);
    
    return {
      filteredPlans: filtered,
      groupedByCompany: grouped
    };
  }, [selectedCategory, searchQuery, sortBy, priceRange]);
  const categoryConfig = {
    electricity: {
      label: 'חשמל',
      icon: <Zap className="w-6 h-6" />,
      description: 'חברות חשמל וספקי אנרגיה'
    },
    internet: {
      label: 'אינטרנט',
      icon: <Wifi className="w-6 h-6" />,
      description: 'ספקי אינטרנט וחבילות גלישה'
    },
    mobile: {
      label: 'סלולר',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'חברות סלולר ומסלולי דקות וגלישה'
    },
    tv: {
      label: 'טלוויזיה',
      icon: <Tv className="w-6 h-6" />,
      description: 'חבילות טלוויזיה ושירותי סטרימינג'
    }
  };
  const isInComparison = (planId: string) => comparedPlans.some(p => p.id === planId);
  const canAddToComparison = comparedPlans.length < 3;
  const cheapestPlan = filteredPlans.length > 0 ? filteredPlans.reduce((min, plan) => plan.regularPrice < min.regularPrice ? plan : min) : null;
  const handleCompareToggle = (plan: ManualPlan) => {
    if (isInComparison(plan.id)) {
      setComparedPlans(prev => prev.filter(p => p.id !== plan.id));
    } else if (canAddToComparison) {
      setComparedPlans(prev => [...prev, plan]);
    }
  };
  const handlePlanSelect = (plan: ManualPlan) => {
    // Mark as viewed
    setViewedPlans(prev => new Set(prev).add(plan.id));
    
    // Store selected plan data for service request
    localStorage.setItem('selectedPlanForSwitch', JSON.stringify({
      planName: plan.planName,
      company: plan.company,
      price: plan.regularPrice,
      category: plan.category,
      features: plan.features
    }));

    // Navigate to service request page
    window.location.href = '/service-request';
  };
  
  const toggleFavorite = (planId: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planId)) {
        newSet.delete(planId);
      } else {
        newSet.add(planId);
      }
      return newSet;
    });
  };
  
  const getMaxPrice = () => {
    const prices = manualPlans
      .filter(p => p.category === selectedCategory && p.regularPrice > 0)
      .map(p => p.regularPrice);
    return prices.length > 0 ? Math.max(...prices) : 500;
  };
  const clearComparison = () => setComparedPlans([]);
  const handlePersonalizedRecommendation = async (userProfile: UserProfile, categories: CategoryType[]) => {
    setIsAnalyzing(true);
    setShowPersonalizedWizard(false);
    try {
      console.log('🔍 Starting personalized recommendations for categories:', categories);
      console.log('📦 Total plans in manualPlans:', manualPlans.length);
      console.log('📂 Unique categories in manualPlans:', [...new Set(manualPlans.map(p => p.category))]);
      
      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate recommendations for each category
      const allRecommendations: PersonalizedRecommendation[] = [];
      for (const category of categories) {
        console.log(`📊 Processing category: ${category}`);
        const categoryPlans = manualPlans.filter(p => p.category === category);
        console.log(`  - Found ${categoryPlans.length} plans for ${category}`);
        
        if (categoryPlans.length === 0) {
          console.warn(`⚠️ No plans found for category: ${category}`);
          continue;
        }
        
        const recommendations = PersonalizedRecommendationEngine.generatePersonalizedRecommendations(
          categoryPlans, 
          userProfile, 
          category as string
        );
        console.log(`  - Generated ${recommendations.length} recommendations for ${category}`);
        console.log(`  - Recommendations IDs:`, recommendations.map(r => r.planId));
        console.log(`  - Recommendations categories:`, recommendations.map(r => r.category));
        allRecommendations.push(...recommendations);
      }
      
      console.log(`✅ Total recommendations generated: ${allRecommendations.length}`);
      console.log('Recommendations by category:', 
        allRecommendations.reduce((acc, rec) => {
          acc[rec.category] = (acc[rec.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );
      
      setPersonalizedRecommendations(allRecommendations);
      setIsAnalyzing(false);
      setShowPersonalizedResults(true);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setIsAnalyzing(false);
      alert('אירעה שגיאה בעת יצירת ההמלצות. אנא נסו שוב.');
    }
  };

  // Convert saved data to banner format
  const bannerSavingsData = persistedSavings.map(saving => ({
    currentMonthly: saving.currentAmount,
    recommendedMonthly: saving.recommendedAmount,
    monthlySavings: saving.monthlySavings,
    annualSavings: saving.annualSavings,
    currentProvider: saving.currentProvider,
    recommendedProvider: saving.recommendedProvider,
    category: saving.category
  }));
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
      {/* Enhanced Navigation */}
      <EnhancedNavigation />

      <div className="container mx-auto px-4 lg:px-6 max-w-7xl py-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />
        
        {/* Enhanced Page Header */}
        


        {/* Category Selection - Enhanced Design */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 font-heebo mb-2 text-center">
            בחרו קטגוריה לצפייה במסלולים
          </h2>
          <p className="text-lg text-gray-600 font-assistant mb-8 text-center">
            לחצו על הקטגוריה המעניינת אתכם • החזיקו Ctrl ללחוץ על מספר קטגוריות
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const isSelected = selectedCategory === key;
              const isInMultiSelect = selectedCategories.includes(key as CategoryType);
              
              return (
                <Button 
                  key={key} 
                  variant={isSelected ? "default" : "outline"} 
                  className={cn(
                    "h-32 flex-col gap-3 text-lg font-heebo transition-all duration-300 group relative overflow-hidden",
                    isSelected || isInMultiSelect
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl scale-105 border-0" 
                      : "border-2 border-purple-200 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 hover:scale-105 bg-white/80 backdrop-blur-sm"
                  )} 
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      // Multi-select mode
                      if (isInMultiSelect) {
                        setSelectedCategories(prev => prev.filter(c => c !== key));
                      } else {
                        setSelectedCategories(prev => [...prev, key as CategoryType]);
                      }
                    } else {
                      // Single select mode
                      setSelectedCategory(key as CategoryType);
                      setSelectedCategories([]);
                    }
                  }}
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    isSelected || isInMultiSelect ? "from-white/10 to-white/5" : "from-purple-100/50 to-blue-100/50"
                  )}></div>
                  <div className="relative z-10">
                    {config.icon}
                    <span className="font-bold">{config.label}</span>
                    {isInMultiSelect && (
                      <CheckCircle className="w-5 h-5 absolute -top-2 -left-2 text-white" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
          
          {/* Show recommendation button when multiple categories are selected */}
          {selectedCategories.length > 0 && (
            <div className="mt-6 text-center animate-fade-in">
              <Card className="max-w-2xl mx-auto border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-right">
                      <p className="text-lg font-bold text-foreground font-heebo mb-1">
                        נבחרו {selectedCategories.length} סקטורים
                      </p>
                      <p className="text-sm text-muted-foreground font-assistant">
                        {selectedCategories.map(cat => categoryConfig[cat].label).join(', ')}
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowPersonalizedWizard(true)}
                      size="lg"
                      className="font-heebo bg-gradient-to-r from-primary to-primary/80"
                    >
                      <Brain className="w-5 h-5 ml-2" />
                      קבל המלצות מותאמות אישית
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Company Logos by Category */}
        {selectedCategory && <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-700 font-heebo mb-4 text-center">
              החברות הזמינות
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {selectedCategory === 'electricity' && <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/electra-logo.png" alt="אלקטרה" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/electricity-logo.png" alt="חברת החשמל" className="w-full h-12 object-contain" />
                  </div>
                </>}
              
              {selectedCategory === 'internet' && <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/bezeq-logo.png" alt="בזק" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/hot-logo.svg" alt="HOT" className="w-full h-12 object-contain" />
                  </div>
                </>}
              
              {selectedCategory === 'mobile' && <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/cellcom-logo.svg" alt="סלקום" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/partner-logo.png" alt="פרטנר" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/pelephone-logo.png" alt="פלאפון" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/019-logo.png" alt="019" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/rami-levy-logo.png" alt="רמי לוי" className="w-full h-12 object-contain" />
                  </div>
                </>}
              
              {selectedCategory === 'tv' && <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/yes-logo.png" alt="YES" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/hot-logo.svg" alt="HOT" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/netflix-logo.svg" alt="Netflix" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/disney-logo.png" alt="Disney" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/hbo-logo.png" alt="HBO" className="w-full h-12 object-contain" />
                  </div>
                </>}
            </div>
          </div>}

        {/* Current Spending and Savings Potential Section */}
        {selectedCategory && <div className="mb-12">
            <Card className="border-2 border-gradient-to-r from-green-200 to-blue-200 bg-gradient-to-r from-green-50/80 via-white to-blue-50/80 shadow-xl backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-heebo mb-4">
                    כמה אתם משלמים היום?
                  </h2>
                  <p className="text-lg text-gray-600 font-assistant">
                    הזינו את הפרטים הנוכחיים שלכם כדי לראות כמה תוכלו לחסוך
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {/* Current Monthly Payment */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Calculator className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 font-heebo mb-2">
                        התשלום החודשי הנוכחי
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          הספק הנוכחי
                        </Label>
                        <Input placeholder="לדוגמה: חברת החשמל, בזק..." value={currentUserPlan.company} onChange={e => setCurrentUserPlan(prev => ({
                      ...prev,
                      company: e.target.value
                    }))} className="h-12 text-base" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          סכום חודשי (₪)
                        </Label>
                        <div className="relative">
                          <Input type="number" placeholder="0" value={currentUserPlan.price} onChange={e => setCurrentUserPlan(prev => ({
                        ...prev,
                        price: e.target.value
                      }))} className="h-12 text-base pr-8 text-center font-bold text-lg" />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₪</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cheapest Alternative */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 font-heebo mb-2">
                        המסלול הזול ביותר
                      </h3>
                    </div>
                    {cheapestPlan ? <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 font-heebo">
                            ₪{cheapestPlan.regularPrice}
                          </div>
                          <div className="text-sm text-gray-600 font-assistant">
                            {cheapestPlan.company}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-sm text-green-700 font-assistant">
                            {cheapestPlan.planName}
                          </div>
                        </div>
                      </div> : <div className="text-center text-gray-500 font-assistant">
                        בחרו קטגוריה לצפייה במסלולים
                      </div>}
                  </div>

                  {/* Potential Savings */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 font-heebo mb-2">
                        החיסכון הפוטנציאלי
                      </h3>
                    </div>
                    {currentUserPlan.price && cheapestPlan && parseFloat(currentUserPlan.price) > 0 ? <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 font-heebo">
                            ₪{Math.max(0, parseFloat(currentUserPlan.price) - cheapestPlan.regularPrice)}
                          </div>
                          <div className="text-sm text-gray-600 font-assistant">
                            חיסכון חודשי
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-sm text-blue-700 font-assistant">
                            ₪{Math.max(0, (parseFloat(currentUserPlan.price) - cheapestPlan.regularPrice) * 12)} חיסכון שנתי
                          </div>
                        </div>
                        {parseFloat(currentUserPlan.price) > cheapestPlan.regularPrice && <div className="text-center">
                            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
                              חיסכון של {Math.round((parseFloat(currentUserPlan.price) - cheapestPlan.regularPrice) / parseFloat(currentUserPlan.price) * 100)}%
                            </Badge>
                          </div>}
                      </div> : <div className="text-center text-gray-500 font-assistant">
                        הזינו את התשלום הנוכחי לחישוב החיסכון
                      </div>}
                  </div>
                </div>

                {/* Action Button */}
                {currentUserPlan.price && currentUserPlan.company && cheapestPlan && parseFloat(currentUserPlan.price) > cheapestPlan.regularPrice && <div className="text-center mt-8">
                    <Button onClick={() => handlePlanSelect(cheapestPlan)} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-heebo shadow-lg hover:shadow-xl transition-all duration-300">
                      <ArrowLeft className="w-5 h-5 ml-2" />
                      עבור למסלול הזול ביותר וחסוך ₪{Math.max(0, parseFloat(currentUserPlan.price) - cheapestPlan.regularPrice)} בחודש
                    </Button>
                  </div>}
              </CardContent>
            </Card>
          </div>}


        {/* Enhanced Comparison Bar */}
        {comparedPlans.length > 0 && <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-xl animate-fade-in">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-800 font-heebo mb-1">
                      השוואת מסלולים מתקדמת
                    </h3>
                    <p className="text-blue-600 font-assistant text-lg">
                      {comparedPlans.length} מסלולים נבחרו • עד {3 - comparedPlans.length} נוספים ניתן להוסיף
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        <Brain className="w-4 h-4 ml-1" />
                        ניתוח AI
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <TrendingUp className="w-4 h-4 ml-1" />
                        חישוב חיסכון
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                        <Target className="w-4 h-4 ml-1" />
                        המלצות אישיות
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <DetailedAIComparison plans={comparedPlans} userContext={userContext} category={selectedCategory as 'electricity' | 'internet' | 'mobile' | 'tv'} />
                  <Button onClick={() => setShowComparison(!showComparison)} variant="outline" size="lg" className="font-assistant h-14 px-6">
                    <Eye className="w-5 h-5 ml-2" />
                    {showComparison ? 'הסתר טבלה' : 'הצג טבלה'}
                  </Button>
                  <Button variant="destructive" size="lg" onClick={clearComparison} className="font-assistant h-14 px-6">
                    <X className="w-5 h-5 ml-2" />
                    נקה הכל
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Comparison Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparedPlans.map((plan, index) => <Card key={plan.id} className="border-2 border-blue-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : index === 1 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary font-heebo">{plan.company}</h4>
                            <p className="text-sm text-muted-foreground font-assistant">{plan.planName}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setComparedPlans(prev => prev.filter(p => p.id !== plan.id))} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-primary font-heebo mb-1">
                          ₪{plan.regularPrice}
                        </div>
                        <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-assistant">תכונות:</span>
                          <span className="font-semibold">{plan.features?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-assistant">קטגוריה:</span>
                          <Badge variant="outline" className="text-xs">
                            {categoryConfig[plan.category as CategoryType]?.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground font-assistant">
                        {plan.features?.slice(0, 2).join(' • ')}
                        {(plan.features?.length || 0) > 2 && ` +${(plan.features?.length || 0) - 2} נוספות`}
                      </div>
                    </CardContent>
                  </Card>)}
                
                {/* Add More Plans Prompt */}
                {comparedPlans.length < 3 && <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-blue-800 font-heebo mb-2">
                        הוסיפו מסלול נוסף
                      </h4>
                      <p className="text-blue-600 font-assistant text-sm">
                        לחצו על כפתור ה + ליד המסלולים למטה כדי להוסיף עד {3 - comparedPlans.length} מסלולים נוספים
                      </p>
                    </CardContent>
                  </Card>}
              </div>
            </CardContent>
          </Card>}

        {/* Advanced Search and Filters */}
        {selectedCategory && (
          <div className="mb-8">
            <PlanFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPrice={getMaxPrice()}
              showFilters={showAdvancedFilters}
              onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
              resultsCount={filteredPlans.length}
            />
          </div>
        )}

        {/* Comparison Panel */}
        {comparedPlans.length > 0 && (
          <div className="mb-8">
            <ComparisonPanel
              plans={comparedPlans}
              onRemove={(id) => setComparedPlans(prev => prev.filter(p => p.id !== id))}
              onClear={clearComparison}
              maxPlans={3}
            />
          </div>
        )}

        {/* Detailed Comparison */}
        {showComparison && comparedPlans.length > 0 && <Card className="mb-8 border-2 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-purple-800 font-heebo">השוואה מפורטת</h3>
              </div>
            </CardHeader>
            <CardContent>
              {/* Current Plan Input */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-6">
                <h4 className="font-semibold text-yellow-800 font-heebo mb-3 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  המסלול הנוכחי שלכם
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="שם המסלול" value={currentUserPlan.name} onChange={e => setCurrentUserPlan(prev => ({
                ...prev,
                name: e.target.value
              }))} className="font-assistant" />
                  <Input placeholder="מחיר חודשי (₪)" value={currentUserPlan.price} onChange={e => setCurrentUserPlan(prev => ({
                ...prev,
                price: e.target.value
              }))} className="font-assistant" />
                  <Input placeholder="שם החברה" value={currentUserPlan.company} onChange={e => setCurrentUserPlan(prev => ({
                ...prev,
                company: e.target.value
              }))} className="font-assistant" />
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-right font-heebo font-semibold">פרט</th>
                      {currentUserPlan.name && <th className="p-4 text-center font-heebo font-semibold text-yellow-700 bg-yellow-50">
                          {currentUserPlan.name}
                          <div className="text-xs text-yellow-600">(נוכחי)</div>
                        </th>}
                      {comparedPlans.map(plan => <th key={plan.id} className="p-4 text-center font-heebo font-semibold">
                          {plan.planName}
                          <div className="text-xs text-muted-foreground">{plan.company}</div>
                        </th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-4 font-semibold font-assistant">מחיר חודשי</td>
                      {currentUserPlan.name && <td className="p-4 text-center font-bold text-yellow-700 bg-yellow-50">
                          ₪{currentUserPlan.price}
                        </td>}
                      {comparedPlans.map(plan => <td key={plan.id} className="p-4 text-center font-bold text-purple-600">
                          ₪{plan.regularPrice}
                        </td>)}
                    </tr>
                    {currentUserPlan.price && <tr className="border-t bg-green-50">
                        <td className="p-4 font-semibold font-assistant">חיסכון חודשי</td>
                        <td className="p-4 text-center text-yellow-700 bg-yellow-50">-</td>
                        {comparedPlans.map(plan => {
                    const savings = parseInt(currentUserPlan.price) - plan.regularPrice;
                    return <td key={plan.id} className={`p-4 text-center font-bold ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {savings > 0 ? `+₪${savings}` : `₪${Math.abs(savings)}-`}
                            </td>;
                  })}
                      </tr>}
                    <tr className="border-t">
                      <td className="p-4 font-semibold font-assistant">תכונות</td>
                      {currentUserPlan.name && <td className="p-4 text-center text-yellow-700 bg-yellow-50">-</td>}
                      {comparedPlans.map(plan => <td key={plan.id} className="p-4 text-center">
                          <Badge variant="outline" className="font-assistant">
                            {plan.features?.length || 0} תכונות
                          </Badge>
                        </td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>}

        {/* Plans Grid - Organized by Company */}
        {selectedCategory && Object.keys(groupedByCompany).length > 0 && <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 font-heebo">
                מסלולי {categoryConfig[selectedCategory].label}
              </h2>
              <Badge variant="secondary" className="text-lg px-4 py-2 font-assistant">
                {filteredPlans.length} מסלולים • {Object.keys(groupedByCompany).length} חברות
              </Badge>
            </div>

            {/* Company Sections */}
            <div className="space-y-12">
              {Object.entries(groupedByCompany).map(([companyName, companyPlans], companyIndex) => <div key={companyName} className="relative">
                  {/* Company Header */}
                  <div className="bg-gradient-to-r from-purple-100 via-blue-50 to-purple-100 rounded-2xl p-6 mb-6 border-2 border-purple-200/50 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-purple-800 font-heebo mb-1">
                            {companyName}
                          </h3>
                          <p className="text-purple-600 font-assistant text-lg">
                            {companyPlans.length} מסלולים זמינים • קטגוריית {categoryConfig[selectedCategory].label}
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-800 font-heebo">
                          מ-₪{Math.min(...companyPlans.map(p => p.regularPrice))}
                        </div>
                        <div className="text-purple-600 font-assistant">החל מ</div>
                      </div>
                    </div>
                  </div>

                  {/* Company Plans Grid */}
                  <div className={cn(
                    "grid gap-6",
                    viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  )}>
                    {companyPlans.map((plan) => {
                      const isCheapest = cheapestPlan && plan.id === cheapestPlan.id;
                      const isCompanyCheapest = plan.regularPrice === Math.min(...companyPlans.map(p => p.regularPrice));
                      const savingsAmount = currentUserPlan.price 
                        ? Math.max(0, parseFloat(currentUserPlan.price) - plan.regularPrice)
                        : undefined;
                      
                      return (
                        <PlanCard
                          key={plan.id}
                          plan={plan}
                          isFavorite={favoriteIds.has(plan.id)}
                          isViewed={viewedPlans.has(plan.id)}
                          isComparing={isInComparison(plan.id)}
                          isBestPrice={isCheapest || isCompanyCheapest}
                          onToggleFavorite={() => toggleFavorite(plan.id)}
                          onToggleCompare={() => handleCompareToggle(plan)}
                          onSelect={() => handlePlanSelect(plan)}
                          comparisonDisabled={!canAddToComparison && !isInComparison(plan.id)}
                          savingsAmount={savingsAmount}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Company Summary */}
                  <div className="mt-6 bg-white/50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center justify-between text-sm text-gray-600 font-assistant">
                      <span>סה"כ {companyPlans.length} מסלולים</span>
                      <span>טווח מחירים: ₪{Math.min(...companyPlans.map(p => p.regularPrice))} - ₪{Math.max(...companyPlans.map(p => p.regularPrice))}</span>
                      <span>חיסכון אפשרי: עד ₪{Math.max(...companyPlans.map(p => p.regularPrice)) - Math.min(...companyPlans.map(p => p.regularPrice))}</span>
                    </div>
                  </div>
                </div>)}
            </div>

            {filteredPlans.length === 0 && <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 font-heebo mb-2">
                  לא נמצאו מסלולים
                </h3>
                <p className="text-gray-500 font-assistant">
                  נסו לשנות את הפילטרים או את מילות החיפוש
                </p>
              </div>}
          </div>}

        {!selectedCategory && <div className="text-center py-12">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 font-heebo mb-2">
              בחרו קטגוריה להתחלה
            </h3>
            <p className="text-gray-600 font-assistant text-lg">
              בחרו את הקטגוריה המעניינת אתכם כדי לראות את כל המסלולים הזמינים
            </p>
          </div>}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800 font-heebo">
              בקשת החלפת ספק
            </DialogTitle>
          </DialogHeader>
          {selectedPlan && <EnhancedSwitchRequestForm selectedPlan={selectedPlan} isOpen={isFormOpen} onClose={() => {
          setIsFormOpen(false);
          setSelectedPlan(null);
        }} />}
        </DialogContent>
      </Dialog>

      {/* Enhanced Personalized Recommendation Banner */}
      {selectedCategory && !showPersonalizedWizard && !isAnalyzing && (
        <PersonalizedRecommendationBanner 
          onRecommendationClick={() => {
            setSelectedCategories([selectedCategory]);
            setShowPersonalizedWizard(true);
          }} 
        />
      )}

      {/* Loading Animation */}
      {isAnalyzing && <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 font-heebo mb-2">
              מנתח את הצרכים שלכם...
            </h3>
            <p className="text-gray-600 font-assistant mb-4">
              הבינה המלאכותית בוחנת את המסלולים הטובים ביותר עבורכם
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>מעבד נתונים...</span>
            </div>
          </div>
        </div>}


      {/* Personalized Recommendation Wizard */}
      {showPersonalizedWizard && <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <RecommendationWizard 
              categories={selectedCategories} 
              onComplete={handlePersonalizedRecommendation} 
              onClose={() => setShowPersonalizedWizard(false)} 
            />
          </div>
        </div>}

      {/* Personalized Recommendation Results */}
      <RecommendationResults 
        isOpen={showPersonalizedResults} 
        onClose={() => setShowPersonalizedResults(false)} 
        recommendations={personalizedRecommendations} 
        plans={manualPlans}
        onPlanSelect={handlePlanSelect} 
      />

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>;
};
export default AllPlans;