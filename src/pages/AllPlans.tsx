import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  Smartphone, 
  Wifi, 
  Tv, 
  ArrowLeft, 
  Building2, 
  Crown, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Sparkles, 
  Star,
  BarChart3,
  Filter,
  Search,
  Calculator,
  Brain,
  Target,
  Eye,
  X,
  Plus,
  Minus,
  Settings2,
  RefreshCw,
  Heart,
  Share2,
  Copy,
  Clock,
  TrendingDown,
  Info
} from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
import DetailedAIComparison from "@/components/plans/DetailedAIComparison";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RecommendationContext } from "@/lib/recommendationEngine";
import { cn } from "@/lib/utils";

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

const AllPlans = ({ savingsData = [], initialSelectedCategories = [] }: AllPlansProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<ManualPlan[]>([]);
  const [comparedPlans, setComparedPlans] = useState<ManualPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'features' | 'ai'>('ai');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showQuickStats, setShowQuickStats] = useState(true);
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
    const storedFavorites = localStorage.getItem('planFavorites');
    const storedSearchHistory = localStorage.getItem('searchHistory');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          // Set the first category as selected
          const firstCategory = parsedData[0].category;
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'mobile', 'electricity': 'electricity', 'internet': 'internet', 'tv': 'tv'
          };
          setSelectedCategory(categoryMapping[firstCategory] || firstCategory as CategoryType);
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
    
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
    
    if (storedSearchHistory) {
      try {
        setSearchHistory(JSON.parse(storedSearchHistory));
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }
  }, []);

  useEffect(() => {
    document.title = "כל המסלולים | EasySwitch";
  }, []);

  // Get filtered and sorted plans
  const filteredPlans = useMemo(() => {
    if (!selectedCategory) return [];
    
    let filtered = manualPlans.filter(plan => {
      // Filter by category
      if (plan.category !== selectedCategory) return false;
      
      // Filter by search term
      if (searchTerm && !plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !plan.company.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by price range
      if (plan.regularPrice < priceRange.min || plan.regularPrice > priceRange.max) {
        return false;
      }
      
      return true;
    });
    
    // Sort plans
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.regularPrice - b.regularPrice);
        break;
      case 'features':
        filtered.sort((a, b) => (b.features?.length || 0) - (a.features?.length || 0));
        break;
      case 'rating':
        // Random rating for demo
        filtered.sort(() => Math.random() - 0.5);
        break;
    }
    
    return filtered;
  }, [selectedCategory, searchTerm, priceRange, sortBy]);

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

  const cheapestPlan = filteredPlans.length > 0 ? 
    filteredPlans.reduce((min, plan) => plan.regularPrice < min.regularPrice ? plan : min) : null;

  const handleCompareToggle = (plan: ManualPlan) => {
    if (isInComparison(plan.id)) {
      setComparedPlans(prev => prev.filter(p => p.id !== plan.id));
    } else if (canAddToComparison) {
      setComparedPlans(prev => [...prev, plan]);
    }
  };

  const handlePlanSelect = (plan: ManualPlan) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

  const clearComparison = () => setComparedPlans([]);

  const toggleFavorite = (planId: string) => {
    const updatedFavorites = favorites.includes(planId)
      ? favorites.filter(id => id !== planId)
      : [...favorites, planId];
    setFavorites(updatedFavorites);
    localStorage.setItem('planFavorites', JSON.stringify(updatedFavorites));
  };

  const addToSearchHistory = (term: string) => {
    if (term.trim() && !searchHistory.includes(term)) {
      const updatedHistory = [term, ...searchHistory.slice(0, 4)];
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
  };

  const copyPlanDetails = (plan: ManualPlan) => {
    const text = `${plan.company} - ${plan.planName}
מחיר: ₪${plan.regularPrice} לחודש
תכונות: ${plan.features?.join(', ') || 'לא צוינו'}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "פרטי המסלול הועתקו",
      description: "פרטי המסלול הועתקו ללוח",
    });
  };

  // Quick stats calculation
  const categoryStats = useMemo(() => {
    if (!selectedCategory || filteredPlans.length === 0) return null;
    
    const prices = filteredPlans.map(p => p.regularPrice);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const cheapPlansCount = prices.filter(p => p <= avgPrice * 0.8).length;
    
    return { avgPrice, minPrice, maxPrice, cheapPlansCount, total: filteredPlans.length };
  }, [selectedCategory, filteredPlans]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-purple-200/30 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-purple-600 font-heebo">EasySwitch</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">דף הבית</a>
              <a href="/all-plans" className="text-purple-600 font-medium hover:text-purple-700 transition-colors font-heebo">כל המסלולים</a>
              <a href="/magazine" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">מגזין</a>
              <a href="/tips" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">טיפים</a>
              <a href="/about" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">אודות</a>
              <a href="/contact" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">צור קשר</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 lg:px-6 max-w-7xl py-8">
        {/* Enhanced Page Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-green-600/10 rounded-3xl blur-3xl -z-10"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Brain className="w-12 h-12 text-purple-600" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent font-heebo">
                מרכז המסלולים החכם
              </h1>
            </div>
            <p className="text-xl text-muted-foreground font-assistant max-w-3xl mx-auto mb-6">
              השוואה מבוססת AI, המלצות מותאמות אישית וכל המסלולים הטובים ביותר במקום אחד
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>מעל 1000 מסלולים</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>המלצות AI</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>השוואה מפורטת</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 font-heebo mb-6 text-center">
            בחרו קטגוריה לצפייה במסלולים
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                className={cn(
                  "h-24 flex-col gap-2 text-lg font-heebo transition-all duration-300",
                  selectedCategory === key 
                    ? "bg-purple-600 text-white shadow-lg scale-105" 
                    : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                )}
                onClick={() => setSelectedCategory(key as CategoryType)}
              >
                {config.icon}
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        {selectedCategory && showQuickStats && categoryStats && (
          <Card className="mb-6 border border-blue-200 bg-gradient-to-r from-blue-50/50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-blue-800 font-heebo">סטטיסטיקות מהירות</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickStats(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₪{categoryStats.avgPrice}</div>
                  <div className="text-xs text-muted-foreground">ממוצע מחירים</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₪{categoryStats.minPrice}</div>
                  <div className="text-xs text-muted-foreground">הזול ביותר</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{categoryStats.cheapPlansCount}</div>
                  <div className="text-xs text-muted-foreground">מסלולים זולים</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{categoryStats.total}</div>
                  <div className="text-xs text-muted-foreground">סה"כ מסלולים</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {selectedCategory && (
          <Card className="mb-8 border-2 border-primary/10 bg-gradient-to-r from-white via-purple-50/30 to-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-primary font-heebo flex items-center gap-3">
                  <Filter className="w-6 h-6" />
                  סינון וחיפוש מתקדם
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="font-assistant"
                >
                  <Settings2 className="w-4 h-4 ml-2" />
                  {showAdvancedFilters ? 'הסתר מתקדם' : 'הצג מתקדם'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground font-assistant flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    חיפוש חכם
                  </Label>
                   <div className="relative">
                     <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                     <Input
                       placeholder="חפשו לפי שם מסלול, חברה או תכונה..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && searchTerm.trim()) {
                           addToSearchHistory(searchTerm);
                         }
                       }}
                       className="pr-12 h-12 font-assistant text-lg"
                     />
                     {searchTerm && (
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => setSearchTerm('')}
                         className="absolute left-2 top-1/2 transform -translate-y-1/2"
                       >
                         <X className="w-4 h-4" />
                       </Button>
                     )}
                   </div>
                   
                   {/* Search History */}
                   {searchHistory.length > 0 && !searchTerm && (
                     <div className="mt-2">
                       <div className="flex items-center gap-2 mb-2">
                         <Clock className="w-3 h-3 text-muted-foreground" />
                         <span className="text-xs text-muted-foreground">חיפושים אחרונים:</span>
                       </div>
                       <div className="flex flex-wrap gap-1">
                         {searchHistory.map((term, idx) => (
                           <Button
                             key={idx}
                             variant="outline"
                             size="sm"
                             className="text-xs h-6 px-2"
                             onClick={() => setSearchTerm(term)}
                           >
                             {term}
                           </Button>
                         ))}
                       </div>
                     </div>
                   )}
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground font-assistant flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    טווח מחירים (₪)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="מחיר מינימום"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="font-assistant h-12"
                    />
                    <Input
                      type="number"
                      placeholder="מחיר מקסימום"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                      className="font-assistant h-12"
                    />
                  </div>
                </div>

                {/* Enhanced Sort */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground font-assistant flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    סדר תצוגה
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={sortBy === 'ai' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('ai')}
                      className="font-assistant h-12 flex-col gap-1"
                    >
                      <Brain className="w-4 h-4" />
                      AI המלצות
                    </Button>
                    <Button
                      variant={sortBy === 'price' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('price')}
                      className="font-assistant h-12 flex-col gap-1"
                    >
                      <TrendingUp className="w-4 h-4" />
                      מחיר
                    </Button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t border-primary/10 pt-6">
                  <h3 className="text-lg font-bold text-primary font-heebo mb-4">הגדרות מתקדמות</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-assistant font-semibold">תקציב חודשי מועדף</Label>
                      <Input
                        type="number"
                        value={200}
                        onChange={(e) => {/* Will be handled later */}}
                        placeholder="₪200"
                        className="font-assistant"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-assistant font-semibold">גודל משק בית</Label>
                      <Input
                        type="number"
                        value={userContext.familySize}
                        onChange={(e) => setUserContext(prev => ({ ...prev, familySize: parseInt(e.target.value) || 2 }))}
                        placeholder="2"
                        className="font-assistant"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                <div className="text-sm text-muted-foreground">
                  {filteredPlans.length} מסלולים נמצאו
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setPriceRange({ min: 0, max: 1000 });
                    setSortBy('ai');
                  }}
                  className="font-assistant"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  איפוס סינונים
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Comparison Bar */}
        {comparedPlans.length > 0 && (
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 font-heebo">השוואת מסלולים חכמה</h3>
                    <p className="text-blue-600 font-assistant">
                      {comparedPlans.length} מסלולים נבחרו • עד {3 - comparedPlans.length} נוספים
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <DetailedAIComparison 
                    plans={comparedPlans}
                    userContext={userContext}
                    category={selectedCategory as 'electricity' | 'internet' | 'mobile' | 'tv'}
                  />
                  <Button
                    onClick={() => setShowComparison(!showComparison)}
                    variant="outline"
                    className="font-assistant"
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    {showComparison ? 'הסתר טבלה' : 'הצג טבלה'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearComparison}
                    className="font-assistant"
                  >
                    <X className="w-4 h-4 ml-2" />
                    נקה הכל
                  </Button>
                </div>
              </div>
              
              {/* Comparison Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparedPlans.map((plan) => (
                  <Card key={plan.id} className="border border-blue-200 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-primary font-heebo">{plan.company}</h4>
                          <p className="text-sm text-muted-foreground font-assistant">{plan.planName}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setComparedPlans(prev => prev.filter(p => p.id !== plan.id))}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-2xl font-bold text-primary font-heebo mb-2">
                        ₪{plan.regularPrice}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {plan.features?.slice(0, 2).join(' • ')}
                        {(plan.features?.length || 0) > 2 && ` +${(plan.features?.length || 0) - 2} נוספות`}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Comparison */}
        {showComparison && comparedPlans.length > 0 && (
          <Card className="mb-8 border-2 border-purple-200">
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
                  <Input
                    placeholder="שם המסלול"
                    value={currentUserPlan.name}
                    onChange={(e) => setCurrentUserPlan(prev => ({ ...prev, name: e.target.value }))}
                    className="font-assistant"
                  />
                  <Input
                    placeholder="מחיר חודשי (₪)"
                    value={currentUserPlan.price}
                    onChange={(e) => setCurrentUserPlan(prev => ({ ...prev, price: e.target.value }))}
                    className="font-assistant"
                  />
                  <Input
                    placeholder="שם החברה"
                    value={currentUserPlan.company}
                    onChange={(e) => setCurrentUserPlan(prev => ({ ...prev, company: e.target.value }))}
                    className="font-assistant"
                  />
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-right font-heebo font-semibold">פרט</th>
                      {currentUserPlan.name && (
                        <th className="p-4 text-center font-heebo font-semibold text-yellow-700 bg-yellow-50">
                          {currentUserPlan.name}
                          <div className="text-xs text-yellow-600">(נוכחי)</div>
                        </th>
                      )}
                      {comparedPlans.map(plan => (
                        <th key={plan.id} className="p-4 text-center font-heebo font-semibold">
                          {plan.planName}
                          <div className="text-xs text-muted-foreground">{plan.company}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-4 font-semibold font-assistant">מחיר חודשי</td>
                      {currentUserPlan.name && (
                        <td className="p-4 text-center font-bold text-yellow-700 bg-yellow-50">
                          ₪{currentUserPlan.price}
                        </td>
                      )}
                      {comparedPlans.map(plan => (
                        <td key={plan.id} className="p-4 text-center font-bold text-purple-600">
                          ₪{plan.regularPrice}
                        </td>
                      ))}
                    </tr>
                    {currentUserPlan.price && (
                      <tr className="border-t bg-green-50">
                        <td className="p-4 font-semibold font-assistant">חיסכון חודשי</td>
                        <td className="p-4 text-center text-yellow-700 bg-yellow-50">-</td>
                        {comparedPlans.map(plan => {
                          const savings = parseInt(currentUserPlan.price) - plan.regularPrice;
                          return (
                            <td key={plan.id} className={`p-4 text-center font-bold ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {savings > 0 ? `+₪${savings}` : `₪${Math.abs(savings)}-`}
                            </td>
                          );
                        })}
                      </tr>
                    )}
                    <tr className="border-t">
                      <td className="p-4 font-semibold font-assistant">תכונות</td>
                      {currentUserPlan.name && (
                        <td className="p-4 text-center text-yellow-700 bg-yellow-50">-</td>
                      )}
                      {comparedPlans.map(plan => (
                        <td key={plan.id} className="p-4 text-center">
                          <Badge variant="outline" className="font-assistant">
                            {plan.features?.length || 0} תכונות
                          </Badge>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        {selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 font-heebo">
                מסלולי {categoryConfig[selectedCategory].label}
              </h2>
              <Badge variant="secondary" className="text-lg px-4 py-2 font-assistant">
                {filteredPlans.length} מסלולים
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan, index) => {
                const isCheapest = cheapestPlan && plan.id === cheapestPlan.id;
                const inComparison = isInComparison(plan.id);
                
                return (
                  <Card 
                    key={plan.id}
                    className={cn(
                      "group transition-all duration-300 hover:shadow-xl border-2 relative",
                      "animate-fade-in opacity-0",
                      isCheapest && "ring-2 ring-green-400/50 bg-green-50/30",
                      inComparison && "ring-2 ring-purple-400/50 bg-purple-50/30",
                      "hover:border-purple/30"
                    )}
                    style={{ 
                      animationDelay: `${index * 0.1}s`, 
                      animationFillMode: 'forwards' 
                    }}
                  >
                     {/* Favorite Badge */}
                     {favorites.includes(plan.id) && (
                       <div className="absolute top-3 left-3 z-10">
                         <Badge className="bg-red-500 text-white px-2 py-1 shadow-lg">
                           <Heart className="w-3 h-3 ml-1 fill-current" />
                           מועדף
                         </Badge>
                       </div>
                     )}

                     {/* Best Deal Badge */}
                    {isCheapest && (
                      <div className="absolute -top-3 -right-3 z-10">
                        <Badge className="bg-green-500 text-white px-3 py-1 shadow-lg">
                          <Crown className="w-4 h-4 ml-1" />
                          הזול ביותר
                        </Badge>
                      </div>
                    )}

                    {/* Comparison Badge */}
                    {inComparison && (
                      <div className="absolute -top-3 -left-3 z-10">
                        <Badge className="bg-purple-500 text-white px-3 py-1 shadow-lg">
                          <Eye className="w-4 h-4 ml-1" />
                          בהשוואה
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 font-heebo mb-1">
                            {plan.company}
                          </h3>
                          <p className="text-lg text-gray-600 font-assistant">
                            {plan.planName}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="text-3xl font-bold text-purple-600 font-heebo">
                            ₪{plan.regularPrice}
                          </div>
                          <div className="text-sm text-gray-500 font-assistant">לחודש</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Features Preview */}
                      {plan.features && plan.features.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 font-assistant mb-2">תכונות עיקריות:</h4>
                          <div className="space-y-1">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-gray-600 font-assistant">{feature}</span>
                              </div>
                            ))}
                            {plan.features.length > 3 && (
                              <p className="text-sm text-purple-600 font-assistant">
                                +{plan.features.length - 3} תכונות נוספות
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                       <div className="flex gap-2 pt-4">
                         <Button 
                           onClick={() => handlePlanSelect(plan)}
                           className="flex-1 font-assistant"
                         >
                           בחר מסלול
                         </Button>
                         <Button
                           variant="outline"
                           onClick={() => handleCompareToggle(plan)}
                           disabled={!canAddToComparison && !inComparison}
                           className="font-assistant"
                         >
                           {inComparison ? (
                             <Minus className="w-4 h-4" />
                           ) : (
                             <Plus className="w-4 h-4" />
                           )}
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => toggleFavorite(plan.id)}
                           className={favorites.includes(plan.id) ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-red-500"}
                         >
                           <Heart className={`w-4 h-4 ${favorites.includes(plan.id) ? 'fill-current' : ''}`} />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => copyPlanDetails(plan)}
                           className="text-gray-400 hover:text-blue-500"
                         >
                           <Copy className="w-4 h-4" />
                         </Button>
                       </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 font-heebo mb-2">
                  לא נמצאו מסלולים
                </h3>
                <p className="text-gray-500 font-assistant">
                  נסו לשנות את הפילטרים או את מילות החיפוש
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedCategory && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 font-heebo mb-2">
              בחרו קטגוריה להתחלה
            </h3>
            <p className="text-gray-600 font-assistant text-lg">
              בחרו את הקטגוריה המעניינת אתכם כדי לראות את כל המסלולים הזמינים
            </p>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800 font-heebo">
              בקשת החלפת ספק
            </DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <EnhancedSwitchRequestForm 
              selectedPlan={selectedPlan}
              isOpen={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setSelectedPlan(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllPlans;