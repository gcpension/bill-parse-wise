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
  ArrowRight,
  Eye
} from 'lucide-react';
import { validateImageFile, formatCurrency } from '@/lib/utils';
import { getCheapestPlan, calculateAnnualSavings, getProvidersByCategory } from '@/data/providers';

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

interface ManualData {
  category: 'electricity' | 'cellular' | 'internet' | '';
  currentProvider: string;
  monthlyAmount: string;
  accountDetails?: string;
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

export const Analyze = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [manualData, setManualData] = useState<ManualData>({
    category: '',
    currentProvider: '',
    monthlyAmount: '',
    accountDetails: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);

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

    // Mock parsed results based on filename or random
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

  const handleManualSubmit = () => {
    if (!manualData.category || !manualData.monthlyAmount) return;

    const amount = parseFloat(manualData.monthlyAmount);
    if (isNaN(amount)) return;

    const result = {
      category: manualData.category,
      currentAmount: amount,
      currentProvider: manualData.currentProvider,
      isManual: true
    };

    setAnalysisResults(prev => [...prev, result]);
  };

  const analyzeData = (data: { category: 'electricity' | 'cellular' | 'internet', amount: number, provider?: string }) => {
    const cheapestPlan = getCheapestPlan(data.category);
    const providers = getProvidersByCategory(data.category);
    
    if (!cheapestPlan) return null;

    const currentPrice = data.category === 'electricity' ? data.amount / 850 : data.amount; // Convert electricity to per unit
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
      allProviders: providers.slice(0, 3) // Show top 3 alternatives
    };
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
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
        }
      }
    });
  }, [uploadedFiles]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
          נתח את ההוצאות שלך
        </h1>
        <p className="text-muted-foreground text-lg">
          העלה חשבונית או הזן נתונים ידנית ותקבל המלצות מיידיות לחיסכון
        </p>
      </div>

      {/* Input Methods */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="text-base">
            <UploadIcon className="ml-2 h-4 w-4" />
            העלאת חשבונית
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-base">
            <Calculator className="ml-2 h-4 w-4" />
            הזנה ידנית
          </TabsTrigger>
        </TabsList>

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
                  <div className="mx-auto w-16 h-16 gradient-primary rounded-full flex items-center justify-center shadow-elegant">
                    <UploadIcon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  
                  {isDragActive ? (
                    <div>
                      <h3 className="text-xl font-semibold text-primary">שחרר כדי להעלות</h3>
                      <p className="text-muted-foreground">הקבצים שלך מוכנים להעלאה</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold">גרור חשבוניות לכאן או לחץ להעלאה</h3>
                      <p className="text-muted-foreground">
                        תמיכה ב-PDF, JPG, PNG עד 10MB | המערכת תזהה אוטומטically את הנתונים
                      </p>
                    </div>
                  )}

                  <Button variant="outline" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        מעבד קבצים...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="ml-2 h-4 w-4" />
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

        {/* Manual Tab */}
        <TabsContent value="manual" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>הזן נתונים ידנית</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">קטגוריה</Label>
                  <Select 
                    value={manualData.category} 
                    onValueChange={(value: any) => setManualData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">חשמל</SelectItem>
                      <SelectItem value="cellular">סלולר</SelectItem>
                      <SelectItem value="internet">אינטרנט</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">ספק נוכחי</Label>
                  <Input
                    id="provider"
                    placeholder="לדוגמא: חברת החשמל, פלפון, בזק"
                    value={manualData.currentProvider}
                    onChange={(e) => setManualData(prev => ({ ...prev, currentProvider: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">סכום חודשי (₪)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="הזן סכום"
                    value={manualData.monthlyAmount}
                    onChange={(e) => setManualData(prev => ({ ...prev, monthlyAmount: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">פרטים נוספים (אופציונלי)</Label>
                  <Input
                    id="details"
                    placeholder="לדוגמא: מספר לקוח, חבילה נוכחית"
                    value={manualData.accountDetails}
                    onChange={(e) => setManualData(prev => ({ ...prev, accountDetails: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleManualSubmit} 
                className="w-full"
                disabled={!manualData.category || !manualData.monthlyAmount}
              >
                <Calculator className="ml-2 h-4 w-4" />
                חשב חיסכון
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">תוצאות הניתוח</h2>
          
          {analysisResults.map((result, index) => {
            const CategoryIcon = categoryIcons[result.category];
            
            return (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3 rtl:space-x-reverse">
                      <CategoryIcon className="h-6 w-6 text-primary" />
                      <span>{categoryNames[result.category]}</span>
                    </CardTitle>
                    {result.monthlySavings > 0 && (
                      <Badge className="bg-success text-success-foreground">
                        חיסכון: {formatCurrency(result.monthlySavings)}/חודש
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current vs Recommended */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold mb-2">המצב הנוכחי</h4>
                      <p className="text-muted-foreground">ספק: {result.currentProvider}</p>
                      <p className="text-2xl font-bold text-destructive">
                        {formatCurrency(result.currentAmount)}/חודש
                      </p>
                    </div>
                    
                    {result.recommendedPlan && (
                      <div className="p-4 border border-success rounded-lg bg-success/5">
                        <h4 className="font-semibold mb-2">המלצה לחיסכון</h4>
                        <p className="text-muted-foreground">
                          {result.recommendedPlan.providerName} - {result.recommendedPlan.name}
                        </p>
                        <p className="text-2xl font-bold text-success">
                          {formatCurrency(result.recommendedPlan.price)}/חודש
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Savings Summary */}
                  {result.monthlySavings > 0 && (
                    <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-6">
                      <div className="grid md:grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-success font-semibold">חיסכון חודשי</p>
                          <p className="text-3xl font-bold text-success">
                            {formatCurrency(result.monthlySavings)}
                          </p>
                        </div>
                        <div>
                          <p className="text-success font-semibold">חיסכון שנתי</p>
                          <p className="text-3xl font-bold text-success">
                            {formatCurrency(result.annualSavings)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1">
                      <ArrowRight className="ml-2 h-4 w-4" />
                      עבור לספק החדש
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Eye className="ml-2 h-4 w-4" />
                      ראה עוד אפשרויות
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>טיפים לחיסכון מקסימלי</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">חשמל</h4>
                  <p className="text-sm text-muted-foreground">
                    רפורמת החשמל מאפשרת חיסכון של עד 20%. בדוק הנחות לצרכנים חדשים.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">סלולר</h4>
                  <p className="text-sm text-muted-foreground">
                    חברות וירטואליות כמו רמי לוי מציעות חבילות זולות יותר ב-50%.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wifi className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">אינטרנט</h4>
                  <p className="text-sm text-muted-foreground">
                    חבילות קומבו (אינטרנט + טלוויזיה) לעיתים זולות יותר מחבילות נפרדות.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">משא ומתן</h4>
                  <p className="text-sm text-muted-foreground">
                    השתמש בהמלצות שלנו כדי לנהל משא ומתן עם הספק הנוכחי.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};