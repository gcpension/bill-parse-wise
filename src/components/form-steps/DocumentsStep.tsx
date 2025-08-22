import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Check, X, AlertCircle } from "lucide-react";
import { validateImageFile } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DocumentsStepProps {
  category: string;
  customerType: string;
  data: any;
  onUpdate: (data: any) => void;
}

interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
  maxFiles?: number;
}

export const DocumentsStep = ({ category, customerType, data, onUpdate }: DocumentsStepProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>(data.documents || {});
  const { toast } = useToast();

  const isPrivate = customerType === 'private';

  const getRequiredDocuments = (): RequiredDocument[] => {
    const baseDocuments: RequiredDocument[] = [];

    if (isPrivate) {
      baseDocuments.push({
        id: 'id_front',
        name: 'צילום תעודת זהות - צד קדמי',
        description: 'צילום ברור של הצד הקדמי של תעודת הזהות',
        required: true
      });
      
      baseDocuments.push({
        id: 'id_back',
        name: 'צילום תעודת זהות - צד אחורי',
        description: 'צילום ברור של הצד האחורי של תעודת הזהות (רק אם יש מידע בצד האחורי)',
        required: false
      });

      // For electricity, also need attorney ID
      if (category === 'electricity') {
        baseDocuments.push({
          id: 'attorney_id',
          name: 'צילום ת.ז. מיופה הכוח',
          description: 'צילום תעודת זהות של מיופה הכוח (נדרש לחשמל)',
          required: true
        });
      }
    } else {
      // Business documents
      baseDocuments.push({
        id: 'company_registry',
        name: 'אישור מרשם החברות',
        description: 'נסח עדכני מרשם החברות או אישור תאגיד',
        required: true
      });
      
      baseDocuments.push({
        id: 'signatory_id',
        name: 'צילום ת.ז. מורשה חתימה',
        description: 'צילום תעודת זהות של מורשה החתימה',
        required: true
      });
    }

    return baseDocuments;
  };

  const requiredDocuments = getRequiredDocuments();

  useEffect(() => {
    onUpdate({
      ...data,
      documents: uploadedFiles
    });
  }, [uploadedFiles]);

  const createDropzoneForDocument = (documentId: string) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png'],
        'application/pdf': ['.pdf']
      },
      maxFiles: 1,
      onDrop: (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          toast({
            title: "קובץ לא תקין",
            description: "אנא בחרו קובץ בפורמט JPG, PNG או PDF בגודל עד 10MB",
            variant: "destructive"
          });
          return;
        }

        const file = acceptedFiles[0];
        if (file && validateImageFile(file)) {
          setUploadedFiles(prev => ({
            ...prev,
            [documentId]: [file]
          }));
          toast({
            title: "קובץ הועלה בהצלחה",
            description: `${file.name} הועלה למערכת`
          });
        } else {
          toast({
            title: "קובץ לא תקין",
            description: "הקובץ חורג מהגודל המותר או שהפורמט אינו נתמך",
            variant: "destructive"
          });
        }
      }
    });

    const uploadedFile = uploadedFiles[documentId]?.[0];
    const hasFile = !!uploadedFile;

    return (
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 
            hasFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {hasFile ? (
            <div className="space-y-2">
              <Check className="mx-auto h-8 w-8 text-green-500" />
              <p className="text-sm font-medium text-green-700">{uploadedFile.name}</p>
              <p className="text-xs text-green-600">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFiles(prev => {
                    const updated = { ...prev };
                    delete updated[documentId];
                    return updated;
                  });
                }}
              >
                <X className="ml-2 h-4 w-4" />
                הסר קובץ
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium">
                {isDragActive ? 'שחררו כאן...' : 'גררו קובץ או לחצו לבחירה'}
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG או PDF - עד 10MB
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const removeFile = (documentId: string) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[documentId];
      return updated;
    });
  };

  const allRequiredDocumentsUploaded = requiredDocuments
    .filter(doc => doc.required)
    .every(doc => uploadedFiles[doc.id]?.length > 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">העלאת מסמכים</h2>
        <p className="text-muted-foreground">
          אנא צרפו את המסמכים הנדרשים לביצוע המעבר
        </p>
      </div>

      {/* Requirements Info */}
      <Card className="p-4 bg-blue-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">דרישות לקבצים:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• פורמטים נתמכים: JPG, PNG, PDF</li>
              <li>• גודל מקסימלי: 10MB לקובץ</li>
              <li>• הצילום צריך להיות ברור וקריא</li>
              <li>• ודאו שכל הפרטים גלויים במלואם</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Document Upload Areas */}
      <div className="space-y-6">
        {requiredDocuments.map((document) => (
          <Card key={document.id} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-base font-semibold">{document.name}</Label>
                  {document.required ? (
                    <Badge variant="destructive" className="text-xs">חובה</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">רשות</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{document.description}</p>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            
            {createDropzoneForDocument(document.id)}
          </Card>
        ))}
      </div>

      {/* Upload Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">סטטוס העלאה</h3>
            <p className="text-sm text-muted-foreground">
              {Object.keys(uploadedFiles).length} מתוך {requiredDocuments.length} קבצים הועלו
            </p>
          </div>
          <div className="flex items-center gap-2">
            {allRequiredDocumentsUploaded ? (
              <Badge variant="default" className="bg-green-500">
                <Check className="ml-1 h-3 w-3" />
                מוכן להמשך
              </Badge>
            ) : (
              <Badge variant="outline">
                <AlertCircle className="ml-1 h-3 w-3" />
                חסרים מסמכים נדרשים
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-amber-50">
        <h3 className="font-semibold text-amber-900 mb-2">טיפים לצילום איכותי:</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• צלמו במקום עם תאורה טובה</li>
          <li>• ודאו שהמסמך מונח על רקע אחיד</li>
          <li>• הקפידו שכל הטקסט קריא וברור</li>
          <li>• הימנעו מצללים או השתקפויות</li>
          <li>• צלמו ישר ולא בזווית</li>
        </ul>
      </Card>
    </div>
  );
};