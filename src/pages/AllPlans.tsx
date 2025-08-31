import { useAllPlans } from "@/hooks/useAllPlans";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star } from "lucide-react";
import { Layout } from "@/components/Layout";

const AllPlans = () => {
  const plans = useAllPlans();

  const getCompanyBadge = (company: string) => {
    if (company.includes('איינטוף')) return { text: 'הנחה 25%', color: 'bg-green-100 text-green-700' };
    if (company.includes('פרטנר')) return { text: 'הנחה 24%', color: 'bg-green-100 text-green-700' };
    return { text: 'מובילה', color: 'bg-blue-100 text-blue-700' };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">כל המסלולים</h1>
          <p className="text-muted-foreground">סה"כ נמצאו {plans.length} מסלולים</p>
        </div>

        <div className="space-y-4">
          {plans.slice(0, 10).map((plan, index) => {
            const badge = getCompanyBadge(plan.company);
            
            return (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-6">
                    {/* Company Logo & Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {plan.company.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{plan.company}</h3>
                          <Badge className={`text-xs px-2 py-1 ${badge.color} border-0`}>
                            {badge.text}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {plan.service}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {plan.monthlyPrice ? `₪${plan.monthlyPrice}` : '₪89'}
                      </div>
                      <div className="text-sm text-muted-foreground">לחודש</div>
                      {plan.yearlyPrice && (
                        <div className="text-xs text-gray-400 line-through">
                          ₪{Math.round(plan.yearlyPrice / 12) + 20}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-1 px-8">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>גלישה בלתי מוגבלת</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>שיחות בלתי מוגבלות</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>SMS בלתי מוגבל</span>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 mt-2">
                        +1 תכונות נוספות
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                      >
                        כלל הגבלה
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        שינוי
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AllPlans;
