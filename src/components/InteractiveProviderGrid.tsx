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

      {/* Provider Grid - Enhanced Interactive */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayedProviders.map((provider, index) => (
          <div
            key={provider.name}
            className={cn(
              "group relative cursor-pointer transition-all duration-500 hover:scale-110 p-5 rounded-2xl border-2 animate-fade-in opacity-0",
              value === provider.name 
                ? "border-purple-500 shadow-2xl shadow-purple-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50 scale-105" 
                : "border-gray-200 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-100 bg-white"
            )}
            style={{ 
              animationDelay: `${index * 0.05}s`, 
              animationFillMode: 'forwards' 
            }}
            onClick={() => onValueChange(provider.name === value ? "" : provider.name)}
          >
            {/* Glow effect on hover */}
            <div className={cn(
              "absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none -z-10",
              value === provider.name ? "opacity-40 bg-purple-400" : "bg-purple-300"
            )}></div>
            
            {/* Logo Section */}
            <div className="flex items-center justify-center mb-3">
              <div className="relative">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 shadow-lg transform group-hover:rotate-6 group-hover:scale-110",
                  value === provider.name 
                    ? "border-purple-300 bg-gradient-to-br from-purple-100 to-white shadow-purple-200" 
                    : "border-gray-200 bg-gradient-to-br from-gray-50 to-white group-hover:border-purple-200 group-hover:shadow-purple-100"
                )}>
                  {provider.logoType === 'image' && providerLogos[provider.name] ? (
                    <img 
                      src={providerLogos[provider.name]} 
                      alt={`${provider.name} logo`}
                      className="w-10 h-10 object-contain transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-10 h-10 rounded-xl ${provider.color} flex items-center justify-center text-white font-bold text-lg shadow-lg">${provider.name.charAt(0)}</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-transform duration-300 group-hover:scale-110", 
                      provider.color
                    )}>
                      {provider.logo || provider.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* Selection Indicator - Enhanced */}
                {value === provider.name && (
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-3 border-white shadow-lg animate-scale-in">
                    <Check className="h-4 w-4 text-white font-bold" strokeWidth={3} />
                  </div>
                )}
                
                {/* Popular Badge - Enhanced */}
                {provider.popular && (
                  <div className="absolute -top-3 -left-3 z-10">
                    <Badge className="text-[10px] bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 text-white border-0 px-2 py-1 font-bold shadow-lg animate-pulse">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      פופולרי
                    </Badge>
                  </div>
                )}
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -translate-x-full group-hover:translate-x-full"></div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="text-center mt-4">
              <h4 className={cn(
                "font-bold text-sm leading-tight transition-all duration-300",
                value === provider.name 
                  ? "text-purple-900 scale-105" 
                  : "text-gray-800 group-hover:text-purple-700 group-hover:scale-105"
              )}>
                {provider.name}
              </h4>
              
              {/* Rating indicator */}
              <div className="flex items-center justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Star className="h-3 w-3 text-amber-400 fill-current" />
                <span className="text-xs font-semibold text-gray-600">{provider.rating}</span>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none",
              value === provider.name ? "opacity-10" : ""
            )} style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        ))}

        {/* Custom Provider Option - Enhanced */}
        <div
          className={cn(
            "group relative cursor-pointer transition-all duration-500 hover:scale-110 p-5 rounded-2xl border-2 border-dashed animate-fade-in opacity-0",
            value === "אחר" 
              ? "border-purple-500 shadow-2xl shadow-purple-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50 scale-105" 
              : "border-gray-300 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-100 bg-white"
          )}
          style={{ 
            animationDelay: `${displayedProviders.length * 0.05}s`, 
            animationFillMode: 'forwards' 
          }}
          onClick={() => onValueChange(value === "אחר" ? "" : "אחר")}
        >
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none -z-10",
            value === "אחר" ? "opacity-40 bg-purple-400" : "bg-purple-300"
          )}></div>
          
          <div className="text-center">
            <div className="relative flex items-center justify-center mb-3">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 border-dashed shadow-lg transform group-hover:rotate-6 group-hover:scale-110",
                value === "אחר" 
                  ? "border-purple-400 bg-gradient-to-br from-purple-100 to-white shadow-purple-200" 
                  : "border-gray-300 bg-gradient-to-br from-gray-50 to-white group-hover:border-purple-300 group-hover:shadow-purple-100"
              )}>
                <Plus className={cn(
                  "h-8 w-8 transition-all duration-500 group-hover:rotate-90",
                  value === "אחר" ? "text-purple-600" : "text-gray-500 group-hover:text-purple-600"
                )} />
              </div>
              {value === "אחר" && (
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-3 border-white shadow-lg animate-scale-in">
                  <Check className="h-4 w-4 text-white font-bold" strokeWidth={3} />
                </div>
              )}
            </div>
            
            <h4 className={cn(
              "font-bold text-sm transition-all duration-300",
              value === "אחר" 
                ? "text-purple-900 scale-105" 
                : "text-gray-800 group-hover:text-purple-700 group-hover:scale-105"
            )}>
              ספק אחר
            </h4>
          </div>
          
          {/* Background pattern */}
          <div className={cn(
            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none",
            value === "אחר" ? "opacity-10" : ""
          )} style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      {/* Show More/Less Button - Enhanced */}
      {!showAll && otherProviders.length > 4 && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="relative overflow-hidden bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-900 px-8 py-3 rounded-2xl transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-purple-200 transform hover:scale-105 font-bold group"
          >
            <span className="relative z-10 flex items-center gap-2">
              הצג עוד {otherProviders.length - 4} ספקים
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            </span>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full"></div>
          </Button>
        </div>
      )}

      {showAll && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(false)}
            className="relative overflow-hidden bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-900 px-8 py-3 rounded-2xl transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-purple-200 transform hover:scale-105 font-bold group"
          >
            <span className="relative z-10">הצג פחות</span>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full"></div>
          </Button>
        </div>
      )}
    </div>
  );
};