import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Mail, Phone, Calendar, Home, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SuccessStep = () => {
  const { state } = useWizard();
  const requestId = state.requestId;
  const personalDetails = state.personalDetails;
  const currentService = state.currentService;
  const newService = state.newService;

  const handleDownloadReceipt = () => {
    // Generate and download PDF receipt
    console.log('Downloading receipt for request:', requestId);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="bg-gradient-to-r from-success/10 to-success-glow/10 border-success/20">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-success rounded-full">
              <CheckCircle className="h-12 w-12 text-success-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-success">בקשה נשלחה בהצלחה!</h1>
            <p className="text-lg text-muted-foreground">
              בקשת המעבר שלך נקלטה במערכת ותטופל בהקדם
            </p>
          </div>
          
          <Badge variant="outline" className="text-lg px-6 py-2 border-success text-success">
            מספר בקשה: #{requestId}
          </Badge>
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle>פרטי הבקשה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">מבקש השירות</h4>
              <div className="text-sm space-y-1">
                <div>{personalDetails.firstName} {personalDetails.lastName}</div>
                <div className="text-muted-foreground">ת.ז. {personalDetails.idNumber}</div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {personalDetails.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {personalDetails.phone}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">פרטי המעבר</h4>
              <div className="text-sm space-y-1">
                <div><strong>מספק נוכחי:</strong> {currentService.providerName}</div>
                <div><strong>אל ספק חדש:</strong> {newService.newProvider}</div>
                <div><strong>מסלול חדש:</strong> {newService.newPlan}</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>מועד מעבר: {
                    newService.switchDate === 'immediate' ? 'מיידי' :
                    newService.switchDate === 'end_of_billing' ? 'סוף מחזור חיוב' :
                    newService.switchDate === 'end_of_commitment' ? 'סוף התחייבות' :
                    newService.customSwitchDate || 'לא צוין'
                  }</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>מה קורה הלאה?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="p-2 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <div className="font-medium">אישור קבלת הבקשה</div>
                <div className="text-sm text-muted-foreground">
                  תקבל אישור במייל תוך 15 דקות עם פרטי הבקשה
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <div className="font-medium">בדיקת כשירות והתחייבויות</div>
                <div className="text-sm text-muted-foreground">
                  נבדוק עם הספק הנוכחי את פרטי החשבון וקנסות יציאה (24-48 שעות)
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <div className="font-medium">יצירת קשר ואישור סופי</div>
                <div className="text-sm text-muted-foreground">
                  נחזור אליך בטלפון לאישור פרטים ולתיאום מועד המעבר
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 bg-success/10 rounded-full mt-1">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="font-medium">ביצוע המעבר</div>
                <div className="text-sm text-muted-foreground">
                  נטפל בכל התהליך מולך ומול הספקים - ללא טרחה מצדך
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h4 className="font-semibold">זכות ביטול</h4>
            <p className="text-sm text-muted-foreground">
              יש לך זכות לבטל את הבקשה תוך <strong>7 ימים</strong> מהיום.
              לביטול, התקשר לטלפון שיישלח במייל או השב למייל האישור.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownloadReceipt} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          הורד אישור PDF
        </Button>
        
        <Link to={`/request-status?id=${requestId}`}>
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <ExternalLink className="h-4 w-4" />
            מעקב אחר הבקשה
          </Button>
        </Link>
        
        <Link to="/">
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Home className="h-4 w-4" />
            חזרה לעמוד הבית
          </Button>
        </Link>
      </div>

      {/* Contact Info */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <div className="font-medium mb-2">יש שאלות? אנחנו כאן בשבילך</div>
        <div className="space-y-1">
          <div>📧 support@switch-provider.co.il</div>
          <div>📞 03-1234567 (ב׳-ה׳ 09:00-17:00)</div>
        </div>
      </div>
    </div>
  );
};