import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
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
  Sparkles,
  Target,
  DollarSign,
  PiggyBank,
  Award,
  Rocket,
  Star
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProvidersByCategory, getCheapestPlan } from '@/data/providers';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

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
  electricity: 'gradient-sunset',
  cellular: 'gradient-electric', 
  internet: 'gradient-vibrant',
  tv: 'gradient-purple'
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

  const getActiveCategoriesCount = () => {
    return Object.values(categoryData).filter(cat => cat.isActive).length;
  };

  const canAnalyze = () => {
    const activeCategories = Object.values(categoryData).filter(cat => 
      cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0
    );
    return activeCategories.length > 0;
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Real-Time Savings */}
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-5xl font-black gradient-primary bg-clip-text text-transparent animate-fade-in">
            בואו נחסוך כסף ביחד
          </h1>
          <div className="absolute -top-2 -right-4 animate-bounce-gentle">
            <Sparkles className="h-6 w-6 text-primary/60" />
          </div>
          <div className="absolute -bottom-2 -left-4 animate-bounce-gentle delay-1000">
            <Star className="h-5 w-5 text-primary/40" />
          </div>
        </div>
        
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          הזינו פרטים ידנית כדי לקבל השוואת מחירים מדויקת ולגלות כמה תוכלו לחסוך
        </p>

        {/* Real-Time Savings Display */}
        {totalPotentialSavings > 0 && (
          <div className="relative overflow-hidden rounded-3xl shadow-elegant animate-scale-in">
            <div className="absolute inset-0 gradient-success opacity-90"></div>
            <div className="absolute inset-0">
              <div className="absolute top-4 right-6 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-6 w-10 h-10 bg-white/10 rounded-full animate-pulse delay-500"></div>
            </div>
            <div className="relative p-6 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <PiggyBank className="h-6 w-6 animate-pulse" />
                <h3 className="text-lg font-bold">חיסכון צפוי</h3>
              </div>
              <div className="text-3xl font-black">
                {formatCurrency(animatedSavings)} בחודש
              </div>
              <div className="text-sm text-white/80 mt-1">
                {formatCurrency(animatedSavings * 12)} בשנה
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Interactive Input Section */}
      <Card className="shadow-elegant border-0 overflow-hidden">
        <div className="absolute inset-0 gradient-card opacity-5"></div>
        <CardHeader className="relative text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">בחרו תחומים לניתוח</CardTitle>
            <Target className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">לחצו על הקטגוריות שתרצו לבדוק והזינו פרטים</p>
          
          {/* Progress Indicator */}
          <div className="mt-4 flex justify-center">
            <div className="flex gap-2">
              {Object.entries(categoryData).map(([key, data]) => (
                <div 
                  key={key}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    data.isActive && data.monthlyAmount && parseFloat(data.monthlyAmount) > 0
                      ? 'bg-success shadow-glow' 
                      : data.isActive 
                        ? 'bg-primary/50' 
                        : 'bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="grid gap-8">
            {Object.entries(categoryData).map(([key, data], index) => {
              const CategoryIcon = categoryIcons[data.category];
              const providers = getProvidersByCategory(data.category);
              const gradientClass = categoryColors[data.category];
              const savings = potentialSavings[key] || 0;
              
              return (
                <div 
                  key={key} 
                  className={`group relative transition-all duration-500 animate-fade-in`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-elegant ${
                    data.isActive 
                      ? 'ring-2 ring-primary shadow-card scale-[1.02] bg-primary/5' 
                      : 'hover:shadow-card hover:scale-[1.01] cursor-pointer'
                  }`}
                  onClick={() => !data.isActive && onCategoryToggle(key)}
                  >
                    {/* Background Pattern */}
                    <div className={`absolute inset-0 opacity-10 ${gradientClass}`}></div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className={`relative p-4 ${gradientClass} rounded-2xl shadow-colorful transition-transform duration-300 group-hover:scale-110`}>
                            <CategoryIcon className="h-8 w-8 text-white" />
                            {data.isActive && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                                <Star className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold">{categoryNames[data.category]}</CardTitle>
                            <p className="text-muted-foreground text-sm">
                              {categoryDescriptions[data.category]}
                            </p>
                            {data.isActive && savings > 0 && (
                              <Badge variant="secondary" className="mt-2 bg-success/20 text-success font-bold">
                                <TrendingUp className="h-3 w-3 ml-1" />
                                חיסכון של {formatCurrency(savings)} לחודש
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant={data.isActive ? "default" : "outline"}
                          size="lg"
                          className={`transition-all duration-300 ${
                            data.isActive 
                              ? 'gradient-primary text-white shadow-glow' 
                              : 'hover:shadow-card'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCategoryToggle(key);
                          }}
                        >
                          {data.isActive ? (
                            <>
                              <Minus className="h-5 w-5 ml-2" />
                              הסר
                            </>
                          ) : (
                            <>
                              <Plus className="h-5 w-5 ml-2" />
                              הוסף
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {data.isActive && (
                      <CardContent className="space-y-6 animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">ספק נוכחי</Label>
                            <Select 
                              value={data.currentProvider} 
                              onValueChange={(value) => onCategoryDataUpdate(key, 'currentProvider', value)}
                            >
                            <SelectTrigger className="h-12 text-base border-2 hover:border-primary transition-colors bg-background">
                              <SelectValue placeholder="בחרו ספק נוכחי" className="text-foreground" />
                            </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-sm border-2 shadow-xl z-[100] max-h-60 min-w-[200px]">
                                <div className="bg-background/90 backdrop-blur-sm">
                                  {providers.map((provider) => (
                                    <SelectItem 
                                      key={provider.name} 
                                      value={provider.name} 
                                      className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer bg-background/80"
                                    >
                                      <div className="flex items-center gap-3 py-1">
                                        <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                                        <span className="font-medium text-foreground">{provider.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">סכום חודשי (₪)</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="הזינו סכום"
                                value={data.monthlyAmount}
                                onChange={(e) => onCategoryDataUpdate(key, 'monthlyAmount', e.target.value)}
                                className="h-12 text-base pr-10"
                              />
                              <DollarSign className="absolute right-3 top-3 h-6 w-6 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Slider for Amount */}
                        {data.monthlyAmount && parseFloat(data.monthlyAmount) > 0 && (
                          <div className="space-y-4">
                            <Label className="text-sm text-muted-foreground">התאימו את הסכום:</Label>
                            <Slider
                              value={[parseFloat(data.monthlyAmount) || 0]}
                              onValueChange={(values) => onCategoryDataUpdate(key, 'monthlyAmount', values[0].toString())}
                              max={data.category === 'electricity' ? 1000 : 300}
                              min={data.category === 'electricity' ? 100 : 20}
                              step={data.category === 'electricity' ? 10 : 5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{data.category === 'electricity' ? '₪100' : '₪20'}</span>
                              <span>{data.category === 'electricity' ? '₪1000' : '₪300'}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Feedback Card */}
                        {data.monthlyAmount && parseFloat(data.monthlyAmount) > 0 && (
                          <div className="relative overflow-hidden rounded-2xl p-6 border-0">
                            <div className={`absolute inset-0 ${gradientClass} opacity-10`}></div>
                            <div className="relative flex items-center gap-4">
                              <div className={`p-3 ${gradientClass} rounded-xl shadow-colorful`}>
                                <Award className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-lg">
                                  💡 נמצא חיסכון פוטנציאלי!
                                </p>
                                <p className="text-muted-foreground">
                                  נבדוק עבורכם אפשרויות חיסכון לסכום של {formatCurrency(parseFloat(data.monthlyAmount))} בחודש
                                </p>
                                {savings > 0 && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-success" />
                                    <span className="text-success font-bold">
                                      חיסכון אפשרי: {formatCurrency(savings)} לחודש
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Action Section */}
      <div className="text-center space-y-6">
        {getActiveCategoriesCount() > 0 && (
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-base px-6 py-3 shadow-card">
              <Target className="h-4 w-4 ml-2" />
              {getActiveCategoriesCount()} תחומים נבחרו
            </Badge>
            {totalPotentialSavings > 0 && (
              <Badge className="bg-success text-white text-base px-6 py-3 shadow-glow">
                <PiggyBank className="h-4 w-4 ml-2" />
                חיסכון צפוי: {formatCurrency(totalPotentialSavings)}/חודש
              </Badge>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {getActiveCategoriesCount() > 0 && (
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>התקדמות</span>
              <span>{Math.round((Object.values(categoryData).filter(cat => cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0).length / 4) * 100)}%</span>
            </div>
            <Progress 
              value={(Object.values(categoryData).filter(cat => cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0).length / 4) * 100} 
              className="h-3 shadow-card"
            />
          </div>
        )}
        
        <div className="relative">
          <Button 
            size="lg" 
            className={`text-xl px-12 py-8 font-bold transition-all duration-300 ${
              canAnalyze() && !isProcessing
                ? 'gradient-primary text-white shadow-glow hover:shadow-elegant hover:scale-105' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={onAnalyze}
            disabled={!canAnalyze() || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="ml-3 h-6 w-6 animate-spin" />
                מעבד את הנתונים...
              </>
            ) : (
              <>
                <Rocket className="ml-3 h-6 w-6" />
                בואו נמצא חיסכון גדול!
                <Sparkles className="mr-3 h-6 w-6" />
              </>
            )}
          </Button>
          
          {/* Floating elements */}
          {canAnalyze() && !isProcessing && (
            <>
              <div className="absolute -top-2 -right-4 animate-bounce-gentle">
                <Star className="h-5 w-5 text-primary/60" />
              </div>
              <div className="absolute -bottom-2 -left-4 animate-bounce-gentle delay-500">
                <Sparkles className="h-4 w-4 text-primary/40" />
              </div>
            </>
          )}
        </div>

        {!canAnalyze() && getActiveCategoriesCount() > 0 && (
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            הזינו סכומים חודשיים עבור התחומים שבחרתם כדי להמשיך
          </p>
        )}
      </div>
    </div>
  );
};