import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv,
  TrendingDown,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAllPlans, PlanRecord } from "@/hooks/useAllPlans";
import ServiceRequestWizard from "@/components/service-request/ServiceRequestWizard";

// Import company logos
import electraLogo from "@/assets/logos/electra-logo.png";
import electricityLogo from "@/assets/logos/electricity-logo.png";
import bezeqLogo from "@/assets/logos/bezeq-logo.png";
import hotLogo from "@/assets/logos/hot-logo.svg";
import partnerLogo from "@/assets/logos/partner-logo.png";
import cellcomLogo from "@/assets/logos/cellcom-logo.svg";
import pelephoneLogo from "@/assets/logos/pelephone-logo.png";
import logo019 from "@/assets/logos/019-logo.png";
import ramiLevyLogo from "@/assets/logos/rami-levy-logo.png";
import yesLogo from "@/assets/logos/yes-logo.png";
import netflixLogo from "@/assets/logos/netflix-logo.svg";
import disneyLogo from "@/assets/logos/disney-logo.png";
import hboLogo from "@/assets/logos/hbo-logo.png";

type CategoryType = 'חשמל' | 'אינטרנט' | 'סלולר' | 'טלוויזיה' | 'all';

const AllPlans = () => {
  const navigate = useNavigate();
  const allPlans = useAllPlans();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanRecord | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Load stored analysis data and user profile
  useEffect(() => {
    // Load analysis data
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const firstCategory = parsedData[0];
          setCurrentMonthlyBill(parseFloat(firstCategory.amount) || 0);
          
          // Map to Hebrew categories
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

    // Load user profile from personalized wizard
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
  }, []);

  // Categories configuration
  const categories = [
    { id: 'all' as CategoryType, label: 'הכל', icon: <TrendingDown className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'חשמל' as CategoryType, label: 'חשמל', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
    { id: 'אינטרנט' as CategoryType, label: 'אינטרנט', icon: <Wifi className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'סלולר' as CategoryType, label: 'סלולר', icon: <Smartphone className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
    { id: 'טלוויזיה' as CategoryType, label: 'טלוויזיה', icon: <Tv className="w-5 h-5" />, color: 'from-red-500 to-pink-500' },
  ];

  // Filter and categorize plans
  const { allCategoryPlans, recommendedPlans, cheapestPlans } = useMemo(() => {
    let filtered = allPlans;
    
    // Filter by category - map UI categories to data categories
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plan => {
        const service = plan.service;
        
        // Map categories
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
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(plan => 
        plan.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.plan.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by price (lowest first)
    const sortedByPrice = [...filtered]
      .filter(p => p.monthlyPrice && p.monthlyPrice > 0)
      .sort((a, b) => (a.monthlyPrice || 0) - (b.monthlyPrice || 0));

    // Get cheapest 3 plans
    const cheapest = sortedByPrice.slice(0, 3);

    // Get recommended plans (cheaper than current bill and match user profile)
    const recommended = currentMonthlyBill > 0
      ? sortedByPrice
          .filter(p => p.monthlyPrice! < currentMonthlyBill)
          .slice(0, 6) // Show top 6 recommendations
      : [];

    return {
      allCategoryPlans: sortedByPrice,
      recommendedPlans: recommended,
      cheapestPlans: cheapest
    };
  }, [allPlans, selectedCategory, searchQuery, currentMonthlyBill]);

  const handleSelectPlan = (plan: PlanRecord) => {
    // Store plan for service request
    localStorage.setItem('selectedPlanForSwitch', JSON.stringify({
      planName: plan.plan,
      company: plan.company,
      price: plan.monthlyPrice,
      category: plan.service,
      switchType: 'switch'
    }));
    setSelectedPlan(plan);
    setShowForm(true);
    
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPlan(null);
    localStorage.removeItem('selectedPlanForSwitch');
  };

  const handleFormComplete = () => {
    // After form completion, you can navigate or show success message
    setShowForm(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 font-['Rubik']">
      {/* Show Form if plan is selected */}
      {showForm && selectedPlan ? (
        <div className="min-h-screen">
          {/* Form Header with Close Button */}
          <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 max-w-7xl py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-['Rubik']">
                    מעבר למסלול: {selectedPlan.plan}
                  </h2>
                  <p className="text-gray-600 font-['Rubik']">
                    {selectedPlan.company} • ₪{selectedPlan.monthlyPrice}/חודש
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleCloseForm}
                  className="font-['Rubik']"
                >
                  <X className="ml-2 h-5 w-5" />
                  סגור
                </Button>
              </div>
            </div>
          </div>
          
          {/* Service Request Wizard */}
          <div className="container mx-auto px-4 max-w-5xl py-8">
            <ServiceRequestWizard onComplete={handleFormComplete} />
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 border-b">
            <div className="container mx-auto px-4 max-w-7xl">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mb-4 hover:bg-white/50 font-['Rubik']"
              >
                <ArrowLeft className="ml-2 h-4 w-4" />
                חזרה לדף הבית
              </Button>

          <div className="text-center space-y-3">
            <Badge className="mb-3 bg-gradient-to-r from-primary to-primary/80 text-white px-5 py-1.5 font-['Rubik']">
              השוואה חכמה
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-['Rubik']">
              מצאו את{" "}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-transparent bg-clip-text">
                המסלול המושלם
              </span>
              {" "}בשבילכם
            </h1>
            <p className="text-lg text-gray-600 font-['Rubik'] max-w-2xl mx-auto leading-relaxed">
              ספרו לנו כמה אתם משלמים היום ונמצא לכם מסלולים זולים יותר
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />
      </section>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden font-['Rubik']",
                  "flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105",
                  selectedCategory === category.id
                    ? "bg-white text-primary ring-2 ring-primary ring-offset-2"
                    : "bg-white text-gray-700 hover:text-primary"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity",
                  category.color
                )} />
                
                <div className={cn(
                  "relative z-10 p-1.5 rounded-lg bg-gradient-to-br transition-transform group-hover:scale-110",
                  selectedCategory === category.id ? category.color + " text-white" : "bg-gray-100 text-gray-600"
                )}>
                  {category.icon}
                </div>
                
                <span className="relative z-10 text-base">{category.label}</span>
                
                {selectedCategory === category.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current Bill Info - if available */}
        {currentMonthlyBill > 0 && selectedCategory !== 'all' && (
          <div className="mb-8 max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-primary/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-['Rubik']">אתם משלמים היום</p>
                    <p className="text-2xl font-bold text-primary font-['Rubik']">₪{currentMonthlyBill}</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-['Rubik']">
                  {recommendedPlans.length} מסלולים זולים יותר
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="חיפוש חברה או מסלול..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 py-6 rounded-xl border-2 focus:border-primary font-['Rubik'] text-base"
            />
          </div>
        </div>

        {/* Personalized Recommendations */}
        {recommendedPlans.length > 0 && selectedCategory !== 'all' && (
          <div className="mb-10">
            <div className="text-center mb-6">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 font-['Rubik'] mb-3">
                <Sparkles className="w-4 h-4 inline ml-1" />
                המלצות אישיות בשבילכם
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 font-['Rubik']">
                מצאנו לכם מסלולים שיחסכו לכם כסף!
              </h2>
              <p className="text-gray-600 mt-2 font-['Rubik']">
                המסלולים הבאים זולים יותר מהמחיר שאתם משלמים היום
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedPlans.map((plan, index) => {
                const savings = currentMonthlyBill - (plan.monthlyPrice || 0);
                const savingsPercent = ((savings / currentMonthlyBill) * 100).toFixed(0);
                const annualSavings = savings * 12;
                
                return (
                  <Card key={`rec-${plan.company}-${plan.plan}-${index}`} className="group hover:shadow-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 relative overflow-hidden">
                    {/* Recommended Badge */}
                    {index < 3 && (
                      <div className="absolute top-0 left-0 right-0">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-1 text-xs font-bold font-['Rubik']">
                          {index === 0 ? '⭐ החיסכון הגדול ביותר!' : index === 1 ? '🔥 מומלץ מאוד' : '✨ בחירה מעולה'}
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6 pt-10">
                      {/* Savings Badge */}
                      <div className="mb-4">
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-green-700 font-['Rubik']">חוסכים ₪{savings.toFixed(0)}</p>
                          <p className="text-sm text-green-600 font-['Rubik']">({savingsPercent}% פחות • ₪{annualSavings.toFixed(0)} בשנה)</p>
                        </div>
                      </div>

                      {/* Company & Plan Name */}
                      <h3 className="text-xl font-bold text-gray-900 mb-1 font-['Rubik']">{plan.company}</h3>
                      <p className="text-gray-600 mb-4 font-['Rubik'] line-clamp-2 text-sm">{plan.plan}</p>

                      {/* Price Comparison */}
                      <div className="mb-4 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-gray-500 font-['Rubik'] text-sm">מחיר חדש:</span>
                          <span className="text-2xl font-bold text-primary font-['Rubik']">₪{plan.monthlyPrice}</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-gray-400 font-['Rubik'] text-xs">מחיר נוכחי:</span>
                          <span className="text-sm text-gray-400 line-through font-['Rubik']">₪{currentMonthlyBill}</span>
                        </div>
                      </div>

                      {/* Benefits */}
                      {plan.transferBenefits && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-900 font-['Rubik'] line-clamp-2">🎁 {plan.transferBenefits}</p>
                        </div>
                      )}

                      {/* CTA */}
                      <Button
                        onClick={() => handleSelectPlan(plan)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-['Rubik']"
                      >
                        עוברים למסלול הזה
                        <CheckCircle className="mr-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Cheapest Plans Section */}
        {selectedCategory !== 'all' && cheapestPlans.length > 0 && (
          <div className="mb-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-['Rubik']">
                3 המסלולים הזולים ביותר ב{categories.find(c => c.id === selectedCategory)?.label}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cheapestPlans.map((plan, index) => (
                <Card key={`${plan.company}-${plan.plan}-${index}`} className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    {index === 0 && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-['Rubik'] mb-3">
                        ⭐ הכי זול!
                      </Badge>
                    )}
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1 font-['Rubik']">{plan.company}</h3>
                    <p className="text-gray-600 mb-3 font-['Rubik'] text-sm line-clamp-2">{plan.plan}</p>

                    <div className="mb-4">
                      <span className="text-2xl font-bold text-primary font-['Rubik']">₪{plan.monthlyPrice}</span>
                      <span className="text-gray-500 font-['Rubik'] text-sm">/חודש</span>
                    </div>

                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      variant="outline"
                      className="w-full font-['Rubik'] border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      בחרו במסלול
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {/* Empty State */}
        {selectedCategory === 'all' && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-purple-200/50 rounded-full flex items-center justify-center">
              <TrendingDown className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Rubik']">בחרו קטגוריה כדי להתחיל</h3>
            <p className="text-gray-600 font-['Rubik']">בחרו את התחום שאתם רוצים לחסוך בו ונציג לכם את כל המסלולים הזמינים</p>
          </div>
        )}

        {allCategoryPlans.length === 0 && selectedCategory !== 'all' && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Rubik']">לא נמצאו מסלולים</h3>
            <p className="text-gray-600 font-['Rubik']">נסה לשנות את החיפוש או בחר קטגוריה אחרת</p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
                className="mt-4 font-['Rubik']"
              >
                נקה חיפוש
              </Button>
            )}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default AllPlans;
