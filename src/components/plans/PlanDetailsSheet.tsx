import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ManualPlan } from "@/data/manual-plans";
import { CheckCircle, Star, Zap, Package, Clock, Award, ArrowRight, Sparkles, Download, Upload, Database, Phone, MessageSquare, TrendingDown, Crown, X } from "lucide-react";

interface PlanDetailsSheetProps {
  plan: ManualPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForSwitch: (plan: ManualPlan) => void;
}

export function PlanDetailsSheet({ plan, isOpen, onClose, onSelectForSwitch }: PlanDetailsSheetProps) {
  if (!plan) return null;

  const hasIntroOffer = plan.introPrice && plan.introPrice < plan.regularPrice;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-3xl overflow-y-auto p-0 border-l-4 border-primary/20 animate-slide-in-right"
      >
        {/* Hero Section with Gradient Background */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-75" />
          </div>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm z-10"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="relative">
            {/* Plan Icon */}
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl mb-6 border-2 border-white/30">
              <Package className="w-10 h-10 text-white" />
            </div>

            {/* Plan Title */}
            <SheetTitle className="text-4xl font-bold font-heebo text-white mb-3 drop-shadow-lg">
              {plan.planName}
            </SheetTitle>

            {/* Company & Category Badges */}
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-assistant text-base px-4 py-1">
                {plan.company}
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-assistant px-3 py-1">
                {plan.category}
              </Badge>
              {plan.introPrice && plan.introPrice < plan.regularPrice && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-assistant px-3 py-1 border-0">
                  <Crown className="w-3 h-3 ml-1" />
                  מבצע מיוחד
                </Badge>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-white/70 text-xs font-assistant mb-1">תכונות</div>
                <div className="text-white text-xl font-bold font-heebo">{plan.features.length}</div>
              </div>
              {plan.regularPrice > 0 && (
                <>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="text-white/70 text-xs font-assistant mb-1">מחיר חודשי</div>
                    <div className="text-white text-xl font-bold font-heebo">₪{plan.regularPrice}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="text-white/70 text-xs font-assistant mb-1">שנתי</div>
                    <div className="text-white text-xl font-bold font-heebo">₪{plan.regularPrice * 12}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-gradient-to-b from-background to-muted/10">
          {/* Pricing Card - Enhanced Design */}
          {plan.regularPrice > 0 && (
            <div className="relative group">
              {/* Main Pricing Card */}
              <div className="relative bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-3xl p-8 border-2 border-primary/30 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                {/* Animated Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Decorative Corner Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative">
                  {hasIntroOffer ? (
                    <div className="space-y-6">
                      {/* Special Offer Header */}
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
                        <span className="text-sm font-bold text-orange-600 uppercase tracking-wider font-assistant">
                          הצעה מיוחדת
                        </span>
                        <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
                      </div>

                      {/* Prices Comparison */}
                      <div className="flex items-end justify-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground font-assistant mb-2">
                            מחיר רגיל
                          </div>
                          <div className="text-3xl text-muted-foreground line-through font-heebo opacity-60">
                            ₪{plan.regularPrice}
                          </div>
                        </div>
                        
                        <TrendingDown className="w-8 h-8 text-green-600 mb-2" />
                        
                        <div className="text-center">
                          <div className="text-sm text-primary font-assistant mb-2 font-semibold">
                            מחיר מבצע
                          </div>
                          <div className="text-6xl font-bold text-primary font-heebo">
                            ₪{plan.introPrice}
                          </div>
                        </div>
                      </div>

                      {/* Savings Badge */}
                      <div className="flex justify-center">
                        <Badge className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-assistant text-lg px-6 py-2 shadow-lg">
                          <Sparkles className="w-4 h-4 ml-2" />
                          חסוך ₪{plan.regularPrice - plan.introPrice} בחודש
                        </Badge>
                      </div>

                      {/* Annual Calculation */}
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                        <div className="text-sm text-green-700 font-assistant mb-1">
                          חיסכון שנתי משוער
                        </div>
                        <div className="text-3xl font-bold text-green-600 font-heebo">
                          ₪{(plan.regularPrice - plan.introPrice) * 12}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-assistant mb-2 uppercase tracking-wider">
                        <Zap className="w-4 h-4" />
                        מחיר חודשי
                      </div>
                      <div className="text-6xl font-bold text-primary font-heebo mb-4">
                        ₪{plan.regularPrice}
                      </div>
                      <div className="text-base text-muted-foreground font-assistant">
                        ללא התחייבות • ביטול בכל עת
                      </div>
                      
                      {/* Annual Price */}
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="text-sm text-muted-foreground font-assistant mb-2">
                          עלות שנתית משוערת
                        </div>
                        <div className="text-2xl font-bold text-foreground font-heebo">
                          ₪{plan.regularPrice * 12}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* Features Section - Premium Design */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heebo text-foreground">
                  תכונות המסלול
                </h3>
                <p className="text-sm text-muted-foreground font-assistant">
                  כל מה שכלול במסלול הזה
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {plan.features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-l from-background via-muted/30 to-background hover:from-primary/5 hover:via-primary/10 hover:to-primary/5 rounded-2xl p-5 border-2 border-border hover:border-primary/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Feature Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xs font-bold font-heebo shadow-lg">
                    {index + 1}
                  </div>

                  <div className="flex items-start gap-4">
                    {/* Check Icon */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    
                    {/* Feature Text */}
                    <div className="flex-1 pt-1">
                      <span className="text-base font-assistant leading-relaxed text-foreground group-hover:text-primary transition-colors">
                        {feature}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications - Modern Cards */}
          {(plan.downloadSpeed || plan.uploadSpeed || plan.dataAmount || plan.speed || plan.callMinutes || plan.smsAmount) && (
            <>
              <Separator className="my-8" />
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-heebo text-foreground">
                      מפרט טכני
                    </h3>
                    <p className="text-sm text-muted-foreground font-assistant">
                      פרטים נוספים על המסלול
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {plan.downloadSpeed && (
                    <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                          <Download className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 font-assistant font-semibold">
                          מהירות הורדה
                        </div>
                      </div>
                      <div className="text-2xl font-bold font-heebo text-blue-900 dark:text-blue-100">
                        {plan.downloadSpeed}
                      </div>
                    </div>
                  )}
                  
                  {plan.uploadSpeed && (
                    <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-5 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300 font-assistant font-semibold">
                          מהירות העלאה
                        </div>
                      </div>
                      <div className="text-2xl font-bold font-heebo text-purple-900 dark:text-purple-100">
                        {plan.uploadSpeed}
                      </div>
                    </div>
                  )}
                  
                  {plan.dataAmount && (
                    <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-5 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                          <Database className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-300 font-assistant font-semibold">
                          נפח גלישה
                        </div>
                      </div>
                      <div className="text-2xl font-bold font-heebo text-emerald-900 dark:text-emerald-100">
                        {plan.dataAmount}
                      </div>
                    </div>
                  )}
                  
                  {plan.speed && plan.category === 'electricity' && (
                    <div className="group relative bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl p-5 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm text-amber-700 dark:text-amber-300 font-assistant font-semibold">
                          הנחה
                        </div>
                      </div>
                      <div className="text-2xl font-bold font-heebo text-amber-900 dark:text-amber-100">
                        {plan.speed}
                      </div>
                    </div>
                  )}
                  
                  {plan.callMinutes && (
                    <div className="group relative bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-950/30 dark:to-lime-950/30 rounded-2xl p-5 border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300 font-assistant font-semibold">
                          דקות שיחה
                        </div>
                      </div>
                      <div className="text-2xl font-bold font-heebo text-green-900 dark:text-green-100">
                        {plan.callMinutes}
                      </div>
                    </div>
                  )}
                  
                  {plan.smsAmount && (
                    <div className="group relative bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 rounded-2xl p-5 border-2 border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600 transition-all hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm text-rose-700 dark:text-rose-300 font-assistant font-semibold">
                          הודעות SMS
                        </div>
                      </div>
                      <div className="text-2xl font-bold font-heebo text-rose-900 dark:text-rose-100">
                        {plan.smsAmount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Premium CTA Section */}
          <div className="sticky bottom-0 -mx-8 px-8 py-6 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl border-t-2 border-primary/20 mt-8">
            <Button
              onClick={() => onSelectForSwitch(plan)}
              className="group relative w-full h-16 text-xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary shadow-2xl hover:shadow-primary/50 transition-all duration-500 overflow-hidden"
              size="lg"
            >
              {/* Multiple Animated Layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Button Content */}
              <span className="relative flex items-center justify-center gap-3 font-assistant">
                <Sparkles className="w-6 h-6 animate-pulse" />
                בחר מסלול ועבור להחלפה
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
              </span>
            </Button>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-assistant">
                <CheckCircle className="w-4 h-4 text-green-600" />
                תהליך מהיר ופשוט
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-assistant">
                <CheckCircle className="w-4 h-4 text-green-600" />
                ללא עלויות נסתרות
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
