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
      {/* Compact Header */}
      <div className="text-center space-y-4">
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent animate-fade-in">
            הזינו את הפרטים שלכם
          </h1>
        </div>
        
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          בחרו קטגוריות והזינו פרטים לקבלת השוואת מחירים מדויקת
        </p>
      </div>

      {/* Compact Interactive Input Section */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-primary-glow/3"></div>
        <CardHeader className="relative text-center pb-4">
          <CardTitle className="text-xl font-bold">בחרו קטגוריות לבדיקה</CardTitle>
          <p className="text-muted-foreground text-sm">לחצו והזינו פרטים</p>
          
          {/* Compact Progress Indicator */}
          <div className="mt-3 flex justify-center">
            <div className="flex gap-1">
              {Object.entries(categoryData).map(([key, data]) => (
                <div 
                  key={key}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    data.isActive && data.monthlyAmount && parseFloat(data.monthlyAmount) > 0
                      ? 'bg-success shadow-sm' 
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
          <div className="grid gap-4">
            {Object.entries(categoryData).map(([key, data], index) => {
              const CategoryIcon = categoryIcons[data.category];
              const providers = getProvidersByCategory(data.category);
              const gradientClass = categoryColors[data.category];
              const savings = potentialSavings[key] || 0;
              
              return (
                <div 
                  key={key} 
                  className={`group relative transition-all duration-300 animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                    data.isActive 
                      ? 'ring-1 ring-primary shadow-sm bg-primary/3' 
                      : 'hover:shadow-sm hover:scale-[1.005] cursor-pointer'
                  }`}
                  onClick={() => !data.isActive && onCategoryToggle(key)}
                  >
                    {/* Subtle Background Pattern */}
                    <div className={`absolute inset-0 opacity-5 ${gradientClass}`}></div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className={`relative p-3 ${gradientClass} rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                            <CategoryIcon className="h-6 w-6 text-white" />
                            {data.isActive && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                                <Star className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold">{categoryNames[data.category]}</CardTitle>
                            <p className="text-muted-foreground text-xs">
                              {categoryDescriptions[data.category]}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant={data.isActive ? "default" : "outline"}
                          size="sm"
                          className={`transition-all duration-300 ${
                            data.isActive 
                              ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-sm' 
                              : 'hover:shadow-sm'
                          }`}
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
                      <CardContent className="space-y-4 animate-fade-in pt-2">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">ספק נוכחי</Label>
                            <Select 
                              value={data.currentProvider} 
                              onValueChange={(value) => onCategoryDataUpdate(key, 'currentProvider', value)}
                            >
                              <SelectTrigger className="h-14 text-base border-2 hover:border-primary/50 transition-all duration-300 bg-background shadow-sm">
                                <SelectValue 
                                  placeholder="👆 לחצו כאן לבחירת ספק נוכחי" 
                                  className="text-foreground font-medium"
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-background backdrop-blur-lg border-2 border-primary/20 shadow-2xl z-[100] max-h-64 min-w-[250px]">
                                {providers.length > 0 ? providers.map((provider) => (
                                  <SelectItem 
                                    key={provider.name} 
                                    value={provider.name} 
                                    className="hover:bg-primary/10 focus:bg-primary/15 cursor-pointer py-3 px-4 transition-colors duration-200"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary-glow"></div>
                                      <span className="font-medium text-foreground text-base">{provider.name}</span>
                                    </div>
                                  </SelectItem>
                                )) : (
                                  <SelectItem value="אחר" className="py-3 px-4 text-muted-foreground">
                                    אחר - הזינו שם הספק ידנית
                                  </SelectItem>
                                )}
                                <SelectItem value="אחר" className="py-3 px-4 border-t mt-2 text-primary font-semibold">
                                  + אחר (ספק שלא ברשימה)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">סכום חודשי (₪)</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="הזינו סכום"
                                value={data.monthlyAmount}
                                onChange={(e) => onCategoryDataUpdate(key, 'monthlyAmount', e.target.value)}
                                className="h-12 text-base pr-10"
                              />
                              <DollarSign className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        {/* Compact Feedback */}
                        {data.monthlyAmount && parseFloat(data.monthlyAmount) > 0 && (
                          <div className="relative overflow-hidden rounded-xl p-3 border border-primary/10 bg-primary/5">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 ${gradientClass} rounded-lg`}>
                                <Award className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">
                                  ✓ מוכן לבדיקה - {formatCurrency(parseFloat(data.monthlyAmount))} בחודש
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