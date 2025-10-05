import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  BookOpen, 
  Phone, 
  Mail,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  Upload,
  BarChart3,
  Sparkles,
  Send
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const faqData = [
  {
    category: 'כללי',
    questions: [
      {
        q: 'איך עובדת המערכת?',
        a: 'המערכת משווה את המחירים הנוכחיים שלך מול כל הספקים בשוק הישראלי ומוצאת לך את החבילה הזולה והמתאימה ביותר. פשוט העלה חשבונית או הזן את הנתונים שלך ותקבל המלצות מותאמות אישית.'
      },
      {
        q: 'האם השירות באמת חינמי?',
        a: 'כן! השימוש במערכת חינמי לחלוטין. אנחנו מרוויחים מעמלות קטנות מהספקים כשאתם עוברים אליהם, אבל זה לא משפיע על המחירים שלכם - אתם מקבלים את אותם המחירים כמו בפנייה ישירה.'
      },
      {
        q: 'כמה זמן לוקח התהליך?',
        a: 'התהליך כולו לוקח בין 5-15 דקות. הניתוח אורך כמה שניות, וההחלטה על המעבר תלויה בכם. המעבר הפיזי לספק חדש לוקח בדרך כלל 2-4 שבועות.'
      },
      {
        q: 'האם הנתונים שלי מוגנים?',
        a: 'כן! אנחנו מקפידים על הגנת הפרטיות. הנתונים שלכם מוצפנים ולא נשמרים במערכת לאחר הניתוח. אנחנו עומדים בכל תקני האבטחה הנדרשים.'
      }
    ]
  },
  {
    category: 'ניתוח וחיסכון',
    questions: [
      {
        q: 'כמה אני יכול לחסוך?',
        a: 'החיסכון הממוצע הוא כ-₪2,400 בשנה, אבל זה תלוי בצריכה הנוכחית שלכם ובספקים שאתם משתמשים בהם. ראינו חיסכונים של עד ₪5,000 בשנה למשפחות גדולות.'
      },
      {
        q: 'איך אתם יודעים שזה באמת הכי זול?',
        a: 'אנחנו עובדים עם מסד נתונים מעודכן של כל הספקים והתעריפים בישראל. המערכת בודקת את כל האפשרויות ומציגה לכם רק את החבילות שבאמת חוסכות כסף.'
      },
      {
        q: 'מה אם לא אמצא חיסכון?',
        a: 'במקרים נדירים בהם לא נמצא חיסכון, נציג לכם זאת בבירור. במצב כזה, לפחות תדעו שאתם כבר משלמים את המחיר הטוב ביותר בשוק!'
      }
    ]
  },
  {
    category: 'מעבר בין ספקים',
    questions: [
      {
        q: 'איך עובר בין ספקים?',
        a: 'אנחנו מטפלים בכל התהליך עבורכם! זה כולל: ניתוק מהספק הקודם, חיבור לספק החדש, טיפול בכל הניירת והתיאומים. אתם רק צריכים לחתום על הטפסים.'
      },
      {
        q: 'כמה זמן לוקח המעבר?',
        a: 'המעבר הפיזי לוקח בדרך כלל 2-4 שבועות מרגע החתימה. במהלך התקופה הזו השירות לא מופסק - אתם ממשיכים לקבל חשמל/סלולר/אינטרנט כרגיל.'
      },
      {
        q: 'מה אם אני רוצה לבטל?',
        a: 'יש לכם 14 יום לבטל את ההסכם ללא עלות. אם אתם לא מרוצים מהשירות החדש, אנחנו נעזור לכם לחזור או למצוא ספק אחר.'
      }
    ]
  },
  {
    category: 'בעיות נפוצות',
    questions: [
      {
        q: 'המערכת לא זיהתה את החשבונית שלי',
        a: 'נסו לצלם את החשבונית באור טוב ובזווית ישרה. אם זה לא עוזר, תוכלו להזין את הנתונים ידנית או לפנות אלינו לעזרה.'
      },
      {
        q: 'הספק שהומלץ לי לא מקובל עליי',
        a: 'זה בסדר! המערכת מציגה כמה אפשרויות. תוכלו לבחור כל ספק אחר מהרשימה או להישאר עם הנוכחי אם אתם מרוצים.'
      },
      {
        q: 'יש לי שאלות נוספות',
        a: 'אנחנו כאן לעזור! תוכלו לפנות אלינו בטלפון, במייל או דרך הצ\'אט באתר. זמני התמיכה: ימים א\'-ה\' 08:00-18:00.'
      }
    ]
  }
];

