import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Check, Star, Building2, Zap, Smartphone, Wifi, Tv, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import logos
import bezeqLogo from '@/assets/logos/bezeq-logo.png';
import partnerLogo from '@/assets/logos/partner-logo.png';
import pelephoneLogo from '@/assets/logos/pelephone-logo.png';
import yesLogo from '@/assets/logos/yes-logo.png';
import electricityLogo from '@/assets/logos/electricity-logo.png';
import cellcomLogo from '@/assets/logos/cellcom-logo.svg';
import hotLogo from '@/assets/logos/hot-logo.svg';

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
    { name: 'חברת חשמל', logoType: 'image', popular: true, rating: 4.2, customers: '2.8M', color: 'bg-yellow-500', description: 'הספק הוותיק והמוביל' },
    { name: 'פז אנרגיה', logo: '🔋', logoType: 'emoji', popular: true, rating: 4.5, customers: '850K', color: 'bg-blue-500', description: 'חדשנות ואמינות' },
    { name: 'אלקטרה פאוור', logo: '⚡', logoType: 'emoji', popular: true, rating: 4.3, customers: '620K', color: 'bg-purple-500', description: 'שירות מותאם אישית' },
    { name: 'דור אלון אנרגיה', logo: '🌟', logoType: 'emoji', popular: true, rating: 4.4, customers: '480K', color: 'bg-green-500', description: 'אנרגיה ירוקה' },
    { name: 'סלקום אנרגיה', logo: '🔌', logoType: 'emoji', popular: false, rating: 4.1, customers: '320K', color: 'bg-red-500', description: 'חבילות משתלמות' },
    { name: 'נקסט אנרגיה', logo: '⚡', logoType: 'emoji', popular: false, rating: 4.0, customers: '280K', color: 'bg-orange-500', description: 'טכנולוגיה חכמה' },
    { name: 'אורמת אנרגיה', logo: '🌞', logoType: 'emoji', popular: false, rating: 4.2, customers: '190K', color: 'bg-yellow-600', description: 'אנרגיה סולארית' },
    { name: 'גין אנרגיה', logo: '🍃', logoType: 'emoji', popular: false, rating: 4.1, customers: '150K', color: 'bg-green-600', description: 'ידידותית לסביבה' },
    { name: 'בזק אנרגיה', logoType: 'image', popular: false, rating: 3.9, customers: '220K', color: 'bg-blue-600', description: 'חבילות משולבות' },
    { name: 'אנרג\'יה ישראלית', logo: '🇮🇱', logoType: 'emoji', popular: false, rating: 4.0, customers: '180K', color: 'bg-blue-700', description: 'גאווה ישראלית' }
  ],
  cellular: [
    { name: 'פלאפון', logoType: 'image', popular: true, rating: 4.4, customers: '2.9M', color: 'bg-orange-500', description: 'הרשת הגדולה בישראל' },
    { name: 'סלקום', logoType: 'image', popular: true, rating: 4.3, customers: '2.1M', color: 'bg-red-500', description: 'חדשנות וקישוריות' },
    { name: 'פרטנר', logoType: 'image', popular: true, rating: 4.2, customers: '2.5M', color: 'bg-purple-500', description: 'שירות מעולה' },
    { name: 'הוט מובייל', logo: '🔥', logoType: 'emoji', popular: true, rating: 4.1, customers: '1.2M', color: 'bg-red-600', description: 'חבילות חמות' },
    { name: '019 מובייל', logo: '📞', logoType: 'emoji', popular: false, rating: 4.0, customers: '890K', color: 'bg-blue-500', description: 'מחירים אטרקטיביים' },
    { name: 'רמי לוי תקשורת', logo: '🛒', logoType: 'emoji', popular: false, rating: 3.9, customers: '650K', color: 'bg-green-500', description: 'חיסכון משמעותי' },
    { name: 'יס', logoType: 'image', popular: false, rating: 4.0, customers: '380K', color: 'bg-green-600', description: 'פשטות וחסכון' },
    { name: 'גולן טלקום', logo: '📡', logoType: 'emoji', popular: false, rating: 3.7, customers: '180K', color: 'bg-blue-600', description: 'כיסוי מעולה בצפון' }
  ],
  internet: [
    { name: 'בזק', logoType: 'image', popular: true, rating: 4.1, customers: '1.8M', color: 'bg-blue-500', description: 'התשתית הלאומית' },
    { name: 'הוט', logoType: 'image', popular: true, rating: 4.3, customers: '1.2M', color: 'bg-red-500', description: 'מהירות וחדשנות' },
    { name: 'פרטנר', logoType: 'image', popular: true, rating: 4.2, customers: '950K', color: 'bg-purple-500', description: 'חבילות גמישות' },
    { name: 'סלקום', logoType: 'image', popular: true, rating: 4.0, customers: '780K', color: 'bg-red-600', description: 'רשת אמינה' },
    { name: 'יס', logoType: 'image', popular: false, rating: 4.1, customers: '320K', color: 'bg-green-500', description: 'פשוט וטוב' },
    { name: 'גולד ליינס', logo: '🥇', logoType: 'emoji', popular: false, rating: 4.2, customers: '180K', color: 'bg-yellow-500', description: 'קווים זהובים' },
    { name: 'נטוויזן', logo: '👁️', logoType: 'emoji', popular: false, rating: 3.8, customers: '140K', color: 'bg-blue-600', description: 'חזון רשתי' },
    { name: '013 נטליין', logo: '☎️', logoType: 'emoji', popular: false, rating: 3.7, customers: '120K', color: 'bg-gray-500', description: 'קווים מהימנים' }
  ],
  tv: [
    { name: 'יס', logoType: 'image', popular: true, rating: 4.4, customers: '1.1M', color: 'bg-green-500', description: 'בידור ללא הפסקה' },
    { name: 'הוט', logoType: 'image', popular: true, rating: 4.2, customers: '890K', color: 'bg-red-500', description: 'קולנוע בבית' },
    { name: 'סלקום TV', logo: '📡', logoType: 'emoji', popular: true, rating: 4.0, customers: '650K', color: 'bg-red-600', description: 'טלוויזיה דיגיטלית' },
    { name: 'פרטנר TV', logo: '🎭', logoType: 'emoji', popular: true, rating: 3.9, customers: '520K', color: 'bg-purple-500', description: 'בידור משפחתי' },
    { name: 'נטפליקס', logo: '🍿', logoType: 'emoji', popular: true, rating: 4.5, customers: '2.8M', color: 'bg-red-700', description: 'סטרימינג עולמי' },
    { name: 'סטרימקס', logo: '📺', logoType: 'emoji', popular: false, rating: 4.1, customers: '380K', color: 'bg-blue-500', description: 'תוכן ישראלי מקורי' },
    { name: 'Disney+', logo: '🏰', logoType: 'emoji', popular: false, rating: 4.3, customers: '420K', color: 'bg-blue-600', description: 'קסם דיסני' },
    { name: 'אמזון פריים', logo: '📦', logoType: 'emoji', popular: false, rating: 4.2, customers: '290K', color: 'bg-orange-500', description: 'משלוחים ובידור' }
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const providers = categoryProviders[category] || [];
  const CategoryIcon = categoryIcons[category];
  
  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const popularProviders = filteredProviders.filter(p => p.popular);
  const otherProviders = filteredProviders.filter(p => !p.popular);
  
  const displayedProviders = showAll 
    ? filteredProviders 
    : [...popularProviders, ...otherProviders.slice(0, 4)];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        <CategoryIcon className="h-4 w-4" />
        ספק נוכחי
        <Badge variant="secondary" className="text-xs">
          {filteredProviders.length} ספקים זמינים
        </Badge>
      </Label>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חפש ספק לפי שם או תיאור..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-4 pr-10 h-11 bg-background border-border hover:border-primary/50 focus:border-primary transition-colors"
        />
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto">
        {displayedProviders.map((provider) => (
          <Card
            key={provider.name}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group",
              value === provider.name 
                ? "border-2 border-slate-400 bg-slate-50 shadow-md" 
                : "border border-slate-200 hover:border-slate-300 bg-white"
            )}
            onClick={() => onValueChange(provider.name === value ? "" : provider.name)}
          >
            <CardContent className="p-4 space-y-3">
              {/* Header with Logo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-200">
                  {provider.logoType === 'image' && providerLogos[provider.name] ? (
                    <img 
                      src={providerLogos[provider.name]} 
                      alt={`${provider.name} logo`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // Fallback to colored circle if image fails
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
                <div className="flex items-center gap-1">
                  {provider.popular && (
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      פופולארי
                    </Badge>
                  )}
                  {value === provider.name && (
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Provider Name */}
              <div>
                <h4 className="font-semibold text-sm leading-tight">{provider.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{provider.description}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="font-medium">{provider.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span>{provider.customers}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Custom Provider Option */}
        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group border-2 border-dashed",
            value === "אחר" 
              ? "border-slate-400 bg-slate-50 shadow-md" 
              : "border-slate-300 hover:border-slate-400"
          )}
          onClick={() => onValueChange(value === "אחר" ? "" : "אחר")}
        >
          <CardContent className="p-4 space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto border border-slate-200">
              <Plus className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">ספק אחר</h4>
              <p className="text-xs text-slate-600">ספק שלא ברשימה</p>
            </div>
            {value === "אחר" && (
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Show More/Less Button */}
      {!showAll && otherProviders.length > 4 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            הצג עוד {otherProviders.length - 4} ספקים
          </Button>
        </div>
      )}

      {showAll && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(false)}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            הצג פחות
          </Button>
        </div>
      )}
    </div>
  );
};