import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Bell, 
  Eye, 
  Download,
  Share,
  RefreshCw
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

interface SavingsData {
  category: string;
  currentProvider: string;
  recommendedProvider: string;
  monthlySavings: number;
  annualSavings: number;
  switchDate?: Date;
  status: 'active' | 'pending' | 'completed';
}

export const Dashboard = () => {
  const [savingsData, setSavingsData] = useState<SavingsData[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [yearlyProjection, setYearlyProjection] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('userSavingsData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSavingsData(data);
      
      const monthly = data.reduce((sum: number, item: SavingsData) => 
        sum + item.monthlySavings, 0);
      const yearly = data.reduce((sum: number, item: SavingsData) => 
        sum + item.annualSavings, 0);
      
      setTotalSavings(monthly);
      setYearlyProjection(yearly);
    }
  }, []);

  const handleRefreshAnalysis = () => {
    toast({
      title: "מעדכן נתונים...",
      description: "בודק מחירים עדכניים וחבילות חדשות",
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "הנתונים עודכנו! 🎉",
        description: "נמצאו 2 הזדמנויות חיסכון חדשות",
      });
    }, 2000);
  };

  const handleShareResults = () => {
    navigator.clipboard.writeText(`חסכתי ₪${totalSavings.toLocaleString()} בחודש בזכות המערכת!`);
    toast({
      title: "הועתק ללוח! 📋",
      description: "כעת תוכל לשתף את החיסכון שלך",
    });
  };

  const progressToTarget = Math.min((totalSavings / 1000) * 100, 100);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              הדשבורד האישי שלי
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              מעקב אחר החיסכון והמלצות מותאמות אישית
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefreshAnalysis}>
              <RefreshCw className="ml-2 h-4 w-4" />
              עדכן נתונים
            </Button>
            <Button variant="outline" onClick={handleShareResults}>
              <Share className="ml-2 h-4 w-4" />
              שתף
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">חיסכון חודשי</p>
                  <p className="text-3xl font-bold text-success">
                    ₪{totalSavings.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-success/20 rounded-full">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">חיסכון שנתי</p>
                  <p className="text-3xl font-bold text-primary">
                    ₪{yearlyProjection.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-primary/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ספקים פעילים</p>
                  <p className="text-3xl font-bold">{savingsData.length}</p>
                </div>
                <div className="p-3 bg-accent rounded-full">
                  <Eye className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">יעד חודשי</p>
                  <p className="text-lg font-semibold">₪1,000</p>
                  <Progress value={progressToTarget} className="mt-2" />
                </div>
                <div className="p-3 bg-warning/20 rounded-full">
                  <Calendar className="h-6 w-6 text-warning-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Savings */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              החיסכונים הפעילים שלי
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savingsData.length > 0 ? (
              <div className="space-y-4">
                {savingsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.category}</span>
                        <Badge variant={
                          item.status === 'completed' ? 'default' :
                          item.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {item.status === 'completed' ? 'הושלם' :
                           item.status === 'pending' ? 'בהמתנה' : 'פעיל'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        מ{item.currentProvider} → {item.recommendedProvider}
                      </p>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-success">
                        ₪{item.monthlySavings}/חודש
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ₪{item.annualSavings}/שנה
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  עדיין לא ביצעת השוואת מחירים
                </p>
                <Button>
                  <TrendingUp className="ml-2 h-4 w-4" />
                  התחל לחסוך עכשיו
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="shadow-elegant bg-gradient-to-br from-primary/5 to-primary-glow/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              המלצות לחיסכון נוסף
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white/80 rounded-lg border border-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-primary">מבצע חדש - חבילת אינטרנט</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      HOT מציעה חבילת סיבים אופטיים במחיר מיוחד - חיסכון של ₪30 בחודש
                    </p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">חדש!</Badge>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 rounded-lg border border-success/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-success">עדכון תעריפי חשמל</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      חברת החשמל עדכנה תעריפים - בדוק אם יש לך הזדמנות לחיסכון נוסף
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    בדוק עכשיו
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};