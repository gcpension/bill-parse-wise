import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, MessageSquare, HeadphonesIcon, Zap } from 'lucide-react';
import { enhancedToast } from '@/components/EnhancedToast';

const Contact = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      enhancedToast.warning({
        title: 'חסרים פרטים',
        description: 'אנא מלאו את כל השדות הנדרשים'
      });
      return;
    }

    // Simulate form submission
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
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">צרו קשר</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              יש לכם שאלות? רוצים עזרה? אנחנו כאן בשבילכם!
              <br />
              הצוות שלנו זמין לעזור לכם לחסוך כסף על חשבונות הבית.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
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
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg"
                    >
                      שלחו הודעה
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">פרטי התקשרות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">טלפון</div>
                      <div className="text-gray-600">03-1234567</div>
                      <div className="text-sm text-purple-600">זמינים א-ה: 9:00-18:00</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">אימייל</div>
                      <div className="text-gray-600">info@easyswitch.co.il</div>
                      <div className="text-sm text-purple-600">מענה תוך 24 שעות</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <HeadphonesIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">WhatsApp</div>
                      <div className="text-gray-600">050-1234567</div>
                      <div className="text-sm text-purple-600">מענה מיידי</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">כתובת</div>
                      <div className="text-gray-600">רחוב הטכנולוגיה 10</div>
                      <div className="text-gray-600">תל אביב-יפו, ישראל</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                    שעות פעילות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-800">ראשון - רביעי</span>
                    <span className="text-gray-600">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">חמישי</span>
                    <span className="text-gray-600">09:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">שישי - שבת</span>
                    <span className="text-red-500">סגור</span>
                  </div>
                  <hr className="my-3" />
                  <div className="text-sm text-purple-600 font-medium">
                    <Zap className="w-4 h-4 inline mr-1" />
                    מענה מיידי בחירום דרך WhatsApp
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">שאלות נפוצות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>• כמה זמן לוקח תהליך המעבר?</div>
                    <div>• האם יש עלויות נסתרות?</div>
                    <div>• מה קורה אם אני לא מרוצה מהספק החדש?</div>
                    <div>• איך אני יודע שאני באמת חוסך כסף?</div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-purple-300 text-purple-600 hover:bg-purple-50"
                    onClick={() => window.location.href = '/help'}
                  >
                    ראו מענה מלא
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emergency Contact */}
          <section className="mt-16 text-center bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">צריכים עזרה דחופה?</h3>
            <p className="text-lg mb-6">
              אם יש לכם בעיה דחופה עם המעבר או השירות, אנחנו זמינים 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-3"
                onClick={() => window.open('tel:03-1234567')}
              >
                <Phone className="w-5 h-5 mr-2" />
                התקשרו עכשיו
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 font-bold px-6 py-3"
                onClick={() => window.open('https://wa.me/972501234567')}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
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