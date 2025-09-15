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
      color: 'from-primary to-primary/80',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      providers: ['חברת חשמל', 'פז אנרגיה', 'אלקטרה פאוור', 'דור אלון אנרגיה', 'סלקום אנרגיה']
    },
    cellular: {
      name: 'סלולר', 
      icon: Smartphone,
      color: 'from-secondary to-secondary/80',
      bgColor: 'bg-secondary/5',
      borderColor: 'border-secondary/20',
      providers: ['פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', '019 מובייל']
    },
    internet: {
      name: 'אינטרנט',
      icon: Wifi,
      color: 'from-accent to-accent/80',
      bgColor: 'bg-accent/5',
      borderColor: 'border-accent/20',
      providers: ['בזק', 'הוט', 'פרטנר', 'סלקום', 'אורנג']
    },
    tv: {
      name: 'טלוויזיה',
      icon: Tv,
      color: 'from-muted-foreground to-muted-foreground/80',
      bgColor: 'bg-muted/20',
      borderColor: 'border-muted-foreground/20',
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
    navigate('/all-plans');
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
    <div className="min-h-screen bg-background font-body">
      {/* Clean Professional Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-xl opacity-50" />
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-secondary/15 rounded-full blur-2xl opacity-60" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className={`transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {/* Professional Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/20 mb-6">
                <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-1.5 h-1.5 text-primary-foreground" />
                </div>
                <span className="text-xs font-medium text-primary">
                  פלטפורמה מתקדמת לחיסכון • 2025
                </span>
              </div>
              
              {/* Professional Main Title */}
              <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tight leading-tight mb-6 text-foreground">
                חסכו בחשבונות הבית
                <br />
                <span className="text-primary">
                  בקלות ובמהירות
                </span>
              </h1>
              
              {/* Clean Subtitle */}
              <div className="space-y-3 mb-8">
                <p className="text-lg lg:text-xl text-muted-foreground font-body leading-relaxed max-w-3xl mx-auto">
                  אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
                </p>
                <p className="text-base font-medium text-primary font-body">
                  המשפחה הממוצעת חוסכת ₪2,400 בשנה עם השירות שלנו
                </p>
              </div>

              {/* Category Selection Section - Professional Design */}
              <div className="space-y-6 max-w-5xl mx-auto mb-12">
                <div className="text-center">
                  <h2 className="text-2xl lg:text-3xl font-display font-semibold mb-3 text-foreground tracking-tight">
                    באיזה שירות תרצו להתחיל לחסוך?
                  </h2>
                  <p className="text-base text-muted-foreground font-body">בחרו קטגוריות והזינו פרטים לקבלת ניתוח מיידי</p>
                </div>

                 {/* Category Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          className={`relative overflow-hidden transition-all duration-500 cursor-pointer group backdrop-blur-sm ${
                            isSelected 
                              ? `ring-2 ring-primary shadow-2xl scale-[1.02] bg-gradient-to-br from-card to-primary/5` 
                              : `hover:shadow-xl hover:scale-[1.01] bg-card/80 border-border`
                          } border-2 rounded-2xl`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                              <Icon className="w-8 h-8 text-white drop-shadow-sm" />
                            </div>
                            <h3 className="font-display font-semibold text-xl mb-2 text-foreground tracking-tight">{data.name}</h3>
                            
                            {isSelected && (
                              <div className="space-y-3 mt-4" onClick={(e) => e.stopPropagation()}>
                                <Select 
                                  value={selectedCategories[category].provider} 
                                  onValueChange={(value) => handleProviderChange(category, value)}
                                >
                                  <SelectTrigger className="h-10 text-sm bg-background/90 border-border/50 rounded-xl font-body">
                                    <SelectValue placeholder="בחרו ספק נוכחי" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {data.providers.map(provider => (
                                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <Input
                                  type="number"
                                  placeholder="סכום חודשי נוכחי (₪)"
                                  value={selectedCategories[category].amount}
                                  onChange={(e) => handleAmountChange(category, e.target.value)}
                                  className="h-10 text-sm bg-background/90 border-border/50 rounded-xl font-body"
                                />
                              </div>
                            )}
                            
                            <Button 
                              className={`w-full mt-5 transition-all duration-300 rounded-xl font-medium ${
                                isSelected 
                                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md' 
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
                            className="w-48 h-32 object-cover rounded-2xl shadow-md opacity-75 hover:opacity-95 transition-all duration-300 border border-border/30"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Professional Start Analysis Button */}
                <div className="flex justify-center mt-8">
                  <Button 
                    size="lg" 
                    onClick={handleStartAnalysis}
                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 border-0 rounded-lg"
                  >
                    <span className="flex items-center gap-3">
                      <span>התחל ניתוח חיסכון</span>
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Button>
                </div>
              </div>

              {/* Professional How It Works Section */}
              <div className="max-w-4xl mx-auto mt-16">
                <Card className="border border-border bg-card shadow-lg">
                  <CardContent className="p-8">
                    {/* Clean Title */}
                    <div className="text-center mb-10">
                      <h2 className="text-2xl lg:text-3xl font-display font-semibold mb-4 text-foreground">
                        איך זה עובד?
                      </h2>
                      <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        תהליך פשוט ומהיר לחיסכון בחשבונות הבית
                      </p>
                    </div>

                    {/* Professional Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                      <div className="text-center space-y-3">
                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg mx-auto">
                          1
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">בחירת שירותים</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          בחרו את השירותים שאתם רוצים לבדוק והזינו את הפרטים הנוכחיים שלכם
                        </p>
                      </div>
                      
                      <div className="text-center space-y-3">
                        <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-semibold text-lg mx-auto">
                          2
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">ניתוח מתקדם</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          המערכת סורקת תעריפים ומוצאת את האפשרויות הטובות ביותר עבורכם
                        </p>
                      </div>
                      
                      <div className="text-center space-y-3">
                        <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-lg mx-auto">
                          3
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">מעבר מלווה</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          אנחנו מטפלים בכל התהליך עד שהמעבר מושלם
                        </p>
                      </div>
                    </div>

                    {/* Professional Key Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">₪2,400</div>
                          <p className="text-base font-medium text-primary mb-1">חיסכון ממוצע בשנה</p>
                          <p className="text-sm text-muted-foreground">למשפחה ממוצעת</p>
                        </div>
                      </div>

                      <div className="bg-secondary/5 p-6 rounded-lg border border-secondary/20">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-secondary mb-2">100%</div>
                          <p className="text-base font-medium text-secondary mb-1">ללא עלות</p>
                          <p className="text-sm text-muted-foreground">השירות חינם לחלוטין</p>
                        </div>
                      </div>
                    </div>

                    {/* Clean Additional Info */}
                    <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">למה השירות חינם?</span> אנחנו מקבלים עמלה מהספק החדש רק כשהחיסכון משמעותי
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