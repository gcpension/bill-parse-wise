import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const testimonials = [
  {
    id: 1,
    name: 'יעל כהן',
    location: 'תל אביב',
    image: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    date: 'לפני שבועיים',
    text: 'חסכתי 180 ₪ בחודש! המעבר היה כל כך פשוט, פשוט מילאתי את הפרטים והם טפלו בכל השאר. ממליצה בחום!',
    savings: '2,160',
    service: 'אינטרנט + סלולר'
  },
  {
    id: 2,
    name: 'דוד לוי',
    location: 'ירושלים',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    date: 'לפני חודש',
    text: 'הייתי סקפטי בהתחלה, אבל באמת חסכתי מעל 1,500 ₪ בשנה על החשמל והאינטרנט. השירות היה מקצועי ומהיר.',
    savings: '1,500',
    service: 'חשמל + אינטרנט'
  },
  {
    id: 3,
    name: 'מיכל אברהם',
    location: 'חיפה',
    image: 'https://i.pravatar.cc/150?img=38',
    rating: 5,
    date: 'לפני 3 שבועות',
    text: 'סוף סוף שירות שעושה את העבודה בשבילך. לא הייתי צריכה להתקשר לאף אחד או למלא טפסים מסובכים. הכל אוטומטי!',
    savings: '960',
    service: 'סלולר'
  },
  {
    id: 4,
    name: 'אלי שמעון',
    location: 'רעננה',
    image: 'https://i.pravatar.cc/150?img=14',
    rating: 5,
    date: 'לפני שבוע',
    text: 'המלצה של חברים והחלטתי לנסות. תוך 5 דקות גיליתי שאני משלם יותר מדי והם עזרו לי לעבור לתכנית הרבה יותר משתלמת.',
    savings: '1,320',
    service: 'טלוויזיה + אינטרנט'
  },
  {
    id: 5,
    name: 'שרה פרידמן',
    location: 'פתח תקווה',
    image: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    date: 'לפני 10 ימים',
    text: 'כמשפחה גדולה, החיסכון משמעותי מאוד. חסכנו על 4 קווי סלולר ועל האינטרנט הביתי. בסך הכל כמעט 250 ₪ בחודש!',
    savings: '3,000',
    service: 'סלולר (4 קווים) + אינטרנט'
  },
  {
    id: 6,
    name: 'רון גולדשטיין',
    location: 'הרצליה',
    image: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    date: 'לפני 3 ימים',
    text: 'מדהים כמה כסף בזבזתי כל השנים! השוויתי בעצמי והם צדקו לגמרי - עכשיו אני משלם הרבה פחות עם אותו שירות בדיוק.',
    savings: '1,800',
    service: 'חשמל + אינטרנט + טלוויזיה'
  }
];

export const TestimonialsSection = () => {
  const { elementRef } = useScrollAnimation(0.1);

  return (
    <section ref={elementRef} className="py-16 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
            <span className="text-purple-700 font-medium">מה הלקוחות אומרים</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            אלפי משפחות כבר חוסכות
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            הצטרפו לאלפי משפחות ישראליות שכבר מחסכות אלפי שקלים בשנה בעזרת השירות שלנו
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="relative overflow-hidden border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 left-4 opacity-10">
                  <Quote className="w-16 h-16 text-purple-600" />
                </div>

                {/* Header */}
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-purple-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-4 leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Footer Info */}
                <div className="pt-4 border-t border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{testimonial.service}</p>
                      <p className="text-sm font-semibold text-purple-600">
                        חיסכון: ₪{testimonial.savings} בשנה
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-50 rounded-full border border-purple-200">
            <div className="flex -space-x-2">
              {[47, 12, 38, 14, 45].map((img) => (
                <img 
                  key={img}
                  src={`https://i.pravatar.cc/40?img=${img}`} 
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <span className="text-foreground font-medium">
              +15,000 משפחות חסכו בשנה האחרונה
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
