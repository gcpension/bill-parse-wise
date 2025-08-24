import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';
import { PersonalDetails, SigningData } from '@/types/forms';

interface SignTrustIntegrationProps {
  customerDetails: PersonalDetails;
  currentProvider: string;
  newProvider: string;
  category: string;
  documentData?: Record<string, any>;
  onSigningComplete?: (signingData: SigningData) => void;
}

type SigningState = 'idle' | 'creating' | 'pending' | 'completed' | 'failed';

let supabaseClient: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient | null => {
  const supabaseConfig = config.supabase;
  
  if (!supabaseConfig.isConfigured) {
    logger.warn('Supabase not configured', 'SignTrust');
    return null;
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseConfig.url!, supabaseConfig.anonKey!);
  }
  
  return supabaseClient;
};

export function SignTrustIntegration({
  customerDetails,
  currentProvider,
  newProvider,
  category,
  documentData,
  onSigningComplete
}: SignTrustIntegrationProps) {
  const [signingState, setSigningState] = useState<SigningState>('idle');
  const [signingUrl, setSigningUrl] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const { toast } = useToast();

  const createSigningRequest = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setSigningState('failed');
      toast({
        title: 'שגיאת תצורה',
        description: 'שירות החתימה הדיגיטלית אינו מוגדר כרגע',
        variant: 'destructive',
      });
      return;
    }

    setSigningState('creating');
    
    try {
      logger.info('Creating signing request', 'SignTrust', { 
        customerName: customerDetails.fullName,
        category 
      });

      const { data, error } = await supabase.functions.invoke('signtrust-integration', {
        body: {
          customerDetails,
          currentProvider,
          newProvider,
          category,
          documentData
        }
      });

      if (error) {
        logger.error('Supabase function error', 'SignTrust', error);
        throw error;
      }

      if (data?.success) {
        setSigningUrl(data.signing_url);
        setRequestId(data.request_id);
        setSigningState('pending');
        
        logger.info('Signing request created successfully', 'SignTrust', {
          requestId: data.request_id
        });
        
        toast({
          title: 'קישור חתימה נוצר בהצלחה',
          description: 'לחץ על הקישור להמשך תהליך החתימה',
        });
      } else {
        throw new Error(data?.error || 'Failed to create signing request');
      }
    } catch (error) {
      logger.error('Error creating signing request', 'SignTrust', error);
      setSigningState('failed');
      toast({
        title: 'שגיאה ביצירת בקשת חתימה',
        description: 'אנא נסה שוב מאוחר יותר',
        variant: 'destructive',
      });
    }
  };

  const openSigningLink = () => {
    if (signingUrl) {
      logger.info('Opening signing link', 'SignTrust', { requestId });
      window.open(signingUrl, '_blank');
    }
  };

  const checkSigningStatus = async () => {
    const supabase = getSupabase();
    if (!supabase || !requestId) return;

    try {
      const { data, error } = await supabase
        .from('signing_requests')
        .select('status, signed_document_url, signed_at')
        .eq('id', requestId)
        .single();

      if (error) {
        logger.error('Error checking signing status', 'SignTrust', error);
        throw error;
      }

      if (data?.status === 'completed') {
        setSigningState('completed');
        
        const signingData: SigningData = {
          documentUrl: data.signed_document_url,
          signingUrl,
          status: 'signed',
          timestamp: data.signed_at || new Date().toISOString(),
        };

        onSigningComplete?.(signingData);
        
        logger.info('Document signed successfully', 'SignTrust', {
          requestId,
          documentUrl: data.signed_document_url
        });

        toast({
          title: 'החתימה הושלמה בהצלחה!',
          description: 'המסמך נחתם ונשמר במערכת',
        });
      }
    } catch (error) {
      logger.error('Error checking signing status', 'SignTrust', error);
    }
  };

  const getStateIcon = () => {
    switch (signingState) {
      case 'idle':
        return <FileCheck className="h-8 w-8 text-muted-foreground" />;
      case 'creating':
        return <Clock className="h-8 w-8 text-blue-500 animate-spin" />;
      case 'pending':
        return <ExternalLink className="h-8 w-8 text-orange-500" />;
      case 'completed':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'failed':
        return <FileCheck className="h-8 w-8 text-red-500" />;
    }
  };

  const getStateMessage = () => {
    switch (signingState) {
      case 'idle':
        return 'לחץ להתחלת תהליך החתימה הדיגיטלית';
      case 'creating':
        return 'יוצר בקשת חתימה...';
      case 'pending':
        return 'ממתין לחתימה - לחץ על הקישור להמשך';
      case 'completed':
        return 'החתימה הושלמה בהצלחה!';
      case 'failed':
        return 'שגיאה ביצירת בקשת חתימה';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {getStateIcon()}
          </div>
          <CardTitle className="text-xl">חתימה דיגיטלית מאובטחת</CardTitle>
          <CardDescription className="text-base">
            {getStateMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {signingState === 'idle' && (
            <Button 
              onClick={createSigningRequest}
              size="lg"
              className="w-full max-w-md"
            >
              <FileCheck className="mr-2 h-5 w-5" />
              התחל תהליך חתימה
            </Button>
          )}

          {signingState === 'pending' && (
            <div className="space-y-4">
              <Button 
                onClick={openSigningLink}
                size="lg"
                className="w-full max-w-md"
                variant="default"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                פתח קישור חתימה
              </Button>
              <Button 
                onClick={checkSigningStatus}
                variant="outline"
                size="sm"
              >
                בדק סטטוס חתימה
              </Button>
            </div>
          )}

          {signingState === 'failed' && (
            <Button 
              onClick={createSigningRequest}
              variant="outline"
              size="lg"
              className="w-full max-w-md"
            >
              נסה שוב
            </Button>
          )}

          {signingState === 'completed' && (
            <div className="text-green-600 font-medium">
              ✅ המסמך נחתם בהצלחה ונשלח לעיבוד
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פרטי הבקשה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>שם:</strong> {customerDetails.fullName}</div>
          <div><strong>אימייל:</strong> {customerDetails.email}</div>
          <div><strong>טלפון:</strong> {customerDetails.phone}</div>
          <div><strong>ת.ז.:</strong> {customerDetails.idNumber}</div>
          <div><strong>ספק נוכחי:</strong> {currentProvider}</div>
          <div><strong>ספק חדש:</strong> {newProvider}</div>
          <div><strong>קטגוריה:</strong> {category}</div>
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            החתימה הדיגיטלית מתבצעת באמצעות פלטפורמה מאובטחת ומוכרת על פי חוק החתימה האלקטרונית התשס"א-2001
          </p>
        </CardContent>
      </Card>
    </div>
  );
}