import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Smartphone, Wifi, Tv, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import logos
import bezeqLogo from '@/assets/logos/bezeq-logo.png';
import partnerLogo from '@/assets/logos/partner-logo.png';
import pelephoneLogo from '@/assets/logos/pelephone-logo.png';
import yesLogo from '@/assets/logos/yes-logo.png';
import electricityLogo from '@/assets/logos/electricity-logo.png';
import cellcomLogo from '@/assets/logos/cellcom-logo.svg';
import hotLogo from '@/assets/logos/hot-logo.svg';
import netflixLogo from '@/assets/logos/netflix-logo.svg';
import electraLogo from '@/assets/logos/electra-logo.png';
import ramiLevyLogo from '@/assets/logos/rami-levy-logo.png';
import disneyLogo from '@/assets/logos/disney-logo.png';
import hboLogo from '@/assets/logos/hbo-logo.png';
import logo019 from '@/assets/logos/019-logo.png';

type Category = 'electricity' | 'cellular' | 'internet' | 'tv';

interface Provider {
  name: string;
  logo?: string;
  logoType?: 'image' | 'emoji';
  popular: boolean;
  rating: number;
  customers: string;
  color: string;
  description: string;
}

// Logo mapping for real company logos
const providerLogos: Record<string, string> = {
  'חברת חשמל': electricityLogo,
  'בזק': bezeqLogo,
  'פרטנר': partnerLogo,
  'פלאפון': pelephoneLogo,
  'סלקום': cellcomLogo,
  'הוט': hotLogo,
  'יס': yesLogo,
};

interface InteractiveProviderGridProps {
  category: Category;
  value: string;
  onValueChange: (value: string) => void;
}

