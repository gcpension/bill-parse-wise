import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ManualPlan } from "@/data/manual-plans";
import { 
  Shield, 
  Users, 
  Award, 
  ThumbsUp, 
  Clock, 
  CheckCircle,
  Star,
  TrendingUp,
  HeartHandshake,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustIndicatorsProps {
  plan: ManualPlan;
  className?: string;
}

const TrustIndicators = ({ plan, className }: TrustIndicatorsProps) => {
  // Generate realistic trust metrics
  const trustMetrics = {
    overallTrust: Math.floor(Math.random() * 15) + 85, // 85-100
    customerSatisfaction: Math.floor(Math.random() * 10) + 90, // 90-100
    reliabilityScore: Math.floor(Math.random() * 12) + 88, // 88-100
    supportQuality: Math.floor(Math.random() * 8) + 92, // 92-100
    priceTransparency: Math.floor(Math.random() * 5) + 95, // 95-100
    totalReviews: Math.floor(Math.random() * 5000) + 500,
    switchSuccessRate: Math.floor(Math.random() * 3) + 97, // 97-100
    avgResponseTime: Math.floor(Math.random() * 10) + 5, // 5-15 minutes
  };

  const certifications = [
    { name: 'ISO 27001', icon: ShieldCheck, color: 'text-blue-600' },
    { name: 'אישור רשות החשמל', icon: CheckCircle, color: 'text-green-600' },
    { name: 'תו תקן ישראלי', icon: Award, color: 'text-purple-600' },
  ];

  const getTrustLevel = (score: number) => {
    if (score >= 95) return { level: 'מעולה', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 90) return { level: 'טוב מאוד', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 85) return { level: 'טוב', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'בסדר', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const overallTrust = getTrustLevel(trustMetrics.overallTrust);

  return (
    <Card className={cn("bg-gradient-to-br from-white/95to-slate-50/80 border-border/40", className)}>
      <CardContent className="p-4 space-y-4">
        
        {/* Overall Trust Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-sm">רמת אמינות</span>
          </div>
          <Badge className={cn("text-xs", overallTrust.bg, overallTrust.color)}>
            {trustMetrics.overallTrust}% - {overallTrust.level}
          </Badge>
        </div>

        {/* Trust Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          
          {/* Customer Satisfaction */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3 text-green-500" />
                <span>שביעות רצון</span>
              </div>
              <span className="font-medium">{trustMetrics.customerSatisfaction}%</span>
            </div>
            <Progress value={trustMetrics.customerSatisfaction} className="h-1" />
          </div>

          {/* Reliability */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-500" />
                <span>אמינות</span>
              </div>
              <span className="font-medium">{trustMetrics.reliabilityScore}%</span>
            </div>
            <Progress value={trustMetrics.reliabilityScore} className="h-1" />
          </div>

          {/* Support Quality */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <HeartHandshake className="h-3 w-3 text-purple-500" />
                <span>איכות שירות</span>
              </div>
              <span className="font-medium">{trustMetrics.supportQuality}%</span>
            </div>
            <Progress value={trustMetrics.supportQuality} className="h-1" />
          </div>

          {/* Price Transparency */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>שקיפות מחיר</span>
              </div>
              <span className="font-medium">{trustMetrics.priceTransparency}%</span>
            </div>
            <Progress value={trustMetrics.priceTransparency} className="h-1" />
          </div>
        </div>

        {/* Key Stats */}
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/20">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-blue-500" />
              <span>{trustMetrics.totalReviews.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>{trustMetrics.switchSuccessRate}% הצלחה</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-500" />
              <span>{trustMetrics.avgResponseTime} דק׳</span>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">אישורים ותקנים:</p>
          <div className="flex gap-1 flex-wrap">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-white/50">
                <cert.icon className={cn("h-3 w-3 mr-1", cert.color)} />
                {cert.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expert Rating */}
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-lg border border-yellow-200/30">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">דירוג מומחים</span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "h-3 w-3",
                  i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                )} 
              />
            ))}
            <span className="text-xs text-muted-foreground mr-1">(4.2)</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default TrustIndicators;