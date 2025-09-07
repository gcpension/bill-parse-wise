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
    <Layout>
      {!isWebhookConfigured && (
        <div className="max-w-3xl mx-auto mb-4">
          <Alert>
            <AlertDescription>
              כדי לשלוח נתונים ל-Google Sheets, יש להגדיר Zapier webhook. ניתן לבצע זאת בעמוד הבדיקה.
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => window.open('/integration-test', '_blank')}
              >
                פתח הגדרות Zapier
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
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
    </Layout>
  );
};