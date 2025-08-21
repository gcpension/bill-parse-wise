import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentRequirement {
  title: string;
  description: string;
  required: boolean;
  downloadable: boolean;
}

interface DocumentRequirementsProps {
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

const requiredDocuments: DocumentRequirement[] = [
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

export const DocumentRequirements = ({ category }: DocumentRequirementsProps) => {
  const { toast } = useToast();

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
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="text-2xl animate-scale-in">{categoryIcons[category]}</div>
          <span>מסמכים נדרשים למעבר ספק {categoryNames[category]}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requiredDocuments.map((doc, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover-scale transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className={`p-2 rounded-lg transition-colors duration-200 ${
                  doc.required 
                    ? 'bg-destructive/10 hover:bg-destructive/20' 
                    : 'bg-muted hover:bg-muted/80'
                }`}>
                  <FileCheck className={`h-5 w-5 ${
                    doc.required ? 'text-destructive' : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <h4 className="font-medium">{doc.title}</h4>
                    {doc.required && (
                      <Badge variant="destructive" className="text-xs animate-pulse">
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
                  className="hover-scale"
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
  );
};