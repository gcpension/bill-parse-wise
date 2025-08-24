import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Zap,
  Smartphone,
  Wifi,
  Tv,
  Star,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface Recommendation {
  id: string;
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  title: string;
  description: string;
  potential_savings: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  provider: string;
  validUntil?: Date;
  conditions?: string[];
}

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi,
  tv: Tv
};

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר', 
  internet: 'אינטרנט',
  tv: 'טלוויזיה'
};

export const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI-powered recommendations based on user data and market trends
    const generateRecommendations = () => {
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          category: 'electricity',
          title: 'חבילת חשמל ירוק חדשה',
          description: 'Energia חושפת חבילה חדשה עם אנרגיה מתחדשת ב-15% פחות מהתעריף הרגיל',
          potential_savings: 180,
          priority: 'high',
          actionable: true,
          provider: 'Energia',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          conditions: ['לקוחות חדשים בלבד', 'התחייבות ל-12 חודשים']
        },
        {
          id: '2',
          category: 'cellular',
          title: 'מבצע סוף שנה - רמי לוי',
          description: 'חבילה חדשה עם 100GB ושיחות ללא הגבלה במחיר מיוחד לזמן מוגבל',
          potential_savings: 45,
          priority: 'high',
          actionable: true,
          provider: 'רמי לוי',
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
        {
          id: '3',
          category: 'internet',
          title: 'שדרוג חינם לסיבים אופטיים',
          description: 'Cellcom מציעה שדרוג חינם לסיבים אופטיים ללקוחות קיימים',
          potential_savings: 0,
          priority: 'medium',
          actionable: true,
          provider: 'Cellcom',
          conditions: ['ללקוחות קיימים מעל 6 חודשים']
        },
        {
          id: '4',
          category: 'tv',
          title: 'חבילת סטרימינג משותפת',
          description: 'Netflix + Disney+ + Apple TV+ בחבילה אחת - חיסכון של 40% לעומת תשלום נפרד',
          potential_savings: 65,
          priority: 'medium',
          actionable: false,
          provider: 'חבילה משותפת'
        }
      ];

      setRecommendations(mockRecommendations);
      setLoading(false);
    };

    // Simulate API delay
    setTimeout(generateRecommendations, 1000);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'דחוף';
      case 'medium': return 'בינוני';
      case 'low': return 'נמוך';
      default: return '';
    }
  };

  const handleTakeAction = (recommendation: Recommendation) => {
    const { toast } = useToast();
    
    // Navigate to comparison page with recommendation context
    logger.info('User taking action on recommendation', 'SmartRecommendations', {
      recommendationId: recommendation.id,
      category: recommendation.category,
      estimatedSavings: recommendation.potential_savings
    });
    
    // Here you would integrate with the comparison/switching flow
    // For now, we'll show a toast with the action
    toast({
      title: 'מעבר להשוואה',
      description: `מתחיל תהליך השוואה עבור ${recommendation.title}`,
    });
  };

  if (loading) {
    return (
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary animate-pulse" />
            ההמלצות החכמות שלי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          ההמלצות החכמות שלי
          <Badge variant="secondary" className="mr-auto">
            {recommendations.length} המלצות
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const Icon = categoryIcons[rec.category];
            const isUrgent = rec.validUntil && rec.validUntil < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            
            return (
              <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {categoryNames[rec.category]} • {rec.provider}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {getPriorityText(rec.priority)}
                    </Badge>
                    {rec.potential_savings > 0 && (
                      <Badge variant="outline" className="text-success border-success">
                        ₪{rec.potential_savings}/חודש
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mb-3">{rec.description}</p>

                {rec.conditions && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">תנאים:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {rec.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.validUntil && (
                  <Alert className={`mb-3 ${isUrgent ? 'border-destructive' : 'border-warning'}`}>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <span className={isUrgent ? 'text-destructive font-medium' : 'text-warning-foreground'}>
                        {isUrgent ? 'זמן מוגבל! ' : ''}
                        תקף עד: {rec.validUntil.toLocaleDateString('he-IL')}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {rec.potential_savings > 0 && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-success" />
                        חיסכון ₪{(rec.potential_savings * 12).toLocaleString()} בשנה
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning fill-current" />
                      המלצה אישית
                    </span>
                  </div>
                  
                  {rec.actionable && (
                    <Button 
                      size="sm" 
                      onClick={() => handleTakeAction(rec)}
                      className={isUrgent ? 'bg-destructive hover:bg-destructive/90' : ''}
                    >
                      {isUrgent ? 'פעל עכשיו' : 'בדוק אפשרות'}
                      <ArrowRight className="mr-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};