const categoryProviders: Record<Category, Provider[]> = {
  electricity: [
    { name: 'חברת חשמל', logoType: 'image', popular: true, rating: 4.2, customers: '2.8M', color: 'bg-yellow-500', description: 'הספק הוותיק והמוביל בישראל' },
    { name: 'פז אנרגיה', logoType: 'image', popular: true, rating: 4.5, customers: '850K', color: 'bg-blue-500', description: 'חדשנות ואמינות במגזר האנרגיה' },
    { name: 'אלקטרה פאוור', logoType: 'image', popular: true, rating: 4.3, customers: '620K', color: 'bg-blue-600', description: 'שירות מותאם אישית ואיכותי' },
    { name: 'דור אלון אנרגיה', logo: '🌟', logoType: 'emoji', popular: true, rating: 4.4, customers: '480K', color: 'bg-green-500', description: 'פתרונות אנרגיה ירוקה וחכמה' },
    { name: 'סלקום אנרגיה', logoType: 'image', popular: false, rating: 4.1, customers: '320K', color: 'bg-red-500', description: 'חבילות משתלמות לבית' },
    { name: 'בזק אנרגיה', logoType: 'image', popular: false, rating: 3.9, customers: '220K', color: 'bg-blue-600', description: 'חבילות משולבות עם תקשורת' },
    { name: 'נקסט אנרגיה', logo: '⚡', logoType: 'emoji', popular: false, rating: 4.0, customers: '280K', color: 'bg-orange-500', description: 'טכנולוגיה חכמה למחר' },
    { name: 'אורמת אנרגיה', logo: '🌞', logoType: 'emoji', popular: false, rating: 4.2, customers: '190K', color: 'bg-yellow-600', description: 'מובילים באנרגיה סולארית' }
  ],
  cellular: [
    { name: 'פלאפון', logoType: 'image', popular: true, rating: 4.4, customers: '2.9M', color: 'bg-orange-500', description: 'הרשת הגדולה והמובילה בישראל' },
    { name: 'סלקום', logoType: 'image', popular: true, rating: 4.3, customers: '2.1M', color: 'bg-red-500', description: 'חדשנות וקישוריות מתקדמת' },
    { name: 'פרטנר', logoType: 'image', popular: true, rating: 4.2, customers: '2.5M', color: 'bg-purple-500', description: 'שירות לקוחות מעולה' },
    { name: 'הוט מובייל', logoType: 'image', popular: true, rating: 4.1, customers: '1.2M', color: 'bg-red-600', description: 'חבילות חמות במחירים נוחים' },
    { name: '019 מובייל', logoType: 'image', popular: false, rating: 4.0, customers: '890K', color: 'bg-blue-500', description: 'מחירים אטרקטיביים לכולם' },
    { name: 'רמי לוי תקשורת', logoType: 'image', popular: false, rating: 3.9, customers: '650K', color: 'bg-green-500', description: 'חיסכון משמעותי בחשבון הנייד' },
    { name: 'יס', logoType: 'image', popular: false, rating: 4.0, customers: '380K', color: 'bg-green-600', description: 'פשטות וחסכון בלי פשרות' },
    { name: 'גולן טלקום', logo: '📡', logoType: 'emoji', popular: false, rating: 3.7, customers: '180K', color: 'bg-blue-600', description: 'כיסוי מעולה בצפון הארץ' }
  ],
  internet: [
    { name: 'בזק', logoType: 'image', popular: true, rating: 4.1, customers: '1.8M', color: 'bg-blue-500', description: 'התשתית הלאומית המובילה' },
    { name: 'הוט', logoType: 'image', popular: true, rating: 4.3, customers: '1.2M', color: 'bg-red-500', description: 'מהירות וחדשנות בכל בית' },
    { name: 'פרטנר', logoType: 'image', popular: true, rating: 4.2, customers: '950K', color: 'bg-purple-500', description: 'חבילות גמישות לכל משפחה' },
    { name: 'סלקום', logoType: 'image', popular: true, rating: 4.0, customers: '780K', color: 'bg-red-600', description: 'רשת אמינה ויציבה' },
    { name: 'יס', logoType: 'image', popular: false, rating: 4.1, customers: '320K', color: 'bg-green-500', description: 'פשוט, טוב ומהיר' },
    { name: 'גולד ליינס', logo: '🥇', logoType: 'emoji', popular: false, rating: 4.2, customers: '180K', color: 'bg-yellow-500', description: 'קווי זהב למהירות מקסימלית' },
    { name: 'נטוויזן', logo: '👁️', logoType: 'emoji', popular: false, rating: 3.8, customers: '140K', color: 'bg-blue-600', description: 'חזון רשתי מתקדם' },
    { name: '013 נטליין', logo: '☎️', logoType: 'emoji', popular: false, rating: 3.7, customers: '120K', color: 'bg-gray-500', description: 'קווים מהימנים ויציבים' }
  ],
  tv: [
    { name: 'יס', logoType: 'image', popular: true, rating: 4.4, customers: '1.1M', color: 'bg-green-500', description: 'בידור ללא הפסקה - הטוב בישראל' },
    { name: 'הוט', logoType: 'image', popular: true, rating: 4.2, customers: '890K', color: 'bg-red-500', description: 'קולנוע וסדרות פרימיום בבית' },
    { name: 'נטפליקס', logoType: 'image', popular: true, rating: 4.5, customers: '2.8M', color: 'bg-red-700', description: 'הסטרימינג הפופולרי בעולם' },
    { name: 'סלקום TV', logoType: 'image', popular: true, rating: 4.0, customers: '650K', color: 'bg-red-600', description: 'טלוויזיה דיגיטלית מתקדמת' },
    { name: 'Disney+', logoType: 'image', popular: false, rating: 4.3, customers: '420K', color: 'bg-blue-600', description: 'הקסם של דיסני לכל המשפחה' },
    { name: 'HBO Max', logoType: 'image', popular: false, rating: 4.4, customers: '250K', color: 'bg-purple-700', description: 'סדרות איכות ברמה עולמית' },
    { name: 'פרטנר TV', logo: '🎭', logoType: 'emoji', popular: false, rating: 3.9, customers: '520K', color: 'bg-purple-500', description: 'בידור משפחתי איכותי' },
    { name: 'אמזון פריים', logo: '📦', logoType: 'emoji', popular: false, rating: 4.2, customers: '290K', color: 'bg-orange-500', description: 'משלוחים חינם ובידור מעולה' }
  ]
};

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi,
  tv: Tv
};

