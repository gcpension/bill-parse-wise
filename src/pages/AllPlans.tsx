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
import { Zap, Smartphone, Wifi, Tv, ArrowLeft, Building2, Crown, Award, CheckCircle, TrendingUp, Sparkles, Star, BarChart3, Filter, Search, Calculator, Brain, Target, Eye, X, Plus, Minus, Settings2, RefreshCw, User, Package } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { SwitchRequestForm } from "@/components/forms/SwitchRequestForm";
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
import ServiceRequestWizard from "@/components/service-request/ServiceRequestWizard";

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
  const [isServiceRequestDialogOpen, setIsServiceRequestDialogOpen] = useState(false);
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
          const categoryData = parsedData.find((item: any) => 
            item.category === categoryMapping[selectedCategory] || item.category === selectedCategory
          );
          
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
        const matchesSearch = 
          plan.company.toLowerCase().includes(query) ||
          plan.planName.toLowerCase().includes(query) ||
          plan.features.some(f => f.toLowerCase().includes(query));
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
    
    // Open form directly instead of details sheet
    handleSelectForSwitch(plan);
  };

  const handleViewDetails = (plan: ManualPlan) => {
    // Open details sheet for viewing
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

    // Open dialog instead of navigating
    setIsServiceRequestDialogOpen(true);
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
    'HBO': hboLogo,
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
    const prices = manualPlans
      .filter(p => p.category === selectedCategory && p.regularPrice > 0)
      .map(p => p.regularPrice);
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
        
        const recommendations = PersonalizedRecommendationEngine.generatePersonalizedRecommendations(
          categoryPlans, 
          userProfile, 
          category as string
        );
        console.log(`  - Generated ${recommendations.length} recommendations for ${category}`);
        console.log(`  - Recommendations IDs:`, recommendations.map(r => r.planId));
        console.log(`  - Recommendations categories:`, recommendations.map(r => r.category));
        allRecommendations.push(...recommendations);
      }
      
      console.log(`✅ Total recommendations generated: ${allRecommendations.length}`);
      console.log('Recommendations by category:', 
        allRecommendations.reduce((acc, rec) => {
          acc[rec.category] = (acc[rec.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );
      
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
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
      {/* Enhanced Navigation */}
      <EnhancedNavigation />

      <div className="container mx-auto px-4 lg:px-6 max-w-7xl py-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />
        
        {/* Enhanced Page Header */}
        


        {/* Category Selection - Enhanced Design */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground font-heebo mb-4">
              בחר קטגוריה לצפייה במסלולים
            </h2>
            <p className="text-xl text-muted-foreground font-assistant max-w-3xl mx-auto">
              לחצו על הקטגוריה המעניינת אתכם • החזיקו Ctrl ללחוץ על מספר קטגוריות
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const isSelected = selectedCategory === key;
              const isInMultiSelect = selectedCategories.includes(key as CategoryType);
              
              return (
                <Card 
                  key={key}
                  className={cn(
                    "group relative cursor-pointer transition-all duration-500 border-3 overflow-hidden",
                    "hover:shadow-2xl hover:-translate-y-2",
                    isSelected || isInMultiSelect
                      ? "ring-4 ring-primary/50 shadow-2xl border-primary scale-105" 
                      : "border-border hover:border-primary/60"
                  )} 
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      if (isInMultiSelect) {
                        setSelectedCategories(prev => prev.filter(c => c !== key));
                      } else {
                        setSelectedCategories(prev => [...prev, key as CategoryType]);
                      }
                    } else {
                      setSelectedCategory(key as CategoryType);
                      setSelectedCategories([]);
                    }
                  }}
                >
                  {/* Background gradient animation */}
                  <div className={cn(
                    "absolute inset-0 transition-all duration-500",
                    isSelected || isInMultiSelect
                      ? "bg-gradient-to-br from-primary via-primary/90 to-accent opacity-100"
                      : "bg-gradient-to-br from-background via-muted/30 to-background opacity-100 group-hover:from-primary/10 group-hover:to-accent/10"
                  )} />
                  
                  {/* Selected indicator */}
                  {(isSelected || isInMultiSelect) && (
                    <div className="absolute top-3 left-3 z-20 animate-scale-in">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="relative z-10 p-8 flex flex-col items-center justify-center h-40 text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500",
                      "shadow-lg group-hover:scale-110 group-hover:rotate-3",
                      isSelected || isInMultiSelect
                        ? "bg-white/20 backdrop-blur-sm"
                        : "bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20"
                    )}>
                      <div className={cn(
                        "transition-colors duration-300",
                        isSelected || isInMultiSelect ? "text-white" : "text-primary"
                      )}>
                        {config.icon}
                      </div>
                    </div>
                    <h3 className={cn(
                      "text-2xl font-black font-heebo mb-2 transition-colors duration-300",
                      isSelected || isInMultiSelect ? "text-white" : "text-foreground"
                    )}>
                      {config.label}
                    </h3>
                    <p className={cn(
                      "text-sm font-assistant transition-colors duration-300",
                      isSelected || isInMultiSelect ? "text-white/90" : "text-muted-foreground"
                    )}>
                      {config.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Show recommendation button when multiple categories are selected */}
          {selectedCategories.length > 0 && (
            <div className="mt-3 text-center animate-fade-in">
              <Card className="max-w-xl mx-auto border border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground font-heebo">
                        נבחרו {selectedCategories.length} סקטורים
                      </p>
                      <p className="text-xs text-muted-foreground font-assistant">
                        {selectedCategories.map(cat => categoryConfig[cat].label).join(', ')}
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowPersonalizedWizard(true)}
                      size="sm"
                      className="font-heebo bg-gradient-to-r from-primary to-primary/80"
                    >
                      <Brain className="w-4 h-4 ml-1" />
                      המלצות
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Company Logos by Category */}
        {selectedCategory && <div className="mb-12 animate-fade-in">
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-accent/5 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground font-heebo mb-4 text-center flex items-center justify-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  החברות הזמינות
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-3 max-w-5xl mx-auto">
              {selectedCategory === 'electricity' && <>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/electra-logo.png" alt="אלקטרה" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/electricity-logo.png" alt="חברת החשמל" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                </>}
              
              {selectedCategory === 'internet' && <>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/bezeq-logo.png" alt="בזק" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/hot-logo.svg" alt="HOT" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                </>}
              
              {selectedCategory === 'mobile' && <>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/cellcom-logo.svg" alt="סלקום" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/partner-logo.png" alt="פרטנר" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/pelephone-logo.png" alt="פלאפון" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/019-logo.png" alt="019" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/rami-levy-logo.png" alt="רמי לוי" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                </>}
              
              {selectedCategory === 'tv' && <>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/yes-logo.png" alt="YES" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/hot-logo.svg" alt="HOT" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/netflix-logo.svg" alt="Netflix" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/disney-logo.png" alt="Disney" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="group bg-white rounded-xl p-3 shadow-md border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img src="/src/assets/logos/hbo-logo.png" alt="HBO" className="w-full h-6 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                </>}
                </div>
              </CardContent>
            </Card>
          </div>}

        {/* Enhanced CTA Section */}
        {selectedCategory && <div className="mb-10 animate-fade-in">
            {/* Big CTA Message with Icon */}
            <Card className="border-3 border-primary/30 bg-gradient-to-br from-background via-primary/5 to-accent/5 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
              <CardContent className="p-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-xl">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-foreground font-heebo mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  מצא את המסלול המושלם עבורך
                </h2>
                <p className="text-xl text-muted-foreground font-assistant max-w-2xl mx-auto">
                  בחר חברה מהרשימה מטה ולחץ על המסלול שמעניין אותך
                </p>
              </CardContent>
            </Card>

            {/* Enhanced Savings Info */}
            {currentUserPlan.price && cheapestPlan && parseFloat(currentUserPlan.price) > 0 && (
              <div className="max-w-3xl mx-auto mt-8 animate-slide-up">
                <Card className="border-3 border-green-500/30 bg-gradient-to-l from-green-50 via-emerald-50 to-green-50 shadow-xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                          <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-700 font-assistant mb-1">חיסכון פוטנציאלי</p>
                          <p className="text-4xl font-black text-green-600 font-heebo">
                            ₪{Math.max(0, (parseFloat(currentUserPlan.price) - cheapestPlan.regularPrice) * 12).toLocaleString()}
                          </p>
                          <p className="text-sm text-green-600 font-assistant mt-1">לשנה</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handlePlanSelect(cheapestPlan)} 
                        size="lg" 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-heebo shadow-xl hover:shadow-2xl text-lg px-8 py-6 transform hover:scale-105 transition-all"
                      >
                        <Sparkles className="w-5 h-5 ml-2" />
                        עבור למסלול
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>}


        {/* Enhanced Comparison Bar */}
        {comparedPlans.length > 0 && <Card className="mb-4 border border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-md animate-fade-in">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-800 font-heebo">
                      השוואת מסלולים
                    </h3>
                    <p className="text-blue-600 font-assistant text-xs">
                      {comparedPlans.length} מסלולים נבחרו
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <DetailedAIComparison plans={comparedPlans} userContext={userContext} category={selectedCategory as 'electricity' | 'internet' | 'mobile' | 'tv'} />
                  <Button onClick={() => setShowComparison(!showComparison)} variant="outline" size="sm" className="font-assistant">
                    <Eye className="w-3 h-3 ml-1" />
                    {showComparison ? 'הסתר' : 'הצג'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={clearComparison} className="font-assistant">
                    <X className="w-3 h-3 ml-1" />
                    נקה
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Comparison Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {comparedPlans.map((plan, index) => <Card key={plan.id} className="border border-blue-200 bg-white shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-green-500'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-primary font-heebo">{plan.company}</h4>
                            <p className="text-xs text-muted-foreground font-assistant">{plan.planName}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setComparedPlans(prev => prev.filter(p => p.id !== plan.id))} className="text-red-500 hover:text-red-700 h-6 w-6 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-center mb-2">
                        <div className="text-xl font-bold text-primary font-heebo">
                          ₪{plan.regularPrice}
                        </div>
                        <div className="text-xs text-muted-foreground font-assistant">לחודש</div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground font-assistant">
                        {plan.features?.slice(0, 2).join(' • ')}
                        {(plan.features?.length || 0) > 2 && ` +${(plan.features?.length || 0) - 2}`}
                      </div>
                    </CardContent>
                  </Card>)}
                
                {/* Add More Plans Prompt */}
                {comparedPlans.length < 3 && <Card className="border border-dashed border-blue-300 bg-blue-50/50">
                    <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                      <Plus className="w-6 h-6 text-blue-600 mb-1" />
                      <h4 className="text-xs font-bold text-blue-800 font-heebo">
                        הוסיפו מסלול
                      </h4>
                      <p className="text-xs text-blue-600 font-assistant">
                        לחצו על + למטה
                      </p>
                    </CardContent>
                  </Card>}
              </div>
            </CardContent>
          </Card>}

        {/* Advanced Search and Filters */}
        {selectedCategory && (
          <div className="mb-8">
            <PlanFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPrice={getMaxPrice()}
              showFilters={showAdvancedFilters}
              onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
              resultsCount={filteredPlans.length}
            />
          </div>
        )}

        {/* Comparison Panel */}
        {comparedPlans.length > 0 && (
          <div className="mb-8">
            <ComparisonPanel
              plans={comparedPlans}
              onRemove={(id) => setComparedPlans(prev => prev.filter(p => p.id !== id))}
              onClear={clearComparison}
              maxPlans={3}
            />
          </div>
        )}

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
            <Card className="mb-10 border-2 border-primary/20 bg-gradient-to-r from-background via-muted/30 to-background shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-foreground font-heebo">
                        בחרו חברה לצפייה במסלולים
                      </h2>
                      <p className="text-base text-muted-foreground font-assistant mt-1">
                        לחצו על לוגו של החברה כדי לצפות במסלולים שלה
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xl px-6 py-3 font-assistant shadow-md">
                    {filteredPlans.length} מסלולים • {Object.keys(groupedByCompany).length} חברות
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Company Logos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
              {Object.entries(groupedByCompany).map(([companyName, companyPlans]) => {
                const isOpen = openCompanies.has(companyName);
                const cheapestInCompany = Math.min(...companyPlans.map(p => p.regularPrice));
                const companyLogo = getCompanyLogo(companyName);
                
                return (
                  <Card
                    key={companyName}
                    className={cn(
                      "group relative aspect-square cursor-pointer transition-all duration-300 hover:shadow-2xl border-2",
                      isOpen ? "border-primary shadow-xl ring-4 ring-primary/20" : "border-border hover:border-primary/50"
                    )}
                    onClick={() => toggleCompany(companyName)}
                  >
                    <CardContent className="p-0 h-full flex items-center justify-center relative overflow-hidden">
                      {/* Background gradient on hover */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        isOpen && "opacity-100 from-primary/10 to-accent/10"
                      )} />
                      
                      {/* Logo */}
                      <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
                        {companyLogo ? (
                          <img 
                            src={companyLogo} 
                            alt={`${companyName} לוגו`}
                            className={cn(
                              "max-w-[70%] max-h-[70%] object-contain transition-all duration-300",
                              isOpen ? "scale-110" : "group-hover:scale-110"
                            )}
                          />
                        ) : (
                          <div className="text-center">
                            <Building2 className={cn(
                              "w-10 h-10 mx-auto text-primary mb-2 transition-transform duration-300",
                              isOpen ? "scale-110" : "group-hover:scale-110"
                            )} />
                            <span className="text-xs font-heebo text-muted-foreground">{companyName}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Badge with plans count */}
                      <div className="absolute top-2 right-2 z-20">
                        <Badge 
                          variant={isOpen ? "default" : "secondary"}
                          className="text-xs font-assistant shadow-lg"
                        >
                          {companyPlans.length}
                        </Badge>
                      </div>
                      
                      {/* Best price indicator */}
                      <div className="absolute bottom-2 left-2 right-2 z-20">
                        <div className={cn(
                          "text-center rounded-lg p-1.5 backdrop-blur-sm transition-colors",
                          isOpen ? "bg-primary/20" : "bg-background/90"
                        )}>
                          <span className={cn(
                            "text-xs font-heebo font-semibold",
                            isOpen ? "text-primary-foreground" : "text-primary"
                          )}>
                            מ-₪{cheapestInCompany}
                          </span>
                        </div>
                      </div>
                      
                      {/* Selected indicator */}
                      {isOpen && (
                        <div className="absolute top-2 left-2 z-20 animate-scale-in">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Selected Companies Plans - Only show if any company is selected */}
            {openCompanies.size > 0 && (
              <div className="space-y-8">
                <Separator className="my-8" />
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground font-heebo">
                    המסלולים שבחרתם
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setOpenCompanies(new Set())}
                    className="font-assistant"
                  >
                    <X className="w-4 h-4 ml-2" />
                    נקה בחירה
                  </Button>
                </div>

                {Array.from(openCompanies).map(companyName => {
                  const companyPlans = groupedByCompany[companyName];
                  if (!companyPlans) return null;
                  
                  const cheapestInCompany = Math.min(...companyPlans.map(p => p.regularPrice));
                  
                  return (
                    <Card key={companyName} className="border-2 border-primary/30 shadow-xl animate-fade-in">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getCompanyLogo(companyName) && (
                              <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-md">
                                <img 
                                  src={getCompanyLogo(companyName)!} 
                                  alt={`${companyName} לוגו`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="text-2xl font-bold text-foreground font-heebo">
                                {companyName}
                              </h3>
                              <p className="text-muted-foreground font-assistant">
                                {companyPlans.length} מסלולים זמינים • החל מ-₪{cheapestInCompany}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleCompany(companyName)}
                            className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-6">
                        <div className={cn(
                          "grid gap-6",
                          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                        )}>
                          {companyPlans.map((plan, planIndex) => {
                            const isCheapest = cheapestPlan && plan.id === cheapestPlan.id;
                            const isCompanyCheapest = plan.regularPrice === cheapestInCompany;
                            const savingsAmount = currentUserPlan.price 
                              ? Math.max(0, parseFloat(currentUserPlan.price) - plan.regularPrice)
                              : undefined;
                            
                            return (
                              <div 
                                key={plan.id}
                                style={{ animationDelay: `${planIndex * 50}ms` }}
                                className="animate-fade-in"
                              >
                                <PlanCard
                                  plan={plan}
                                  isFavorite={favoriteIds.has(plan.id)}
                                  isViewed={viewedPlans.has(plan.id)}
                                  isComparing={isInComparison(plan.id)}
                                  isBestPrice={isCheapest || isCompanyCheapest}
                                  onToggleFavorite={() => toggleFavorite(plan.id)}
                                  onToggleCompare={() => handleCompareToggle(plan)}
                                  onSelect={() => handlePlanSelect(plan)}
                                  onViewDetails={() => handleViewDetails(plan)}
                                  comparisonDisabled={!canAddToComparison && !isInComparison(plan.id)}
                                  savingsAmount={savingsAmount}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>}

        {filteredPlans.length === 0 && selectedCategory && <div className="text-center py-12">
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
      {selectedPlan && (
        <SwitchRequestForm
          selectedPlan={selectedPlan}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPlan(null);
          }}
        />
      )}

      {/* Enhanced Personalized Recommendation Banner */}
      {selectedCategory && !showPersonalizedWizard && !isAnalyzing && (
        <PersonalizedRecommendationBanner 
          onRecommendationClick={() => {
            setSelectedCategories([selectedCategory]);
            setShowPersonalizedWizard(true);
          }} 
        />
      )}

      {/* Loading Animation */}
      {isAnalyzing && <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 font-heebo mb-2">
              מנתח את הצרכים שלכם...
            </h3>
            <p className="text-gray-600 font-assistant mb-4">
              הבינה המלאכותית בוחנת את המסלולים הטובים ביותר עבורכם
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>מעבד נתונים...</span>
            </div>
          </div>
        </div>}


      {/* Personalized Recommendation Wizard */}
      {showPersonalizedWizard && <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PersonalizedRecommendationWizard 
              categories={selectedCategories} 
              onComplete={handlePersonalizedRecommendation} 
              onClose={() => setShowPersonalizedWizard(false)} 
            />
          </div>
        </div>}

      {/* Personalized Recommendation Results */}
      <RecommendationResults 
        isOpen={showPersonalizedResults} 
        onClose={() => setShowPersonalizedResults(false)} 
        recommendations={personalizedRecommendations} 
        plans={manualPlans}
        onPlanSelect={handlePlanSelect}
        userLocation={savedUserProfile?.location}
      />

      {/* Plan Details Sheet */}
      <PlanDetailsSheet
        plan={selectedPlanForDetails}
        isOpen={!!selectedPlanForDetails}
        onClose={() => setSelectedPlanForDetails(null)}
        onSelectForSwitch={handleSelectForSwitch}
      />

      {/* Service Request Dialog */}
      <Dialog open={isServiceRequestDialogOpen} onOpenChange={setIsServiceRequestDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-0">
          <ServiceRequestWizard onComplete={() => setIsServiceRequestDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>;
};
export default AllPlans;