import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Upload as UploadIcon, 
  FileText, 
  Image, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  X,
  Zap,
  Wifi,
  Smartphone,
  Calculator,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Eye,
  Plus,
  Minus,
  DollarSign,
  Target,
  Award,
  Lightbulb,
  PiggyBank
} from 'lucide-react';
import { validateImageFile, formatCurrency } from '@/lib/utils';
import { getCheapestPlan, calculateAnnualSavings, getProvidersByCategory } from '@/data/providers';
import { ProviderSwitchForm } from '@/components/ProviderSwitchForm';
import { DocumentTemplates } from '@/components/DocumentTemplates';
import { PlanSelector } from '@/components/PlanSelector';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  ocrText?: string;
  parsedData?: {
    category: 'electricity' | 'cellular' | 'internet';
    amount: number;
    date: string;
    provider?: string;
    accountNumber?: string;
  };
  error?: string;
}

interface CategoryData {
  category: 'electricity' | 'cellular' | 'internet';
  currentProvider: string;
  monthlyAmount: string;
  accountDetails?: string;
  isActive: boolean;
}

interface AnalysisResult {
  category: 'electricity' | 'cellular' | 'internet';
  currentAmount: number;
  currentProvider: string;
  recommendedPlan: any;
  monthlySavings: number;
  annualSavings: number;
  allProviders: any[];
  fileId?: string;
}

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi
};

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט'
};

const categoryColors = {
  electricity: 'from-yellow-500 to-orange-500',
  cellular: 'from-blue-500 to-purple-500',
  internet: 'from-green-500 to-teal-500'
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
  }
};

