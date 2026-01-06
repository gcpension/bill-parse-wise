import { useState, useMemo, useEffect } from "react";
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
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAllPlans, PlanRecord } from "@/hooks/useAllPlans";
import { PersonalizedWizardFloat } from "@/components/PersonalizedWizardFloat";
import UnifiedServiceForm from "@/components/service-request/UnifiedServiceForm";
import Plan3DCarousel from "@/components/plans/Plan3DCarousel";
import annualSavingsSketch from "@/assets/savings-clean.png";

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

type CategoryType = 'חשמל' | 'אינטרנט' | 'סלולר' | 'טלוויזיה' | 'all';
type SortType = 'price-asc' | 'price-desc' | 'name';
type ViewMode = 'carousel' | 'grid' | 'list';

const AllPlans = () => {
  const navigate = useNavigate();
  const allPlans = useAllPlans();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('price-asc');
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [isLoading, setIsLoading] = useState(true);
  const [showTopPlan, setShowTopPlan] = useState(false);
  const [selectedPlanForForm, setSelectedPlanForForm] = useState<PlanRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
            'tv': 'טלוויזיה'
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
    { id: 'חשמל' as CategoryType, label: 'חשמל', icon: Zap },
    { id: 'אינטרנט' as CategoryType, label: 'אינטרנט', icon: Wifi },
    { id: 'סלולר' as CategoryType, label: 'סלולר', icon: Smartphone },
    { id: 'טלוויזיה' as CategoryType, label: 'טלוויזיה', icon: Tv },
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
          return service.includes('אינטרנט') || service.includes('טריפל');
        } else if (selectedCategory === 'טלוויזיה') {
          return service.includes('טלוויזיה') || service.includes('טריפל');
        } else if (selectedCategory === 'חשמל') {
          return service === 'חשמל';
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
        default:
          return 0;
      }
    });

    return sorted;
  }, [allPlans, selectedCategory, searchQuery, sortBy]);

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

  // Get top recommended plan
  const topPlan = useMemo(() => {
    if (!currentMonthlyBill || filteredPlans.length === 0) return null;
    const recommended = filteredPlans.filter(p => p.monthlyPrice! < currentMonthlyBill);
    return recommended.length > 0 ? recommended[0] : null;
  }, [filteredPlans, currentMonthlyBill]);

  const handleSelectPlan = (plan: PlanRecord) => {
    // Build features array from available plan data
    const features: string[] = [];
    if (plan.transferBenefits) features.push(plan.transferBenefits);
    if (plan.commitment) features.push(`התחייבות: ${plan.commitment}`);
    if (plan.sla) features.push(`ציון שירות: ${plan.sla}`);
    
    console.log('Selected plan:', {
      plan: plan.plan,
      company: plan.company,
      price: plan.monthlyPrice,
      service: plan.service,
      features: features
    });
    
    // Store plan data for the form
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
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPlanForForm(null);
    localStorage.removeItem('selectedPlanForSwitch');
  };

  const getCategoryColor = (category: CategoryType) => {
    switch (category) {
      case 'חשמל': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'אינטרנט': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'סלולר': return 'text-green-600 bg-green-50 border-green-200';
      case 'טלוויזיה': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 font-heebo antialiased">
      {/* Empty - Top plan CTA removed */}

      {/* Header - Clean & Modern - Mobile Optimized */}
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
            
            {/* View mode + count - Stacked on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* View Mode Toggle - Scrollable on mobile */}
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
              
              {/* Plans count - visible on all screens */}
              <div className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 rounded-lg text-xs md:text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{filteredPlans.length}</span>
                <span>מסלולים</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 max-w-7xl py-4 md:py-6">
        {/* Trusted Partners Section - Hidden on small mobile */}
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

        {/* Savings Summary Banner - Mobile optimized */}
        {!isLoading && stats && stats.recommendedCount > 0 && (
          <div className="mb-4 md:mb-6 animate-fade-in">
            <div className="relative bg-gradient-to-l from-emerald-50 via-white to-teal-50 border border-emerald-100 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent"></div>
              <div className="relative flex flex-col items-center justify-between p-4 md:p-6 gap-3 md:gap-4">
                {/* Content */}
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
                
                {/* Quick Stats - Hidden on very small screens */}
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

        {/* Filters Section - Mobile optimized */}
        <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
          {/* Category Pills - Horizontal scroll on mobile */}
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-3 px-3 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-3 md:px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm border whitespace-nowrap flex-shrink-0 touch-manipulation",
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5 md:w-4 md:h-4", isActive ? "text-white" : "text-slate-400")} />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Search and Sort - Stacked on mobile */}
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="חיפוש..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-10 md:h-11 text-sm border-slate-200 bg-white focus:border-slate-400 focus:ring-slate-400"
              />
            </div>
            
            <div className="relative">
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="w-full h-10 md:h-11 pr-10 pl-4 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent appearance-none cursor-pointer touch-manipulation"
              >
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
          // Loading Skeleton
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-4 pb-3 border-b-2 border-purple-200">
                  <Skeleton className="w-20 h-20 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => (
                    <Card key={j}>
                      <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Rubik']">לא נמצאו מסלולים</h3>
              <p className="text-gray-600 font-['Rubik']">נסה לשנות את הסינון או החיפוש</p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="mt-4 font-['Rubik']"
                >
                  נקה חיפוש
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'carousel' ? (
          // 3D Carousel View
          <div className="animate-fade-in">
            <Plan3DCarousel
              plans={filteredPlans}
              currentMonthlyBill={currentMonthlyBill}
              onSelectPlan={handleSelectPlan}
              companyLogos={companyLogos}
            />
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View - Grouped by Company
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
                      <h2 className="text-xl font-semibold text-slate-800">
                        {company}
                      </h2>
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

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {plans.map((plan, index) => {
                      const savings = currentMonthlyBill > 0 && plan.monthlyPrice! < currentMonthlyBill 
                        ? currentMonthlyBill - plan.monthlyPrice! 
                        : 0;
                      const isRecommended = savings > 0;
                      const isBestValue = index === 0;
                      
                      return (
                        <Card 
                          key={`${plan.company}-${plan.plan}-${index}`}
                          className={cn(
                            "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                            isRecommended 
                              ? "border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white shadow-emerald-100" 
                              : "border border-slate-200 bg-white hover:border-slate-300"
                          )}
                          style={{ animationDelay: `${index * 40}ms` }}
                        >
                          {/* Top Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                            {isRecommended && (
                              <Badge className="bg-emerald-500 text-white font-semibold shadow-md px-2.5 py-1">
                                <Star className="w-3 h-3 ml-1 fill-white" />
                                מומלץ
                              </Badge>
                            )}
                            {isBestValue && (
                              <Badge className="bg-amber-500 text-white font-semibold shadow-md px-2.5 py-1">
                                <Award className="w-3 h-3 ml-1" />
                                הזול ביותר
                              </Badge>
                            )}
                          </div>

                          <CardContent className="p-5 pt-12">
                            {/* Plan Name */}
                            <h3 className="text-base font-semibold text-slate-800 mb-3 line-clamp-2 min-h-[48px] leading-relaxed">
                              {plan.plan}
                            </h3>

                            {/* Benefits Tag */}
                            {plan.transferBenefits && (
                              <div className="mb-4">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 border border-violet-100 rounded-lg text-xs text-violet-700">
                                  <span>🎁</span>
                                  <span className="font-medium line-clamp-1">{plan.transferBenefits}</span>
                                </div>
                              </div>
                            )}

                            {/* Price Section */}
                            <div className="py-4 border-t border-slate-100">
                              <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                                  {plan.monthlyPrice}
                                </span>
                                <span className="text-lg text-slate-400 font-medium">₪</span>
                                <span className="text-sm text-slate-400 mr-1">/חודש</span>
                              </div>
                              
                              {isRecommended && (
                                <div className="mt-3 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                                  <div className="flex items-center justify-center gap-1.5 text-sm">
                                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-700">
                                      חסכו ₪{savings.toFixed(0)}/חודש
                                    </span>
                                  </div>
                                  <div className="text-xs text-emerald-600 text-center mt-0.5">
                                    = ₪{(savings * 12).toLocaleString()} בשנה
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <Button
                              onClick={() => handleSelectPlan(plan)}
                              className={cn(
                                "w-full h-11 font-semibold text-sm transition-all duration-300 shadow-sm group-hover:shadow-md",
                                isRecommended 
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                                  : "bg-slate-800 hover:bg-slate-900 text-white"
                              )}
                            >
                              <Rocket className="ml-2 h-4 w-4" />
                              {isRecommended ? "עברו למסלול זה" : "בחרו מסלול זה"}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View - Compact
          <div className="space-y-6 animate-fade-in">
            {Array.from(plansByCompany.entries()).map(([company, plans], companyIndex) => {
              const logo = companyLogos[company];
              return (
                <Card 
                  key={company} 
                  className="overflow-hidden shadow-md hover:shadow-lg transition-shadow animate-fade-in"
                  style={{
                    animationDelay: `${companyIndex * 100}ms`
                  }}
                >
                  <CardHeader className="bg-gradient-to-l from-purple-50 to-white border-b">
                    <div className="flex items-center gap-4">
                      {logo && (
                        <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center p-2 border border-gray-100">
                          <img src={logo} alt={company} className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="font-['Rubik'] text-xl">{company}</CardTitle>
                        <p className="text-sm text-gray-500 font-['Rubik'] mt-1">{plans.length} מסלולים</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {plans.map((plan, index) => {
                        const savings = currentMonthlyBill > 0 && plan.monthlyPrice! < currentMonthlyBill 
                          ? currentMonthlyBill - plan.monthlyPrice! 
                          : 0;
                        const isRecommended = savings > 0;
                        
                        return (
                          <div 
                            key={`${plan.company}-${plan.plan}-${index}`}
                            className={cn(
                              "p-5 hover:bg-gray-50 transition-colors",
                              isRecommended && "bg-green-50/50 hover:bg-green-50"
                            )}
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              {/* Plan Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-2">
                                  <h3 className="text-base font-bold text-gray-900 font-['Rubik'] line-clamp-1 flex-1">
                                    {plan.plan}
                                  </h3>
                                  {isRecommended && (
                                    <Badge className="bg-green-600 text-white font-['Rubik'] shrink-0">
                                      <Star className="w-3 h-3 ml-1" />
                                      מומלץ
                                    </Badge>
                                  )}
                                  {index === 0 && (
                                    <Badge variant="outline" className="font-['Rubik'] shrink-0">
                                      הזול ביותר
                                    </Badge>
                                  )}
                                </div>

                                {plan.transferBenefits && (
                                  <p className="text-xs text-gray-600 font-['Rubik'] line-clamp-1">
                                    🎁 {plan.transferBenefits}
                                  </p>
                                )}
                              </div>

                              {/* Price and Action */}
                              <div className="flex items-center gap-6 md:flex-shrink-0">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-600 font-['Rubik']">
                                    ₪{plan.monthlyPrice}
                                  </div>
                                  <div className="text-xs text-gray-500 font-['Rubik']">לחודש</div>
                                  {isRecommended && (
                                    <div className="text-xs font-semibold text-green-600 font-['Rubik'] mt-1">
                                      חוסך ₪{savings.toFixed(0)}
                                    </div>
                                  )}
                                </div>

                                <Button
                                  onClick={() => handleSelectPlan(plan)}
                                  size="sm"
                                  className={cn(
                                    "font-['Rubik'] whitespace-nowrap",
                                    isRecommended 
                                      ? "bg-green-600 hover:bg-green-700" 
                                      : "bg-purple-600 hover:bg-purple-700"
                                  )}
                                >
                                  {isRecommended ? 'עברו עכשיו' : 'בחרו'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Form Dialog - Compact Single Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-light font-heebo">
              {selectedPlanForForm && (
                <>השלמת מעבר ל-{selectedPlanForForm.company}</>
              )}
            </DialogTitle>
            <DialogDescription className="font-heebo font-light text-sm">
              מלאו את הפרטים הבאים להשלמת המעבר למסלול החדש
            </DialogDescription>
          </DialogHeader>
          {selectedPlanForForm && (
            <UnifiedServiceForm 
              onComplete={handleFormClose}
              initialData={{
                action_type: 'switch',
                sector: selectedPlanForForm.service === 'סלולר' ? 'cellular' 
                  : selectedPlanForForm.service.includes('אינטרנט') ? 'internet_isp'
                  : selectedPlanForForm.service.includes('טלוויזיה') ? 'tv'
                  : selectedPlanForForm.service === 'חשמל' ? 'electricity'
                  : 'cellular',
                target_provider: selectedPlanForForm.company,
                selected_plan_name: selectedPlanForForm.plan,
                selected_plan_price: selectedPlanForForm.monthlyPrice,
                selected_plan_features: [
                  selectedPlanForForm.transferBenefits,
                  selectedPlanForForm.commitment ? `התחייבות: ${selectedPlanForForm.commitment}` : null,
                  selectedPlanForForm.sla ? `ציון שירות: ${selectedPlanForForm.sla}` : null
                ].filter(Boolean) as string[]
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Personalized Wizard Float */}
      <PersonalizedWizardFloat />
    </div>
  );
};

export default AllPlans;
