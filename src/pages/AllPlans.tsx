import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Smartphone, Wifi, Tv, ArrowRight, ArrowLeft, Building2, Users, Crown, Award, CheckCircle, TrendingUp, Sparkles, Star } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import PlanComparison from "@/components/plans/PlanComparison";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
import ProviderGrid from "@/components/providers/ProviderGrid";
import EnhancedPlanGrid from "@/components/providers/EnhancedPlanGrid";
import DetailedAIComparison from "@/components/plans/DetailedAIComparison";

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
  const [currentStep, setCurrentStep] = useState<'analysis-plans' | 'category' | 'companies' | 'plans'>('analysis-plans');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);
  const [comparedPlans, setComparedPlans] = useState<ManualPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analyzedCategories, setAnalyzedCategories] = useState<CategoryType[]>([]);
  
  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    console.log('Stored analysis data:', storedData);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Parsed analysis data:', parsedData);
        
        // If it's an array (new format from Home.tsx)
        if (Array.isArray(parsedData)) {
          setAnalysisData({ 
            selectedCategories: parsedData.map(item => item.category),
            responses: parsedData.reduce((acc, item) => {
              acc[item.category] = {
                currentProvider: item.provider,
                monthlyAmount: item.amount
              };
              return acc;
            }, {})
          });
          
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'mobile', 'electricity': 'electricity', 'internet': 'internet', 'tv': 'tv'
          };
          const mappedCategories = parsedData.map((item: any) => 
            categoryMapping[item.category] || item.category as CategoryType
          );
          console.log('Mapped categories from array:', mappedCategories);
          setAnalyzedCategories(mappedCategories);
          setCurrentStep('analysis-plans');
        }
        // If it's an object (old format)
        else if (parsedData.selectedCategories && parsedData.selectedCategories.length > 0) {
          setAnalysisData(parsedData);
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'mobile', 'electricity': 'electricity', 'internet': 'internet', 'tv': 'tv'
          };
          const mappedCategories = parsedData.selectedCategories.map((cat: string) => 
            categoryMapping[cat] || cat as CategoryType
          );
          console.log('Mapped categories from object:', mappedCategories);
          setAnalyzedCategories(mappedCategories);
          setCurrentStep('analysis-plans');
        } else {
          console.log('No selected categories found, going to category selection');
          setCurrentStep('category');
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
        setCurrentStep('category');
      }
    } else {
      console.log('No stored analysis data found');
      setCurrentStep('category');
    }
  }, []); // Remove dependency to prevent infinite loop

  useEffect(() => {
    document.title = "כל המסלולים | EasySwitch";
  }, []);

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
        currentMonthly, recommendedMonthly, monthlySavings,
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

  const companyPlans = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCompany) {
      return manualPlans
        .filter(plan => plan.category === selectedCategory && plan.company === selectedCompany)
        .sort((a, b) => parseInt(a.regularPrice.toString()) - parseInt(b.regularPrice.toString()));
    }
    // If no company selected, show all plans for the category for comparison
    return manualPlans
      .filter(plan => plan.category === selectedCategory)
      .sort((a, b) => parseInt(a.regularPrice.toString()) - parseInt(b.regularPrice.toString()));
  }, [selectedCategory, selectedCompany]);

  // Get all plans for analyzed categories
  const analysisPlans = useMemo(() => {
    if (analyzedCategories.length === 0) return [];
    return manualPlans
      .filter(plan => analyzedCategories.includes(plan.category as CategoryType))
      .sort((a, b) => parseInt(a.regularPrice.toString()) - parseInt(b.regularPrice.toString()));
  }, [analyzedCategories]);

  const categoryConfig = {
    electricity: { 
      label: 'מסלולי חשמל', 
      icon: <Zap className="w-8 h-8" />,
      description: 'חברות חשמל וספקי אנרגיה'
    },
    internet: { 
      label: 'מסלולי אינטרנט', 
      icon: <Wifi className="w-8 h-8" />,
      description: 'ספקי אינטרנט וחבילות גלישה'
    },
    mobile: { 
      label: 'מסלולי סלולר', 
      icon: <Smartphone className="w-8 h-8" />,
      description: 'חברות סלולר ומסלולי דקות וגלישה'
    },
    tv: { 
      label: 'מסלולי טלוויזיה', 
      icon: <Tv className="w-8 h-8" />,
      description: 'חבילות טלוויזיה ושירותי סטרימינג'
    }
  };

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

  const handleBack = () => {
    if (currentStep === 'plans') {
      setSelectedCompany(null);
      setCurrentStep('companies');
    } else if (currentStep === 'companies') {
      setSelectedCategory(null);
      setCurrentStep(analyzedCategories.length > 0 ? 'analysis-plans' : 'category');
    } else if (currentStep === 'category') {
      setCurrentStep('analysis-plans');
    }
  };

  // Get user context for intelligent recommendations
  const getUserContext = () => {
    if (!analysisData || !selectedCategory) return undefined;
    
    const categoryKey = selectedCategory === 'mobile' ? 'cellular' : selectedCategory;
    const categoryData = analysisData.responses?.[categoryKey];
    
    return {
      currentAmount: categoryData?.monthlyAmount ? parseInt(categoryData.monthlyAmount) : 200,
      currentProvider: categoryData?.currentProvider || 'ספק נוכחי',
      familySize: 3,
      budget: categoryData?.monthlyAmount ? parseInt(categoryData.monthlyAmount) * 0.8 : 160,
      usage: 'medium' as const,
      priorities: ['חיסכון', 'אמינות'],
      homeType: 'apartment' as const,
      category: categoryKey as 'electricity' | 'internet' | 'tv' | 'cellular'
    };
  };

  const handleExploreOtherCategories = () => {
    setCurrentStep('category');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
      {/* Navigation matching Home */}
      <nav className="bg-gray-50 border-b border-gray-200 py-4 relative z-50">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
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

      {/* Background elements matching Home */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Zap className="absolute top-[15%] left-[8%] w-8 h-8 text-purple-500 opacity-15 animate-pulse" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <Smartphone className="absolute top-[25%] right-[12%] w-8 h-8 text-purple-600 opacity-15 animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <Wifi className="absolute top-[45%] left-[15%] w-7 h-7 text-purple-500 opacity-15 animate-pulse" style={{ animationDelay: '4s', animationDuration: '8s' }} />
        <Tv className="absolute bottom-[35%] right-[7%] w-7 h-7 text-purple-500 opacity-15 animate-pulse" style={{ animationDelay: '6s', animationDuration: '8s' }} />
      </div>

      {/* Professional Hero Header */}
      <section className="bg-gray-50 py-16 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <p className="text-lg text-purple-600 mb-6 font-assistant animate-fade-in opacity-0" 
               style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              המשפחה הממוצעת חוסכת ₪2,400 בשנה
            </p>
            <h1 className="text-4xl lg:text-6xl font-heebo font-light text-purple-700 mb-6 leading-tight animate-fade-in opacity-0"
                style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              מציאת המסלול 
              <br />
              <span className="font-medium text-purple-800">המושלם עבורכם</span>
            </h1>
            <p className="text-xl text-purple-600 font-assistant max-w-3xl mx-auto animate-fade-in opacity-0"
               style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              תהליך מונחה ומותאם אישית למציאת המסלול הטוב ביותר עם חיסכון מקסימלי
            </p>
          </div>

          {/* Professional Progress Steps - Only show for guided flow */}
          {currentStep !== 'analysis-plans' && (
            <div className="max-w-5xl mx-auto mb-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center transition-all duration-500 ${
                    currentStep === 'category' ? 'text-purple-600 scale-105' : 
                    (currentStep === 'companies' || currentStep === 'plans') ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500 ${
                      currentStep === 'category' ? 'bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse shadow-purple-500/50' : 
                      (currentStep === 'companies' || currentStep === 'plans') ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'
                    }`}>
                      {currentStep === 'category' ? <Sparkles className="w-6 h-6" /> : 
                       (currentStep === 'companies' || currentStep === 'plans') ? <CheckCircle className="w-6 h-6" /> : '1'}
                    </div>
                    <span className="mr-4 font-semibold font-heebo text-lg">בחירת קטגוריה</span>
                  </div>
                  
                  <div className={`h-3 flex-1 mx-6 rounded-full transition-all duration-700 ${
                    currentStep === 'companies' || currentStep === 'plans' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'
                  }`}></div>
                  
                  <div className={`flex items-center transition-all duration-500 ${
                    currentStep === 'companies' ? 'text-purple-600 scale-105' : 
                    currentStep === 'plans' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500 ${
                      currentStep === 'companies' ? 'bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse shadow-purple-500/50' : 
                      currentStep === 'plans' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'
                    }`}>
                      {currentStep === 'companies' ? <Building2 className="w-6 h-6" /> :
                       currentStep === 'plans' ? <CheckCircle className="w-6 h-6" /> : '2'}
                    </div>
                    <span className="mr-4 font-semibold font-heebo text-lg">בחירת חברה</span>
                  </div>
                  
                  <div className={`h-3 flex-1 mx-6 rounded-full transition-all duration-700 ${
                    currentStep === 'plans' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'
                  }`}></div>
                  
                  <div className={`flex items-center transition-all duration-500 ${
                    currentStep === 'plans' ? 'text-purple-600 scale-105' : 'text-gray-400'
                  }`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500 ${
                      currentStep === 'plans' ? 'bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse shadow-purple-500/50' : 'bg-gray-300'
                    }`}>
                      {currentStep === 'plans' ? <Crown className="w-6 h-6" /> : '3'}
                    </div>
                    <span className="mr-4 font-semibold font-heebo text-lg">בחירת מסלול</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unified Savings Dashboard */}
          {mockSavingsData.length > 0 && (currentStep === 'analysis-plans' || selectedCategory) && (
            <div className="mb-12 animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              {(() => {
                // Calculate total savings if multiple categories
                const totalMonthlySavings = mockSavingsData.reduce((sum, data) => sum + data.monthlySavings, 0);
                const totalAnnualSavings = mockSavingsData.reduce((sum, data) => sum + data.annualSavings, 0);
                const totalCurrentMonthly = mockSavingsData.reduce((sum, data) => sum + data.currentMonthly, 0);
                const totalSavingsPercentage = Math.round((totalMonthlySavings / totalCurrentMonthly) * 100);
                
                return (
                  <div className="max-w-6xl mx-auto">
                    {/* Main Unified Savings Card */}
                    <div className={`bg-gradient-to-br from-white via-purple-50/30 to-white backdrop-blur-md rounded-3xl border border-purple-100/50 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-700 ${
                      mockSavingsData.length > 1 ? 'p-8' : 'p-12'
                    }`}>
                      
                      {/* Premium Header */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
                          <Star className="w-5 h-5" />
                          <span className="font-semibold font-heebo">ניתוח חיסכון מתקדם</span>
                        </div>
                        {mockSavingsData.length > 1 ? (
                          <h2 className="text-2xl font-bold text-purple-800 font-heebo">
                            חיסכון משולב בכל השירותים
                          </h2>
                        ) : (
                          <h2 className="text-3xl font-bold text-purple-800 font-heebo">
                            חיסכון חכם ב{mockSavingsData[0].category}
                          </h2>
                        )}
                      </div>

                      {/* Massive Savings Display */}
                      <div className="text-center mb-12">
                        <div className="bg-gradient-to-r from-purple-500/10 via-purple-600/5 to-purple-500/10 rounded-3xl p-8 border border-purple-200/30">
                          <div className="text-sm text-purple-600 font-assistant mb-3 tracking-widest uppercase">
                            החיסכון השנתי שלכם
                          </div>
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="text-8xl lg:text-9xl font-extralight text-purple-800 font-heebo leading-none">
                              {totalAnnualSavings.toLocaleString()}
                            </div>
                            <div className="text-4xl text-purple-600 font-heebo">₪</div>
                          </div>
                          
                          {/* Percentage and Monthly */}
                          <div className="flex items-center justify-center gap-8 text-2xl font-heebo">
                            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-2xl font-bold">
                              {totalSavingsPercentage}% חיסכון
                            </div>
                            <div className="text-purple-700">
                              ₪{totalMonthlySavings.toLocaleString()} לחודש
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Categories Breakdown */}
                      {mockSavingsData.length > 1 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-purple-800 font-heebo mb-6 text-center">
                            פירוט החיסכון לפי קטגוריה
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockSavingsData.map((data, index) => (
                              <div key={index} className="bg-white/60 rounded-2xl p-6 border border-purple-100/50">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-medium text-purple-800 font-heebo">{data.category}</span>
                                  <span className="text-sm text-purple-600 font-assistant">{data.currentProvider} → {data.recommendedProvider}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-2xl font-bold text-purple-700 font-heebo">
                                    ₪{data.annualSavings.toLocaleString()}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-purple-600">₪{data.monthlySavings}/חודש</div>
                                    <div className="text-xs text-green-600 font-bold">
                                      {Math.round((data.monthlySavings / data.currentMonthly) * 100)}% חיסכון
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Call to Action */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer group">
                          <Award className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-lg font-bold font-heebo">
                            {mockSavingsData.length > 1 ? 'בחר מסלולים והתחל לחסוך' : 'התחל לחסוך עוד היום'}
                          </span>
                          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl py-8 relative z-10">
        
        {/* Analysis Plans Display - Using EnhancedPlanGrid */}
        {currentStep === 'analysis-plans' && (
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            {/* Display analyzed plans by category using EnhancedPlanGrid */}
            <div className="space-y-12">
              {analyzedCategories.map(category => {
                const categoryPlans = analysisPlans.filter(plan => plan.category === category);
                if (categoryPlans.length === 0) return null;

                return (
                  <div key={category} className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 border border-purple-100/50 shadow-lg">
                    <EnhancedPlanGrid
                      plans={categoryPlans}
                      category={category}
                      userContext={getUserContext()}
                      onBack={handleExploreOtherCategories}
                      onPlanSelect={handlePlanSelect}
                      onCompareToggle={handleCompareToggle}
                      comparedPlans={comparedPlans}
                      showAllCompanies={true}
                    />
                  </div>
                );
              })}
            </div>

            {/* Enhanced Comparison Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-100/50 shadow-lg mt-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold font-heebo">השוואה מתקדמת מרכזית</span>
                </div>
                <h3 className="text-2xl font-bold text-purple-800 font-heebo mb-3">
                  השווה מסלולים מכל הקטגוריות במקום אחד
                </h3>
                <p className="text-purple-600 font-assistant max-w-2xl mx-auto">
                  השוואה חכמה הכוללת את המסלול הקיים שלכם + עד 3 מסלולים חדשים עם ניתוח חיסכון מפורט
                </p>
              </div>

              {comparedPlans.length > 0 ? (
                <div className="space-y-6">
                  <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-primary" />
                          <h4 className="text-xl font-bold text-primary font-heebo">
                            השוואה מפורטת ({comparedPlans.length}/3 מסלולים)
                          </h4>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleClearComparison}
                          className="text-purple-700 border-purple-200 hover:bg-purple-50 font-assistant"
                        >
                          נקה הכל
                        </Button>
                      </div>

                      {/* Detailed Comparison with Current Plan Integration */}
                      <DetailedAIComparison 
                        plans={comparedPlans}
                        userContext={getUserContext()}
                        category={selectedCategory || 'electricity'}
                      />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-12 border border-gray-200 text-center">
                  <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4 opacity-50" />
                  <h4 className="text-lg font-semibold text-purple-800 font-heebo mb-2">
                    התחל השוואה חכמה
                  </h4>
                  <p className="text-purple-600 font-assistant">
                    בחר מסלולים מהרשימות למעלה כדי לקבל השוואה מפורטת כולל המסלול הקיים שלך
                  </p>
                </div>
              )}
            </div>

            {/* Explore Other Categories */}
            <div className="text-center mt-12">
              <Button
                variant="outline"
                onClick={handleExploreOtherCategories}
                className="text-purple-700 border-purple-200 hover:bg-purple-50 font-assistant px-8 py-3"
              >
                חקור קטגוריות נוספות
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Category Selection */}
        {currentStep === 'category' && (
          <div className="max-w-7xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heebo font-medium text-purple-800 mb-6">
                באיזה תחום אתם מעוניינים לחסוך?
              </h2>
              <p className="text-xl text-purple-600 font-assistant max-w-2xl mx-auto">בחרו את הקטגוריה שמעניינת אתכם ונתחיל למצוא עבורכם את המסלול הטוב ביותר</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(Object.keys(categoryConfig) as CategoryType[]).map((category, index) => {
                const config = categoryConfig[category];
                const categoryPlans = manualPlans.filter(p => p.category === category);
                const companiesCount = [...new Set(categoryPlans.map(p => p.company))].length;
                
                return (
                  <div 
                    key={category}
                    className="group cursor-pointer transition-all duration-500 animate-fade-in opacity-0"
                    onClick={() => handleCategorySelect(category)}
                    style={{ animationDelay: `${1.2 + index * 0.15}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border-2 border-transparent hover:border-purple-300 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 shadow-lg">
                      <div className="relative mb-8">
                        <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                          category === 'electricity' ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500' :
                          category === 'internet' ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500' :
                          category === 'mobile' ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500' :
                          'bg-gradient-to-br from-orange-400 via-red-500 to-red-600'
                        }`}>
                          {config.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-purple-800 mb-4 font-heebo group-hover:text-purple-600 transition-colors">
                        {config.label}
                      </h3>
                      <p className="text-purple-600 mb-6 leading-relaxed font-assistant">
                        {config.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm mb-6">
                        <div className="flex items-center gap-2 text-purple-500 bg-purple-50 px-4 py-2 rounded-full">
                          <Building2 className="w-4 h-4" />
                          <span className="font-semibold">{companiesCount} חברות</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-500 bg-purple-50 px-4 py-2 rounded-full">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold">{categoryPlans.length} מסלולים</span>
                        </div>
                      </div>
                      
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Company Selection */}
        {currentStep === 'companies' && selectedCategory && (
          <div className="max-w-7xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float ${
                  selectedCategory === 'electricity' ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500' :
                  selectedCategory === 'internet' ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500' :
                  selectedCategory === 'mobile' ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500' :
                  'bg-gradient-to-br from-orange-400 via-red-500 to-red-600'
                }`}>
                  {categoryConfig[selectedCategory].icon}
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold text-purple-800 font-heebo">
                    {categoryConfig[selectedCategory].label}
                  </h2>
                  <p className="text-xl text-purple-600 font-assistant">בחרו את החברה המועדפת עליכם</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {availableCompanies.map((company, index) => (
                <Card 
                  key={company.name}
                  className="group cursor-pointer transition-all duration-500 animate-fade-in opacity-0 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-purple-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 shadow-lg"
                  onClick={() => handleCompanySelect(company.name)}
                  style={{ animationDelay: `${0.5 + index * 0.15}s`, animationFillMode: 'forwards' }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <span className="text-2xl font-bold text-purple-700 font-heebo">
                          {company.name.slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-purple-800 mb-3 font-heebo group-hover:text-purple-600 transition-colors">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="text-lg font-bold text-purple-700 font-heebo">{company.avgRating}</span>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border border-green-200 font-semibold font-assistant">
                            מומלץ
                          </Badge>
                        </div>
                        <p className="text-purple-600 font-assistant text-lg">
                          {company.plansCount} מסלולים זמינים למבחר
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-purple-600 mb-2 font-semibold font-assistant">מחיר התחלתי</div>
                          <div className="text-2xl font-bold text-purple-800 font-heebo">
                            {selectedCategory !== 'electricity' ? `₪${company.minPrice}/חודש` : 'הנחה משתנה'}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-6 h-6 text-white animate-bounce-gentle" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="flex items-center justify-center gap-3 text-lg font-bold font-heebo">
                        צפה במסלולים
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Plans Selection */}
        {currentStep === 'plans' && selectedCategory && selectedCompany && (
          <EnhancedPlanGrid
            plans={companyPlans}
            category={selectedCategory}
            company={selectedCompany}
            userContext={getUserContext()}
            onBack={handleBack}
            onPlanSelect={handlePlanSelect}
            onCompareToggle={handleCompareToggle}
            comparedPlans={comparedPlans}
            showAllCompanies={false}
          />
        )}
      </div>

      {/* Comparison Panel */}
      {comparedPlans.length > 0 && (
        <PlanComparison 
          comparedPlans={comparedPlans}
          onRemovePlan={handleRemoveFromComparison}
          onClearAll={handleClearComparison}
          onPlanSelect={handlePlanSelect}
          userContext={getUserContext()}
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
  );
};

export default AllPlans;