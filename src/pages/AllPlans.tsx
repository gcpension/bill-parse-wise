import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Minus
} from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
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
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'features'>('price');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentUserPlan, setCurrentUserPlan] = useState({
    name: '',
    price: '',
    company: ''
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
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-800 font-heebo mb-4">
            כל המסלולים במקום אחד
          </h1>
          <p className="text-xl text-purple-600 font-assistant max-w-3xl mx-auto">
            השוואה חכמה ומפורטת בין כל המסלולים הזמינים בשוק
          </p>
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

        {/* Filters and Search */}
        {selectedCategory && (
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 font-assistant">חיפוש מסלול או חברה</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="חפשו מסלול או חברה..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 font-assistant"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 font-assistant">טווח מחירים (₪)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="מ-"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                    className="font-assistant"
                  />
                  <Input
                    type="number"
                    placeholder="עד"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                    className="font-assistant"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 font-assistant">מיון לפי</Label>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'price' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('price')}
                    className="font-assistant"
                  >
                    מחיר
                  </Button>
                  <Button
                    variant={sortBy === 'features' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('features')}
                    className="font-assistant"
                  >
                    תכונות
                  </Button>
                  <Button
                    variant={sortBy === 'rating' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('rating')}
                    className="font-assistant"
                  >
                    דירוג
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Bar */}
        {comparedPlans.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-800 font-heebo">השוואת מסלולים</h3>
                  <p className="text-sm text-purple-600 font-assistant">
                    {comparedPlans.length} מסלולים נבחרו להשוואה
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowComparison(!showComparison)}
                  className="font-assistant"
                >
                  {showComparison ? 'הסתר השוואה' : 'הצג השוואה'}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearComparison}
                  className="font-assistant"
                >
                  נקה הכל
                </Button>
              </div>
            </div>
            
            {/* Comparison Cards */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {comparedPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-lg border border-purple-200 px-3 py-2 flex items-center gap-2">
                  <span className="text-sm font-assistant">{plan.company} - {plan.planName}</span>
                  <button
                    onClick={() => setComparedPlans(prev => prev.filter(p => p.id !== plan.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
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