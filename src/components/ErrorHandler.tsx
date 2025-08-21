import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  MessageCircle, 
  Wifi,
  FileX,
  Camera,
  Upload,
  HelpCircle
} from 'lucide-react';

export type ErrorType = 
  | 'network' 
  | 'file-upload' 
  | 'ocr-failed' 
  | 'invalid-data' 
  | 'server-error' 
  | 'quota-exceeded'
  | 'unknown';

interface ErrorHandlerProps {
  error: Error | null;
  errorType?: ErrorType;
  onRetry?: () => void;
  onReset?: () => void;
  showDetails?: boolean;
}

const errorConfigs = {
  network: {
    icon: Wifi,
    title: 'בעיית חיבור לאינטרנט',
    description: 'לא הצלחנו להתחבר לשרת. בדוק את החיבור שלך ונסה שוב.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    solutions: [
      'בדוק את החיבור לאינטרנט',
      'נסה לרענן את הדף',
      'המתן כמה דקות ונסה שוב'
    ]
  },
  'file-upload': {
    icon: Upload,
    title: 'בעיה בהעלאת הקובץ',
    description: 'לא הצלחנו להעלות את הקובץ. יכול להיות שהוא גדול מדי או פגום.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    solutions: [
      'בדוק שהקובץ קטן מ-10MB',
      'נסה קובץ בפורמט PNG או JPG',
      'צלם תמונה חדשה של החשבונית'
    ]
  },
  'ocr-failed': {
    icon: Camera,
    title: 'לא הצלחנו לקרוא את החשבונית',
    description: 'התמונה לא ברורה מספיק או שהחשבונית לא נתמכת.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    solutions: [
      'צלם את החשבונית באור טוב יותר',
      'וודא שהטקסט ברור וקריא',
      'נסה להזין את הנתונים ידנית'
    ]
  },
  'invalid-data': {
    icon: FileX,
    title: 'נתונים לא תקינים',
    description: 'הנתונים שהוזנו אינם תקינים או חסרים.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    solutions: [
      'בדוק שכל השדות מולאו',
      'וודא שהסכומים נכונים',
      'נסה להתחיל מחדש'
    ]
  },
  'server-error': {
    icon: AlertTriangle,
    title: 'שגיאת שרת',
    description: 'אירעה בעיה בשרת שלנו. אנחנו עובדים על פתרון.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    solutions: [
      'נסה שוב בעוד כמה דקות',
      'פנה לתמיכה אם הבעיה נמשכת',
      'שמור את הנתונים ונסה מאוחר יותר'
    ]
  },
  'quota-exceeded': {
    icon: AlertTriangle,
    title: 'עברת את המכסה היומית',
    description: 'השתמשת במקסימום הניתוחים המותרים להיום.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    solutions: [
      'חזור מחר לניתוחים נוספים',
      'פנה לתמיכה לקבלת מכסה נוספת',
      'השתמש בהשוואה הידנית'
    ]
  },
  unknown: {
    icon: HelpCircle,
    title: 'אירעה שגיאה לא צפויה',
    description: 'משהו השתבש. אנחנו עובדים על זה.',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    solutions: [
      'נסה לרענן את הדף',
      'נסה שוב בעוד כמה דקות',
      'פנה לתמיכה אם הבעיה נמשכת'
    ]
  }
};

export const ErrorHandler = ({ 
  error, 
  errorType = 'unknown', 
  onRetry, 
  onReset, 
  showDetails = false 
}: ErrorHandlerProps) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const config = errorConfigs[errorType];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className={`max-w-md w-full ${config.bgColor} ${config.borderColor} border-2`}>
        <CardHeader className="text-center">
          <div className={`mx-auto p-4 rounded-full bg-white shadow-lg w-fit mb-4`}>
            <Icon className={`h-8 w-8 ${config.color}`} />
          </div>
          <CardTitle className="text-xl">{config.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            {config.description}
          </p>

          {/* Solutions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">💡 מה אפשר לנסות:</h4>
            <ul className="space-y-2">
              {config.solutions.map((solution, index) => (
                <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="ml-2 h-4 w-4" />
                נסה שוב
              </Button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {onReset && (
                <Button variant="outline" onClick={onReset}>
                  <Home className="ml-2 h-4 w-4" />
                  התחל מחדש
                </Button>
              )}
              
              <Button variant="outline" asChild>
                <a href="/help">
                  <MessageCircle className="ml-2 h-4 w-4" />
                  עזרה
                </a>
              </Button>
            </div>
          </div>

          {/* Error Details (for debugging) */}
          {showDetails && error && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="text-xs"
              >
                פרטים טכניים {showErrorDetails ? '▲' : '▼'}
              </Button>
              
              {showErrorDetails && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-mono">
                    {error.message}
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer">Stack trace</summary>
                        <pre className="mt-1 text-xs overflow-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div className="text-center text-xs text-muted-foreground bg-white/50 rounded-lg p-3">
            <p>עדיין נתקל בבעיות?</p>
            <p className="mt-1">
              צור קשר: <strong>03-123-4567</strong> או{' '}
              <strong>support@savings.co.il</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};