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
const Home = () => {
  const [mounted, setMounted] = useState(false);
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
    setSelectedCategories(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        selected: !prev[category].selected
      }
    }));
  };
  const handleAmountChange = (category: string, amount: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        amount
      }
    }));
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

          {/* Selected Category Details - Clean & User-Friendly Design */}
          {Object.entries(selectedCategories).some(([_, data]) => data.selected) && <div className="mt-10 space-y-6">
              {Object.entries(selectedCategories).map(([category, categoryData]) => {
            if (!categoryData.selected) return null;
            const data = categoryData;
            const categoryInfo = {
              'electricity': {
                name: 'חשמל',
                icon: Lightbulb
              },
              'cellular': {
                name: 'סלולר',
                icon: Smartphone
              },
              'internet': {
                name: 'אינטרנט',
                icon: Wifi
              },
              'tv': {
                name: 'טלוויזיה',
                icon: Tv
              }
            }[category];
            const Icon = categoryInfo?.icon || Lightbulb;
            const currentAmount = parseFloat(categoryData.amount) || 0;
            return <Card key={category} className="bg-white shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 animate-fade-in">
                    <CardContent className="p-8">
                      {/* Header with close button */}
                      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Icon className="w-7 h-7 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {categoryInfo?.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              השלימו את הפרטים כדי לקבל המלצות
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleCategorySelect(category)} className="text-gray-600 hover:text-red-600 hover:border-red-300 transition-colors">
                          ✕ סגור
                        </Button>
                      </div>
                      
                      <div className="space-y-8">
                        {/* Cellular Lines Counter */}
                        {category === 'cellular' && <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <Label className="text-base font-semibold text-gray-900 mb-4 block">
                              כמה קווי סלולר יש לכם?
                            </Label>
                            <div className="flex items-center gap-6">
                              <div className="flex-1">
                                <Input type="range" min="1" max="10" value={categoryData.lines || 1} onChange={e => setSelectedCategories(prev => ({
                          ...prev,
                          [category]: {
                            ...prev[category],
                            lines: parseInt(e.target.value)
                          }
                        }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" />
                                <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                                  <span>1 קו</span>
                                  <span>5 קווים</span>
                                  <span>10 קווים</span>
                                </div>
                              </div>
                              <div className="bg-white px-6 py-3 rounded-lg border-2 border-purple-200 min-w-[100px] text-center">
                                <span className="text-3xl font-bold text-purple-600">
                                  {categoryData.lines || 1}
                                </span>
                                <span className="text-sm text-gray-600 block mt-1">
                                  {(categoryData.lines || 1) === 1 ? 'קו' : 'קווים'}
                                </span>
                              </div>
                            </div>
                          </div>}
                        
                        {/* Monthly Payment Amount */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <Label className="text-base font-semibold text-gray-900 mb-4 block">
                            כמה אתם משלמים היום? (חודשי)
                          </Label>
                          
                          <div className="space-y-6">
                            {/* Main number input */}
                            <div className="relative">
                              <Input type="number" placeholder="הזינו סכום" value={categoryData.amount} onChange={e => handleAmountChange(category, e.target.value)} className="h-16 pr-14 text-2xl font-bold text-gray-900 bg-white border-2 border-gray-300 focus:border-purple-500 rounded-xl text-center" />
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                                ₪
                              </div>
                            </div>
                            
                            {/* Quick amount buttons */}
                            <div className="flex flex-wrap gap-2">
                              <span className="text-sm text-gray-600 w-full mb-1">סכומים נפוצים:</span>
                              {[50, 100, 150, 200, 300, 500].map(amount => <Button key={amount} type="button" variant="outline" size="sm" onClick={() => handleAmountChange(category, amount.toString())} className="text-sm hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700">
                                  ₪{amount}
                                </Button>)}
                            </div>
                            
                            {/* Range slider */}
                            <div className="pt-2">
                              <Input type="range" min="0" max="1000" step="10" value={categoryData.amount || 0} onChange={e => handleAmountChange(category, e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" />
                              <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                                <span>₪0</span>
                                <span>₪500</span>
                                <span>₪1000</span>
                              </div>
                            </div>
                            
                            {/* Savings estimate - Simple */}
                            {currentAmount > 0 && <div className="mt-6 pt-6 border-t-2 border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 font-medium">חיסכון משוער (25%):</span>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-green-600">
                                      ₪{Math.round(currentAmount * 0.25)} לחודש
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      (₪{Math.round(currentAmount * 0.25 * 12)} לשנה)
                                    </div>
                                  </div>
                                </div>
                              </div>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>;
          })}
            </div>}

          {/* Clean CTA Section - Enhanced animations */}
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
          {/* Before & After Comparison Section - 2024 vs 2025 */}
          <div className="mb-20">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block bg-purple-100 px-4 py-2 rounded-full mb-4">
                <p className="text-sm font-heebo font-medium text-purple-700">המהפכה כבר כאן</p>
              </div>
              <h2 className="text-4xl lg:text-5xl font-heebo font-bold text-royal-purple mb-6 leading-tight">
                איך זה נראה היום<br />לעומת 2025?
              </h2>
              <p className="text-xl text-gray-600 font-assistant max-w-2xl mx-auto">
                ההבדל בין התהליך המסורתי לבין הפתרון החדש שלנו
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch relative">
              {/* Connecting Arrow - Desktop Only */}
              <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-white rounded-full p-3 shadow-lg border-2 border-gray-200">
                  <ArrowRight className="w-8 h-8 text-purple-600 transform rotate-180" />
                </div>
              </div>

              {/* Today / 2024 Card */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
                <Card className="h-full bg-white border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-400"></div>
                  <CardContent className="p-8 lg:p-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
                          <Zap className="w-8 h-8 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-heebo font-bold text-gray-800">
                            היום
                          </h3>
                          <p className="text-sm text-gray-500 font-assistant mt-1">התהליך המסורתי</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 px-3 py-1">
                        2024
                      </Badge>
                    </div>
                    
                    <div className="space-y-5 flex-1">
                      <div className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-assistant text-lg leading-relaxed">
                            תהליך מורכב ומתיש של מעבר בין ספקים
                          </p>
                          <p className="text-sm text-gray-500 mt-1">בממוצע 3-5 שעות של עבודה</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-assistant text-lg leading-relaxed">
                            שעות של טלפונים ובירוקרטיה
                          </p>
                          <p className="text-sm text-gray-500 mt-1">המתנה בתור ומילוי טפסים</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-assistant text-lg leading-relaxed">
                            קשה להשוות מחירים ולדעת מה באמת משתלם
                          </p>
                          <p className="text-sm text-gray-500 mt-1">מידע מפוזר ולא שקוף</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-assistant text-lg leading-relaxed">
                            תשלום יתר על חבילות ושירותים
                          </p>
                          <p className="text-sm text-gray-500 mt-1">בלי להבין את כל העלויות</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-gray-100 rounded-2xl border border-gray-200">
                      <p className="text-center text-gray-700 font-heebo text-lg">
                        משפחה ממוצעת משלמת
                      </p>
                      <p className="text-center text-gray-900 font-heebo font-bold text-3xl mt-2">
                        ₪800-1,200
                      </p>
                      <p className="text-center text-gray-600 font-assistant text-sm mt-1">
                        לחודש
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 2025 Card */}
              <div className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
                <Card className="h-full bg-white border-2 border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-purple-600"></div>
                  <CardContent className="p-8 lg:p-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-purple-100">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-heebo font-bold text-purple-900">
                            2025
                          </h3>
                          <p className="text-sm text-purple-600 font-assistant mt-1">הפתרון החכם שלנו</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-600 text-white border-0 px-3 py-1">
                        חדש
                      </Badge>
                    </div>
                    
                    <div className="space-y-5 flex-1">
                      <div className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-purple-900 font-assistant text-lg leading-relaxed font-medium">
                            מעבר מלא אוטומטי בלחיצת כפתור
                          </p>
                          <p className="text-sm text-purple-600 mt-1">פחות מ-5 דקות</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-purple-900 font-assistant text-lg leading-relaxed font-medium">
                            ללא שיחות טלפון או מילוי טפסים
                          </p>
                          <p className="text-sm text-purple-600 mt-1">הכל דיגיטלי ופשוט</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-purple-900 font-assistant text-lg leading-relaxed font-medium">
                            השוואה חכמה של כל ההצעות בשוק
                          </p>
                          <p className="text-sm text-purple-600 mt-1">נתונים עדכניים ומדויקים</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-purple-900 font-assistant text-lg leading-relaxed font-medium">
                            חיסכון ממוצע של ₪2,400 בשנה
                          </p>
                          <p className="text-sm text-purple-600 mt-1">הכסף נשאר אצלכם</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-purple-50 rounded-2xl border-2 border-purple-200">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <p className="text-center text-purple-900 font-heebo text-lg font-semibold">
                          חיסכון ממוצע
                        </p>
                      </div>
                      <p className="text-center text-purple-900 font-heebo font-bold text-3xl">
                        ₪200
                      </p>
                      <p className="text-center text-purple-700 font-assistant text-sm mt-1">
                        לחודש בממוצע
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Statistics Bar */}
            <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-3xl font-heebo font-bold text-purple-900 mb-1">5 דקות</p>
                  <p className="text-sm text-gray-600 font-assistant">זמן ממוצע להשלמת תהליך</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-3xl font-heebo font-bold text-purple-900 mb-1">15,000+</p>
                  <p className="text-sm text-gray-600 font-assistant">משפחות כבר חסכו</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-3xl font-heebo font-bold text-purple-900 mb-1">₪2,400</p>
                  <p className="text-sm text-gray-600 font-assistant">חיסכון ממוצע בשנה</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards', opacity: 0 }}>
              <Button 
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white font-heebo text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                התחילו לחסוך עוד היום
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500 font-assistant mt-3">
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
      
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>;
};
export default Home;