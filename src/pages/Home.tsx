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
  return <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-50 border-b border-gray-200 py-4">
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


      {/* Clean Header Section */}
      <section className="bg-gradient-to-b from-white via-gray-50 to-gray-50 py-12 lg:py-16 pb-8 lg:pb-10 relative overflow-hidden">
        {/* Background illustration */}
        <div className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroBackgroundIllustration})`
      }}>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary-glow/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          <div className="text-center">
            
            {/* Clean subtitle badge */}
            <div className="inline-block mb-8 animate-fade-in opacity-0" style={{
            animationDelay: '0.1s',
            animationFillMode: 'forwards'
          }}>
              
            </div>
            
            {/* Main highlighted title with gradient background */}
            <div className="relative inline-block mb-6 animate-fade-in opacity-0" style={{
            animationDelay: '0.3s',
            animationFillMode: 'forwards'
          }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-glow/15 to-primary/10 rounded-3xl blur-xl"></div>
              <h1 className="relative text-4xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent leading-tight px-8 py-4">
                באיזה תחום תרצו
                <br />
                להתחיל לחסוך היום?
              </h1>
            </div>
            
            <p className="text-lg lg:text-xl text-muted-foreground mt-8 font-medium max-w-3xl mx-auto leading-relaxed animate-fade-in opacity-0" style={{
            animationDelay: '0.5s',
            animationFillMode: 'forwards'
          }}>
              אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
            </p>
          </div>
        </div>
      </section>

      {/* Clean Categories Section - Enhanced with animations */}
      <section id="services" className="pt-8 pb-16 bg-gray-50 relative scroll-mt-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
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
                    className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
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
                          ? 'bg-gradient-to-t from-cyan-600/90 via-cyan-500/65 to-blue-400/45' 
                          : 'bg-gradient-to-t from-gray-700/90 via-gray-600/60 to-gray-500/35 group-hover:from-cyan-600/90 group-hover:via-cyan-500/60'
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
          <SimpleStepsBanner />

          {/* Clean CTA Section - Hidden when banner is visible */}
          {!showBanner}

          {/* Clean info section */}
          <div className="text-center mt-12 max-w-4xl mx-auto">
            
          </div>

          {/* How It Works - Clear & Large Section */}
          
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
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
          {/* Clean Comparison Section - 2024 vs 2025 */}
          <div className="mb-20">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl lg:text-4xl font-heebo font-bold text-cyan-700 mb-3">
                איך זה נראה היום לעומת 2025?
              </h2>
              <p className="text-lg text-gray-600 font-assistant max-w-2xl mx-auto">
                השוואה פשוטה שמראה את ההבדל
              </p>
            </div>

            {/* Clean Comparison Grid */}
            <div className="max-w-5xl mx-auto animate-fade-in" style={{
              animationDelay: '0.2s',
              animationFillMode: 'forwards',
              opacity: 0
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Today Column */}
                <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-heebo font-bold text-gray-700">היום</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="text-gray-400 text-xl">⏰</div>
                      <div>
                        <p className="font-heebo font-semibold text-gray-700">3-5 שעות</p>
                        <p className="text-sm text-gray-500 font-assistant">משך זמן ממוצע</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-gray-400 text-xl">📞</div>
                      <div>
                        <p className="font-heebo font-semibold text-gray-700">שיחות רבות</p>
                        <p className="text-sm text-gray-500 font-assistant">תיאומים מתישים</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-gray-400 text-xl">📝</div>
                      <div>
                        <p className="font-heebo font-semibold text-gray-700">טפסים מורכבים</p>
                        <p className="text-sm text-gray-500 font-assistant">מילוי ידני</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-gray-400 text-xl">🔍</div>
                      <div>
                        <p className="font-heebo font-semibold text-gray-700">חיפוש מפוזר</p>
                        <p className="text-sm text-gray-500 font-assistant">בכמה אתרים</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
                    <p className="text-sm text-gray-500 font-assistant mb-2">עלות חודשית</p>
                    <p className="text-2xl font-heebo font-bold text-gray-700">₪800-1,200</p>
                  </div>
                </div>

                {/* 2025 Column - Highlighted */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border-2 border-cyan-300 relative overflow-hidden">
                  {/* Subtle decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/20 rounded-full -mr-16 -mt-16"></div>
                  
                  <div className="text-center mb-8 relative">
                    <h3 className="text-2xl font-heebo font-bold text-cyan-700">2025</h3>
                  </div>
                  
                  <div className="space-y-6 relative">
                    <div className="flex items-start gap-4">
                      <div className="text-cyan-600 text-xl">⚡</div>
                      <div>
                        <p className="font-heebo font-semibold text-cyan-900">5 דקות</p>
                        <p className="text-sm text-cyan-700 font-assistant">תהליך מהיר</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-cyan-600 text-xl">✨</div>
                      <div>
                        <p className="font-heebo font-semibold text-cyan-900">אפס שיחות</p>
                        <p className="text-sm text-cyan-700 font-assistant">הכל דיגיטלי</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-cyan-600 text-xl">💻</div>
                      <div>
                        <p className="font-heebo font-semibold text-cyan-900">טופס חכם</p>
                        <p className="text-sm text-cyan-700 font-assistant">מילוי קל ומהיר</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-cyan-600 text-xl">🎯</div>
                      <div>
                        <p className="font-heebo font-semibold text-cyan-900">כל ההצעות</p>
                        <p className="text-sm text-cyan-700 font-assistant">במקום אחד</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t-2 border-cyan-200 text-center relative">
                    <p className="text-sm text-cyan-700 font-assistant mb-2">עלות חודשית</p>
                    <p className="text-2xl font-heebo font-bold text-cyan-900">₪600-900</p>
                    <div className="mt-3 inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-1.5 rounded-full text-sm font-heebo">
                      <span>חיסכון עד ₪300</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean CTA */}
            <div className="text-center mt-12 animate-fade-in" style={{
              animationDelay: '0.4s',
              animationFillMode: 'forwards',
              opacity: 0
            }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-heebo text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all rounded-xl" 
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
      

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
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