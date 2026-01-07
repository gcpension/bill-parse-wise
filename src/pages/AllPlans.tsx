import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv,
  ArrowLeft,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Star,
  TrendingDown,
  Grid3x3,
  List,
  Sparkles,
  TrendingUp,
  Award,
  ChevronDown,
  X,
  Info,
  Rocket,
  LayoutGrid,
  Layers,
  Package,
  Heart,
  Scale,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAllPlans, PlanRecord } from "@/hooks/useAllPlans";
import { PersonalizedWizardFloat } from "@/components/PersonalizedWizardFloat";
import ModernSwitchForm from "@/components/forms/ModernSwitchForm";
import Plan3DCarousel from "@/components/plans/Plan3DCarousel";
import { PlanRecordDetailsSheet } from "@/components/plans/PlanRecordDetailsSheet";
import SmartSearchBar from "@/components/plans/SmartSearchBar";
import PlanCardSkeleton from "@/components/plans/PlanCardSkeleton";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { usePlanPreferences } from "@/hooks/usePlanPreferences";
import { FeatureFilters, filterPlansByFeatures } from "@/components/plans/FeatureFilters";
import { QuickCompare } from "@/components/plans/QuickCompare";
import { calculateValueScore, getDealQualityColor, getDealQualityLabel } from "@/lib/planValueCalculator";
import { motion } from "framer-motion";

// Company logos mapping
const companyLogos: Record<string, string> = {
  'פרטנר': '/src/assets/logos/partner-logo.png',
  'סלקום': '/src/assets/logos/cellcom-logo.svg',
  'פלאפון': '/src/assets/logos/pelephone-logo.png',
  '019': '/src/assets/logos/019-logo.png',
  'רמי לוי': '/src/assets/logos/rami-levy-logo.png',
  'HOT': '/src/assets/logos/hot-logo.svg',
  'yes': '/src/assets/logos/yes-logo.png',
  'בזק': '/src/assets/logos/bezeq-logo.png',
  'אלקטרה': '/src/assets/logos/electra-logo.png',
};

type CategoryType = 'חשמל' | 'אינטרנט' | 'סלולר' | 'טלוויזיה' | 'טריפל' | 'all';
type SortType = 'price-asc' | 'price-desc' | 'name' | 'value';
type ViewMode = 'carousel' | 'grid' | 'list';

