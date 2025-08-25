import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Plus,
  Minus,
  Tv
} from 'lucide-react';
import { validateImageFile, formatCurrency } from '@/lib/utils';
import { handleError } from '@/lib/errorHandler';
import { getProvidersByCategory } from '@/data/providers';

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
  
  const processFile = async (file: File): Promise<UploadedFile> => {
    const id = Math.random().toString(36).substr(2, 9);
    
    const newFile: UploadedFile = {
      file,
      id,
      status: 'uploading',
      progress: 0
    };

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

    // Simulate progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return {
      ...newFile,
      status: 'completed',
      progress: 100,
      ocrText: randomResult.ocrText,
      parsedData: randomResult
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const processedFiles: UploadedFile[] = [];
    
    for (const file of acceptedFiles) {
      if (validateImageFile(file)) {
        try {
          const processedFile = await processFile(file);
          processedFiles.push(processedFile);
        } catch (error) {
          handleError(error, 'File processing');
        }
      }
    }
    
    onFilesUploaded([...uploadedFiles, ...processedFiles]);
  }, [uploadedFiles, onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true
  });

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
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
          בואו נחסוך כסף ביחד
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          הזינו פרטים ידנית כדי לקבל השוואת מחירים מדויקת ולגלות כמה תוכלו לחסוך
        </p>
      </div>

      {/* Manual Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>בחרו תחומים לניתוח</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {Object.entries(categoryData).map(([key, data]) => {
              const CategoryIcon = categoryIcons[data.category];
              const providers = getProvidersByCategory(data.category);
              const gradientClass = categoryColors[data.category];
              
              return (
                <Card key={key} className={`transition-all duration-300 ${
                  data.isActive ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className={`p-3 ${gradientClass} rounded-lg shadow-elegant`}>
                          <CategoryIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{categoryNames[data.category]}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {data.isActive ? 'נבחר לניתוח' : 'לחצו להוספה'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={data.isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => onCategoryToggle(key)}
                      >
                        {data.isActive ? <Minus className="h-4 w-4 ml-2" /> : <Plus className="h-4 w-4 ml-2" />}
                        {data.isActive ? 'הסר' : 'הוסף'}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {data.isActive && (
                    <CardContent className="space-y-4 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ספק נוכחי</Label>
                          <Select 
                            value={data.currentProvider} 
                            onValueChange={(value) => onCategoryDataUpdate(key, 'currentProvider', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="בחרו ספק נוכחי" />
                            </SelectTrigger>
                            <SelectContent>
                              {providers.map((provider) => (
                                <SelectItem key={provider.name} value={provider.name}>
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>סכום חודשי (₪)</Label>
                          <Input
                            type="number"
                            placeholder="הזינו סכום"
                            value={data.monthlyAmount}
                            onChange={(e) => onCategoryDataUpdate(key, 'monthlyAmount', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {data.monthlyAmount && parseFloat(data.monthlyAmount) > 0 && (
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <p className="text-sm font-medium text-primary">
                            💡 נבדוק עבורכם אפשרויות חיסכון לסכום של {formatCurrency(parseFloat(data.monthlyAmount))} בחודש
                          </p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center space-y-4">
        {getActiveCategoriesCount() > 0 && (
          <Badge variant="secondary" className="text-sm px-4 py-2">
            {getActiveCategoriesCount()} תחומים נבחרו לניתוח
          </Badge>
        )}
        
        <Button 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={onAnalyze}
          disabled={!canAnalyze() || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              מעבד...
            </>
          ) : (
            <>
              <Calculator className="ml-2 h-5 w-5" />
              בואו נמצא חיסכון!
            </>
          )}
        </Button>
      </div>
    </div>
  );
};