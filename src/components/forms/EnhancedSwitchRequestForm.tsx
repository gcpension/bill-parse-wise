import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, User, Building2, CheckCircle, Clock, Star, Shield, Award } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { ServiceCategory, CustomerType } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";

// Import individual form components
import { ElectricityPrivateForm } from "./electricity/ElectricityPrivateForm";
import { ElectricityBusinessForm } from "./electricity/ElectricityBusinessForm";
import { CellularPrivateForm } from "./cellular/CellularPrivateForm";
import { CellularBusinessForm } from "./cellular/CellularBusinessForm";
import { InternetPrivateForm } from "./internet/InternetPrivateForm";
import { InternetBusinessForm } from "./internet/InternetBusinessForm";
import { TVPrivateForm } from "./tv/TVPrivateForm";
import { TVBusinessForm } from "./tv/TVBusinessForm";

interface EnhancedSwitchRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: ManualPlan;
}

export const EnhancedSwitchRequestForm = ({ isOpen, onClose, selectedPlan }: EnhancedSwitchRequestFormProps) => {
  const { toast } = useToast();
  const [customerType, setCustomerType] = useState<CustomerType>('private');
  const [formStep, setFormStep] = useState(1);
  const [serviceType, setServiceType] = useState<'full' | 'connection-only'>('full');
  
  // Map plan category to our form categories
  const mapServiceCategory = (planCategory: string): ServiceCategory => {
    const categoryMap: Record<string, ServiceCategory> = {
      'חשמל': 'electricity',
      'electricity': 'electricity', 
      'סלולר': 'cellular',
      'cellular': 'cellular',
      'mobile': 'cellular',
      'אינטרנט': 'internet',
      'internet': 'internet',
      'טלוויזיה': 'tv',
      'tv': 'tv'
    };
    
    return categoryMap[planCategory.toLowerCase()] || 'electricity';
  };

  const serviceCategory = mapServiceCategory(selectedPlan.category);

  const getCategoryIcon = () => {
    switch (serviceCategory) {
      case 'electricity': return '⚡';
      case 'cellular': return '📱';
      case 'internet': return '🌐';
      case 'tv': return '📺';
      default: return '📄';
    }
  };

  const getCategoryLabel = () => {
    switch (serviceCategory) {
      case 'electricity': return 'חשמל';
      case 'cellular': return 'סלולר';
      case 'internet': return 'אינטרנט';
      case 'tv': return 'טלוויזיה';
      default: return '';
    }
  };

  const renderFormComponent = () => {
    const formKey = `${serviceCategory}-${customerType}`;
    
    switch (formKey) {
      case 'electricity-private':
        return <ElectricityPrivateForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'electricity-business':
        return <ElectricityBusinessForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'cellular-private':
        return <CellularPrivateForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'cellular-business':
        return <CellularBusinessForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'internet-private':
        return <InternetPrivateForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'internet-business':
        return <InternetBusinessForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'tv-private':
        return <TVPrivateForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'tv-business':
        return <TVBusinessForm selectedPlan={selectedPlan} onClose={onClose} />;
      default:
        return <div className="text-center py-8 text-muted-foreground">טופס לא נמצא</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto font-body" dir="rtl">
        {/* Enhanced Header */}
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                {getCategoryIcon()}
              </div>
              <div>
                <DialogTitle className="text-2xl font-display font-bold bg-gradient-to-l from-primary to-primary-glow bg-clip-text text-transparent">
                  טופס מעבר ספק {getCategoryLabel()}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1 font-body">
                  מעבר מהיר ובטוח ל{selectedPlan.company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="w-3 h-3 ml-1" />
                מאובטח SSL
              </Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <Clock className="w-3 h-3 ml-1" />
                3 דקות
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">התקדמות</span>
            <span className="text-sm font-medium text-primary">{Math.min(formStep * 33, 100)}%</span>
          </div>
          <Progress value={Math.min(formStep * 33, 100)} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span className={formStep >= 1 ? "text-primary font-medium" : ""}>בחירת סוג לקוח</span>
            <span className={formStep >= 2 ? "text-primary font-medium" : ""}>מילוי פרטים</span>
            <span className={formStep >= 3 ? "text-primary font-medium" : ""}>אישור וסיום</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Plan Details */}
          <div className="lg:col-span-1 space-y-4">
            {/* Enhanced Plan Details Card */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary-glow/10 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-md">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg font-display">המסלול שנבחר</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-primary/10">
                  <span className="text-sm text-muted-foreground">חברה:</span>
                  <span className="font-bold text-primary">{selectedPlan.company}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-primary/10">
                  <span className="text-sm text-muted-foreground">מסלול:</span>
                  <span className="font-semibold">{selectedPlan.planName}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-primary/10">
                  <span className="text-sm text-muted-foreground">קטגוריה:</span>
                  <Badge className="bg-gradient-to-r from-primary to-primary-glow">
                    {getCategoryLabel()}
                  </Badge>
                </div>

                {selectedPlan.regularPrice && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <span className="text-sm text-green-700">מחיר חודשי:</span>
                    <span className="font-bold text-2xl text-green-700">₪{selectedPlan.regularPrice}</span>
                  </div>
                )}

                {selectedPlan.downloadSpeed && (
                  <div className="text-sm p-2 bg-blue-50 rounded border border-blue-100">
                    <span className="text-blue-600 font-medium">מהירות הורדה:</span> {selectedPlan.downloadSpeed}
                  </div>
                )}

                {selectedPlan.uploadSpeed && (
                  <div className="text-sm p-2 bg-purple-50 rounded border border-purple-100">
                    <span className="text-purple-600 font-medium">מהירות העלאה:</span> {selectedPlan.uploadSpeed}
                  </div>
                )}

                {selectedPlan.dataAmount && (
                  <div className="text-sm p-2 bg-orange-50 rounded border border-orange-100">
                    <span className="text-orange-600 font-medium">כמות גלישה:</span> {selectedPlan.dataAmount}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card className="border border-success/20 bg-gradient-to-br from-success/5 to-success/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-display text-success">
                  <Award className="w-4 h-4" />
                  יתרונות המעבר
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>ליווי מקצועי לאורך כל הדרך</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>אין דמי ביטול או עמלות</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>מעבר חלק ללא הפסקות</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>תמיכה 24/7 לאחר המעבר</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Process Explanation */}
            <Card className="shadow-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5 backdrop-blur-sm mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-primary">תהליך המעבר - פשוט וחכם</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span>מילוי פרטים בסיסיים</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span>קבלת אישור חתום</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span>ביצוע המעבר האוטומטי</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Type Selection */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  בחר סוג לקוח
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs 
                  value={customerType} 
                  onValueChange={(value) => {
                    setCustomerType(value as CustomerType);
                    setFormStep(2);
                  }} 
                  dir="rtl"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 h-auto">
                    <TabsTrigger 
                      value="private" 
                      className="flex items-center gap-3 py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md font-medium"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">לקוח פרטי</div>
                        <div className="text-xs text-muted-foreground">תהליך מהיר ופשוט</div>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="business" 
                      className="flex items-center gap-3 py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md font-medium"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">לקוח עסקי</div>
                        <div className="text-xs text-muted-foreground">פתרונות מתקדמים</div>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Service Type Selection */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  בחר סוג השירות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setServiceType('full')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-right ${
                      serviceType === 'full'
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                        serviceType === 'full'
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {serviceType === 'full' && (
                          <CheckCircle className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">מעבר מלא</h4>
                        <p className="text-sm text-muted-foreground">
                          ניתוק מהספק הנוכחי + התחברות לספק החדש
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">מומלץ</Badge>
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setServiceType('connection-only')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-right ${
                      serviceType === 'connection-only'
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                        serviceType === 'connection-only'
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {serviceType === 'connection-only' && (
                          <CheckCircle className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">התחברות בלבד</h4>
                        <p className="text-sm text-muted-foreground">
                          רק התחברות לספק החדש (תנתק בעצמך)
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Dynamic Form Component */}
            <div className="animate-fade-in">
              {renderFormComponent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};