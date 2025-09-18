import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Smartphone, Wifi, Tv, Search, Filter, ArrowUpDown, Star, TrendingUp, Award, CheckCircle, Users, Sparkles, Crown, ArrowRight, ArrowLeft, Building2 } from "lucide-react";
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

type CategoryType = 'electricity' | 'internet' | 'mobile' | 'tv';

const AllPlans = ({ savingsData = [], initialSelectedCategories = [] }: AllPlansProps) => {
  // Step-by-step navigation state
  const [currentStep, setCurrentStep] = useState<'category' | 'companies' | 'plans' | 'comparison'>('category');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);
  const [comparedPlans, setComparedPlans] = useState<ManualPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Analysis data from localStorage
  const [analysisData, setAnalysisData] = useState<any>(null);
  
  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAnalysisData(parsedData);
        
        // Auto-select category if we have single category analysis
        if (parsedData.selectedCategories && parsedData.selectedCategories.length === 1) {
          const category = parsedData.selectedCategories[0];
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'mobile',
            'electricity': 'electricity',
            'internet': 'internet',
            'tv': 'tv'
          };
          const mappedCategory = categoryMapping[category] || category as CategoryType;
          setSelectedCategory(mappedCategory);
          setCurrentStep('companies');
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, []);

  useEffect(() => {
    document.title = "כל המסלולים | חסכונט";
  }, []);

  // Generate savings data based on analysis
  const mockSavingsData = useMemo(() => {
    if (savingsData.length > 0) return savingsData;
    
    if (!analysisData || !analysisData.responses) return [];
    
    return analysisData.selectedCategories?.map((category: string) => {
      const categoryData = analysisData.responses[category];
      if (!categoryData) return null;

      const currentMonthly = parseInt(categoryData.monthlyAmount) || 180;
      const recommendedMonthly = Math.round(currentMonthly * 0.7);
      const monthlySavings = currentMonthly - recommendedMonthly;
      
      return {
        currentMonthly,
        recommendedMonthly,
        monthlySavings,
        annualSavings: monthlySavings * 12,
        currentProvider: categoryData.currentProvider || 'ספק נוכחי',
        recommendedProvider: 'מסלול מומלץ',
        category: category === 'cellular' ? 'סלולר' : 
                  category === 'electricity' ? 'חשמל' :
                  category === 'internet' ? 'אינטרנט' :
                  category === 'tv' ? 'טלוויזיה' : category
      };
    }).filter(Boolean) || [];
  }, [savingsData, analysisData]);

  // Get available companies for selected category
  const availableCompanies = useMemo(() => {
    if (!selectedCategory) return [];
    const categoryPlans = manualPlans.filter(plan => plan.category === selectedCategory);
    const companies = [...new Set(categoryPlans.map(plan => plan.company))].sort();
    return companies.map(company => ({
      name: company,
      plansCount: categoryPlans.filter(p => p.company === company).length,
      minPrice: Math.min(...categoryPlans.filter(p => p.company === company).map(p => p.regularPrice)),
      avgRating: (Math.random() * 1.5 + 3.5).toFixed(1)
    }));
  }, [selectedCategory]);

  // Get plans for selected company
  const companyPlans = useMemo(() => {
    if (!selectedCategory || !selectedCompany) return [];
    return manualPlans
      .filter(plan => plan.category === selectedCategory && plan.company === selectedCompany)
      .sort((a, b) => {
        if (a.category === 'electricity' || b.category === 'electricity') return 0;
        return parseInt(a.regularPrice.toString()) - parseInt(b.regularPrice.toString());
      });
  }, [selectedCategory, selectedCompany]);

  // Category configuration
  const categoryConfig = {
    electricity: { 
      label: 'מסלולי חשמל', 
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-yellow-500',
      description: 'חברות חשמל וספקי אנרגיה'
    },
    internet: { 
      label: 'מסלולי אינטרנט', 
      icon: <Wifi className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'ספקי אינטרנט וחבילות גלישה'
    },
    mobile: { 
      label: 'מסלולי סלולר', 
      icon: <Smartphone className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'חברות סלולר ומסלולי דקות וגלישה'
    },
    tv: { 
      label: 'מסלולי טלוויזיה', 
      icon: <Tv className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'חבילות טלוויזיה ושירותי סטרימינג'
    }
  };

  // Navigation handlers
  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);
    setSelectedCompany(null);
    setSelectedPlan(null);
    setCurrentStep('companies');
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setSelectedPlan(null);
    setCurrentStep('plans');
  };

  const handlePlanSelect = (plan: ManualPlan) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

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

  // Back navigation
  const handleBack = () => {
    if (currentStep === 'plans') {
      setSelectedCompany(null);
      setCurrentStep('companies');
    } else if (currentStep === 'companies') {
      setSelectedCategory(null);
      setCurrentStep('category');
    }
  };

  // Current plan data for comparison
  const getCurrentPlanData = () => {
    if (!analysisData || !selectedCategory) return null;
    
    const categoryKey = selectedCategory === 'mobile' ? 'cellular' : selectedCategory;
    const categoryData = analysisData.responses?.[categoryKey];
    
    if (!categoryData) return null;

    return {
      currentMonthly: parseInt(categoryData.monthlyAmount) || 0,
      currentProvider: categoryData.currentProvider || 'ספק נוכחי',
      category: selectedCategory
    };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5">
        {/* Hero Header with Glass Effect */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
          <div className="container mx-auto px-6 py-12 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-display font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent animate-shimmer-text bg-300%">
                מציאת המסלול המושלם עבורכם
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                תהליך מונחה ומותאם אישית למציאת המסלול הטוב ביותר עם חיסכון מקסימלי
              </p>
            </div>

            {/* Enhanced Progress Steps */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center transition-all duration-500 ${
                    currentStep === 'category' ? 'text-primary scale-110' : 
                    (currentStep === 'companies' || currentStep === 'plans') ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-500 ${
                      currentStep === 'category' ? 'bg-gradient-primary animate-pulse-glow' : 
                      (currentStep === 'companies' || currentStep === 'plans') ? 'bg-gradient-success' : 
                      'bg-muted'
                    }`}>
                      {currentStep === 'category' ? <Sparkles className="w-5 h-5" /> : 
                       (currentStep === 'companies' || currentStep === 'plans') ? <CheckCircle className="w-5 h-5" /> : '1'}
                    </div>
                    <span className="mr-3 font-semibold">בחירת קטגוריה</span>
                  </div>
                  
                  <div className={`h-2 flex-1 mx-4 rounded-full transition-all duration-700 ${
                    currentStep === 'companies' || currentStep === 'plans' ? 'bg-gradient-success' : 'bg-muted'
                  }`}></div>
                  
                  <div className={`flex items-center transition-all duration-500 ${
                    currentStep === 'companies' ? 'text-primary scale-110' : 
                    currentStep === 'plans' ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-500 ${
                      currentStep === 'companies' ? 'bg-gradient-primary animate-pulse-glow' : 
                      currentStep === 'plans' ? 'bg-gradient-success' : 
                      'bg-muted'
                    }`}>
                      {currentStep === 'companies' ? <Building2 className="w-5 h-5" /> :
                       currentStep === 'plans' ? <CheckCircle className="w-5 h-5" /> : '2'}
                    </div>
                    <span className="mr-3 font-semibold">בחירת חברה</span>
                  </div>
                  
                  <div className={`h-2 flex-1 mx-4 rounded-full transition-all duration-700 ${
                    currentStep === 'plans' ? 'bg-gradient-success' : 'bg-muted'
                  }`}></div>
                  
                  <div className={`flex items-center transition-all duration-500 ${
                    currentStep === 'plans' ? 'text-primary scale-110' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-500 ${
                      currentStep === 'plans' ? 'bg-gradient-primary animate-pulse-glow' : 'bg-muted'
                    }`}>
                      {currentStep === 'plans' ? <Crown className="w-5 h-5" /> : '3'}
                    </div>
                    <span className="mr-3 font-semibold">בחירת מסלול</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Savings Display */}
            {mockSavingsData.length > 0 && selectedCategory && (
              <div className="mb-12 animate-fade-in">
                {(() => {
                  const categoryKey = selectedCategory === 'mobile' ? 'סלולר' : 
                                   selectedCategory === 'electricity' ? 'חשמל' :
                                   selectedCategory === 'internet' ? 'אינטרנט' :
                                   selectedCategory === 'tv' ? 'טלוויזיה' : selectedCategory;
                  
                  const savingsForCategory = mockSavingsData.find(s => s.category === categoryKey);
                  
                  if (!savingsForCategory) return null;
                  
                  return (
                    <div className="max-w-4xl mx-auto">
                      <div className="glass-card rounded-3xl p-8 shadow-elegant">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center gap-3 mb-4">
                            <TrendingUp className="w-8 h-8 text-success animate-bounce-gentle" />
                            <h3 className="text-2xl font-bold text-foreground">
                              החיסכון הצפוי בקטגוריית {categoryKey}
                            </h3>
                          </div>
                          <p className="text-muted-foreground">השוואה מדויקת בין המצב הנוכחי למסלול המומלץ</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8 items-center">
                          {/* Current Payment */}
                          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                            <div className="text-sm font-medium text-muted-foreground mb-2">תשלום נוכחי</div>
                            <div className="text-3xl font-bold text-destructive mb-1">₪{savingsForCategory.currentMonthly.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">לחודש</div>
                            <div className="text-xs text-destructive/70 mt-1">₪{(savingsForCategory.currentMonthly * 12).toLocaleString()} לשנה</div>
                          </div>
                          
                          {/* Arrow with Animation */}
                          <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-gradient-primary text-white animate-pulse">
                              <ArrowRight className="w-6 h-6" />
                            </div>
                          </div>
                          
                          {/* New Payment */}
                          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
                            <div className="text-sm font-medium text-muted-foreground mb-2">תשלום חדש</div>
                            <div className="text-3xl font-bold text-success mb-1">₪{savingsForCategory.recommendedMonthly.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">לחודש</div>
                            <div className="text-xs text-success/70 mt-1">₪{(savingsForCategory.recommendedMonthly * 12).toLocaleString()} לשנה</div>
                          </div>
                        </div>
                        
                        {/* Savings Highlight */}
                        <div className="mt-8 text-center">
                          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-success via-success-glow to-success p-6 rounded-2xl text-white shadow-glow">
                            <Award className="w-10 h-10 animate-float" />
                            <div>
                              <div className="text-lg font-semibold mb-1">חיסכון כולל</div>
                              <div className="text-4xl font-bold">₪{savingsForCategory.monthlySavings.toLocaleString()}</div>
                              <div className="text-sm opacity-90">לחודש • ₪{savingsForCategory.annualSavings.toLocaleString()} לשנה</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Back Button with Style */}
            {currentStep !== 'category' && (
              <div className="mb-8">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex items-center gap-2 hover-scale glass-card border-primary/20 hover:border-primary/40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  חזרה
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-6 pb-16">
          {/* Step 1: Enhanced Category Selection */}
          {currentStep === 'category' && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                  באיזה תחום אתם מעוניינים לחסוך?
                </h2>
                <p className="text-muted-foreground text-lg">בחרו את הקטגוריה שמעניינת אתכם</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {(Object.keys(categoryConfig) as CategoryType[]).map((category) => {
                  const config = categoryConfig[category];
                  const categoryPlans = manualPlans.filter(p => p.category === category);
                  const companiesCount = [...new Set(categoryPlans.map(p => p.company))].length;
                  
                  return (
                    <div 
                      key={category}
                      className="group cursor-pointer hover-scale animate-scale-in"
                      onClick={() => handleCategorySelect(category)}
                      style={{ animationDelay: `${(Object.keys(categoryConfig).indexOf(category)) * 100}ms` }}
                    >
                      <div className="glass-card rounded-3xl p-8 text-center border-2 border-transparent hover:border-primary/30 transition-all duration-500 hover:shadow-elegant">
                        <div className="relative mb-6">
                          <div className={`w-20 h-20 bg-gradient-to-br ${
                            category === 'electricity' ? 'from-yellow-400 to-orange-500' :
                            category === 'internet' ? 'from-blue-400 to-cyan-500' :
                            category === 'mobile' ? 'from-purple-400 to-pink-500' :
                            'from-orange-400 to-red-500'
                          } rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}>
                            {config.icon}
                            <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {config.label}
                        </h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {config.description}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span>{companiesCount}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{categoryPlans.length}</span>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-primary-glow transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Enhanced Company Selection */}
          {currentStep === 'companies' && selectedCategory && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${
                    selectedCategory === 'electricity' ? 'from-yellow-400 to-orange-500' :
                    selectedCategory === 'internet' ? 'from-blue-400 to-cyan-500' :
                    selectedCategory === 'mobile' ? 'from-purple-400 to-pink-500' :
                    'from-orange-400 to-red-500'
                  } rounded-2xl flex items-center justify-center text-white shadow-lg animate-float`}>
                    {categoryConfig[selectedCategory].icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {categoryConfig[selectedCategory].label}
                    </h2>
                    <p className="text-muted-foreground">בחרו את החברה המועדפת עליכם</p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableCompanies.map((company, index) => (
                  <div 
                    key={company.name}
                    className="group cursor-pointer hover-scale animate-slide-up"
                    onClick={() => handleCompanySelect(company.name)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="glass-card rounded-2xl p-6 border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-elegant">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/50 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                          <span className="text-lg font-bold text-accent-foreground">
                            {company.name.slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {company.name}
                          </h3>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold text-foreground">{company.avgRating}</span>
                            </div>
                            <Badge className="bg-success/10 text-success border-success/20 text-xs font-medium">
                              מומלץ
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {company.plansCount} מסלולים זמינים למבחר
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1 font-medium">מחיר התחלתי</div>
                            <div className="text-lg font-bold text-foreground">
                              {selectedCategory !== 'electricity' ? `₪${company.minPrice}/חודש` : 'הנחה משתנה'}
                            </div>
                          </div>
                          <TrendingUp className="w-6 h-6 text-success animate-bounce-gentle" />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full btn-gradient hover:scale-105 transition-transform duration-200"
                        size="lg"
                      >
                        <span className="flex items-center gap-2">
                          צפה במסלולים
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Enhanced Plans Selection */}
          {currentStep === 'plans' && selectedCategory && selectedCompany && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center text-accent-foreground text-sm font-bold shadow-lg">
                    {selectedCompany.slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      מסלולי {selectedCompany}
                    </h2>
                    <p className="text-muted-foreground">{companyPlans.length} מסלולים זמינים • {categoryConfig[selectedCategory].label}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Plan Comparison with Current Data */}
              {(() => {
                const currentData = getCurrentPlanData();
                return currentData && (
                  <div className="mb-12">
                    <div className="glass-card rounded-2xl p-6 max-w-4xl mx-auto border border-primary/20">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                          <Award className="w-6 h-6 text-primary" />
                          השוואה למצב הנוכחי שלכם
                        </h3>
                        <div className="flex items-center justify-center gap-8">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">אתם משלמים כיום</div>
                            <div className="text-2xl font-bold text-destructive">₪{currentData.currentMonthly}</div>
                            <div className="text-xs text-muted-foreground">לחודש</div>
                          </div>
                          
                          {currentData.currentProvider && (
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">ספק נוכחי</div>
                              <div className="text-lg font-semibold text-foreground bg-accent/20 px-3 py-1 rounded-lg">
                                {currentData.currentProvider}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {companyPlans.map((plan, index) => {
                  const currentData = getCurrentPlanData();
                  const potentialSavings = currentData ? 
                    Math.max(0, currentData.currentMonthly - plan.regularPrice) : undefined;
                  
                  return (
                    <div 
                      key={plan.id} 
                      className="relative animate-scale-in hover-scale"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {index === 0 && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <div className="bg-gradient-to-r from-success to-success-glow text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            <Crown className="w-3 h-3 inline ml-1" />
                            הכי מומלץ
                          </div>
                        </div>
                      )}
                      
                      <div className="glass-card rounded-2xl p-6 h-full border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-elegant">
                        {/* Plan Header */}
                        <div className="text-center mb-8">
                          <h3 className="text-xl font-bold text-foreground mb-3">
                            {plan.planName}
                          </h3>
                          <div className="relative">
                            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                              ₪{plan.regularPrice}
                            </div>
                            <div className="text-sm text-muted-foreground">לחודש</div>
                          </div>
                        </div>

                        {/* Enhanced Savings Comparison */}
                        {potentialSavings !== undefined && (
                          <div className={`text-center mb-6 p-4 rounded-xl border transition-all duration-300 ${
                            potentialSavings > 0 ? 'bg-gradient-to-r from-success/10 to-success-glow/10 border-success/20' : 
                            potentialSavings === 0 ? 'bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20' :
                            'bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20'
                          }`}>
                            {potentialSavings > 0 ? (
                              <div className="flex items-center justify-center gap-2">
                                <TrendingUp className="w-5 h-5 text-success" />
                                <div>
                                  <div className="text-success font-bold text-lg">חיסכון של ₪{potentialSavings}</div>
                                  <div className="text-xs text-success/70">₪{potentialSavings * 12} לשנה</div>
                                </div>
                              </div>
                            ) : potentialSavings === 0 ? (
                              <div className="text-warning font-semibold">מחיר זהה למצב הנוכחי</div>
                            ) : (
                              <div className="text-destructive font-semibold">₪{Math.abs(potentialSavings)} יותר יקר</div>
                            )}
                          </div>
                        )}

                        {/* Features */}
                        <div className="space-y-3 mb-8">
                          {plan.features.slice(0, 4).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-3 text-sm">
                              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                              <span className="text-foreground">{feature}</span>
                            </div>
                          ))}
                          {plan.features.length > 4 && (
                            <div className="text-xs text-muted-foreground text-center py-2">
                              ועוד {plan.features.length - 4} תכונות נוספות...
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 mt-auto">
                          <Button
                            className="w-full btn-gradient hover:scale-105 transition-all duration-200"
                            size="lg"
                            onClick={() => handlePlanSelect(plan)}
                          >
                            <span className="flex items-center gap-2">
                              בחר מסלול זה
                              <Sparkles className="w-4 h-4" />
                            </span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40"
                            onClick={() => handleCompareToggle(plan)}
                            disabled={comparedPlans.length >= 3 && !comparedPlans.find(p => p.id === plan.id)}
                          >
                            {comparedPlans.find(p => p.id === plan.id) ? 'הסר מהשוואה' : 'הוסף להשוואה'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Comparison Panel */}
        {comparedPlans.length > 0 && (
          <PlanComparison
            comparedPlans={comparedPlans}
            onRemovePlan={handleRemoveFromComparison}
            onClearAll={handleClearComparison}
            onPlanSelect={handlePlanSelect}
          />
        )}

        {/* Plan Selection Form */}
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