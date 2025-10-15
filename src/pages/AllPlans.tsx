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
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAllPlans, PlanRecord } from "@/hooks/useAllPlans";

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

  // Load stored analysis data
  useEffect(() => {
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

  const handleSelectPlan = (plan: PlanRecord) => {
    localStorage.setItem('selectedPlanForSwitch', JSON.stringify({
      planName: plan.plan,
      company: plan.company,
      price: plan.monthlyPrice,
      category: plan.service,
      switchType: 'switch'
    }));
    navigate('/service-request');
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
    <div className="min-h-screen bg-gray-50 font-['Rubik']">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-3 font-['Rubik']"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-['Rubik']">
                מסלולים זמינים
              </h1>
              {currentMonthlyBill > 0 && (
                <p className="text-gray-600 mt-1 font-['Rubik']">
                  אתם משלמים היום: <span className="font-bold text-purple-600">₪{currentMonthlyBill}</span>
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList className="bg-purple-100">
                  <TabsTrigger value="grid" className="gap-2">
                    <Grid3x3 className="h-4 w-4" />
                    כרטיסים
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2">
                    <List className="h-4 w-4" />
                    רשימה
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Badge variant="outline" className="font-['Rubik']">
                {filteredPlans.length} מסלולים
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-6">
        {/* Filters Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Category Pills */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 font-['Rubik']">סינון לפי קטגוריה</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-all duration-200 font-['Rubik'] flex items-center gap-2",
                        selectedCategory === category.id
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="חיפוש לפי חברה או שם מסלול..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 font-['Rubik']"
                />
              </div>
              
              <div className="relative">
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="w-full h-10 pr-10 pl-4 rounded-md border border-gray-200 bg-white text-gray-900 font-['Rubik'] focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        {filteredPlans.length === 0 ? (
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
          <div className="space-y-8">
            {Array.from(plansByCompany.entries()).map(([company, plans]) => {
              const logo = companyLogos[company];
              return (
                <div key={company} className="space-y-4">
                  {/* Company Header */}
                  <div className="flex items-center gap-4 pb-3 border-b-2 border-purple-200">
                    {logo && (
                      <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-3 border border-gray-100">
                        <img src={logo} alt={company} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 font-['Rubik']">{company}</h2>
                      <p className="text-sm text-gray-500 font-['Rubik']">{plans.length} מסלולים זמינים</p>
                    </div>
                  </div>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan, index) => {
                      const savings = currentMonthlyBill > 0 && plan.monthlyPrice! < currentMonthlyBill 
                        ? currentMonthlyBill - plan.monthlyPrice! 
                        : 0;
                      const isRecommended = savings > 0;
                      
                      return (
                        <Card 
                          key={`${plan.company}-${plan.plan}-${index}`}
                          className={cn(
                            "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group",
                            isRecommended && "ring-2 ring-green-400 bg-gradient-to-br from-green-50 to-white"
                          )}
                        >
                          <CardContent className="p-6">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {isRecommended && (
                                <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white font-['Rubik']">
                                  <Sparkles className="w-3 h-3 ml-1" />
                                  מומלץ במיוחד
                                </Badge>
                              )}
                              {index === 0 && (
                                <Badge variant="outline" className="border-purple-300 text-purple-700 font-['Rubik']">
                                  זול ביותר
                                </Badge>
                              )}
                            </div>

                            {/* Plan Name */}
                            <h3 className="text-lg font-bold text-gray-900 font-['Rubik'] mb-3 line-clamp-2 min-h-[56px]">
                              {plan.plan}
                            </h3>

                            {/* Benefits */}
                            {plan.transferBenefits && (
                              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <p className="text-xs text-purple-700 font-['Rubik'] line-clamp-2">
                                  🎁 {plan.transferBenefits}
                                </p>
                              </div>
                            )}

                            {/* Price Section */}
                            <div className="mb-4 pt-4 border-t border-gray-100">
                              <div className="flex items-baseline justify-center gap-1 mb-1">
                                <span className="text-4xl font-bold text-purple-600 font-['Rubik']">
                                  {plan.monthlyPrice}
                                </span>
                                <span className="text-lg text-gray-500 font-['Rubik']">₪</span>
                              </div>
                              <div className="text-center text-sm text-gray-500 font-['Rubik']">לחודש</div>
                              {isRecommended && (
                                <div className="text-center mt-2 px-3 py-1 bg-green-100 rounded-full">
                                  <span className="text-sm font-bold text-green-700 font-['Rubik']">
                                    💰 חיסכון של ₪{savings.toFixed(0)} בחודש
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <Button
                              onClick={() => handleSelectPlan(plan)}
                              className={cn(
                                "w-full font-['Rubik'] font-semibold shadow-md group-hover:shadow-lg transition-all",
                                isRecommended 
                                  ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600" 
                                  : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                              )}
                            >
                              {isRecommended ? (
                                <>
                                  <CheckCircle2 className="ml-2 h-5 w-5" />
                                  עברו למסלול המומלץ
                                </>
                              ) : (
                                'בחרו מסלול זה'
                              )}
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
          <div className="space-y-6">
            {Array.from(plansByCompany.entries()).map(([company, plans]) => {
              const logo = companyLogos[company];
              return (
                <Card key={company} className="overflow-hidden">
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
    </div>
  );
};

export default AllPlans;
