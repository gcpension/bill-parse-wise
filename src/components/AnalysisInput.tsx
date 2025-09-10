import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2,
  Zap,
  Wifi,
  Smartphone,
  Calculator,
  Plus,
  Minus,
  Tv,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProvidersByCategory, getCheapestPlan } from '@/data/providers';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { useFormValidation } from '@/components/DataValidation';
import { enhancedToast } from '@/components/EnhancedToast';
import { ProgressIndicator, Step } from '@/components/ProgressIndicator';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  ocrText?: string;
  parsedData?: {
    category: 'electricity' | 'cellular' | 'internet' | 'tv';
    amount: number;
    date: string;
    provider?: string;
    accountNumber?: string;
  };
  error?: string;
}

interface CategoryData {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentProvider: string;
  monthlyAmount: string;
  accountDetails?: string;
  isActive: boolean;
}

interface AnalysisInputProps {
  uploadedFiles: UploadedFile[];
  categoryData: Record<string, CategoryData>;
  isProcessing: boolean;
  onFilesUploaded: (files: UploadedFile[]) => void;
  onFileRemove: (id: string) => void;
  onCategoryToggle: (category: string) => void;
  onCategoryDataUpdate: (category: string, field: string, value: string) => void;
  onAnalyze: () => void;
}

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi,
  tv: Tv
};

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט',
  tv: 'טלוויזיה/סטרימינג'
};

const categoryColors = {
  electricity: 'from-amber-100 to-orange-100 border-amber-200',
  cellular: 'from-blue-100 to-cyan-100 border-blue-200', 
  internet: 'from-purple-100 to-indigo-100 border-purple-200',
  tv: 'from-green-100 to-emerald-100 border-green-200'
};

const categoryAccentColors = {
  electricity: 'text-amber-700',
  cellular: 'text-blue-700',
  internet: 'text-purple-700', 
  tv: 'text-green-700'
};

const categoryDescriptions = {
  electricity: 'בדקו כמה תוכלו לחסוך על חשבון החשמל',
  cellular: 'השוו תעריפי סלולר ומצאו חבילה משתלמת',
  internet: 'מצאו את החבילת האינטרנט הטובה ביותר',
  tv: 'חסכו על שירותי הטלוויזיה והסטרימינג'
};

const initialCategoryData: Record<string, CategoryData> = {
  electricity: {
    category: 'electricity',
    currentProvider: '',
    monthlyAmount: '',
    accountDetails: '',
    isActive: false
  },
  cellular: {
    category: 'cellular',
    currentProvider: '',
    monthlyAmount: '',
    accountDetails: '',
    isActive: false
  },
  internet: {
    category: 'internet',
    currentProvider: '',
    monthlyAmount: '',
    accountDetails: '',
    isActive: false
  },
  tv: {
    category: 'tv',
    currentProvider: '',
    monthlyAmount: '',
    accountDetails: '',
    isActive: false
  }
};

