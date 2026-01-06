import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlanRecord, useAllPlans } from "@/hooks/useAllPlans";
import { 
  CheckCircle, Package, ArrowRight, X, TrendingDown, Target, CheckCircle2, Shield,
  Wifi, Smartphone, Tv, Zap, Signal, Database, Monitor, Users, Rocket, Star, Crown,
  Award, Clock, Gift, Info, BarChart3
} from "lucide-react";

interface PlanRecordDetailsSheetProps {
  plan: PlanRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForSwitch: (plan: PlanRecord) => void;
  currentMonthlyBill?: number;
}

export function PlanRecordDetailsSheet({ 
  plan, 
  isOpen, 
  onClose, 
  onSelectForSwitch,
  currentMonthlyBill = 0 
}: PlanRecordDetailsSheetProps) {
  const allPlans = useAllPlans();
  
  if (!plan) return null;

  // Parse plan details from description
  const parsePlanDetails = (planName: string, service: string) => {
    const details: {
      internetSpeed?: string;
      dataAmount?: string;
      tvChannels?: string;
      cellularLines?: number;
      has5G?: boolean;
      hasStreaming?: boolean;
      has4K?: boolean;
      streamingServices?: string[];
    } = {};

    const text = planName.toLowerCase();
    
    // Internet speed detection
    const speedMatch = planName.match(/(\d+)\s*(מגה|Mb|MB|גיגה|Gb|GB)/i);
    if (speedMatch) {
      details.internetSpeed = `${speedMatch[1]} ${speedMatch[2].includes('גיגה') || speedMatch[2].toLowerCase().includes('gb') ? 'Gbps' : 'Mbps'}`;
    }
    
    // Data amount for cellular
    const dataMatch = planName.match(/(\d+)\s*(GB|ג'יגה|גיגה)/i);
    if (dataMatch && service.includes('סלולר')) {
      details.dataAmount = `${dataMatch[1]} GB`;
    }
    
    // Unlimited data detection
    if (text.includes('ללא הגבלה') || text.includes('אנלימיטד') || text.includes('unlimited')) {
      details.dataAmount = 'ללא הגבלה';
    }
    
    // TV channels
    const channelMatch = planName.match(/(\d+)\s*ערוצ/);
    if (channelMatch) {
      details.tvChannels = `${channelMatch[1]} ערוצים`;
    }
    
    // 5G detection
    if (text.includes('5g') || text.includes('דור 5')) {
      details.has5G = true;
    }
    
    // 4K detection
    if (text.includes('4k') || text.includes('uhd')) {
      details.has4K = true;
    }
    
    // Streaming services
    const streamingServices: string[] = [];
    if (text.includes('נטפליקס') || text.includes('netflix')) streamingServices.push('Netflix');
    if (text.includes('דיסני') || text.includes('disney')) streamingServices.push('Disney+');
    if (text.includes('hbo') || text.includes('max')) streamingServices.push('HBO Max');
    if (text.includes('אפל') || text.includes('apple')) streamingServices.push('Apple TV+');
    if (text.includes('סטינג') || text.includes('sting')) streamingServices.push('STINGTV');
    if (streamingServices.length > 0) {
      details.hasStreaming = true;
      details.streamingServices = streamingServices;
    }
    
    // Cellular lines for triple
    const linesMatch = planName.match(/(\d+)\s*(קווים|מכשירים|סימים)/);
    if (linesMatch) {
      details.cellularLines = parseInt(linesMatch[1]);
    }
    
    return details;
  };

  // Get plan tier
  const getPlanTier = (price: number, details: ReturnType<typeof parsePlanDetails>) => {
    const hasStreaming = details.hasStreaming;
    const has5G = details.has5G;
    const has4K = details.has4K;
    
    if (price >= 200 || (hasStreaming && has4K)) {
      return {
        tier: 'ultimate',
        label: 'אולטימטיבי',
        icon: Crown,
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        description: 'כולל הכל - סטרימינג, 4K, מהירות מקסימלית'
      };
    } else if (price >= 120 || hasStreaming) {
      return {
        tier: 'premium',
        label: 'פרימיום',
        icon: Award,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        description: 'תכונות מתקדמות וחבילות סטרימינג'
      };
    } else if (price >= 60) {
      return {
        tier: 'standard',
        label: 'סטנדרטי',
        icon: Star,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        description: 'איזון מושלם בין מחיר לתכונות'
      };
    } else {
      return {
        tier: 'basic',
        label: 'בסיסי',
        icon: Package,
        color: 'text-green-600 bg-green-50 border-green-200',
        description: 'מחיר נמוך, מתאים לשימוש קל'
      };
    }
  };

  const planDetails = parsePlanDetails(plan.plan, plan.service);
  const price = plan.monthlyPrice || 0;
  const planTier = getPlanTier(price, planDetails);
  const TierIcon = planTier.icon;

  // Calculate market comparison
  const sameCategoryPlans = allPlans.filter(p => p.service === plan.service && p.monthlyPrice);
  const avgPrice = sameCategoryPlans.length > 0 
    ? sameCategoryPlans.reduce((sum, p) => sum + (p.monthlyPrice || 0), 0) / sameCategoryPlans.length
    : price;
  
  const savingsVsAvg = avgPrice - price;
  const savingsPercent = avgPrice > 0 ? Math.round((savingsVsAvg / avgPrice) * 100) : 0;
  const userSavings = currentMonthlyBill > 0 ? currentMonthlyBill - price : 0;
  
  // Plan scores
  const priceScore = Math.max(0, Math.min(100, 100 - ((price / avgPrice) * 100 - 100)));
  const benefitsScore = plan.transferBenefits ? 80 : 40;
  const overallScore = Math.round((priceScore * 0.6 + benefitsScore * 0.4));

  // Get category icon
  const getCategoryIcon = () => {
    if (plan.service.includes('סלולר')) return Smartphone;
    if (plan.service.includes('אינטרנט')) return Wifi;
    if (plan.service.includes('טלוויזיה')) return Tv;
    if (plan.service.includes('חשמל')) return Zap;
    if (plan.service.includes('טריפל')) return Package;
    return Package;
  };
  const CategoryIcon = getCategoryIcon();

  // Build features list
  const features: string[] = [];
  if (planDetails.internetSpeed) features.push(`מהירות אינטרנט: ${planDetails.internetSpeed}`);
  if (planDetails.dataAmount) features.push(`נפח גלישה: ${planDetails.dataAmount}`);
  if (planDetails.tvChannels) features.push(`${planDetails.tvChannels}`);
  if (planDetails.has5G) features.push('רשת 5G');
  if (planDetails.has4K) features.push('איכות 4K');
  if (planDetails.cellularLines) features.push(`${planDetails.cellularLines} קווים סלולריים`);
  if (planDetails.streamingServices?.length) features.push(`סטרימינג: ${planDetails.streamingServices.join(', ')}`);
  if (plan.transferBenefits) features.push(`הטבת מעבר: ${plan.transferBenefits}`);
  if (plan.commitment) features.push(`התחייבות: ${plan.commitment}`);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-2xl overflow-y-auto p-0 bg-background"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline" className="font-assistant gap-1">
                    <CategoryIcon className="w-3 h-3" />
                    {plan.service}
                  </Badge>
                  <Badge className={`${planTier.color} font-assistant gap-1 border`}>
                    <TierIcon className="w-3 h-3" />
                    {planTier.label}
                  </Badge>
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-heebo mb-1 leading-tight">{plan.plan}</h2>
                <p className="text-muted-foreground font-assistant">{plan.company}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-lg shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Key Metrics Row */}
            <div className="flex items-center gap-3 md:gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold font-heebo text-primary">{overallScore}</span>
                </div>
                <span className="text-muted-foreground font-assistant text-xs">ציון כללי</span>
              </div>
              <Separator orientation="vertical" className="h-6 hidden md:block" />
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="font-assistant text-xs">
                  {savingsVsAvg > 0 ? `₪${Math.round(savingsVsAvg)} מתחת לממוצע` : 'מחיר סטנדרטי'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-5 md:p-6 space-y-5">
          
          {/* Price Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground font-assistant mb-1">מחיר חודשי</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-bold font-heebo">₪{price}</span>
                    <span className="text-muted-foreground font-assistant">/חודש</span>
                  </div>
                </div>
                {userSavings > 0 && (
                  <div className="text-left">
                    <Badge className="bg-emerald-500 text-white mb-1">
                      <TrendingDown className="w-3 h-3 ml-1" />
                      חוסך ₪{userSavings.toFixed(0)}
                    </Badge>
                    <div className="text-xs text-emerald-600 font-assistant">
                      = ₪{(userSavings * 12).toLocaleString()} בשנה
                    </div>
                  </div>
                )}
              </div>
              
              {/* Price comparison bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-assistant">
                  <span className="text-muted-foreground">ממוצע בקטגוריה: ₪{Math.round(avgPrice)}</span>
                  <span className={savingsVsAvg > 0 ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>
                    {savingsVsAvg > 0 ? `${savingsPercent}% זול יותר` : 'מחיר ממוצע'}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min((price / (avgPrice * 1.5)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Tier Explanation */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${planTier.color}`}>
                  <TierIcon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-heebo">רמת מסלול: {planTier.label}</CardTitle>
                  <CardDescription className="font-assistant text-xs">{planTier.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Plan Details */}
          {(Object.keys(planDetails).length > 0 || plan.transferBenefits) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heebo flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  פרטי המסלול
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {planDetails.internetSpeed && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Wifi className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-xs text-muted-foreground font-assistant">מהירות</div>
                      <div className="text-sm font-semibold font-heebo">{planDetails.internetSpeed}</div>
                    </div>
                  </div>
                )}
                
                {planDetails.dataAmount && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Database className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-xs text-muted-foreground font-assistant">נפח גלישה</div>
                      <div className="text-sm font-semibold font-heebo">{planDetails.dataAmount}</div>
                    </div>
                  </div>
                )}
                
                {planDetails.tvChannels && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Monitor className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="text-xs text-muted-foreground font-assistant">טלוויזיה</div>
                      <div className="text-sm font-semibold font-heebo">{planDetails.tvChannels}</div>
                    </div>
                  </div>
                )}
                
                {planDetails.cellularLines && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Users className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="text-xs text-muted-foreground font-assistant">קווים</div>
                      <div className="text-sm font-semibold font-heebo">{planDetails.cellularLines} קווים</div>
                    </div>
                  </div>
                )}
                
                {planDetails.has5G && (
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                    <Signal className="w-4 h-4 text-cyan-600" />
                    <div className="text-sm font-semibold font-heebo text-cyan-700">רשת 5G</div>
                  </div>
                )}
                
                {planDetails.has4K && (
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <Tv className="w-4 h-4 text-purple-600" />
                    <div className="text-sm font-semibold font-heebo text-purple-700">איכות 4K</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Streaming Services */}
          {planDetails.streamingServices && planDetails.streamingServices.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heebo flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary" />
                  שירותי סטרימינג כלולים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {planDetails.streamingServices.map((service, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm font-assistant">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {plan.transferBenefits && (
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heebo flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-600" />
                  הטבות מעבר
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-assistant text-amber-800">{plan.transferBenefits}</p>
              </CardContent>
            </Card>
          )}

          {/* Commitment */}
          {plan.commitment && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heebo flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  תקופת התחייבות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-assistant">{plan.commitment}</p>
              </CardContent>
            </Card>
          )}

          {/* Service Score */}
          {plan.sla && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heebo flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  ציון שירות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-assistant">{plan.sla}</p>
              </CardContent>
            </Card>
          )}

          {/* Quality Scores */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-heebo">ציוני איכות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-assistant">תחרותיות מחיר</span>
                  <span className="font-heebo font-semibold">{Math.round(priceScore)}%</span>
                </div>
                <Progress value={priceScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-assistant">הטבות ותוספות</span>
                  <span className="font-heebo font-semibold">{benefitsScore}%</span>
                </div>
                <Progress value={benefitsScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-assistant font-medium">ציון כללי</span>
                  <span className="font-heebo font-bold text-primary">{overallScore}%</span>
                </div>
                <Progress value={overallScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
            <div className="text-sm font-assistant text-muted-foreground">
              מידע מאומת • מחירים עדכניים • ללא עמלות נסתרות
            </div>
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 bg-background pt-4 pb-2 -mx-5 md:-mx-6 px-5 md:px-6 border-t">
            <Button
              onClick={() => onSelectForSwitch(plan)}
              className="w-full h-12 font-semibold text-base bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Rocket className="ml-2 h-5 w-5" />
              בחרו מסלול זה
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
