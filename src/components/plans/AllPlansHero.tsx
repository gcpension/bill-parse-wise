import { Zap, Wifi, Smartphone, Tv, Package, TrendingDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type CategoryType = 'חשמל' | 'אינטרנט' | 'סלולר' | 'טלוויזיה' | 'טריפל' | 'all';

interface AllPlansHeroProps {
  selectedCategory: CategoryType;
  currentMonthlyBill: number;
  maxSavings: number;
  totalPlans: number;
  currentProvider?: string;
}

const getCategoryIcon = (category: CategoryType) => {
  switch (category) {
    case 'חשמל': return <Zap className="w-8 h-8 text-white" />;
    case 'אינטרנט': return <Wifi className="w-8 h-8 text-white" />;
    case 'סלולר': return <Smartphone className="w-8 h-8 text-white" />;
    case 'טלוויזיה': return <Tv className="w-8 h-8 text-white" />;
    case 'טריפל': return <Package className="w-8 h-8 text-white" />;
    default: return <Sparkles className="w-8 h-8 text-white" />;
  }
};

const getCategoryLabel = (category: CategoryType) => {
  if (category === 'all') return 'כל המסלולים';
  return category;
};

export const AllPlansHero = ({
  selectedCategory,
  currentMonthlyBill,
  maxSavings,
  totalPlans,
  currentProvider,
}: AllPlansHeroProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
      </div>
      
      <div className="relative container mx-auto px-4 max-w-7xl py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          {/* Category Icon */}
          <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
            {getCategoryIcon(selectedCategory)}
          </div>
          
          {/* Info */}
          <div className="flex-1 text-center md:text-right">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {selectedCategory === 'all' ? 'כל המסלולים' : `מסלולי ${getCategoryLabel(selectedCategory)}`}
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              {totalPlans} מסלולים זמינים להשוואה
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-3 md:gap-4">
            {currentMonthlyBill > 0 && (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 text-center min-w-[100px]">
                <div className="text-xs text-white/70 mb-1">תשלום נוכחי</div>
                <div className="text-xl md:text-2xl font-bold">₪{currentMonthlyBill}</div>
                <div className="text-xs text-white/60">/חודש</div>
              </div>
            )}
            
            {maxSavings > 0 && (
              <div className="bg-emerald-500/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-emerald-400/30 text-center min-w-[100px]">
                <div className="text-xs text-emerald-200 mb-1">חיסכון אפשרי</div>
                <div className="text-xl md:text-2xl font-bold text-emerald-100 flex items-center justify-center gap-1">
                  <TrendingDown className="w-5 h-5" />
                  ₪{maxSavings.toFixed(0)}
                </div>
                <div className="text-xs text-emerald-200/80">/חודש</div>
              </div>
            )}
          </div>
        </div>
        
        {currentProvider && (
          <div className="mt-3 text-center md:text-right">
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              ספק נוכחי: {currentProvider}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
