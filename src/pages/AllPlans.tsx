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
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAllPlans, PlanRecord } from "@/hooks/useAllPlans";

type CategoryType = 'חשמל' | 'אינטרנט' | 'סלולר' | 'טלוויזיה' | 'all';
type SortType = 'price-asc' | 'price-desc' | 'name';

const AllPlans = () => {
  const navigate = useNavigate();
  const allPlans = useAllPlans();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('price-asc');
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState<number>(0);

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
            
            <div className="flex items-center gap-2">
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

        {/* Plans List */}
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
        ) : (
          <div className="space-y-3">
            {filteredPlans.map((plan, index) => {
              const savings = currentMonthlyBill > 0 && plan.monthlyPrice! < currentMonthlyBill 
                ? currentMonthlyBill - plan.monthlyPrice! 
                : 0;
              const isRecommended = savings > 0;
              
              return (
                <Card 
                  key={`${plan.company}-${plan.plan}-${index}`}
                  className={cn(
                    "hover:shadow-lg transition-all duration-200",
                    isRecommended && "border-2 border-green-300 bg-green-50/30"
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Plan Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900 font-['Rubik']">
                                {plan.company}
                              </h3>
                              {isRecommended && (
                                <Badge className="bg-green-600 text-white font-['Rubik']">
                                  <Star className="w-3 h-3 ml-1" />
                                  מומלץ
                                </Badge>
                              )}
                              {index < 3 && selectedCategory !== 'all' && (
                                <Badge variant="outline" className="font-['Rubik']">
                                  #{index + 1} זול ביותר
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm font-['Rubik'] line-clamp-1">
                              {plan.plan}
                            </p>
                          </div>
                        </div>

                        {/* Benefits */}
                        {plan.transferBenefits && (
                          <p className="text-xs text-gray-500 font-['Rubik'] line-clamp-1 mt-2">
                            🎁 {plan.transferBenefits}
                          </p>
                        )}
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center gap-4 md:flex-shrink-0">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600 font-['Rubik']">
                            ₪{plan.monthlyPrice}
                          </div>
                          <div className="text-xs text-gray-500 font-['Rubik']">לחודש</div>
                          {isRecommended && (
                            <div className="text-sm font-semibold text-green-600 font-['Rubik'] mt-1">
                              חוסכים ₪{savings.toFixed(0)}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleSelectPlan(plan)}
                          className={cn(
                            "font-['Rubik'] whitespace-nowrap",
                            isRecommended 
                              ? "bg-green-600 hover:bg-green-700" 
                              : "bg-purple-600 hover:bg-purple-700"
                          )}
                        >
                          {isRecommended ? (
                            <>
                              <CheckCircle2 className="ml-2 h-4 w-4" />
                              עברו למסלול
                            </>
                          ) : (
                            'בחרו מסלול'
                          )}
                        </Button>
                      </div>
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
