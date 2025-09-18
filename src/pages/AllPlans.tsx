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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-900">
              מציאת המסלול המושלם עבורכם
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              תהליך מונחה ומותאם אישית למציאת המסלול הטוב ביותר
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${currentStep === 'category' ? 'text-blue-600' : currentStep === 'companies' || currentStep === 'plans' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  currentStep === 'category' ? 'bg-blue-600' : 
                  currentStep === 'companies' || currentStep === 'plans' ? 'bg-green-600' : 
                  'bg-gray-300'
                }`}>
                  1
                </div>
                <span className="mr-2 font-medium">בחירת קטגוריה</span>
              </div>
              
              <div className={`w-16 h-1 ${currentStep === 'companies' || currentStep === 'plans' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center ${currentStep === 'companies' ? 'text-blue-600' : currentStep === 'plans' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  currentStep === 'companies' ? 'bg-blue-600' : 
                  currentStep === 'plans' ? 'bg-green-600' : 
                  'bg-gray-300'
                }`}>
                  2
                </div>
                <span className="mr-2 font-medium">בחירת חברה</span>
              </div>
              
              <div className={`w-16 h-1 ${currentStep === 'plans' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center ${currentStep === 'plans' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  currentStep === 'plans' ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  3
                </div>
                <span className="mr-2 font-medium">בחירת מסלול</span>
              </div>
            </div>
          </div>

          {/* Savings Display */}
          {mockSavingsData.length > 0 && selectedCategory && (
            <div className="mb-8">
              {(() => {
                const categoryKey = selectedCategory === 'mobile' ? 'סלולר' : 
                                 selectedCategory === 'electricity' ? 'חשמל' :
                                 selectedCategory === 'internet' ? 'אינטרנט' :
                                 selectedCategory === 'tv' ? 'טלוויזיה' : selectedCategory;
                
                const savingsForCategory = mockSavingsData.find(s => s.category === categoryKey);
                
                if (!savingsForCategory) return null;
                
                return (
                  <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          החיסכון הצפוי בקטגוריית {categoryKey}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">תשלום נוכחי</div>
                          <div className="text-xl font-bold text-red-600">₪{savingsForCategory.currentMonthly.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">לחודש</div>
                        </div>
                        
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">תשלום חדש</div>
                          <div className="text-xl font-bold text-green-600">₪{savingsForCategory.recommendedMonthly.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">לחודש</div>
                        </div>
                        
                        <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                          <div className="text-sm text-green-700 mb-1">חיסכון</div>
                          <div className="text-2xl font-bold text-green-700">₪{savingsForCategory.monthlySavings.toLocaleString()}</div>
                          <div className="text-xs text-green-600">₪{savingsForCategory.annualSavings.toLocaleString()} לשנה</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}

          {/* Back Button */}
          {currentStep !== 'category' && (
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                חזרה
              </Button>
            </div>
          )}

          {/* Step 1: Category Selection */}
          {currentStep === 'category' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  באיזה תחום אתם מעוניינים לחסוך?
                </h2>
                <p className="text-gray-600">בחרו את הקטגוריה שמעניינת אתכם</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(Object.keys(categoryConfig) as CategoryType[]).map((category) => {
                  const config = categoryConfig[category];
                  const categoryPlans = manualPlans.filter(p => p.category === category);
                  const companiesCount = [...new Set(categoryPlans.map(p => p.company))].length;
                  
                  return (
                    <Card 
                      key={category}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                          {config.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {config.label}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {config.description}
                        </p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{companiesCount} חברות</span>
                          <span>{categoryPlans.length} מסלולים</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Company Selection */}
          {currentStep === 'companies' && selectedCategory && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${categoryConfig[selectedCategory].color} rounded-xl flex items-center justify-center text-white`}>
                    {categoryConfig[selectedCategory].icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {categoryConfig[selectedCategory].label}
                  </h2>
                </div>
                <p className="text-gray-600">בחרו את החברה שמעניינת אתכם</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCompanies.map((company) => (
                  <Card 
                    key={company.name}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-blue-300 border"
                    onClick={() => handleCompanySelect(company.name)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-700">
                            {company.name.slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {company.name}
                          </h3>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{company.avgRating}</span>
                            </div>
                            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                              מומלץ
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {company.plansCount} מסלולים זמינים
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">מחיר התחלתי</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedCategory !== 'electricity' ? `₪${company.minPrice}/חודש` : 'הנחה משתנה'}
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          צפה במסלולים
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Plans Selection */}
          {currentStep === 'plans' && selectedCategory && selectedCompany && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${categoryConfig[selectedCategory].color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                    {selectedCompany.slice(0, 2)}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    מסלולי {selectedCompany} - {categoryConfig[selectedCategory].label}
                  </h2>
                </div>
                <p className="text-gray-600">{companyPlans.length} מסלולים זמינים</p>
              </div>

              {/* Plan Comparison with Current Data */}
              {(() => {
                const currentData = getCurrentPlanData();
                return currentData && (
                  <div className="mb-8">
                    <Card className="max-w-4xl mx-auto bg-blue-50 border border-blue-200">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-center mb-4">השוואה למצב הנוכחי שלכם</h3>
                        <div className="text-center text-gray-700">
                          אתם משלמים כיום: <span className="font-bold text-red-600">₪{currentData.currentMonthly}/חודש</span>
                          {currentData.currentProvider && (
                            <span className="block text-sm text-gray-600 mt-1">
                              ספק נוכחי: {currentData.currentProvider}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {companyPlans.map((plan, index) => {
                  const currentData = getCurrentPlanData();
                  const potentialSavings = currentData ? 
                    Math.max(0, currentData.currentMonthly - plan.regularPrice) : undefined;
                  
                  return (
                    <div key={plan.id} className="relative">
                      {index === 0 && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            <Crown className="w-3 h-3 inline mr-1" />
                            הכי מומלץ
                          </div>
                        </div>
                      )}
                      
                      <Card className="h-full hover:shadow-lg transition-all duration-300 relative">
                        <CardContent className="p-6">
                          {/* Plan Header */}
                          <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {plan.planName}
                            </h3>
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                              ₪{plan.regularPrice}
                            </div>
                            <div className="text-sm text-gray-500">לחודש</div>
                          </div>

                          {/* Savings Comparison */}
                          {potentialSavings !== undefined && (
                            <div className={`text-center mb-4 p-3 rounded-lg ${
                              potentialSavings > 0 ? 'bg-green-50 border border-green-200' : 
                              potentialSavings === 0 ? 'bg-yellow-50 border border-yellow-200' :
                              'bg-red-50 border border-red-200'
                            }`}>
                              {potentialSavings > 0 ? (
                                <>
                                  <div className="text-green-700 font-semibold">חיסכון של ₪{potentialSavings}</div>
                                  <div className="text-xs text-green-600">₪{potentialSavings * 12} לשנה</div>
                                </>
                              ) : potentialSavings === 0 ? (
                                <div className="text-yellow-700 font-semibold">מחיר זהה למצב הנוכחי</div>
                              ) : (
                                <div className="text-red-700 font-semibold">₪{Math.abs(potentialSavings)} יותר יקר</div>
                              )}
                            </div>
                          )}

                          {/* Features */}
                          <div className="space-y-2 mb-6">
                            {plan.features.slice(0, 4).map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                            {plan.features.length > 4 && (
                              <div className="text-xs text-gray-500 text-center">
                                ועוד {plan.features.length - 4} תכונות...
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="space-y-3">
                            <Button
                              className="w-full"
                              onClick={() => handlePlanSelect(plan)}
                            >
                              בחר מסלול זה
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleCompareToggle(plan)}
                              disabled={comparedPlans.length >= 3 && !comparedPlans.find(p => p.id === plan.id)}
                            >
                              {comparedPlans.find(p => p.id === plan.id) ? 'הסר מהשוואה' : 'הוסף להשוואה'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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