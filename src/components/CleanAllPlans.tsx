import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Zap, Smartphone, Wifi, Tv, FileText, Upload, CheckCircle2, Clock, Sparkles, TrendingDown, Award } from "lucide-react";
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
  
  // Form state
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

  // Load data from Quick Start
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
    electricity: { label: 'חשמל', icon: <Zap className="w-6 h-6" /> },
    internet: { label: 'אינטרנט', icon: <Wifi className="w-6 h-6" /> },
    mobile: { label: 'סלולר', icon: <Smartphone className="w-6 h-6" /> },
    tv: { label: 'טלוויזיה', icon: <Tv className="w-6 h-6" /> }
  };

  // Get top 3 cheapest plans
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
    // Validation
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
    // Submit the request
    const finalRequest: SwitchRequest = {
      ...switchRequest as SwitchRequest,
      status: 'submitted',
      submittedAt: new Date()
    };

    // Save to localStorage (in production this would go to a backend)
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
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <EnhancedNavigation />

      <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        {/* Category Selection */}
        {!selectedCategory && (
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">מערכת חכמה להשוואת מסלולים</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              באיזה שירות תרצו<br />
              <span className="text-primary">לחסוך כסף?</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-2xl mx-auto">
              בחרו קטגוריה ונראה לכם מיד את 3 המסלולים הזולים והמשתלמים ביותר
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <Card
                  key={key}
                  onClick={() => setSelectedCategory(key as CategoryType)}
                  className="group cursor-pointer hover-lift hover-glow transition-all duration-300 border-2 hover:border-primary/50"
                >
                  <CardContent className="h-48 flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {config.icon}
                    </div>
                    <span className="text-xl font-bold">{config.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Top 3 Plans Display */}
        {selectedCategory && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-16">
              <Badge className="mb-6 text-base px-6 py-3 rounded-full" variant="secondary">
                <span className="flex items-center gap-2">
                  {categoryConfig[selectedCategory].icon}
                  {categoryConfig[selectedCategory].label}
                </span>
              </Badge>
              
              <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
                <span className="text-primary">3 המסלולים</span><br />
                הזולים ביותר עבורכם
              </h1>

              {currentUserPrice && parseFloat(currentUserPrice) > 0 && top3Plans[0] && (
                <div className="inline-block animate-scale-in">
                  <Card className="glass-card-strong border-2 border-primary/20 shadow-purple-lg">
                    <CardContent className="p-10">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <TrendingDown className="w-6 h-6 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">החיסכון השנתי המשוער שלכם</p>
                      </div>
                      <div className="text-7xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                        ₪{calculateSavings(top3Plans[0].regularPrice).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">במעבר למסלול הזול ביותר</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {top3Plans.map((plan, index) => {
                const savings = calculateSavings(plan.regularPrice);
                const isTop = index === 0;

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "group hover-lift hover-glow transition-all duration-500 relative overflow-hidden",
                      isTop ? "border-4 border-primary shadow-purple-lg scale-105 md:scale-110" : "border-2"
                    )}
                  >
                    {isTop && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-dark to-primary" />
                    )}
                    
                    <CardContent className="p-8 relative">
                      {/* Badge */}
                      <div className="flex items-center gap-2 mb-6">
                        <Badge className={cn(
                          "text-base px-4 py-1",
                          isTop ? "gradient-primary text-white" : ""
                        )} variant={isTop ? "default" : "outline"}>
                          {isTop && <Award className="w-4 h-4 mr-1" />}
                          {isTop ? 'המומלץ ביותר' : `מקום #${index + 1}`}
                        </Badge>
                      </div>

                      {/* Plan Info */}
                      <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">{plan.planName}</h3>
                      <p className="text-muted-foreground mb-8 text-lg">{plan.company}</p>

                      {/* Price */}
                      <div className="mb-8 p-6 rounded-2xl bg-muted/50">
                        <div className="flex items-baseline gap-3 mb-3">
                          <span className="text-6xl font-bold text-primary">
                            ₪{plan.regularPrice}
                          </span>
                          <span className="text-xl text-muted-foreground">/חודש</span>
                        </div>
                        {savings > 0 && (
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <TrendingDown className="w-5 h-5" />
                            <span className="text-lg">חיסכון: ₪{savings.toLocaleString()} בשנה</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-8">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-start gap-3 text-base">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-foreground/80">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={() => handleStartSwitch(plan)}
                        className={cn(
                          "w-full h-14 text-lg font-semibold group-hover:shadow-lg transition-all",
                          isTop ? "gradient-primary hover:gradient-primary-hover" : ""
                        )}
                        size="lg"
                      >
                        בצע מעבר עכשיו
                        <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-20">
              <Card className="glass-card-strong max-w-4xl mx-auto border-2 border-primary/20 shadow-purple-lg">
                <CardContent className="p-12">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse-slow" />
                    <h2 className="text-4xl font-bold">מוכנים להתחיל לחסוך?</h2>
                  </div>
                  <p className="text-xl text-muted-foreground mb-8">
                    המעבר פשוט, מהיר ובחינם. אנחנו נדאג לכל השאר
                  </p>
                  <Button
                    onClick={() => top3Plans[0] && handleStartSwitch(top3Plans[0])}
                    size="lg"
                    className="h-16 px-16 text-xl gradient-primary hover:gradient-primary-hover shadow-purple group"
                  >
                    <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                    עברו למסלול הזול ביותר
                    <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Switch Request Dialog */}
      <Dialog open={isSwitchDialogOpen} onOpenChange={setIsSwitchDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">ביצוע מעבר לספק</DialogTitle>
          </DialogHeader>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-4 my-6">
            {['details', 'documents', 'review'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  currentStep === step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                {index < 2 && <div className="w-12 h-0.5 bg-border" />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 'details' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">פרטים אישיים</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">שם מלא *</Label>
                  <Input
                    id="fullName"
                    value={switchRequest.fullName}
                    onChange={(e) => setSwitchRequest({ ...switchRequest, fullName: e.target.value })}
                    placeholder="שם מלא"
                  />
                </div>
                
                <div>
                  <Label htmlFor="idNumber">תעודת זהות *</Label>
                  <Input
                    id="idNumber"
                    value={switchRequest.idNumber}
                    onChange={(e) => setSwitchRequest({ ...switchRequest, idNumber: e.target.value })}
                    placeholder="123456789"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">טלפון *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={switchRequest.phone}
                    onChange={(e) => setSwitchRequest({ ...switchRequest, phone: e.target.value })}
                    placeholder="050-1234567"
                  />
                </div>

                <div>
                  <Label htmlFor="email">אימייל *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={switchRequest.email}
                    onChange={(e) => setSwitchRequest({ ...switchRequest, email: e.target.value })}
                    placeholder="example@email.com"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="currentProvider">ספק נוכחי</Label>
                  <Input
                    id="currentProvider"
                    value={switchRequest.currentProvider}
                    onChange={(e) => setSwitchRequest({ ...switchRequest, currentProvider: e.target.value })}
                    placeholder="שם הספק הנוכחי"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="address">כתובת</Label>
                  <Input
                    id="address"
                    value={switchRequest.address}
                    onChange={(e) => setSwitchRequest({ ...switchRequest, address: e.target.value })}
                    placeholder="רחוב 1, תל אביב"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">הערות</Label>
                  <Textarea
                    id="notes"
                    value={switchRequest.notes}
                    onChange={(e) => setSwitchRequest({ ...switchRequest, notes: e.target.value })}
                    placeholder="הערות נוספות..."
                    rows={3}
                  />
                </div>
              </div>

              <Button onClick={handleDetailsNext} className="w-full">
                המשך
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {currentStep === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">העלאת מסמכים</h3>
              
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  העלו תעודת זהות, חשבון אחרון מהספק הנוכחי
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
                  <p className="text-sm font-medium">קבצים שהועלו:</p>
                  {switchRequest.documents.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setCurrentStep('details')} className="flex-1">
                  חזור
                </Button>
                <Button onClick={handleDocumentsNext} className="flex-1">
                  המשך
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">סיכום ואישור</h3>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">מסלול נבחר</p>
                    <p className="font-bold">{selectedPlan?.planName}</p>
                    <p className="text-sm">{selectedPlan?.company}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">מחיר חודשי</p>
                    <p className="text-2xl font-bold text-primary">₪{selectedPlan?.regularPrice}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">פרטים אישיים</p>
                    <p className="font-medium">{switchRequest.fullName}</p>
                    <p className="text-sm">{switchRequest.phone}</p>
                    <p className="text-sm">{switchRequest.email}</p>
                  </div>

                  {switchRequest.documents && switchRequest.documents.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">מסמכים</p>
                      <p className="text-sm">{switchRequest.documents.length} קבצים</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setCurrentStep('documents')} className="flex-1">
                  חזור
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  שלח בקשה
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">הבקשה נשלחה בהצלחה!</h3>
              <p className="text-muted-foreground">
                נעבד את הבקשה שלכם ונחזור אליכם תוך 24-48 שעות
              </p>
              <Button onClick={() => setIsSwitchDialogOpen(false)} className="mt-6">
                סגור
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
