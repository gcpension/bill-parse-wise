import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Wifi, Smartphone, Tv, CheckCircle, ArrowRight, Phone, Router, Lightbulb, Cable, Plug, WifiOff, Battery, Monitor, Tablet, Headphones, Radio, Satellite, X, Sparkles, TrendingUp, Star, Clock, FileText, Search, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
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
import SimpleStepsBanner from '@/components/marketing/SimpleStepsBanner';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import EnhancedAmountInput from '@/components/home/EnhancedAmountInput';

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerCategory, setBannerCategory] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return <div className="min-h-screen bg-white relative overflow-hidden pt-16">{/* Add padding-top to account for fixed navbar */}
      {/* Sticky Top Navigation Bar with scroll effect - Mobile Optimized */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md py-2 md:py-3" 
          : "bg-white border-b border-gray-200 py-3 md:py-4"
      )}>
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-light text-cyan-600 font-heebo">
                EasySwitch
              </h1>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-all touch-button min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95 active:bg-gray-200"
              aria-label="תפריט"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8 rtl:space-x-reverse">
              <a href="/" className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors font-heebo text-sm lg:text-base">
                דף הבית
              </a>
              <a href="/magazine" className="text-gray-600 font-medium hover:text-cyan-600 transition-colors font-heebo text-sm lg:text-base">
                מגזין
              </a>
              <a href="/tips" className="text-gray-600 font-medium hover:text-cyan-600 transition-colors font-heebo text-sm lg:text-base">
                טיפים
              </a>
              <a href="/about" className="text-gray-600 font-medium hover:text-cyan-600 transition-colors font-heebo text-sm lg:text-base">
                אודות
              </a>
              <a href="/contact" className="text-gray-600 font-medium hover:text-cyan-600 transition-colors font-heebo text-sm lg:text-base">
                צור קשר
              </a>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 pb-2 border-t border-gray-100 pt-3"
              >
                <div className="flex flex-col space-y-1">
                  {[
                    { href: '/', label: 'דף הבית', active: true },
                    { href: '/magazine', label: 'מגזין' },
                    { href: '/tips', label: 'טיפים' },
                    { href: '/about', label: 'אודות' },
                    { href: '/contact', label: 'צור קשר' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "px-4 py-4 rounded-xl font-medium font-heebo text-base transition-all touch-card min-h-[48px] flex items-center",
                        link.active
                          ? "bg-cyan-50 text-cyan-600"
                          : "text-gray-600 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98]"
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>


      {/* Hero Section with Clean Background */}
      <section className="relative py-6 lg:py-8 overflow-hidden">
        {/* Hand-drawn sketch element - top right */}
        <div className="absolute top-8 right-12 w-[160px] h-[160px] pointer-events-none opacity-75">
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Light bulb - smart idea */}
            <g transform="translate(85, 20)">
              {/* Bulb shape */}
              <circle cx="0" cy="0" r="14" fill="none" stroke="#2d3748" strokeWidth="2.5"/>
              {/* Filament inside */}
              <path d="M -4,-2 Q 0,-6 4,-2" stroke="#2d3748" strokeWidth="1.5" fill="none"/>
              <line x1="0" y1="-2" x2="0" y2="4" stroke="#2d3748" strokeWidth="1.5"/>
              {/* Base of bulb */}
              <rect x="-5" y="12" width="10" height="8" fill="none" stroke="#2d3748" strokeWidth="2"/>
              <line x1="-5" y1="15" x2="5" y2="15" stroke="#2d3748" strokeWidth="1.5"/>
              <line x1="-5" y1="17" x2="5" y2="17" stroke="#2d3748" strokeWidth="1.5"/>
              {/* Light rays */}
              <g stroke="#2d3748" strokeWidth="2" strokeLinecap="round">
                <line x1="-18" y1="-8" x2="-22" y2="-10"/>
                <line x1="-14" y1="-14" x2="-16" y2="-18"/>
                <line x1="14" y1="-14" x2="16" y2="-18"/>
                <line x1="18" y1="-8" x2="22" y2="-10"/>
                <line x1="-18" y1="6" x2="-22" y2="8"/>
                <line x1="18" y1="6" x2="22" y2="8"/>
              </g>
            </g>
            
            {/* Piggy bank / savings symbol */}
            <g transform="translate(70, 75)">
              {/* Body */}
              <ellipse cx="0" cy="0" rx="16" ry="12" fill="none" stroke="#2d3748" strokeWidth="2"/>
              {/* Snout */}
              <ellipse cx="14" cy="0" rx="4" ry="3" fill="none" stroke="#2d3748" strokeWidth="2"/>
              {/* Ear */}
              <path d="M -8,-10 Q -6,-14 -4,-10" fill="none" stroke="#2d3748" strokeWidth="2"/>
              {/* Legs */}
              <line x1="-8" y1="10" x2="-8" y2="16" stroke="#2d3748" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="10" x2="8" y2="16" stroke="#2d3748" strokeWidth="2" strokeLinecap="round"/>
              {/* Coin slot */}
              <line x1="-4" y1="-8" x2="4" y2="-8" stroke="#2d3748" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
            
            {/* Coins falling */}
            <g stroke="#2d3748" fill="none" strokeWidth="2">
              <circle cx="95" cy="55" r="5"/>
              <text x="95" y="58" textAnchor="middle" fill="#2d3748" fontSize="8" fontWeight="bold">₪</text>
              
              <circle cx="105" cy="65" r="4"/>
              <circle cx="88" cy="62" r="3.5"/>
            </g>
            
            {/* Dashed arrow connecting bulb to piggy bank */}
            <path
              d="M 82,48 Q 75,58 72,68"
              stroke="#2d3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="3,3"
            />
            <path
              d="M 72,68 L 74,63 M 72,68 L 77,67"
              stroke="#2d3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Sparkles */}
            <g stroke="#2d3748" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M 60,25 L 60,28 M 58,26.5 L 62,26.5"/>
              <path d="M 110,42 L 110,45 M 108,43.5 L 112,43.5"/>
            </g>
          </svg>
        </div>
        
        {/* EASYSWITCH branding - broken text style */}
        <div className="absolute top-8 left-8 pointer-events-none">
          <svg width="240" height="120" viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Purple gradient */}
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#7e22ce', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* EASY text with slight breaks */}
            <g transform="translate(120, 40)">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="url(#textGradient)"
                fontSize="36"
                fontWeight="900"
                fontFamily="'Anton', 'Oswald', 'Bebas Neue', sans-serif"
                letterSpacing="5"
                style={{ 
                  filter: 'drop-shadow(2px 2px 4px rgba(126, 34, 206, 0.3))',
                  textTransform: 'uppercase'
                }}
                transform="rotate(-3)"
              >
                EASY
              </text>
            </g>
            
            {/* SWITCH text with slight breaks and offset */}
            <g transform="translate(120, 80)">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="url(#textGradient)"
                fontSize="36"
                fontWeight="900"
                fontFamily="'Anton', 'Oswald', 'Bebas Neue', sans-serif"
                letterSpacing="5"
                style={{ 
                  filter: 'drop-shadow(2px 2px 4px rgba(126, 34, 206, 0.3))',
                  textTransform: 'uppercase'
                }}
                transform="rotate(2)"
              >
                SWITCH
              </text>
            </g>
            
            {/* Magic wand sketch - pencil style below SWITCH */}
            <g transform="translate(120, 105)">
              {/* Wand stick */}
              <line x1="-12" y1="8" x2="0" y2="-4" stroke="#2d3748" strokeWidth="2" strokeLinecap="round"/>
              {/* Star at top */}
              <path d="M 0,-4 L 1.5,-8 L 3,-4 L 7,-2.5 L 3,-1 L 1.5,3 L 0,-1 L -4,-2.5 Z" fill="none" stroke="#2d3748" strokeWidth="1.5"/>
              {/* Sparkles around wand - hand-drawn style */}
              <g stroke="#2d3748" fill="none" strokeWidth="1.5" strokeLinecap="round">
                <path d="M -15,10 L -15,12 M -16,11 L -14,11"/>
                <path d="M -8,6 L -8,8 M -9,7 L -7,7"/>
                <circle cx="-18" cy="13" r="1" strokeWidth="1.2"/>
              </g>
            </g>
            
            {/* Decorative elements */}
            <circle cx="30" cy="30" r="3" fill="#9333ea" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="210" cy="50" r="2.5" fill="#a855f7" opacity="0.6">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="40" cy="95" r="2" fill="#7e22ce" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.2s" repeatCount="indefinite"/>
            </circle>
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
        
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10 py-4 md:py-6 lg:py-8">
          <div className="text-center">
            
            {/* Compact Title - Mobile Optimized */}
            <div className="mb-3 animate-fade-in opacity-0" style={{
              animationDelay: '0.2s',
              animationFillMode: 'forwards'
            }}>
              <h1 className="relative">
                {/* Main Text - Responsive sizing */}
                <span className="relative block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light font-assistant leading-tight text-foreground">
                  <span className="block">
                    באיזה תחום תרצו
                  </span>
                  <span className="block mt-1 md:mt-2">
                    להתחיל <span className="text-purple-700 font-medium">לחסוֹך</span> היום?
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
                <p className="text-base lg:text-lg text-gray-700 font-light max-w-3xl leading-relaxed font-heebo">
                  אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Categories Section - Enhanced Carousel */}
      <section id="services" className="bg-white relative scroll-mt-20 pt-6">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl pb-12">
          {/* Category Selection - Swipeable Carousel */}
          <CategoryCarousel
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
          />

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

      {/* Never Been Easier Section - Elegant Purple */}
      <section ref={whyChooseUs.elementRef} className={`relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 py-20 transition-all duration-700 ${whyChooseUs.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="px-6 py-2 rounded-full bg-purple-100 border border-purple-200">
                <span className="text-purple-700 font-normal text-sm font-heebo">העידן החדש של מעברים</span>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-heebo">
              מעולם לא היה{" "}
              <span className="relative inline-block text-purple-600">
                קל יותר
                <svg className="absolute -bottom-2 left-0 right-0 h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,7 Q50,0 100,7 T200,7" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                </svg>
              </span>
              {" "}לבצע מעבר
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-heebo font-light">
              שכחתם מהבירוקרטיה, השיחות האינסופיות והטפסים המסובכים
            </p>
          </div>

          {/* Process Flow - Elegant Cards */}
          <div className="relative mb-16">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold text-2xl mb-6 font-['Rubik'] shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-110">
                  1
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Rubik']">
                  מזינים פרטים
                </h3>
                <p className="text-gray-600 leading-relaxed font-['Rubik'] max-w-xs mx-auto mb-4">
                  אתם מספרים לנו על השירותים הנוכחיים שלכם
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700 font-['Rubik']">2 דקות</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-2xl mb-6 font-['Rubik'] shadow-lg shadow-purple-600/30 group-hover:shadow-xl group-hover:shadow-purple-600/40 transition-all duration-300 group-hover:scale-110">
                  2
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Rubik']">
                  אנחנו מנתחים
                </h3>
                <p className="text-gray-600 leading-relaxed font-['Rubik'] max-w-xs mx-auto mb-4">
                  המערכת שלנו סורקת את כל השוק ומוצאת את ההצעות הטובות ביותר
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700 font-['Rubik']">רגע קט</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-700 to-purple-900 text-white font-bold text-2xl mb-6 font-['Rubik'] shadow-lg shadow-purple-700/30 group-hover:shadow-xl group-hover:shadow-purple-700/40 transition-all duration-300 group-hover:scale-110">
                  3
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Rubik']">
                  מבצעים מעבר
                </h3>
                <p className="text-gray-600 leading-relaxed font-['Rubik'] max-w-xs mx-auto mb-4">
                  אנחנו מטפלים בכל הניירת, השיחות והתיאומים
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700 font-['Rubik']">אוטומטי</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits - Elegant Grid */}
          <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-10 border border-purple-100 shadow-xl shadow-purple-500/5">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-10 font-['Rubik']">
              מה זה אומר בשבילכם?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-lg font-['Rubik']">חוסכים זמן</h4>
                  <p className="text-gray-600 font-['Rubik']">5 דקות במקום שעות של חיפושים</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-lg font-['Rubik']">ללא מאמץ</h4>
                  <p className="text-gray-600 font-['Rubik']">אנחנו עושים את כל העבודה בשבילכם</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-lg font-['Rubik']">אפס ניירת</h4>
                  <p className="text-gray-600 font-['Rubik']">הכל דיגיטלי, פשוט ומהיר</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-lg font-['Rubik']">מובטח</h4>
                  <p className="text-gray-600 font-['Rubik']">מעקב מלא עד סיום התהליך</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Button 
              onClick={() => {
                const servicesSection = document.getElementById('services');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-10 py-7 rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 font-heebo font-normal"
            >
              בואו נתחיל לחסוך
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Comparison Cards */}
      <section ref={comparisonSection.elementRef} className={`bg-white py-10 transition-all duration-700 ${comparisonSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
          <h2 className="text-2xl lg:text-3xl font-heebo font-light text-center text-gray-900 mb-10">
            ההבדל בין היום ל-2025
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Old Way */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full mb-3">
                  <span className="text-2xl">😓</span>
                </div>
                <h3 className="text-xl font-heebo font-normal text-gray-700">הדרך הישנה</h3>
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
                <h3 className="text-xl font-heebo font-normal text-cyan-900">הדרך החדשה</h3>
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
                <li className="flex items-center gap-2 font-assistant font-normal">
                  <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <span>עלות: ₪650/חודש</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-cyan-200 text-center">
                <span className="inline-flex items-center gap-2 text-cyan-700 font-heebo font-normal">
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
            <h2 className="text-3xl lg:text-4xl font-heebo font-light text-cyan-700 mb-4">
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
                  <h3 className="text-lg font-normal text-cyan-700 font-heebo">
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
                  <h3 className="text-lg font-normal text-cyan-700 font-heebo">
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
                  <h3 className="text-lg font-normal text-cyan-700 font-heebo">
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
                  <h3 className="text-lg font-normal text-cyan-700 font-heebo">
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
                  <h3 className="text-lg font-normal text-cyan-700 font-heebo">
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


      {/* Testimonials Section */}
      <TestimonialsSection />

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
                  <h3 className="text-2xl font-heebo font-light">Switch IL</h3>
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
              <h4 className="text-xl font-heebo font-normal mb-6 flex items-center gap-2">
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
              <h4 className="text-xl font-heebo font-normal mb-6">קישורים מהירים</h4>
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
              <h4 className="text-xl font-heebo font-normal mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                צור קשר
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                  <p className="text-gray-300 text-sm font-assistant mb-1">טלפון</p>
                  <p className="text-white font-normal font-heebo">*3456</p>
                  <p className="text-gray-400 text-xs font-assistant">חיוב שיחה</p>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                  <p className="text-gray-300 text-sm font-assistant mb-1">מייל תמיכה</p>
                  <p className="text-white font-normal font-mono text-sm">support@switchil.co.il</p>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                  <p className="text-gray-300 text-sm font-assistant mb-1">שעות פעילות</p>
                  <p className="text-white font-normal font-heebo">א'-ה' 8:00-20:00</p>
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
      
      
      {/* Enhanced Amount Input */}
      <EnhancedAmountInput isVisible={showBanner} selectedCategory={bannerCategory} currentAmount={selectedCategories[bannerCategory]?.amount || ''} onAmountChange={handleAmountChange} onCheckAnother={handleCheckAnother} onProceedToPlans={handleProceedToPlans} onClose={handleCloseBanner} />

      {/* Back to Top Button */}
      <BackToTop />
    </div>;
};
export default Home;