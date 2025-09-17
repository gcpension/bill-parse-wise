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
        q: 'מה אם אני רצה לבטל?',
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
    
    // Simulate form submission
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
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Header */}
          <div 
            ref={heroRef}
            className={`text-center space-y-6 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-6">
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                <HelpCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                עזרה ותמיכה
              </h1>
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              מצא תשובות לשאלות נפוצות, מדריכים מפורטים או פנה אלינו לעזרה אישית
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="group bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">&lt; 5 דק׳</div>
                <p className="text-sm text-muted-foreground">זמן תגובה ממוצע</p>
              </CardContent>
            </Card>
            <Card className="group bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">98%</div>
                <p className="text-sm text-muted-foreground">שביעות רצון</p>
              </CardContent>
            </Card>
            <Card className="group bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-8 w-8 text-accent" />
                </div>
                <div className="text-2xl font-bold text-accent mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">צ׳אט אונליין</p>
              </CardContent>
            </Card>
            <Card className="group bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-2">15+</div>
                <p className="text-sm text-muted-foreground">מדריכים</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Guides */}
          <Card 
            ref={guidesRef}
            className={`bg-gradient-to-br from-card to-accent/5 border-0 shadow-2xl transition-all duration-1000 ${
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
                <div key={index} className="space-y-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <guide.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </div>
                  </div>
                  <ol className="space-y-2 text-sm">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <Badge variant="outline" className="text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center bg-primary text-white border-primary">
                          {stepIndex + 1}
                        </Badge>
                        <span className="leading-relaxed">{step}</span>
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
          className={`bg-gradient-to-br from-card to-primary/5 border-0 shadow-2xl transition-all duration-1000 ${
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
                  className="pl-10 bg-white/50 border-border/50"
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
                    className="bg-white/50 border-border/50"
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
                      className="flex w-full items-center justify-between rounded-lg border p-4 text-right hover:bg-accent"
                      onClick={() => toggleItem(itemId)}
                    >
                      <span className="font-medium">{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 text-muted-foreground">
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

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card className="bg-white/70 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">צרו קשר</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">טלפון</h4>
                    <p className="text-muted-foreground">03-123-4567</p>
                    <p className="text-xs text-muted-foreground">א׳-ה׳ 08:00-18:00</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-success/5 rounded-2xl border border-success/10">
                  <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">אימייל</h4>
                    <p className="text-muted-foreground">support@savings.co.il</p>
                    <p className="text-xs text-muted-foreground">מענה תוך 24 שעות</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">צ'אט חי</h4>
                    <p className="text-muted-foreground">זמין 24/7</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-white/50">
                      התחל צ'אט
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="bg-white/70 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">שלח הודעה</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="שם מלא"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="כתובת אימייל"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="נושא"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="תיאור הבעיה או השאלה..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Mail className="ml-2 h-4 w-4" />
                שלח הודעה
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;