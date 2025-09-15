import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, CheckCircle, Sparkles, Star, TrendingUp, Zap, Users, Shield, Wifi, Smartphone, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import heroModernBg from '@/assets/hero-modern-bg.jpg';
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
      gradient: 'from-yellow-400 via-orange-400 to-red-400',
      glowColor: 'shadow-yellow-400/50',
      neonColor: 'text-yellow-400',
      providers: ['חברת חשמל', 'פז אנרגיה', 'אלקטרה פאוור', 'דור אלון אנרגיה', 'סלקום אנרגיה']
    },
    cellular: {
      name: 'סלולר', 
      icon: Smartphone,
      gradient: 'from-blue-400 via-purple-400 to-pink-400',
      glowColor: 'shadow-blue-400/50',
      neonColor: 'text-blue-400',
      providers: ['פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', '019 מובייל']
    },
    internet: {
      name: 'אינטרנט',
      icon: Wifi,
      gradient: 'from-green-400 via-cyan-400 to-blue-400',
      glowColor: 'shadow-green-400/50',
      neonColor: 'text-green-400',
      providers: ['בזק', 'הוט', 'פרטנר', 'סלקום', 'אורנג']
    },
    tv: {
      name: 'טלוויזיה',
      icon: Tv,
      gradient: 'from-purple-400 via-pink-400 to-red-400',
      glowColor: 'shadow-purple-400/50',
      neonColor: 'text-purple-400',
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultra-modern animated background */}
      <div className="fixed inset-0 -z-20" style={{ background: 'var(--gradient-mesh)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/95 to-background/90" />
      </div>

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" 
             style={{ animation: 'morphing 20s ease-in-out infinite, float 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" 
             style={{ animation: 'morphing 25s ease-in-out infinite reverse, float 10s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" 
             style={{ animation: 'morphing 15s ease-in-out infinite, float 6s ease-in-out infinite' }} />
      </div>

      {/* Hero Section with Ultra-Modern Design */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              
              {/* Floating Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-full mb-8 border border-white/20 group hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  פלטפורמת החיסכון המתקדמת בישראל • 2025
                </span>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
              
              {/* Ultra-Modern Title */}
              <div className="relative mb-8">
                <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tight leading-[0.9] mb-6">
                  <span className="block bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                    חסכו בחשבונות
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-300% animate-gradient-x">
                    הבית שלכם
                  </span>
                </h1>
                
                {/* Floating accent lines */}
                <div className="absolute -left-8 top-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-y-1/2 animate-pulse hidden lg:block"></div>
                <div className="absolute -right-8 top-1/2 w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform -translate-y-1/2 animate-pulse hidden lg:block"></div>
              </div>
              
              {/* Modern Subtitle */}
              <div className="space-y-4 mb-12 max-w-3xl mx-auto">
                <p className="text-xl lg:text-2xl font-body text-gray-600 leading-relaxed">
                  אנחנו נמצא לכם את הספקים הזולים ביותר
                  <br />
                  <span className="font-semibold text-gray-800">ונבצע עבורכם את כל המעבר</span>
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-200">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">חיסכון ממוצע: ₪3,200 בשנה</span>
                </div>
              </div>

              {/* Ultra-Modern Category Selection */}
              <div className="space-y-8 max-w-6xl mx-auto mb-16">
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    באיזה שירות נתחיל לחסוך?
                  </h2>
                  <p className="text-lg text-gray-600 font-body">בחרו קטגוריות והזינו פרטים לקבלת ניתוח מתקדם</p>
                </div>

                {/* Revolutionary Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {Object.entries(categoryData).map(([category, data], index) => {
                    const Icon = data.icon;
                    const isSelected = selectedCategories[category].selected;
                    
                    return (
                      <div 
                        key={category} 
                        className="group"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div
                          className={`relative overflow-hidden transition-all duration-700 cursor-pointer transform hover:scale-105 ${
                            isSelected 
                              ? 'scale-105' 
                              : 'hover:rotate-1'
                          }`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          {/* Glass morphism card */}
                          <Card className={`glass-card border-0 ${isSelected ? 'ring-2 ring-white/30' : ''}`}>
                            <CardContent className="p-8 text-center relative">
                              
                              {/* Animated icon container */}
                              <div className={`relative w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${data.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${data.glowColor} shadow-2xl`}>
                                <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                                
                                {/* Neon glow effect */}
                                {isSelected && (
                                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${data.gradient} animate-pulse opacity-75`}></div>
                                )}
                              </div>
                              
                              {/* Category name with gradient */}
                              <h3 className={`font-display font-bold text-2xl mb-4 ${isSelected ? `bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent` : 'text-gray-800'} transition-all duration-300`}>
                                {data.name}
                              </h3>
                              
                              {/* Interactive form fields */}
                              {isSelected && (
                                <div className="space-y-4 mt-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                  <Select 
                                    value={selectedCategories[category].provider} 
                                    onValueChange={(value) => handleProviderChange(category, value)}
                                  >
                                    <SelectTrigger className="h-12 text-sm glass border-white/20 rounded-2xl font-body">
                                      <SelectValue placeholder="בחרו ספק נוכחי" />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card border-white/20">
                                      {data.providers.map(provider => (
                                        <SelectItem key={provider} value={provider} className="rounded-xl">{provider}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  
                                  <Input
                                    type="number"
                                    placeholder="סכום חודשי נוכחי (₪)"
                                    value={selectedCategories[category].amount}
                                    onChange={(e) => handleAmountChange(category, e.target.value)}
                                    className="h-12 text-sm glass border-white/20 rounded-2xl font-body"
                                  />
                                </div>
                              )}
                              
                              {/* Ultra-modern button */}
                              <Button 
                                className={`w-full mt-6 h-12 transition-all duration-500 rounded-2xl font-semibold text-sm border-0 ${
                                  isSelected 
                                    ? `bg-gradient-to-r ${data.gradient} text-white shadow-2xl ${data.glowColor} hover:shadow-3xl hover:scale-105` 
                                    : 'glass border-white/20 text-gray-700 hover:bg-white/20'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCategorySelect(category);
                                }}
                              >
                                {isSelected ? (
                                  <span className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    נבחר
                                  </span>
                                ) : (
                                  `בחר ${data.name}`
                                )}
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Category illustration with morphing effect */}
                        <div className="flex justify-center mt-6">
                          <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-300`}></div>
                            <img 
                              src={[electricityFamily, cellularFamily, internetFamily, tvFamily][index]} 
                              alt={`איור ${data.name}`}
                              className="relative w-56 h-36 object-cover rounded-3xl shadow-2xl opacity-80 hover:opacity-100 transition-all duration-500 border border-white/30"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Revolutionary CTA Button */}
                <div className="flex justify-center mt-12">
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                    
                    {/* Main button */}
                    <Button 
                      size="lg" 
                      onClick={handleStartAnalysis}
                      className="relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xl rounded-3xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="flex items-center gap-4">
                        <span>התחל ניתוח חיסכון מתקדם</span>
                        <ArrowRight className="h-6 w-6" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Ultra-Modern How It Works */}
              <div className="max-w-5xl mx-auto mt-20">
                <Card className="glass-card border-white/20 shadow-2xl">
                  <CardContent className="p-12">
                    <div className="text-center mb-12">
                      <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        איך זה עובד?
                      </h2>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
                        תהליך מהפכני ופשוט לחיסכון בחשבונות הבית
                      </p>
                    </div>

                    {/* Revolutionary Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      {[
                        { number: '01', title: 'בחירה חכמה', desc: 'AI מתקדם מנתח את הצרכים שלכם ומוצא את הפתרונות הטובים ביותר' },
                        { number: '02', title: 'השוואה מתקדמת', desc: 'אלגוריתמים מתקדמים סורקים אלפי תעריפים ומוצאים חיסכון מקסימלי' },
                        { number: '03', title: 'מעבר אוטומטי', desc: 'אנחנו מטפלים בכל התהליך מההתחלה ועד הסוף - ללא טרחה' }
                      ].map((step, index) => (
                        <div key={index} className="text-center group">
                          <div className="relative mb-6">
                            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${['from-blue-500 to-purple-600', 'from-purple-500 to-pink-600', 'from-pink-500 to-red-600'][index]} flex items-center justify-center text-white font-bold text-lg shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                              {step.number}
                            </div>
                            <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${['from-blue-500 to-purple-600', 'from-purple-500 to-pink-600', 'from-pink-500 to-red-600'][index]} blur-xl opacity-0 group-hover:opacity-50 transition-all duration-300`}></div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-4 font-display">{step.title}</h3>
                          <p className="text-gray-600 leading-relaxed font-body">{step.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                      <div className="glass-card p-8 rounded-3xl border-white/20 text-center group hover:scale-105 transition-all duration-300">
                        <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">₪3,200</div>
                        <p className="text-xl font-semibold text-gray-800 mb-2 font-display">חיסכון ממוצע בשנה</p>
                        <p className="text-gray-600 font-body">למשפחה ישראלית ממוצעת</p>
                      </div>

                      <div className="glass-card p-8 rounded-3xl border-white/20 text-center group hover:scale-105 transition-all duration-300">
                        <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">100%</div>
                        <p className="text-xl font-semibold text-gray-800 mb-2 font-display">ללא עלות</p>
                        <p className="text-gray-600 font-body">השירות חינם לחלוטין</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;