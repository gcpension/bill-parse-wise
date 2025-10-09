import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Wifi, Smartphone, Tv, CheckCircle, ArrowRight, Phone, Router, Lightbulb, Cable, Plug, WifiOff, Battery, Monitor, Tablet, Headphones, Radio, Satellite, X, Sparkles, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import electricityFamily from '@/assets/electricity-family.jpg';
import cellularFamily from '@/assets/cellular-family.jpg';
import internetFamily from '@/assets/internet-family.jpg';
import tvFamily from '@/assets/tv-family.jpg';
import minimalistSelectionIcon from '@/assets/minimalist-selection-icon.png';
import minimalistAnalysisIcon from '@/assets/minimalist-analysis-icon.png';
import minimalistCompletionIcon from '@/assets/minimalist-completion-icon.png';
import heroBackgroundIllustration from '@/assets/hero-background-illustration.png';
import middleSectionIllustration from '@/assets/clean-middle-illustration.png';
import professionalServicesIllustration from '@/assets/professional-services-illustration.png';
import israeliTelecomLogos from '@/assets/logos/israeli-telecom-logos.png';
import savingsAnalysisIllustration from '@/assets/savings-analysis-illustration-transparent.png';
import israeliCompaniesLogos from '@/assets/logos/israeli-companies-real-logos.png';
import BackToTop from '@/components/BackToTop';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { usePageMeta } from '@/hooks/usePageMeta';
import { QuickActions } from '@/components/QuickActions';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { CategoryCompletionBanner } from '@/components/CategoryCompletionBanner';
import SimpleStepsBanner from '@/components/marketing/SimpleStepsBanner';

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerCategory, setBannerCategory] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<Record<string, {
    provider: string;
    amount: string;
    selected: boolean;
    lines?: number;
  }>>({
    electricity: {
      provider: '',
      amount: '',
      selected: false
    },
    cellular: {
      provider: '',
      amount: '',
      selected: false,
      lines: 1
    },
    internet: {
      provider: '',
      amount: '',
      selected: false
    },
    tv: {
      provider: '',
      amount: '',
      selected: false
    }
  });
  const navigate = useNavigate();

  // Set page meta
  usePageMeta({
    title: 'EasySwitch - דף הבית | מחשבון חיסכון חכם',
    description: 'המשפחה הממוצעת חוסכת ₪2,400 בשנה עם השירות שלנו. השוואת ספקים וחיסכון בחשבונות הבית.',
    keywords: ['חיסכון', 'חשמל', 'אינטרנט', 'סלולר', 'טלוויזיה', 'השוואת מחירים', 'EasySwitch']
  });
  useEffect(() => {
    setMounted(true);
  }, []);
  const categoryData = {
    electricity: {
      name: 'חשמל',
      icon: Zap,
      image: electricityFamily,
      providers: ['חברת חשמל', 'פז אנרגיה', 'אלקטרה פאוור', 'דור אלון אנרגיה', 'סלקום אנרגיה']
    },
    cellular: {
      name: 'סלולר',
      icon: Smartphone,
      image: cellularFamily,
      providers: ['פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', '019 מובייל']
    },
    internet: {
      name: 'אינטרנט',
      icon: Wifi,
      image: internetFamily,
      providers: ['בזק', 'הוט', 'פרטנר', 'סלקום', 'אורנג']
    },
    tv: {
      name: 'טלוויזיה',
      icon: Tv,
      image: tvFamily,
      providers: ['יס', 'הוט', 'סלקום TV', 'פרטנר TV', 'נטפליקס']
    }
  };
  const handleCategorySelect = (category: string) => {
    const isCurrentlySelected = selectedCategories[category].selected;
    
    if (!isCurrentlySelected) {
      // Show banner when selecting a category
      setBannerCategory(category);
      setShowBanner(true);
      setSelectedCategories(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          selected: true
        }
      }));
    } else {
      // Deselect category
      setSelectedCategories(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          selected: false,
          amount: ''
        }
      }));
    }
  };
  const handleAmountChange = (amount: string) => {
    if (bannerCategory) {
      setSelectedCategories(prev => ({
        ...prev,
        [bannerCategory]: {
          ...prev[bannerCategory],
          amount
        }
      }));
    }
  };
  const handleStartAnalysis = () => {
    const selectedData = Object.entries(selectedCategories).filter(([_, data]) => data.selected && data.amount).map(([category, data]) => ({
      category,
      ...data
    }));
    if (selectedData.length === 0) {
      enhancedToast.warning({
        title: 'בחרו קטגוריה',
        description: 'יש לבחור לפחות קטגוריה אחת עם סכום'
      });
      return;
    }

    // Store analysis data for the AllPlans page
    localStorage.setItem('analysisData', JSON.stringify(selectedData));

    // Store selected categories for filtering
    const categories = selectedData.map(item => item.category);
    localStorage.setItem('selectedCategories', JSON.stringify(categories));
    navigate('/all-plans');
  };

  const handleCheckAnother = () => {
    setShowBanner(false);
    setBannerCategory('');
    // Scroll to categories section
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProceedToPlans = () => {
    setShowBanner(false);
    setBannerCategory('');
    handleStartAnalysis();
  };

  const handleCloseBanner = () => {
    // Deselect the category if closing without entering amount
    if (bannerCategory && !selectedCategories[bannerCategory].amount) {
      setSelectedCategories(prev => ({
        ...prev,
        [bannerCategory]: {
          ...prev[bannerCategory],
          selected: false
        }
      }));
    }
    setShowBanner(false);
    setBannerCategory('');
  };
  return <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-purple-600 font-heebo">
                EasySwitch
              </h1>
            </div>
            
            {/* Navigation Links on the right */}
            <div className="flex items-center space-x-8">
              <a href="/" className="text-purple-600 font-medium hover:text-purple-700 transition-colors font-heebo">
                דף הבית
              </a>
              <a href="/magazine" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">
                מגזין
              </a>
              <a href="/tips" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">
                טיפים
              </a>
              <a href="/about" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">
                אודות
              </a>
              <a href="/contact" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">
                צור קשר
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle background icons scattered across the page */}
        <Lightbulb className="absolute top-[15%] left-[8%] w-8 h-8 text-purple-500 opacity-20" />
        <Smartphone className="absolute top-[25%] right-[12%] w-8 h-8 text-purple-600 opacity-20" />
        <Wifi className="absolute top-[45%] left-[15%] w-7 h-7 text-royal-purple opacity-20" />
        <Tv className="absolute bottom-[35%] right-[7%] w-7 h-7 text-purple-500 opacity-20" />
        
        {/* Additional scattered elements */}
        <Phone className="absolute top-[60%] left-[5%] w-6 h-6 text-purple-400 opacity-15" />
        <Router className="absolute top-[35%] right-[20%] w-6 h-6 text-purple-600 opacity-15" />
        <Cable className="absolute bottom-[60%] left-[25%] w-5 h-5 text-gray-500 opacity-15" />
        <Plug className="absolute top-[80%] right-[8%] w-5 h-5 text-gray-500 opacity-15" />
        <WifiOff className="absolute bottom-[45%] right-[30%] w-5 h-5 text-purple-400 opacity-12" />
        <Battery className="absolute top-[70%] left-[35%] w-5 h-5 text-purple-500 opacity-12" />
        <Monitor className="absolute bottom-[25%] left-[40%] w-6 h-6 text-gray-500 opacity-15" />
        <Tablet className="absolute top-[50%] right-[40%] w-5 h-5 text-purple-400 opacity-12" />
        <Headphones className="absolute bottom-[70%] right-[15%] w-5 h-5 text-gray-500 opacity-15" />
        <Radio className="absolute top-[85%] left-[20%] w-5 h-5 text-purple-400 opacity-12" />
        <Satellite className="absolute bottom-[15%] right-[35%] w-6 h-6 text-purple-600 opacity-15" />
        
        {/* Additional elements for better distribution */}
        <Zap className="absolute top-[30%] left-[30%] w-6 h-6 text-purple-500 opacity-15" />
        <Phone className="absolute bottom-[50%] left-[60%] w-5 h-5 text-purple-400 opacity-12" />
        <Lightbulb className="absolute top-[65%] right-[25%] w-5 h-5 text-gray-500 opacity-15" />
        <Wifi className="absolute bottom-[80%] left-[50%] w-6 h-6 text-purple-600 opacity-15" />
      </div>

      {/* Clean Header Section */}
      <section className="bg-gray-50 py-16 lg:py-24 relative overflow-hidden">
        {/* Background illustration */}
        <div className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroBackgroundIllustration})`
      }}>
        </div>
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          <div className="text-center">
            
            {/* Clean subtitle */}
            <p className="text-lg text-purple-600 mb-8 font-assistant">
              המשפחה הממוצעת חוסכת ₪2,400 בשנה עם השירות שלנו
            </p>
            
            {/* Clean main title */}
            <h1 className="text-4xl lg:text-6xl font-heebo font-light text-royal-purple mb-4 leading-tight">
              חסכו בחשבונות הבית
              <br />
              <span className="font-medium text-purple-700">בקלות ובמהירות</span>
            </h1>
            
            <p className="text-xl text-purple-600 mt-6 font-assistant max-w-3xl mx-auto">
              אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
            </p>
          </div>
        </div>
      </section>

      {/* Clean Categories Section - Enhanced with animations */}
      <section id="services" className="py-16 bg-gray-50 relative scroll-mt-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heebo font-medium text-royal-purple mb-4 animate-fade-in opacity-0" style={{
            animationDelay: '0.2s',
            animationFillMode: 'forwards'
          }}>
              בחרו את הקטגוריה שלכם
            </h2>
            <p className="text-lg text-purple-600 font-assistant animate-fade-in opacity-0" style={{
            animationDelay: '0.4s',
            animationFillMode: 'forwards'
          }}>
              קבלו המלצות מותאמות אישית והשוו מחירים בכל הקטגוריות
            </p>
          </div>
          
          
      {/* Category Cards Grid - Enhanced Interactive Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(categoryData).map(([category, data], index) => {
            const Icon = data.icon;
            const isSelected = selectedCategories[category].selected;
            return <div key={category} className="group relative animate-fade-in opacity-0" style={{
              animationDelay: `${0.6 + index * 0.1}s`,
              animationFillMode: 'forwards'
            }}>
                  <Card className={`touch-card relative overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer border-2 transform hover:scale-[1.02] hover:-translate-y-1 min-h-[160px] ${isSelected ? 'border-green-500 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-green-200' : 'border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/20'}`} onClick={() => handleCategorySelect(category)}>
                    {/* Decorative gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none ${isSelected ? 'from-green-400 to-emerald-600' : 'from-purple-400 to-indigo-600'}`}></div>
                    
                    {/* Selected badge */}
                    {isSelected && <div className="absolute top-2 right-2 z-10">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-1 shadow-lg animate-scale-in">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>}
                    
                    <CardContent className="p-4 text-center flex flex-col justify-between h-full relative z-10">
                      {/* Icon with interactive background */}
                      <div className={`relative mx-auto mb-2 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg' : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md'}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Image illustration */}
                      <div className="w-full h-12 mx-auto mb-2 overflow-hidden rounded-lg shadow-sm">
                        <img src={data.image} alt={`איור ${data.name}`} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Category title */}
                      <h3 className={`text-lg font-heebo font-bold mb-2 ${isSelected ? 'text-green-700' : 'text-purple-700'}`}>
                        {data.name}
                      </h3>
                      
                      {/* Interactive button */}
                      <Button size="sm" className={`w-full rounded-lg font-medium transition-all duration-300 shadow-md ${isSelected ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white' : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700 text-white'}`} onClick={e => {
                    e.stopPropagation();
                    handleCategorySelect(category);
                  }}>
                        <span className="flex items-center justify-center gap-1 text-sm">
                          <Icon className="w-4 h-4" />
                          <span className="font-bold">{isSelected ? '✓ נבחר' : `בחר ${data.name}`}</span>
                        </span>
                      </Button>
                      
                      {/* Provider count hint */}
                      <p className={`text-xs mt-2 font-medium transition-all duration-300 ${isSelected ? 'text-green-600' : 'text-purple-600/70 group-hover:text-purple-700'}`}>
                        {data.providers.length} ספקים זמינים
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Hover glow effect around card */}
                  <div className={`absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none -z-10 ${isSelected ? 'bg-green-400' : 'bg-purple-500'}`}></div>
                </div>;
          })}
          </div>

          {/* Steps Banner Below Categories */}
          <SimpleStepsBanner />

          {/* Clean CTA Section - Hidden when banner is visible */}
          {!showBanner && (
            <div className="text-center mt-16 space-y-6">
              <Button onClick={handleStartAnalysis} className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-assistant font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <span className="flex items-center gap-3">
                  <span>התחל ניתוח חיסכון</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
              
              {/* New Service Request Button */}
              <div className="pt-4">
                <p className="text-gray-600 text-sm mb-4">או</p>
                <Button onClick={() => navigate('/service-request')} variant="outline" className="border-slate-400 text-slate-700 hover:bg-slate-50 px-8 py-3 text-base font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <span>בקש שירות ישירות</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
                <p className="text-gray-500 text-xs mt-2">עם בחירת ספקים מהירה ויפה ✨</p>
              </div>
            </div>
          )}

          {/* Clean info section */}
          <div className="text-center mt-12 max-w-4xl mx-auto">
            <p className="text-gray-600 text-lg font-assistant leading-relaxed mb-8">
              אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר.
              <br />
              <span className="font-medium text-royal-purple">השירות חינם לחלוטין</span> - המשפחה הממוצעת חוסכת ₪2,400 בשנה.
            </p>
          </div>

          {/* How It Works - Clear & Large Section */}
          <div className="max-w-6xl mx-auto mt-32">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary text-primary bg-white/80 backdrop-blur-sm text-base px-6 py-2">
                איך זה עובד?
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-heebo font-bold text-royal-purple mb-6">
                3 שלבים פשוטים לחיסכון גדול
              </h2>
              <p className="text-xl text-gray-700 font-assistant max-w-3xl mx-auto leading-relaxed">
                תהליך פשוט, מהיר ושקוף שחוסך לכם זמן וכסף
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-white">1</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6 mt-4">
                    <div className="w-20 h-20 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center">
                      <Zap className="w-10 h-10 text-purple-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-heebo font-bold text-royal-purple mb-4 text-center">
                    בחרו קטגוריות
                  </h3>
                  <p className="text-gray-600 font-assistant text-lg leading-relaxed text-center">
                    בחרו מה מעניין אתכם - חשמל, סלולר, אינטרנט או טלוויזיה. אפשר לבחור מספר קטגוריות ביחד.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-white">2</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6 mt-4">
                    <div className="w-20 h-20 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-heebo font-bold text-royal-purple mb-4 text-center">
                    הזינו פרטים
                  </h3>
                  <p className="text-gray-600 font-assistant text-lg leading-relaxed text-center">
                    ספרו לנו כמה אתם משלמים היום ומה הספק הנוכחי שלכם. זה לוקח רק דקה.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-100 hover:border-green-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-6 right-6 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-white">3</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6 mt-4">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">
                      <Star className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-heebo font-bold text-royal-purple mb-4 text-center">
                    קבלו המלצות
                  </h3>
                  <p className="text-gray-600 font-assistant text-lg leading-relaxed text-center">
                    המערכת מציגה לכם את כל האפשרויות הזולות יותר והחיסכון הצפוי. אתם בוחרים מה מתאים לכם.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-blue-100 px-8 py-4 rounded-2xl border-2 border-purple-200">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="text-lg font-heebo font-bold text-royal-purple">
                  זה הכל! פשוט כמו שזה נשמע
                </p>
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-royal-purple mb-6">
                למה שווה לבדוק אצלנו?
              </h2>
              <p className="text-xl text-gray-700 mb-8 font-assistant leading-relaxed">
                אנחנו לא רק מוצאים לכם חיסכון - אנחנו מבטיחים שהמעבר יהיה חלק, מהיר ובטוח
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-royal-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-royal-purple mb-2">
                      ניתוח מותאם אישית
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      המערכת שלנו בודקת את הצרכים הספציפיים שלכם ומוצאת את החבילות המתאימות ביותר
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-royal-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-royal-purple mb-2">
                      כיסוי מקיף לכל הבית
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      חשמל, סלולר, אינטרנט וטלוויזיה - בודקים הכול במקום אחד וחוסכים זמן
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-royal-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-royal-purple mb-2">
                      מעבר מהיר וללא בירוקרטיה
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      אנחנו מטפלים בכל הניירת והתיאומים - אתם רק חותמים ואנחנו דואגים לכל השאר
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-royal-purple mb-4 font-heebo text-center">
                  יתרונות נוספים שחשוב לדעת
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 text-center">
                    <CheckCircle className="w-6 h-6 text-royal-purple mx-auto mb-2" />
                    <h4 className="font-semibold text-royal-purple mb-1 font-heebo text-sm">ללא התחייבות</h4>
                    <p className="text-xs text-gray-600 font-assistant">אתם מחליטים בסוף</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 text-center">
                    <CheckCircle className="w-6 h-6 text-royal-purple mx-auto mb-2" />
                    <h4 className="font-semibold text-royal-purple mb-1 font-heebo text-sm">מעקב אחרי התהליך</h4>
                    <p className="text-xs text-gray-600 font-assistant">עדכונים לאורך כל הדרך</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 text-center">
                    <CheckCircle className="w-6 h-6 text-royal-purple mx-auto mb-2" />
                    <h4 className="font-semibold text-royal-purple mb-1 font-heebo text-sm">תמיכה מלאה</h4>
                    <p className="text-xs text-gray-600 font-assistant">צוות מקצועי לרשותכם</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Illustration Side */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="w-full max-w-lg">
                <img src={middleSectionIllustration} alt="איור של אישה עובדת על השוואת תעריფי שירותי הבית" className="w-full h-auto" style={{
                mixBlendMode: 'multiply',
                backgroundColor: 'transparent'
              }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section - Enhanced */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gray-500 rounded-full blur-3xl"></div>
          <div className="absolute top-32 right-20 w-40 h-40 bg-gray-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-32 w-36 h-36 bg-gray-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-gray-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          {/* Comparison Table Section - 2024 vs 2025 */}
          <div className="mb-20">
            <div className="text-center mb-16 animate-fade-in">
              <Badge variant="outline" className="mb-4 border-purple-300 text-purple-700 bg-white/80 backdrop-blur-sm">
                השוואת תהליכים
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-heebo font-bold text-royal-purple mb-4">
                איך זה נראה היום<br />לעומת 2025?
              </h2>
              <p className="text-xl text-gray-700 font-assistant max-w-2xl mx-auto">
                גלו את ההבדל המשמעותי בין הדרך המסורתית לפתרון החדש
              </p>
            </div>

            {/* Comparison Table - Clean Design */}
            <div className="max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
              {/* Header Row */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div></div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-gray-300 shadow-sm">
                    <Zap className="w-5 h-5 text-gray-600" />
                    <p className="font-heebo font-bold text-gray-800 text-lg">היום</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-br from-purple-600 to-purple-700 px-6 py-3 rounded-xl shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                    <p className="font-heebo font-bold text-white text-lg">2025</p>
                  </div>
                </div>
              </div>

              {/* Comparison Rows */}
              <div className="space-y-6">
                {/* Row 1: Duration */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-bold text-lg">משך זמן</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <X className="w-5 h-5" />
                      <p className="font-assistant font-medium">3-5 שעות</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-assistant font-bold">5 דקות</p>
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone Calls */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-bold text-lg">שיחות טלפון</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <X className="w-5 h-5" />
                      <p className="font-assistant font-medium">רבות</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-assistant font-bold">אפס</p>
                    </div>
                  </div>
                </div>

                {/* Row 3: Forms */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-bold text-lg">מילוי טפסים</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <X className="w-5 h-5" />
                      <p className="font-assistant font-medium">מסורבל</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-assistant font-bold">דיגיטלי</p>
                    </div>
                  </div>
                </div>

                {/* Row 4: Price Comparison */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-bold text-lg">השוואת מחירים</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <X className="w-5 h-5" />
                      <p className="font-assistant font-medium">מפוזר</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-assistant font-bold">מרוכז</p>
                    </div>
                  </div>
                </div>

                {/* Row 5: Cost - Highlighted */}
                <div className="grid grid-cols-3 gap-6 items-center pt-6 border-t-2 border-gray-200/50">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-black text-xl">עלות חודשית</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-gray-300 shadow-sm">
                      <p className="font-heebo font-bold text-gray-900 text-xl">₪800-1,200</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 px-6 py-3 rounded-xl shadow-lg">
                      <p className="font-heebo font-bold text-white text-xl">₪600-900</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <p className="text-3xl font-heebo font-black text-purple-600 mb-2">5 דקות</p>
                <p className="text-sm text-gray-600 font-assistant">זמן ממוצע</p>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <p className="text-3xl font-heebo font-black text-purple-600 mb-2">15,000+</p>
                <p className="text-sm text-gray-600 font-assistant">משפחות חסכו</p>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <p className="text-3xl font-heebo font-black text-purple-600 mb-2">₪2,400</p>
                <p className="text-sm text-gray-600 font-assistant">חיסכון שנתי</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', opacity: 0 }}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-heebo text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                התחילו לחסוך עכשיו
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-600 font-assistant mt-4">
                ללא עלות • ללא התחייבות
              </p>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Main Mission Card */}
            
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50 relative">
        
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-royal-purple mb-4">
              שאלות נפוצות
            </h2>
            <p className="text-lg text-gray-600 font-assistant">
              כל מה שרציתם לדעת על התהליך
            </p>
          </div>

          <div className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-royal-purple font-heebo">
                    האם השירות באמת חינמי?
                  </h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 font-assistant leading-relaxed">
                    כן, השירות חינמי לחלוטין! אנחנו מקבלים עמלה מהספקים כשאתם עוברים אליהם, 
                    אבל זה לא משפיע על המחירים שאתם מקבלים. אתם לא משלמים לנו כלום.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-royal-purple font-heebo">
                    כמה זמן לוקח התהליך?
                  </h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 font-assistant leading-relaxed">
                    הניתוח לוקח כמה דקות בלבד. המעבר בפועל יכול לקחת 7-14 ימי עסקים, 
                    תלוי בספק. אנחנו נטפל בכל הניירת עבורכם.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-royal-purple font-heebo">
                    מה קורה אם אני לא מרוצה מהמעבר?
                  </h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 font-assistant leading-relaxed">
                    אתם תמיד יכולים לחזור לספק הקודם או לעבור לספק אחר. 
                    אנחנו כאן לתמוך בכם לאורך כל הדרך ולוודא שאתם מרוצים.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-royal-purple font-heebo">
                    האם המידע שלי מוגן?
                  </h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 font-assistant leading-relaxed">
                    בהחלט! אנחנו משתמשים בהצפנה מתקדמת וכל המידע מוגן לפי התקנים הגבוהים ביותר. 
                    המידע שלכם לא יועבר לצדדים שלישיים ללא אישורכם המפורש.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-royal-purple font-heebo">
                    האם יש מחויבות לתקופה מסוימת?
                  </h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 font-assistant leading-relaxed">
                    לא, אין שום מחויבות כלפינו. התחייבויות קיימות רק מול הספק החדש שתבחרו, 
                    בהתאם לתנאי החוזה איתו. אנחנו נסביר לכם את כל התנאים לפני החתימה.
                  </p>
                </div>
              </details>
            </Card>
          </div>
        </div>
      </section>


      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gray-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gray-700 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-heebo font-bold">Switch IL</h3>
                  <p className="text-gray-300 text-sm font-assistant">פלטפורמת החיסכון המובילה בישראל</p>
                </div>
              </div>
              <p className="text-gray-300 font-assistant leading-relaxed mb-8">
                אנחנו עוזרים לישראלים לחסוך אלפי שקלים בשנה על
                חשבונות הבית. תהליך פשוט, מהיר ובטוח.
              </p>
            </div>

            {/* Services */}
            <div className="lg:col-span-1">
              <h4 className="text-xl font-heebo font-semibold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                שירותים
              </h4>
              <ul className="space-y-4 font-assistant">
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-gray-100 transition-colors duration-200 group">
                    <Smartphone className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    סלולר
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-gray-100 transition-colors duration-200 group">
                    <Wifi className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    אינטרנט
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-gray-100 transition-colors duration-200 group">
                    <Tv className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    טלוויזיה
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-gray-100 transition-colors duration-200 group">
                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    חשמל
                  </a>
                </li>
              </ul>
            </div>

            {/* Links */}
            <div className="lg:col-span-1">
              <h4 className="text-xl font-heebo font-semibold mb-6">קישורים מהירים</h4>
              <ul className="space-y-4 font-assistant">
                <li>
                  <a href="#" className="text-gray-300 hover:text-gray-100 transition-colors duration-200">
                    אודות
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-gray-100 transition-colors duration-200">
                    תנאי שימוש
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-gray-100 transition-colors duration-200">
                    מדיניות פרטיות
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-gray-100 transition-colors duration-200">
                    שאלות נפוצות
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-1">
              <h4 className="text-xl font-heebo font-semibold mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                צור קשר
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                  <p className="text-gray-300 text-sm font-assistant mb-1">טלפון</p>
                  <p className="text-white font-semibold font-heebo">*3456</p>
                  <p className="text-gray-400 text-xs font-assistant">חיוב שיחה</p>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                  <p className="text-gray-300 text-sm font-assistant mb-1">מייל תמיכה</p>
                  <p className="text-white font-semibold font-mono text-sm">support@switchil.co.il</p>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                  <p className="text-gray-300 text-sm font-assistant mb-1">שעות פעילות</p>
                  <p className="text-white font-semibold font-heebo">א'-ה' 8:00-20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-assistant">
                <span>© 2024 Switch IL. כל הזכויות שמורות.</span>
              </div>
              <div className="flex items-center gap-6 text-sm font-assistant">
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-200">
                  מדיניות פרטיות
                </a>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-200">
                  תנאי שימוש
                </a>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-200">
                  אודות
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick Actions Section */}
      
      
      {/* Category Completion Banner */}
      <CategoryCompletionBanner
        isVisible={showBanner}
        selectedCategory={bannerCategory}
        currentAmount={selectedCategories[bannerCategory]?.amount || ''}
        onAmountChange={handleAmountChange}
        onCheckAnother={handleCheckAnother}
        onProceedToPlans={handleProceedToPlans}
        onClose={handleCloseBanner}
      />

      {/* Back to Top Button */}
      <BackToTop />
    </div>;
};
export default Home;