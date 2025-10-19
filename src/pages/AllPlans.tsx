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
  Rocket
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
import annualSavingsSketch from "@/assets/savings-clean.png";
import EnhancedPlanCardModern from "@/components/plans/EnhancedPlanCardModern";

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
type ViewMode = 'grid' | 'list';

const AllPlans = () => {
  const navigate = useNavigate();
  const allPlans = useAllPlans();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('price-asc');
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
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
    // Store plan data for the form
    const planData = {
      planName: plan.plan,
      company: plan.company,
      price: plan.monthlyPrice,
      category: plan.service,
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white font-heebo antialiased">
      {/* Floating Top Plan CTA */}
      {showTopPlan && topPlan && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
          style={{
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <Card className="shadow-2xl border-2 border-green-400 bg-gradient-to-r from-green-600 to-green-500 text-white max-w-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-bold text-sm mb-1">💎 המסלול המומלץ ביותר</div>
                <div className="text-xs opacity-90">{topPlan.company} - ₪{topPlan.monthlyPrice}/חודש</div>
              </div>
              <Button
                onClick={() => handleSelectPlan(topPlan)}
                size="sm"
                className="bg-white text-green-600 hover:bg-gray-100 font-bold shadow-lg"
              >
                <Rocket className="ml-1 h-4 w-4" />
                עברו עכשיו
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl py-5">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            <span className="font-normal">חזרה לדף הבית</span>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                מסלולים זמינים
              </h1>
              {currentMonthlyBill > 0 && stats && (
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline" className="bg-white border-gray-300 font-normal text-gray-700">
                    משלמים היום: <span className="font-medium text-gray-900 mr-1">₪{currentMonthlyBill}</span>
                  </Badge>
                  {stats.maxSavings > 0 && (
                    <Badge className="bg-green-500 text-white font-normal border-0 shadow-sm">
                      <TrendingDown className="ml-1 h-3 w-3" />
                      חיסכון עד ₪{stats.maxSavings.toFixed(0)} בחודש
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList className="bg-gray-100 border-gray-200">
                  <TabsTrigger value="grid" className="gap-2 font-normal">
                    <Grid3x3 className="h-4 w-4" />
                    כרטיסים
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2 font-normal">
                    <List className="h-4 w-4" />
                    רשימה
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Badge variant="outline" className="font-normal border-gray-300 text-gray-600">
                {filteredPlans.length} מסלולים
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Company Logos Section */}
        <div className="mb-8 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 py-6">
            {Object.entries(companyLogos).map(([company, logo]) => (
              <div key={company} className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img 
                  src={logo} 
                  alt={company}
                  className="h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Savings Banner - Centered */}
        {!isLoading && stats && stats.recommendedCount > 0 && (
          <div className="mb-8 animate-fade-in">
            <div className="relative bg-gradient-to-br from-green-50/40 via-white to-green-50/20 border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-8 items-center p-8">
                {/* Content - Right Side */}
                <div className="flex flex-col items-center md:items-end justify-center gap-6 text-center md:text-right order-1">
                  {/* Icon Circle */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50"></div>
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-200">
                      <TrendingDown className="w-8 h-8 text-green-600" strokeWidth={2} />
                    </div>
                  </div>
                  
                  {/* Main Headline */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-light text-gray-900">
                      החיסכון השנתי שלכם
                    </h2>
                    
                    {/* Large Amount */}
                    <div className="flex items-baseline justify-center md:justify-end gap-2">
                      <span className="text-6xl font-light text-gray-900 tracking-tight">
                        ₪{(stats.maxSavings * 12).toFixed(0).toLocaleString()}
                      </span>
                      <span className="text-2xl font-light text-gray-500">
                        בשנה
                      </span>
                    </div>
                    
                    {/* Sales Message */}
                    <p className="text-lg font-light text-gray-600 max-w-2xl">
                      גלו כמה תחסכו עם המסלולים המומלצים - ללא התחייבות
                    </p>
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 text-sm text-gray-500 pt-2">
                    <div className="flex items-center gap-2 font-light">
                      <span>₪{stats.maxSavings.toFixed(0)} חיסכון חודשי</span>
                      <Sparkles className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center gap-2 font-light">
                      <span>{stats.recommendedCount} מסלולים מומלצים</span>
                      <Award className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Sketch Illustration - Left Side */}
                <div className="relative order-2">
                  <div className="relative w-full h-48 md:h-64 flex items-center justify-center mix-blend-multiply">
                    <img 
                      src={annualSavingsSketch} 
                      alt="חיסכון שנתי" 
                      className="w-full h-full object-contain opacity-80"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section - Compact */}
        <Card className="mb-8 shadow-sm border-gray-200 bg-white">
          <CardContent className="p-5">
            {/* Category Pills */}
            <div className="mb-5">
              <h3 className="text-xs font-light text-gray-500 mb-2.5">סינון לפי קטגוריה</h3>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg font-light transition-all duration-200 flex items-center gap-1.5 text-xs",
                        selectedCategory === category.id
                          ? "bg-gray-900 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-200"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search and Sort - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="חיפוש לפי חברה או שם מסלול..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9 h-9 text-sm border-gray-200 focus:border-gray-300 font-light"
                />
              </div>
              
              <div className="relative">
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="w-full h-9 pr-9 pl-3 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 font-light focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                >
                  <option value="price-asc">מחיר: מהנמוך לגבוה</option>
                  <option value="price-desc">מחיר: מהגבוה לנמוך</option>
                  <option value="name">שם החברה</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

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
        ) : viewMode === 'grid' ? (
          // Grid View - Grouped by Company
          <div className="space-y-8 animate-fade-in">
            {Array.from(plansByCompany.entries()).map(([company, plans], companyIndex) => {
              const logo = companyLogos[company];
              const recommendedInCompany = plans.filter(p => 
                currentMonthlyBill > 0 && p.monthlyPrice! < currentMonthlyBill
              ).length;
              
              return (
                <div 
                  key={company} 
                  className="space-y-4 animate-fade-in"
                  style={{
                    animationDelay: `${companyIndex * 100}ms`
                  }}
                >
                  {/* Company Header */}
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200 group">
                    {logo && (
                      <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center p-2 border border-gray-100 group-hover:shadow transition-all duration-300">
                        <img src={logo} alt={company} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-light text-gray-900 group-hover:text-gray-700 transition-colors">
                        {company}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500 font-light">{plans.length} מסלולים זמינים</p>
                        {recommendedInCompany > 0 && (
                          <Badge className="bg-green-500 text-white text-xs font-normal border-0">
                            <CheckCircle2 className="ml-1 h-3 w-3" />
                            {recommendedInCompany} מומלצים
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {plans.map((plan, index) => {
                      const savings = currentMonthlyBill > 0 && plan.monthlyPrice! < currentMonthlyBill 
                        ? currentMonthlyBill - plan.monthlyPrice! 
                        : 0;
                      const isRecommended = savings > 0;
                      const logo = companyLogos[plan.company];
                      
                      return (
                        <EnhancedPlanCardModern
                          key={`${plan.company}-${plan.plan}-${index}`}
                          plan={plan}
                          isRecommended={isRecommended}
                          savings={savings}
                          onSelect={handleSelectPlan}
                          rank={index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 3 : undefined}
                          companyLogo={logo}
                          className="animate-scale-in"
                          style={{
                            animationDelay: `${index * 50}ms`
                          } as React.CSSProperties}
                        />
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
          <UnifiedServiceForm onComplete={handleFormClose} />
        </DialogContent>
      </Dialog>

      {/* Personalized Wizard Float */}
      <PersonalizedWizardFloat />
    </div>
  );
};

export default AllPlans;
