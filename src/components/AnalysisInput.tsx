import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Minus
} from 'lucide-react';
import { validateImageFile, formatCurrency } from '@/lib/utils';
import { getProvidersByCategory } from '@/data/providers';

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
          console.error('Error processing file:', error);
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
    return activeCategories.length > 0 || uploadedFiles.some(f => f.status === 'completed');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
          בואו נחסוך כסף ביחד
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          העלו חשבונות או הזינו פרטים ידנית כדי לקבל השוואת מחירים מדויקת ולגלות כמה תוכלו לחסוך
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center space-x-2 rtl:space-x-reverse">
            <UploadIcon className="h-4 w-4" />
            <span>העלאת חשבונות</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Calculator className="h-4 w-4" />
            <span>הזנה ידנית</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>העלאת חשבונות</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                    <UploadIcon className="h-8 w-8 text-primary" />
                  </div>
                  {isDragActive ? (
                    <p className="text-lg font-medium text-primary">שחררו הקבצים כאן...</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium">גררו קבצים לכאן או לחצו לבחירה</p>
                      <p className="text-sm text-muted-foreground">
                        תומך ב-PDF, JPG, PNG עד 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h4 className="font-medium">קבצים שהועלו</h4>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center space-x-4 rtl:space-x-reverse p-4 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded">
                        {file.file.type.startsWith('image/') ? (
                          <Image className="h-4 w-4 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                          <div className="flex-1">
                            {file.status === 'uploading' && (
                              <Progress value={file.progress} className="h-2" />
                            )}
                            {file.status === 'processing' && (
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span className="text-xs text-muted-foreground">מעבד...</span>
                              </div>
                            )}
                            {file.status === 'completed' && (
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <CheckCircle2 className="h-3 w-3 text-success" />
                                <span className="text-xs text-success">הושלם</span>
                              </div>
                            )}
                            {file.status === 'error' && (
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <AlertCircle className="h-3 w-3 text-destructive" />
                                <span className="text-xs text-destructive">{file.error || 'שגיאה'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onFileRemove(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
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
                            <div className={`p-3 bg-gradient-to-br ${gradientClass} rounded-lg shadow-lg`}>
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
        </TabsContent>
      </Tabs>

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