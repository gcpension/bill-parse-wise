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
import savingsCalculatorIllustration from '@/assets/savings-calculator-illustration.png';
import familyUtilitiesIllustration from '@/assets/family-utilities-illustration.png';
import comparisonSuccessIllustration from '@/assets/comparison-success-illustration.png';
import fastProcessIllustration from '@/assets/fast-process-illustration.png';
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

          {/* How It Works Section - Seamless Integration */}
          <div className="max-w-6xl mx-auto mt-20">
            <div className="py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                {/* Content Side */}
                <div>
                  <h2 className="text-4xl lg:text-5xl font-heebo font-bold mb-8 text-gray-900 leading-tight">
                    איך זה עובד?
                  </h2>
                  <p className="text-xl text-gray-700 mb-12 font-assistant leading-relaxed">
                    תהליך פשוט ומהיר לחיסכון בחשבונות הבית
                  </p>

                  {/* Professional Steps */}
                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                        1
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 font-heebo mb-4">בחירת שירותים</h3>
                        <p className="text-gray-600 leading-relaxed font-assistant text-lg">
                          בחרו את השירותים שאתם רוצים לבדוק והזינו את הפרטים הנוכחיים שלכם
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                        2
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 font-heebo mb-4">ניתוח מתקדם</h3>
                        <p className="text-gray-600 leading-relaxed font-assistant text-lg">
                          המערכת סורקת תעריפים ומוצאת את האפשרויות הטובות ביותר עבורכם
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                        3
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 font-heebo mb-4">מעבר מלווה</h3>
                        <p className="text-gray-600 leading-relaxed font-assistant text-lg">
                          אנחנו מטפלים בכל התהליך עד שהמעבר מושלם
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Illustration Side */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <img 
                      src={professionalServicesIllustration}
                      alt="איור מקצועי של בדיקת שירותים" 
                      className="w-full h-auto opacity-90"
                      style={{ 
                        filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.1))'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Seamless Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-50/80 to-red-100/80 backdrop-blur-sm border border-red-200/50">
                  <div className="text-5xl font-black text-red-600 mb-4">₪2,400</div>
                  <p className="text-2xl font-semibold text-red-800 mb-3 font-heebo">חיסכון ממוצע בשנה</p>
                  <p className="text-red-700 font-assistant text-lg">למשפחה ממוצעת בישראל</p>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm border border-green-200/50">
                  <div className="text-5xl font-black text-green-600 mb-4">100%</div>
                  <p className="text-2xl font-semibold text-green-800 mb-3 font-heebo">שירות חינמי</p>
                  <p className="text-green-700 font-assistant text-lg">ללא עלויות נסתרות</p>
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

      {/* Our Mission Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 shadow-lg">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl lg:text-4xl font-heebo font-semibold mb-6 text-gray-900">
                    השליחות שלנו
                  </h2>
                  <p className="text-xl text-gray-700 max-w-4xl mx-auto font-assistant leading-relaxed">
                    אנחנו מאמינים שכל משפחה ישראלית זכאית לחסוך כסף על חשבונות הבית. 
                    המטרה שלנו היא להפוך את התהליך המסובך של השוואת ספקים לפשוט, מהיר ויעיל.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heebo text-center">החזון שלנו</h3>
                    <p className="text-gray-600 font-assistant text-center leading-relaxed">
                      להיות הכתובת המובילה בישראל לחיסכון בשירותי הבית, תוך מתן שירות אישי ואמין לכל לקוח.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heebo text-center">הערכים שלנו</h3>
                    <p className="text-gray-600 font-assistant text-center leading-relaxed">
                      שקיפות מלאה, שירות מעולה ומחויבות לחיסכון אמיתי עבור הלקוחות שלנו.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-black text-red-500 mb-2">50,000+</div>
                    <p className="text-sm text-gray-600 font-assistant">משפחות שחסכו</p>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-green-500 mb-2">₪120M+</div>
                    <p className="text-sm text-gray-600 font-assistant">סה"כ חיסכון</p>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-blue-500 mb-2">95%</div>
                    <p className="text-sm text-gray-600 font-assistant">שביעות רצון</p>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-purple-500 mb-2">5</div>
                    <p className="text-sm text-gray-600 font-assistant">שנות ניסיון</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;