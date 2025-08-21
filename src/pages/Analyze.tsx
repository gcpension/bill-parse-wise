import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getCheapestPlan, calculateAnnualSavings } from '@/data/providers';
import { AnalysisInput } from '@/components/AnalysisInput';
import { ResultsSummary } from '@/components/ResultsSummary';
import { ResultCard } from '@/components/ResultCard';

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
      allProviders: []
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
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

          {/* Total Savings Summary */}
          <ResultsSummary results={analysisResults} />

          {/* Individual Results */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">פירוט לפי תחום</h2>
            {analysisResults.map((result, index) => (
              <ResultCard key={index} result={result} index={index} />
            ))}
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-br from-primary/5 to-primary-glow/5 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">הצעדים הבאים</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">איך לעבור לספק חדש:</h4>
                <ol className="space-y-2 text-sm">
                   <li className="flex items-center space-x-2 rtl:space-x-reverse">
                     <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                     <span>בחרו את הספק והחבילה המתאימים</span>
                   </li>
                   <li className="flex items-center space-x-2 rtl:space-x-reverse">
                     <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                     <span>פנו לספק החדש והירשמו לשירות</span>
                   </li>
                   <li className="flex items-center space-x-2 rtl:space-x-reverse">
                     <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                     <span>הספק החדש יטפל בביטול השירות הקודם</span>
                   </li>
                   <li className="flex items-center space-x-2 rtl:space-x-reverse">
                     <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
                     <span>תתחילו לחסוך כסף מיד!</span>
                   </li>
                </ol>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">טיפים חשובים:</h4>
                <ul className="space-y-2 text-sm">
                   <li className="flex items-start space-x-2 rtl:space-x-reverse">
                     <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                     <span>ודאו שאין דמי ביטול בחוזה הנוכחי</span>
                   </li>
                   <li className="flex items-start space-x-2 rtl:space-x-reverse">
                     <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                     <span>שמרו על רציפות השירות במעבר</span>
                   </li>
                   <li className="flex items-start space-x-2 rtl:space-x-reverse">
                     <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                     <span>קראו בעיון את תנאי החוזה החדש</span>
                   </li>
                   <li className="flex items-start space-x-2 rtl:space-x-reverse">
                     <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                     <span>שמרו על מספרי הטלפון החשובים</span>
                   </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
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
    </div>
  );
};