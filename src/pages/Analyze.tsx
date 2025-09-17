import { useState, useEffect } from 'react';
import { getCheapestPlan, calculateAnnualSavings, getProvidersByCategory } from '@/data/providers';
import { AnalysisInput } from '@/components/AnalysisInput';
import { SimpleResults } from '@/components/SimpleResults';
import { Layout } from '@/components/Layout';
import { googleSheetsService } from '@/lib/googleSheets';
import { toast } from 'sonner';
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
interface AnalysisResult {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentAmount: number;
  currentProvider: string;
  recommendedPlan: any;
  monthlySavings: number;
  annualSavings: number;
  allProviders: any[];
  fileId?: string;
}
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
export const Analyze = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [categoryData, setCategoryData] = useState<Record<string, CategoryData>>(initialCategoryData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [activeStep, setActiveStep] = useState<'input' | 'results'>('input');
  const [isWebhookConfigured, setIsWebhookConfigured] = useState<boolean>(() => {
    const url = googleSheetsService.getWebhookUrl();
    return !!(url && googleSheetsService.isValidZapierWebhook(url));
  });
  const handleFilesUploaded = (newFiles: UploadedFile[]) => {
    setUploadedFiles(newFiles);
  };
  const handleFileRemove = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };
  const handleCategoryToggle = (category: string) => {
    setCategoryData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        isActive: !prev[category].isActive
      }
    }));
  };
  const handleCategoryDataUpdate = (category: string, field: string, value: string) => {
    setCategoryData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };
  const handleAnalyzeAll = async () => {
    const activeCategories = Object.values(categoryData).filter(cat => cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0);
    if (activeCategories.length === 0) {
      toast.error('יש להזין נתונים לפחות בקטגוריה אחת');
      return;
    }
    setIsProcessing(true);
    try {
      const results: AnalysisResult[] = [];

      // Analyze each active category
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

      // Submit comprehensive analysis data to Google Sheets and webhooks
      if (results.length > 0) {
        const activeCategoryNames = activeCategories.map(cat => categoryNames[cat.category]);

        // Build comprehensive analysis payload
        const analysisPayload = {
          // Meta information
          flow: 'analyze_start_comparison',
          source_page: '/analyze',
          triggered_from: window.location.origin,
          timestamp: new Date().toISOString(),
          active_categories: activeCategoryNames,
          // Calculate totals
          total_monthly_amount: activeCategories.reduce((sum, cat) => sum + parseFloat(cat.monthlyAmount), 0),
          total_monthly_savings: results.reduce((sum, r) => sum + r.monthlySavings, 0),
          total_annual_savings: results.reduce((sum, r) => sum + r.annualSavings, 0),
          // Per-category data
          electricity_active: categoryData.electricity?.isActive || false,
          electricity_current_provider: categoryData.electricity?.currentProvider || undefined,
          electricity_monthly_amount: categoryData.electricity?.monthlyAmount ? parseFloat(categoryData.electricity.monthlyAmount) : undefined,
          electricity_account_details: categoryData.electricity?.accountDetails || undefined,
          electricity_recommended_plan_name: results.find(r => r.category === 'electricity')?.recommendedPlan.name || undefined,
          electricity_recommended_price: results.find(r => r.category === 'electricity')?.recommendedPlan.price || undefined,
          electricity_monthly_savings: results.find(r => r.category === 'electricity')?.monthlySavings || undefined,
          electricity_annual_savings: results.find(r => r.category === 'electricity')?.annualSavings || undefined,
          internet_active: categoryData.internet?.isActive || false,
          internet_current_provider: categoryData.internet?.currentProvider || undefined,
          internet_monthly_amount: categoryData.internet?.monthlyAmount ? parseFloat(categoryData.internet.monthlyAmount) : undefined,
          internet_account_details: categoryData.internet?.accountDetails || undefined,
          internet_recommended_plan_name: results.find(r => r.category === 'internet')?.recommendedPlan.name || undefined,
          internet_recommended_price: results.find(r => r.category === 'internet')?.recommendedPlan.price || undefined,
          internet_monthly_savings: results.find(r => r.category === 'internet')?.monthlySavings || undefined,
          internet_annual_savings: results.find(r => r.category === 'internet')?.annualSavings || undefined,
          cellular_active: categoryData.cellular?.isActive || false,
          cellular_current_provider: categoryData.cellular?.currentProvider || undefined,
          cellular_monthly_amount: categoryData.cellular?.monthlyAmount ? parseFloat(categoryData.cellular.monthlyAmount) : undefined,
          cellular_account_details: categoryData.cellular?.accountDetails || undefined,
          cellular_recommended_plan_name: results.find(r => r.category === 'cellular')?.recommendedPlan.name || undefined,
          cellular_recommended_price: results.find(r => r.category === 'cellular')?.recommendedPlan.price || undefined,
          cellular_monthly_savings: results.find(r => r.category === 'cellular')?.monthlySavings || undefined,
          cellular_annual_savings: results.find(r => r.category === 'cellular')?.annualSavings || undefined,
          tv_active: categoryData.tv?.isActive || false,
          tv_current_provider: categoryData.tv?.currentProvider || undefined,
          tv_monthly_amount: categoryData.tv?.monthlyAmount ? parseFloat(categoryData.tv.monthlyAmount) : undefined,
          tv_account_details: categoryData.tv?.accountDetails || undefined,
          tv_recommended_plan_name: results.find(r => r.category === 'tv')?.recommendedPlan.name || undefined,
          tv_recommended_price: results.find(r => r.category === 'tv')?.recommendedPlan.price || undefined,
          tv_monthly_savings: results.find(r => r.category === 'tv')?.monthlySavings || undefined,
          tv_annual_savings: results.find(r => r.category === 'tv')?.annualSavings || undefined
        };

        // Send comprehensive analysis data to both Google Sheets and additional webhook
        const success = await googleSheetsService.submitAnalysisData(analysisPayload);
        if (success) {
          toast.success('הנתונים נותחו ונשלחו בהצלחה! מעבר לתוצאות...');
        } else {
          toast.warning('הנתונים נותחו בהצלחה, אך לא נשלחו ל-webhooks - בדקו את הגדרות ה-webhook');
        }
      }

      // Continue to results step after a brief delay
      setTimeout(() => {
        setActiveStep('results');
      }, 1500);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('שגיאה בניתוח הנתונים');
    } finally {
      setIsProcessing(false);
    }
  };
  const categoryNames = {
    electricity: 'חשמל',
    cellular: 'סלולר',
    internet: 'אינטרנט',
    tv: 'טלוויזיה'
  };
  const analyzeData = (data: {
    category: 'electricity' | 'cellular' | 'internet' | 'tv';
    amount: number;
    provider?: string;
  }) => {
    const cheapestPlan = getCheapestPlan(data.category);
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
      allProviders: getProvidersByCategory(data.category)
    };
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
          setAnalysisResults(prev => [...prev, {
            ...analysis,
            fileId: file.id
          }]);
          setActiveStep('results');
        }
      }
    });
  }, [uploadedFiles, analysisResults]);

  const handleBackToInput = () => {
    setActiveStep('input');
    setAnalysisResults([]);
  };

  if (activeStep === 'results') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-6">
          <SimpleResults results={analysisResults} onBackToInput={handleBackToInput} />
        </div>
      </Layout>
    );
  }
  return <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 animate-fade-in">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 gradient-electric rounded-full blur-2xl opacity-15 animate-bounce-gentle" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 gradient-sunset rounded-full blur-3xl opacity-10 animate-pulse" />
      </div>

      <Layout>
        <div className="relative z-10 space-y-8">
          {/* Enhanced Hero Section */}
          <div className="text-center space-y-8 py-16">
            <div className="relative inline-block">
              <div className="absolute -inset-12 bg-gradient-to-r from-primary/15 via-success/10 to-blue-500/15 rounded-full blur-3xl animate-pulse" />
              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-success/10 to-blue-500/10 rounded-full border border-primary/20 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <span className="text-sm font-bold bg-gradient-to-r from-primary via-success to-blue-600 bg-clip-text text-transparent">
                    חיסכון מבטיח תוך 3 דקות
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary via-success to-blue-600 bg-clip-text text-transparent leading-tight">
                  תגלו כמה כסף
                  <br />
                  <span className="relative">
                    אתם מבזבזים מדי חודש
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 rounded-full animate-pulse" />
                  </span>
                </h1>
                <div className="text-2xl font-bold text-muted-foreground">
                  והתחילו לחסוך 
                  <span className="text-success font-black"> עכשיו!</span>
                </div>
              </div>
            </div>
            
            

            {/* Enhanced Process Steps */}
            <div className="flex justify-center items-center gap-8 mt-12">
              <div className="group text-center cursor-pointer">
                <div className="relative mb-3">
                  <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                </div>
                <p className="text-sm font-bold text-primary group-hover:text-primary-glow transition-colors">הכניסו נתונים</p>
                <p className="text-xs text-muted-foreground">פרטי החשבונות</p>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-1 bg-gradient-to-r from-primary/50 to-primary-glow/50 rounded-full animate-pulse" />
                <div className="text-primary mx-2">⚡</div>
                <div className="w-12 h-1 bg-gradient-to-r from-primary-glow/50 to-success/50 rounded-full animate-pulse" />
              </div>
              
              <div className="group text-center cursor-pointer">
                <div className="relative mb-3">
                  <div className="absolute -inset-2 bg-gradient-to-br from-success/30 to-success/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary-glow to-success rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                </div>
                <p className="text-sm font-bold text-success group-hover:text-success/80 transition-colors">קבלו תוצאות</p>
                <p className="text-xs text-muted-foreground">השוואה מיידית</p>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-1 bg-gradient-to-r from-success/50 to-blue-500/50 rounded-full animate-pulse" />
                <div className="text-success mx-2">💰</div>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500/50 to-green-500/50 rounded-full animate-pulse" />
              </div>
              
              <div className="group text-center cursor-pointer">
                <div className="relative mb-3">
                  <div className="absolute -inset-2 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                </div>
                <p className="text-sm font-bold text-green-600 group-hover:text-green-500 transition-colors">התחילו לחסוך</p>
                <p className="text-xs text-muted-foreground">החלפה מיידית</p>
              </div>
            </div>
          </div>


          {/* Main Analysis Interface */}
          <div className="max-w-7xl mx-auto">
            <AnalysisInput uploadedFiles={uploadedFiles} categoryData={categoryData} isProcessing={isProcessing} onFilesUploaded={handleFilesUploaded} onFileRemove={handleFileRemove} onCategoryToggle={handleCategoryToggle} onCategoryDataUpdate={handleCategoryDataUpdate} onAnalyze={handleAnalyzeAll} />
          </div>

          {/* Enhanced Value Proposition */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group text-center p-6 bg-white/40 dark:bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">AI</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">ניתוח חכם מתקדם</h3>
                <p className="text-muted-foreground leading-relaxed">
                  אלגוריתמים מתקדמים שמנתחים את השוק בזמן אמת ומוצאים לכם את הדילים הטובים ביותר
                </p>
              </div>
              
              <div className="group text-center p-6 bg-white/40 dark:bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:border-success/50 hover:shadow-xl transition-all duration-300">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-16 h-16 gradient-success rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xl">🔒</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">אבטחה ברמה בנקאית</h3>
                <p className="text-muted-foreground leading-relaxed">
                  הנתונים שלכם מוגנים בהצפנה מתקדמת ולא נשמרים במערכת שלנו
                </p>
              </div>
              
              <div className="group text-center p-6 bg-white/40 dark:bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xl">⚡</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">תוצאות תוך שניות</h3>
                <p className="text-muted-foreground leading-relaxed">
                  השוואה מיידית של כל הספקים עם המלצות מותאמות אישית לצרכים שלכם
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>;
};