export const AnalysisInput = ({
  uploadedFiles,
  categoryData,
  isProcessing,
  onFilesUploaded,
  onFileRemove,
  onCategoryToggle,
  onCategoryDataUpdate,
  onAnalyze
}: AnalysisInputProps) => {
  const [potentialSavings, setPotentialSavings] = useState<Record<string, number>>({});
  const [totalPotentialSavings, setTotalPotentialSavings] = useState(0);
  const animatedSavings = useAnimatedCounter({ 
    end: totalPotentialSavings, 
    duration: 1500,
    decimals: 0 
  });

  // Form validation
  const { errors, isValid, validateField, hasError, getError } = useFormValidation(categoryData);
  
  const getActiveCategoriesCount = () => {
    return Object.values(categoryData).filter(cat => cat.isActive).length;
  };

  const canAnalyze = () => {
    const activeCategories = Object.values(categoryData).filter(cat => 
      cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0
    );
    return activeCategories.length > 0;
  };
  
  // Progress steps
  const steps: Step[] = [
    {
      id: 'select',
      title: 'בחירת קטגוריות',
      description: 'בחר את השירותים לבדיקה',
      status: getActiveCategoriesCount() > 0 ? 'completed' : 'current'
    },
    {
      id: 'input',
      title: 'הזנת נתונים',
      description: 'הזן פרטי ספקים וסכומים',
      status: getActiveCategoriesCount() === 0 ? 'pending' : 
             canAnalyze() ? 'completed' : 'current'
    },
    {
      id: 'analyze',
      title: 'ניתוח',
      description: 'קבלת תוצאות והמלצות',
      status: !canAnalyze() ? 'pending' : isProcessing ? 'current' : 'pending'
    }
  ];

  const currentStep = getActiveCategoriesCount() === 0 ? 'select' : 
                    !canAnalyze() ? 'input' : 'analyze';
  
  // Calculate potential savings when data changes
  useEffect(() => {
    const newPotentialSavings: Record<string, number> = {};
    let total = 0;

    Object.entries(categoryData).forEach(([key, data]) => {
      if (data.isActive && data.monthlyAmount && parseFloat(data.monthlyAmount) > 0) {
        const amount = parseFloat(data.monthlyAmount);
        const cheapestPlan = getCheapestPlan(data.category);
        
        if (cheapestPlan) {
          const currentPrice = data.category === 'electricity' ? amount / 850 : amount;
          const savings = Math.max(0, currentPrice - cheapestPlan.price);
          newPotentialSavings[key] = savings;
          total += savings;
        }
      }
    });

    setPotentialSavings(newPotentialSavings);
    setTotalPotentialSavings(total);
  }, [categoryData]);

  const handleAnalyze = () => {
    if (!canAnalyze()) {
      enhancedToast.warning({
        title: 'בדוק את הנתונים',
        description: 'יש להזין נתונים תקינים לפחות בקטגוריה אחת',
      });
      return;
    }

    if (!isValid) {
      enhancedToast.warning({
        title: 'יש שגיאות בנתונים',
        description: 'אנא תקן את השגיאות המסומנות ונסה שוב',
      });
      return;
    }

    enhancedToast.info({
      title: 'מתחיל ניתוח...',
      description: 'אנא המתן בזמן שאנחנו מנתחים את הנתונים שלך',
    });

    onAnalyze();
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator 
        steps={steps}
        currentStep={currentStep}
        variant="compact"
        className="mb-6"
      />

      {/* Compact Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          הזינו את הפרטים שלכם
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          בחרו קטגוריות והזינו פרטים לקבלת השוואת מחירים מדויקת
        </p>
      </div>

      {/* Compact Input Section */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-center">בחרו קטגוריות לבדיקה</CardTitle>
          
          {/* Minimal Progress Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {Object.entries(categoryData).map(([key, data]) => (
              <div 
                key={key}
                className={`w-2 h-1 rounded-full transition-all duration-300 ${
                  data.isActive && data.monthlyAmount && parseFloat(data.monthlyAmount) > 0
                    ? 'bg-success' 
                    : data.isActive 
                      ? 'bg-primary/50' 
                      : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {Object.entries(categoryData).map(([key, data], index) => {
            const CategoryIcon = categoryIcons[data.category];
            const providers = getProvidersByCategory(data.category);
            const savings = potentialSavings[key] || 0;
            const fieldErrors = getError(key);
            
            return (
              <Card 
                key={key} 
                className={`transition-all duration-300 border ${
                  data.isActive 
                    ? hasError(key) 
                      ? 'border-destructive/50 bg-destructive/5'
                      : `bg-gradient-to-br ${categoryColors[data.category]} border-2`
                    : 'border-border/30 bg-background hover:border-primary/20 cursor-pointer'
                }`}
                onClick={() => !data.isActive && onCategoryToggle(key)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${
                        hasError(key) 
                          ? 'bg-destructive/10' 
                          : data.isActive
                            ? `bg-white/70 shadow-sm`
                            : 'bg-muted'
                      }`}>
                        <CategoryIcon className={`h-6 w-6 ${
                          hasError(key) 
                            ? 'text-destructive' 
                            : data.isActive
                              ? categoryAccentColors[data.category]
                              : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className={`text-base font-semibold flex items-center gap-2 ${
                          data.isActive ? categoryAccentColors[data.category] : ''
                        }`}>
                          {categoryNames[data.category]}
                          {hasError(key) && <AlertTriangle className="h-4 w-4 text-destructive" />}
                          {data.isActive && !hasError(key) && data.monthlyAmount && parseFloat(data.monthlyAmount) > 0 && (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                        </CardTitle>
                        <p className="text-muted-foreground text-xs">
                          {categoryDescriptions[data.category]}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant={data.isActive ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategoryToggle(key);
                      }}
                    >
                      {data.isActive ? (
                        <>
                          <Minus className="h-4 w-4 ml-1" />
                          הסר
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 ml-1" />
                          הוסף
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                {data.isActive && (
                  <CardContent className="space-y-4 pt-0">
                    {fieldErrors && (
                      <Alert className="border-destructive/50 bg-destructive/5 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {fieldErrors}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">ספק נוכחי</Label>
                        <Select 
                          value={data.currentProvider} 
                          onValueChange={(value) => {
                            onCategoryDataUpdate(key, 'currentProvider', value);
                            validateField(key, 'currentProvider', value);
                          }}
                        >
                          <SelectTrigger className="h-10 bg-background border-border">
                            <SelectValue placeholder="בחרו ספק נוכחי" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border border-border shadow-lg z-[100]">
                            {/* Additional common providers for each category */}
                            {data.category === 'electricity' && [
                              'חברת חשמל',
                              'פז אנרגיה',
                              'אלקטרה פאוור',
                              'דור אלון אנרגיה',
                              'סלקום אנרגיה',
                              'נקסט אנרגיה',
                              'אורמת אנרגיה',
                              'גין אנרגיה',
                              'בזק אנרגיה'
                            ].map((providerName) => (
                              <SelectItem 
                                key={providerName} 
                                value={providerName} 
                                className="hover:bg-muted focus:bg-muted cursor-pointer"
                              >
                                {providerName}
                              </SelectItem>
                            ))}
                            
                            {data.category === 'cellular' && [
                              'פלאפון',
                              'סלקום', 
                              'פרטנר',
                              'הוט מובייל',
                              '019 מובייל',
                              'רמי לוי תקשורת',
                              'אלקטרה אפיקים',
                              'יס',
                              'גולן טלקום',
                              'סמארט מובייל'
                            ].map((providerName) => (
                              <SelectItem 
                                key={providerName} 
                                value={providerName} 
                                className="hover:bg-muted focus:bg-muted cursor-pointer"
                              >
                                {providerName}
                              </SelectItem>
                            ))}
                            
                            {data.category === 'internet' && [
                              'בזק',
                              'הוט',
                              'פרטנר',
                              'סלקום',
                              'אורנג',
                              'סלקום TV',
                              'גולד ליינס',
                              'נטוויזן',
                              '013 נטליין',
                              'יס'
                            ].map((providerName) => (
                              <SelectItem 
                                key={providerName} 
                                value={providerName} 
                                className="hover:bg-muted focus:bg-muted cursor-pointer"
                              >
                                {providerName}
                              </SelectItem>
                            ))}
                            
                            {data.category === 'tv' && [
                              'יס',
                              'הוט',
                              'סלקום TV',
                              'פרטנר TV',
                              'נטפליקס',
                              'סטרימקס',
                              'פרטנר',
                              'בזק בינלאומי',
                              'סלקום',
                              'אמזון פריים'
                            ].map((providerName) => (
                              <SelectItem 
                                key={providerName} 
                                value={providerName} 
                                className="hover:bg-muted focus:bg-muted cursor-pointer"
                              >
                                {providerName}
                              </SelectItem>
                            ))}
                            
                            {/* Show providers from data if available */}
                            {providers.length > 0 && providers.map((provider) => (
                              <SelectItem 
                                key={provider.name} 
                                value={provider.name} 
                                className="hover:bg-muted focus:bg-muted cursor-pointer"
                              >
                                {provider.name}
                              </SelectItem>
                            ))}
                            
                            <SelectItem value="אחר" className="border-t mt-1 font-medium">
                              + אחר (ספק שלא ברשימה)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">סכום חודשי (₪)</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="הזינו סכום"
                            value={data.monthlyAmount}
                            onChange={(e) => {
                              onCategoryDataUpdate(key, 'monthlyAmount', e.target.value);
                              validateField(key, 'monthlyAmount', e.target.value);
                            }}
                            className={`h-10 pr-8 bg-background ${
                              hasError(key) ? 'border-destructive focus:border-destructive' : ''
                            }`}
                            onBlur={(e) => validateField(key, 'monthlyAmount', e.target.value)}
                          />
                          <div className="w-4 h-4 flex items-center justify-center text-muted-foreground absolute right-2 top-2">
                            ₪
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compact Feedback */}
                    {data.monthlyAmount && parseFloat(data.monthlyAmount) > 0 && !hasError(key) && (
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <p className="text-sm font-medium">
                            מוכן לבדיקה - {formatCurrency(parseFloat(data.monthlyAmount))} בחודש
                          </p>
                        </div>
                        {savings > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-success" />
                            <span className="text-success font-medium text-sm">
                              חיסכון אפשרי: {formatCurrency(savings)} לחודש
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Enhanced Action Section */}
      <div className="text-center space-y-4">
        {getActiveCategoriesCount() > 0 && (
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="px-3 py-1">
              <Target className="h-3 w-3 ml-1" />
              {getActiveCategoriesCount()} תחומים נבחרו
            </Badge>
            {totalPotentialSavings > 0 && (
              <Badge className="bg-success text-white px-3 py-1">
                <TrendingUp className="h-3 w-3 ml-1" />
                חיסכון צפוי: {formatCurrency(totalPotentialSavings)}/חודש
              </Badge>
            )}
          </div>
        )}

        {/* Enhanced Progress Bar */}
        {getActiveCategoriesCount() > 0 && (
          <div className="max-w-xs mx-auto space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>התקדמות</span>
              <span>{Math.round((Object.values(categoryData).filter(cat => cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0).length / 4) * 100)}%</span>
            </div>
            <Progress 
              value={(Object.values(categoryData).filter(cat => cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0).length / 4) * 100} 
              className="h-2"
            />
          </div>
        )}
        
        <Button 
          size="lg" 
          className={`px-8 py-3 font-semibold transition-all duration-300 ${
            canAnalyze() && !isProcessing && isValid
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={handleAnalyze}
          disabled={!canAnalyze() || isProcessing || !isValid}
        >
          {isProcessing ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              מעבד את הנתונים...
            </>
          ) : (
            <>
              <Calculator className="ml-2 h-5 w-5" />
              התחילו השוואה
            </>
          )}
        </Button>

        {/* Validation Status */}
        {getActiveCategoriesCount() > 0 && !isValid && (
          <Alert className="max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              יש לתקן את השגיאות המסומנות כדי להמשיך
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};