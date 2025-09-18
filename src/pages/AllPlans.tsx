import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Smartphone, Wifi, Tv, ArrowRight, ArrowLeft, Building2, Users, Crown, Award, CheckCircle, TrendingUp, Sparkles, Star } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import PlanComparison from "@/components/plans/PlanComparison";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
import ProviderGrid from "@/components/providers/ProviderGrid";
import PlanGrid from "@/components/providers/PlanGrid";

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
      homeType: 'apartment' as const
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

          {/* Premium Interactive Savings Display */}
          {mockSavingsData.length > 0 && (currentStep === 'analysis-plans' || selectedCategory) && (
            <div className="mb-12 animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              {mockSavingsData.map((savingsData, index) => {
                if (currentStep !== 'analysis-plans' && selectedCategory) {
                  const categoryKey = selectedCategory === 'mobile' ? 'סלולר' : 
                                   selectedCategory === 'electricity' ? 'חשמל' :
                                   selectedCategory === 'internet' ? 'אינטרנט' :
                                   selectedCategory === 'tv' ? 'טלוויזיה' : selectedCategory;
                  
                  if (savingsData.category !== categoryKey) return null;
                }
                
                const savingsPercentage = ((savingsData.monthlySavings / savingsData.currentMonthly) * 100).toFixed(0);
                
                return (
                  <div key={index} className="max-w-5xl mx-auto">
                    {/* Compelling Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-800 font-heebo">
                            חיסכון של <span className="text-purple-600">{savingsPercentage}%</span> בקטגוריית {savingsData.category}
                          </h3>
                          <p className="text-lg text-gray-600 font-assistant">
                            חסכו <span className="font-bold text-purple-600">₪{savingsData.annualSavings.toLocaleString()}</span> בשנה עם מעבר חכם
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Interactive Comparison */}
                    <div className="relative">
                      {/* Background Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 rounded-3xl blur-xl opacity-60"></div>
                      
                      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
                        <div className="grid md:grid-cols-2 divide-x divide-purple-100">
                          
                          {/* Current Payment - Enhanced */}
                          <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-25 to-purple-25 group-hover:from-gray-75 group-hover:to-purple-50 transition-all duration-500"></div>
                            <div className="relative p-8 text-center">
                              {/* Status Badge */}
                              <div className="absolute top-4 left-4">
                                <div className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-assistant flex items-center gap-1">
                                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                  מצב נוכחי
                                </div>
                              </div>
                              
                              <div className="pt-4">
                                <div className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3 font-assistant">
                                  התשלום שלכם כרגע
                                </div>
                                <div className="relative">
                                  <div className="text-5xl font-bold text-gray-700 mb-2 font-heebo group-hover:scale-110 transition-transform duration-300">
                                    ₪{savingsData.currentMonthly}
                                  </div>
                                  <div className="text-lg text-gray-500 font-assistant mb-4">לחודש</div>
                                  
                                  {/* Annual Cost */}
                                  <div className="bg-gray-100 rounded-xl p-3 border border-gray-200">
                                    <div className="text-sm text-gray-600 font-assistant">עלות שנתית</div>
                                    <div className="text-xl font-semibold text-gray-700 font-heebo">
                                      ₪{(savingsData.currentMonthly * 12).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* New Payment - Enhanced */}
                          <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-purple-25 to-purple-50 group-hover:from-purple-75 group-hover:to-purple-100 transition-all duration-500"></div>
                            <div className="relative p-8 text-center">
                              {/* Status Badge */}
                              <div className="absolute top-4 left-4">
                                <div className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-assistant flex items-center gap-1 animate-pulse">
                                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                                  מסלול מומלץ
                                </div>
                              </div>
                              
                              <div className="pt-4">
                                <div className="text-sm uppercase tracking-wider text-purple-500 font-semibold mb-3 font-assistant">
                                  התשלום החדש שלכם
                                </div>
                                <div className="relative">
                                  <div className="text-5xl font-bold text-purple-600 mb-2 font-heebo group-hover:scale-110 transition-transform duration-300">
                                    ₪{savingsData.recommendedMonthly}
                                  </div>
                                  <div className="text-lg text-purple-500 font-assistant mb-4">לחודש</div>
                                  
                                  {/* Annual Cost with Savings */}
                                  <div className="bg-purple-100 rounded-xl p-3 border border-purple-200">
                                    <div className="text-sm text-purple-600 font-assistant">עלות שנתית</div>
                                    <div className="text-xl font-semibold text-purple-700 font-heebo">
                                      ₪{(savingsData.recommendedMonthly * 12).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Savings Showcase */}
                        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 p-6">
                          <div className="flex items-center justify-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                              <div className="flex items-center gap-6 text-white">
                                
                                {/* Monthly Savings */}
                                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                  <div className="text-3xl font-bold font-heebo mb-1">
                                    ₪{savingsData.monthlySavings}
                                  </div>
                                  <div className="text-sm opacity-90 font-assistant">חיסכון חודשי</div>
                                </div>

                                {/* Divider */}
                                <div className="w-px h-12 bg-white/30"></div>

                                {/* Percentage */}
                                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                  <div className="text-3xl font-bold font-heebo mb-1">
                                    {savingsPercentage}%
                                  </div>
                                  <div className="text-sm opacity-90 font-assistant">פחות תשלום</div>
                                </div>

                                {/* Divider */}
                                <div className="w-px h-12 bg-white/30"></div>

                                {/* Annual Savings */}
                                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                  <div className="text-2xl font-bold font-heebo mb-1">
                                    ₪{savingsData.annualSavings.toLocaleString()}
                                  </div>
                                  <div className="text-sm opacity-90 font-assistant">חיסכון שנתי</div>
                                </div>

                                {/* Interactive Arrow */}
                                <div className="ml-4">
                                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                                    <ArrowRight className="w-6 h-6" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Smart Call to Action */}
                    <div className="mt-8 text-center space-y-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="bg-purple-50 border border-purple-200 rounded-full px-6 py-3 hover:bg-purple-100 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-purple-700 font-assistant group-hover:font-semibold transition-all">
                              חיסכון יומי: ₪{Math.round(savingsData.monthlySavings / 30)}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-full px-6 py-3 hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-sm text-gray-600 font-assistant">
                            🚀 מעבר מהיר ללא עמלות
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 font-assistant">
                        * החיסכון מבוסס על השוואת מסלולים זמינים במועד הבדיקה
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Back Button */}
          {currentStep !== 'category' && (
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center gap-3 h-12 px-6 bg-white/60 backdrop-blur-sm border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 rounded-xl font-heebo font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                חזרה
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl pb-16 relative z-10">
        {/* Analysis Plans View */}
        {currentStep === 'analysis-plans' && analyzedCategories.length > 0 && (
          <div className="max-w-7xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heebo font-medium text-purple-800 mb-6">
                המסלולים המתאימים לכם
              </h2>
              <p className="text-xl text-purple-600 font-assistant max-w-2xl mx-auto">
                על פי הניתוח שלכם, אלו המסלולים הטובים ביותר בקטגוריות שבחרתם
              </p>
              
              {/* Explore Other Categories Button */}
              <div className="mt-8">
                <Button 
                  onClick={handleExploreOtherCategories}
                  variant="outline"
                  className="h-12 px-8 bg-white/60 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 rounded-xl font-heebo font-medium"
                >
                  <Sparkles className="w-5 h-5 ml-2" />
                  עיין בקטגוריות נוספות
                </Button>
              </div>
            </div>

            {/* Category Cards with Plans */}
            <div className="space-y-16">
              {analyzedCategories.map((category, categoryIndex) => {
                const config = categoryConfig[category];
                const categoryPlans = manualPlans
                  .filter(p => p.category === category)
                  .sort((a, b) => parseInt(a.regularPrice.toString()) - parseInt(b.regularPrice.toString()));
                const topPlans = categoryPlans.slice(0, 6); // Show top 6 plans per category

                return (
                  <div 
                    key={category}
                    className="animate-fade-in opacity-0"
                    style={{ animationDelay: `${1.2 + categoryIndex * 0.2}s`, animationFillMode: 'forwards' }}
                  >
                    {/* Category Header */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 mb-10 shadow-xl border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl ${
                            category === 'electricity' ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500' :
                            category === 'internet' ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500' :
                            category === 'mobile' ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500' :
                            'bg-gradient-to-br from-orange-400 via-red-500 to-red-600'
                          }`}>
                            {config.icon}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold text-purple-800 font-heebo mb-2">
                              {config.label}
                            </h3>
                            <p className="text-lg text-purple-600 font-assistant">
                              {topPlans.length} מסלולים מומלצים מתוך {categoryPlans.length} זמינים
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleCategorySelect(category)}
                          className="h-14 px-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-heebo font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Crown className="w-5 h-5 ml-2" />
                          צפה בכל המסלולים
                        </Button>
                      </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {topPlans.map((plan, planIndex) => {
                        const currentData = getCurrentPlanData();
                        const categoryKey = category === 'mobile' ? 'cellular' : category;
                        const categoryAnalysisData = analysisData?.responses?.[categoryKey];
                        const currentMonthly = categoryAnalysisData ? parseInt(categoryAnalysisData.monthlyAmount) || 0 : 0;
                        const potentialSavings = currentMonthly > 0 ? Math.max(0, currentMonthly - plan.regularPrice) : undefined;
                        
                        return (
                          <div 
                            key={plan.id} 
                            className="relative transition-all duration-500 animate-fade-in opacity-0 hover:scale-105 hover:-translate-y-2"
                            style={{ animationDelay: `${1.4 + categoryIndex * 0.2 + planIndex * 0.1}s`, animationFillMode: 'forwards' }}
                          >
                            {planIndex === 0 && (
                              <div className="absolute -top-4 -right-4 z-10">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl animate-pulse">
                                  <Crown className="w-4 h-4 inline ml-2" />
                                  הכי מומלץ
                                </div>
                              </div>
                            )}
                            
                            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl h-full border-2 border-gray-100 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl shadow-lg">
                              <CardContent className="p-8">
                                <div className="text-center mb-8">
                                  <h4 className="text-xl font-bold text-purple-800 mb-2 font-heebo">
                                    {plan.company}
                                  </h4>
                                  <h5 className="text-lg font-semibold text-gray-700 mb-4 font-assistant">
                                    {plan.planName}
                                  </h5>
                                  <div className="relative">
                                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 font-heebo">
                                      ₪{plan.regularPrice}
                                    </div>
                                    <div className="text-lg text-purple-600 font-assistant">לחודש</div>
                                  </div>
                                </div>

                                {/* Savings Comparison */}
                                {potentialSavings !== undefined && (
                                  <div className={`text-center mb-6 p-4 rounded-2xl border-2 transition-all duration-300 ${
                                    potentialSavings > 0 ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' : 
                                    potentialSavings === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' :
                                    'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                                  }`}>
                                    {potentialSavings > 0 ? (
                                      <div className="flex items-center justify-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        <div>
                                          <div className="text-green-700 font-bold text-lg font-heebo">₪{potentialSavings} חיסכון</div>
                                          <div className="text-xs text-green-600 font-assistant">₪{potentialSavings * 12} לשנה</div>
                                        </div>
                                      </div>
                                    ) : potentialSavings === 0 ? (
                                      <div className="text-yellow-700 font-bold text-sm font-heebo">מחיר זהה</div>
                                    ) : (
                                      <div className="text-red-700 font-bold text-sm font-heebo">₪{Math.abs(potentialSavings)} יותר יקר</div>
                                    )}
                                  </div>
                                )}

                                <div className="space-y-2 mb-6">
                                  {plan.features.slice(0, 3).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-gray-700 text-sm">
                                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                      <span className="font-assistant">{feature}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="space-y-3">
                                  <Button
                                    onClick={() => handlePlanSelect(plan)}
                                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-heebo font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                  >
                                    בחר מסלול זה
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    onClick={() => handleCompareToggle(plan)}
                                    disabled={comparedPlans.length >= 3 && !comparedPlans.find(p => p.id === plan.id)}
                                    className="w-full h-10 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl font-assistant transition-all duration-300"
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
                );
              })}
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
          <div className="max-w-7xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-xl shadow-lg font-heebo">
                  {selectedCompany.slice(0, 2)}
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold text-purple-800 font-heebo">
                    מסלולי {selectedCompany}
                  </h2>
                  <p className="text-xl text-purple-600 font-assistant">{companyPlans.length} מסלולים זמינים • {categoryConfig[selectedCategory].label}</p>
                </div>
              </div>
            </div>

            {/* Current Plan Comparison */}
            {(() => {
              const currentData = getCurrentPlanData();
              return currentData && (
                <div className="mb-16">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 max-w-5xl mx-auto border-2 border-purple-200 shadow-2xl">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-purple-800 mb-6 flex items-center justify-center gap-4 font-heebo">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        השוואה למצב הנוכחי שלכם
                      </h3>
                      <div className="flex items-center justify-center gap-12">
                        <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-200">
                          <div className="text-lg font-semibold text-red-600 mb-3 font-assistant">אתם משלמים כיום</div>
                          <div className="text-4xl font-bold text-red-700 font-heebo">₪{currentData.currentMonthly}</div>
                          <div className="text-sm text-red-600 font-assistant">לחודש</div>
                        </div>
                        
                        {currentData.currentProvider && (
                          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                            <div className="text-lg font-semibold text-gray-600 mb-3 font-assistant">ספק נוכחי</div>
                            <div className="text-2xl font-bold text-gray-800 bg-white px-4 py-2 rounded-xl shadow-sm font-heebo">
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
                    className="relative transition-all duration-500 animate-fade-in opacity-0 hover:scale-105 hover:-translate-y-2"
                    style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    {index === 0 && (
                      <div className="absolute -top-4 -right-4 z-10">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl animate-pulse">
                          <Crown className="w-4 h-4 inline ml-2" />
                          הכי מומלץ
                        </div>
                      </div>
                    )}
                    
                    <Card className="bg-white/90 backdrop-blur-sm rounded-3xl h-full border-2 border-gray-100 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl shadow-lg">
                      <CardContent className="p-8">
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-purple-800 mb-4 font-heebo">
                            {plan.planName}
                          </h3>
                          <div className="relative">
                            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 font-heebo">
                              ₪{plan.regularPrice}
                            </div>
                            <div className="text-lg text-purple-600 font-assistant">לחודש</div>
                          </div>
                        </div>

                        {/* Savings Comparison */}
                        {potentialSavings !== undefined && (
                          <div className={`text-center mb-8 p-6 rounded-2xl border-2 transition-all duration-300 ${
                            potentialSavings > 0 ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' : 
                            potentialSavings === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' :
                            'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                          }`}>
                            {potentialSavings > 0 ? (
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                                  <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <div className="text-green-700 font-bold text-2xl font-heebo">₪{potentialSavings} חיסכון</div>
                                  <div className="text-sm text-green-600 font-assistant">₪{potentialSavings * 12} לשנה</div>
                                </div>
                              </div>
                            ) : potentialSavings === 0 ? (
                              <div className="text-yellow-700 font-bold text-lg font-heebo">מחיר זהה למצב הנוכחי</div>
                            ) : (
                              <div className="text-red-700 font-bold text-lg font-heebo">₪{Math.abs(potentialSavings)} יותר יקר</div>
                            )}
                          </div>
                        )}

                        <div className="space-y-4 mb-8">
                          {plan.features.slice(0, 4).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-purple-700 font-assistant">{feature}</span>
                            </div>
                          ))}
                          {plan.features.length > 4 && (
                            <div className="text-sm text-purple-500 text-center py-3 bg-purple-50 rounded-xl font-assistant">
                              ועוד {plan.features.length - 4} תכונות נוספות...
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 mt-auto">
                          <div
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => handlePlanSelect(plan)}
                          >
                            <span className="flex items-center justify-center gap-3 text-lg font-bold font-heebo">
                              בחר מסלול זה
                              <Sparkles className="w-5 h-5" />
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full h-12 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-heebo font-semibold"
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