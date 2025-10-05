import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, MessageSquare, HeadphonesIcon, Zap, Send, CheckCircle2 } from 'lucide-react';
import { enhancedToast } from '@/components/EnhancedToast';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isVisible: heroVisible, elementRef: heroRef } = useScrollAnimation();
  const { isVisible: formVisible, elementRef: formRef } = useScrollAnimation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      enhancedToast.warning({
        title: 'חסרים פרטים',
        description: 'אנא מלאו את כל השדות הנדרשים'
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission with delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    enhancedToast.success({
      title: 'ההודעה נשלחה בהצלחה!',
      description: 'נחזור אליכם תוך 24 שעות'
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div 
            ref={heroRef}
            className={`container mx-auto px-4 text-center relative z-10 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold gradient-primary bg-clip-text text-transparent mb-6">
              צרו קשר
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              יש לכם שאלות? רוצים עזרה? אנחנו כאן בשבילכם!
              <br />
              הצוות שלנו זמין לעזור לכם לחסוך כסף על חשבונות הבית.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div 
              ref={formRef}
              className={`transition-all duration-1000 ${
                formVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <Card className="glass-card-strong shadow-purple-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    שלחו לנו הודעה
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">שם מלא *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="הכניסו את שמכם המלא"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">אימייל *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">טלפון</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="050-1234567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">נושא הפנייה</Label>
                      <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="בחרו נושא" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">שאלה כללית</SelectItem>
                          <SelectItem value="support">תמיכה טכנית</SelectItem>
                          <SelectItem value="savings">שאלות על חיסכון</SelectItem>
                          <SelectItem value="switch">עזרה במעבר ספקים</SelectItem>
                          <SelectItem value="billing">שאלות על חיוב</SelectItem>
                          <SelectItem value="feedback">משוב והצעות</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">ההודעה שלכם *</Label>
                      <Textarea
                        id="message"
                        placeholder="כתבו כאן את ההודעה שלכם..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full h-12 gradient-primary hover:gradient-primary-hover text-primary-foreground font-bold text-lg shadow-purple hover-lift"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <Card className="glass-card-strong shadow-lg hover-lift border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">פרטי התקשרות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">טלפון</div>
                      <div className="text-muted-foreground">03-1234567</div>
                      <div className="text-sm text-primary">זמינים א-ה: 9:00-18:00</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">אימייל</div>
                      <div className="text-muted-foreground">info@easyswitch.co.il</div>
                      <div className="text-sm text-primary">מענה תוך 24 שעות</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <HeadphonesIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">WhatsApp</div>
                      <div className="text-muted-foreground">050-1234567</div>
                      <div className="text-sm text-primary">מענה מיידי</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">כתובת</div>
                      <div className="text-muted-foreground">רחוב הטכנולוגיה 10</div>
                      <div className="text-muted-foreground">תל אביב-יפו, ישראל</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="glass-card-strong shadow-lg hover-lift border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground flex items-center gap-3">
                    <Clock className="w-6 h-6 text-primary" />
                    שעות פעילות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground">ראשון - רביעי</span>
                    <span className="text-muted-foreground">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">חמישי</span>
                    <span className="text-muted-foreground">09:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">שישי - שבת</span>
                    <span className="text-destructive">סגור</span>
                  </div>
                  <hr className="my-3 border-border" />
                  <div className="text-sm text-primary font-medium">
                    <Zap className="w-4 h-4 inline mr-1" />
                    מענה מיידי בחירום דרך WhatsApp
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="glass-card-strong shadow-lg hover-lift border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">שאלות נפוצות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div>• כמה זמן לוקח תהליך המעבר?</div>
                    <div>• האם יש עלויות נסתרות?</div>
                    <div>• מה קורה אם אני לא מרוצה מהספק החדש?</div>
                    <div>• איך אני יודע שאני באמת חוסך כסף?</div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-primary/30 text-primary hover:bg-primary/5 hover-lift"
                    onClick={() => navigate('/help')}
                  >
                    ראו מענה מלא
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emergency Contact */}
          <section className="mt-16 text-center glass-card-strong rounded-2xl p-8 shadow-purple-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4">צריכים עזרה דחופה?</h3>
            <p className="text-lg text-muted-foreground mb-6">
              אם יש לכם בעיה דחופה עם המעבר או השירות, אנחנו זמינים 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="gradient-primary hover:gradient-primary-hover text-primary-foreground font-bold px-6 py-3 shadow-purple hover-lift group"
                onClick={() => window.open('tel:03-1234567')}
              >
                <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                התקשרו עכשיו
              </Button>
              <Button 
                className="bg-success hover:bg-success/90 text-success-foreground font-bold px-6 py-3 hover-lift group"
                onClick={() => window.open('https://wa.me/972501234567')}
              >
                <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                WhatsApp
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;