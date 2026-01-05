import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManualPlan } from "@/data/manual-plans";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Lightbulb,
  Clock,
  DollarSign,
  Users,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanInsightsProps {
  plan: ManualPlan;
  className?: string;
}

const PlanInsights = ({ plan, className }: PlanInsightsProps) => {
  // Generate dynamic insights based on plan data
  const generateInsights = () => {
    const insights = [];
    
    // Price insights
    const avgPrice = 150; // Simulated market average
    const planPrice = plan.category === 'electricity' ? 0 : parseInt(plan.regularPrice.toString());
    
    if (plan.category !== 'electricity') {
      if (planPrice < avgPrice * 0.8) {
        insights.push({
          type: 'success',
          icon: TrendingDown,
          title: 'מחיר מעולה',
          description: `${Math.floor(((avgPrice - planPrice) / avgPrice) * 100)}% מתחת לממוצע השוק`,
          priority: 'high'
        });
      } else if (planPrice > avgPrice * 1.2) {
        insights.push({
          type: 'warning',
          icon: TrendingUp,
          title: 'מחיר גבוה',
          description: `${Math.floor(((planPrice - avgPrice) / avgPrice) * 100)}% מעל ממוצע השוק`,
          priority: 'medium'
        });
      }
    }

    // Features insights
    if (plan.features.length > 8) {
      insights.push({
        type: 'info',
        icon: CheckCircle,
        title: 'עשיר בתכונות',
        description: `${plan.features.length} תכונות כלולות - מעל הממוצע`,
        priority: 'medium'
      });
    }

    // Category-specific insights
    if (plan.category === 'internet') {
      if (plan.downloadSpeed && parseInt(plan.downloadSpeed) >= 100) {
        insights.push({
          type: 'success',
          icon: Zap,
          title: 'מהירות גבוהה',
          description: 'מתאים לשימוש כבד ומשפחות גדולות',
          priority: 'high'
        });
      }
    }

    if (plan.category === 'mobile') {
      if (plan.dataAmount && plan.dataAmount.includes('ללא הגבלה')) {
        insights.push({
          type: 'success',
          icon: CheckCircle,
          title: 'נתונים ללא הגבלה',
          description: 'חסכון בדאגות על צריכת נתונים',
          priority: 'high'
        });
      }
    }

    // Market trends (simulated)
    const trends = [
      {
        type: 'info',
        icon: TrendingUp,
        title: 'מגמת שוק',
        description: 'ביקוש גובר למסלול זה ב-3 החודשים האחרונים',
        priority: 'low'
      },
      {
        type: 'warning',
        icon: Clock,
        title: 'הצעה מוגבלת',
        description: 'מחיר מיוחד זה עשוי להיגמר בקרוב',
        priority: 'medium'
      },
      {
        type: 'info',
        icon: Users,
        title: 'פופולרי',
        description: `${Math.floor(Math.random() * 30) + 20}% מהלקוחות החליפו למסלול זה`,
        priority: 'low'
      }
    ];

    // Add random trending insight
    if (Math.random() > 0.5) {
      insights.push(trends[Math.floor(Math.random() * trends.length)]);
    }

    // AI-powered recommendations (simulated)
    const aiInsights = [
      {
        type: 'success',
        icon: Lightbulb,
        title: 'המלצת AI',
        description: 'בהתבסס על הפרופיל שלך, מסלול זה יחסוך לך ₪89 לחודש',
        priority: 'high'
      },
      {
        type: 'info',
        icon: Info,
        title: 'תובנה חכמה',
        description: 'משתמשים דומים לך דירגו את השירות 4.7/5',
        priority: 'medium'
      }
    ];

    if (Math.random() > 0.3) {
      insights.push(aiInsights[Math.floor(Math.random() * aiInsights.length)]);
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const insights = generateInsights();

  if (insights.length === 0) return null;

  const getInsightStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50/80 dark:bg-green-900/20',
          border: 'border-green-200/50 dark:border-green-800/50',
          text: 'text-green-700 dark:text-green-300',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50/80 dark:bg-orange-900/20',
          border: 'border-orange-200/50 dark:border-orange-800/50',
          text: 'text-orange-700 dark:text-orange-300',
          icon: 'text-orange-600 dark:text-orange-400'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50/80 dark:bg-blue-900/20',
          border: 'border-blue-200/50 dark:border-blue-800/50',
          text: 'text-blue-700 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  return (
    <Card className={cn("bg-white/95 backdrop-blur-sm border-border/40", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          תובנות על המסלול
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {insights.slice(0, 4).map((insight, index) => {
          const styles = getInsightStyles(insight.type);
          const IconComponent = insight.icon;
          
          return (
            <div 
              key={index}
              className={cn(
                "p-3 rounded-xl border",
                styles.bg,
                styles.border
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5", styles.icon)}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={cn("font-semibold text-sm", styles.text)}>
                      {insight.title}
                    </h4>
                    {insight.priority === 'high' && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        חשוב
                      </Badge>
                    )}
                  </div>
                  <p className={cn("text-xs leading-relaxed", styles.text)}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Summary Stats */}
        <div className="mt-4 p-3 bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl border border-border/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="font-medium">חיסכון צפוי: ₪{Math.floor(Math.random() * 100) + 30}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="font-medium">התאמה: {Math.floor(Math.random() * 20) + 80}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanInsights;