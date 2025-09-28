import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Zap, Wifi, Smartphone, Tv, CheckCircle, ArrowRight, Phone, Router, Lightbulb, Cable, Plug, WifiOff, Battery, Monitor, Tablet, Headphones, Radio, Satellite } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import { InteractiveProviderGrid } from '@/components/InteractiveProviderGrid';
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

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, { provider: string; amount: string; selected: boolean }>>({
    electricity: { provider: '', amount: '', selected: false },
    cellular: { provider: '', amount: '', selected: false },
    internet: { provider: '', amount: '', selected: false },
    tv: { provider: '', amount: '', selected: false }
  });
  const navigate = useNavigate();

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
    setSelectedCategories(prev => ({
      ...prev,
      [category]: { ...prev[category], selected: !prev[category].selected }
    }));
  };

  const handleProviderChange = (category: string, provider: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: { ...prev[category], provider }
    }));
  };

  const handleAmountChange = (category: string, amount: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: { ...prev[category], amount }
    }));
  };

  const handleStartAnalysis = () => {
    const selectedData = Object.entries(selectedCategories)
      .filter(([_, data]) => data.selected && data.provider && data.amount)
      .map(([category, data]) => ({ category, ...data }));

    if (selectedData.length === 0) {
      enhancedToast.warning({
        title: 'בחרו קטגוריה',
        description: 'יש לבחור לפחות קטגוריה אחת עם פרטי ספק וסכום'
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

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
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
        <Lightbulb className="absolute top-[15%] left-[8%] w-8 h-8 text-purple-500 opacity-20 animate-pulse" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <Smartphone className="absolute top-[25%] right-[12%] w-8 h-8 text-purple-600 opacity-20 animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <Wifi className="absolute top-[45%] left-[15%] w-7 h-7 text-royal-purple opacity-20 animate-pulse" style={{ animationDelay: '4s', animationDuration: '8s' }} />
        <Tv className="absolute bottom-[35%] right-[7%] w-7 h-7 text-purple-500 opacity-20 animate-pulse" style={{ animationDelay: '6s', animationDuration: '8s' }} />
        
        {/* Additional scattered elements */}
        <Phone className="absolute top-[60%] left-[5%] w-6 h-6 text-purple-400 opacity-15 animate-pulse" style={{ animationDelay: '1s', animationDuration: '10s' }} />
        <Router className="absolute top-[35%] right-[20%] w-6 h-6 text-purple-600 opacity-15 animate-pulse" style={{ animationDelay: '3s', animationDuration: '9s' }} />
        <Cable className="absolute bottom-[60%] left-[25%] w-5 h-5 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '5s', animationDuration: '12s' }} />
        <Plug className="absolute top-[80%] right-[8%] w-5 h-5 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '7s', animationDuration: '11s' }} />
        <WifiOff className="absolute bottom-[45%] right-[30%] w-5 h-5 text-purple-400 opacity-12 animate-pulse" style={{ animationDelay: '4.5s', animationDuration: '13s' }} />
        <Battery className="absolute top-[70%] left-[35%] w-5 h-5 text-purple-500 opacity-12 animate-pulse" style={{ animationDelay: '6.5s', animationDuration: '14s' }} />
        <Monitor className="absolute bottom-[25%] left-[40%] w-6 h-6 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '8s', animationDuration: '10s' }} />
        <Tablet className="absolute top-[50%] right-[40%] w-5 h-5 text-purple-400 opacity-12 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '15s' }} />
        <Headphones className="absolute bottom-[70%] right-[15%] w-5 h-5 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '9s', animationDuration: '12s' }} />
        <Radio className="absolute top-[85%] left-[20%] w-5 h-5 text-purple-400 opacity-12 animate-pulse" style={{ animationDelay: '3.5s', animationDuration: '11s' }} />
        <Satellite className="absolute bottom-[15%] right-[35%] w-6 h-6 text-purple-600 opacity-15 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '13s' }} />
        
        {/* Additional elements for better distribution */}
        <Zap className="absolute top-[30%] left-[30%] w-6 h-6 text-purple-500 opacity-15 animate-pulse" style={{ animationDelay: '10s', animationDuration: '9s' }} />
        <Phone className="absolute bottom-[50%] left-[60%] w-5 h-5 text-purple-400 opacity-12 animate-pulse" style={{ animationDelay: '11s', animationDuration: '14s' }} />
        <Lightbulb className="absolute top-[65%] right-[25%] w-5 h-5 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '12s', animationDuration: '10s' }} />
        <Wifi className="absolute bottom-[80%] left-[50%] w-6 h-6 text-purple-600 opacity-15 animate-pulse" style={{ animationDelay: '13s', animationDuration: '11s' }} />
      </div>

      {/* Clean Header Section */}
      <section className="bg-gray-50 py-16 lg:py-24 relative overflow-hidden">
        {/* Background illustration */}
        <div className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: `url(${heroBackgroundIllustration})` }}>
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
            <h2 className="text-3xl font-heebo font-medium text-royal-purple mb-4 animate-fade-in opacity-0"
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              בחרו את הקטגוריה שלכם
            </h2>
            <p className="text-lg text-purple-600 font-assistant animate-fade-in opacity-0"
               style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              קבלו המלצות מותאמות אישית והשוו מחירים בכל הקטגוריות
            </p>
          </div>
          
          {/* Category Cards Grid - Enhanced with staggered animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryData).map(([category, data], index) => {
              const Icon = data.icon;
              const isSelected = selectedCategories[category].selected;
              
              return (
                <Card 
                  key={category}
                  className={`bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 transform hover:scale-105 hover:-translate-y-1 animate-fade-in opacity-0 ${
                    isSelected ? 'ring-2 ring-purple-500 shadow-lg scale-105 md:col-span-4' : ''
                  }`}
                  style={{ 
                    animationDelay: `${0.6 + index * 0.1}s`, 
                    animationFillMode: 'forwards' 
                  }}
                  onClick={() => !isSelected && handleCategorySelect(category)}
                >
                  <CardContent className={`${isSelected ? 'p-6' : 'p-4'} ${isSelected ? '' : 'text-center'}`}>
                    {!isSelected ? (
                      // Compact view when not selected
                      <>
                        {/* Image illustration - Enhanced with hover effects */}
                        <div className="w-full h-16 mx-auto mb-3 overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105">
                          <img 
                            src={data.image}
                            alt={`איור ${data.name}`}
                            className="w-full h-full object-cover transition-all duration-300 hover:brightness-110"
                          />
                        </div>
                        
                        {/* Category title */}
                        <h3 className="text-base font-heebo font-medium text-purple-700 mb-3 transition-colors duration-200">
                          {data.name}
                        </h3>
                        
                        {/* Enhanced button with better animations */}
                        <Button 
                          className="w-full h-8 rounded-lg font-medium text-xs transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategorySelect(category);
                          }}
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            <Icon className="w-3 h-3" />
                            בחר {data.name}
                          </span>
                        </Button>
                      </>
                    ) : (
                      // Expanded view when selected
                      <>
                        {/* Category Header */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                              {data.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              השווה ספקים וחסוך בחשבונות
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategorySelect(category)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            ביטול
                          </Button>
                        </div>
                        
                        {/* Enhanced Form fields when selected */}
                        <div className="space-y-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                          <InteractiveProviderGrid
                            category={category as 'electricity' | 'cellular' | 'internet' | 'tv'}
                            value={selectedCategories[category].provider}
                            onValueChange={(value) => handleProviderChange(category, value)}
                          />
                          
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <span className="text-lg">₪</span>
                              סכום חודשי
                            </label>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="הזינו סכום בשקלים"
                                value={selectedCategories[category].amount}
                                onChange={(e) => handleAmountChange(category, e.target.value)}
                                className="h-12 pr-12 text-lg font-semibold bg-gray-50/80 border-gray-300 hover:border-purple-400 focus:border-purple-500 transition-all duration-300 rounded-xl"
                              />
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">
                                ₪
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status indicator */}
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-700 font-medium">קטגוריה נבחרה בהצלחה</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Clean CTA Section - Enhanced animations */}
          <div className="text-center mt-16">
            <Button 
              onClick={handleStartAnalysis}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-assistant font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center gap-3">
                <span>התחל ניתוח חיסכון</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </div>

          {/* Clean info section */}
          <div className="text-center mt-12 max-w-4xl mx-auto">
            <p className="text-gray-600 text-lg font-assistant leading-relaxed mb-8">
              אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר.
              <br />
              <span className="font-medium text-royal-purple">השירות חינם לחלוטין</span> - המשפחה הממוצעת חוסכת ₪2,400 בשנה.
            </p>
          </div>

          {/* Minimalist How It Works Section */}
          <div className="max-w-6xl mx-auto mt-32">
            <div className="py-20">
              {/* Clean Header */}
              <div className="text-center mb-20">
                <h2 className="text-5xl lg:text-6xl font-heebo font-light mb-8 text-royal-purple leading-tight">
                  אנחנו איתכם
                </h2>  
                <h3 className="text-4xl lg:text-5xl font-heebo font-bold mb-8 text-purple-700 leading-tight">
                  בכאונה קבוצה!
                </h3>
                <p className="text-lg text-gray-600 font-assistant leading-relaxed max-w-3xl mx-auto mt-8">
                  בסיטי היא פלטפורמת השוואה היחידה בישראל שיא הבין את הבעיה.
                  <br />
                  ביסוט אלכו אנחנו לא מפשטים למכור לכם ביסוט רק להחליף אותו ונכתוב שאנחנו
                  <br />
                  צריך שלכם לא משנה לנו באיזו היצע הנבחר - העיקר שתחסכו!
                </p>
              </div>

              {/* Clean Minimalist Steps */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-5xl mx-auto">
                
                {/* Step 1 */}
                <div className="text-center">
                  <div className="mb-12">
                    <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                      <img 
                        src={minimalistSelectionIcon}
                        alt="בחירת שירותים"
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="w-16 h-16 bg-royal-purple rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8">
                      1
                    </div>
                  </div>
                  <h3 className="text-2xl font-heebo font-bold text-royal-purple mb-6">בחירת שירותים</h3>
                  <p className="text-gray-600 leading-relaxed font-assistant text-lg">
                    בחרו את השירותים שאתם חוזים לבדוק וזינו את
                    הפרטים הנוכחיים שלכם
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="mb-12">
                    <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                      <img 
                        src={minimalistAnalysisIcon}
                        alt="ניתוח מתקדם"
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="w-16 h-16 bg-royal-purple rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8">
                      2
                    </div>
                  </div>
                  <h3 className="text-2xl font-heebo font-bold text-royal-purple mb-6">ניתוח מתקדם</h3>
                  <p className="text-gray-600 leading-relaxed font-assistant text-lg">
                    המערכת סורקת תעריפים ומוצאת את האפשרויות
                    הטובות ביותר עבורכם
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="mb-12">
                    <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                      <img 
                        src={minimalistCompletionIcon}
                        alt="מעבר מהיר"
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="w-16 h-16 bg-royal-purple rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8">
                      3
                    </div>
                  </div>
                  <h3 className="text-2xl font-heebo font-bold text-royal-purple mb-6">מעבר מלווה</h3>
                  <p className="text-gray-600 leading-relaxed font-assistant text-lg">
                    אנחנו מטפלים בכל התהליך עד שהמעבר מושלם -
                    העיקר שתחסכו!
                  </p>
                </div>
              </div>

              {/* Clean Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mt-24">
                <div className="text-center p-12 rounded-3xl bg-gray-50/50 border border-gray-100/50">
                  <div className="text-6xl font-black text-purple-500 mb-6">₪2,400</div>
                  <p className="text-2xl font-semibold text-royal-purple mb-3 font-heebo">חיסכון ממוצע בשנה</p>
                  <p className="text-gray-700/80 font-assistant text-lg">למשפחה ממוצעת בישראל</p>
                </div>
                <div className="text-center p-12 rounded-3xl bg-gray-50/50 border border-gray-100/50">
                  <div className="text-6xl font-black text-purple-600 mb-6">100%</div>
                  <p className="text-2xl font-semibold text-royal-purple mb-3 font-heebo">שירות חינמי</p>
                  <p className="text-gray-700/80 font-assistant text-lg">ללא עלויות נסתרות</p>
                </div>
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
                <img 
                  src={middleSectionIllustration}
                  alt="איור של אישה עובדת על השוואת תעריფי שירותי הבית" 
                  className="w-full h-auto"
                  style={{ 
                    mixBlendMode: 'multiply',
                    backgroundColor: 'transparent'
                  }}
                />
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
          {/* New Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Illustration Side */}
            <div className="flex justify-center">
              <div className="w-full max-w-lg bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-lg">
                <img 
                  src={savingsAnalysisIllustration}
                  alt="איור של אדם מנתח חשבונות וחיסכון" 
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
            
            {/* Content Side */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-royal-purple mb-6">
                ניתוח חכם ומדויק
              </h2>
              <p className="text-xl text-gray-700 mb-8 font-assistant leading-relaxed">
                המערכת שלנו מנתחת את הצרכים שלכם ומוצאת את ההצעות הטובות ביותר בשוק
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heebo font-semibold text-royal-purple mb-2">
                      השוואה אוטומטית
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      המערכת סורקת מאות חבילות ומוצאת את הכי משתלמות עבורכם
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heebo font-semibold text-royal-purple mb-2">
                      חיסכון מיידי
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      רואים כמה כסף תחסכו כבר בניתוח הראשוני
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Main Mission Card */}
            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-0">
                {/* Header Section with Gradient Background */}
                <div className="bg-gradient-to-br from-royal-purple via-purple-600 to-purple-700 p-12 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-heebo font-bold mb-6 tracking-tight">
                      השליחות שלנו
                    </h2>
                    <p className="text-xl lg:text-2xl max-w-4xl mx-auto font-assistant leading-relaxed text-purple-50">
                      אנחנו מאמינים שכל משפחה ישראלית זכאית לחסוך כסף על חשבונות הבית. 
                      <br className="hidden lg:block" />
                      המטרה שלנו היא להפוך את התהליך המסובך של השוואת ספקים לפשוט, מהיר ויעיל.
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-12">
                  {/* Vision and Values Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 bg-white/60 backdrop-blur-sm">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-royal-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-royal-purple mb-4 font-heebo">החזון שלנו</h3>
                        <p className="text-gray-600 font-assistant leading-relaxed text-lg">
                          להיות הכתובת המובילה בישראל לחיסכון בשירותי הבית, תוך מתן שירות אישי ואמין לכל לקוח.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 bg-white/60 backdrop-blur-sm">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-royal-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-royal-purple mb-4 font-heebo">הערכים שלנו</h3>
                        <p className="text-gray-600 font-assistant leading-relaxed text-lg">
                          שקיפות מלאה, שירות מעולה ומחויבות לחיסכון אמיתי עבור הלקוחות שלנו.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Interactive Statistics */}
                  <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                    <h3 className="text-2xl font-semibold text-royal-purple mb-8 font-heebo text-center">
                      המספרים מדברים בעד עצמם
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
                        <div className="text-4xl lg:text-5xl font-black text-royal-purple mb-3 group-hover:scale-110 transition-transform duration-300">50,000+</div>
                        <p className="text-sm lg:text-base text-gray-600 font-assistant font-semibold">משפחות שחסכו</p>
                        <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-royal-purple rounded-full group-hover:w-full w-3/4 transition-all duration-1000"></div>
                        </div>
                      </div>
                      
                      <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
                        <div className="text-4xl lg:text-5xl font-black text-purple-500 mb-3 group-hover:scale-110 transition-transform duration-300">₪120M+</div>
                        <p className="text-sm lg:text-base text-gray-600 font-assistant font-semibold">סה"כ חיסכון</p>
                        <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full group-hover:w-full w-4/5 transition-all duration-1000"></div>
                        </div>
                      </div>
                      
                      <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
                        <div className="text-4xl lg:text-5xl font-black text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300">95%</div>
                        <p className="text-sm lg:text-base text-gray-600 font-assistant font-semibold">שביעות רצון</p>
                        <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full group-hover:w-full w-19/20 transition-all duration-1000"></div>
                        </div>
                      </div>
                      
                      <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
                        <div className="text-4xl lg:text-5xl font-black text-royal-purple mb-3 group-hover:scale-110 transition-transform duration-300">5</div>
                        <p className="text-sm lg:text-base text-gray-600 font-assistant font-semibold">שנות ניסיון</p>
                        <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-royal-purple rounded-full group-hover:w-full w-1/2 transition-all duration-1000"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-3 bg-royal-purple text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <span className="text-lg font-semibold font-assistant">הצטרפו למשפחה שלנו</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-royal-purple mb-4">
              השותפים שלנו
            </h2>
            <p className="text-lg text-gray-600 font-assistant max-w-3xl mx-auto">
              אנחנו עובדים עם הספקים המובילים בישראל כדי להבטיח לכם את המחירים הטובים ביותר
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl border border-gray-100 max-w-6xl w-full shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src={israeliCompaniesLogos} 
                alt="לוגואים רשמיים של חברות הטלקום והחשמל הישראליות - בזק, הוט, פרטנר, סלקום, פלאפון, יס, חברת חשמל, אלקטרה"
                className="w-full h-auto max-w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 font-assistant">ועוד עשרות ספקים נוספים</p>
          </div>
        </div>
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
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Home;