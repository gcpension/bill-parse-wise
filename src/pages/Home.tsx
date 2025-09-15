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
        {/* Electricity related icons */}
        <Lightbulb className="absolute top-20 left-10 w-8 h-8 text-yellow-300 opacity-20 animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }} />
        <Plug className="absolute top-32 right-20 w-6 h-6 text-yellow-400 opacity-15 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <Battery className="absolute top-40 left-1/4 w-7 h-7 text-green-300 opacity-25 animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <Zap className="absolute bottom-40 right-10 w-9 h-9 text-yellow-500 opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        
        {/* Mobile/Cellular icons */}
        <Smartphone className="absolute top-16 right-1/3 w-8 h-8 text-blue-300 opacity-20 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '6s' }} />
        <Phone className="absolute bottom-32 left-16 w-7 h-7 text-blue-400 opacity-15 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }} />
        <Tablet className="absolute top-1/2 right-12 w-8 h-8 text-purple-300 opacity-25 animate-pulse" style={{ animationDelay: '3s', animationDuration: '4s' }} />
        
        {/* Internet/WiFi icons */}
        <Wifi className="absolute top-24 left-1/3 w-8 h-8 text-green-400 opacity-20 animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '5s' }} />
        <Router className="absolute bottom-20 right-1/4 w-7 h-7 text-cyan-300 opacity-15 animate-bounce" style={{ animationDelay: '1.8s', animationDuration: '4s' }} />
        <Cable className="absolute top-1/3 left-12 w-6 h-6 text-green-500 opacity-25 animate-pulse" style={{ animationDelay: '2.2s', animationDuration: '3s' }} />
        <Satellite className="absolute bottom-1/3 left-1/5 w-8 h-8 text-teal-300 opacity-20 animate-bounce" style={{ animationDelay: '3.5s', animationDuration: '5s' }} />
        
        {/* TV/Entertainment icons */}
        <Tv className="absolute top-1/4 right-16 w-9 h-9 text-purple-400 opacity-20 animate-pulse" style={{ animationDelay: '1.2s', animationDuration: '4s' }} />
        <Monitor className="absolute bottom-1/4 right-1/3 w-8 h-8 text-indigo-300 opacity-15 animate-bounce" style={{ animationDelay: '2.8s', animationDuration: '3.5s' }} />
        <Headphones className="absolute top-3/4 left-1/4 w-7 h-7 text-pink-300 opacity-25 animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '6s' }} />
        <Radio className="absolute top-1/2 left-1/6 w-6 h-6 text-red-300 opacity-20 animate-bounce" style={{ animationDelay: '4s', animationDuration: '4.5s' }} />
        
        {/* Additional scattered elements */}
        <WifiOff className="absolute bottom-16 left-1/3 w-6 h-6 text-gray-400 opacity-10 animate-pulse" style={{ animationDelay: '5s', animationDuration: '7s' }} />
        <Lightbulb className="absolute bottom-1/2 right-1/5 w-5 h-5 text-orange-300 opacity-15 animate-bounce" style={{ animationDelay: '3.8s', animationDuration: '2.5s' }} />
        <Phone className="absolute top-2/3 right-1/6 w-7 h-7 text-emerald-300 opacity-20 animate-pulse" style={{ animationDelay: '6s', animationDuration: '4s' }} />
      </div>
      {/* Clean Header Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center">
            
            {/* Clean subtitle */}
            <p className="text-lg text-gray-600 mb-8 font-assistant">
              בבטוח לא מוכרים לכם ביטוח רק מוזילים אותו
            </p>
            
            {/* Clean main title */}
            <h1 className="text-4xl lg:text-6xl font-heebo font-light text-gray-900 mb-4 leading-tight">
              באיזה ביטוח תרצו
              <br />
              להתחיל <span className="font-medium text-red-500">לחסוך</span> היום?
            </h1>
          </div>
        </div>
      </section>

      {/* Clean Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          
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
                        `ביטוח ${data.name}`
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