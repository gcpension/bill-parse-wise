import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualPlan } from "@/data/manual-plans";
import { CheckCircle, Info, Package, ArrowRight, Download, Upload, Database, Phone, MessageSquare, Zap, X, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PlanDetailsSheetProps {
  plan: ManualPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForSwitch: (plan: ManualPlan) => void;
}

export function PlanDetailsSheet({ plan, isOpen, onClose, onSelectForSwitch }: PlanDetailsSheetProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    features: true,
    specs: false,
  });

  if (!plan) return null;

  const hasIntroOffer = plan.introPrice && plan.introPrice < plan.regularPrice;
  const hasTechSpecs = plan.downloadSpeed || plan.uploadSpeed || plan.dataAmount || plan.speed || plan.callMinutes || plan.smsAmount;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-4xl overflow-y-auto p-0 bg-background"
      >
        {/* Clean Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold font-heebo text-foreground">
                  {plan.planName}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground font-assistant">{plan.company}</span>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="outline" className="text-xs font-assistant">{plan.category}</Badge>
                  {hasIntroOffer && (
                    <Badge className="bg-primary text-primary-foreground text-xs font-assistant">מבצע מיוחד</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Pricing Section - Clean Card */}
          {plan.regularPrice > 0 && (
            <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold font-heebo mb-1">תמחור</h3>
                  <p className="text-sm text-muted-foreground font-assistant">פירוט עלויות המסלול</p>
                </div>
                {hasIntroOffer && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-assistant">
                    חיסכון של ₪{plan.regularPrice - plan.introPrice!}/חודש
                  </Badge>
                )}
              </div>

              {hasIntroOffer ? (
                <div className="space-y-4">
                  <div className="flex items-baseline gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="text-sm text-muted-foreground font-assistant">מחיר מבצע</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold font-heebo text-primary">₪{plan.introPrice}</span>
                        <span className="text-muted-foreground font-assistant">/חודש</span>
                      </div>
                    </div>
                    
                    <TrendingDown className="w-8 h-8 text-primary mt-6" />
                    
                    <div className="flex-1 space-y-2">
                      <div className="text-sm text-muted-foreground font-assistant">מחיר רגיל</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-heebo text-muted-foreground line-through">₪{plan.regularPrice}</span>
                        <span className="text-muted-foreground font-assistant">/חודש</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium font-assistant">חיסכון שנתי משוער</span>
                    <span className="text-2xl font-bold font-heebo text-primary">
                      ₪{(plan.regularPrice - plan.introPrice!) * 12}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold font-heebo text-foreground">₪{plan.regularPrice}</span>
                    <span className="text-lg text-muted-foreground font-assistant">/חודש</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium font-assistant text-muted-foreground">עלות שנתית משוערת</span>
                    <span className="text-xl font-bold font-heebo">₪{plan.regularPrice * 12}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="overview" className="font-assistant py-2.5">סקירה כללית</TabsTrigger>
              <TabsTrigger value="features" className="font-assistant py-2.5">תכונות ({plan.features.length})</TabsTrigger>
              {hasTechSpecs && (
                <TabsTrigger value="specs" className="font-assistant py-2.5">מפרט טכני</TabsTrigger>
              )}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <h4 className="text-sm font-semibold font-assistant mb-2">פרטי המסלול</h4>
                      <div className="space-y-2 text-sm text-muted-foreground font-assistant">
                        <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                          <span>חברה מספקת</span>
                          <span className="font-medium text-foreground">{plan.company}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                          <span>קטגוריה</span>
                          <span className="font-medium text-foreground">{plan.category}</span>
                        </div>
                        {plan.regularPrice > 0 && (
                          <>
                            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                              <span>מחיר חודשי</span>
                              <span className="font-medium text-foreground">₪{hasIntroOffer ? plan.introPrice : plan.regularPrice}</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5">
                              <span>עלות שנתית</span>
                              <span className="font-medium text-foreground">₪{(hasIntroOffer ? plan.introPrice! : plan.regularPrice) * 12}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              {plan.features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold font-assistant">נקודות מרכזיות</h4>
                  <div className="grid gap-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card border hover:border-primary/50 transition-colors">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm font-assistant leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {plan.features.length > 3 && (
                    <p className="text-xs text-muted-foreground font-assistant text-center">
                      +{plan.features.length - 3} תכונות נוספות בלשונית "תכונות"
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-3 mt-6">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="group flex items-start gap-3 p-4 rounded-lg bg-card border hover:border-primary/50 hover:shadow-sm transition-all"
                  >
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-assistant leading-relaxed flex-1">{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Technical Specs Tab */}
            {hasTechSpecs && (
              <TabsContent value="specs" className="space-y-3 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  {plan.downloadSpeed && (
                    <div className="p-4 rounded-lg bg-card border hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium font-assistant text-muted-foreground">מהירות הורדה</span>
                      </div>
                      <div className="text-xl font-bold font-heebo">{plan.downloadSpeed}</div>
                    </div>
                  )}
                  
                  {plan.uploadSpeed && (
                    <div className="p-4 rounded-lg bg-card border hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Upload className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium font-assistant text-muted-foreground">מהירות העלאה</span>
                      </div>
                      <div className="text-xl font-bold font-heebo">{plan.uploadSpeed}</div>
                    </div>
                  )}
                  
                  {plan.dataAmount && (
                    <div className="p-4 rounded-lg bg-card border hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium font-assistant text-muted-foreground">נפח גלישה</span>
                      </div>
                      <div className="text-xl font-bold font-heebo">{plan.dataAmount}</div>
                    </div>
                  )}
                  
                  {plan.speed && plan.category === 'electricity' && (
                    <div className="p-4 rounded-lg bg-card border hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium font-assistant text-muted-foreground">הנחה</span>
                      </div>
                      <div className="text-xl font-bold font-heebo">{plan.speed}</div>
                    </div>
                  )}
                  
                  {plan.callMinutes && (
                    <div className="p-4 rounded-lg bg-card border hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium font-assistant text-muted-foreground">דקות שיחה</span>
                      </div>
                      <div className="text-xl font-bold font-heebo">{plan.callMinutes}</div>
                    </div>
                  )}
                  
                  {plan.smsAmount && (
                    <div className="p-4 rounded-lg bg-card border hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium font-assistant text-muted-foreground">הודעות SMS</span>
                      </div>
                      <div className="text-xl font-bold font-heebo">{plan.smsAmount}</div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sticky CTA Footer */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-6">
          <Button
            onClick={() => onSelectForSwitch(plan)}
            className="w-full h-14 text-lg font-assistant bg-primary hover:bg-primary/90 shadow-sm"
            size="lg"
          >
            <span className="flex items-center justify-center gap-2">
              בחר מסלול ועבור להחלפה
              <ArrowRight className="h-5 w-5" />
            </span>
          </Button>
          
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-assistant">
              <CheckCircle className="w-3.5 h-3.5" />
              תהליך מהיר ופשוט
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-assistant">
              <CheckCircle className="w-3.5 h-3.5" />
              ללא עלויות נסתרות
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
