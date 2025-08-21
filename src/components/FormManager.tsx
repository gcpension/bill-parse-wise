import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileCheck, 
  Download, 
  History, 
  Shield, 
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormManagerProps {
  category: 'electricity' | 'cellular' | 'internet';
}

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט'
};

const categoryIcons = {
  electricity: '⚡',
  cellular: '📱', 
  internet: '🌐'
};

export const FormManager = ({ category }: FormManagerProps) => {
  const [savedForms, setSavedForms] = useState<any[]>([]);
  const { toast } = useToast();

  // Load saved forms from localStorage
  const loadSavedForms = () => {
    const forms = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`provider-switch-${category}`) || key?.startsWith(`switch-${category}`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          forms.push(data);
        } catch (error) {
          console.error('Error loading form:', error);
        }
      }
    }
    setSavedForms(forms.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  const downloadForm = (formData: any) => {
    try {
      const content = generateFormContent(formData);
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `טופס-מעבר-${categoryNames[category]}-${new Date(formData.timestamp).toLocaleDateString('he-IL')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "הטופס הורד בהצלחה!",
        description: "הטופס נשמר במחשב שלך",
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן להוריד את הטופס כרגע",
        variant: "destructive"
      });
    }
  };

  const generateFormContent = (formData: any) => {
    const timestamp = new Date(formData.timestamp);
    return `טופס מעבר ספק ${categoryNames[category]} - מקורי
=====================================

נוצר: ${timestamp.toLocaleDateString('he-IL')} ${timestamp.toLocaleTimeString('he-IL')}
מזהה: ${formData.submissionId || formData.documentId}

פרטי הלקוח:
שם מלא: ${formData.fullName || formData.personalDetails?.fullName || 'לא צוין'}
תעודת זהות: ${formData.idNumber || formData.personalDetails?.idNumber || 'לא צוין'}
טלפון: ${formData.phone || formData.personalDetails?.phone || 'לא צוין'}
אימייל: ${formData.email || formData.personalDetails?.email || 'לא צוין'}
כתובת: ${formData.address || formData.personalDetails?.address || 'לא צוין'}

פרטי המעבר:
מספק נוכחי: ${formData.currentProvider || 'לא צוין'}
לספק חדש: ${formData.newProvider || 'לא צוין'}
חבילה חדשה: ${formData.newPlan || 'לא צוין'}
חיסכון חודשי: ₪${formData.monthlySavings || 0}

חתימה דיגיטלית: ${formData.signature || 'לא זמין'}

מסמך זה נוצר על ידי מערכת השוואת ספקים
תאריך יצירה: ${new Date().toISOString()}`;
  };

  const requiredDocuments = [
    {
      title: 'ייפוי כוח',
      description: 'מסמך המאפשר לספק החדש לפעול בשמך',
      required: true,
      downloadable: true
    },
    {
      title: 'עותק תעודת זהות',
      description: 'צילום של תעודת הזהות (שני הצדדים)',
      required: true,
      downloadable: false
    },
    {
      title: 'חשבון אחרון',
      description: 'חשבון מהספק הנוכחי לאימות פרטים',
      required: true,
      downloadable: false
    },
    {
      title: 'אישור חשבון בנק',
      description: 'לחיוב אוטומטי (אם נבחר)',
      required: false,
      downloadable: false
    }
  ];

  const downloadPowerOfAttorney = () => {
    const content = `ייפוי כוח למעבר ספק ${categoryNames[category]}
===========================================

אני החתום מטה: _____________________ (שם מלא)
ת.ז: _____________________
כתובת: _____________________
טלפון: _____________________

מסמיך בזאת את ______________ לפעול בשמי לביצוע מעבר ספק ${categoryNames[category]}.

הסמכה זו כוללת:
• ביטול השירות הנוכחי
• פתיחת שירות חדש
• העברת פרטים רלוונטיים
• ביצוע כל הפעולות הנדרשות

תאריך: ${new Date().toLocaleDateString('he-IL')}
חתימה: _____________________

הערות:
- יש לחתום בפני עורך דין או נוטריון
- להגיש לספק החדש תוך 30 יום
- לשמור עותק למטרות תיעוד

---
נוצר על ידי מערכת השוואת ספקים`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ייפוי-כוח-${categoryNames[category]}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "ייפוי הכוח הורד בהצלחה!",
      description: "מלא את הפרטים והגש לספק החדש",
    });
  };

  return (
    <div className="space-y-6">
      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="text-2xl">{categoryIcons[category]}</div>
            <span>מסמכים נדרשים למעבר ספק {categoryNames[category]}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className={`p-2 rounded-lg ${doc.required ? 'bg-destructive/10' : 'bg-muted'}`}>
                    <FileCheck className={`h-5 w-5 ${doc.required ? 'text-destructive' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <h4 className="font-medium">{doc.title}</h4>
                      {doc.required && (
                        <Badge variant="destructive" className="text-xs">
                          נדרש
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                </div>
                
                {doc.downloadable && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadPowerOfAttorney}
                  >
                    <Download className="h-4 w-4 ml-2" />
                    הורד טופס
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <History className="h-5 w-5" />
            <span>טפסים שמורים</span>
            <Button variant="outline" size="sm" onClick={loadSavedForms}>
              רענן
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savedForms.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין טפסים שמורים עדיין</p>
              <p className="text-sm">טפסים שתמלא יופיעו כאן</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedForms.map((form, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="font-medium">
                        טופס {categoryNames[category]} - {form.fullName || form.personalDetails?.fullName || 'לא שם'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-4 rtl:space-x-reverse">
                      <span>נוצר: {new Date(form.timestamp).toLocaleDateString('he-IL')}</span>
                      {form.monthlySavings && (
                        <span>חיסכון: ₪{form.monthlySavings}/חודש</span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadForm(form)}
                  >
                    <Download className="h-4 w-4 ml-2" />
                    הורד
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-warning-foreground">
            <Shield className="h-5 w-5" />
            <span>הודעה חשובה - מידע משפטי</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-white/50 p-4 rounded-lg">
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
          
          <div className="bg-white/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">המלצות חשובות:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• קרא בעיון את כל החוזים לפני החתימה</li>
              <li>• וודא שאין דמי ביטול בחוזה הנוכחי</li>
              <li>• שמור תיעוד של כל השיחות והתכתובות</li>
              <li>• התייעץ עם יועץ משפטי במקרה של ספק</li>
            </ul>
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              המידע עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')} |{' '}
              <a href="mailto:support@savings-platform.co.il" className="text-primary hover:underline">
                תמיכה טכנית
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};