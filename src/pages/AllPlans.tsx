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
  TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAllPlans, PlanRecord } from "@/hooks/useAllPlans";

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
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState<string>('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Load stored analysis data
  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const firstCategory = parsedData[0];
          setCurrentMonthlyBill(firstCategory.amount || '');
          
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
  }, []);

  // Categories configuration
  const categories = [
    { id: 'all' as CategoryType, label: 'הכל', icon: <TrendingDown className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'חשמל' as CategoryType, label: 'חשמל', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
    { id: 'אינטרנט' as CategoryType, label: 'אינטרנט', icon: <Wifi className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'סלולר' as CategoryType, label: 'סלולר', icon: <Smartphone className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
    { id: 'טלוויזיה' as CategoryType, label: 'טלוויזיה', icon: <Tv className="w-5 h-5" />, color: 'from-red-500 to-pink-500' },
  ];

  // Filter and recommend plans
  const { filteredPlans, recommendedPlans, cheapestPlans } = useMemo(() => {
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

    // Get cheapest plans per category
    const cheapest = selectedCategory !== 'all' 
      ? filtered
          .filter(p => p.monthlyPrice && p.monthlyPrice > 0)
          .sort((a, b) => (a.monthlyPrice || 0) - (b.monthlyPrice || 0))
          .slice(0, 3)
      : [];

    // Get recommended plans based on user's current bill
    const currentBill = parseFloat(currentMonthlyBill) || 0;
    const recommended = currentBill > 0
      ? filtered
          .filter(p => p.monthlyPrice && p.monthlyPrice > 0 && p.monthlyPrice < currentBill)
          .sort((a, b) => (currentBill - (a.monthlyPrice || 0)) - (currentBill - (b.monthlyPrice || 0)))
          .slice(0, 3)
      : [];

    return {
      filteredPlans: filtered,
      recommendedPlans: recommended,
      cheapestPlans: cheapest
    };
  }, [allPlans, selectedCategory, searchQuery, currentMonthlyBill]);

  const handleAnalyze = () => {
    if (currentMonthlyBill && parseFloat(currentMonthlyBill) > 0) {
      setShowRecommendations(true);
    }
  };

  const handleSelectPlan = (plan: PlanRecord) => {
    // Store plan for service request
    localStorage.setItem('selectedPlanForSwitch', JSON.stringify({
      planName: plan.plan,
      company: plan.company,
      price: plan.monthlyPrice,
      category: plan.service,
      switchType: 'switch'
    }));
    navigate('/service-request');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 font-['Rubik']">
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
        {/* Quick Analysis Card */}
        <div className="mb-10 max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-['Rubik']">
                    נמצא לכם הצעות מנצחות
                  </h3>
                  <p className="text-gray-600 font-['Rubik']">ספרו לנו כמה אתם משלמים וראו מיד כמה תחסכו</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-['Rubik'] mb-2 block">בחרו קטגוריה</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.filter(c => c.id !== 'all').map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "p-3 rounded-lg font-semibold transition-all duration-300 font-['Rubik'] text-sm",
                          "flex items-center justify-center gap-2",
                          selectedCategory === category.id
                            ? "bg-gradient-to-r " + category.color + " text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {category.icon}
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-['Rubik'] mb-2 block">כמה אתם משלמים היום?</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="0"
                      value={currentMonthlyBill}
                      onChange={(e) => setCurrentMonthlyBill(e.target.value)}
                      className="text-2xl font-bold text-center font-['Rubik']"
                    />
                    <Button
                      onClick={handleAnalyze}
                      disabled={!currentMonthlyBill || !selectedCategory || selectedCategory === 'all'}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-['Rubik'] px-8"
                    >
                      מצאו לי!
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-['Rubik']">₪ לחודש</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Recommendations */}
        {showRecommendations && recommendedPlans.length > 0 && (
          <div className="mb-10">
            <div className="text-center mb-6">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 font-['Rubik']">
                <TrendingUp className="w-4 h-4 inline ml-1" />
                ההמלצות שלנו בשבילכם
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mt-3 font-['Rubik']">
                מצאנו לכם {recommendedPlans.length} מסלולים שיחסכו לכם כסף!
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedPlans.map((plan, index) => {
                const savings = parseFloat(currentMonthlyBill) - (plan.monthlyPrice || 0);
                const savingsPercent = ((savings / parseFloat(currentMonthlyBill)) * 100).toFixed(0);
                
                return (
                  <Card key={`${plan.company}-${plan.plan}-${index}`} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary">
                    <CardContent className="p-6">
                      {/* Savings Badge */}
                      <div className="mb-4">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-['Rubik']">
                          חיסכון של {savings.toFixed(0)}₪ ({savingsPercent}%)
                        </Badge>
                      </div>

                      {/* Company & Plan Name */}
                      <h3 className="text-xl font-bold text-gray-900 mb-1 font-['Rubik']">{plan.company}</h3>
                      <p className="text-gray-600 mb-4 font-['Rubik'] line-clamp-2">{plan.plan}</p>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-primary font-['Rubik']">₪{plan.monthlyPrice}</span>
                          <span className="text-gray-500 font-['Rubik']">לחודש</span>
                        </div>
                        <p className="text-sm text-gray-500 line-through font-['Rubik']">₪{currentMonthlyBill} לחודש כרגע</p>
                      </div>

                      {/* Benefits */}
                      {plan.transferBenefits && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-900 font-['Rubik']">🎁 {plan.transferBenefits}</p>
                        </div>
                      )}

                      {/* CTA */}
                      <Button
                        onClick={() => handleSelectPlan(plan)}
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-['Rubik']"
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


        {/* All Plans Grid - Fallback */}
        {!showRecommendations && selectedCategory !== 'all' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-['Rubik']">
                כל המסלולים ב{categories.find(c => c.id === selectedCategory)?.label}
              </h2>
              <p className="text-gray-600 font-['Rubik']">סה"כ {filteredPlans.length} מסלולים זמינים</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.slice(0, 12).map((plan, index) => (
                <Card key={`${plan.company}-${plan.plan}-${index}`} className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 font-['Rubik']">{plan.company}</h3>
                    <p className="text-gray-600 mb-3 font-['Rubik'] text-sm line-clamp-2">{plan.plan}</p>

                    {plan.monthlyPrice && plan.monthlyPrice > 0 && (
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-primary font-['Rubik']">₪{plan.monthlyPrice}</span>
                        <span className="text-gray-500 font-['Rubik'] text-sm">/חודש</span>
                      </div>
                    )}

                    {plan.commitment && (
                      <p className="text-xs text-gray-500 mb-3 font-['Rubik']">התחייבות: {plan.commitment}</p>
                    )}

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

            {filteredPlans.length > 12 && (
              <div className="text-center mt-8">
                <p className="text-gray-600 font-['Rubik']">
                  מוצגים 12 מתוך {filteredPlans.length} מסלולים
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!showRecommendations && selectedCategory === 'all' && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-purple-200/50 rounded-full flex items-center justify-center">
              <TrendingDown className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Rubik']">בחרו קטגוריה כדי להתחיל</h3>
            <p className="text-gray-600 font-['Rubik']">בחרו את התחום שאתם רוצים לחסוך בו ונמצא לכם מסלולים מתאימים</p>
          </div>
        )}

        {filteredPlans.length === 0 && selectedCategory !== 'all' && (
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
    </div>
  );
};

export default AllPlans;
