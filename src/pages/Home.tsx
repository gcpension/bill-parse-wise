import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Wifi, Smartphone, Tv, CheckCircle, ArrowRight, Phone, Router, Lightbulb, Cable, Plug, WifiOff, Battery, Monitor, Tablet, Headphones, Radio, Satellite } from 'lucide-react';
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

    localStorage.setItem('analysisData', JSON.stringify(selectedData));
    navigate('/all-plans');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Electricity related icons - more visible */}
        <Lightbulb className="absolute top-[15%] left-[8%] w-8 h-8 text-yellow-500 opacity-40 animate-pulse" style={{ animationDelay: '0s', animationDuration: '4.2s' }} />
        <Plug className="absolute top-[25%] right-[12%] w-7 h-7 text-yellow-600 opacity-45 animate-bounce" style={{ animationDelay: '1.3s', animationDuration: '3.8s' }} />
        <Battery className="absolute top-[45%] left-[15%] w-8 h-8 text-green-500 opacity-50 animate-pulse" style={{ animationDelay: '2.1s', animationDuration: '5.5s' }} />
        <Zap className="absolute bottom-[35%] right-[7%] w-9 h-9 text-yellow-600 opacity-35 animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '4.3s' }} />
        <Lightbulb className="absolute bottom-[55%] right-[18%] w-6 h-6 text-orange-400 opacity-55 rotate-12 animate-pulse" style={{ animationDelay: '3.2s', animationDuration: '2.8s' }} />
        
        {/* Mobile/Cellular icons - more visible */}
        <Smartphone className="absolute top-[18%] right-[28%] w-8 h-8 text-blue-500 opacity-45 rotate-[-15deg] animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '6.2s' }} />
        <Phone className="absolute bottom-[28%] left-[22%] w-7 h-7 text-blue-600 opacity-50 rotate-[25deg] animate-bounce" style={{ animationDelay: '2.7s', animationDuration: '3.2s' }} />
        <Tablet className="absolute top-[55%] right-[8%] w-8 h-8 text-purple-500 opacity-40 rotate-[8deg] animate-pulse" style={{ animationDelay: '3.5s', animationDuration: '4.8s' }} />
        <Smartphone className="absolute bottom-[65%] left-[5%] w-6 h-6 text-indigo-500 opacity-60 rotate-[-8deg] animate-bounce" style={{ animationDelay: '4.1s', animationDuration: '5.1s' }} />
        <Phone className="absolute top-[72%] right-[35%] w-7 h-7 text-cyan-500 opacity-45 rotate-[18deg] animate-pulse" style={{ animationDelay: '5.3s', animationDuration: '3.9s' }} />
        
        {/* Internet/WiFi icons - more visible */}
        <Wifi className="absolute top-[22%] left-[35%] w-8 h-8 text-green-600 opacity-50 animate-pulse" style={{ animationDelay: '1.1s', animationDuration: '5.3s' }} />
        <Router className="absolute bottom-[18%] right-[22%] w-7 h-7 text-cyan-500 opacity-45 rotate-[12deg] animate-bounce" style={{ animationDelay: '2.4s', animationDuration: '4.1s' }} />
        <Cable className="absolute top-[38%] left-[8%] w-6 h-6 text-green-600 opacity-55 rotate-[-22deg] animate-pulse" style={{ animationDelay: '2.9s', animationDuration: '3.4s' }} />
        <Satellite className="absolute bottom-[42%] left-[18%] w-8 h-8 text-teal-500 opacity-45 rotate-[15deg] animate-bounce" style={{ animationDelay: '3.8s', animationDuration: '5.7s' }} />
        <Wifi className="absolute top-[68%] right-[15%] w-6 h-6 text-emerald-500 opacity-60 rotate-[-5deg] animate-pulse" style={{ animationDelay: '4.6s', animationDuration: '4.4s' }} />
        
        {/* TV/Entertainment icons - more visible */}
        <Tv className="absolute top-[28%] right-[18%] w-9 h-9 text-purple-600 opacity-45 rotate-[5deg] animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4.7s' }} />
        <Monitor className="absolute bottom-[22%] right-[28%] w-8 h-8 text-indigo-500 opacity-50 rotate-[-12deg] animate-bounce" style={{ animationDelay: '2.8s', animationDuration: '3.6s' }} />
        <Headphones className="absolute top-[78%] left-[25%] w-7 h-7 text-pink-500 opacity-55 rotate-[20deg] animate-pulse" style={{ animationDelay: '0.4s', animationDuration: '6.8s' }} />
        <Radio className="absolute top-[48%] left-[12%] w-6 h-6 text-red-500 opacity-45 rotate-[-18deg] animate-bounce" style={{ animationDelay: '4.2s', animationDuration: '4.9s' }} />
        
        {/* Additional scattered elements */}
        <Battery className="absolute bottom-[38%] right-[45%] w-6 h-6 text-yellow-400 opacity-35 rotate-[-25deg] animate-bounce" style={{ animationDelay: '3.3s', animationDuration: '2.9s' }} />
        <Plug className="absolute bottom-[58%] right-[52%] w-5 h-5 text-green-400 opacity-40 rotate-[-35deg] animate-pulse" style={{ animationDelay: '2.2s', animationDuration: '5.8s' }} />
        <Smartphone className="absolute top-[35%] left-[65%] w-6 h-6 text-blue-400 opacity-40 rotate-[40deg] animate-bounce" style={{ animationDelay: '6.7s', animationDuration: '4.3s' }} />
        <Monitor className="absolute top-[15%] left-[58%] w-5 h-5 text-indigo-400 opacity-50 rotate-[55deg] animate-pulse" style={{ animationDelay: '8.8s', animationDuration: '2.7s' }} />
      </div>

      {/* Clean Header Section */}
      <section className="bg-white py-16 lg:py-24 relative overflow-hidden">
        {/* Background illustration */}
        <div className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: `url(${heroBackgroundIllustration})` }}>
        </div>
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          <div className="text-center">
            
            {/* Clean subtitle */}
            <p className="text-lg text-gray-600 mb-8 font-assistant">
              המשפחה הממוצעת חוסכת ₪2,400 בשנה עם השירות שלנו
            </p>
            
            {/* Clean main title */}
            <h1 className="text-4xl lg:text-6xl font-heebo font-light text-gray-900 mb-4 leading-tight">
              חסכו בחשבונות הבית
              <br />
              <span className="font-medium text-red-500">בקלות ובמהירות</span>
            </h1>
            
            <p className="text-xl text-gray-600 mt-6 font-assistant max-w-3xl mx-auto">
              אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
            </p>
          </div>
        </div>
      </section>

      {/* Clean Categories Section */}
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heebo font-medium text-gray-900 mb-4">
              בחרו את הקטגוריה שלכם
            </h2>
            <p className="text-lg text-gray-600 font-assistant">
              קבלו המלצות מותאמות אישית והשוו מחירים בכל הקטגוריות
            </p>
          </div>
          
          {/* Category Cards Grid - Clean & Minimal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(categoryData).map(([category, data]) => {
              const Icon = data.icon;
              const isSelected = selectedCategories[category].selected;
              
              return (
                <Card 
                  key={category}
                  className={`bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 ${
                    isSelected ? 'ring-2 ring-red-500 shadow-lg' : ''
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent className="p-6 text-center">
                    {/* Image illustration - smaller */}
                    <div className="w-full h-24 mx-auto mb-4 overflow-hidden rounded-xl">
                      <img 
                        src={data.image}
                        alt={`איור ${data.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Category title */}
                    <h3 className="text-lg font-heebo font-medium text-gray-900 mb-4">
                      {data.name}
                    </h3>
                    
                    {/* Form fields when selected */}
                    {isSelected && (
                      <div className="space-y-3 mb-4" onClick={(e) => e.stopPropagation()}>
                        <Select 
                          value={selectedCategories[category].provider} 
                          onValueChange={(value) => handleProviderChange(category, value)}
                        >
                          <SelectTrigger className="h-10 bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
                            <SelectValue placeholder="בחרו ספק נוכחי" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.providers.map(provider => (
                              <SelectItem key={provider} value={provider}>
                                {provider}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="number"
                          placeholder="סכום חודשי (₪)"
                          value={selectedCategories[category].amount}
                          onChange={(e) => handleAmountChange(category, e.target.value)}
                          className="h-10 bg-gray-50 border-gray-200 text-gray-700 rounded-xl"
                        />
                      </div>
                    )}
                    
                    {/* Clean red button */}
                    <Button 
                      className={`w-full h-10 rounded-xl font-assistant font-medium text-sm transition-all duration-200 ${
                        isSelected 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(category);
                      }}
                    >
                      {isSelected ? (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          נבחר
                        </span>
                      ) : (
                        `בחר ${data.name}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Clean CTA Section */}
          <div className="text-center mt-16">
            <Button 
              onClick={handleStartAnalysis}
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 text-lg font-assistant font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span className="flex items-center gap-3">
                <span>התחל ניתוח חיסכון</span>
                <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </div>

          {/* Clean info section */}
          <div className="text-center mt-12 max-w-4xl mx-auto">
            <p className="text-gray-600 text-lg font-assistant leading-relaxed mb-8">
              אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר.
              <br />
              <span className="font-medium text-gray-800">השירות חינם לחלוטין</span> - המשפחה הממוצעת חוסכת ₪2,400 בשנה.
            </p>
          </div>

          {/* Minimalist How It Works Section */}
          <div className="max-w-6xl mx-auto mt-32">
            <div className="py-20">
              {/* Clean Header */}
              <div className="text-center mb-20">
                <h2 className="text-5xl lg:text-6xl font-heebo font-light mb-8 text-gray-900 leading-tight">
                  אנחנו איתכם
                </h2>  
                <h3 className="text-4xl lg:text-5xl font-heebo font-bold mb-8 text-red-500 leading-tight">
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
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8">
                      1
                    </div>
                  </div>
                  <h3 className="text-2xl font-heebo font-bold text-gray-900 mb-6">בחירת שירותים</h3>
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
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8">
                      2
                    </div>
                  </div>
                  <h3 className="text-2xl font-heebo font-bold text-gray-900 mb-6">ניתוח מתקדם</h3>
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
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8">
                      3
                    </div>
                  </div>
                  <h3 className="text-2xl font-heebo font-bold text-gray-900 mb-6">מעבר מלווה</h3>
                  <p className="text-gray-600 leading-relaxed font-assistant text-lg">
                    אנחנו מטפלים בכל התהליך עד שהמעבר מושלם -
                    העיקר שתחסכו!
                  </p>
                </div>
              </div>

              {/* Clean Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mt-24">
                <div className="text-center p-12 rounded-3xl bg-red-50/50 border border-red-100/50">
                  <div className="text-6xl font-black text-red-500 mb-6">₪2,400</div>
                  <p className="text-2xl font-semibold text-red-800 mb-3 font-heebo">חיסכון ממוצע בשנה</p>
                  <p className="text-red-700/80 font-assistant text-lg">למשפחה ממוצעת בישראל</p>
                </div>
                <div className="text-center p-12 rounded-3xl bg-green-50/50 border border-green-100/50">
                  <div className="text-6xl font-black text-green-600 mb-6">100%</div>
                  <p className="text-2xl font-semibold text-green-800 mb-3 font-heebo">שירות חינמי</p>
                  <p className="text-green-700/80 font-assistant text-lg">ללא עלויות נסתרות</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-gray-900 mb-6">
                למה שווה לבדוק אצלנו?
              </h2>
              <p className="text-xl text-gray-700 mb-8 font-assistant leading-relaxed">
                אנחנו לא רק מוצאים לכם חיסכון - אנחנו מבטיחים שהמעבר יהיה חלק, מהיר ובטוח
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-gray-900 mb-2">
                      ניתוח מותאם אישית
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      המערכת שלנו בודקת את הצרכים הספציפיים שלכם ומוצאת את החבילות המתאימות ביותר
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-gray-900 mb-2">
                      כיסוי מקיף לכל הבית
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      חשמל, סלולר, אינטרנט וטלוויזיה - בודקים הכול במקום אחד וחוסכים זמן
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-gray-900 mb-2">
                      מעבר מהיר וללא בירוקרטיה
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-assistant">
                      אנחנו מטפלים בכל הניירת והתיאומים - אתם רק חותמים ואנחנו דואגים לכל השאר
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heebo text-center">
                  יתרונות נוספים שחשוב לדעת
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                    <CheckCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1 font-heebo text-sm">ללא התחייבות</h4>
                    <p className="text-xs text-gray-600 font-assistant">אתם מחליטים בסוף</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1 font-heebo text-sm">מעקב אחרי התהליך</h4>
                    <p className="text-xs text-gray-600 font-assistant">עדכונים לאורך כל הדרך</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1 font-heebo text-sm">תמיכה מלאה</h4>
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
                  alt="איור של אישה עובדת על השוואת תעריפי שירותי הבית" 
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
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute top-32 right-20 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-32 w-36 h-36 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-6 max-w-6xl relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Main Mission Card */}
            <Card className="bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-0">
                {/* Header Section with Gradient Background */}
                <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-12 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-heebo font-bold mb-6 tracking-tight">
                      השליחות שלנו
                    </h2>
                    <p className="text-xl lg:text-2xl max-w-4xl mx-auto font-assistant leading-relaxed text-red-50">
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
                    <Card className="group hover:shadow-lg transition-all duration-300 border border-red-100 hover:border-red-200 transform hover:-translate-y-1">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-heebo">החזון שלנו</h3>
                        <p className="text-gray-600 font-assistant leading-relaxed text-lg">
                          להיות הכתובת המובילה בישראל לחיסכון בשירותי הבית, תוך מתן שירות אישי ואמין לכל לקוח.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="group hover:shadow-lg transition-all duration-300 border border-red-100 hover:border-red-200 transform hover:-translate-y-1">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-heebo">הערכים שלנו</h3>
                        <p className="text-gray-600 font-assistant leading-relaxed text-lg">
                          שקיפות מלאה, שירות מעולה ומחויבות לחיסכון אמיתי עבור הלקוחות שלנו.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Interactive Statistics */}
                  <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-8 font-heebo text-center">
                      המספרים מדברים בעד עצמם
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
                        <div className="text-4xl lg:text-5xl font-black text-red-500 mb-3 group-hover:scale-110 transition-transform duration-300">50,000+</div>
                        <p className="text-sm lg:text-base text-gray-600 font-assistant font-semibold">משפחות שחסכו</p>
                        <div className="w-full h-1 bg-red-100 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full group-hover:w-full w-3/4 transition-all duration-1000"></div>
                        </div>
                      </div>
                      
                      <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
                        <div className="text-4xl lg:text-5xl font-black text-green-500 mb-3 group-hover:scale-110 transition-transform duration-300">₪120M+</div>
                        <p className="text-sm lg:text-base text-gray-600 font-assistant font-semibold">סה"כ חיסכון</p>
                        <div className="w-full h-1 bg-green-100 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full group-hover:w-full w-4/5 transition-all duration-1000"></div>
                        </div>
                      </div>
                      
                      <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                        <div className="text-4xl lg:text-5xl font-black text-blue-500 mb-3 group-hover:scale-110 transition-transform duration-300">95%</div>
                        <p className="text-sm lg:text-base text-gray-600 font-assistant font-semibold">שביעות רצון</p>
                        <div className="w-full h-1 bg-blue-100 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full group-hover:w-full w-19/20 transition-all duration-1000"></div>
                        </div>
                      </div>
                      
                      <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
                        <div className="text-4xl lg:text-5xl font-black text-purple-500 mb-3 group-hover:scale-110 transition-transform duration-300">5</div>
                        <p className="text-sm lg:text-base text-gray-600 font-assistant font-semibold">שנות ניסיון</p>
                        <div className="w-full h-1 bg-purple-100 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full group-hover:w-full w-1/2 transition-all duration-1000"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
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
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-gray-900 mb-4">
              השותפים שלנו
            </h2>
            <p className="text-lg text-gray-600 font-assistant max-w-3xl mx-auto">
              אנחנו עובדים עם הספקים המובילים בישראל כדי להבטיח לכם את המחירים הטובים ביותר
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {/* Partner Logos */}
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 group">
              <div className="text-center">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="text-sm font-semibold text-gray-700 font-heebo">חברת חשמל</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 group">
              <div className="text-center">
                <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="text-sm font-semibold text-gray-700 font-heebo">פלאפון</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 group">
              <div className="text-center">
                <Wifi className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="text-sm font-semibold text-gray-700 font-heebo">בזק</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 group">
              <div className="text-center">
                <Tv className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="text-sm font-semibold text-gray-700 font-heebo">יס</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 group">
              <div className="text-center">
                <Smartphone className="w-8 h-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="text-sm font-semibold text-gray-700 font-heebo">סלקום</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 group">
              <div className="text-center">
                <Tv className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <p className="text-sm font-semibold text-gray-700 font-heebo">הוט</p>
              </div>
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
            <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-gray-900 mb-4">
              שאלות נפוצות
            </h2>
            <p className="text-lg text-gray-600 font-assistant">
              כל מה שרציתם לדעת על התהליך
            </p>
          </div>

          <div className="space-y-4">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-gray-900 font-heebo">
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

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-gray-900 font-heebo">
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

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-gray-900 font-heebo">
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

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-gray-900 font-heebo">
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

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-gray-900 font-heebo">
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

      {/* Security Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heebo font-semibold text-gray-900 mb-4">
              אבטחת מידע ברמה הגבוהה ביותר
            </h2>
            <p className="text-lg text-gray-600 font-assistant max-w-3xl mx-auto">
              המידע שלכם מוגן בטכנולוגיות האבטחה המתקדמות ביותר
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* SSL Certificate */}
            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heebo">SSL הצפנה</h3>
              <p className="text-gray-600 font-assistant text-sm">
                כל התקשורת מוצפנת ברמת SSL 256-bit
              </p>
            </div>

            {/* GDPR Compliant */}
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heebo">GDPR מוגן</h3>
              <p className="text-gray-600 font-assistant text-sm">
                עומדים בתקני הגנת הפרטיות האירופיים
              </p>
            </div>

            {/* Secure Storage */}
            <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heebo">אחסון מאובטח</h3>
              <p className="text-gray-600 font-assistant text-sm">
                שרתים מאובטחים בישראל ובחו"ל
              </p>
            </div>

            {/* 24/7 Monitoring */}
            <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heebo">ניטור 24/7</h3>
              <p className="text-gray-600 font-assistant text-sm">
                מעקב רציף אחר אבטחת המערכת
              </p>
            </div>
          </div>

          {/* Security Badges */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-heebo">
                תעודות אבטחה ואישורים
              </h3>
              <p className="text-gray-600 font-assistant">
                אנחנו מאושרים ומוכרים על ידי הרשויות המובילות
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-900 font-heebo">ISO 27001</p>
                <p className="text-xs text-gray-600 font-assistant">אבטחת מידע</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-900 font-heebo">SOC 2</p>
                <p className="text-xs text-gray-600 font-assistant">ביקורת אבטחה</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-900 font-heebo">PCI DSS</p>
                <p className="text-xs text-gray-600 font-assistant">אבטחת תשלומים</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-900 font-heebo">משרד המשפטים</p>
                <p className="text-xs text-gray-600 font-assistant">רישיון ישראלי</p>
              </div>
            </div>
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
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
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
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                שירותים
              </h4>
              <ul className="space-y-4 font-assistant">
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors duration-200 group">
                    <Smartphone className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    סלולר
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors duration-200 group">
                    <Wifi className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    אינטרנט
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors duration-200 group">
                    <Tv className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    טלוויזיה
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors duration-200 group">
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
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                    אודות
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                    תנאי שימוש
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                    מדיניות פרטיות
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                    שאלות נפוצות
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-1">
              <h4 className="text-xl font-heebo font-semibold mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-400" />
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
    </div>
  );
};

export default Home;