export const Analyze = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [categoryData, setCategoryData] = useState<Record<string, CategoryData>>(initialCategoryData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [activeStep, setActiveStep] = useState<'input' | 'results'>('input');

  // Mock OCR processing
  const processFile = async (file: File): Promise<UploadedFile> => {
    const id = Math.random().toString(36).substr(2, 9);
    
    const newFile: UploadedFile = {
      file,
      id,
      status: 'uploading',
      progress: 0
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedFiles(prev => prev.map(f => 
        f.id === id ? { ...f, progress: i } : f
      ));
    }

    // Start OCR processing
    setUploadedFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'processing' } : f
    ));

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock parsed results
    const mockResults = [
      {
        category: 'electricity' as const,
        amount: 420,
        date: '2024-01-15',
        provider: 'חברת החשמל לישראל',
        accountNumber: '123456789',
        ocrText: 'חברת החשמל לישראל בע"מ\nמספר לקוח: 123456789\nתאריך: 15/01/2024\nסכום לתשלום: 420.00 ₪\nצריכה: 850 קוט"ש\nתעריף: 0.49 ₪ לקוט"ש'
      },
      {
        category: 'cellular' as const,
        amount: 95,
        date: '2024-01-10',
        provider: 'פלפון',
        accountNumber: '987654321',
        ocrText: 'פלפון בע"מ\nמספר מנוי: 987654321\nתאריך: 10/01/2024\nסכום לתשלום: 95.00 ₪\nחבילה: אינטרנט בלתי מוגבל\nשיחות: בלתי מוגבל'
      },
      {
        category: 'internet' as const,
        amount: 129,
        date: '2024-01-08',
        provider: 'בזק',
        accountNumber: '456789123',
        ocrText: 'בזק בע"מ\nמספר חוזה: 456789123\nתאריך: 08/01/2024\nסכום לתשלום: 129.00 ₪\nשירות: אינטרנט 100 מגה\nחבילה: בסיסית'
      }
    ];

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];

    return {
      ...newFile,
      status: 'completed',
      progress: 100,
      ocrText: randomResult.ocrText,
      parsedData: randomResult
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    for (const file of acceptedFiles) {
      if (validateImageFile(file)) {
        try {
          const processedFile = await processFile(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === processedFile.id ? processedFile : f
          ));
        } catch (error) {
          console.error('Error processing file:', error);
          setUploadedFiles(prev => prev.map(f => 
            f.file === file ? { ...f, status: 'error', error: 'שגיאה בעיבוד הקובץ' } : f
          ));
        }
      }
    }
    
    setIsProcessing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true
  });

  const toggleCategory = (category: string) => {
    setCategoryData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        isActive: !prev[category].isActive
      }
    }));
  };

  const updateCategoryData = (category: string, field: string, value: string) => {
    setCategoryData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleAnalyzeAll = () => {
    const activeCategories = Object.values(categoryData).filter(cat => 
      cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0
    );

    if (activeCategories.length === 0) return;

    const results: AnalysisResult[] = [];

    activeCategories.forEach(catData => {
      const amount = parseFloat(catData.monthlyAmount);
      const analysis = analyzeData({
        category: catData.category,
        amount,
        provider: catData.currentProvider
      });

      if (analysis) {
        results.push({
          ...analysis,
          currentProvider: catData.currentProvider || 'לא צוין'
        });
      }
    });

    setAnalysisResults(results);
    setActiveStep('results');
  };

  const analyzeData = (data: { category: 'electricity' | 'cellular' | 'internet', amount: number, provider?: string }) => {
    const cheapestPlan = getCheapestPlan(data.category);
    const providers = getProvidersByCategory(data.category);
    
    if (!cheapestPlan) return null;

    const currentPrice = data.category === 'electricity' ? data.amount / 850 : data.amount;
    const newPrice = cheapestPlan.price;
    const monthlySavings = Math.max(0, currentPrice - newPrice);
    const annualSavings = calculateAnnualSavings(currentPrice, newPrice, data.category);

    return {
      category: data.category,
      currentAmount: data.amount,
      currentProvider: data.provider || 'לא זוהה',
      recommendedPlan: cheapestPlan,
      monthlySavings,
      annualSavings,
      allProviders: providers.slice(0, 3)
    };
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getTotalSavings = () => {
    const monthly = analysisResults.reduce((sum, result) => sum + result.monthlySavings, 0);
    const annual = analysisResults.reduce((sum, result) => sum + result.annualSavings, 0);
    return { monthly, annual };
  };

  const getActiveCategoriesCount = () => {
    return Object.values(categoryData).filter(cat => cat.isActive).length;
  };

  // Auto-analyze completed files
  useEffect(() => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed' && f.parsedData);
    completedFiles.forEach(file => {
      if (file.parsedData && !analysisResults.some(r => r.fileId === file.id)) {
        const analysis = analyzeData({
          category: file.parsedData.category,
          amount: file.parsedData.amount,
          provider: file.parsedData.provider
        });
        
        if (analysis) {
          setAnalysisResults(prev => [...prev, { ...analysis, fileId: file.id }]);
          setActiveStep('results');
        }
      }
    });
  }, [uploadedFiles]);

  if (activeStep === 'results') {
    const totalSavings = getTotalSavings();
    
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
              תוצאות הניתוח
            </h1>
            <p className="text-muted-foreground text-lg">
              הנה כמה תוכל לחסוך על ההוצאות שלך
            </p>
          </div>
          <Button variant="outline" onClick={() => setActiveStep('input')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            נתח עוד
          </Button>
        </div>

        {/* Total Savings Summary - Enhanced */}
        <Card className="shadow-elegant bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/20 animate-scale-in overflow-hidden relative">
          {/* Background Animation */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-success/10 to-transparent rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          
          <CardContent className="p-8 relative">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-success/30 rounded-full blur-2xl scale-125 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-success via-success/90 to-success/70 text-white rounded-full w-28 h-28 mx-auto flex items-center justify-center shadow-2xl">
                  <PiggyBank className="h-14 w-14" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-success">סך הכל חיסכון צפוי</h2>
                <div className="flex justify-center items-baseline space-x-8 rtl:space-x-reverse">
                  <div className="text-center p-6 bg-white/20 backdrop-blur rounded-2xl border border-success/20">
                    <p className="text-5xl font-bold text-success animate-pulse">
                      {formatCurrency(totalSavings.monthly)}
                    </p>
                    <p className="text-lg text-success/80 font-medium">לחודש</p>
                  </div>
                  <div className="text-6xl text-success/30 animate-bounce">🚀</div>
                  <div className="text-center p-6 bg-white/20 backdrop-blur rounded-2xl border border-success/20">
                    <p className="text-5xl font-bold text-success animate-pulse">
                      {formatCurrency(totalSavings.annual)}
                    </p>
                    <p className="text-lg text-success/80 font-medium">לשנה</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur rounded-2xl p-6 border border-success/20">
                <p className="text-xl text-success font-bold">
                  🎉 מזל טוב! תוכל לחסוך עד {formatCurrency(totalSavings.annual)} בשנה הקרובה
                </p>
                <p className="text-success/80 mt-2">
                  זה כמו לקבל {Math.round(totalSavings.annual / 1000)} משכורות נוספות בשנה!
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-primary/20">
                  <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-2">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">תחומים נותחו</h3>
                  <p className="text-2xl font-bold text-primary">
                    {analysisResults.length}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-orange-200">
                  <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-2">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">% חיסכון ממוצע</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {(analysisResults.reduce((sum, r) => sum + (r.monthlySavings / r.currentAmount * 100), 0) / analysisResults.length).toFixed(1)}%
                  </p>
                </div>
                
                <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-purple-200">
                  <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">חיסכון בגיל פרישה</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(totalSavings.annual * 20)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">פירוט לפי תחום</h2>
          
          {analysisResults.map((result, index) => {
            const CategoryIcon = categoryIcons[result.category];
            const gradientClass = categoryColors[result.category];
            const savingsPercentage = ((result.monthlySavings / result.currentAmount) * 100);
            
            return (
              <Card key={index} className="shadow-elegant hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden relative group border-0 ring-1 ring-border/50 hover:ring-primary/50">
                {/* Animated Background Pattern */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${gradientClass} opacity-5 rounded-full -translate-y-32 translate-x-32 group-hover:scale-110 transition-transform duration-700`}></div>
                
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-4 rtl:space-x-reverse text-2xl">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} rounded-xl blur-md scale-110 opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                        <div className={`relative p-4 bg-gradient-to-br ${gradientClass} rounded-xl shadow-xl`}>
                          <CategoryIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{categoryNames[result.category]}</h3>
                        <p className="text-muted-foreground font-normal">
                          ספק נוכחי: {result.currentProvider}
                        </p>
                      </div>
                    </CardTitle>
                    
                    {result.monthlySavings > 0 && (
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className="bg-success text-success-foreground text-lg px-4 py-2 animate-pulse shadow-lg">
                          <TrendingDown className="ml-1 h-4 w-4" />
                          חיסכון: {formatCurrency(result.monthlySavings)}/חודש
                        </Badge>
                        <div className="text-3xl font-bold text-success animate-pulse">
                          -{savingsPercentage.toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Interactive Comparison Dashboard */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 border shadow-2xl">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-200/30 via-primary/10 to-green-200/30 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
                    </div>

                    {/* Header */}
                    <div className="relative p-8 text-center bg-gradient-to-r from-slate-800/5 to-slate-600/5 backdrop-blur border-b">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        השוואת עלויות חכמה
                      </h3>
                      <p className="text-slate-600 text-lg">המצב הנוכחי מול ההמלצה החדשה שלך</p>
                      
                      {/* Animated Separator */}
                      <div className="flex items-center justify-center mt-6 space-x-6 rtl:space-x-reverse">
                        <div className="h-1 bg-gradient-to-r from-transparent via-red-300 to-red-400 rounded-full flex-1 max-w-32"></div>
                        <div className="relative p-3 bg-gradient-to-r from-orange-400 to-green-400 rounded-full shadow-xl animate-bounce">
                          <ArrowRight className="h-6 w-6 text-white" />
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-green-400 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <div className="h-1 bg-gradient-to-r from-green-400 via-green-300 to-transparent rounded-full flex-1 max-w-32"></div>
                      </div>
                    </div>

                    <div className="relative grid lg:grid-cols-2">
                      {/* Current Provider - Enhanced Red Card */}
                      <div className="relative group p-8 bg-gradient-to-br from-red-50 via-rose-50 to-red-100/80 border-r border-slate-200/60">
                        {/* Background Animations */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-rose-400/15 to-transparent rounded-full translate-y-16 -translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        {/* Warning Badge */}
                        <div className="absolute top-6 right-6">
                          <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                            ⚠️ עובר החלפה
                          </div>
                        </div>

                        <div className="relative space-y-8">
                          {/* Icon Section */}
                          <div className="text-center space-y-4">
                            <div className="relative mx-auto w-fit">
                              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-600 rounded-3xl blur-xl scale-125 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                              <div className="relative p-6 bg-gradient-to-br from-red-400 to-rose-600 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                                <DollarSign className="h-12 w-12 text-white" />
                              </div>
                            </div>
                            <h4 className="text-2xl font-bold text-red-700">המצב הנוכחי</h4>
                            <p className="text-red-600 text-sm">💸 יקר מדי - צריך החלפה!</p>
                          </div>

                          {/* Provider Details */}
                          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 shadow-lg">
                            <div className="text-center space-y-3">
                              <p className="text-sm text-red-600 font-medium">הספק הנוכחי שלך</p>
                              <h5 className="text-xl font-bold text-red-800">{result.currentProvider}</h5>
                              <div className="text-xs text-red-500 bg-red-100 px-3 py-1 rounded-full inline-block">
                                זמן לשדרוג! 🔄
                              </div>
                            </div>
                          </div>

                          {/* Current Price Display */}
                          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-red-200/50 shadow-lg">
                            <p className="text-sm text-red-600 font-medium mb-3">התשלום החודשי הנוכחי</p>
                            <div className="relative">
                              <div className="text-6xl font-black text-red-600 group-hover:scale-110 transition-transform duration-500">
                                ₪{result.currentAmount.toLocaleString()}
                              </div>
                              <div className="text-red-500 font-medium mt-2 text-lg">לחודש</div>
                              
                              {/* Expensive indicator */}
                              <div className="absolute -top-4 -left-4 text-3xl animate-bounce">💸</div>
                              <div className="absolute -bottom-2 -right-2 text-2xl animate-pulse">😰</div>
                            </div>
                            <div className="mt-4 text-red-600 text-sm font-medium bg-red-100/50 rounded-lg py-2 px-4">
                              זה הרבה כסף! בואו נחפש פתרון...
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Provider - Enhanced Green Card */}
                      {result.recommendedPlan && (
                        <div className="relative group p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/80">
                          {/* Background Animations */}
                          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -translate-y-20 -translate-x-20 group-hover:scale-125 transition-transform duration-1000"></div>
                          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-green-400/15 to-transparent rounded-full translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
                          
                          {/* Success Badge */}
                          <div className="absolute top-6 left-6">
                            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                              ⭐ החיסכון שלך!
                            </div>
                          </div>

                          <div className="relative space-y-8">
                            {/* Icon Section */}
                            <div className="text-center space-y-4">
                              <div className="relative mx-auto w-fit">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl blur-xl scale-125 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                                <div className="relative p-6 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                                  <Lightbulb className="h-12 w-12 text-white" />
                                </div>
                              </div>
                              <h4 className="text-2xl font-bold text-emerald-700">הפתרון החכם</h4>
                              <p className="text-emerald-600 text-sm">💡 חיסכון מקסימלי מיד!</p>
                            </div>

                            {/* Provider Details */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-lg">
                              <div className="text-center space-y-3">
                                <p className="text-sm text-emerald-600 font-medium">הספק המומלץ החדש</p>
                                <h5 className="text-xl font-bold text-emerald-800">{result.recommendedPlan.providerName}</h5>
                                <div className="space-y-2">
                                  <div className="text-xs text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full inline-block">
                                    {result.recommendedPlan.name}
                                  </div>
                                  <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
                                    מבחירת המומחים 🏆
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* New Price Display */}
                            <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/50 shadow-lg">
                              <p className="text-sm text-emerald-600 font-medium mb-3">התשלום החודשי החדש</p>
                              <div className="relative">
                                <div className="text-6xl font-black text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                                  ₪{result.recommendedPlan.price.toLocaleString()}
                                </div>
                                <div className="text-emerald-500 font-medium mt-2 text-lg">לחודש</div>
                                
                                {/* Success indicators */}
                                <div className="absolute -top-4 -right-4 text-3xl animate-bounce">💚</div>
                                <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">🎉</div>
                              </div>
                              <div className="mt-4 text-emerald-600 text-sm font-medium bg-emerald-100/50 rounded-lg py-2 px-4">
                                המחיר הטוב ביותר עבורך!
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Floating Savings Circle */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow to-success rounded-full animate-ping opacity-30 scale-125"></div>
                          <div className="relative bg-gradient-to-r from-primary via-primary-glow to-success text-white rounded-full p-6 shadow-2xl border-4 border-white animate-pulse">
                            <div className="text-center">
                              <div className="text-xs font-bold">💰 חיסכון</div>
                              <div className="text-xl font-black">₪{result.monthlySavings.toLocaleString()}</div>
                              <div className="text-xs">בחודש</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Summary - Enhanced */}
                    <div className="relative p-8 bg-gradient-to-r from-success/10 via-primary/5 to-success/10 border-t border-slate-200/50">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                          <div className="text-4xl animate-bounce">🎊</div>
                          <h4 className="text-2xl font-bold text-success">
                            מזל טוב! תחסוך {formatCurrency(result.monthlySavings)} בחודש!
                          </h4>
                          <div className="text-4xl animate-bounce delay-300">🎉</div>
                        </div>
                        <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse text-sm">
                          <div className="text-center">
                            <p className="font-bold text-lg text-primary">₪{result.annualSavings.toLocaleString()}</p>
                            <p className="text-muted-foreground">חיסכון שנתי</p>
                          </div>
                          <div className="text-4xl">💎</div>
                          <div className="text-center">
                            <p className="font-bold text-lg text-purple-600">{Math.round(result.annualSavings / 1000)}</p>
                            <p className="text-muted-foreground">משכורות נוספות</p>
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium bg-white/60 rounded-full py-2 px-6 inline-block">
                          זה כמו לקבל בונוס של {formatCurrency(result.annualSavings)} בשנה! 🚀
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Savings Breakdown */}
                  {result.monthlySavings > 0 && (
                    <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-xl p-6">
                      <h4 className="text-lg font-semibold mb-4 text-success">פירוט החיסכון</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">חיסכון חודשי</p>
                          <p className="text-2xl font-bold text-success">
                            {formatCurrency(result.monthlySavings)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">חיסכון שנתי</p>
                          <p className="text-2xl font-bold text-success">
                            {formatCurrency(result.annualSavings)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">אחוז חיסכון</p>
                          <p className="text-2xl font-bold text-success">
                            {((result.monthlySavings / result.currentAmount) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <ProviderSwitchForm
                      category={result.category}
                      currentProvider={result.currentProvider}
                      newProvider={result.recommendedPlan?.providerName || ''}
                      newPlan={result.recommendedPlan?.name || ''}
                      monthlySavings={result.monthlySavings}
                    />
                    <PlanSelector
                      category={result.category}
                      currentAmount={result.currentAmount}
                      onPlanSelect={(provider, plan) => {
                        // Handle plan selection
                        console.log('Selected plan:', plan, 'from provider:', provider);
                      }}
                    />
                  </div>
                  
                  {/* Document Templates Section */}
                  <div className="mt-6">
                    <DocumentTemplates
                      category={result.category}
                      currentProvider={result.currentProvider}
                      newProvider={result.recommendedPlan?.providerName || ''}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Next Steps */}
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-primary-glow/5">
          <CardHeader>
            <CardTitle>הצעדים הבאים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">איך לעבור לספק חדש:</h4>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                    <span>צור קשר עם הספק החדש</span>
                  </li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                    <span>חתום על החוזה החדש</span>
                  </li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                    <span>בטל את השירות הישן</span>
                  </li>
                </ol>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">טיפים חשובים:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>בדוק תקופות מחויבות</span>
                  </li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>שמור על רציפות השירות</span>
                  </li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>תעדכן פרטי חיוב</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
          נתח את ההוצאות שלך
        </h1>
        <p className="text-muted-foreground text-lg">
          העלה חשבוניות או הזן נתונים ידנית ותגלה כמה תוכל לחסוך
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            1
          </div>
          <span className="text-sm font-medium">הזן נתונים</span>
        </div>
        <div className="w-16 h-0.5 bg-border"></div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="text-sm text-muted-foreground">קבל תוצאות</span>
        </div>
      </div>

      {/* Input Methods */}
      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1">
          <TabsTrigger value="manual" className="text-base py-3">
            <Calculator className="ml-2 h-5 w-5" />
            הזנה ידנית מהירה
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-base py-3">
            <UploadIcon className="ml-2 h-5 w-5" />
            העלאת חשבוניות
          </TabsTrigger>
        </TabsList>

        {/* Manual Input Tab */}
        <TabsContent value="manual" className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-xl">בחר את התחומים לניתוח</CardTitle>
              <p className="text-muted-foreground">
                בחר תחום אחד או יותר והזן את הנתונים הנוכחיים שלך
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(categoryNames).map(([key, name]) => {
                  const Icon = categoryIcons[key as keyof typeof categoryIcons];
                  const gradientClass = categoryColors[key as keyof typeof categoryColors];
                  const isActive = categoryData[key].isActive;
                  
                  return (
                    <Card 
                      key={key}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        isActive 
                          ? 'ring-2 ring-primary shadow-glow border-primary' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => toggleCategory(key)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`p-4 bg-gradient-to-br ${gradientClass} rounded-xl w-fit mx-auto mb-4`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{name}</h3>
                        <div className="flex items-center justify-center">
                          {isActive ? (
                            <Badge className="bg-success text-success-foreground">
                              <CheckCircle2 className="ml-1 h-3 w-3" />
                              נבחר
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Plus className="ml-1 h-3 w-3" />
                              בחר
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Active Categories Forms */}
              {Object.values(categoryData).some(cat => cat.isActive) && (
                <div className="space-y-6">
                  <Separator />
                  <h3 className="text-xl font-semibold">פרטי התחומים שנבחרו</h3>
                  
                  <div className="space-y-6">
                    {Object.entries(categoryData)
                      .filter(([_, data]) => data.isActive)
                      .map(([key, data]) => {
                        const Icon = categoryIcons[key as keyof typeof categoryIcons];
                        const name = categoryNames[key as keyof typeof categoryNames];
                        
                        return (
                          <Card key={key} className="shadow-card">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                  <Icon className="h-6 w-6 text-primary" />
                                  <CardTitle className="text-lg">{name}</CardTitle>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCategory(key)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>ספק נוכחי</Label>
                                  <Input
                                    placeholder={`לדוגמא: ${key === 'electricity' ? 'חברת החשמל' : key === 'cellular' ? 'פלפון' : 'בזק'}`}
                                    value={data.currentProvider}
                                    onChange={(e) => updateCategoryData(key, 'currentProvider', e.target.value)}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>סכום חודשי (₪)</Label>
                                  <Input
                                    type="number"
                                    placeholder="הזן סכום"
                                    value={data.monthlyAmount}
                                    onChange={(e) => updateCategoryData(key, 'monthlyAmount', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>פרטים נוספים (אופציונלי)</Label>
                                <Input
                                  placeholder="לדוגמא: מספר לקוח, סוג חבילה"
                                  value={data.accountDetails}
                                  onChange={(e) => updateCategoryData(key, 'accountDetails', e.target.value)}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              {getActiveCategoriesCount() > 0 && (
                <div className="flex justify-center pt-6">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 shadow-elegant animate-pulse-glow"
                    onClick={handleAnalyzeAll}
                    disabled={!Object.values(categoryData).some(cat => 
                      cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0
                    )}
                  >
                    <Calculator className="ml-2 h-5 w-5" />
                    נתח {getActiveCategoriesCount()} תחומים וחשב חיסכון
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
                  ${isDragActive 
                    ? 'border-primary bg-primary/5 shadow-glow' 
                    : 'border-border hover:border-primary hover:bg-accent/20'
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="mx-auto w-20 h-20 gradient-primary rounded-full flex items-center justify-center shadow-elegant">
                    <UploadIcon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  
                  {isDragActive ? (
                    <div>
                      <h3 className="text-2xl font-semibold text-primary">שחרר כדי להעלות</h3>
                      <p className="text-muted-foreground">הקבצים שלך מוכנים להעלאה</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-semibold">גרור חשבוניות לכאן או לחץ להעלאה</h3>
                      <p className="text-muted-foreground">
                        המערכת תזהה אוטומטית את הנתונים מהחשבוניות שלך
                      </p>
                      <p className="text-sm text-muted-foreground">
                        תמיכה ב-PDF, JPG, PNG עד 10MB
                      </p>
                    </div>
                  )}

                  <Button variant="outline" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        מעבד קבצים...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="ml-2 h-5 w-5" />
                        בחר קבצים
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>קבצים שהועלו</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadedFiles.map((uploadedFile) => (
                  <div key={uploadedFile.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="p-2 bg-accent rounded-lg">
                          {uploadedFile.file.type.includes('pdf') ? (
                            <FileText className="h-5 w-5 text-destructive" />
                          ) : (
                            <Image className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{uploadedFile.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(uploadedFile.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {(uploadedFile.status === 'uploading' || uploadedFile.status === 'processing') && (
                      <Progress value={uploadedFile.progress} />
                    )}

                    {uploadedFile.status === 'completed' && uploadedFile.parsedData && (
                      <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            {categoryNames[uploadedFile.parsedData.category]}
                          </Badge>
                          <span className="text-xl font-bold text-success">
                            {formatCurrency(uploadedFile.parsedData.amount)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ספק: {uploadedFile.parsedData.provider}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Benefits Section */}
      <Card className="shadow-card bg-gradient-to-br from-primary/5 to-primary-glow/5">
        <CardHeader>
          <CardTitle>למה כדאי לנתח את ההוצאות?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="p-4 bg-success/20 rounded-full w-fit mx-auto">
                <PiggyBank className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold">חיסכון מיידי</h3>
              <p className="text-sm text-muted-foreground">
                גלה הזדמנויות חיסכון של מאות או אלפי שקלים בשנה
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold">השוואה מדויקת</h3>
              <p className="text-sm text-muted-foreground">
                קבל השוואה מלאה בין כל הספקים בשוק
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold">המלצות אישיות</h3>
              <p className="text-sm text-muted-foreground">
                קבל המלצות מותאמות בדיוק לצרכים שלך
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};