import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanRecord } from "@/hooks/useAllPlans";
import { 
  CheckCircle2, ArrowRight, TrendingDown, Zap, Calendar, 
  DollarSign, Award, X, FileText
} from "lucide-react";
import { useAllPlans } from "@/hooks/useAllPlans";

interface PlanRecordDetailsSheetProps {
  plan: PlanRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForSwitch: (plan: PlanRecord) => void;
}

export function PlanRecordDetailsSheet({ plan, isOpen, onClose, onSelectForSwitch }: PlanRecordDetailsSheetProps) {
  const allPlans = useAllPlans();
  
  if (!plan) return null;

  // Calculate market comparison data
  const sameCategoryPlans = allPlans.filter(p => p.service === plan.service);
  const avgPrice = sameCategoryPlans.length > 0 
    ? sameCategoryPlans.reduce((sum, p) => sum + (p.monthlyPrice || 0), 0) / sameCategoryPlans.filter(p => p.monthlyPrice).length
    : plan.monthlyPrice || 0;
  
  const currentPrice = plan.monthlyPrice || 0;
  const savingsVsAvg = avgPrice - currentPrice;
  const savingsPercent = avgPrice > 0 ? Math.round((savingsVsAvg / avgPrice) * 100) : 0;
  
  // Plan score calculation
  const priceScore = Math.max(0, Math.min(100, 100 - ((currentPrice / avgPrice) * 100 - 100)));
  const overallScore = Math.round(priceScore);
  
  // Determine who this plan is for
  const getTargetAudience = () => {
    if (currentPrice < avgPrice * 0.8) return "משפחות המחפשות לחסוך";
    if (plan.transferBenefits) return "לקוחות חדשים";
    return "קהל רחב";
  };
  
  // Calculate value metrics
  const valueMetrics = {
    priceCompetitiveness: priceScore,
    valueForMoney: overallScore,
    marketPosition: currentPrice < avgPrice ? 'חסכוני' : currentPrice > avgPrice * 1.2 ? 'פרימיום' : 'סטנדרטי'
  };

  // Extract technical specifications based on service type
  const getTechnicalSpecs = () => {
    const benefits = plan.transferBenefits || '';
    const specs: { label: string; value: string }[] = [];

    if (plan.service.includes('סלולר')) {
      // Cellular specs
      const gbMatch = benefits.match(/(\d+)GB/);
      const minutesMatch = benefits.match(/(\d+)\s*דק['׳]?\s*לחו["״]?ל/);
      const callsMatch = benefits.match(/שיחות\s*(והודעות)?\s*ללא הגבלה/);
      const esimMatch = benefits.match(/eSIM/);
      const fivegMatch = benefits.match(/5G/);

      if (gbMatch) specs.push({ label: 'נפח גלישה', value: `${gbMatch[1]} GB` });
      if (callsMatch) specs.push({ label: 'שיחות', value: 'ללא הגבלה' });
      if (minutesMatch) specs.push({ label: 'דקות לחו"ל', value: `${minutesMatch[1]} דקות` });
      if (fivegMatch) specs.push({ label: 'רשת', value: '5G' });
      if (esimMatch) specs.push({ label: 'eSIM', value: 'כלול' });
    } 
    else if (plan.service.includes('אינטרנט')) {
      // Internet specs
      const speedMatch = benefits.match(/(\d+)\s*מגה/i);
      const infraMatch = benefits.match(/(ספק|תשתית)/);
      const routerMatch = benefits.match(/נתב\s*(\d+)\s*₪/);
      const fiberMatch = benefits.match(/סיב אופטי|אופטי/);

      if (speedMatch) specs.push({ label: 'מהירות', value: `${speedMatch[1]} מגה` });
      if (fiberMatch) specs.push({ label: 'טכנולוגיה', value: 'סיב אופטי' });
      if (infraMatch) specs.push({ label: 'סוג', value: 'ספק + תשתית' });
      if (routerMatch) specs.push({ label: 'נתב', value: `${routerMatch[1]} ₪/חודש` });
    }
    else if (plan.service.includes('טלוויזיה') || plan.service.includes('TV')) {
      // TV specs
      const channelsMatch = benefits.match(/(\d+)\s*ערוצים/);
      const sportsMatch = benefits.match(/ספורט|sport/i);
      const kidsMatch = benefits.match(/ילדים|kids/i);
      const vodMatch = benefits.match(/VOD|וידאו לפי דרישה/i);
      const hdMatch = benefits.match(/HD|4K/);

      if (channelsMatch) specs.push({ label: 'מספר ערוצים', value: channelsMatch[1] });
      if (sportsMatch) specs.push({ label: 'ערוצי ספורט', value: 'כלול' });
      if (kidsMatch) specs.push({ label: 'ערוצי ילדים', value: 'כלול' });
      if (vodMatch) specs.push({ label: 'VOD', value: 'כלול' });
      if (hdMatch) specs.push({ label: 'איכות', value: hdMatch[0] });
    }
    else if (plan.service.includes('חשמל')) {
      // Electricity specs
      const greenMatch = benefits.match(/ירוק|אנרגיה מתחדשת|סולרי/i);
      const tariffMatch = benefits.match(/תעריף (יום|לילה)/i);
      
      if (greenMatch) specs.push({ label: 'סוג אנרגיה', value: 'אנרגיה ירוקה' });
      if (tariffMatch) specs.push({ label: 'תעריף', value: tariffMatch[0] });
    }

    return specs;
  };

  const technicalSpecs = getTechnicalSpecs();
  
  // Get user's reason for this plan
  const getMatchReason = () => {
    const reasons = [];
    
    if (savingsVsAvg > 100) {
      reasons.push({
        title: "חיסכון משמעותי",
        description: `המסלול זול ב-₪${Math.round(savingsVsAvg)} לחודש מהממוצע בקטגוריה זו`,
        score: Math.min(100, (savingsVsAvg / avgPrice) * 200)
      });
    }
    
    if (plan.transferBenefits) {
      reasons.push({
        title: "הטבת מעבר",
        description: plan.transferBenefits,
        score: 85
      });
    }
    
    if (currentPrice <= avgPrice) {
      reasons.push({
        title: "מחיר תחרותי",
        description: "אחד המסלולים הזולים בקטגוריה זו",
        score: priceScore
      });
    }
    
    return reasons.slice(0, 3);
  };
  
  const matchReasons = getMatchReason();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden font-heebo">
        {/* Clean Header */}
        <div className="relative bg-white border-b p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute left-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="space-y-1 pr-10">
            <Badge variant="outline" className="text-xs font-normal mb-2">
              {plan.service}
            </Badge>
            <h2 className="text-2xl font-light text-gray-900">{plan.plan}</h2>
            <p className="text-sm text-gray-500 font-light">{plan.company}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-gray-50">
          {/* Pricing Section - Clean & Professional */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-light mb-1">מחיר חודשי</div>
                <div className="text-4xl font-light text-gray-900">₪{currentPrice}</div>
              </div>
              {plan.yearlyPrice && (
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-light mb-1">מחיר שנתי</div>
                  <div className="text-xl font-light text-gray-700">₪{plan.yearlyPrice}</div>
                </div>
              )}
            </div>
            
            {savingsVsAvg > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm font-normal text-gray-900">
                      חיסכון של ₪{Math.round(savingsVsAvg)} לחודש
                    </div>
                    <div className="text-xs text-gray-500 font-light">
                      לעומת ממוצע השוק (₪{Math.round(avgPrice)})
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal">
                  -{savingsPercent}%
                </Badge>
              </div>
            )}
          </div>

          {/* Technical Specifications - Clean Grid */}
          {technicalSpecs.length > 0 && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-normal text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-gray-400" />
                מה כלול במסלול
              </h3>
              
              <div className="grid gap-3">
                {technicalSpecs.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded border border-gray-100">
                    <span className="text-sm text-gray-600 font-light">{spec.label}</span>
                    <span className="text-sm font-normal text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Details - Minimal */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-normal text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              פרטי שירות
            </h3>
            
            <div className="grid gap-3">
              {plan.commitment && (
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-light">זמן התחייבות</span>
                  </div>
                  <span className="text-sm font-normal text-gray-900">{plan.commitment}</span>
                </div>
              )}
              
              {plan.sla && (
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-light">ציון שירות (SLA)</span>
                  </div>
                  <span className="text-sm font-normal text-gray-900">{plan.sla}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded border border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 font-light">מיקום בשוק</span>
                </div>
                <Badge variant="outline" className="font-normal text-gray-700">
                  {valueMetrics.marketPosition}
                </Badge>
              </div>
            </div>
          </div>

          {/* Transfer Benefits - Subtle */}
          {plan.transferBenefits && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="text-lg">🎁</div>
                <div>
                  <h3 className="text-sm font-normal text-gray-900 mb-1">הטבת מעבר</h3>
                  <p className="text-sm text-gray-700 font-light leading-relaxed">
                    {plan.transferBenefits}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Annual Savings - Minimal */}
          {savingsVsAvg > 0 && (
            <div className="bg-green-50 rounded-lg p-5 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600 font-light mb-1">חיסכון שנתי משוער</div>
                  <div className="text-3xl font-light text-gray-900">
                    ₪{Math.round(savingsVsAvg * 12).toLocaleString()}
                  </div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
          )}

          {/* CTA Button - Clean */}
          <Button
            onClick={() => {
              onSelectForSwitch(plan);
              onClose();
            }}
            size="lg"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-normal shadow-sm"
          >
            עברו למסלול
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
