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

        {/* Table Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-4">
          <div className="grid grid-cols-6 gap-4 p-4 border-b font-semibold text-sm text-gray-600">
            <div>חברה</div>
            <div>מחיר</div>
            <div>גלישה</div>
            <div>שיחות</div>
            <div>SMS</div>
            <div className="text-center">פעולות</div>
          </div>

          {/* Table Rows */}
          {plans.slice(0, 10).map((plan, index) => {
            const badge = getCompanyBadge(plan.company);
            
            return (
              <div key={index} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                {/* Company */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {plan.company.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{plan.company}</span>
                      <Badge className={`text-xs px-2 py-1 ${badge.color} border-0`}>
                        {badge.text}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{plan.service}</div>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="text-xl font-bold text-blue-600">
                    {plan.monthlyPrice ? `₪${plan.monthlyPrice}` : '₪89'}
                  </div>
                  <div className="text-xs text-gray-500">לחודש</div>
                </div>

                {/* Data */}
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                  <span className="text-sm">בלתי מוגבל</span>
                </div>

                {/* Calls */}
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                  <span className="text-sm">בלתי מוגבל</span>
                </div>

                {/* SMS */}
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                  <span className="text-sm">בלתי מוגבל</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs px-3 py-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  >
                    פרטים
                  </Button>
                  <Button 
                    size="sm"
                    className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    בחר
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AllPlans;
