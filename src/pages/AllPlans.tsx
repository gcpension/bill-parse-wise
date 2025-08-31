import { useAllPlans } from "@/hooks/useAllPlans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone, MessageSquare, Wifi } from "lucide-react";
import { Layout } from "@/components/Layout";

const AllPlans = () => {
  const plans = useAllPlans();

  const getCompanyBadge = (company: string) => {
    if (company.includes('איינטוף')) return { text: 'הנחה 25%', color: 'bg-green-100 text-green-700' };
    if (company.includes('פרטנר')) return { text: 'הנחה 24%', color: 'bg-green-100 text-green-700' };
    return { text: 'מובילה', color: 'bg-blue-100 text-blue-700' };
  };

  const getCompanyLogo = (company: string) => {
    // Return company initials with colors
    const firstTwo = company.slice(0, 2);
    return {
      initials: firstTwo,
      bgColor: company.includes('איינטוף') ? 'bg-orange-100' : 
               company.includes('פרטנר') ? 'bg-purple-100' : 
               company.includes('פלאפון') ? 'bg-blue-100' :
               company.includes('מובייל') ? 'bg-green-100' : 'bg-gray-100',
      textColor: company.includes('איינטוף') ? 'text-orange-600' : 
                 company.includes('פרטנר') ? 'text-purple-600' : 
                 company.includes('פלאפון') ? 'text-blue-600' :
                 company.includes('מובייל') ? 'text-green-600' : 'text-gray-600'
    };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">כל המסלולים הזמינים</h1>
            <p className="text-xl text-gray-600">השווה בין {plans.length} מסלולים והתחל לחסוך היום</p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Wifi className="h-4 w-4 ml-2" />
                סלולר
              </Button>
              <Button variant="outline">אינטרנט</Button>
              <Button variant="outline">טלוויזיה</Button>
              <Button variant="outline">מכשירים</Button>
            </div>
          </div>

          {/* Plans Table */}
          <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b">
              <div className="grid grid-cols-7 gap-4 p-6 font-semibold text-gray-700">
                <div className="text-right">ספק</div>
                <div className="text-center">מחיר חודשי</div>
                <div className="text-center">
                  <Wifi className="h-4 w-4 mx-auto mb-1" />
                  גלישה
                </div>
                <div className="text-center">
                  <Phone className="h-4 w-4 mx-auto mb-1" />
                  שיחות
                </div>
                <div className="text-center">
                  <MessageSquare className="h-4 w-4 mx-auto mb-1" />
                  SMS
                </div>
                <div className="text-center">הטבות</div>
                <div className="text-center">פעולות</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {plans.slice(0, 15).map((plan, index) => {
                const badge = getCompanyBadge(plan.company);
                const logo = getCompanyLogo(plan.company);
                
                return (
                  <div key={index} className="grid grid-cols-7 gap-4 p-6 hover:bg-gray-50 transition-colors duration-200">
                    {/* Company */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${logo.bgColor} rounded-xl flex items-center justify-center border-2 border-white shadow-sm`}>
                        <span className={`text-sm font-bold ${logo.textColor}`}>
                          {logo.initials}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 text-base mb-1">{plan.company}</div>
                        <Badge className={`text-xs px-3 py-1 ${badge.color} border-0 rounded-full`}>
                          {badge.text}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">{plan.service}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        ₪{plan.monthlyPrice || 89}
                      </div>
                      <div className="text-sm text-gray-500">לחודש</div>
                      {plan.yearlyPrice && (
                        <div className="text-xs text-gray-400 line-through mt-1">
                          ₪{Math.round(plan.yearlyPrice / 12) + 20}
                        </div>
                      )}
                    </div>

                    {/* Data */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-900">ללא הגבלה</span>
                      </div>
                      <div className="text-sm text-gray-500">גלישה מהירה</div>
                    </div>

                    {/* Calls */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-900">ללא הגבלה</span>
                      </div>
                      <div className="text-sm text-gray-500">כל הרשתות</div>
                    </div>

                    {/* SMS */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-900">ללא הגבלה</span>
                      </div>
                      <div className="text-sm text-gray-500">בארץ ובחו"ל</div>
                    </div>

                    {/* Benefits */}
                    <div className="text-center">
                      <div className="text-sm text-gray-900 font-medium mb-1">
                        {plan.transferBenefits ? '✓ הטבות מעבר' : '✓ מבצע חיבור'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {plan.commitment || 'ללא התחייבות'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="text-center space-y-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                        size="sm"
                      >
                        בחר מסלול
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 rounded-lg"
                      >
                        פרטים נוספים
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" className="px-8 py-3 text-lg">
              טען עוד מסלולים ({plans.length - 15} נוספים)
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllPlans;