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
import heroModernBg from "@/assets/hero-modern-bg.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Zap, Smartphone, Wifi, Tv, ArrowLeft, Building2, Crown, Award, CheckCircle, TrendingUp, Sparkles, Star, BarChart3, Filter, Search, Calculator, Brain, Target, Eye, X, Plus, Minus, Settings2, RefreshCw, User, Package } from "lucide-react";
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
import { PersonalizedRecommendationEngine, UserProfile, PersonalizedRecommendation } from "@/lib/personalizedRecommendations";
import { PersonalizedRecommendationBanner } from "@/components/PersonalizedRecommendationBanner";
import { RecommendationResults } from "@/components/plans/RecommendationResults";
import { EnhancedNavigation } from "@/components/ui/enhanced-navigation";
import { FloatingHelpButton } from "@/components/ui/floating-help-button";
import { PlanCard } from "@/components/plans/PlanCard";
import { PlanFilters } from "@/components/plans/PlanFilters";
import { ComparisonPanel } from "@/components/plans/ComparisonPanel";
import { PersonalizedRecommendationWizard } from "@/components/PersonalizedRecommendationWizard";
import { PlanDetailsSheet } from "@/components/plans/PlanDetailsSheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import SimpleStepsBanner from "@/components/marketing/SimpleStepsBanner";
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
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<ManualPlan[]>([]);
  const [comparedPlans, setComparedPlans] = useState<ManualPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showPersonalizedWizard, setShowPersonalizedWizard] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [showPersonalizedResults, setShowPersonalizedResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedUserProfile, setSavedUserProfile] = useState<UserProfile | null>(null);

  // New state for enhanced features
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name' | 'features'>('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewedPlans, setViewedPlans] = useState<Set<string>>(new Set());
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<ManualPlan | null>(null);
  const [openCompanies, setOpenCompanies] = useState<Set<string>>(new Set());
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

          // Update currentUserPlan with the data from the first category
          setCurrentUserPlan({
            name: '',
            price: parsedData[0].amount || '',
            company: parsedData[0].provider || '',
            usage: 'medium'
          });
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, []);

  // Update currentUserPlan when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      const storedData = localStorage.getItem('analysisData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const categoryMapping: Record<CategoryType, string> = {
            'mobile': 'cellular',
            'electricity': 'electricity',
            'internet': 'internet',
            'tv': 'tv'
          };
          const categoryData = parsedData.find((item: any) => item.category === categoryMapping[selectedCategory] || item.category === selectedCategory);
          if (categoryData) {
            setCurrentUserPlan({
              name: '',
              price: categoryData.amount || '',
              company: categoryData.provider || '',
              usage: 'medium'
            });
          }
        } catch (error) {
          console.error('Error parsing analysis data:', error);
        }
      }
    }
  }, [selectedCategory]);

  // Set page meta
  usePageMeta({
    title: 'כל המסלולים | EasySwitch',
    description: 'מרכז המסלולים החכם - השוואה מבוססת AI, המלצות מותאמות אישית וכל המסלולים הטובים ביותר במקום אחד.'
  });
  useEffect(() => {
    document.title = "כל המסלולים | EasySwitch";
  }, []);

  // Enhanced filtering and sorting
  const {
    filteredPlans,
    groupedByCompany
  } = useMemo(() => {
    if (!selectedCategory) return {
      filteredPlans: [],
      groupedByCompany: {}
    };
    let filtered = manualPlans.filter(plan => {
      if (plan.category !== selectedCategory) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = plan.company.toLowerCase().includes(query) || plan.planName.toLowerCase().includes(query) || plan.features.some(f => f.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Price range filter
      if (plan.regularPrice > 0) {
        if (plan.regularPrice < priceRange[0] || plan.regularPrice > priceRange[1]) {
          return false;
        }
      }
      return true;
    });

    // Sort plans
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.regularPrice || 0) - (b.regularPrice || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.regularPrice || 0) - (a.regularPrice || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.planName.localeCompare(b.planName, 'he'));
        break;
      case 'features':
        filtered.sort((a, b) => b.features.length - a.features.length);
        break;
    }

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
  }, [selectedCategory, searchQuery, sortBy, priceRange]);
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
    // Mark as viewed
    setViewedPlans(prev => new Set(prev).add(plan.id));

    // Open details sheet
    setSelectedPlanForDetails(plan);
  };
  const handleSelectForSwitch = (plan: ManualPlan) => {
    setSelectedPlan(plan);

    // Store selected plan data for service request
    localStorage.setItem('selectedPlanForSwitch', JSON.stringify({
      planName: plan.planName,
      company: plan.company,
      price: plan.regularPrice,
      category: plan.category,
      features: plan.features,
      switchType: 'switch'
    }));

    // Navigate to service request page
    window.location.href = '/service-request';
  };

  // Company Logo Mapping
  const companyLogos: Record<string, string> = {
    'חברת החשמל': electricityLogo,
    'חשמל': electricityLogo,
    'אלקטרה': electraLogo,
    'בזק': bezeqLogo,
    'hot': hotLogo,
    'HOT': hotLogo,
    'סלקום': cellcomLogo,
    'Cellcom': cellcomLogo,
    'פרטנר': partnerLogo,
    'Partner': partnerLogo,
    'פלאפון': pelephoneLogo,
    'Pelephone': pelephoneLogo,
    '019': logo019,
    'רמי לוי': ramiLevyLogo,
    'yes': yesLogo,
    'YES': yesLogo,
    'נטפליקס': netflixLogo,
    'Netflix': netflixLogo,
    'דיסני': disneyLogo,
    'Disney': disneyLogo,
    'HBO': hboLogo
  };
  const getCompanyLogo = (companyName: string): string | null => {
    return companyLogos[companyName] || null;
  };
  const toggleCompany = (companyName: string) => {
    setOpenCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyName)) {
        newSet.delete(companyName);
      } else {
        newSet.add(companyName);
      }
      return newSet;
    });
  };
  const toggleFavorite = (planId: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planId)) {
        newSet.delete(planId);
      } else {
        newSet.add(planId);
      }
      return newSet;
    });
  };
  const getMaxPrice = () => {
    const prices = manualPlans.filter(p => p.category === selectedCategory && p.regularPrice > 0).map(p => p.regularPrice);
    return prices.length > 0 ? Math.max(...prices) : 500;
  };
  const clearComparison = () => setComparedPlans([]);
  const handlePersonalizedRecommendation = async (userProfile: UserProfile, categories: CategoryType[]) => {
    setIsAnalyzing(true);
    setShowPersonalizedWizard(false);
    setSavedUserProfile(userProfile); // Save user profile for coverage info
    try {
      console.log('🔍 Starting personalized recommendations for categories:', categories);
      console.log('📍 User location:', userProfile.location);
      console.log('📦 Total plans in manualPlans:', manualPlans.length);
      console.log('📂 Unique categories in manualPlans:', [...new Set(manualPlans.map(p => p.category))]);

      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate recommendations for each category
      const allRecommendations: PersonalizedRecommendation[] = [];
      for (const category of categories) {
        console.log(`📊 Processing category: ${category}`);
        const categoryPlans = manualPlans.filter(p => p.category === category);
        console.log(`  - Found ${categoryPlans.length} plans for ${category}`);
        if (categoryPlans.length === 0) {
          console.warn(`⚠️ No plans found for category: ${category}`);
          continue;
        }
        const recommendations = PersonalizedRecommendationEngine.generatePersonalizedRecommendations(categoryPlans, userProfile, category as string);
        console.log(`  - Generated ${recommendations.length} recommendations for ${category}`);
        console.log(`  - Recommendations IDs:`, recommendations.map(r => r.planId));
        console.log(`  - Recommendations categories:`, recommendations.map(r => r.category));
        allRecommendations.push(...recommendations);
      }
      console.log(`✅ Total recommendations generated: ${allRecommendations.length}`);
      console.log('Recommendations by category:', allRecommendations.reduce((acc, rec) => {
        acc[rec.category] = (acc[rec.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
      setPersonalizedRecommendations(allRecommendations);
      setIsAnalyzing(false);
      setShowPersonalizedResults(true);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setIsAnalyzing(false);
      alert('אירעה שגיאה בעת יצירת ההמלצות. אנא נסו שוב.');
    }
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
  return <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navigation */}
      <EnhancedNavigation />

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 py-8">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <BreadcrumbNavigation />
          
          <div className="text-center mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-heebo mb-4">
              השוואת מסלולים
            </h1>
            <p className="text-xl text-gray-600 font-assistant max-w-2xl mx-auto">
              בחרו קטגוריה מצד ימין וראו את כל החברות והמסלולים הזמינים
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-6 max-w-7xl py-12">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* RIGHT SIDEBAR: Category Selector */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-gray-900 font-heebo mb-6 pb-4 border-b-2 border-gray-200">
                בחרו קטגוריה
              </h2>
              
              {/* Vertical Category List */}
              <nav className="space-y-3">
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const isSelected = selectedCategory === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCategory(key as CategoryType);
                        setSelectedCategories([]);
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-right",
                        "border-2 font-heebo group",
                        isSelected 
                          ? "bg-primary text-white border-primary shadow-lg scale-105" 
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:bg-primary/5"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl transition-colors",
                        isSelected ? "bg-white/20" : "bg-gray-100 group-hover:bg-primary/10"
                      )}>
                        <div className={isSelected ? "text-white" : "text-primary"}>
                          {config.icon}
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="font-bold text-lg">{config.label}</div>
                        <div className={cn(
                          "text-sm mt-0.5",
                          isSelected ? "text-white/90" : "text-gray-500"
                        )}>
                          {config.description}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* LEFT MAIN CONTENT: Company Logos */}
          <main className="lg:col-span-9">
            {selectedCategory ? (
              <div className="space-y-6 animate-fade-in">
                {/* Category Title */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                        <div className="text-primary">
                          {categoryConfig[selectedCategory].icon}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 font-heebo">
                          מסלולי {categoryConfig[selectedCategory].label}
                        </h2>
                        <p className="text-gray-600 font-assistant mt-1">
                          לחצו על חברה כדי לראות את המסלולים הזמינים
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {filteredPlans.length} מסלולים
                    </Badge>
                  </div>
                </div>

                {/* Company Logos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {selectedCategory === 'electricity' && (
                    <>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={electraLogo} alt="אלקטרה" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={electricityLogo} alt="חברת החשמל" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                    </>
                  )}
                  
                  {selectedCategory === 'internet' && (
                    <>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={bezeqLogo} alt="בזק" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={hotLogo} alt="HOT" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={partnerLogo} alt="פרטנר" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                    </>
                  )}
                  
                  {selectedCategory === 'mobile' && (
                    <>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={cellcomLogo} alt="סלקום" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={partnerLogo} alt="פרטנר" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={pelephoneLogo} alt="פלאפון" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={logo019} alt="019" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={ramiLevyLogo} alt="רמי לוי" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                    </>
                  )}
                  
                  {selectedCategory === 'tv' && (
                    <>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={yesLogo} alt="YES" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={hotLogo} alt="HOT" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={netflixLogo} alt="Netflix" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={disneyLogo} alt="Disney" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                        <img src={hboLogo} alt="HBO" className="w-full h-16 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                    </>
                  )}
                </div>
                
                {/* Quick Info Card */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border-2 border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-heebo mb-2">
                        מצאתם מה שחיפשתם?
                      </h3>
                      <p className="text-gray-700 font-assistant leading-relaxed mb-4">
                        לחצו על אחת מהחברות למעלה כדי לראות את המסלולים המלאים, להשוות מחירים ולהתחיל לחסוך
                      </p>
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        <Target className="w-5 h-5 ml-2" />
                        התחילו לחסוך עכשיו
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 font-heebo mb-3">
                    בחרו קטגוריה להתחלה
                  </h3>
                  <p className="text-lg text-gray-600 font-assistant">
                    לחצו על אחת מהקטגוריות בצד ימין כדי לראות את החברות והמסלולים הזמינים
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Steps Banner */}
      <SimpleStepsBanner />

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>;
};
export default AllPlans;