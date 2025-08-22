import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import SignaturePad from "signature_pad";
import { 
  PenTool, 
  Type, 
  Upload, 
  RotateCcw, 
  Download,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignatureStepProps {
  category: string;
  customerType: string;
  data: any;
  onUpdate: (data: any) => void;
}

export const SignatureStep = ({ category, customerType, data, onUpdate }: SignatureStepProps) => {
  const [signatureMethod, setSignatureMethod] = useState<string>(data.signatureMethod || 'draw');
  const [signatureData, setSignatureData] = useState<string>(data.signatureData || '');
  const [typedSignature, setTypedSignature] = useState<string>(data.typedSignature || '');
  const [uploadedStamp, setUploadedStamp] = useState<File | null>(data.uploadedStamp || null);
  const [signatureComplete, setSignatureComplete] = useState<boolean>(!!data.signatureData);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const { toast } = useToast();

  const isPrivate = customerType === 'private';
  const isBusinessAndStampMethod = !isPrivate && signatureMethod === 'stamp';

  useEffect(() => {
    if (canvasRef.current && signatureMethod === 'draw') {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
        minWidth: 1,
        maxWidth: 2,
      });

      signaturePadRef.current.addEventListener('endStroke', handleSignatureChange);
      
      // Load existing signature if available
      if (signatureData && signatureMethod === 'draw') {
        signaturePadRef.current.fromDataURL(signatureData);
      }
    }

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, [signatureMethod]);

  useEffect(() => {
    onUpdate({
      ...data,
      signatureMethod,
      signatureData,
      typedSignature,
      uploadedStamp,
      signatureComplete
    });
  }, [signatureMethod, signatureData, typedSignature, uploadedStamp, signatureComplete]);

  const handleSignatureChange = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL();
      setSignatureData(dataUrl);
      setSignatureComplete(true);
    } else {
      setSignatureData('');
      setSignatureComplete(false);
    }
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignatureData('');
      setSignatureComplete(false);
    }
  };

  const handleTypedSignatureChange = (value: string) => {
    setTypedSignature(value);
    setSignatureComplete(!!value.trim());
    if (value.trim()) {
      // Create a simple signature from typed text
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '24px cursive';
        ctx.fillStyle = 'black';
        ctx.fillText(value, 20, 50);
        setSignatureData(canvas.toDataURL());
      }
    } else {
      setSignatureData('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast({
          title: "קובץ לא תקין",
          description: "אנא בחרו קובץ תמונה בפורמט JPG או PNG",
          variant: "destructive"
        });
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        setUploadedStamp(file);
        
        // Create preview for stamp
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setSignatureData(e.target.result as string);
            setSignatureComplete(true);
          }
        };
        reader.readAsDataURL(file);
        
        toast({
          title: "חותמת הועלתה בהצלחה",
          description: "החותמת שלכם מוכנה לשימוש"
        });
      }
    }
  });

  const downloadSignature = () => {
    if (signatureData) {
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = signatureData;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <PenTool className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">חתימה דיגיטלית</h2>
        </div>
        <p className="text-muted-foreground">
          בחרו את שיטת החתימה המועדפת עליכם
        </p>
      </div>

      {/* Signature Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {signatureComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <span className="font-medium">
              {signatureComplete ? 'חתימה הושלמה' : 'חתימה נדרשת'}
            </span>
          </div>
          <Badge variant={signatureComplete ? "default" : "outline"}>
            {isPrivate ? 'לקוח פרטי' : 'לקוח עסקי'}
          </Badge>
        </div>
      </Card>

      {/* Signature Methods */}
      <Tabs value={signatureMethod} onValueChange={setSignatureMethod}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="draw" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            שרבוט
          </TabsTrigger>
          <TabsTrigger value="type" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            הקלדה
          </TabsTrigger>
          <TabsTrigger value="stamp" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            חותמת
          </TabsTrigger>
        </TabsList>

        {/* Draw Signature */}
        <TabsContent value="draw" className="space-y-4">
          <Card className="p-4">
            <Label className="text-base font-semibold mb-3 block">
              שרטטו את החתימה שלכם
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={500}
                height={200}
                className="w-full border rounded bg-white cursor-crosshair"
                style={{ touchAction: 'none' }}
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-muted-foreground">
                  השתמשו בעכבר או באצבע (מסך מגע) לחתימה
                </p>
                <div className="space-x-2 rtl:space-x-reverse">
                  <Button variant="outline" size="sm" onClick={clearSignature}>
                    <RotateCcw className="ml-2 h-4 w-4" />
                    נקה
                  </Button>
                  {signatureComplete && (
                    <Button variant="outline" size="sm" onClick={downloadSignature}>
                      <Download className="ml-2 h-4 w-4" />
                      הורד
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Type Signature */}
        <TabsContent value="type" className="space-y-4">
          <Card className="p-4">
            <Label htmlFor="typedSignature" className="text-base font-semibold mb-3 block">
              הקלידו את החתימה שלכם
            </Label>
            <div className="space-y-4">
              <Input
                id="typedSignature"
                value={typedSignature}
                onChange={(e) => handleTypedSignatureChange(e.target.value)}
                placeholder="הקלידו את השם המלא שלכם"
                className="text-lg"
              />
              {typedSignature && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-muted-foreground mb-2">תצוגה מקדימה:</p>
                  <div 
                    className="text-2xl font-cursive text-center p-4 bg-white border rounded"
                    style={{ fontFamily: 'cursive' }}
                  >
                    {typedSignature}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Upload Stamp */}
        <TabsContent value="stamp" className="space-y-4">
          <Card className="p-4">
            <Label className="text-base font-semibold mb-3 block">
              העלו חותמת או חתימה סרוקה
              {!isPrivate && <span className="text-red-500"> *</span>}
            </Label>
            
            {!uploadedStamp ? (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'שחררו את הקובץ כאן...' : 'גררו קובץ או לחצו לבחירה'}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG או PNG בלבד - גודל מקסימלי 5MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">חותמת הועלתה:</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadedStamp(null);
                        setSignatureData('');
                        setSignatureComplete(false);
                      }}
                    >
                      החלף
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{uploadedStamp.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(uploadedStamp.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
                
                {signatureData && (
                  <div className="border rounded-lg p-4 bg-white">
                    <p className="text-sm text-muted-foreground mb-2">תצוגה מקדימה:</p>
                    <div className="text-center">
                      <img 
                        src={signatureData} 
                        alt="חותמת" 
                        className="max-h-32 mx-auto border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {isBusinessAndStampMethod && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <div className="font-medium mb-1">לקוחות עסקיים:</div>
                    <p>נדרשת חותמת החברה וחתימת מורשה החתימה</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legal Notice */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <div className="font-medium mb-1">הצהרה משפטית:</div>
            <p>
              החתימה הדיגיטלית מהווה אישור משפטי מחייב על ייפוי הכוח.
              וודאו שאתם מורשים לחתום בשם הגורם המבקש.
            </p>
          </div>
        </div>
      </Card>

      {/* Signature Summary */}
      {signatureComplete && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">החתימה הושלמה בהצלחה</div>
              <p className="text-sm text-green-800">
                שיטת חתימה: {
                  signatureMethod === 'draw' ? 'שרבוט ידני' :
                  signatureMethod === 'type' ? 'חתימה מוקלדת' :
                  'חותמת מועלתת'
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};