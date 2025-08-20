import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">דשבורד חיסכון</h1>
          <p className="text-muted-foreground">
            סקירת עלויות והמלצות חיסכון עבור החודש הנוכחי
          </p>
        </div>
        
        <Link to="/upload">
          <Button>
            <Upload className="ml-2 h-4 w-4" />
            העלה חשבונית ראשונה
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה״כ החודש</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪869</div>
            <div className="flex items-center text-xs text-muted-foreground">
              השוואה לחודש הקודם
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חיסכון פוטנציאלי</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₪70</div>
            <div className="text-xs text-muted-foreground">
              חיסכון חודשי אפשרי
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ברוכים הבאים למחשבון החיסכון</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            האפליקציה מוכנה לשימוש! העלו חשבוניות כדי להתחיל לנתח את ההוצאות שלכם.
          </p>
          <Link to="/upload">
            <Button>
              <Upload className="ml-2 h-4 w-4" />
              התחילו כאן - העלו חשבונית
            </Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  );
};