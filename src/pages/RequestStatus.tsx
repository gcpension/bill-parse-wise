import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { RequestStatusTracker } from '@/components/wizard/RequestStatusTracker';

const RequestStatus = () => {
  const { requestId: paramRequestId } = useParams();
  const [searchParams] = useSearchParams();
  const urlRequestId = searchParams.get('id');
  
  const [searchRequestId, setSearchRequestId] = useState(paramRequestId || urlRequestId || '');
  const [activeRequestId, setActiveRequestId] = useState<string | null>(paramRequestId || urlRequestId);

  const handleSearch = () => {
    if (searchRequestId.trim()) {
      setActiveRequestId(searchRequestId.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">מעקב אחר בקשת מעבר</h1>
          <p className="text-muted-foreground">
            הזן את מספר הבקשה כדי לעקוב אחר סטטוס המעבר
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle>חיפוש בקשה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="requestId">מספר בקשה</Label>
                <Input
                  id="requestId"
                  value={searchRequestId}
                  onChange={(e) => setSearchRequestId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="SW1640995200001ABC"
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  מספר הבקשה נשלח אליך במייל האישור
                </p>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  חפש
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Status */}
        {activeRequestId && (
          <RequestStatusTracker requestId={activeRequestId} />
        )}

        {/* Help Section */}
        {!activeRequestId && (
          <Card>
            <CardHeader>
              <CardTitle>זקוק לעזרה?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">איפה אני מוצא את מספר הבקשה?</h4>
                  <p className="text-sm text-muted-foreground">
                    מספר הבקשה נשלח אליך במייל האישור מיד לאחר שליחת הבקשה. 
                    חפש מייל עם הנושא "אישור קבלת בקשת מעבר".
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">לא מוצא את המייל?</h4>
                  <p className="text-sm text-muted-foreground">
                    בדוק בתיקיית הספאם או צור איתנו קשר בטלפון 03-1234567 
                    או במייל support@switch-provider.co.il
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">איך נראה מספר בקשה?</h4>
                  <p className="text-sm text-muted-foreground">
                    מספר הבקשה מתחיל באותיות SW ואחריהן 13 ספרות ו-4 אותיות/ספרות, 
                    לדוגמה: SW1234567890ABC
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RequestStatus;