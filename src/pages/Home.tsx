import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Wifi, Smartphone, Tv, CheckCircle, ArrowRight, Phone, Router, Lightbulb, Cable, Plug, WifiOff, Battery, Monitor, Tablet, Headphones, Radio, Satellite, X, Sparkles, TrendingUp, Star, Clock, FileText, Search, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import electricityFamily from '@/assets/electricity-family.jpg';
import cellularFamily from '@/assets/cellular-family.jpg';
import internetFamily from '@/assets/internet-family.jpg';
import tvFamily from '@/assets/tv-family.jpg';
import familySavingsHero from '@/assets/family-savings-hero.jpg';
import heroFamilyHome from '@/assets/hero-family-home.jpg';
import heroMinimalBackground from '@/assets/hero-minimal-background.jpg';
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

  // Scroll animations for different sections
  const stepsBanner = useScrollAnimation(0.1);
  const whyChooseUs = useScrollAnimation(0.1);
  const comparisonSection = useScrollAnimation(0.1);
  const faqSection = useScrollAnimation(0.1);

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
    servicesSection?.scrollIntoView({
      behavior: 'smooth'
    });
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
  return <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 py-4 relative z-50">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-cyan-600 font-heebo">
                EasySwitch
              </h1>
            </div>
            
            {/* Navigation Links on the right */}
            <div className="flex items-center space-x-8">
              <a href="/" className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors font-heebo">
                דף הבית
              </a>
              <a href="/magazine" className="text-gray-600 font-medium hover:text-cyan-600 transition-colors font-heebo">
                מגזין
              </a>
              <a href="/tips" className="text-gray-600 font-medium hover:text-cyan-600 transition-colors font-heebo">
                טיפים
              </a>
              <a href="/about" className="text-gray-600 font-medium hover:text-cyan-600 transition-colors font-heebo">
                אודות
              </a>
              <a href="/contact" className="text-gray-600 font-medium hover:text-cyan-600 transition-colors font-heebo">
                צור קשר
              </a>
            </div>
          </div>
        </div>
      </nav>


      {/* Hero Section with Clean Background */}
      <section className="relative py-6 lg:py-8 overflow-hidden">
        {/* Hand-drawn sketch element - top right */}
        <div className="absolute top-8 right-12 w-[160px] h-[160px] pointer-events-none opacity-75">
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Money/savings symbols */}
            <circle cx="85" cy="25" r="12" fill="none" stroke="#2d3748" strokeWidth="2" strokeDasharray="3,2"/>
            <text x="85" y="30" textAnchor="middle" fill="#2d3748" fontSize="14" fontWeight="bold">₪</text>
            
            {/* Curved arrow pointing to blob */}
            <path
              d="M 75,35 Q 65,45 55,52 Q 45,58 35,60"
              stroke="#2d3748"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="4,3"
            />
            <path
              d="M 35,60 L 38,55 M 35,60 L 40,62"
              stroke="#2d3748"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* "Switch" arrows in circle */}
            <circle cx="95" cy="55" r="10" fill="none" stroke="#2d3748" strokeWidth="1.8" strokeDasharray="2,2"/>
            <path d="M 92,52 L 98,52 L 96,50" stroke="#2d3748" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M 98,58 L 92,58 L 94,60" stroke="#2d3748" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            
            {/* Price comparison bars sketch */}
            <g transform="translate(75, 75)">
              <rect x="0" y="10" width="8" height="25" fill="none" stroke="#2d3748" strokeWidth="1.5"/>
              <rect x="12" y="0" width="8" height="35" fill="none" stroke="#2d3748" strokeWidth="1.5"/>
              <rect x="24" y="15" width="8" height="20" fill="none" stroke="#2d3748" strokeWidth="1.5"/>
              {/* Check mark on middle bar */}
              <path d="M 14,15 L 16,18 L 19,12" stroke="#2d3748" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </g>
            
            {/* Sparkles/stars for savings */}
            <g stroke="#2d3748" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M 100,15 L 100,18 M 98,16.5 L 102,16.5"/>
              <path d="M 68,28 L 68,30 M 67,29 L 69,29"/>
              <path d="M 108,68 L 108,71 M 106,69.5 L 110,69.5"/>
            </g>
            
            {/* "Save money" text suggestion in Hebrew style */}
            <path
              d="M 85,90 Q 78,92 70,92"
              stroke="#2d3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 84,95 Q 77,97 69,97"
              stroke="#2d3748"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        {/* Organic splatter shape */}
        <div className="absolute -top-20 -left-20 w-[320px] h-[320px] pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Main irregular organic splatter blob */}
            <g>
              {/* Central irregular blob */}
              <path
                d="M 45,85 
                   C 38,80 32,88 28,95 
                   C 24,102 22,110 25,118 
                   C 28,126 35,130 42,132 
                   L 38,140 L 45,138 
                   C 52,142 62,145 72,144 
                   C 82,143 92,140 100,135 
                   L 105,142 L 108,135 
                   C 118,130 128,125 136,118 
                   C 144,111 150,102 155,93 
                   C 160,84 162,74 158,66 
                   L 165,62 L 160,60 
                   C 156,52 148,46 138,44 
                   C 128,42 118,44 108,48 
                   L 105,40 L 100,46 
                   C 90,50 80,55 72,62 
                   L 68,55 L 65,62 
                   C 58,68 52,76 48,84 Z"
                fill="url(#starburstGradient)"
                opacity="0.95"
              />
              
              {/* Small splatter dots around */}
              <circle cx="170" cy="75" r="4" fill="url(#starburstGradient)" opacity="0.9"/>
              <circle cx="178" cy="85" r="3" fill="url(#starburstGradient)" opacity="0.85"/>
              <circle cx="165" cy="55" r="2.5" fill="url(#starburstGradient)" opacity="0.8"/>
              <circle cx="172" cy="95" r="2" fill="url(#starburstGradient)" opacity="0.75"/>
              
              <circle cx="20" cy="95" r="3.5" fill="url(#starburstGradient)" opacity="0.9"/>
              <circle cx="15" cy="105" r="2.5" fill="url(#starburstGradient)" opacity="0.8"/>
              <circle cx="25" cy="115" r="2" fill="url(#starburstGradient)" opacity="0.75"/>
              
              <circle cx="90" cy="50" r="3" fill="url(#starburstGradient)" opacity="0.85"/>
              <circle cx="98" cy="45" r="2" fill="url(#starburstGradient)" opacity="0.8"/>
              
              <circle cx="75" cy="148" r="2.5" fill="url(#starburstGradient)" opacity="0.85"/>
              <circle cx="85" cy="152" r="2" fill="url(#starburstGradient)" opacity="0.8"/>
            </g>
            
            {/* EASYSWITCH text - modern distorted style */}
            <g transform="translate(92, 95)">
              {/* Main EASY text with distortion */}
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="white"
                fontSize="17"
                fontWeight="700"
                fontFamily="'Montserrat', 'Poppins', 'Inter', sans-serif"
                letterSpacing="2"
                style={{ 
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))',
                  textTransform: 'uppercase'
                }}
                transform="skewX(-3) rotate(-2)"
              >
                EASY
              </text>
              
              {/* Main SWITCH text with opposite distortion */}
              <text
                x="0"
                y="18"
                textAnchor="middle"
                fill="white"
                fontSize="17"
                fontWeight="700"
                fontFamily="'Montserrat', 'Poppins', 'Inter', sans-serif"
                letterSpacing="2"
                style={{ 
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))',
                  textTransform: 'uppercase'
                }}
                transform="skewX(2) rotate(1)"
              >
                SWITCH
              </text>
            </g>
            
            {/* Gradient definition - Deep Rich Purple */}
            <defs>
              <linearGradient id="starburstGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#581c87', stopOpacity: 1 }} />
                <stop offset="33%" style={{ stopColor: '#6b21a8', stopOpacity: 1 }} />
                <stop offset="66%" style={{ stopColor: '#7e22ce', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src={middleSectionIllustration} 
            alt="" 
            className="w-full h-full object-contain object-center"
          />
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10 py-6 lg:py-8">
          <div className="text-center">
            
            {/* Compact Title */}
            <div className="mb-3 animate-fade-in opacity-0" style={{
              animationDelay: '0.2s',
              animationFillMode: 'forwards'
            }}>
              <h1 className="relative">
                {/* Main Text */}
                <span className="relative block text-5xl lg:text-6xl xl:text-7xl font-light font-assistant leading-tight text-foreground">
                  <span className="block">
                    באיזה תחום תרצו
                  </span>
                  <span className="block mt-2">
                    להתחיל <span className="text-purple-400 font-medium">לחסוך</span> היום?
                  </span>
                </span>
              </h1>
            </div>
            
            {/* Subtitle with Glass Effect */}
            <div className="animate-fade-in opacity-0 inline-block" style={{
              animationDelay: '0.4s',
              animationFillMode: 'forwards'
            }}>
              <div className="backdrop-blur-md bg-white/40 rounded-2xl px-6 py-2 border border-white/50 shadow-xl">
                <p className="text-base lg:text-lg text-gray-700 font-semibold max-w-3xl leading-relaxed">
                  אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Categories Section - Enhanced with animations */}
      <section id="services" className="bg-white relative scroll-mt-20 pt-6">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl pb-12">
          {/* Category Selection - Modern Image-Based Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(categoryData).map(([category, data], index) => {
              const Icon = data.icon;
              const isSelected = selectedCategories[category].selected;
              return (
                <div 
                  key={category} 
                  className="animate-fade-in opacity-0" 
                  style={{
                    animationDelay: `${0.6 + index * 0.1}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div 
                    className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={data.image} 
                        alt={data.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        isSelected 
                          ? 'bg-gradient-to-t from-cyan-300/80 via-cyan-200/50 to-blue-100/30' 
                          : 'bg-gradient-to-t from-gray-300/75 via-gray-200/45 to-gray-100/25 group-hover:from-cyan-300/75 group-hover:via-cyan-200/45'
                      }`}></div>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Top Section - Icon & Badge */}
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-2xl backdrop-blur-md transition-all duration-300 ${
                          isSelected 
                            ? 'bg-white/20 shadow-lg' 
                            : 'bg-white/10 group-hover:bg-white/20'
                        }`}>
                          <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        
                        {isSelected && (
                          <div className="bg-cyan-500 text-white rounded-full p-2 shadow-lg animate-scale-in">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Bottom Section - Title & Info */}
                      <div>
                        <h3 className="text-2xl font-heebo font-bold text-white mb-2">
                          {data.name}
                        </h3>
                        <p className="text-white/80 text-sm font-assistant mb-3">
                          {data.providers.length} ספקים זמינים
                        </p>
                        
                        {/* Selection Indicator */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                          isSelected 
                            ? 'bg-cyan-500 text-white shadow-lg' 
                            : 'bg-white/20 text-white group-hover:bg-white/30'
                        }`}>
                          <span className="text-sm font-heebo font-semibold">
                            {isSelected ? 'נבחר ✓' : 'לחץ לבחירה'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[slide-right_1.5s_ease-in-out]"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Steps Banner */}
          <div ref={stepsBanner.elementRef} className={`transition-all duration-700 ${stepsBanner.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <SimpleStepsBanner />
          </div>

          {/* Clean CTA Section - Hidden when banner is visible */}
          {!showBanner}

          {/* Clean info section */}
          <div className="text-center mt-12 max-w-4xl mx-auto">
            
          </div>

          {/* How It Works - Clear & Large Section */}
          
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section ref={whyChooseUs.elementRef} className={`bg-white relative transition-all duration-700 ${whyChooseUs.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-cyan-700 mb-6">
                למה שווה לבדוק אצלנו?
              </h2>
              <p className="text-xl text-gray-700 mb-8 font-assistant leading-relaxed">
                אנחנו לא רק מוצאים לכם חיסכון - אנחנו מבטיחים שהמעבר יהיה חלק, מהיר ובטוח
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-cyan-700 mb-2">
                      ניתוח מותאם אישית
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      המערכת שלנו בודקת את הצרכים הספציפיים שלכם ומוצאת את החבילות המתאימות ביותר
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-cyan-700 mb-2">
                      כיסוי מקיף לכל הבית
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      חשמל, סלולר, אינטרנט וטלוויזיה - בודקים הכול במקום אחד וחוסכים זמן
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-cyan-700 mb-2">
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
                <h3 className="text-lg font-semibold text-cyan-700 mb-4 font-heebo text-center">
                  יתרונות נוספים שחשוב לדעת
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 text-center">
                    <CheckCircle className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-cyan-700 mb-1 font-heebo text-sm">ללא התחייבות</h4>
                    <p className="text-xs text-gray-600 font-assistant">אתם מחליטים בסוף</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 text-center">
                    <CheckCircle className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-cyan-700 mb-1 font-heebo text-sm">מעקב אחרי התהליך</h4>
                    <p className="text-xs text-gray-600 font-assistant">עדכונים לאורך כל הדרך</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 text-center">
                    <CheckCircle className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-cyan-700 mb-1 font-heebo text-sm">תמיכה מלאה</h4>
                    <p className="text-xs text-gray-600 font-assistant">צוות מקצועי לרשותכם</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Illustration Side */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="w-full max-w-lg">
                <img src={familySavingsHero} alt="איור של אישה עובדת על השוואת תעריפי שירותי הבית" className="w-full h-auto" style={{
                mixBlendMode: 'multiply',
                backgroundColor: 'transparent'
              }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Comparison Cards */}
      <section ref={comparisonSection.elementRef} className={`bg-white py-10 transition-all duration-700 ${comparisonSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
          <h2 className="text-2xl lg:text-3xl font-heebo font-bold text-center text-gray-900 mb-10">
            ההבדל בין היום ל-2025
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Old Way */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full mb-3">
                  <span className="text-2xl">😓</span>
                </div>
                <h3 className="text-xl font-heebo font-bold text-gray-700">הדרך הישנה</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2 font-assistant">
                  <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>3-5 שעות של חיפושים</span>
                </li>
                <li className="flex items-center gap-2 font-assistant">
                  <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>עשרות שיחות טלפון</span>
                </li>
                <li className="flex items-center gap-2 font-assistant">
                  <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>טפסים מסובכים</span>
                </li>
                <li className="flex items-center gap-2 font-assistant">
                  <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>עלות: ₪950/חודש</span>
                </li>
              </ul>
            </div>

            {/* New Way */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-300 shadow-lg">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500 rounded-full mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heebo font-bold text-cyan-900">הדרך החדשה</h3>
              </div>
              <ul className="space-y-3 text-cyan-900">
                <li className="flex items-center gap-2 font-assistant">
                  <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <span>5 דקות בלבד</span>
                </li>
                <li className="flex items-center gap-2 font-assistant">
                  <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <span>אפס שיחות - הכל דיגיטלי</span>
                </li>
                <li className="flex items-center gap-2 font-assistant">
                  <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <span>טופס פשוט וחכם</span>
                </li>
                <li className="flex items-center gap-2 font-assistant font-bold">
                  <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <span>עלות: ₪650/חודש</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-cyan-200 text-center">
                <span className="inline-flex items-center gap-2 text-cyan-700 font-heebo font-bold">
                  <TrendingUp className="w-5 h-5" />
                  חיסכון ₪300 בחודש
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      

      {/* FAQ Section */}
      <section ref={faqSection.elementRef} className={`bg-white relative transition-all duration-700 ${faqSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-cyan-700 mb-4">
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
                  <h3 className="text-lg font-semibold text-cyan-700 font-heebo">
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
                  <h3 className="text-lg font-semibold text-cyan-700 font-heebo">
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
                  <h3 className="text-lg font-semibold text-cyan-700 font-heebo">
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
                  <h3 className="text-lg font-semibold text-cyan-700 font-heebo">
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
                  <h3 className="text-lg font-semibold text-cyan-700 font-heebo">
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
      <CategoryCompletionBanner isVisible={showBanner} selectedCategory={bannerCategory} currentAmount={selectedCategories[bannerCategory]?.amount || ''} onAmountChange={handleAmountChange} onCheckAnother={handleCheckAnother} onProceedToPlans={handleProceedToPlans} onClose={handleCloseBanner} />

      {/* Back to Top Button */}
      <BackToTop />
    </div>;
};
export default Home;