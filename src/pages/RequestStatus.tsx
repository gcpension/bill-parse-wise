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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          {/* Page Header */}
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              מעקב אחר בקשת מעבר
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              הזן את מספר הבקשה כדי לעקוב אחר סטטוס המעבר
            </p>
          </div>

          {/* Search Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">חיפוש בקשה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                  <Label htmlFor="requestId" className="text-base font-semibold">מספר בקשה</Label>
                  <Input
                    id="requestId"
                    value={searchRequestId}
                    onChange={(e) => setSearchRequestId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="SW1640995200001ABC"
                    className="font-mono text-lg p-4 bg-white/50 border-border/50"
                  />
                  <p className="text-sm text-muted-foreground">
                    מספר הבקשה נשלח אליך במייל האישור
                  </p>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch} 
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                  >
                    <Search className="h-5 w-5" />
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
            <Card className="bg-white/70 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">זקוק לעזרה?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <h4 className="font-bold text-lg mb-2">איפה אני מוצא את מספר הבקשה?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      מספר הבקשה נשלח אליך במייל האישור מיד לאחר שליחת הבקשה. 
                      חפש מייל עם הנושא "אישור קבלת בקשת מעבר".
                    </p>
                  </div>
                  
                  <div className="p-6 bg-warning/5 rounded-2xl border border-warning/10">
                    <h4 className="font-bold text-lg mb-2">לא מוצא את המייל?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      בדוק בתיקיית הספאם או צור איתנו קשר בטלפון 03-1234567 
                      או במייל support@switch-provider.co.il
                    </p>
                  </div>
                  
                  <div className="p-6 bg-success/5 rounded-2xl border border-success/10">
                    <h4 className="font-bold text-lg mb-2">איך נראה מספר בקשה?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      מספר הבקשה מתחיל באותיות SW ואחריהן 13 ספרות ו-4 אותיות/ספרות, 
                      לדוגמה: SW1234567890ABC
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RequestStatus;