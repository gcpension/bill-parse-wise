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
      <div className="fixed inset-0 pointer-events-none">
        {/* Electricity related icons - more natural positioning */}
        <Lightbulb className="absolute top-[15%] left-[8%] w-7 h-7 text-yellow-300 opacity-15 animate-pulse" style={{ animationDelay: '0s', animationDuration: '4.2s' }} />
        <Plug className="absolute top-[25%] right-[12%] w-5 h-5 text-yellow-400 opacity-20 animate-bounce" style={{ animationDelay: '1.3s', animationDuration: '3.8s' }} />
        <Battery className="absolute top-[45%] left-[15%] w-6 h-6 text-green-300 opacity-18 animate-pulse" style={{ animationDelay: '2.1s', animationDuration: '5.5s' }} />
        <Zap className="absolute bottom-[35%] right-[7%] w-8 h-8 text-yellow-500 opacity-12 animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '4.3s' }} />
        <Lightbulb className="absolute bottom-[55%] right-[18%] w-4 h-4 text-orange-300 opacity-25 rotate-12 animate-pulse" style={{ animationDelay: '3.2s', animationDuration: '2.8s' }} />
        
        {/* Mobile/Cellular icons - scattered more naturally */}
        <Smartphone className="absolute top-[18%] right-[28%] w-7 h-7 text-blue-300 opacity-16 rotate-[-15deg] animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '6.2s' }} />
        <Phone className="absolute bottom-[28%] left-[22%] w-6 h-6 text-blue-400 opacity-20 rotate-[25deg] animate-bounce" style={{ animationDelay: '2.7s', animationDuration: '3.2s' }} />
        <Tablet className="absolute top-[55%] right-[8%] w-7 h-7 text-purple-300 opacity-14 rotate-[8deg] animate-pulse" style={{ animationDelay: '3.5s', animationDuration: '4.8s' }} />
        <Smartphone className="absolute bottom-[65%] left-[5%] w-5 h-5 text-indigo-300 opacity-22 rotate-[-8deg] animate-bounce" style={{ animationDelay: '4.1s', animationDuration: '5.1s' }} />
        <Phone className="absolute top-[72%] right-[35%] w-6 h-6 text-cyan-300 opacity-17 rotate-[18deg] animate-pulse" style={{ animationDelay: '5.3s', animationDuration: '3.9s' }} />
        
        {/* Internet/WiFi icons - organic distribution */}
        <Wifi className="absolute top-[22%] left-[35%] w-7 h-7 text-green-400 opacity-19 animate-pulse" style={{ animationDelay: '1.1s', animationDuration: '5.3s' }} />
        <Router className="absolute bottom-[18%] right-[22%] w-6 h-6 text-cyan-300 opacity-16 rotate-[12deg] animate-bounce" style={{ animationDelay: '2.4s', animationDuration: '4.1s' }} />
        <Cable className="absolute top-[38%] left-[8%] w-5 h-5 text-green-500 opacity-21 rotate-[-22deg] animate-pulse" style={{ animationDelay: '2.9s', animationDuration: '3.4s' }} />
        <Satellite className="absolute bottom-[42%] left-[18%] w-7 h-7 text-teal-300 opacity-18 rotate-[15deg] animate-bounce" style={{ animationDelay: '3.8s', animationDuration: '5.7s' }} />
        <Wifi className="absolute top-[68%] right-[15%] w-5 h-5 text-emerald-300 opacity-24 rotate-[-5deg] animate-pulse" style={{ animationDelay: '4.6s', animationDuration: '4.4s' }} />
        <Router className="absolute bottom-[72%] left-[28%] w-6 h-6 text-lime-300 opacity-13 rotate-[28deg] animate-bounce" style={{ animationDelay: '1.7s', animationDuration: '6.1s' }} />
        
        {/* TV/Entertainment icons - creative placement */}
        <Tv className="absolute top-[28%] right-[18%] w-8 h-8 text-purple-400 opacity-17 rotate-[5deg] animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4.7s' }} />
        <Monitor className="absolute bottom-[22%] right-[28%] w-7 h-7 text-indigo-300 opacity-19 rotate-[-12deg] animate-bounce" style={{ animationDelay: '2.8s', animationDuration: '3.6s' }} />
        <Headphones className="absolute top-[78%] left-[25%] w-6 h-6 text-pink-300 opacity-22 rotate-[20deg] animate-pulse" style={{ animationDelay: '0.4s', animationDuration: '6.8s' }} />
        <Radio className="absolute top-[48%] left-[12%] w-5 h-5 text-red-300 opacity-16 rotate-[-18deg] animate-bounce" style={{ animationDelay: '4.2s', animationDuration: '4.9s' }} />
        <Tv className="absolute bottom-[48%] right-[32%] w-6 h-6 text-violet-300 opacity-20 rotate-[32deg] animate-pulse" style={{ animationDelay: '5.1s', animationDuration: '3.7s' }} />
        <Monitor className="absolute top-[82%] right-[25%] w-5 h-5 text-slate-400 opacity-14 rotate-[7deg] animate-bounce" style={{ animationDelay: '6.2s', animationDuration: '5.4s' }} />
        
        {/* Center area elements - subtle presence */}
        <WifiOff className="absolute top-[42%] left-[42%] w-4 h-4 text-gray-400 opacity-8 rotate-[45deg] animate-pulse" style={{ animationDelay: '7s', animationDuration: '8.2s' }} />
        <Battery className="absolute bottom-[38%] right-[45%] w-5 h-5 text-yellow-200 opacity-12 rotate-[-25deg] animate-bounce" style={{ animationDelay: '3.3s', animationDuration: '2.9s' }} />
        <Cable className="absolute top-[58%] left-[48%] w-4 h-4 text-blue-200 opacity-10 rotate-[60deg] animate-pulse" style={{ animationDelay: '4.8s', animationDuration: '7.1s' }} />
        <Plug className="absolute bottom-[58%] right-[52%] w-4 h-4 text-green-200 opacity-11 rotate-[-35deg] animate-bounce" style={{ animationDelay: '2.2s', animationDuration: '5.8s' }} />
        
        {/* Corner accents */}
        <Satellite className="absolute top-[5%] left-[3%] w-6 h-6 text-purple-200 opacity-15 rotate-[22deg] animate-pulse" style={{ animationDelay: '8.1s', animationDuration: '4.6s' }} />
        <Headphones className="absolute top-[8%] right-[4%] w-5 h-5 text-pink-200 opacity-18 rotate-[-30deg] animate-bounce" style={{ animationDelay: '1.9s', animationDuration: '6.3s' }} />
        <Radio className="absolute bottom-[6%] left-[4%] w-5 h-5 text-orange-200 opacity-16 rotate-[15deg] animate-pulse" style={{ animationDelay: '7.4s', animationDuration: '3.1s' }} />
        <Lightbulb className="absolute bottom-[4%] right-[6%] w-6 h-6 text-yellow-200 opacity-13 rotate-[-20deg] animate-bounce" style={{ animationDelay: '9.2s', animationDuration: '5.2s' }} />
        
        {/* Mid-range scattered elements */}
        <Smartphone className="absolute top-[35%] left-[65%] w-5 h-5 text-blue-200 opacity-14 rotate-[40deg] animate-pulse" style={{ animationDelay: '6.7s', animationDuration: '4.3s' }} />
        <Wifi className="absolute bottom-[25%] left-[38%] w-6 h-6 text-green-200 opacity-17 rotate-[-40deg] animate-bounce" style={{ animationDelay: '3.6s', animationDuration: '7.8s' }} />
        <Monitor className="absolute top-[15%] left-[58%] w-4 h-4 text-indigo-200 opacity-19 rotate-[55deg] animate-pulse" style={{ animationDelay: '8.8s', animationDuration: '2.7s' }} />
        <Phone className="absolute bottom-[15%] right-[58%] w-5 h-5 text-cyan-200 opacity-12 rotate-[-15deg] animate-bounce" style={{ animationDelay: '4.4s', animationDuration: '6.9s' }} />
      </div>
      {/* Clean Header Section */}
      <section className="bg-white py-16 lg:py-24 relative">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
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
                  <CardContent className="p-8 text-center">
                    {/* Image illustration */}
                    <div className="w-full h-32 mx-auto mb-6 overflow-hidden rounded-2xl">
                      <img 
                        src={data.image}
                        alt={`איור ${data.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Category title */}
                    <h3 className="text-xl font-heebo font-medium text-gray-900 mb-6">
                      {data.name}
                    </h3>
                    
                    {/* Form fields when selected */}
                    {isSelected && (
                      <div className="space-y-4 mb-6" onClick={(e) => e.stopPropagation()}>
                        <Select 
                          value={selectedCategories[category].provider} 
                          onValueChange={(value) => handleProviderChange(category, value)}
                        >
                          <SelectTrigger className="h-12 bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
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
                          className="h-12 bg-gray-50 border-gray-200 text-gray-700 rounded-xl"
                        />
                      </div>
                    )}
                    
                    {/* Clean red button */}
                    <Button 
                      className={`w-full h-12 rounded-xl font-assistant font-medium text-base transition-all duration-200 ${
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
          <div className="text-center mt-12 max-w-2xl mx-auto">
            <p className="text-gray-600 text-lg font-assistant leading-relaxed">
              אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר.
              <br />
              <span className="font-medium text-gray-800">השירות חינם לחלוטין</span> - המשפחה הממוצעת חוסכת ₪2,400 בשנה.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;