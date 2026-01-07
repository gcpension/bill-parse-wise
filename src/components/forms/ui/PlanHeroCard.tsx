import { motion } from "framer-motion";
import { Star, TrendingDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlanHeroCardProps {
  company: string;
  planName: string;
  price: number;
  category: string;
  features?: string[];
  currentBill?: number;
  onChangePlan?: () => void;
  categoryColor?: {
    primary: string;
    light: string;
    text: string;
    border: string;
    bg: string;
  };
}

export const PlanHeroCard = ({
  company,
  planName,
  price,
  category,
  features = [],
  currentBill,
  categoryColor = {
    primary: "from-primary to-primary/80",
    light: "from-primary/5 to-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5"
  }
}: PlanHeroCardProps) => {
  const savings = currentBill && currentBill > price ? currentBill - price : 0;
  const yearlySavings = savings * 12;

  const getCategoryIcon = () => {
    if (category.includes('חשמל')) return '⚡';
    if (category.includes('סלולר')) return '📱';
    if (category.includes('אינטרנט')) return '🌐';
    if (category.includes('טלוויזיה')) return '📺';
    if (category.includes('טריפל')) return '📦';
    return '📄';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Compact Card Design */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl border-2 p-4",
        categoryColor.border,
        "bg-gradient-to-br",
        categoryColor.light
      )}>
        {/* Main Content Row */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
            "bg-gradient-to-br shadow-lg",
            categoryColor.primary
          )}>
            {getCategoryIcon()}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn("text-lg font-bold truncate", categoryColor.text)}>
                {company}
              </h3>
              <Badge className={cn(
                "bg-gradient-to-r text-white border-0 text-xs px-2 py-0.5 flex-shrink-0",
                categoryColor.primary
              )}>
                <Star className="w-2.5 h-2.5 ml-0.5 fill-current" />
                נבחר
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{planName}</p>
          </div>
          
          {/* Price */}
          <div className="text-left flex-shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">₪{price}</span>
              <span className="text-xs text-muted-foreground">/חודש</span>
            </div>
          </div>
        </div>

        {/* Savings Badge - Only show if savings exist */}
        {savings > 0 && (
          <motion.div 
            className="mt-3 flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-sm font-bold text-green-700">
                חיסכון שנתי: ₪{yearlySavings.toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}

        {/* Features - Compact */}
        {features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {features.slice(0, 2).map((feature, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-white/60 text-foreground/70 text-xs py-0.5"
              >
                <Sparkles className="w-2.5 h-2.5 ml-1" />
                {feature.length > 25 ? feature.substring(0, 25) + '...' : feature}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlanHeroCard;
