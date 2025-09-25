import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  RefreshCw
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
            'cellular': 'mobile', 'electricity': 'electricity', 'internet': 'internet', 'tv': 'tv'
          };
          setSelectedCategory(categoryMapping[firstCategory] || firstCategory as CategoryType);
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-blue-50/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-blue-400/5 to-green-400/5 pointer-events-none"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-40 w-72 h-72 bg-green-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      
      {/* Enhanced Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-purple-200/50 py-4 sticky top-0 z-50 shadow-lg shadow-purple-100/20">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent font-heebo">
                  EasySwitch
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20 rounded-lg blur opacity-30"></div>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="relative text-gray-600 font-medium hover:text-purple-600 transition-all duration-300 font-heebo group">
                דף הבית
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/all-plans" className="relative text-purple-600 font-medium hover:text-purple-700 transition-all duration-300 font-heebo group">
                כל המסלולים
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"></span>
              </a>
              <a href="/magazine" className="relative text-gray-600 font-medium hover:text-purple-600 transition-all duration-300 font-heebo group">
                מגזין
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/tips" className="relative text-gray-600 font-medium hover:text-purple-600 transition-all duration-300 font-heebo group">
                טיפים
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/about" className="relative text-gray-600 font-medium hover:text-purple-600 transition-all duration-300 font-heebo group">
                אודות
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/contact" className="relative text-gray-600 font-medium hover:text-purple-600 transition-all duration-300 font-heebo group">
                צור קשר
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative container mx-auto px-4 lg:px-6 max-w-7xl py-8">
        {/* Revolutionary Page Header */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-green-600/15 rounded-[2rem] blur-3xl animate-pulse"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] p-12 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-700 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-green-600/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="relative">
                  <Brain className="w-16 h-16 text-purple-600 animate-pulse" />
                  <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-lg animate-ping"></div>
                </div>
                <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent font-heebo animate-fade-in">
                  מרכז המסלולים החכם
                </h1>
              </div>
              <p className="text-2xl text-muted-foreground font-assistant max-w-4xl mx-auto mb-8 leading-relaxed">
                גלו את המהפכה בהשוואת מסלולים עם <span className="font-bold text-purple-600">AI מתקדם</span>, 
                המלצות מותאמות אישית ומעל <span className="font-bold text-blue-600">1000 מסלולים</span> במקום אחד
              </p>
              <div className="flex items-center justify-center gap-8 text-lg text-muted-foreground">
                <div className="flex items-center gap-3 bg-green-50/80 px-4 py-2 rounded-xl border border-green-200/50">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">מעל 1000 מסלולים</span>
                </div>
                <div className="flex items-center gap-3 bg-purple-50/80 px-4 py-2 rounded-xl border border-purple-200/50">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">המלצות AI חכמות</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-50/80 px-4 py-2 rounded-xl border border-blue-200/50">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">השוואה מתקדמת</span>
                </div>
                <div className="flex items-center gap-3 bg-yellow-50/80 px-4 py-2 rounded-xl border border-yellow-200/50">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">חיסכון מובטח</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Category Selection */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800 font-heebo mb-4">
              בחרו את הקטגוריה שלכם
            </h2>
            <p className="text-xl text-muted-foreground font-assistant">
              כל קטגוריה מכילה מאות מסלולים מהספקים הטובים ביותר בישראל
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {Object.entries(categoryConfig).map(([key, config], index) => (
              <div
                key={key}
                className="animate-fade-in opacity-0"
                style={{ 
                  animationDelay: `${index * 0.2}s`, 
                  animationFillMode: 'forwards' 
                }}
              >
                <Button
                  variant={selectedCategory === key ? "default" : "outline"}
                  className={cn(
                    "w-full h-32 flex-col gap-3 text-xl font-heebo transition-all duration-500 relative group overflow-hidden",
                    selectedCategory === key 
                      ? "bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 text-white shadow-2xl scale-105 border-0" 
                      : "border-2 border-purple-200/50 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 hover:scale-105 hover:shadow-xl"
                  )}
                  onClick={() => setSelectedCategory(key as CategoryType)}
                >
                  {selectedCategory === key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
                  )}
                  <div className={cn(
                    "relative z-10 transition-all duration-300",
                    selectedCategory === key ? "" : "group-hover:scale-110"
                  )}>
                    {config.icon}
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="font-bold">{config.label}</div>
                    <div className={cn(
                      "text-xs opacity-70 font-assistant",
                      selectedCategory === key ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {config.description}
                    </div>
                  </div>
                  {selectedCategory === key && (
                    <div className="absolute top-2 right-2">
                      <Crown className="w-5 h-5 text-yellow-300" />
                    </div>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Revolutionary Filters and Search */}
        {selectedCategory && (
          <Card className="mb-10 border-0 bg-gradient-to-r from-white via-purple-50/50 to-blue-50/50 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-green-600/5"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-heebo flex items-center gap-4">
                  <div className="relative">
                    <Filter className="w-8 h-8 text-purple-600" />
                    <div className="absolute inset-0 bg-purple-600/20 rounded-full blur animate-pulse"></div>
                  </div>
                  סינון וחיפוש מתקדם עם AI
                </CardTitle>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="font-assistant border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                >
                  <Settings2 className="w-5 h-5 ml-2" />
                  {showAdvancedFilters ? 'הסתר מתקדם' : 'הצג מתקדם'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              {/* Enhanced Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Revolutionary Search */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-foreground font-assistant flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-6 h-6 text-purple-600" />
                      <div className="absolute inset-0 bg-purple-600/20 rounded-full blur animate-pulse"></div>
                    </div>
                    חיפוש חכם עם AI
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
                      <Input
                        placeholder="חפשו לפי שם מסלול, חברה, תכונה או מחיר..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-14 h-14 font-assistant text-lg border-2 border-purple-200/50 focus:border-purple-400 rounded-xl bg-white/80 backdrop-blur-sm"
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchTerm('')}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 hover:bg-red-50 text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Price Range */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-foreground font-assistant flex items-center gap-3">
                    <div className="relative">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <div className="absolute inset-0 bg-green-600/20 rounded-full blur animate-pulse"></div>
                    </div>
                    טווח מחירים חכם (₪)
                  </Label>
                  <div className="flex gap-3">
                    <div className="relative group flex-1">
                      <Input
                        type="number"
                        placeholder="מינימום"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                        className="font-assistant h-14 text-center text-lg border-2 border-green-200/50 focus:border-green-400 rounded-xl bg-white/80"
                      />
                    </div>
                    <div className="flex items-center px-2 text-muted-foreground">-</div>
                    <div className="relative group flex-1">
                      <Input
                        type="number"
                        placeholder="מקסימום"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                        className="font-assistant h-14 text-center text-lg border-2 border-green-200/50 focus:border-green-400 rounded-xl bg-white/80"
                      />
                    </div>
                  </div>
                </div>

                {/* Revolutionary Sort */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-foreground font-assistant flex items-center gap-3">
                    <div className="relative">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                      <div className="absolute inset-0 bg-blue-600/20 rounded-full blur animate-pulse"></div>
                    </div>
                    סדר תצוגה מתקדם
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={sortBy === 'ai' ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => setSortBy('ai')}
                      className={cn(
                        "font-assistant h-14 flex-col gap-2 transition-all duration-300 border-2",
                        sortBy === 'ai' 
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105" 
                          : "border-purple-200 hover:border-purple-400 hover:bg-purple-50 hover:scale-105"
                      )}
                    >
                      <Brain className="w-5 h-5" />
                      <span className="text-sm">AI חכם</span>
                    </Button>
                    <Button
                      variant={sortBy === 'price' ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => setSortBy('price')}
                      className={cn(
                        "font-assistant h-14 flex-col gap-2 transition-all duration-300 border-2",
                        sortBy === 'price' 
                          ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg scale-105" 
                          : "border-green-200 hover:border-green-400 hover:bg-green-50 hover:scale-105"
                      )}
                    >
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm">מחיר</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Revolutionary Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t border-gradient-to-r from-purple-200/50 via-blue-200/50 to-green-200/50 pt-8 mt-8">
                  <div className="bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-green-50/50 rounded-2xl p-6 border border-purple-200/30">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-heebo mb-6 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      הגדרות AI מתקדמות
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <Label className="font-assistant font-bold text-lg text-purple-700">תקציב חודשי מועדף</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={userContext.budget}
                            onChange={(e) => setUserContext(prev => ({ ...prev, budget: parseInt(e.target.value) || 200 }))}
                            placeholder="₪200"
                            className="font-assistant h-12 text-lg text-center border-2 border-purple-200/50 focus:border-purple-400 rounded-xl bg-white/80"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">₪</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Label className="font-assistant font-bold text-lg text-blue-700">גודל משק בית</Label>
                        <Input
                          type="number"
                          value={userContext.familySize}
                          onChange={(e) => setUserContext(prev => ({ ...prev, familySize: parseInt(e.target.value) || 2 }))}
                          placeholder="2 אנשים"
                          className="font-assistant h-12 text-lg text-center border-2 border-blue-200/50 focus:border-blue-400 rounded-xl bg-white/80"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="font-assistant font-bold text-lg text-green-700">דירוג שימוש</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {['low', 'medium', 'high'].map((usage) => (
                            <Button
                              key={usage}
                              variant={userContext.usage === usage ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setUserContext(prev => ({ ...prev, usage: usage as any }))}
                              className={cn(
                                "font-assistant text-xs transition-all duration-300",
                                userContext.usage === usage
                                  ? "bg-gradient-to-r from-green-600 to-blue-600 text-white"
                                  : "border-green-200 hover:border-green-400 hover:bg-green-50"
                              )}
                            >
                              {usage === 'low' && 'נמוך'}
                              {usage === 'medium' && 'בינוני'}
                              {usage === 'high' && 'גבוה'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Enhanced Quick Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gradient-to-r from-purple-200/30 via-blue-200/30 to-green-200/30">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-xl border border-purple-200/50">
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {filteredPlans.length} מסלולים נמצאו
                    </span>
                  </div>
                  {cheapestPlan && (
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-xl border border-green-200/50">
                      <span className="text-sm text-green-700 font-semibold">
                        הזול ביותר: ₪{cheapestPlan.regularPrice}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setSearchTerm('');
                    setPriceRange({ min: 0, max: 1000 });
                    setSortBy('ai');
                  }}
                  className="font-assistant border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5 ml-2" />
                  איפוס כל הסינונים
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPlans.map((plan, index) => {
                const isCheapest = cheapestPlan && plan.id === cheapestPlan.id;
                const inComparison = isInComparison(plan.id);
                const aiScore = Math.floor(Math.random() * 30) + 70; // AI score simulation
                
                return (
                  <div
                    key={plan.id}
                    className="animate-fade-in opacity-0 group"
                    style={{ 
                      animationDelay: `${index * 0.1}s`, 
                      animationFillMode: 'forwards' 
                    }}
                  >
                    <Card 
                      className={cn(
                        "relative transition-all duration-500 hover:shadow-2xl border-0 bg-gradient-to-br from-white via-white to-gray-50/50 backdrop-blur-xl overflow-hidden",
                        "hover:scale-[1.02] hover:-translate-y-2",
                        isCheapest && "ring-2 ring-green-400/60 bg-gradient-to-br from-green-50/80 via-white to-green-50/30",
                        inComparison && "ring-2 ring-purple-400/60 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30",
                        !isCheapest && !inComparison && "hover:ring-2 hover:ring-blue-400/40"
                      )}
                    >
                      {/* Background Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-gray-100/30 opacity-60"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
                      
                      {/* Premium Badges */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                        {isCheapest && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 shadow-lg border-0 animate-pulse">
                            <Crown className="w-4 h-4 ml-1" />
                            הזול ביותר
                          </Badge>
                        )}
                        {inComparison && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 shadow-lg border-0">
                            <Eye className="w-4 h-4 ml-1" />
                            בהשוואה
                          </Badge>
                        )}
                        {sortBy === 'ai' && aiScore >= 85 && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 shadow-lg border-0">
                            <Sparkles className="w-4 h-4 ml-1" />
                            המלצת AI
                          </Badge>
                        )}
                      </div>

                      {/* AI Score Ring */}
                      {sortBy === 'ai' && (
                        <div className="absolute top-4 left-4 z-20">
                          <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-0.5">
                              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-purple-600">{aiScore}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <CardHeader className="pb-4 relative z-10">
                        <div className="flex justify-between items-start pt-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center border border-purple-200/50">
                                {categoryConfig[selectedCategory!].icon}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 font-heebo">
                                  {plan.company}
                                </h3>
                                <p className="text-lg text-gray-600 font-assistant">
                                  {plan.planName}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                              <div className="text-3xl font-bold font-heebo">
                                ₪{plan.regularPrice}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 font-assistant">לחודש</div>
                            {currentUserPlan.price && (
                              <div className="text-xs mt-1">
                                {parseInt(currentUserPlan.price) > plan.regularPrice ? (
                                  <span className="text-green-600 font-semibold">
                                    חוסך ₪{parseInt(currentUserPlan.price) - plan.regularPrice}
                                  </span>
                                ) : (
                                  <span className="text-red-500 font-semibold">
                                    +₪{plan.regularPrice - parseInt(currentUserPlan.price)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6 relative z-10">
                        {/* Premium Features Display */}
                        {plan.features && plan.features.length > 0 && (
                          <div className="bg-gradient-to-r from-gray-50/80 to-white/80 rounded-xl p-4 border border-gray-200/50">
                            <h4 className="font-bold text-gray-700 font-assistant mb-3 flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              תכונות מובילות
                            </h4>
                            <div className="space-y-2">
                              {plan.features.slice(0, 3).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                  <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-gray-700 font-assistant font-medium">{feature}</span>
                                </div>
                              ))}
                              {plan.features.length > 3 && (
                                <div className="pt-2 border-t border-gray-200/50">
                                  <p className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    +{plan.features.length - 3} תכונות מתקדמות נוספות
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Action Buttons */}
                        <div className="flex gap-3 pt-2">
                          <Button 
                            onClick={() => handlePlanSelect(plan)}
                            className="flex-1 font-assistant h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                          >
                            <Target className="w-4 h-4 ml-2" />
                            בחר מסלול זה
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleCompareToggle(plan)}
                            disabled={!canAddToComparison && !inComparison}
                            className={cn(
                              "font-assistant h-12 border-2 transition-all duration-300 hover:scale-105",
                              inComparison 
                                ? "border-purple-400 bg-purple-50 text-purple-700 hover:bg-purple-100" 
                                : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                            )}
                          >
                            {inComparison ? (
                              <Minus className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {/* Advanced Stats */}
                        {sortBy === 'ai' && (
                          <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-xl p-3 border border-blue-200/30">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-purple-500" />
                                <span className="font-semibold text-gray-700">דירוג AI</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={cn(
                                      "w-3 h-3",
                                      i < Math.floor(aiScore / 20) ? "text-yellow-400 fill-current" : "text-gray-300"
                                    )} 
                                  />
                                ))}
                                <span className="font-bold text-purple-600 mr-1">{aiScore}/100</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
                    </Card>
                  </div>
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