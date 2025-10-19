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
      <DialogContent className="max-w-2xl p-0 overflow-hidden font-heebo max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Enhanced Header with gradient */}
        <div className="relative bg-gradient-to-bl from-primary/5 via-white to-accent/5 border-b p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute left-4 top-4 h-8 w-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all hover-scale"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="space-y-3 pr-12 animate-fade-in">
            <div className="flex items-center gap-2">
              <Badge className="text-xs font-medium bg-primary/10 text-primary border-primary/20 px-3 py-1">
                {plan.service}
              </Badge>
              {savingsVsAvg > 0 && (
                <Badge className="text-xs font-medium bg-green-50 text-green-700 border-green-200 px-3 py-1 animate-pulse">
                  🔥 מבצע חם
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{plan.plan}</h2>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{plan.company.charAt(0)}</span>
              </div>
              <div>
                <p className="text-base font-medium text-gray-700">{plan.company}</p>
                <p className="text-xs text-gray-500">{valueMetrics.marketPosition}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content with animations */}
        <div className="p-6 space-y-5 bg-gradient-to-b from-white via-gray-50/30 to-white">
          
          {/* Hero Pricing Card */}
          <div className="relative bg-gradient-to-br from-primary/5 via-white to-accent/5 rounded-2xl p-6 shadow-lg border-2 border-primary/10 overflow-hidden hover-scale transition-all duration-300 animate-fade-in">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                      ₪{currentPrice}
                    </span>
                    <span className="text-lg text-gray-600 font-medium">/חודש</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    מחיר קבוע ללא הפתעות
                  </div>
                </div>
                {plan.yearlyPrice && (
                  <div className="text-left bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50">
                    <div className="text-2xl font-bold text-gray-900">₪{plan.yearlyPrice}</div>
                    <div className="text-xs text-gray-600 font-medium">תשלום שנתי</div>
                    <div className="text-xs text-green-600 mt-1">חסכו {Math.round(((currentPrice * 12 - plan.yearlyPrice) / (currentPrice * 12)) * 100)}%</div>
                  </div>
                )}
              </div>
              
              {savingsVsAvg > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-green-900">
                          חיסכון ₪{Math.round(savingsVsAvg)} לחודש
                        </div>
                        <div className="text-xs text-green-700">
                          ₪{Math.round(savingsVsAvg * 12)} לשנה
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm font-bold">
                      -{savingsPercent}%
                    </Badge>
                  </div>
                  <div className="text-xs text-green-700 bg-white/50 rounded-lg p-2">
                    💡 זול ב-₪{Math.round(savingsVsAvg)} לעומת הממוצע בשוק (₪{Math.round(avgPrice)})
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technical Specs - Enhanced Grid */}
          {technicalSpecs.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200/60 hover:shadow-lg transition-shadow duration-300 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                מה כלול במסלול
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {technicalSpecs.map((spec, index) => (
                  <div 
                    key={index} 
                    className="relative group p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover-scale"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute top-2 right-2 w-1 h-1 bg-primary rounded-full group-hover:w-2 group-hover:h-2 transition-all"></div>
                    <div className="text-xs text-gray-500 font-medium mb-1">{spec.label}</div>
                    <div className="text-base font-bold text-gray-900">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Details - Enhanced */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200/60 hover:shadow-lg transition-shadow duration-300 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              תנאי השירות
            </h3>
            
            <div className="space-y-3">
              {plan.commitment && (
                <div className="group p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-100/50 hover:border-blue-200 transition-all hover-scale">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-600 font-medium">תקופת התחייבות</div>
                        <div className="text-base font-bold text-gray-900">{plan.commitment}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {plan.sla && plan.sla !== "לא זמין" && (
                <div className="group p-4 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 rounded-xl border border-amber-100/50 hover:border-amber-200 transition-all hover-scale">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs text-amber-600 font-medium">רמת שירות (SLA)</div>
                        <div className="text-base font-bold text-gray-900">{plan.sla}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="group p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-xl border border-emerald-100/50 hover:border-emerald-200 transition-all hover-scale">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-600 font-medium">מיקום בשוק</div>
                      <div className="text-base font-bold text-gray-900">{valueMetrics.marketPosition}</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 px-3 py-1">
                    ציון {overallScore}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Benefits - Enhanced */}
          {plan.transferBenefits && (
            <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200/50 shadow-md overflow-hidden hover-scale transition-all duration-300 animate-fade-in">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-200/20 rounded-full blur-xl"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 animate-pulse">
                  🎁
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    הטבות מיוחדות למצטרפים
                    <Badge className="bg-red-100 text-red-700 border-red-300 text-xs px-2 py-0.5 animate-pulse">
                      חדש
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200/30">
                    {plan.transferBenefits}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Annual Savings - Hero Card */}
          {savingsVsAvg > 0 && (
            <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-6 shadow-xl overflow-hidden animate-fade-in">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-white/90 text-sm font-medium">💰 החיסכון השנתי שלכם</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">
                      ₪{Math.round(savingsVsAvg * 12).toLocaleString()}
                    </span>
                    <span className="text-lg text-white/80 font-medium">לשנה</span>
                  </div>
                  <div className="text-white/90 text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block">
                    זה כמו ₪{Math.round(savingsVsAvg)} בחודש חינם!
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* CTA Button - Hero Style */}
          <div className="sticky bottom-0 pt-2 pb-2 bg-gradient-to-t from-white via-white to-transparent">
            <Button
              onClick={() => {
                onSelectForSwitch(plan);
                onClose();
              }}
              className="w-full h-14 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover-scale group"
            >
              <span className="flex items-center gap-3">
                עברו למסלול הזה עכשיו
                <ArrowRight className="h-5 w-5 group-hover:translate-x-[-4px] transition-transform" />
              </span>
            </Button>
            <p className="text-center text-xs text-gray-500 mt-2">
              ✨ המעבר קל, מהיר וללא עלויות
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
