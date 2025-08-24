import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, History, FileCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/lib/errorHandler';
import { formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';

interface SavedForm {
  fullName?: string;
  personalDetails?: {
    fullName?: string;
  };
  timestamp: string;
  monthlySavings?: number;
  currentProvider?: string;
  newProvider?: string;
  newPlan?: string;
  signature?: string;
  documentId?: string;
  submissionId?: string;
}

interface SavedFormsProps {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
}

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט',
  tv: 'טלוויזיה'
};

export const SavedForms = ({ category }: SavedFormsProps) => {
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const { toast } = useToast();

  const loadSavedForms = () => {
    const forms: SavedForm[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`provider-switch-${category}`) || key?.startsWith(`switch-${category}`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          forms.push(data);
        } catch (error) {
          handleError(error, 'Loading saved forms');
        }
      }
    }
    setSavedForms(forms.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  const generateFormContent = (formData: SavedForm) => {
    const timestamp = new Date(formData.timestamp);
    return [
      '',
      `נוצר: ${timestamp.toLocaleDateString('he-IL')} ${timestamp.toLocaleTimeString('he-IL')}`,
      `מזהה: ${formData.submissionId || formData.documentId || 'לא זמין'}`,
      '',
      'פרטי הלקוח:',
      `שם מלא: ${formData.fullName || formData.personalDetails?.fullName || 'לא צוין'}`,
      `מספק נוכחי: ${formData.currentProvider || 'לא צוין'}`,
      `לספק חדש: ${formData.newProvider || 'לא צוין'}`,
      `חבילה חדשה: ${formData.newPlan || 'לא צוין'}`,
      `חיסכון חודשי: ₪${formData.monthlySavings || 0}`,
      '',
      `חתימה דיגיטלית: ${formData.signature ? 'זמינה' : 'לא זמינה'}`,
      '',
      'מסמך זה נוצר על ידי מערכת השוואת ספקים',
      `תאריך יצירה: ${new Date().toISOString()}`
    ];
  };

  const downloadForm = (formData: SavedForm) => {
    try {
      // Create PDF document with Hebrew support
      const pdf = new jsPDF({
        orientation: 'portrait',
        format: 'a4'
      });
      const timestamp = new Date(formData.timestamp);
      
      // Configure for Hebrew text (right to left)
      const pageWidth = pdf.internal.pageSize.width;
      const rightMargin = 20;
      
      // Set up PDF with Arial font for better Hebrew support
      pdf.setFont('arial', 'normal');
      pdf.setFontSize(18);
      pdf.setR2L(true);
      
      // Title
      const title = `טופס מעבר ספק ${categoryNames[category]}`;
      const titleWidth = pdf.getTextWidth(title);
      pdf.text(title, pageWidth - rightMargin - titleWidth, 30);
      
      pdf.setFontSize(12);
      
      // Add content
      const content = generateFormContent(formData);
      
      let yPosition = 50;
      content.forEach(line => {
        if (line === '') {
          yPosition += 5;
        } else {
          const lineWidth = pdf.getTextWidth(line);
          pdf.text(line, pageWidth - rightMargin - lineWidth, yPosition);
          yPosition += 7;
        }
      });
      
      // Save the PDF
      pdf.save(`provider-switch-${categoryNames[category]}-${timestamp.toLocaleDateString('he-IL').replace(/\//g, '-')}.pdf`);

      toast({
        title: "הטופס הורד בהצלחה!",
        description: "הטופס נשמר במחשב שלך כקובץ PDF",
      });
    } catch (error) {
      handleError(error, 'Form download');
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <History className="h-5 w-5 animate-scale-in" />
          <span>טפסים שמורים</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadSavedForms}
            className="hover-scale"
          >
            רענן
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedForms.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground animate-fade-in">
            <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
            <p>אין טפסים שמורים עדיין</p>
            <p className="text-sm">טפסים שתמלא יופיעו כאן</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedForms.map((form, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border rounded-lg hover-scale transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 className="h-4 w-4 text-success animate-scale-in" />
                    <span className="font-medium">
                      טופס {categoryNames[category]} - {form.fullName || form.personalDetails?.fullName || 'לא שם'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center space-x-4 rtl:space-x-reverse">
                    <span>נוצר: {new Date(form.timestamp).toLocaleDateString('he-IL')}</span>
                    {form.monthlySavings && (
                      <span className="text-success font-medium">
                        חיסכון: {formatCurrency(form.monthlySavings)}/חודש
                      </span>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadForm(form)}
                  className="hover-scale"
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
  );
};