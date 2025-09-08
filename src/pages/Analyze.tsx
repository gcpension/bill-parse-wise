import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getCheapestPlan, calculateAnnualSavings, getProvidersByCategory } from '@/data/providers';
import { AnalysisInput } from '@/components/AnalysisInput';
import { ResultsGrid } from '@/components/ResultsGrid';
import { Layout } from '@/components/Layout';
import AllPlans from './AllPlans';
import { googleSheetsService } from '@/lib/googleSheets';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    const activeCategories = Object.values(categoryData).filter(cat => 
      cat.isActive && cat.monthlyAmount && parseFloat(cat.monthlyAmount) > 0
    );

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
          tv_annual_savings: results.find(r => r.category === 'tv')?.annualSavings || undefined,
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

  const analyzeData = (data: { category: 'electricity' | 'cellular' | 'internet' | 'tv', amount: number, provider?: string }) => {
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
          setAnalysisResults(prev => [...prev, { ...analysis, fileId: file.id }]);
          setActiveStep('results');
        }
      }
    });
  }, [uploadedFiles, analysisResults]);

  if (activeStep === 'results') {
    return (
      <AllPlans />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 animate-fade-in">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 gradient-electric rounded-full blur-2xl opacity-15 animate-bounce-gentle" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 gradient-sunset rounded-full blur-3xl opacity-10 animate-pulse" />
      </div>

      <Layout>
        <div className="relative z-10 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <div className="relative inline-block">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-electric-blue bg-clip-text text-transparent animate-shimmer-text bg-300%">
                מנתח חכם לחיסכון
              </h1>
              <div className="absolute -inset-4 gradient-primary opacity-20 blur-xl rounded-full -z-10" />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              בדקו את ההוצאות החודשיות שלכם וגלו כמה תוכלו לחסוך עם הספקים הטובים ביותר במשק הישראלי
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground bg-gradient-to-r from-accent/50 to-primary/10 p-4 rounded-xl border border-primary/20">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>מעודכן בזמן אמת</span>
              <div className="w-1 h-4 bg-border" />
              <span>מאובטח ומוגן</span>
              <div className="w-1 h-4 bg-border" />
              <span>ללא עלות</span>
            </div>
          </div>

          {/* Webhook Configuration Alert */}
          {!isWebhookConfigured && (
            <div className="max-w-4xl mx-auto">
              <Alert className="border-2 border-warning/50 bg-gradient-to-r from-warning/10 to-golden-yellow/10 shadow-colorful">
                <AlertDescription className="text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <span className="text-warning-foreground font-medium">
                      כדי לשלוח נתונים ל-Google Sheets, יש להגדיר Zapier webhook
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-warning/50 hover:bg-warning/10 hover:border-warning"
                      onClick={() => window.open('/integration-test', '_blank')}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                      פתח הגדרות Zapier
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Main Analysis Interface */}
          <div className="max-w-7xl mx-auto">
            <AnalysisInput
              uploadedFiles={uploadedFiles}
              categoryData={categoryData}
              isProcessing={isProcessing}
              onFilesUploaded={handleFilesUploaded}
              onFileRemove={handleFileRemove}
              onCategoryToggle={handleCategoryToggle}
              onCategoryDataUpdate={handleCategoryDataUpdate}
              onAnalyze={handleAnalyzeAll}
            />
          </div>

          {/* Trust Indicators */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 glass rounded-2xl border border-white/20 hover-scale">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">ניתוח חכם</h3>
                <p className="text-muted-foreground text-sm">
                  אלגוריתמים מתקדמים לזיהוי החיסכון הטוב ביותר עבורכם
                </p>
              </div>
              
              <div className="text-center p-6 glass rounded-2xl border border-white/20 hover-scale">
                <div className="w-12 h-12 gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">🔒</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">מאובטח לחלוטין</h3>
                <p className="text-muted-foreground text-sm">
                  הנתונים שלכם מוגנים ברמת אבטחה בנקאית
                </p>
              </div>
              
              <div className="text-center p-6 glass rounded-2xl border border-white/20 hover-scale">
                <div className="w-12 h-12 gradient-electric rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">תוצאות מיידיות</h3>
                <p className="text-muted-foreground text-sm">
                  קבלו המלצות מותאמות אישית תוך שניות
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};