export const InteractiveProviderGrid = ({ 
  category, 
  value, 
  onValueChange
}: InteractiveProviderGridProps) => {
  const [showAll, setShowAll] = useState(false);

  const providers = categoryProviders[category] || [];
  const CategoryIcon = categoryIcons[category];
  
  const popularProviders = providers.filter(p => p.popular);
  const otherProviders = providers.filter(p => !p.popular);
  
  const displayedProviders = showAll 
    ? providers 
    : [...popularProviders, ...otherProviders.slice(0, 4)];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
            <CategoryIcon className="h-5 w-5 text-slate-600" />
          </div>
          בחר ספק נוכחי
          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border border-slate-300">
            {providers.length} ספקים
          </Badge>
        </Label>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayedProviders.map((provider) => (
          <div
            key={provider.name}
            className={cn(
              "group cursor-pointer transition-all duration-300 hover:scale-105 p-4 rounded-xl border-2 bg-white",
              value === provider.name 
                ? "border-slate-600 shadow-xl bg-slate-50 scale-[1.02]" 
                : "border-slate-200 hover:border-slate-400 hover:shadow-lg"
            )}
            onClick={() => onValueChange(provider.name === value ? "" : provider.name)}
          >
            {/* Logo Section */}
            <div className="flex items-center justify-center mb-3">
              <div className="relative">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2",
                  value === provider.name ? "border-slate-300 bg-white shadow-md" : "border-slate-200 bg-slate-50"
                )}>
                  {provider.logoType === 'image' && providerLogos[provider.name] ? (
                    <img 
                      src={providerLogos[provider.name]} 
                      alt={`${provider.name} logo`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-8 h-8 rounded-lg ${provider.color} flex items-center justify-center text-white font-bold text-sm">${provider.name.charAt(0)}</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm", provider.color)}>
                      {provider.logo || provider.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* Selection Indicator */}
                {value === provider.name && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center border-2 border-white">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
                
                {/* Popular Badge */}
                {provider.popular && (
                  <div className="absolute -top-2 -left-2">
                    <Badge className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 px-1.5 py-0.5 font-semibold">
                      <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                      פופולרי
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Provider Info */}
            <div className="text-center mt-3">
              <h4 className={cn(
                "font-bold text-sm leading-tight transition-colors duration-200",
                value === provider.name ? "text-slate-900" : "text-slate-800 group-hover:text-slate-900"
              )}>
                {provider.name}
              </h4>
            </div>
          </div>
        ))}

        {/* Custom Provider Option */}
        <div
          className={cn(
            "group cursor-pointer transition-all duration-300 hover:scale-105 p-4 rounded-xl border-2 border-dashed bg-white",
            value === "אחר" 
              ? "border-slate-600 shadow-xl bg-slate-50 scale-[1.02]" 
              : "border-slate-300 hover:border-slate-500 hover:shadow-lg"
          )}
          onClick={() => onValueChange(value === "אחר" ? "" : "אחר")}
        >
          <div className="text-center">
            <div className="relative flex items-center justify-center mb-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2 border-dashed",
                value === "אחר" ? "border-slate-400 bg-white" : "border-slate-300 bg-slate-50"
              )}>
                <Plus className="h-6 w-6 text-slate-500" />
              </div>
              {value === "אחר" && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center border-2 border-white">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
            
            <h4 className={cn(
              "font-bold text-sm transition-colors duration-200",
              value === "אחר" ? "text-slate-900" : "text-slate-800 group-hover:text-slate-900"
            )}>
              ספק אחר
            </h4>
          </div>
        </div>
      </div>

      {/* Show More/Less Button */}
      {!showAll && otherProviders.length > 4 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-6 py-2 rounded-xl transition-all duration-200"
          >
            הצג עוד {otherProviders.length - 4} ספקים
          </Button>
        </div>
      )}

      {showAll && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(false)}
            className="bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-6 py-2 rounded-xl transition-all duration-200"
          >
            הצג פחות
          </Button>
        </div>
      )}
    </div>
  );
};