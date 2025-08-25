import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getCheapestPlan, calculateAnnualSavings, getProvidersByCategory } from '@/data/providers';
import { AnalysisInput } from '@/components/AnalysisInput';
import { ResultsGrid } from '@/components/ResultsGrid';
import { Layout } from '@/components/Layout';
import { NewDetailedAnalysisResults } from './NewDetailedAnalysisResults';

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
      <NewDetailedAnalysisResults results={analysisResults} onBackToInput={() => setActiveStep('input')} />
    );
  }

  return (
    <Layout>
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