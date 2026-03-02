import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { motion } from 'framer-motion';

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
    rating: 4.5,
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
    rating: 4.5,
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

// Find the testimonial with the highest savings for the featured card
const featuredIndex = testimonials.reduce((maxIdx, t, idx, arr) => 
  parseInt(t.savings.replace(',', '')) > parseInt(arr[maxIdx].savings.replace(',', '')) ? idx : maxIdx, 0);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= Math.floor(rating)
            ? 'text-yellow-500 fill-yellow-500'
            : i - 0.5 <= rating
            ? 'text-yellow-500 fill-yellow-500/50'
            : 'text-gray-300'
        }`}
      />
    ))}
  </div>
);

export const TestimonialsSection = () => {
  const { elementRef } = useScrollAnimation(0.1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    const speed = 0.5; // px per frame

    const scroll = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // Reset when scrolled to the duplicate set
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(scroll);
    };
    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  // Duplicate testimonials for infinite scroll
  const allTestimonials = [...testimonials, ...testimonials];

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
            הצטרפו לאלפי משפחות ישראליות שכבר חוסכות אלפי שקלים בשנה
          </p>
        </div>

        {/* Desktop: Featured layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-8">
          {/* Side cards (left) */}
          <div className="space-y-6">
            {[testimonials[0], testimonials[2]].map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <TestimonialCard testimonial={t} />
              </motion.div>
            ))}
          </div>

          {/* Featured center card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-2 border-purple-300 shadow-2xl shadow-purple-500/10 bg-gradient-to-br from-white to-purple-50 h-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500" />
              <CardContent className="p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="absolute top-6 left-6 opacity-10">
                    <Quote className="w-20 h-20 text-purple-600" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-4">
                    <Star className="w-3.5 h-3.5 fill-purple-600" />
                    החיסכון הגדול ביותר
                  </div>
                  <div className="flex items-start gap-4 mb-5 relative z-10">
                    <img
                      src={testimonials[featuredIndex].image}
                      alt={testimonials[featuredIndex].name}
                      className="w-16 h-16 rounded-full border-3 border-purple-200"
                    />
                    <div>
                      <h3 className="font-bold text-xl text-foreground">{testimonials[featuredIndex].name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonials[featuredIndex].location}</p>
                      <StarRating rating={testimonials[featuredIndex].rating} />
                    </div>
                  </div>
                  <p className="text-foreground text-lg leading-relaxed relative z-10 mb-6">
                    "{testimonials[featuredIndex].text}"
                  </p>
                </div>
                <div className="pt-4 border-t border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{testimonials[featuredIndex].service}</p>
                      <p className="text-lg font-bold text-purple-600">
                        חיסכון: ₪{testimonials[featuredIndex].savings} בשנה
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{testimonials[featuredIndex].date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Side cards (right) */}
          <div className="space-y-6">
            {[testimonials[3], testimonials[1]].map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <TestimonialCard testimonial={t} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Auto-scrolling carousel */}
        <div
          className="lg:hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allTestimonials.map((t, idx) => (
              <div key={`${t.id}-${idx}`} className="flex-shrink-0 w-[300px]">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
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

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => (
  <Card className="relative overflow-hidden border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white h-full">
    <CardContent className="p-6">
      <div className="absolute top-4 left-4 opacity-10">
        <Quote className="w-12 h-12 text-purple-600" />
      </div>
      <div className="flex items-start gap-3 mb-3 relative z-10">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full border-2 border-purple-200"
        />
        <div className="flex-1">
          <h3 className="font-bold text-foreground">{testimonial.name}</h3>
          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
          <StarRating rating={testimonial.rating} />
        </div>
      </div>
      <p className="text-foreground text-sm mb-3 leading-relaxed relative z-10">
        "{testimonial.text}"
      </p>
      <div className="pt-3 border-t border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{testimonial.service}</p>
            <p className="text-sm font-semibold text-purple-600">חיסכון: ₪{testimonial.savings} בשנה</p>
          </div>
          <span className="text-xs text-muted-foreground">{testimonial.date}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
