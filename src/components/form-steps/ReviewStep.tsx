import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Edit,
  Download
} from "lucide-react";

interface ReviewStepProps {
  category: string;
  customerType: string;
  data: any;
  onUpdate: (data: any) => void;
}

export const ReviewStep = ({ category, customerType, data }: ReviewStepProps) => {
  const isPrivate = customerType === 'private';

  const getCategoryName = () => {
    switch (category) {
      case 'cellular': return 'סלולר';
      case 'tv': return 'טלוויזיה';
      case 'internet': return 'אינטרנט';
      case 'electricity': return 'חשמל';
      default: return category;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'לא צוין';
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const getUploadedDocuments = () => {
    const documents = [];
    if (data.documents) {
      Object.entries(data.documents).forEach(([key, files]: [string, any]) => {
        if (files && files.length > 0) {
          const docNames: Record<string, string> = {
            id_front: 'צילום ת.ז - צד קדמי',
            id_back: 'צילום ת.ז - צד אחורי',
            attorney_id: 'צילום ת.ז מיופה כוח',
            company_registry: 'אישור מרשם החברות',
            signatory_id: 'צילום ת.ז מורשה חתימה'
          };
          documents.push({
            name: docNames[key] || key,
            file: files[0]
          });
        }
      });
    }
    return documents;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">סקירה סופית</h2>
        </div>
        <p className="text-muted-foreground">
          בדקו את כל הפרטים לפני השליחה הסופית
        </p>
      </div>

      {/* Summary Header */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">בקשת מעבר ספק {getCategoryName()}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={isPrivate ? "default" : "secondary"}>
                {isPrivate ? 'לקוח פרטי' : 'לקוח עסקי'}
              </Badge>
              <Badge variant="outline">
                {getCategoryName()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">תאריך יצירה</p>
            <p className="font-semibold">{new Date().toLocaleDateString('he-IL')}</p>
          </div>
        </div>
      </Card>

      {/* Personal/Company Details */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {isPrivate ? <User className="h-5 w-5 text-primary" /> : <Building className="h-5 w-5 text-primary" />}
          <h3 className="text-lg font-semibold">
            {isPrivate ? 'פרטים אישיים' : 'פרטי התאגיד'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isPrivate ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground">שם מלא</p>
                <p className="font-medium">{data.firstName} {data.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">תעודת זהות</p>
                <p className="font-medium">{data.idNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">טלפון</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {data.mobile}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">אימייל</p>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {data.email}
                </p>
              </div>
              {data.birthDate && (
                <div>
                  <p className="text-sm text-muted-foreground">תאריך לידה</p>
                  <p className="font-medium">{formatDate(data.birthDate)}</p>
                </div>
              )}
              {(data.street || data.city) && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">כתובת</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {[data.street, data.city, data.zipCode].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground">שם התאגיד</p>
                <p className="font-medium">{data.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">מספר חברה</p>
                <p className="font-medium">{data.companyId}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">כתובת רשומה</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {data.registeredAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">מורשה חתימה</p>
                <p className="font-medium">{data.signatoryName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ת.ז. מורשה חתימה</p>
                <p className="font-medium">{data.signatoryId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">תפקיד</p>
                <p className="font-medium">{data.signatoryTitle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">טלפון</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {data.contactPhone}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">אימייל</p>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {data.contactEmail}
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Service Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">פרטי השירות</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">ספק נוכחי</p>
            <p className="font-medium">{data.currentProvider || data.currentSupplier || 'לא צוין'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ספק יעד</p>
            <p className="font-medium">{data.targetProvider || data.targetSupplier || 'לא צוין'}</p>
          </div>
          
          {category === 'cellular' && data.lines && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-2">מספרי קווים להעברה</p>
              <div className="flex flex-wrap gap-2">
                {data.lines.filter((line: string) => line.trim()).map((line: string, index: number) => (
                  <Badge key={index} variant="outline">{line}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {category === 'electricity' && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">מספר חוזה</p>
                <p className="font-medium">{data.contractNumber || 'לא צוין'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">מספר מונה</p>
                <p className="font-medium">{data.meterNumber || 'לא צוין'}</p>
              </div>
              {data.siteAddress && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">כתובת אתר הצריכה</p>
                  <p className="font-medium">{data.siteAddress}</p>
                </div>
              )}
            </>
          )}
          
          {category === 'tv' && data.subscriberNumber && (
            <div>
              <p className="text-sm text-muted-foreground">מספר מנוי</p>
              <p className="font-medium">{data.subscriberNumber}</p>
            </div>
          )}
          
          {category === 'internet' && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">ספק תשתית</p>
                <p className="font-medium">{data.infraProvider || 'לא צוין'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ספק ISP</p>
                <p className="font-medium">{data.serviceProvider || 'לא צוין'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">מזהה קו</p>
                <p className="font-medium">{data.identifier || 'לא צוין'}</p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Documents */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">מסמכים מצורפים</h3>
        <div className="space-y-2">
          {getUploadedDocuments().map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{doc.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {getUploadedDocuments().length === 0 && (
            <div className="flex items-center gap-2 p-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">לא הועלו מסמכים</span>
            </div>
          )}
        </div>
      </Card>

      {/* Authorization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">הרשאות</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">תוקף ייפוי הכוח עד: </span>
            <span className="font-medium">{formatDate(data.poaExpiry)}</span>
          </div>
          <div className="flex items-center gap-2">
            {data.termsAccepted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">קריאת התנאים ואישור</span>
          </div>
          <div className="flex items-center gap-2">
            {data.understandingDeclaration ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">הצהרת הבנה</span>
          </div>
        </div>
      </Card>

      {/* Signature */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">חתימה</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {data.signatureComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              סטטוס חתימה: {data.signatureComplete ? 'הושלמה' : 'חסרה'}
            </span>
          </div>
          {data.signatureMethod && (
            <div>
              <span className="text-sm text-muted-foreground">שיטת חתימה: </span>
              <span className="text-sm font-medium">
                {data.signatureMethod === 'draw' ? 'שרבוט ידני' :
                 data.signatureMethod === 'type' ? 'חתימה מוקלדת' :
                 'חותמת מועלתת'}
              </span>
            </div>
          )}
          {data.signatureData && (
            <div className="border rounded p-4 bg-gray-50">
              <p className="text-xs text-muted-foreground mb-2">תצוגה מקדימה:</p>
              {data.signatureMethod === 'type' ? (
                <div className="text-center text-xl font-cursive p-2 bg-white rounded">
                  {data.typedSignature}
                </div>
              ) : (
                <img 
                  src={data.signatureData} 
                  alt="חתימה" 
                  className="max-h-20 mx-auto border rounded bg-white"
                />
              )}
            </div>
          )}
        </div>
      </Card>

      <Separator />

      {/* Final Status Check */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">מוכנות לשליחה</h3>
            <p className="text-sm text-muted-foreground">
              בדקו שכל השדות הנדרשים מולאו
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(data.termsAccepted && data.understandingDeclaration && data.signatureComplete) ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge className="bg-green-500">מוכן לשליחה</Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <Badge variant="outline">חסרים פרטים</Badge>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};