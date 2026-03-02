import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Wifi, Smartphone, Tv, CheckCircle, ArrowRight, Phone, X, Sparkles, TrendingUp, Star, Clock, FileText, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import electricityFamily from '@/assets/electricity-family.jpg';
import cellularFamily from '@/assets/cellular-family.jpg';
import internetFamily from '@/assets/internet-family.jpg';
import tvFamily from '@/assets/tv-family.jpg';
import BackToTop from '@/components/BackToTop';
import { Navigation } from '@/components/Navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { usePageMeta } from '@/hooks/usePageMeta';
import { QuickActions } from '@/components/QuickActions';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import EnhancedAmountInput from '@/components/home/EnhancedAmountInput';
import { StickyCtaButton } from '@/components/mobile';

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerCategory, setBannerCategory] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, {
    provider: string;
    amount: string;
    selected: boolean;
    lines?: number;
  }>>({
    triple: {
      provider: '',
      amount: '',
      selected: false
    },
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
  const handleProviderChange = (provider: string) => {
    if (bannerCategory) {
      setSelectedCategories(prev => ({
        ...prev,
        [bannerCategory]: {
          ...prev[bannerCategory],
          provider
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
      {/* Unified Navigation */}
      <Navigation />


      {/* Hero Section - Clean & Modern */}
      <section className="relative py-10 md:py-14 lg:py-16 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          <div className="text-center">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light font-assistant leading-tight text-foreground"
            >
              <span className="block">באיזה תחום תרצו</span>
              <span className="block mt-1 md:mt-2">
                להתחיל <span className="text-primary font-medium">לחסוֹך</span> היום?
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-base lg:text-lg text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed font-heebo"
            >
              אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Button
                size="lg"
                onClick={() => navigate('/analyze')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg md:text-xl font-bold px-10 py-6 md:px-12 md:py-7 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 min-h-[56px]"
              >
                בדקו כמה תחסכו ←
              </Button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4"
            >
              {[
                { icon: Star, text: '+15,000 משפחות' },
                { icon: TrendingUp, text: 'חיסכון ממוצע 250 ₪/חודש' },
                { icon: CheckCircle, text: '100% חינם' },
              ].map((item, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border text-sm text-muted-foreground font-medium">
                  <item.icon className="w-3.5 h-3.5 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clean Categories Section - Enhanced Carousel */}
      <section id="services" className="bg-white relative scroll-mt-20 pt-2">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl pb-4">
          {/* Category Selection - Swipeable Carousel */}
          <CategoryCarousel
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
          />
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

          {/* Process Flow - Animated Cards */}
          <div className="relative mb-16">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { num: 1, title: 'מזינים פרטים', desc: 'אתם מספרים לנו על השירותים הנוכחיים שלכם', badge: '2 דקות', badgeIcon: Clock, gradient: 'from-purple-500 to-purple-700' },
                { num: 2, title: 'אנחנו מנתחים', desc: 'המערכת שלנו סורקת את כל השוק ומוצאת את ההצעות הטובות ביותר', badge: 'רגע קט', badgeIcon: Sparkles, gradient: 'from-purple-600 to-purple-800' },
                { num: 3, title: 'מבצעים מעבר', desc: 'אנחנו מטפלים בכל הניירת, השיחות והתיאומים', badge: 'אוטומטי', badgeIcon: CheckCircle, gradient: 'from-purple-700 to-purple-900' },
              ].map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} text-white font-bold text-2xl mb-6 font-['Rubik'] shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-shadow duration-300`}
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Rubik']">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-['Rubik'] max-w-xs mx-auto mb-4">{step.desc}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
                    <step.badgeIcon className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700 font-['Rubik']">{step.badge}</span>
                  </div>
                </motion.div>
              ))}
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
      <EnhancedAmountInput 
        isVisible={showBanner} 
        selectedCategory={bannerCategory} 
        currentAmount={selectedCategories[bannerCategory]?.amount || ''} 
        onAmountChange={handleAmountChange} 
        onCheckAnother={handleCheckAnother} 
        onProceedToPlans={handleProceedToPlans} 
        onClose={handleCloseBanner}
        selectedProvider={selectedCategories[bannerCategory]?.provider || ''}
        onProviderChange={handleProviderChange}
      />

      {/* Sticky CTA Button - Mobile Only */}
      <StickyCtaButton
        isVisible={!showBanner && Object.values(selectedCategories).some(c => c.selected)}
        selectedCount={Object.values(selectedCategories).filter(c => c.selected).length}
        totalSavings={Object.values(selectedCategories)
          .filter(c => c.selected && c.amount)
          .reduce((sum, c) => sum + (parseFloat(c.amount) || 0) * 0.3 * 12, 0)}
        onClick={handleStartAnalysis}
        variant={Object.values(selectedCategories).some(c => c.selected && c.amount) ? 'results' : 'start'}
      />

      {/* Back to Top Button */}
      <BackToTop />
    </div>;
};
export default Home;