import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, AlertTriangle, Scale, Shield, Phone, Zap, Wifi, Smartphone, Tv } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createHebrewPDF } from '@/lib/pdfUtils';

interface DocumentTemplatesProps {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentProvider: string;
  newProvider: string;
}

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט',
  tv: 'טלוויזיה'
};

export const DocumentTemplates: React.FC<DocumentTemplatesProps> = ({
  category,
  currentProvider,
  newProvider
}) => {
  const { toast } = useToast();
  
  const handleDownloadForm = async (category: string) => {
    try {
      // Create content array
      const content = [
        '',
        'שם מלא: _____________________ ',
        'מספר תעודת זהות: _____________________',
        'כתובת: _____________________',
        '',
        `אני החתום מטה מסמיך בזאת את ${newProvider}`,
        `לפעול בשמי לשם ביצוע מעבר מספק ${currentProvider}`,
        `לספק ${newProvider}.`,
        '',
        'פעולות מורשות:',
        '• ביטול השירות הנוכחי',
        '• פתיחת השירות החדש',  
        '• העברת פרטי החשבון',
        '• חתימה על מסמכי המעבר',
        '',
        `תאריך: ${new Date().toLocaleDateString('he-IL')}`,
        'חתימה: ________________',
        '',
        'הוראות:',
        '- יש למלא את כל הפרטים בבירור',
        '- יש לחתום ולשלוח לספק החדש',
        '- שמור עותק למטרות תיעוד'
      ];
      
      // Create PDF with Hebrew support
      const title = `ייפוי כוח - מעבר ספק ${categoryNames[category]}`;
      const pdf = createHebrewPDF(title, content);
      pdf.save(`power-of-attorney-${category}-${Date.now()}.pdf`);

      toast({
        title: "טופס ייפוי הכוח נוצר!",
        description: `הטופס עבור מעבר ${categoryNames[category]} נשמר במחשב שלך כקובץ PDF`,
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן ליצור את הטופס כרגע. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    }
  };

  const categoryIcons = {
    electricity: Zap,
    cellular: Smartphone,
    internet: Wifi,
    tv: Tv
  };

  const Icon = categoryIcons[category];

  const requiredDocuments = [
    {
      title: 'טופס ייפוח כוח משפטי',
      description: 'מסמך המאפשר לנו לפעול בשמך מול החברות',
      icon: Scale,
      required: true,
      template: `טופס ייפוח כוח - מעבר ספק ${categoryNames[category]}`,
      downloadUrl: `/templates/power-of-attorney-${category}.pdf`
    },
    {
      title: 'עותק תעודת זהות',
      description: 'צילום תעודת זהות בתוקף - נדרש לאימות זהות ומניעת הונאות. החוק מחייב את כל חברות השירותים לוודא זהות הלקוח לפני פתיחת חשבון חדש או ביצוע מעבר.',
      icon: Shield,
      required: true
    },
    {
      title: 'חשבונית אחרונה',
      description: `חשבונית אחרונה מ${currentProvider}`,
      icon: FileText,
      required: true
    },
    {
      title: 'פרטי חשבון בנק',
      description: 'עבור הוראת קבע חדשה',
      icon: Phone,
      required: false
    }
  ];

  const legalNotices = [
    'המעבר יתבצע תוך 30 יום עבודה מתאריך החתימה',
    'תקופת ההודעה המוקדמת הינה 30 יום',
    'עלולים להיות חיובי ביטול חוזה בהתאם לתנאי הספק הנוכחי',
    'הספק החדש יתחיל לחייב רק לאחר השלמת המעבר',
    'שירות הביטוח הקיים יכול להיות מושפע מהמעבר'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 rtl:space-x-reverse">
            <Icon className="h-6 w-6 text-primary" />
            <span>מסמכים נדרשים למעבר - {categoryNames[category]}</span>
          </CardTitle>
          <p className="text-muted-foreground">
            המסמכים הבאים נדרשים כדי לבצע עבורך את המעבר מ{currentProvider} ל{newProvider}
          </p>
        </CardHeader>
      </Card>

      {/* Required Documents */}
      <div className="grid gap-4">
        {requiredDocuments.map((doc, index) => (
          <Card key={index} className={`border-l-4 ${doc.required ? 'border-l-destructive' : 'border-l-primary'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className={`p-3 rounded-lg ${doc.required ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                    <doc.icon className={`h-6 w-6 ${doc.required ? 'text-destructive' : 'text-primary'}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                      <h3 className="font-semibold">{doc.title}</h3>
                      <Badge variant={doc.required ? 'destructive' : 'secondary'}>
                        {doc.required ? 'חובה' : 'אופציונלי'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                </div>
                
                {doc.downloadUrl && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadForm(category)}
                  >
                    <Download className="h-4 w-4 ml-2" />
                    הורד טופס
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legal Notices */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            <span>הערות משפטיות חשובות</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {legalNotices.map((notice, index) => (
              <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-sm">
                <span className="text-orange-600 font-bold">•</span>
                <span className="text-orange-700">{notice}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Process Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>לוח זמנים לתהליך המעבר</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">שלב ראשון - חתימה על מסמכים</h4>
                <p className="text-sm text-muted-foreground">יום 1: חתימה על ייפוח כוח וטפסי מעבר</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">שלב שני - יצירת קשר עם ספקים</h4>
                <p className="text-sm text-muted-foreground">ימים 2-7: פנייה לספק החדש ויצירת חוזה</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">שלב שלישי - ביטול הספק הישן</h4>
                <p className="text-sm text-muted-foreground">ימים 8-14: הודעה וביטול מול הספק הנוכחי</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h4 className="font-semibold">שלב רביעי - השלמת המעבר</h4>
                <p className="text-sm text-muted-foreground">ימים 15-30: הפעלת השירות החדש וסיום התהליך</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};