const quickGuides = [
  {
    title: 'איך להעלות חשבונית',
    description: 'מדריך מהיר להעלאת חשבונית לניתוח',
    icon: Upload,
    steps: [
      'לחץ על "התחל לחסוך עכשיו"',
      'צלם או העלה תמונה של החשבונית',
      'וודא שהטקסט קריא ובמרכז התמונה',
      'המתן לניתוח אוטומטי'
    ]
  },
  {
    title: 'איך להזין נתונים ידנית',
    description: 'מילוי פרטים ללא העלאת קובץ',
    icon: Calculator,
    steps: [
      'בחר "הזנה ידנית" בעמוד הניתוח',
      'בחר את סוג השירות (חשמל/סלולר/אינטרנט)',
      'הזן את הספק הנוכחי והסכום החודשי',
      'לחץ "נתח עכשיו"'
    ]
  },
  {
    title: 'איך להשוות מחירים',
    description: 'השוואה מהירה בין ספקים',
    icon: BarChart3,
    steps: [
      'עבר לעמוד "השוואה מהירה"',
      'בחר קטגוריה וסכום נוכחי',
      'עיין בכל האפשרויות הזמינות',
      'לחץ על חבילה לפרטים מלאים'
    ]
  }
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();
  const { isVisible: heroVisible, elementRef: heroRef } = useScrollAnimation();
  const { isVisible: guidesVisible, elementRef: guidesRef } = useScrollAnimation();
  const { isVisible: faqVisible, elementRef: faqRef } = useScrollAnimation();

  const filteredFAQ = faqData
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        item =>
          (selectedCategory === 'all' || category.category === selectedCategory) &&
          (searchQuery === '' ||
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(category => category.questions.length > 0);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "פנייה נשלחה בהצלחה!",
      description: "נחזור אליך בתוך 24 שעות",
    });
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 py-12 space-y-12 relative z-10">
          {/* Header */}
          <div 
            ref={heroRef}
            className={`text-center space-y-6 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                עזרה ותמיכה
              </h1>
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              מצא תשובות לשאלות נפוצות, מדריכים מפורטים או פנה אלינו לעזרה אישית
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="group glass-card-strong border-0 shadow-lg hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">&lt; 5 דק׳</div>
                <p className="text-sm text-muted-foreground">זמן תגובה ממוצע</p>
              </CardContent>
            </Card>
            <Card className="group glass-card-strong border-0 shadow-lg hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">98%</div>
                <p className="text-sm text-muted-foreground">שביעות רצון</p>
              </CardContent>
            </Card>
            <Card className="group glass-card-strong border-0 shadow-lg hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">צ׳אט אונליין</p>
              </CardContent>
            </Card>
            <Card className="group glass-card-strong border-0 shadow-lg hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">15+</div>
                <p className="text-sm text-muted-foreground">מדריכים</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Guides */}
          <Card 
            ref={guidesRef}
            className={`glass-card-strong border-0 shadow-purple-lg transition-all duration-1000 ${
              guidesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className="p-2 bg-primary/10 rounded-lg ml-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                מדריכים מהירים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                {quickGuides.map((guide, index) => (
                  <div key={index} className="space-y-4 p-6 bg-primary/5 rounded-2xl border border-primary/10 hover-lift">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <guide.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground">{guide.description}</p>
                      </div>
                    </div>
                    <ol className="space-y-2 text-sm">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <Badge variant="outline" className="text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground border-primary">
                            {stepIndex + 1}
                          </Badge>
                          <span className="leading-relaxed text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card 
            ref={faqRef}
            className={`glass-card-strong border-0 shadow-purple-lg transition-all duration-1000 ${
              faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <MessageCircle className="ml-2 h-6 w-6 text-primary" />
                שאלות נפוצות
              </CardTitle>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="חפש בשאלות נפוצות..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card/50 border-border"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'all', label: 'הכל' },
                    { key: 'כללי', label: 'כללי' },
                    { key: 'ניתוח וחיסכון', label: 'ניתוח וחיסכון' },
                    { key: 'מעבר בין ספקים', label: 'מעבר בין ספקים' },
                    { key: 'בעיות נפוצות', label: 'בעיות נפוצות' }
                  ].map((item) => (
                    <Button
                      key={item.key}
                      variant={selectedCategory === item.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(item.key)}
                      className={selectedCategory === item.key ? 'gradient-primary text-primary-foreground' : ''}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFAQ.map((category) => (
                <div key={category.category} className="space-y-2">
                  <h3 className="font-semibold text-lg text-primary">{category.category}</h3>
                  {category.questions.map((item, index) => {
                    const itemId = `${category.category}-${index}`;
                    const isOpen = openItems.includes(itemId);
                    
                    return (
                      <Collapsible key={itemId}>
                        <CollapsibleTrigger
                          className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-right hover:bg-primary/5 transition-colors"
                          onClick={() => toggleItem(itemId)}
                        >
                          <span className="font-medium text-foreground">{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-primary" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4 pt-2 text-muted-foreground">
                          {item.a}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              ))}

              {filteredFAQ.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">לא נמצאו תוצאות לחיפוש שלך</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="glass-card-strong border-0 shadow-purple-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Send className="h-6 w-6 text-primary" />
                לא מצאתם תשובה? צרו קשר
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">שם מלא</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="הכניסו את שמכם"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">אימייל</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">נושא</label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="נושא הפנייה"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">הודעה</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="כתבו כאן את ההודעה שלכם..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-primary hover:gradient-primary-hover text-primary-foreground font-bold hover-lift group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      שולח...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      שלחו הודעה
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card-strong border-0 shadow-lg hover-lift text-center group">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">טלפון</h3>
                <p className="text-muted-foreground mb-2">03-1234567</p>
                <p className="text-sm text-primary">א'-ה' 09:00-18:00</p>
              </CardContent>
            </Card>
            <Card className="glass-card-strong border-0 shadow-lg hover-lift text-center group">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">אימייל</h3>
                <p className="text-muted-foreground mb-2">info@easyswitch.co.il</p>
                <p className="text-sm text-primary">מענה תוך 24 שעות</p>
              </CardContent>
            </Card>
            <Card className="glass-card-strong border-0 shadow-lg hover-lift text-center group">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-2">050-1234567</p>
                <p className="text-sm text-primary">מענה מיידי 24/7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
