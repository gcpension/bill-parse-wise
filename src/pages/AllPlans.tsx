import { useEffect, useState, useMemo } from "react";
import electricityLogo from "@/assets/logos/electricity-logo.png";
import electraLogo from "@/assets/logos/electra-logo.png";
import bezeqLogo from "@/assets/logos/bezeq-logo.png";
import hotLogo from "@/assets/logos/hot-logo.svg";
import cellcomLogo from "@/assets/logos/cellcom-logo.svg";
import partnerLogo from "@/assets/logos/partner-logo.png";
import pelephoneLogo from "@/assets/logos/pelephone-logo.png";
import logo019 from "@/assets/logos/019-logo.png";
import ramiLevyLogo from "@/assets/logos/rami-levy-logo.png";
import yesLogo from "@/assets/logos/yes-logo.png";
import netflixLogo from "@/assets/logos/netflix-logo.svg";
import disneyLogo from "@/assets/logos/disney-logo.png";
import hboLogo from "@/assets/logos/hbo-logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Zap, Smartphone, Wifi, Tv, ArrowLeft, Building2, Crown, Award, CheckCircle, TrendingUp, Sparkles, Star, BarChart3, Filter, Search, Calculator, Brain, Target, Eye, X, Plus, Minus, Settings2, RefreshCw, User } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
import DetailedAIComparison from "@/components/plans/DetailedAIComparison";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RecommendationContext } from "@/lib/recommendationEngine";
import { cn } from "@/lib/utils";
import { SavingsComparisonBanner } from "@/components/plans/SavingsComparisonBanner";
import { useSavingsData } from "@/hooks/useSavingsData";
import { usePageMeta } from "@/hooks/usePageMeta";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { ComparisonAnalyzer } from "@/lib/comparisonAnalyzer";
import { PersonalizedRecommendationWizard } from "@/components/PersonalizedRecommendationWizard";
import { PersonalizedRecommendationEngine, UserProfile } from "@/lib/personalizedRecommendations";
import { PersonalizedRecommendationBanner } from "@/components/PersonalizedRecommendationBanner";
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
const AllPlans = ({
  savingsData = [],
  initialSelectedCategories = []
}: AllPlansProps) => {
  const {
    savingsData: persistedSavings
  } = useSavingsData();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<ManualPlan[]>([]);
  const [comparedPlans, setComparedPlans] = useState<ManualPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showPersonalizedWizard, setShowPersonalizedWizard] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<any[]>([]);
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
            'cellular': 'mobile',
            'electricity': 'electricity',
            'internet': 'internet',
            'tv': 'tv'
          };
          setSelectedCategory(categoryMapping[firstCategory] || firstCategory as CategoryType);
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, []);

  // Set page meta
  usePageMeta({
    title: 'כל המסלולים | EasySwitch',
    description: 'מרכז המסלולים החכם - השוואה מבוססת AI, המלצות מותאמות אישית וכל המסלולים הטובים ביותר במקום אחד.'
  });
  useEffect(() => {
    document.title = "כל המסלולים | EasySwitch";
  }, []);

  // Get filtered plans grouped by company  
  const {
    filteredPlans,
    groupedByCompany
  } = useMemo(() => {
    if (!selectedCategory) return {
      filteredPlans: [],
      groupedByCompany: {}
    };
    
    let filtered = manualPlans.filter(plan => {
      return plan.category === selectedCategory;
    });

    // Sort plans by price
    filtered.sort((a, b) => a.regularPrice - b.regularPrice);

    // Group by company
    const grouped = filtered.reduce((acc, plan) => {
      if (!acc[plan.company]) {
        acc[plan.company] = [];
      }
      acc[plan.company].push(plan);
      return acc;
    }, {} as Record<string, ManualPlan[]>);
    
    return {
      filteredPlans: filtered,
      groupedByCompany: grouped
    };
  }, [selectedCategory]);
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
  const cheapestPlan = filteredPlans.length > 0 ? filteredPlans.reduce((min, plan) => plan.regularPrice < min.regularPrice ? plan : min) : null;
  const handleCompareToggle = (plan: ManualPlan) => {
    if (isInComparison(plan.id)) {
      setComparedPlans(prev => prev.filter(p => p.id !== plan.id));
    } else if (canAddToComparison) {
      setComparedPlans(prev => [...prev, plan]);
    }
  };
  const handlePlanSelect = (plan: ManualPlan) => {
    // Store selected plan data for service request
    localStorage.setItem('selectedPlanForSwitch', JSON.stringify({
      planName: plan.planName,
      company: plan.company,
      price: plan.regularPrice,
      category: plan.category,
      features: plan.features
    }));

    // Navigate to service request page
    window.location.href = '/service-request';
  };
  const clearComparison = () => setComparedPlans([]);


  const handlePersonalizedRecommendation = (userProfile: UserProfile) => {
    const plansToAnalyze = comparedPlans.length >= 2 ? comparedPlans : filteredPlans.slice(0, 5);
    const recommendations = PersonalizedRecommendationEngine.generatePersonalizedRecommendations(
      plansToAnalyze,
      userProfile,
      selectedCategory as string
    );
    
    setPersonalizedRecommendations(recommendations);
    setShowPersonalizedWizard(false);
    
    // Show recommendations in alert with detailed results
    setTimeout(() => {
      if (recommendations.length > 0) {
        const topRecommendation = recommendations[0];
        const recommendedPlan = plansToAnalyze.find(p => p.id === topRecommendation.planId);
        
        if (recommendedPlan) {
          alert(`🎯 המלצה אישית מותאמת:

📈 המסלול הטוב ביותר עבורכם: ${recommendedPlan.planName} - ${recommendedPlan.company}
💰 מחיר: ₪${recommendedPlan.regularPrice} לחודש
⭐ ציון התאמה: ${Math.round(topRecommendation.matchScore * 100)}%

🔍 סיבות להמלצה:
${topRecommendation.reasonsForRecommendation.slice(0, 3).map(reason => `• ${reason}`).join('\n')}

💡 חיסכון צפוי: ₪${topRecommendation.expectedSavings.monthly} לחודש
📊 רמת ביטחון: ${Math.round(topRecommendation.confidenceLevel * 100)}%

מעוניינים להמשיך עם המסלול הזה?`);
        }
      }
    }, 500);
  };

  // Convert saved data to banner format
  const bannerSavingsData = persistedSavings.map(saving => ({
    currentMonthly: saving.currentAmount,
    recommendedMonthly: saving.recommendedAmount,
    monthlySavings: saving.monthlySavings,
    annualSavings: saving.annualSavings,
    currentProvider: saving.currentProvider,
    recommendedProvider: saving.recommendedProvider,
    category: saving.category
  }));
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
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
              <a href="/service-request" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">בקשת שירות</a>
              <a href="/magazine" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">מגזין</a>
              <a href="/tips" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">טיפים</a>
              <a href="/about" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">אודות</a>
              <a href="/contact" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">צור קשר</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 lg:px-6 max-w-7xl py-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />
        
        {/* Enhanced Page Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-green-600/10 rounded-3xl blur-3xl -z-10"></div>
          
        </div>


        {/* Category Selection - Icons Only */}
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

        {/* Company Logos by Category */}
        {selectedCategory && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-700 font-heebo mb-4 text-center">
              החברות הזמינות
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {selectedCategory === 'electricity' && (
                <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/electra-logo.png" alt="אלקטרה" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/electricity-logo.png" alt="חברת החשמל" className="w-full h-12 object-contain" />
                  </div>
                </>
              )}
              
              {selectedCategory === 'internet' && (
                <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/bezeq-logo.png" alt="בזק" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/hot-logo.svg" alt="HOT" className="w-full h-12 object-contain" />
                  </div>
                </>
              )}
              
              {selectedCategory === 'mobile' && (
                <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/cellcom-logo.svg" alt="סלקום" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/partner-logo.png" alt="פרטנר" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/pelephone-logo.png" alt="פלאפון" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/019-logo.png" alt="019" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/rami-levy-logo.png" alt="רמי לוי" className="w-full h-12 object-contain" />
                  </div>
                </>
              )}
              
              {selectedCategory === 'tv' && (
                <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/yes-logo.png" alt="YES" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/hot-logo.svg" alt="HOT" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/netflix-logo.svg" alt="Netflix" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/disney-logo.png" alt="Disney" className="w-full h-12 object-contain" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <img src="/src/assets/logos/hbo-logo.png" alt="HBO" className="w-full h-12 object-contain" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}


        {/* Enhanced Comparison Bar */}
        {comparedPlans.length > 0 && <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-xl animate-fade-in">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-800 font-heebo mb-1">
                      השוואת מסלולים מתקדמת
                    </h3>
                    <p className="text-blue-600 font-assistant text-lg">
                      {comparedPlans.length} מסלולים נבחרו • עד {3 - comparedPlans.length} נוספים ניתן להוסיף
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        <Brain className="w-4 h-4 ml-1" />
                        ניתוח AI
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <TrendingUp className="w-4 h-4 ml-1" />
                        חישוב חיסכון
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                        <Target className="w-4 h-4 ml-1" />
                        המלצות אישיות
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <DetailedAIComparison plans={comparedPlans} userContext={userContext} category={selectedCategory as 'electricity' | 'internet' | 'mobile' | 'tv'} />
                  <Button onClick={() => setShowComparison(!showComparison)} variant="outline" size="lg" className="font-assistant h-14 px-6">
                    <Eye className="w-5 h-5 ml-2" />
                    {showComparison ? 'הסתר טבלה' : 'הצג טבלה'}
                  </Button>
                  <Button variant="destructive" size="lg" onClick={clearComparison} className="font-assistant h-14 px-6">
                    <X className="w-5 h-5 ml-2" />
                    נקה הכל
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Comparison Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparedPlans.map((plan, index) => <Card key={plan.id} className="border-2 border-blue-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : index === 1 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary font-heebo">{plan.company}</h4>
                            <p className="text-sm text-muted-foreground font-assistant">{plan.planName}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setComparedPlans(prev => prev.filter(p => p.id !== plan.id))} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-primary font-heebo mb-1">
                          ₪{plan.regularPrice}
                        </div>
                        <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-assistant">תכונות:</span>
                          <span className="font-semibold">{plan.features?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-assistant">קטגוריה:</span>
                          <Badge variant="outline" className="text-xs">
                            {categoryConfig[plan.category as CategoryType]?.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground font-assistant">
                        {plan.features?.slice(0, 2).join(' • ')}
                        {(plan.features?.length || 0) > 2 && ` +${(plan.features?.length || 0) - 2} נוספות`}
                      </div>
                    </CardContent>
                  </Card>)}
                
                {/* Add More Plans Prompt */}
                {comparedPlans.length < 3 && <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-blue-800 font-heebo mb-2">
                        הוסיפו מסלול נוסף
                      </h4>
                      <p className="text-blue-600 font-assistant text-sm">
                        לחצו על כפתור ה + ליד המסלולים למטה כדי להוסיף עד {3 - comparedPlans.length} מסלולים נוספים
                      </p>
                    </CardContent>
                  </Card>}
              </div>
            </CardContent>
          </Card>}

        {/* Enhanced Call to Action for Comparison */}
        {comparedPlans.length === 0 && selectedCategory && <Card className="mb-8 bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 border-2 border-purple-200 shadow-lg">
            
          </Card>}

        {/* Detailed Comparison */}
        {showComparison && comparedPlans.length > 0 && <Card className="mb-8 border-2 border-purple-200">
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
                  <Input placeholder="שם המסלול" value={currentUserPlan.name} onChange={e => setCurrentUserPlan(prev => ({
                ...prev,
                name: e.target.value
              }))} className="font-assistant" />
                  <Input placeholder="מחיר חודשי (₪)" value={currentUserPlan.price} onChange={e => setCurrentUserPlan(prev => ({
                ...prev,
                price: e.target.value
              }))} className="font-assistant" />
                  <Input placeholder="שם החברה" value={currentUserPlan.company} onChange={e => setCurrentUserPlan(prev => ({
                ...prev,
                company: e.target.value
              }))} className="font-assistant" />
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-right font-heebo font-semibold">פרט</th>
                      {currentUserPlan.name && <th className="p-4 text-center font-heebo font-semibold text-yellow-700 bg-yellow-50">
                          {currentUserPlan.name}
                          <div className="text-xs text-yellow-600">(נוכחי)</div>
                        </th>}
                      {comparedPlans.map(plan => <th key={plan.id} className="p-4 text-center font-heebo font-semibold">
                          {plan.planName}
                          <div className="text-xs text-muted-foreground">{plan.company}</div>
                        </th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-4 font-semibold font-assistant">מחיר חודשי</td>
                      {currentUserPlan.name && <td className="p-4 text-center font-bold text-yellow-700 bg-yellow-50">
                          ₪{currentUserPlan.price}
                        </td>}
                      {comparedPlans.map(plan => <td key={plan.id} className="p-4 text-center font-bold text-purple-600">
                          ₪{plan.regularPrice}
                        </td>)}
                    </tr>
                    {currentUserPlan.price && <tr className="border-t bg-green-50">
                        <td className="p-4 font-semibold font-assistant">חיסכון חודשי</td>
                        <td className="p-4 text-center text-yellow-700 bg-yellow-50">-</td>
                        {comparedPlans.map(plan => {
                    const savings = parseInt(currentUserPlan.price) - plan.regularPrice;
                    return <td key={plan.id} className={`p-4 text-center font-bold ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {savings > 0 ? `+₪${savings}` : `₪${Math.abs(savings)}-`}
                            </td>;
                  })}
                      </tr>}
                    <tr className="border-t">
                      <td className="p-4 font-semibold font-assistant">תכונות</td>
                      {currentUserPlan.name && <td className="p-4 text-center text-yellow-700 bg-yellow-50">-</td>}
                      {comparedPlans.map(plan => <td key={plan.id} className="p-4 text-center">
                          <Badge variant="outline" className="font-assistant">
                            {plan.features?.length || 0} תכונות
                          </Badge>
                        </td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>}

        {/* Plans Grid - Organized by Company */}
        {selectedCategory && Object.keys(groupedByCompany).length > 0 && <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 font-heebo">
                מסלולי {categoryConfig[selectedCategory].label}
              </h2>
              <Badge variant="secondary" className="text-lg px-4 py-2 font-assistant">
                {filteredPlans.length} מסלולים • {Object.keys(groupedByCompany).length} חברות
              </Badge>
            </div>

            {/* Company Sections */}
            <div className="space-y-12">
              {Object.entries(groupedByCompany).map(([companyName, companyPlans], companyIndex) => <div key={companyName} className="relative">
                  {/* Company Header */}
                  <div className="bg-gradient-to-r from-purple-100 via-blue-50 to-purple-100 rounded-2xl p-6 mb-6 border-2 border-purple-200/50 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-purple-800 font-heebo mb-1">
                            {companyName}
                          </h3>
                          <p className="text-purple-600 font-assistant text-lg">
                            {companyPlans.length} מסלולים זמינים • קטגוריית {categoryConfig[selectedCategory].label}
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-800 font-heebo">
                          מ-₪{Math.min(...companyPlans.map(p => p.regularPrice))}
                        </div>
                        <div className="text-purple-600 font-assistant">החל מ</div>
                      </div>
                    </div>
                  </div>

                  {/* Company Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                    {/* Company accent line */}
                    <div className="absolute -right-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 to-blue-300 rounded-full opacity-50 hidden lg:block"></div>
                    
                    {companyPlans.map((plan, index) => {
                const isCheapest = cheapestPlan && plan.id === cheapestPlan.id;
                const inComparison = isInComparison(plan.id);
                const isCompanyCheapest = plan.regularPrice === Math.min(...companyPlans.map(p => p.regularPrice));
                return <Card key={plan.id} className={cn("group transition-all duration-300 hover:shadow-xl border-2 relative", "animate-fade-in opacity-0 hover:scale-105", isCheapest && "ring-2 ring-green-400/50 bg-green-50/30", isCompanyCheapest && !isCheapest && "ring-2 ring-blue-400/50 bg-blue-50/30", inComparison && "ring-2 ring-purple-400/50 bg-purple-50/30", "hover:border-purple-300")} style={{
                  animationDelay: `${(companyIndex * 3 + index) * 0.1}s`,
                  animationFillMode: 'forwards'
                }}>
                          {/* Badges */}
                          <div className="absolute -top-3 -right-3 z-10 flex flex-col gap-1">
                            {isCheapest && <Badge className="bg-green-500 text-white px-3 py-1 shadow-lg">
                                <Crown className="w-4 h-4 ml-1" />
                                הזול ביותר
                              </Badge>}
                            {isCompanyCheapest && !isCheapest && <Badge className="bg-blue-500 text-white px-3 py-1 shadow-lg">
                                <Star className="w-4 h-4 ml-1" />
                                הזול ב{companyName}
                              </Badge>}
                          </div>

                          {/* Comparison Badge */}
                          {inComparison && <div className="absolute -top-3 -left-3 z-10">
                              <Badge className="bg-purple-500 text-white px-3 py-1 shadow-lg">
                                <Eye className="w-4 h-4 ml-1" />
                                בהשוואה
                              </Badge>
                            </div>}

                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-sm text-purple-600 font-assistant mb-1">
                                  {companyName}
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 font-heebo mb-1">
                                  {plan.planName}
                                </h4>
                                <p className="text-sm text-gray-500 font-assistant">
                                  מסלול #{index + 1} מתוך {companyPlans.length}
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
                            {/* Price Comparison within Company */}
                            {companyPlans.length > 1 && <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-xs text-gray-600 font-assistant text-center">
                                  {isCompanyCheapest ? <span className="text-blue-600 font-semibold">המחיר הטוב ביותר אצל {companyName}</span> : <span>
                                      ₪{plan.regularPrice - Math.min(...companyPlans.map(p => p.regularPrice))} יותר מהזול ביותר
                                    </span>}
                                </div>
                              </div>}

                            {/* Features Preview */}
                            {plan.features && plan.features.length > 0 && <div>
                                <h5 className="font-semibold text-gray-700 font-assistant mb-2">תכונות עיקריות:</h5>
                                <div className="space-y-1">
                                  {plan.features.slice(0, 3).map((feature, idx) => <div key={idx} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                      <span className="text-gray-600 font-assistant">{feature}</span>
                                    </div>)}
                                  {plan.features.length > 3 && <p className="text-sm text-purple-600 font-assistant">
                                      +{plan.features.length - 3} תכונות נוספות
                                    </p>}
                                </div>
                              </div>}

                            {/* Action Buttons with Enhanced UX */}
                            <div className="flex gap-2 pt-4">
                              <Button onClick={() => handlePlanSelect(plan)} className={cn("flex-1 font-assistant transition-all duration-300", isCompanyCheapest ? "bg-blue-600 hover:bg-blue-700 shadow-lg" : "")} variant={isCompanyCheapest ? "default" : "outline"}>
                                {isCompanyCheapest ? <>
                                    <Star className="w-4 h-4 ml-2" />
                                    בחר מסלול מומלץ
                                  </> : "בחר מסלול"}
                              </Button>
                              <Button variant={inComparison ? "default" : "outline"} onClick={() => handleCompareToggle(plan)} disabled={!canAddToComparison && !inComparison} className={cn("font-assistant transition-all duration-300", inComparison ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-purple-50 hover:border-purple-300")} title={inComparison ? "הסר מהשוואה" : "הוסף להשוואה"}>
                                {inComparison ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>;
              })}
                  </div>
                  
                  {/* Company Summary */}
                  <div className="mt-6 bg-white/50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center justify-between text-sm text-gray-600 font-assistant">
                      <span>סה"כ {companyPlans.length} מסלולים</span>
                      <span>טווח מחירים: ₪{Math.min(...companyPlans.map(p => p.regularPrice))} - ₪{Math.max(...companyPlans.map(p => p.regularPrice))}</span>
                      <span>חיסכון אפשרי: עד ₪{Math.max(...companyPlans.map(p => p.regularPrice)) - Math.min(...companyPlans.map(p => p.regularPrice))}</span>
                    </div>
                  </div>
                </div>)}
            </div>

            {filteredPlans.length === 0 && <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 font-heebo mb-2">
                  לא נמצאו מסלולים
                </h3>
                <p className="text-gray-500 font-assistant">
                  נסו לשנות את הפילטרים או את מילות החיפוש
                </p>
              </div>}
          </div>}

        {!selectedCategory && <div className="text-center py-12">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 font-heebo mb-2">
              בחרו קטגוריה להתחלה
            </h3>
            <p className="text-gray-600 font-assistant text-lg">
              בחרו את הקטגוריה המעניינת אתכם כדי לראות את כל המסלולים הזמינים
            </p>
          </div>}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800 font-heebo">
              בקשת החלפת ספק
            </DialogTitle>
          </DialogHeader>
          {selectedPlan && <EnhancedSwitchRequestForm selectedPlan={selectedPlan} isOpen={isFormOpen} onClose={() => {
          setIsFormOpen(false);
          setSelectedPlan(null);
        }} />}
        </DialogContent>
      </Dialog>

      {/* Enhanced Personalized Recommendation Banner */}
      {selectedCategory && (
        <PersonalizedRecommendationBanner onRecommendationClick={() => setShowPersonalizedWizard(true)} />
      )}


      {/* Personalized Recommendation Wizard */}
      {showPersonalizedWizard && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <PersonalizedRecommendationWizard
              category={selectedCategory as any}
              onComplete={handlePersonalizedRecommendation}
              onClose={() => setShowPersonalizedWizard(false)}
            />
          </div>
        </div>
      )}
    </div>;
};
export default AllPlans;