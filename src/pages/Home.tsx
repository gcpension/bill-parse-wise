import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Wifi, Smartphone, Tv, CheckCircle, ArrowRight, Phone, Router, Lightbulb, Cable, Plug, WifiOff, Battery, Monitor, Tablet, Headphones, Radio, Satellite, X, Sparkles, TrendingUp, Star, Target, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import { QuickRecommendationFlow, QuickFlowData } from '@/components/QuickRecommendationFlow';
import { PersonalizedRecommendationWizard } from '@/components/PersonalizedRecommendationWizard';
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
  const [showQuickFlow, setShowQuickFlow] = useState(false);
  const [showPersonalizedWizard, setShowPersonalizedWizard] = useState(false);
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

  const handleQuickFlowComplete = (data: QuickFlowData) => {
    setShowQuickFlow(false);
    // Navigate to all plans with quick flow data
    localStorage.setItem('quickFlowData', JSON.stringify(data));
    navigate('/all-plans');
  };

  const handlePersonalizedComplete = () => {
    setShowPersonalizedWizard(false);
    navigate('/all-plans');
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="bg-background border-b border-border py-4 sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                EasySwitch
              </h1>
            </div>
            
            {/* Navigation Links on the right */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-foreground font-medium hover:text-primary transition-colors">
                דף הבית
              </a>
              <a href="/magazine" className="text-muted-foreground hover:text-foreground transition-colors">
                מגזין
              </a>
              <a href="/tips" className="text-muted-foreground hover:text-foreground transition-colors">
                טיפים
              </a>
              <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                אודות
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                צור קשר
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Who we are */}
      <section className="relative py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary">
                למעלה מ-10,000 משפחות חוסכות איתנו כל חודש
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-foreground">חסכו עד </span>
              <span className="text-primary">₪3,000 בשנה</span>
              <br />
              <span className="text-foreground">על חשבונות הבית</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              אנחנו משווים עבורכם את כל התוכניות של חשמל, סלולר, אינטרנט וטלוויזיה
              <br />
              ומוצאים את החיסכון הכי גדול - בחינם!
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button
                size="lg"
                onClick={() => setShowQuickFlow(true)}
                className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                התחל לחסוך עכשיו
                <ArrowRight className="mr-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-lg px-8 py-6 rounded-xl"
              >
                איך זה עובד?
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">₪2,400</div>
                <div className="text-sm text-muted-foreground">חיסכון ממוצע בשנה</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">2 דקות</div>
                <div className="text-sm text-muted-foreground">זמן ממוצע להשוואה</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">שירות חינמי</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">מי אנחנו</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                השירות המוביל להשוואת מחירים בישראל
              </h2>
              
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  <strong className="text-foreground">EasySwitch</strong> היא פלטפורמה חכמה שעוזרת למשפחות ישראליות לחסוך אלפי שקלים בשנה על חשבונות הבית.
                </p>
                <p>
                  אנחנו משווים עבורכם מאות תוכניות של כל הספקים הגדולים בישראל - חשמל, סלולר, אינטרנט וטלוויזיה - ומוצאים את ההצעה הכי משתלמת בדיוק בשבילכם.
                </p>
                <p>
                  <strong className="text-foreground">בחינם. מהר. פשוט.</strong>
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="aspect-square rounded-xl bg-background shadow-lg p-4 flex items-center justify-center">
                    <Zap className="w-12 h-12 text-primary" />
                  </div>
                  <div className="aspect-square rounded-xl bg-background shadow-lg p-4 flex items-center justify-center">
                    <Smartphone className="w-12 h-12 text-primary" />
                  </div>
                  <div className="aspect-square rounded-xl bg-background shadow-lg p-4 flex items-center justify-center">
                    <Wifi className="w-12 h-12 text-primary" />
                  </div>
                  <div className="aspect-square rounded-xl bg-background shadow-lg p-4 flex items-center justify-center">
                    <Tv className="w-12 h-12 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">איך זה עובד</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              3 צעדים פשוטים לחיסכון
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              תוך פחות מ-2 דקות תגלו כמה אתם יכולים לחסוך
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">ספרו לנו על עצמכם</h3>
                <p className="text-muted-foreground">
                  בחרו את הקטגוריות (חשמל, סלולר, אינטרנט, טלוויזיה) ותספרו לנו כמה אתם משלמים היום
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">אנחנו משווים עבורכם</h3>
                <p className="text-muted-foreground">
                  המערכת שלנו משווה מאות תוכניות מכל הספקים ומוצאת את ההצעות הכי משתלמות בדיוק בשבילכם
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">תתחילו לחסוך</h3>
                <p className="text-muted-foreground">
                  קבלו המלצות מותאמות אישית והתחילו לחסוך כסף כבר החודש - פשוט וללא מאמץ
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center pt-12">
            <Button
              size="lg"
              onClick={() => setShowQuickFlow(true)}
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              בואו נתחיל - זה לוקח 2 דקות
              <ArrowRight className="mr-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              למה לבחור ב-EasySwitch?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 space-y-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">חינמי לגמרי</h3>
                <p className="text-sm text-muted-foreground">
                  השירות שלנו חינמי 100%. ללא עלויות נסתרות
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 space-y-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">מהיר וקל</h3>
                <p className="text-sm text-muted-foreground">
                  ההשוואה לוקחת פחות מ-2 דקות
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 space-y-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">חיסכון מובטח</h3>
                <p className="text-sm text-muted-foreground">
                  המשפחה הממוצעת חוסכת ₪2,400 בשנה
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 space-y-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">מהימן ובטוח</h3>
                <p className="text-sm text-muted-foreground">
                  כל הספקים המובילים במקום אחד
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section - Companies Logos */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">שותפים מהימנים</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              אנחנו משווים עבורכם את כל הספקים המובילים
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              גישה למאות תוכניות מכל החברות הגדולות בישראל
            </p>
          </div>

          {/* Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
            <div className="flex items-center justify-center p-6 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <img src={israeliCompaniesLogos} alt="לוגו חברות" className="max-h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center justify-center p-6 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Zap className="w-12 h-12 text-primary" />
            </div>
            <div className="flex items-center justify-center p-6 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Smartphone className="w-12 h-12 text-primary" />
            </div>
            <div className="flex items-center justify-center p-6 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Wifi className="w-12 h-12 text-primary" />
            </div>
            <div className="flex items-center justify-center p-6 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Tv className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-12">
            <p className="text-muted-foreground mb-6">מוכנים להתחיל לחסוך?</p>
            <Button
              size="lg"
              onClick={() => setShowQuickFlow(true)}
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              התחל השוואת מחירים
              <ArrowRight className="mr-2 w-5 h-5" />
            </Button>
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
          {/* Comparison Table Section - 2024 vs 2025 */}
          <div className="mb-20">
            <div className="text-center mb-16 animate-fade-in">
              <Badge variant="outline" className="mb-4 border-purple-300 text-purple-700 bg-white/80 backdrop-blur-sm">
                השוואת תהליכים
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-heebo font-bold text-royal-purple mb-4">
                איך זה נראה היום<br />לעומת 2025?
              </h2>
              <p className="text-xl text-gray-700 font-assistant max-w-2xl mx-auto">
                גלו את ההבדל המשמעותי בין הדרך המסורתית לפתרון החדש
              </p>
            </div>

            {/* Comparison Table - Clean Design */}
            <div className="max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
              {/* Header Row */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div></div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-gray-300 shadow-sm">
                    <Zap className="w-5 h-5 text-gray-600" />
                    <p className="font-heebo font-bold text-gray-800 text-lg">היום</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-br from-purple-600 to-purple-700 px-6 py-3 rounded-xl shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                    <p className="font-heebo font-bold text-white text-lg">2025</p>
                  </div>
                </div>
              </div>

              {/* Comparison Rows */}
              <div className="space-y-6">
                {/* Row 1: Duration */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-bold text-lg">משך זמן</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <X className="w-5 h-5" />
                      <p className="font-assistant font-medium">3-5 שעות</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-assistant font-bold">5 דקות</p>
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone Calls */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-bold text-lg">שיחות טלפון</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <X className="w-5 h-5" />
                      <p className="font-assistant font-medium">רבות</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-assistant font-bold">אפס</p>
                    </div>
                  </div>
                </div>

                {/* Row 3: Forms */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-bold text-lg">מילוי טפסים</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <X className="w-5 h-5" />
                      <p className="font-assistant font-medium">מסורבל</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-assistant font-bold">דיגיטלי</p>
                    </div>
                  </div>
                </div>

                {/* Row 4: Price Comparison */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-bold text-lg">השוואת מחירים</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <X className="w-5 h-5" />
                      <p className="font-assistant font-medium">מפוזר</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-assistant font-bold">מרוכז</p>
                    </div>
                  </div>
                </div>

                {/* Row 5: Cost - Highlighted */}
                <div className="grid grid-cols-3 gap-6 items-center pt-6 border-t-2 border-gray-200/50">
                  <div className="text-right">
                    <p className="text-gray-900 font-heebo font-black text-xl">עלות חודשית</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-gray-300 shadow-sm">
                      <p className="font-heebo font-bold text-gray-900 text-xl">₪800-1,200</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 px-6 py-3 rounded-xl shadow-lg">
                      <p className="font-heebo font-bold text-white text-xl">₪600-900</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <p className="text-3xl font-heebo font-black text-purple-600 mb-2">5 דקות</p>
                <p className="text-sm text-gray-600 font-assistant">זמן ממוצע</p>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <p className="text-3xl font-heebo font-black text-purple-600 mb-2">15,000+</p>
                <p className="text-sm text-gray-600 font-assistant">משפחות חסכו</p>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <p className="text-3xl font-heebo font-black text-purple-600 mb-2">₪2,400</p>
                <p className="text-sm text-gray-600 font-assistant">חיסכון שנתי</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', opacity: 0 }}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-heebo text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                התחילו לחסוך עכשיו
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-600 font-assistant mt-4">
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

      {/* Quick Flow Dialog */}
      <QuickRecommendationFlow
        isOpen={showQuickFlow}
        onClose={() => setShowQuickFlow(false)}
        onComplete={handleQuickFlowComplete}
      />

      {/* Personalized Wizard Dialog */}
      <PersonalizedRecommendationWizard
        onClose={() => setShowPersonalizedWizard(false)}
        onComplete={handlePersonalizedComplete}
        categories={['electricity', 'internet', 'mobile', 'tv']}
      />
    </div>;
};
export default Home;