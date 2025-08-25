import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Phone, Mail, FileText } from 'lucide-react';
import { switchRequestsAPI, subscriptions } from '@/lib/supabaseClient';

interface RequestStatusTrackerProps {
  requestId: string;
}

export const RequestStatusTracker = ({ requestId }: RequestStatusTrackerProps) => {
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const data = await switchRequestsAPI.getById(requestId);
        setRequestData(data);
      } catch (err) {
        console.error('Error fetching request:', err);
        setError('לא ניתן לטעון את פרטי הבקשה');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();

    // Subscribe to real-time updates
    const subscription = subscriptions.subscribeSwitchRequest(requestId, (payload) => {
      console.log('Request updated:', payload);
      fetchRequestData(); // Refresh data on updates
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [requestId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="mr-3">טוען פרטי בקשה...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !requestData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">שגיאה בטעינת הבקשה</h3>
            <p className="text-muted-foreground">{error || 'בקשה לא נמצאה'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'ממתין לעיבוד', color: 'bg-yellow-500', progress: 10 };
      case 'in_progress':
        return { label: 'בעיבוד', color: 'bg-blue-500', progress: 50 };
      case 'completed':
        return { label: 'הושלם', color: 'bg-green-500', progress: 100 };
      case 'cancelled':
        return { label: 'בוטל', color: 'bg-gray-500', progress: 0 };
      case 'failed':
        return { label: 'נכשל', color: 'bg-red-500', progress: 0 };
      default:
        return { label: status, color: 'bg-gray-500', progress: 0 };
    }
  };

  const statusInfo = getStatusInfo(requestData.status);
  const timelineSteps = requestData.processing_timeline || [];
  const completedSteps = timelineSteps.filter((step: any) => step.step_status === 'completed').length;
  const totalSteps = timelineSteps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>בקשה #{requestData.request_id}</span>
            <Badge className={`${statusInfo.color} text-white`}>
              {statusInfo.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>התקדמות</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>שירות:</strong> {requestData.service_type === 'electricity' ? 'חשמל' : 
                                      requestData.service_type === 'cellular' ? 'סלולר' : 
                                      requestData.service_type === 'internet' ? 'אינטרנט' : requestData.service_type}
            </div>
            <div>
              <strong>מספק:</strong> {requestData.current_provider} → {requestData.new_provider}
            </div>
            <div>
              <strong>תאריך יצירה:</strong> {new Date(requestData.created_at).toLocaleDateString('he-IL')}
            </div>
            <div>
              <strong>מועד מעבר משוער:</strong> {requestData.estimated_switch_date ? 
                new Date(requestData.estimated_switch_date).toLocaleDateString('he-IL') : 'לא צוין'}
            </div>
          </div>

          {requestData.processing_notes && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <strong className="text-sm">הערות עיבוד:</strong>
              <p className="text-sm mt-1">{requestData.processing_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>תהליך העיבוד</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineSteps.map((step: any, index: number) => {
              const isCompleted = step.step_status === 'completed';
              const isInProgress = step.step_status === 'in_progress';
              const isPending = step.step_status === 'pending';

              return (
                <div key={step.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full mt-1 ${
                    isCompleted ? 'bg-success text-success-foreground' :
                    isInProgress ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{step.step_name}</h4>
                      <Badge variant={
                        isCompleted ? 'default' :
                        isInProgress ? 'secondary' :
                        'outline'
                      }>
                        {step.step_status === 'completed' ? 'הושלם' :
                         step.step_status === 'in_progress' ? 'בעיבוד' :
                         step.step_status === 'failed' ? 'נכשל' : 'ממתין'}
                      </Badge>
                    </div>
                    
                    {step.completed_at && (
                      <p className="text-sm text-muted-foreground">
                        הושלם: {new Date(step.completed_at).toLocaleString('he-IL')}
                      </p>
                    )}
                    
                    {step.notes && (
                      <p className="text-sm text-muted-foreground">{step.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Communication History */}
      {requestData.communication_logs && requestData.communication_logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>היסטוריית תקשורת</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requestData.communication_logs.map((comm: any) => (
                <div key={comm.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {comm.communication_type === 'email' ? (
                      <Mail className="h-4 w-4 text-primary" />
                    ) : comm.communication_type === 'call' ? (
                      <Phone className="h-4 w-4 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium">{comm.subject || comm.communication_type}</h5>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comm.timestamp).toLocaleString('he-IL')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comm.content}</p>
                    {comm.agent && (
                      <p className="text-xs text-muted-foreground mt-1">נציג: {comm.agent}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exit Fee Information */}
      {requestData.exit_fee_info && requestData.exit_fee_info.hasExitFee && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="text-warning">מידע על קנסות יציאה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>סכום משוער:</strong> ₪{requestData.exit_fee_info.estimatedAmount}</p>
              <p><strong>סיבה:</strong> {requestData.exit_fee_info.reason}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>יצירת קשר</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            יש שאלות או עדכונים לגבי הבקשה? צור איתנו קשר:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              03-1234567
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              support@switch-provider.co.il
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};