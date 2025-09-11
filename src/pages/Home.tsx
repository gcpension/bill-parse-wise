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
      color: 'from-yellow-300 to-amber-400',
      bgColor: 'bg-gradient-to-br from-yellow-50/80 to-amber-50/80',
      borderColor: 'border-yellow-200/60',
      providers: ['חברת חשמל', 'פז אנרגיה', 'אלקטרה פאוור', 'דור אלון אנרגיה', 'סלקום אנרגיה']
    },
    cellular: {
      name: 'סלולר', 
      icon: Smartphone,
      color: 'from-purple-300 to-indigo-400',
      bgColor: 'bg-gradient-to-br from-purple-50/80 to-indigo-50/80',
      borderColor: 'border-purple-200/60',
      providers: ['פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', '019 מובייל']
    },
    internet: {
      name: 'אינטרנט',
      icon: Wifi,
      color: 'from-blue-300 to-cyan-400',
      bgColor: 'bg-gradient-to-br from-blue-50/80 to-cyan-50/80',
      borderColor: 'border-blue-200/60',
      providers: ['בזק', 'הוט', 'פרטנר', 'סלקום', 'אורנג']
    },
    tv: {
      name: 'טלוויזיה',
      icon: Tv,
      color: 'from-green-300 to-emerald-400',
      bgColor: 'bg-gradient-to-br from-green-50/80 to-emerald-50/80',
      borderColor: 'border-green-200/60',
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

    // Store the data and navigate to results
    localStorage.setItem('analysisData', JSON.stringify(selectedData));
    navigate('/detailed-analysis-results');
  };

  const features = [{
    title: "השוואה מתקדמת",
    description: "אלגוריתמי AI מנתחים אלפי תעריפים בזמן אמת",
    icon: TrendingUp
  }, {
    title: "מעבר אוטומטי",
    description: "אנחנו מטפלים בכל התהליך - ניתוק והתחברות",
    icon: Zap
  }, {
    title: "ללא עמלות",
    description: "השירות חינם לחלוטין - אנחנו מקבלים מהספקים",
    icon: Star
  }, {
    title: "תמיכה 24/7",
    description: "צוות מקצועי זמין לכם בכל שעה",
    icon: Users
  }, {
    title: "אבטחה מלאה",
    description: "הצפנת נתונים ברמה בנקאית",
    icon: Shield
  }, {
    title: "מעקב בזמן אמת",
    description: "עדכונים על סטטוס המעבר בכל שלב",
    icon: CheckCircle
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 font-body overflow-hidden">
      {/* Modern Hero Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-300/15 to-cyan-400/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80" 
          style={{ backgroundImage: `url(${heroModernBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-transparent to-teal-500/20" />
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl animate-float" style={{
          animationDelay: '2s'
        }} />
        <div className="absolute top-1/2 right-10 w-48 h-48 bg-teal-400/25 rounded-full blur-2xl animate-float" style={{
          animationDelay: '4s'
        }} />
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Compact Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-6 shadow-lg">
                <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
                <span className="text-xs font-display font-semibold bg-gradient-to-l from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  הפלטפורמה המתקדמת ביותר • 2025
                </span>
              </div>
              
              {/* Enhanced Main Title */}
              <h1 className="text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight mb-6">
                תפסיקו לבזבז כסף
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-l from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x bg-300%">
                    על חשבונות מנופחים
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-gradient-x bg-300%"></div>
                </span>
              </h1>
              
              {/* Enhanced Subtitle */}
              <div className="space-y-3 mb-10">
                <p className="text-xl lg:text-2xl text-muted-foreground font-body font-light leading-relaxed max-w-4xl mx-auto">
                  אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
                </p>
                <p className="text-lg font-display font-semibold">
                  <span className="bg-gradient-to-l from-success via-emerald-600 to-green-600 bg-clip-text text-transparent">
                    המשפחה הממוצעת חוסכת ₪2,400 בשנה
                  </span>
                  {" "}עם השירות שלנו
                </p>
              </div>

              {/* Category Selection Section - Moved to top */}
              <div className="space-y-8 max-w-6xl mx-auto mb-16">
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                    <span className="bg-gradient-to-l from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      באיזה שירות תרצו להתחיל לחסוך היום?
                    </span>
                  </h2>
                  <p className="text-lg text-gray-700">בחרו קטגוריות והזינו פרטים לקבלת ניתוח מיידי</p>
                </div>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Object.entries(categoryData).map(([category, data]) => {
                    const Icon = data.icon;
                    const isSelected = selectedCategories[category].selected;
                    const categoryImages = {
                      electricity: electricityFamily,
                      cellular: cellularFamily,
                      internet: internetFamily,
                      tv: tvFamily
                    };
                    return (
                      <div key={category} className="space-y-4">
                        <Card 
                          className={`relative overflow-hidden transition-all duration-300 cursor-pointer group ${
                            isSelected 
                              ? `ring-2 ring-primary/40 shadow-xl scale-105 ${data.borderColor}` 
                              : `hover:shadow-lg hover:scale-102 border ${data.borderColor}`
                          } ${data.bgColor} border-2`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-display font-bold text-lg mb-2 text-gray-700">{data.name}</h3>
                            
                            {isSelected && (
                              <div className="space-y-3 mt-4" onClick={(e) => e.stopPropagation()}>
                                <Select 
                                  value={selectedCategories[category].provider} 
                                  onValueChange={(value) => handleProviderChange(category, value)}
                                >
                                  <SelectTrigger className="h-9 text-sm bg-white/90 border-gray-200">
                                    <SelectValue placeholder="בחרו ספק" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {data.providers.map(provider => (
                                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <Input
                                  type="number"
                                  placeholder="סכום חודשי (₪)"
                                  value={selectedCategories[category].amount}
                                  onChange={(e) => handleAmountChange(category, e.target.value)}
                                  className="h-9 text-sm bg-white/90 border-gray-200"
                                />
                              </div>
                            )}
                            
                            <Button 
                              className={`w-full mt-4 transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-primary/80 to-blue-500/80 text-white hover:from-primary hover:to-blue-600' 
                                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategorySelect(category);
                              }}
                            >
                              {isSelected ? 'נבחר ✓' : `בחר ${data.name}`}
                            </Button>
                          </CardContent>
                        </Card>
                        
                        {/* Category Illustration */}
                        <div className="flex justify-center">
                          <img 
                            src={categoryImages[category]} 
                            alt={`איור ${data.name}`}
                            className="w-48 h-36 object-cover rounded-xl shadow-md opacity-80 hover:opacity-100 transition-opacity duration-300"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Start Analysis Button */}
                <div className="flex justify-center mt-12">
                  <Button 
                    size="lg" 
                    onClick={handleStartAnalysis}
                    className="px-20 py-10 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 hover:from-emerald-500 hover:via-green-600 hover:to-teal-600 text-white font-black text-4xl lg:text-5xl shadow-2xl hover:shadow-emerald-400/30 transform hover:scale-105 transition-all duration-300 border-0 relative overflow-hidden rounded-3xl ring-4 ring-emerald-400/40 hover:ring-emerald-500/60 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    <span className="relative flex items-center gap-8">
                      <span className="drop-shadow-lg">התחל ניתוח חיסכון</span>
                      <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform duration-300 drop-shadow-lg" />
                    </span>
                  </Button>
                </div>
              </div>

              {/* Enhanced How It Works Section */}
              <div className="max-w-6xl mx-auto mt-16">
                <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-blue-50/30 shadow-xl">
                  <CardContent className="p-12">
                    {/* Main Title */}
                    <div className="text-center mb-12">
                      <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                          איך המערכת עובדת?
                        </span>
                      </h2>
                      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        תהליך פשוט ומהיר שחוסך לכם זמן, כסף והטרדות מיותרות
                      </p>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto">
                          1
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">בחירת שירותים</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          בחרו את השירותים שאתם רוצים לבדוק - חשמל, סלולר, אינטרנט או טלוויזיה. 
                          הזינו את הספק הנוכחי והסכום החודשי שאתם משלמים.
                        </p>
                      </div>
                      
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto">
                          2
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">ניתוח מתקדם</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          המערכת שלנו סורקת אלפי תעריפים בזמן אמת, משווה מחירים ומוצאת 
                          את האפשרויות הזולות והמשתלמות ביותר עבורכם.
                        </p>
                      </div>
                      
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto">
                          3
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">מעבר אוטומטי</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          אנחנו מטפלים בכל התהליך - ניתוק מהספק הישן, התחברות לחדש, 
                          וליווי מלא עד שהמעבר מושלם.
                        </p>
                      </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <div className="bg-gradient-to-r from-success/10 to-emerald-500/10 p-8 rounded-2xl border border-success/20">
                        <div className="text-center">
                          <div className="text-6xl font-black text-success mb-4">₪2,400</div>
                          <p className="text-xl font-bold text-success mb-2">החיסכון הממוצע</p>
                          <p className="text-gray-600">לשנה למשפחה ממוצעת</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-8 rounded-2xl border border-primary/20">
                        <div className="text-center">
                          <div className="text-6xl font-black text-primary mb-4">100%</div>
                          <p className="text-xl font-bold text-primary mb-2">ללא עלות</p>
                          <p className="text-gray-600">השירות חינם לחלוטין עבורכם</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center mt-12 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
                      <p className="text-lg text-gray-700 font-medium">
                        <span className="text-primary font-bold">למה זה עובד?</span> אנחנו עובדים עם כל הספקים הגדולים בישראל 
                        ומקבלים עמלה מהספק החדש רק אם החיסכון שלכם משמעותי. אין לנו אינטרס להעביר אתכם לספק יקר יותר.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Providers Badge - Enhanced */}
              <div className="text-center mt-16">
                <p className="text-sm text-muted-foreground mb-4 font-medium">עובדים עם כל הספקים המובילים בישראל</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">פלאפון</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">סלקום</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">HOT</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">בזק</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">פרטנר</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">חח"י</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">+עוד</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="group bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-4 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto mb-3">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-base mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-snug font-body text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Moved to bottom */}
      <section className="py-16 bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-900/50 dark:to-gray-900/50 mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  השליחות שלנו
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto mb-8"></div>
            </div>
            
            <div className="space-y-8 text-center max-w-4xl mx-auto">
              <p className="text-xl text-muted-foreground leading-relaxed">
                אנחנו מאמינים שכל משפחה ועסק בישראל ראויים לשקיפות ולהוגנות בעולם השירותים הבסיסיים. 
                <strong className="text-foreground font-semibold"> השליחות שלנו פשוטה אך חיונית - לקזז עלויות מיותרות ולהחזיר לכם את האלפי שקלים שמגיעים לכם מדי שנה.</strong>
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                במקום להישאר תקועים בחוזים יקרים, תעריפים מנופחים ושיחות שימור מייגעות, 
                אנחנו מביאים לכם מהפכה אמיתית - טכנולוגיה מתקדמת שמנתחת את השוק בזמן אמת, 
                מזהה הזדמנויות חיסכון ומבצעת עבורכם את כל התהליך הבירוקרטי.
              </p>
              
              <div className="bg-gradient-to-r from-primary/10 to-success/10 p-8 rounded-3xl border border-primary/20 shadow-lg">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <strong className="text-primary text-2xl font-bold">החזון שלנו:</strong> עולם שבו כל צרכן בישראל יודע בדיוק כמה הוא משלם, 
                  למה הוא משלם, ויש לו את הכלים לשנות את המצב תוך דקות. עד היום חסכנו לאלפי משפחות ועסקים מעל 
                  <strong className="text-success text-3xl font-bold"> 15 מיליון שקל בשנה האחרונה בלבד</strong>.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  <div className="flex items-center gap-2 bg-primary/20 px-6 py-3 rounded-full border border-primary/30">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold text-primary">שקיפות מלאה</span>
                  </div>
                  <div className="flex items-center gap-2 bg-success/20 px-6 py-3 rounded-full border border-success/30">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold text-success">חיסכון מבטיח</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-500/20 px-6 py-3 rounded-full border border-blue-500/30">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold text-blue-600">שירות אישי</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;