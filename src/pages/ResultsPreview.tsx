import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ResultsPreview = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">תוצאות הניתוח</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              חזרה
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>תוצאות הושלמו בהצלחה</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                הניתוח הושלם. ניתן לחזור לעמוד הניתוח לצפייה בתוצאות מפורטות.
              </p>
              <div className="mt-4">
                <Button onClick={() => navigate('/analyze')}>
                  חזור לעמוד הניתוח
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPreview;
