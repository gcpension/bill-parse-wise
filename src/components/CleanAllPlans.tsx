import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Zap, Smartphone, Wifi, Tv, FileText, Upload, CheckCircle2, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <EnhancedNavigation />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Category Selection */}
        {!selectedCategory && (
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              באיזה שירות תרצו לחסוך?
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              בחרו קטגוריה ונראה לכם את 3 המסלולים הזולים ביותר
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedCategory(key as CategoryType)}
                  variant="outline"
                  className="h-40 flex-col gap-4 text-lg font-semibold hover-lift border-2"
                >
                  {config.icon}
                  {config.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Top 3 Plans Display */}
        {selectedCategory && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4 text-base px-6 py-2" variant="outline">
                {categoryConfig[selectedCategory].label}
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                3 המסלולים הזולים ביותר
              </h1>

              {currentUserPrice && parseFloat(currentUserPrice) > 0 && top3Plans[0] && (
                <Card className="inline-block max-w-md">
                  <CardContent className="p-8">
                    <p className="text-sm text-muted-foreground mb-2">החיסכון השנתי שלכם</p>
                    <div className="text-6xl font-bold text-primary">
                      ₪{calculateSavings(top3Plans[0].regularPrice).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {top3Plans.map((plan, index) => {
                const savings = calculateSavings(plan.regularPrice);
                const isTop = index === 0;

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "hover-lift",
                      isTop ? "border-2 border-primary shadow-xl" : ""
                    )}
                  >
                    <CardContent className="p-8">
                      {/* Badge */}
                      <Badge className="mb-6" variant={isTop ? "default" : "outline"}>
                        {isTop ? 'הזול ביותר' : `#${index + 1}`}
                      </Badge>

                      {/* Plan Info */}
                      <h3 className="text-2xl font-bold mb-2">{plan.planName}</h3>
                      <p className="text-muted-foreground mb-6">{plan.company}</p>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-bold text-primary">
                            ₪{plan.regularPrice}
                          </span>
                          <span className="text-muted-foreground">/חודש</span>
                        </div>
                        {savings > 0 && (
                          <p className="text-sm font-medium text-primary">
                            חיסכון: ₪{savings.toLocaleString()} בשנה
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={() => handleStartSwitch(plan)}
                        className="w-full"
                        size="lg"
                      >
                        בצע מעבר
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <Button
                onClick={() => top3Plans[0] && handleStartSwitch(top3Plans[0])}
                size="lg"
                className="h-16 px-12 text-xl"
              >
                עברו למסלול הזול ביותר
              </Button>
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
