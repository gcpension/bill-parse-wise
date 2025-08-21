import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

export const LegalNotice = () => {
  return (
    <Card className="border-warning/20 bg-warning/5 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-warning-foreground">
          <Shield className="h-5 w-5 animate-scale-in" />
          <span>הודעה חשובה - מידע משפטי</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="bg-white/50 p-4 rounded-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h4 className="font-medium mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 ml-2 text-warning" />
            הגבלת אחריות
          </h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>• המערכת מספקת מידע למטרות השוואה בלבד</li>
            <li>• אין אחריות למחירים הסופיים שיוצעו על ידי הספקים</li>
            <li>• הלקוח אחראי לאימות כל הפרטים עם הספק החדש</li>
          </ul>
        </div>
        
        <div className="bg-white/50 p-4 rounded-lg animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h4 className="font-medium mb-2">המלצות חשובות:</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>• קרא בעיון את כל החוזים לפני החתימה</li>
            <li>• וודא שאין דמי ביטול בחוזה הנוכחי</li>
            <li>• שמור תיעוד של כל השיחות והתכתובות</li>
            <li>• התייעץ עם יועץ משפטי במקרה של ספק</li>
          </ul>
        </div>
        
        <div className="text-center pt-4 border-t animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-xs text-muted-foreground">
            המידע עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')} |{' '}
            <a 
              href="mailto:support@savings-platform.co.il" 
              className="text-primary hover:underline hover-scale inline-block"
            >
              תמיכה טכנית
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};