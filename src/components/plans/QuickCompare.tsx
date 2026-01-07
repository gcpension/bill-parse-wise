import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Scale, X, Check, Minus, Trash2 } from 'lucide-react';
import { PlanRecord } from '@/hooks/useAllPlans';
import { calculateValueScore, getDealQualityColor, getDealQualityLabel } from '@/lib/planValueCalculator';

interface QuickCompareProps {
  comparePlans: PlanRecord[];
  allPlans: PlanRecord[];
  onRemove: (company: string, plan: string) => void;
  onClearAll: () => void;
  onSelectPlan: (plan: PlanRecord) => void;
}

export const QuickCompare: React.FC<QuickCompareProps> = ({
  comparePlans,
  allPlans,
  onRemove,
  onClearAll,
  onSelectPlan,
}) => {
  if (comparePlans.length === 0) return null;

  const plansWithScores = comparePlans.map(plan => ({
    ...plan,
    valueScore: calculateValueScore(plan, allPlans),
  }));

  // Find best values for highlighting
  const lowestPrice = Math.min(...plansWithScores.map(p => p.monthlyPrice || Infinity));
  const highestScore = Math.max(...plansWithScores.map(p => p.valueScore.total));

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="shadow-lg rounded-full px-6 gap-2"
          >
            <Scale className="h-5 w-5" />
            השווה {comparePlans.length}/3
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle className="text-xl">השוואת מסלולים</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground"
            >
              <Trash2 className="h-4 w-4 ml-1" />
              נקה הכל
            </Button>
          </SheetHeader>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px]" dir="rtl">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground w-32">
                    פרטים
                  </th>
                  {plansWithScores.map((plan, index) => (
                    <th key={index} className="text-center py-3 px-4 min-w-[180px]">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -left-2 h-6 w-6"
                          onClick={() => onRemove(plan.company, plan.plan)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="font-bold text-lg">{plan.company}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[160px] mx-auto">
                          {plan.plan}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b bg-muted/30">
                  <td className="py-4 px-4 font-medium">מחיר חודשי</td>
                  {plansWithScores.map((plan, index) => (
                    <td key={index} className="text-center py-4 px-4">
                      <div className={`text-2xl font-bold ${
                        plan.monthlyPrice === lowestPrice ? 'text-green-600' : ''
                      }`}>
                        ₪{plan.monthlyPrice || '-'}
                      </div>
                      {plan.monthlyPrice === lowestPrice && (
                        <Badge variant="secondary" className="mt-1 text-xs bg-green-100 text-green-700">
                          הזול ביותר
                        </Badge>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Value Score Row */}
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">ציון ערך</td>
                  {plansWithScores.map((plan, index) => (
                    <td key={index} className="text-center py-4 px-4">
                      <div className={`text-xl font-bold ${
                        plan.valueScore.total === highestScore ? 'text-primary' : ''
                      }`}>
                        {plan.valueScore.total}/100
                      </div>
                      <Badge className={`mt-1 ${getDealQualityColor(plan.valueScore.dealQuality)}`}>
                        {getDealQualityLabel(plan.valueScore.dealQuality)}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Commitment Row */}
                <tr className="border-b bg-muted/30">
                  <td className="py-4 px-4 font-medium">התחייבות</td>
                  {plansWithScores.map((plan, index) => (
                    <td key={index} className="text-center py-4 px-4">
                      {plan.commitment ? (
                        <span>{plan.commitment}</span>
                      ) : (
                        <span className="text-green-600 flex items-center justify-center gap-1">
                          <Check className="h-4 w-4" />
                          ללא
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Transfer Benefits Row */}
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">הטבות מעבר</td>
                  {plansWithScores.map((plan, index) => (
                    <td key={index} className="text-center py-4 px-4">
                      {plan.transferBenefits ? (
                        <span className="text-sm">{plan.transferBenefits}</span>
                      ) : (
                        <Minus className="h-4 w-4 mx-auto text-muted-foreground" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* SLA Row */}
                <tr className="border-b bg-muted/30">
                  <td className="py-4 px-4 font-medium">ציון שירות</td>
                  {plansWithScores.map((plan, index) => (
                    <td key={index} className="text-center py-4 px-4">
                      {plan.sla || <Minus className="h-4 w-4 mx-auto text-muted-foreground" />}
                    </td>
                  ))}
                </tr>

                {/* Why Choose Row */}
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">למה לבחור?</td>
                  {plansWithScores.map((plan, index) => (
                    <td key={index} className="text-center py-4 px-4">
                      <ul className="text-sm text-right space-y-1">
                        {plan.valueScore.whyChoose.map((reason, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <Check className="h-3 w-3 mt-1 text-green-600 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr>
                  <td className="py-4 px-4"></td>
                  {plansWithScores.map((plan, index) => (
                    <td key={index} className="text-center py-4 px-4">
                      <Button 
                        className="w-full"
                        onClick={() => onSelectPlan(plan)}
                      >
                        בחר מסלול
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