const AllPlans = () => {
  const navigate = useNavigate();
  const allPlans = useAllPlans();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('value');
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [showTopPlan, setShowTopPlan] = useState(false);
  const [selectedPlanForForm, setSelectedPlanForForm] = useState<PlanRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<PlanRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Plan preferences (favorites, compare, viewed)
  const {
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
    toggleCompare,
    isInCompare,
    getCompareCount,
    clearCompare,
    compareList,
    markAsViewed,
    wasViewed,
  } = usePlanPreferences();

  // Load stored analysis data
  useEffect(() => {
    setIsLoading(true);
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const firstCategory = parsedData[0];
          setCurrentMonthlyBill(parseFloat(firstCategory.amount) || 0);
          
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'סלולר',
            'electricity': 'חשמל',
            'internet': 'אינטרנט',
            'tv': 'טלוויזיה',
            'triple': 'טריפל'
          };
          setSelectedCategory(categoryMapping[firstCategory.category] || 'all');
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Show/hide floating CTA based on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowTopPlan(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categories configuration
  const categories = [
    { id: 'all' as CategoryType, label: 'כל המסלולים', icon: Filter },
    { id: 'טריפל' as CategoryType, label: 'טריפל', icon: Package, highlight: true },
    { id: 'סלולר' as CategoryType, label: 'סלולר', icon: Smartphone },
    { id: 'אינטרנט' as CategoryType, label: 'אינטרנט', icon: Wifi },
    { id: 'טלוויזיה' as CategoryType, label: 'טלוויזיה', icon: Tv },
    { id: 'חשמל' as CategoryType, label: 'חשמל', icon: Zap },
  ];

  // Filter, sort and categorize plans
  const filteredPlans = useMemo(() => {
    let filtered = allPlans;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plan => {
        const service = plan.service;
        if (selectedCategory === 'סלולר') {
          return service === 'סלולר';
        } else if (selectedCategory === 'אינטרנט') {
          return service.includes('אינטרנט') && !service.includes('טריפל');
        } else if (selectedCategory === 'טלוויזיה') {
          return service.includes('טלוויזיה') && !service.includes('טריפל');
        } else if (selectedCategory === 'חשמל') {
          return service === 'חשמל';
        } else if (selectedCategory === 'טריפל') {
          return service.includes('טריפל');
        }
        return false;
      });
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter(plan => 
        plan.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.plan.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by features
    filtered = filterPlansByFeatures(filtered, selectedFeatures);

    // Filter out plans without price
    filtered = filtered.filter(p => p.monthlyPrice && p.monthlyPrice > 0);

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.monthlyPrice || 0) - (b.monthlyPrice || 0);
        case 'price-desc':
          return (b.monthlyPrice || 0) - (a.monthlyPrice || 0);
        case 'name':
          return a.company.localeCompare(b.company, 'he');
        case 'value':
          const scoreA = calculateValueScore(a, allPlans).total;
          const scoreB = calculateValueScore(b, allPlans).total;
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

    return sorted;
  }, [allPlans, selectedCategory, searchQuery, sortBy, selectedFeatures]);

  // Group plans by company
  const plansByCompany = useMemo(() => {
    const grouped = new Map<string, PlanRecord[]>();
    filteredPlans.forEach(plan => {
      const existing = grouped.get(plan.company) || [];
      grouped.set(plan.company, [...existing, plan]);
    });
    return grouped;
  }, [filteredPlans]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredPlans.length === 0) return null;
    
    const prices = filteredPlans.map(p => p.monthlyPrice || 0);
    const minPrice = Math.min(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const maxSavings = currentMonthlyBill > 0 ? currentMonthlyBill - minPrice : 0;
    const recommendedCount = filteredPlans.filter(p => 
      currentMonthlyBill > 0 && p.monthlyPrice! < currentMonthlyBill
    ).length;
    
    return { minPrice, avgPrice, maxSavings, recommendedCount };
  }, [filteredPlans, currentMonthlyBill]);

  // Get compare plans
  const comparePlans = useMemo(() => {
    return allPlans.filter(plan => 
      isInCompare(plan.company, plan.plan)
    );
  }, [allPlans, compareList, isInCompare]);

  // Handlers
  const handleSelectPlan = useCallback((plan: PlanRecord) => {
    const features: string[] = [];
    if (plan.transferBenefits) features.push(plan.transferBenefits);
    if (plan.commitment) features.push(`התחייבות: ${plan.commitment}`);
    if (plan.sla) features.push(`ציון שירות: ${plan.sla}`);
    
    const planData = {
      planName: plan.plan,
      company: plan.company,
      price: plan.monthlyPrice,
      category: plan.service,
      features: features,
      switchType: 'switch'
    };
    localStorage.setItem('selectedPlanForSwitch', JSON.stringify(planData));
    
    setSelectedPlanForForm(plan);
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setSelectedPlanForForm(null);
    localStorage.removeItem('selectedPlanForSwitch');
  }, []);

  const handleViewDetails = useCallback((plan: PlanRecord) => {
    markAsViewed(plan.company, plan.plan);
    setSelectedPlanForDetails(plan);
    setIsDetailsOpen(true);
  }, [markAsViewed]);

  const handleDetailsClose = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedPlanForDetails(null);
  }, []);

  const handleFeatureToggle = useCallback((feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  }, []);

  const handleRemoveFromCompare = useCallback((company: string, plan: string) => {
    toggleCompare(company, plan);
  }, [toggleCompare]);

  const getCategoryColor = (category: CategoryType) => {
    switch (category) {
      case 'חשמל': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'אינטרנט': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'סלולר': return 'text-green-600 bg-green-50 border-green-200';
      case 'טלוויזיה': return 'text-red-600 bg-red-50 border-red-200';
      case 'טריפל': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get feature chips for a plan
  const getFeatureChips = (plan: PlanRecord): string[] => {
    const chips: string[] = [];
    const planText = `${plan.plan} ${plan.commitment || ''}`.toLowerCase();
    
    if (planText.includes('5g')) chips.push('5G');
    if (planText.includes('ללא הגבלה') || planText.includes('אינסופי')) chips.push('ללא הגבלה');
    if (planText.includes('סיבים') || planText.includes('fiber')) chips.push('סיבים');
    if (planText.includes('ללא התחייבות') || planText.includes('בלי התחייבות')) chips.push('ללא התחייבות');
    
    return chips.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 font-heebo antialiased">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl py-3 md:py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-2 md:mb-3 text-slate-500 hover:text-slate-800 transition-colors -mr-2 md:-mr-3 text-sm touch-manipulation"
          >
            <ArrowLeft className="ml-1 md:ml-2 h-4 w-4" />
            <span>חזרה</span>
          </Button>
          
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">
                  בחרו את המסלול המושלם
                </h1>
                {currentMonthlyBill > 0 && stats && (
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <span className="text-slate-500">
                      התשלום: <span className="font-medium text-slate-700">₪{currentMonthlyBill}/חודש</span>
                    </span>
                    {stats.maxSavings > 0 && (
                      <Badge className="bg-emerald-500 text-white font-medium border-0 shadow-sm px-2 md:px-3 text-xs">
                        <TrendingDown className="ml-1 h-3 w-3 md:h-3.5 md:w-3.5" />
                        חסכו ₪{stats.maxSavings.toFixed(0)}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Favorites counter */}
              {getFavoriteCount() > 0 && (
                <Badge variant="outline" className="gap-1 border-red-200 text-red-600">
                  <Heart className="h-3 w-3 fill-current" />
                  {getFavoriteCount()} מועדפים
                </Badge>
              )}
            </div>
            
            {/* View mode + count */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="bg-slate-100 rounded-lg p-1 flex overflow-x-auto">
                <button
                  onClick={() => setViewMode('carousel')}
                  className={cn(
                    "px-2.5 md:px-3 py-2 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap flex-1 justify-center touch-manipulation",
                    viewMode === 'carousel' 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">קרוסלה</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "px-2.5 md:px-3 py-2 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap flex-1 justify-center touch-manipulation",
                    viewMode === 'grid' 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Grid3x3 className="h-4 w-4" />
                  <span className="hidden sm:inline">כרטיסים</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "px-2.5 md:px-3 py-2 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap flex-1 justify-center touch-manipulation",
                    viewMode === 'list' 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">רשימה</span>
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 rounded-lg text-xs md:text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{filteredPlans.length}</span>
                <span>מסלולים</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 max-w-7xl py-4 md:py-6">
        {/* Trusted Partners Section */}
        <div className="mb-4 md:mb-6 hidden sm:block">
          <p className="text-center text-xs text-slate-400 mb-3">שותפים מובילים</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 py-2 md:py-3">
            {Object.entries(companyLogos).map(([company, logo]) => (
              <div 
                key={company} 
                className="grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <img 
                  src={logo} 
                  alt={company}
                  className="h-5 md:h-7 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Savings Summary Banner */}
        {!isLoading && stats && stats.recommendedCount > 0 && (
          <div className="mb-4 md:mb-6 animate-fade-in">
            <div className="relative bg-gradient-to-l from-emerald-50 via-white to-teal-50 border border-emerald-100 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent"></div>
              <div className="relative flex flex-col items-center justify-between p-4 md:p-6 gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-5 w-full">
                  <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <TrendingDown className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-0.5">
                      חסכו עד <span className="text-emerald-600">₪{(stats.maxSavings * 12).toLocaleString()}</span> בשנה
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500">
                      {stats.recommendedCount} מסלולים זולים יותר
                    </p>
                  </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-4 text-sm w-full justify-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-emerald-100">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-600">חיסכון חודשי: <span className="font-semibold text-emerald-600">₪{stats.maxSavings.toFixed(0)}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
          {/* Category Pills */}
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-3 px-3 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              const isHighlight = 'highlight' in category && category.highlight;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-3 md:px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm border whitespace-nowrap flex-shrink-0 touch-manipulation",
                    isActive
                      ? isHighlight 
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-md shadow-purple-200"
                        : "bg-slate-900 text-white border-slate-900 shadow-md"
                      : isHighlight
                        ? "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 hover:border-purple-400"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
                  )}
                >
                  <Icon className={cn(
                    "w-3.5 h-3.5 md:w-4 md:h-4", 
                    isActive ? "text-white" : isHighlight ? "text-purple-500" : "text-slate-400"
                  )} />
                  {category.label}
                  {isHighlight && !isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-200 text-purple-700 rounded-full font-semibold">חדש</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feature Filters */}
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-500 mb-2">סינון לפי תכונות:</p>
            <FeatureFilters
              selectedFeatures={selectedFeatures}
              onFeatureToggle={handleFeatureToggle}
              onClearAll={() => setSelectedFeatures([])}
              category={selectedCategory === 'all' ? 'all' : selectedCategory}
            />
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col gap-2 md:gap-3">
            <SmartSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="חיפוש מסלול או חברה..."
              suggestions={Array.from(new Set(allPlans.map(p => p.company)))}
            />
            
            <div className="relative">
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="w-full h-10 md:h-11 pr-10 pl-4 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent appearance-none cursor-pointer touch-manipulation"
              >
                <option value="value">ציון ערך (מומלץ)</option>
                <option value="price-asc">מחיר: נמוך לגבוה</option>
                <option value="price-desc">מחיר: גבוה לנמוך</option>
                <option value="name">שם החברה</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Plans Display */}
        {isLoading ? (
          <PlanCardSkeleton viewMode={viewMode} count={6} />
        ) : filteredPlans.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">לא נמצאו מסלולים</h3>
              <p className="text-gray-600">נסה לשנות את הסינון או החיפוש</p>
              <div className="flex gap-2 justify-center mt-4">
                {searchQuery && (
                  <Button onClick={() => setSearchQuery('')} variant="outline">
                    נקה חיפוש
                  </Button>
                )}
                {selectedFeatures.length > 0 && (
                  <Button onClick={() => setSelectedFeatures([])} variant="outline">
                    נקה סינון תכונות
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'carousel' ? (
          <div className="animate-fade-in">
            <Plan3DCarousel
              plans={filteredPlans}
              currentMonthlyBill={currentMonthlyBill}
              onSelectPlan={handleSelectPlan}
              onViewDetails={handleViewDetails}
              companyLogos={companyLogos}
            />
          </div>
        ) : viewMode === 'grid' ? (
          // Enhanced Grid View with Value Score
          <div className="space-y-10 animate-fade-in">
            {Array.from(plansByCompany.entries()).map(([company, plans], companyIndex) => {
              const logo = companyLogos[company];
              const recommendedInCompany = plans.filter(p => 
                currentMonthlyBill > 0 && p.monthlyPrice! < currentMonthlyBill
              ).length;
              
              return (
                <div 
                  key={company} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${companyIndex * 80}ms` }}
                >
                  {/* Company Header */}
                  <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-100">
                    {logo && (
                      <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center p-2.5 border border-slate-100">
                        <img src={logo} alt={company} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-slate-800">{company}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-slate-500">{plans.length} מסלולים</span>
                        {recommendedInCompany > 0 && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs font-medium border-0">
                            <CheckCircle2 className="ml-1 h-3 w-3" />
                            {recommendedInCompany} זולים יותר
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Plans Grid with Enhanced Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {plans.map((plan, index) => {
                      const valueScore = calculateValueScore(plan, allPlans);
                      const savings = currentMonthlyBill > 0 && plan.monthlyPrice! < currentMonthlyBill 
                        ? currentMonthlyBill - plan.monthlyPrice! 
                        : 0;
                      const isRecommended = savings > 0;
                      const isBestValue = index === 0;
                      const planIsFavorite = isFavorite(plan.company, plan.plan);
                      const planIsInCompare = isInCompare(plan.company, plan.plan);
                      const planWasViewed = wasViewed(plan.company, plan.plan);
                      const featureChips = getFeatureChips(plan);
                      
                      return (
                        <motion.div
                          key={`${plan.company}-${plan.plan}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                        >
                          <Card 
                            className={cn(
                              "group relative overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col",
                              isRecommended 
                                ? "border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white shadow-emerald-100" 
                                : "border border-slate-200 bg-white hover:border-slate-300",
                              planIsInCompare && "ring-2 ring-primary",
                              planWasViewed && "border-l-4 border-l-blue-300"
                            )}
                          >
                            {/* Top Badges */}
                            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                              {valueScore.dealQuality === 'excellent' && (
                                <Badge className="bg-green-500 text-white font-semibold shadow-md px-2.5 py-1 animate-pulse">
                                  🔥 עסקה מעולה
                                </Badge>
                              )}
                              {isRecommended && valueScore.dealQuality !== 'excellent' && (
                                <Badge className="bg-emerald-500 text-white font-semibold shadow-md px-2.5 py-1">
                                  <Star className="w-3 h-3 ml-1 fill-white" />
                                  מומלץ
                                </Badge>
                              )}
                              {isBestValue && !isRecommended && (
                                <Badge className="bg-amber-500 text-white font-semibold shadow-md px-2.5 py-1">
                                  <Award className="w-3 h-3 ml-1" />
                                  הזול ביותר
                                </Badge>
                              )}
                            </div>

                            {/* Favorite Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(plan.company, plan.plan); }}
                              className={cn(
                                "absolute top-3 left-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-transform z-10",
                                planIsFavorite && "text-red-500 bg-red-50"
                              )}
                            >
                              <Heart className={cn("h-4 w-4", planIsFavorite && "fill-current")} />
                            </Button>

                            <CardContent className="p-5 pt-12 flex-1 flex flex-col">
                              {/* Company Name */}
                              <div className="flex items-center gap-2 mb-2">
                                {companyLogos[plan.company] && (
                                  <img 
                                    src={companyLogos[plan.company]} 
                                    alt={plan.company} 
                                    className="w-6 h-6 object-contain"
                                  />
                                )}
                                <span className="text-sm font-bold text-primary">{plan.company}</span>
                                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                                  {plan.service}
                                </span>
                              </div>

                              {/* Plan Name */}
                              <h3 className="text-base font-semibold text-slate-800 mb-2 line-clamp-2 min-h-[48px] leading-relaxed">
                                {plan.plan}
                              </h3>

                              {/* Feature Chips */}
                              {featureChips.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {featureChips.map(chip => (
                                    <Badge key={chip} variant="secondary" className="text-xs">
                                      {chip}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Benefits Tag */}
                              {plan.transferBenefits && (
                                <div className="mb-3">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 border border-violet-100 rounded-lg text-xs text-violet-700">
                                    <span>🎁</span>
                                    <span className="font-medium line-clamp-1">{plan.transferBenefits}</span>
                                  </div>
                                </div>
                              )}

                              {/* Price Section */}
                              <div className="py-4 border-t border-slate-100 mt-auto">
                                <div className="flex items-baseline justify-between">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-slate-900 tracking-tight">
                                      {plan.monthlyPrice}
                                    </span>
                                    <span className="text-lg text-slate-400 font-medium">₪</span>
                                    <span className="text-sm text-slate-400">/חודש</span>
                                  </div>
                                  <Badge className={getDealQualityColor(valueScore.dealQuality)}>
                                    {getDealQualityLabel(valueScore.dealQuality)}
                                  </Badge>
                                </div>

                                {/* Value Score */}
                                <div className="mt-3 space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">ציון ערך</span>
                                    <span className="font-medium">{valueScore.total}/100</span>
                                  </div>
                                  <Progress value={valueScore.total} className="h-2" />
                                </div>

                                {/* Price comparison */}
                                {valueScore.percentFromAverage !== 0 && (
                                  <div className={`mt-2 text-sm flex items-center gap-1 ${
                                    valueScore.percentFromAverage > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    <TrendingDown className={`h-4 w-4 ${valueScore.percentFromAverage < 0 ? 'rotate-180' : ''}`} />
                                    {Math.abs(valueScore.percentFromAverage)}% {valueScore.percentFromAverage > 0 ? 'זול' : 'יקר'} מהממוצע
                                  </div>
                                )}
                                
                                {isRecommended && (
                                  <div className="mt-3 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div className="flex items-center justify-center gap-1.5 text-sm">
                                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                                      <span className="font-semibold text-emerald-700">
                                        חסכו ₪{savings.toFixed(0)}/חודש
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Why Choose Section */}
                              {valueScore.whyChoose.length > 0 && (
                                <div className="p-3 bg-muted/50 rounded-lg mb-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-2">💡 למה לבחור?</p>
                                  <ul className="space-y-1">
                                    {valueScore.whyChoose.slice(0, 2).map((reason, i) => (
                                      <li key={i} className="text-sm flex items-start gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-green-600 flex-shrink-0" />
                                        <span>{reason}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="space-y-2 mt-auto">
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); toggleCompare(plan.company, plan.plan); }}
                                    className={cn("h-10 w-10", planIsInCompare && "text-primary bg-primary/10")}
                                    title={planIsInCompare ? "הסר מההשוואה" : "הוסף להשוואה"}
                                  >
                                    <Scale className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleViewDetails(plan)}
                                    className="flex-1 h-10 font-medium text-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100"
                                  >
                                    <Eye className="ml-1 h-4 w-4" />
                                    פרטים
                                  </Button>
                                </div>
                                
                                <Button
                                  onClick={() => handleSelectPlan(plan)}
                                  className={cn(
                                    "w-full h-11 font-bold text-sm transition-all duration-300 shadow-sm",
                                    isRecommended 
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white" 
                                      : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white"
                                  )}
                                >
                                  <Rocket className="ml-2 h-5 w-5" />
                                  {isRecommended ? 'בחרו וחסכו!' : 'בחרו מסלול'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Enhanced List View
          <div className="space-y-4 animate-fade-in">
            {filteredPlans.map((plan, index) => {
              const valueScore = calculateValueScore(plan, allPlans);
              const savings = currentMonthlyBill > 0 && plan.monthlyPrice! < currentMonthlyBill 
                ? currentMonthlyBill - plan.monthlyPrice! 
                : 0;
              const isRecommended = savings > 0;
              const planIsFavorite = isFavorite(plan.company, plan.plan);
              const planIsInCompare = isInCompare(plan.company, plan.plan);
              const planWasViewed = wasViewed(plan.company, plan.plan);
              const featureChips = getFeatureChips(plan);
              
              return (
                <motion.div
                  key={`${plan.company}-${plan.plan}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className={cn(
                    "p-4 hover:shadow-md transition-shadow",
                    planWasViewed && "border-l-4 border-l-blue-300",
                    planIsInCompare && "ring-2 ring-primary",
                    isRecommended && "bg-emerald-50/50 border-emerald-200"
                  )}>
                    <div className="flex items-center gap-4">
                      {/* Company Logo & Plan */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {companyLogos[plan.company] && (
                            <img 
                              src={companyLogos[plan.company]} 
                              alt={plan.company} 
                              className="w-6 h-6 object-contain"
                            />
                          )}
                          <span className="font-bold text-lg">{plan.company}</span>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                            {plan.service}
                          </span>
                          {valueScore.dealQuality === 'excellent' && (
                            <Badge className="bg-green-100 text-green-700 text-xs">🔥 עסקה מעולה</Badge>
                          )}
                          {isRecommended && valueScore.dealQuality !== 'excellent' && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">מומלץ</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{plan.plan}</p>
                        
                        {/* Feature chips */}
                        <div className="flex gap-1 mt-2">
                          {featureChips.map(chip => (
                            <Badge key={chip} variant="outline" className="text-xs">{chip}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Value Score */}
                      <div className="hidden md:flex flex-col items-center px-4">
                        <span className="text-xs text-muted-foreground">ציון ערך</span>
                        <span className="text-lg font-bold">{valueScore.total}</span>
                        <Badge className={cn("text-xs", getDealQualityColor(valueScore.dealQuality))}>
                          {getDealQualityLabel(valueScore.dealQuality)}
                        </Badge>
                      </div>

                      {/* Price */}
                      <div className="text-center">
                        <div className="text-2xl font-bold">₪{plan.monthlyPrice}</div>
                        <div className="text-xs text-muted-foreground">/חודש</div>
                        {isRecommended && (
                          <div className="text-xs font-semibold text-green-600 mt-1">
                            חוסך ₪{savings.toFixed(0)}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(plan.company, plan.plan); }}
                          className={cn("h-9 w-9", planIsFavorite && "text-red-500")}
                        >
                          <Heart className={cn("h-4 w-4", planIsFavorite && "fill-current")} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); toggleCompare(plan.company, plan.plan); }}
                          className={cn("h-9 w-9", planIsInCompare && "text-primary")}
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(plan)}
                          className="hidden sm:flex"
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          פרטים
                        </Button>
                        <Button size="sm" onClick={() => handleSelectPlan(plan)}>
                          בחר
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Compare Floating Button */}
      <QuickCompare
        comparePlans={comparePlans}
        allPlans={allPlans}
        onRemove={handleRemoveFromCompare}
        onClearAll={clearCompare}
        onSelectPlan={handleSelectPlan}
      />
      
      {/* Modern Switch Form */}
      {selectedPlanForForm && (
        <ModernSwitchForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          selectedPlan={{
            company: selectedPlanForForm.company,
            plan: selectedPlanForForm.plan,
            monthlyPrice: selectedPlanForForm.monthlyPrice || 0,
            service: selectedPlanForForm.service,
            features: [
              selectedPlanForForm.transferBenefits,
              selectedPlanForForm.commitment ? `התחייבות: ${selectedPlanForForm.commitment}` : null,
              selectedPlanForForm.sla ? `ציון שירות: ${selectedPlanForForm.sla}` : null
            ].filter(Boolean) as string[]
          }}
          currentBill={currentMonthlyBill}
        />
      )}

      {/* Plan Details Sheet */}
      <PlanRecordDetailsSheet
        plan={selectedPlanForDetails}
        isOpen={isDetailsOpen}
        onClose={handleDetailsClose}
        onSelectForSwitch={(plan) => {
          handleDetailsClose();
          handleSelectPlan(plan);
        }}
        currentMonthlyBill={currentMonthlyBill}
      />

      {/* Personalized Wizard Float */}
      <PersonalizedWizardFloat />
    </div>
  );
};

export default AllPlans;
