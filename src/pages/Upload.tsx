import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload as UploadIcon, 
  File, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2,
  AlertCircle,
  FileImage,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  FileUploadProgress, 
  ParsedExpense, 
  OCRResult 
} from '@/types';
import { 
  extractTextFromImage, 
  parseExpenseFromText 
} from '@/lib/ocr';
import { validateImageFile, formatCurrency } from '@/lib/utils';

export const Upload = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, FileUploadProgress>>({});
  const [parsedExpenses, setParsedExpenses] = useState<ParsedExpense[]>([]);
  const [ocrResults, setOcrResults] = useState<Record<string, OCRResult>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    
    // Initialize progress
    setUploadProgress(prev => ({
      ...prev,
      [fileId]: {
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }
    }));

    try {
      // Validate file
      if (!validateImageFile(file)) {
        throw new Error('סוג קובץ לא נתמך או קובץ גדול מדי');
      }

      // Update progress
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { ...prev[fileId], progress: 30, status: 'processing' }
      }));

      // Extract text using OCR
      console.log('Starting OCR for file:', file.name);
      const ocrResult = await extractTextFromImage(file);
      console.log('OCR result:', ocrResult);

      setOcrResults(prev => ({
        ...prev,
        [fileId]: ocrResult
      }));

      // Update progress
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { ...prev[fileId], progress: 70 }
      }));

      // Parse expenses from OCR text
      const expenses = parseExpenseFromText(ocrResult.text, file.name, ocrResult);
      console.log('Parsed expenses:', expenses);

      if (expenses.length > 0) {
        setParsedExpenses(prev => [...prev, ...expenses]);
        
        // Update progress - completed
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], progress: 100, status: 'completed' }
        }));

        toast({
          title: 'הקובץ עובד בהצלחה',
          description: `נמצאו ${expenses.length} פריטי עלות בקובץ ${file.name}`,
        });
      } else {
        throw new Error('לא נמצאו נתוני עלויות בקובץ');
      }

    } catch (error) {
      console.error('File processing error:', error);
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { 
          ...prev[fileId], 
          progress: 0, 
          status: 'error',
          error: error instanceof Error ? error.message : 'שגיאה בעיבוד הקובץ'
        }
      }));

      toast({
        title: 'שגיאה בעיבוד הקובץ',
        description: error instanceof Error ? error.message : 'שגיאה לא צפויה',
        variant: 'destructive',
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsProcessing(true);
    
    try {
      // Process files sequentially to avoid overwhelming the browser
      for (const file of acceptedFiles) {
        await processFile(file);
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'מעלה...';
      case 'processing':
        return 'מעבד...';
      case 'completed':
        return 'הושלם';
      case 'error':
        return 'שגיאה';
      default:
        return 'מחכה';
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().includes('.pdf')) {
      return <FileText className="h-8 w-8 text-destructive" />;
    }
    return <FileImage className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">העלאת חשבוניות</h1>
        <p className="text-muted-foreground">
          העלה תמונות או קובצי PDF של חשבוניות לניתוח אוטומטי
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>גרור ושחרר קבצים</CardTitle>
          <CardDescription>
            תומך בתמונות (JPG, PNG) וקובצי PDF עד 10MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary hover:bg-accent/50'
              }
              ${isProcessing ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            
            {isDragActive ? (
              <div>
                <p className="text-lg font-medium">שחרר כדי להעלות</p>
                <p className="text-sm text-muted-foreground">הקבצים יעובדו אוטומטית</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">
                  {isProcessing ? 'מעבד קבצים...' : 'גרור קבצים לכאן או לחץ לבחירה'}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, PDF עד 10MB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>התקדמות העיבוד</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {getFileIcon(progress.fileName)}
                      <span className="font-medium">{progress.fileName}</span>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {getStatusIcon(progress.status)}
                      <Badge variant={progress.status === 'completed' ? 'default' : 'secondary'}>
                        {getStatusText(progress.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  {progress.status !== 'error' && (
                    <Progress value={progress.progress} className="h-2" />
                  )}
                  
                  {progress.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{progress.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parsed Results */}
      {parsedExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>תוצאות הניתוח</CardTitle>
            <CardDescription>
              נמצאו {parsedExpenses.length} פריטי עלות
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parsedExpenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: expense.category.color }}
                    />
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {expense.category.nameHebrew} • {expense.fileName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Badge variant="outline">
                      דיוק: {Math.round(expense.confidence * 100)}%
                    </Badge>
                    <div className="text-lg font-bold">
                      {formatCurrency(expense.amount)}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">סה״כ:</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(parsedExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {parsedExpenses.length === 0 && Object.keys(uploadProgress).length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>טיפים לקבלת תוצאות טובות יותר</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">איכות התמונה</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• וודא שהטקסט ברור וקריא</li>
                  <li>• הימנע מתמונות מטושטשות</li>
                  <li>• השתמש בתאורה טובה</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">סוגי קבצים נתמכים</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• חשבוניות חשמל, מים, גז</li>
                  <li>• חשבונות טלפון ואינטרנט</li>
                  <li>• חשבונות טלוויזיה בכבלים</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};