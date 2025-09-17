import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Check, Star, Building2, Zap, Smartphone, Wifi, Tv, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'electricity' | 'cellular' | 'internet' | 'tv';

interface Provider {
  name: string;
  logo: string;
  popular: boolean;
  rating: number;
  customers: string;
  color: string;
  description: string;
}

interface InteractiveProviderGridProps {
  category: Category;
  value: string;
  onValueChange: (value: string) => void;
}

const categoryProviders: Record<Category, Provider[]> = {
  electricity: [
    { name: 'חברת חשמל', logo: '⚡', popular: true, rating: 4.2, customers: '2.8M', color: 'bg-yellow-500', description: 'הספק הוותיק והמוביל' },
    { name: 'פז אנרגיה', logo: '🔋', popular: true, rating: 4.5, customers: '850K', color: 'bg-blue-500', description: 'חדשנות ואמינות' },
    { name: 'אלקטרה פאוור', logo: '⚡', popular: true, rating: 4.3, customers: '620K', color: 'bg-purple-500', description: 'שירות מותאם אישית' },
    { name: 'דור אלון אנרגיה', logo: '🌟', popular: true, rating: 4.4, customers: '480K', color: 'bg-green-500', description: 'אנרגיה ירוקה' },
    { name: 'סלקום אנרגיה', logo: '🔌', popular: false, rating: 4.1, customers: '320K', color: 'bg-red-500', description: 'חבילות משתלמות' },
    { name: 'נקסט אנרגיה', logo: '⚡', popular: false, rating: 4.0, customers: '280K', color: 'bg-orange-500', description: 'טכנולוגיה חכמה' },
    { name: 'אורמת אנרגיה', logo: '🌞', popular: false, rating: 4.2, customers: '190K', color: 'bg-yellow-600', description: 'אנרגיה סולארית' },
    { name: 'גין אנרגיה', logo: '🍃', popular: false, rating: 4.1, customers: '150K', color: 'bg-green-600', description: 'ידידותית לסביבה' },
    { name: 'בזק אנרגיה', logo: '📞', popular: false, rating: 3.9, customers: '220K', color: 'bg-blue-600', description: 'חבילות משולבות' },
    { name: 'אנרג\'יה ישראלית', logo: '🇮🇱', popular: false, rating: 4.0, customers: '180K', color: 'bg-blue-700', description: 'גאווה ישראלית' },
    { name: 'מי אנרגיה', logo: '💧', popular: false, rating: 3.8, customers: '140K', color: 'bg-cyan-500', description: 'פתרונות יצירתיים' },
    { name: 'חשמל ירוק', logo: '🌱', popular: false, rating: 4.3, customers: '120K', color: 'bg-emerald-500', description: '100% אנרגיה מתחדשת' }
  ],
  cellular: [
    { name: 'פלאפון', logo: '📱', popular: true, rating: 4.4, customers: '2.9M', color: 'bg-orange-500', description: 'הרשת הגדולה בישראל' },
    { name: 'סלקום', logo: '📞', popular: true, rating: 4.3, customers: '2.1M', color: 'bg-red-500', description: 'חדשנות וקישוריות' },
    { name: 'פרטנר', logo: '📱', popular: true, rating: 4.2, customers: '2.5M', color: 'bg-purple-500', description: 'שירות מעולה' },
    { name: 'הוט מובייל', logo: '🔥', popular: true, rating: 4.1, customers: '1.2M', color: 'bg-red-600', description: 'חבילות חמות' },
    { name: '019 מובייל', logo: '📞', popular: false, rating: 4.0, customers: '890K', color: 'bg-blue-500', description: 'מחירים אטרקטיביים' },
    { name: 'רמי לוי תקשורת', logo: '🛒', popular: false, rating: 3.9, customers: '650K', color: 'bg-green-500', description: 'חיסכון משמעותי' },
    { name: 'אלקטרה אפיקים', logo: '⚡', popular: false, rating: 3.8, customers: '420K', color: 'bg-yellow-500', description: 'שירות איכותי' },
    { name: 'יס', logo: '✅', popular: false, rating: 4.0, customers: '380K', color: 'bg-green-600', description: 'פשטות וחסכון' },
    { name: 'גולן טלקום', logo: '📡', popular: false, rating: 3.7, customers: '180K', color: 'bg-blue-600', description: 'כיסוי מעולה בצפון' },
    { name: 'סמארט מובייל', logo: '🧠', popular: false, rating: 3.8, customers: '220K', color: 'bg-indigo-500', description: 'פתרונות חכמים' },
    { name: 'WAY', logo: '🛤️', popular: false, rating: 3.9, customers: '150K', color: 'bg-purple-600', description: 'הדרך החדשה' },
    { name: 'פרי מובייל', logo: '🍓', popular: false, rating: 3.6, customers: '90K', color: 'bg-pink-500', description: 'מתוק כמו פרי' }
  ],
  internet: [
    { name: 'בזק', logo: '📞', popular: true, rating: 4.1, customers: '1.8M', color: 'bg-blue-500', description: 'התשתית הלאומית' },
    { name: 'הוט', logo: '🔥', popular: true, rating: 4.3, customers: '1.2M', color: 'bg-red-500', description: 'מהירות וחדשנות' },
    { name: 'פרטנר', logo: '🌐', popular: true, rating: 4.2, customers: '950K', color: 'bg-purple-500', description: 'חבילות גמישות' },
    { name: 'סלקום', logo: '📡', popular: true, rating: 4.0, customers: '780K', color: 'bg-red-600', description: 'רשת אמינה' },
    { name: 'אורנג', logo: '🍊', popular: false, rating: 3.9, customers: '420K', color: 'bg-orange-500', description: 'טעם של מהירות' },
    { name: 'יס', logo: '✅', popular: false, rating: 4.1, customers: '320K', color: 'bg-green-500', description: 'פשוט וטוב' },
    { name: 'גולד ליינס', logo: '🥇', popular: false, rating: 4.2, customers: '180K', color: 'bg-yellow-500', description: 'קווים זהובים' },
    { name: 'נטוויזן', logo: '👁️', popular: false, rating: 3.8, customers: '140K', color: 'bg-blue-600', description: 'חזון רשתי' },
    { name: '013 נטליין', logo: '☎️', popular: false, rating: 3.7, customers: '120K', color: 'bg-gray-500', description: 'קווים מהימנים' },
    { name: 'Free Tel', logo: '🆓', popular: false, rating: 3.9, customers: '95K', color: 'bg-green-600', description: 'חופש רשתי' },
    { name: 'סמייל', logo: '😊', popular: false, rating: 4.0, customers: '75K', color: 'bg-yellow-400', description: 'אינטרנט משמח' },
    { name: 'רידאן', logo: '📶', popular: false, rating: 3.8, customers: '60K', color: 'bg-indigo-500', description: 'קליטה מושלמת' }
  ],
  tv: [
    { name: 'יס', logo: '📺', popular: true, rating: 4.4, customers: '1.1M', color: 'bg-green-500', description: 'בידור ללא הפסקה' },
    { name: 'הוט', logo: '🎬', popular: true, rating: 4.2, customers: '890K', color: 'bg-red-500', description: 'קולנוע בבית' },
    { name: 'סלקום TV', logo: '📡', popular: true, rating: 4.0, customers: '650K', color: 'bg-red-600', description: 'טלוויזיה דיגיטלית' },
    { name: 'פרטנר TV', logo: '🎭', popular: true, rating: 3.9, customers: '520K', color: 'bg-purple-500', description: 'בידור משפחתי' },
    { name: 'נטפליקס', logo: '🍿', popular: true, rating: 4.5, customers: '2.8M', color: 'bg-red-700', description: 'סטרימינג עולמי' },
    { name: 'סטרימקס', logo: '📺', popular: false, rating: 4.1, customers: '380K', color: 'bg-blue-500', description: 'תוכן ישראלי מקורי' },
    { name: 'Disney+', logo: '🏰', popular: false, rating: 4.3, customers: '420K', color: 'bg-blue-600', description: 'קסם דיסני' },
    { name: 'אמזון פריים', logo: '📦', popular: false, rating: 4.2, customers: '290K', color: 'bg-orange-500', description: 'משלוחים ובידור' },
    { name: 'אפל TV+', logo: '🍎', popular: false, rating: 4.1, customers: '180K', color: 'bg-gray-700', description: 'איכות פרימיום' },
    { name: 'פרמאונט+', logo: '⛰️', popular: false, rating: 3.8, customers: '120K', color: 'bg-blue-700', description: 'פסגות בידור' },
    { name: 'HBO Max', logo: '🎭', popular: false, rating: 4.4, customers: '250K', color: 'bg-purple-700', description: 'סדרות איכות' },
    { name: 'יוטיוב פרמיום', logo: '📹', popular: false, rating: 4.0, customers: '680K', color: 'bg-red-600', description: 'וידיאו ללא פרסומות' }
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
        {displayedProviders.map((provider) => (
          <Card
            key={provider.name}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group",
              value === provider.name 
                ? "border-2 border-primary bg-primary/5 shadow-md" 
                : "border border-border hover:border-primary/50"
            )}
            onClick={() => onValueChange(provider.name === value ? "" : provider.name)}
          >
            <CardContent className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg", provider.color)}>
                  {provider.logo}
                </div>
                <div className="flex items-center gap-1">
                  {provider.popular && (
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      פופולארי
                    </Badge>
                  )}
                  {value === provider.name && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
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
            "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group border-2 border-dashed",
            value === "אחר" 
              ? "border-primary bg-primary/5 shadow-md" 
              : "border-border hover:border-primary/50"
          )}
          onClick={() => onValueChange(value === "אחר" ? "" : "אחר")}
        >
          <CardContent className="p-4 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">ספק אחר</h4>
              <p className="text-xs text-muted-foreground">ספק שלא ברשימה</p>
            </div>
            {value === "אחר" && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mx-auto">
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