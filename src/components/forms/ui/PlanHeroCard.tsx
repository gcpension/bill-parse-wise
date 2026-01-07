import { motion } from "framer-motion";
import { Star, TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  onChangePlan,
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
    switch (category) {
      case 'חשמל': return '⚡';
      case 'סלולר': return '📱';
      case 'אינטרנט': return '🌐';
      case 'טלוויזיה': return '📺';
      case 'טריפל': return '📦';
      default: return '📄';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "relative overflow-hidden border-2",
        categoryColor.border,
        "bg-gradient-to-br",
        categoryColor.light
      )}>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/20 to-transparent rounded-full translate-x-12 translate-y-12" />
        
        <div className="relative p-4 md:p-6">
          {/* Header with Category Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl",
                "bg-gradient-to-br shadow-lg",
                categoryColor.primary,
                "text-white"
              )}>
                {getCategoryIcon()}
              </div>
              <div>
                <h3 className={cn("text-lg md:text-xl font-bold", categoryColor.text)}>
                  {company}
                </h3>
                <p className="text-sm text-muted-foreground">{planName}</p>
              </div>
            </div>
            
            <Badge className={cn(
              "bg-gradient-to-r text-white border-0 shadow-md",
              categoryColor.primary
            )}>
              <Star className="w-3 h-3 ml-1 fill-current" />
              נבחר
            </Badge>
          </div>

          {/* Price Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-foreground">
                ₪{price}
              </span>
              <span className="text-muted-foreground">/חודש</span>
            </div>

            {savings > 0 && (
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  חיסכון שנתי: ₪{yearlySavings.toLocaleString()}
                </span>
              </motion.div>
            )}
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="mt-4 pt-4 border-t border-current/10">
              <div className="flex flex-wrap gap-2">
                {features.slice(0, 3).map((feature, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-white/50 text-foreground/80 text-xs"
                  >
                    <Sparkles className="w-3 h-3 ml-1" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Change Plan Button */}
          {onChangePlan && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onChangePlan}
              className={cn("mt-4 text-sm", categoryColor.text)}
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              שנה מסלול
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default PlanHeroCard;
