import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Zap, Smartphone, Wifi, Tv, FileText, Upload, CheckCircle2, Clock, Sparkles, TrendingDown, Award, X } from "lucide-react";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { cn } from "@/lib/utils";
import { EnhancedNavigation } from "@/components/ui/enhanced-navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { enhancedToast } from "@/components/EnhancedToast";

type CategoryType = 'electricity' | 'internet' | 'mobile' | 'tv';

interface SwitchRequest {
  planId: string;
  planName: string;
  company: string;
  price: number;
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  currentProvider: string;
  address: string;
  notes: string;
  documents: File[];
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'completed';
  submittedAt?: Date;
}

export const CleanAllPlans = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [currentUserPrice, setCurrentUserPrice] = useState<string>('');
  const [isSwitchDialogOpen, setIsSwitchDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ManualPlan | null>(null);
  const [currentStep, setCurrentStep] = useState<'details' | 'documents' | 'review' | 'success'>('details');
  
  const [switchRequest, setSwitchRequest] = useState<Partial<SwitchRequest>>({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    currentProvider: '',
    address: '',
    notes: '',
    documents: [],
    status: 'draft'
  });

  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const firstCategory = parsedData[0].category;
          const categoryMapping: Record<string, CategoryType> = {
            'cellular': 'mobile',
            'electricity': 'electricity',
            'internet': 'internet',
            'tv': 'tv'
          };
          setSelectedCategory(categoryMapping[firstCategory] || firstCategory as CategoryType);
          setCurrentUserPrice(parsedData[0].amount || '');
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
  }, []);

  const categoryConfig = {
    electricity: { label: 'חשמל', icon: <Zap className="w-5 h-5" />, color: 'text-primary' },
    internet: { label: 'אינטרנט', icon: <Wifi className="w-5 h-5" />, color: 'text-primary' },
    mobile: { label: 'סלולר', icon: <Smartphone className="w-5 h-5" />, color: 'text-primary' },
    tv: { label: 'טלוויזיה', icon: <Tv className="w-5 h-5" />, color: 'text-primary' }
  };

  const top3Plans = selectedCategory 
    ? manualPlans
        .filter(p => p.category === selectedCategory && p.regularPrice > 0)
        .sort((a, b) => a.regularPrice - b.regularPrice)
        .slice(0, 3)
    : [];

  const calculateSavings = (planPrice: number) => {
    if (!currentUserPrice || parseFloat(currentUserPrice) <= 0) return 0;
    return Math.max(0, (parseFloat(currentUserPrice) - planPrice) * 12);
  };

  const handleStartSwitch = (plan: ManualPlan) => {
    setSelectedPlan(plan);
    setSwitchRequest({
      ...switchRequest,
      planId: plan.id,
      planName: plan.planName,
      company: plan.company,
      price: plan.regularPrice
    });
    setCurrentStep('details');
    setIsSwitchDialogOpen(true);
  };

  const handleDetailsNext = () => {
    if (!switchRequest.fullName || !switchRequest.idNumber || !switchRequest.phone || !switchRequest.email) {
      enhancedToast.warning({
        title: 'חסרים פרטים',
        description: 'יש למלא את כל השדות החובה'
      });
      return;
    }
    setCurrentStep('documents');
  };

  const handleDocumentsNext = () => {
    setCurrentStep('review');
  };

  const handleSubmit = () => {
    const finalRequest: SwitchRequest = {
      ...switchRequest as SwitchRequest,
      status: 'submitted',
      submittedAt: new Date()
    };

    localStorage.setItem('switchRequest', JSON.stringify(finalRequest));

    enhancedToast.success({
      title: 'הבקשה נשלחה בהצלחה!',
      description: 'נחזור אליכם בהקדם'
    });

    setCurrentStep('success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSwitchRequest({
      ...switchRequest,
      documents: [...(switchRequest.documents || []), ...files]
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-32 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-32 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <EnhancedNavigation />

      <div className="container mx-auto px-6 py-24 max-w-7xl relative z-10">
        {!selectedCategory && (
          <div className="text-center mb-24 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/6 text-primary border border-primary/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-sm font-medium tracking-tight">מערכת השוואה חכמה</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
              באיזה שירות תרצו
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">לחסוך כסף?</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-20 max-w-2xl mx-auto leading-relaxed">
              בחרו קטגוריה ונמצא לכם מיד את 3 המסלולים הזולים והמשתלמים ביותר בשוק
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <Card
                  key={key}
                  onClick={() => setSelectedCategory(key as CategoryType)}
                  className="group cursor-pointer hover-lift hover-border hover-scale border-2 transition-all duration-500 bg-card/80 backdrop-blur-sm"
                >
                  <CardContent className="h-44 flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      {config.icon}
                    </div>
                    <span className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">{config.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedCategory && (
          <div className="space-y-12 animate-fade-in">
            {/* Header with category badge */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCategory(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowRight className="w-4 h-4 ml-2 rotate-180" />
                  חזרה לבחירת קטגוריה
                </Button>
              </div>
              <Badge className="badge-professional text-sm">
                {categoryConfig[selectedCategory].icon}
                <span className="mr-1.5">{categoryConfig[selectedCategory].label}</span>
              </Badge>
            </div>

            {/* Main heading */}
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-foreground leading-tight">
                3 המסלולים הזולים ביותר
                <br />
                <span className="gradient-primary bg-clip-text text-transparent">עבור {categoryConfig[selectedCategory].label}</span>
              </h2>
              {currentUserPrice && parseFloat(currentUserPrice) > 0 && (
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-card-strong border shadow-sm">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  <span className="text-base font-medium text-muted-foreground">
                    אתם משלמים כרגע:
                  </span>
                  <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                    ₪{parseFloat(currentUserPrice).toLocaleString()}
                  </span>
                  <span className="text-base text-muted-foreground">/ חודש</span>
                </div>
              )}
            </div>

            {/* Plans grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {top3Plans.map((plan, index) => {
                const savings = calculateSavings(plan.regularPrice);
                const isTopPlan = index === 0;
                
                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "group relative hover-lift hover-glow transition-all duration-500",
                      "bg-card/90 backdrop-blur-sm border-2",
                      isTopPlan && "md:scale-105 border-primary/30 shadow-purple-lg"
                    )}
                  >
                    {isTopPlan && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="badge-professional shadow-md">
                          <Award className="w-3.5 h-3.5" />
                          <span className="mr-1">המומלץ ביותר</span>
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-8 space-y-6">
                      {/* Company & Plan name */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                          {plan.company}
                        </div>
                        <h3 className="text-2xl font-display font-bold text-foreground tracking-tight leading-tight">
                          {plan.planName}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="py-6 border-y border-border/50">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-display font-bold gradient-primary bg-clip-text text-transparent">
                            ₪{plan.regularPrice}
                          </span>
                          <span className="text-lg text-muted-foreground">/ חודש</span>
                        </div>
                        {savings > 0 && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/8 border border-primary/10">
                            <TrendingDown className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">
                              חיסכון של ₪{savings.toLocaleString()} בשנה
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-3">
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-muted-foreground leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        onClick={() => handleStartSwitch(plan)}
                        className={cn(
                          "w-full h-12 font-semibold text-base rounded-xl shadow-sm hover-lift-sm transition-all duration-500 group/btn",
                          isTopPlan 
                            ? "gradient-primary hover:gradient-primary-hover text-primary-foreground shadow-purple" 
                            : "bg-secondary hover:bg-primary/8 text-foreground hover:text-primary border border-border"
                        )}
                      >
                        <span>בצעו מעבר עכשיו</span>
                        <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-20 text-center glass-card-strong rounded-2xl p-12 border shadow-lg">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
                  לא מצאתם מה שחיפשתם?
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  נשמח לעזור לכם למצוא את המסלול המושלם בשיחה אישית עם אחד המומחים שלנו
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button 
                    size="lg"
                    className="gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold rounded-xl shadow-purple hover-lift-sm group"
                  >
                    <Clock className="w-5 h-5 ml-2" />
                    <span>קבעו פגישת ייעוץ חינם</span>
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="font-semibold rounded-xl hover-lift-sm hover:bg-primary/5 hover:border-primary/30"
                  >
                    <Sparkles className="w-5 h-5 ml-2" />
                    <span>צרו קשר עם צוות התמיכה</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Switch Dialog */}
        <Dialog open={isSwitchDialogOpen} onOpenChange={setIsSwitchDialogOpen}>
          <DialogContent className="sm:max-w-2xl glass-card-strong border-2 shadow-purple-lg">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-display font-bold tracking-tight">
                  {currentStep === 'details' && 'פרטים אישיים'}
                  {currentStep === 'documents' && 'מסמכים נדרשים'}
                  {currentStep === 'review' && 'אישור הבקשה'}
                  {currentStep === 'success' && 'הבקשה נשלחה!'}
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Step indicator */}
            {currentStep !== 'success' && (
              <div className="flex items-center gap-2 mt-6 mb-8">
                {['details', 'documents', 'review'].map((step, idx) => (
                  <div key={step} className="flex-1 flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      currentStep === step 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : ['details', 'documents', 'review'].indexOf(currentStep) > idx
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {['details', 'documents', 'review'].indexOf(currentStep) > idx ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    {idx < 2 && (
                      <div className={cn(
                        "flex-1 h-0.5 transition-all",
                        ['details', 'documents', 'review'].indexOf(currentStep) > idx ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step content */}
            <div className="space-y-6">
              {currentStep === 'details' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">שם מלא *</Label>
                      <Input 
                        value={switchRequest.fullName}
                        onChange={(e) => setSwitchRequest({ ...switchRequest, fullName: e.target.value })}
                        placeholder="הכניסו שם מלא"
                        className="h-11 rounded-lg border-border/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">תעודת זהות *</Label>
                      <Input 
                        value={switchRequest.idNumber}
                        onChange={(e) => setSwitchRequest({ ...switchRequest, idNumber: e.target.value })}
                        placeholder="123456789"
                        className="h-11 rounded-lg border-border/80"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">טלפון *</Label>
                      <Input 
                        value={switchRequest.phone}
                        onChange={(e) => setSwitchRequest({ ...switchRequest, phone: e.target.value })}
                        placeholder="050-1234567"
                        className="h-11 rounded-lg border-border/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">אימייל *</Label>
                      <Input 
                        type="email"
                        value={switchRequest.email}
                        onChange={(e) => setSwitchRequest({ ...switchRequest, email: e.target.value })}
                        placeholder="email@example.com"
                        className="h-11 rounded-lg border-border/80"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">ספק נוכחי</Label>
                    <Input 
                      value={switchRequest.currentProvider}
                      onChange={(e) => setSwitchRequest({ ...switchRequest, currentProvider: e.target.value })}
                      placeholder="למשל: בזק, סלקום, פרטנר..."
                      className="h-11 rounded-lg border-border/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">כתובת</Label>
                    <Input 
                      value={switchRequest.address}
                      onChange={(e) => setSwitchRequest({ ...switchRequest, address: e.target.value })}
                      placeholder="רחוב, עיר, מיקוד"
                      className="h-11 rounded-lg border-border/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">הערות</Label>
                    <Textarea 
                      value={switchRequest.notes}
                      onChange={(e) => setSwitchRequest({ ...switchRequest, notes: e.target.value })}
                      placeholder="הערות נוספות..."
                      className="min-h-24 rounded-lg border-border/80 resize-none"
                    />
                  </div>
                  <Button 
                    onClick={handleDetailsNext}
                    className="w-full h-12 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold rounded-xl shadow-purple hover-lift-sm"
                  >
                    <span>המשך</span>
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              )}

              {currentStep === 'documents' && (
                <div className="space-y-6">
                  <div className="text-center p-8 rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20">
                    <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">העלו מסמכים</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      תעודת זהות, חשבונית אחרונה (אופציונלי)
                    </p>
                    <Input 
                      type="file" 
                      multiple
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                  {switchRequest.documents && switchRequest.documents.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">קבצים שהועלו:</Label>
                      <div className="space-y-2">
                        {switchRequest.documents.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm flex-1">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newDocs = [...(switchRequest.documents || [])];
                                newDocs.splice(idx, 1);
                                setSwitchRequest({ ...switchRequest, documents: newDocs });
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep('details')}
                      className="flex-1 h-12 font-semibold rounded-xl"
                    >
                      חזרה
                    </Button>
                    <Button 
                      onClick={handleDocumentsNext}
                      className="flex-1 h-12 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold rounded-xl shadow-purple hover-lift-sm"
                    >
                      <span>המשך</span>
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'review' && selectedPlan && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl glass-card border">
                    <h3 className="text-lg font-bold text-foreground mb-4">פרטי המסלול</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">חברה:</span>
                        <span className="font-semibold">{selectedPlan.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">מסלול:</span>
                        <span className="font-semibold">{selectedPlan.planName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">מחיר חודשי:</span>
                        <span className="font-bold text-primary">₪{selectedPlan.regularPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl glass-card border">
                    <h3 className="text-lg font-bold text-foreground mb-4">הפרטים שלך</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">שם מלא:</span>
                        <span className="font-semibold">{switchRequest.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">טלפון:</span>
                        <span className="font-semibold">{switchRequest.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">אימייל:</span>
                        <span className="font-semibold">{switchRequest.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep('documents')}
                      className="flex-1 h-12 font-semibold rounded-xl"
                    >
                      חזרה
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      className="flex-1 h-12 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold rounded-xl shadow-purple hover-lift-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                      <span>אישור ושליחה</span>
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'success' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                    הבקשה נשלחה בהצלחה!
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    נציג שלנו יצור איתכם קשר בתוך 24 שעות לסיום התהליך
                  </p>
                  <Button 
                    onClick={() => {
                      setIsSwitchDialogOpen(false);
                      setCurrentStep('details');
                    }}
                    className="h-12 px-8 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold rounded-xl shadow-purple hover-lift-sm"
                  >
                    סגור
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
