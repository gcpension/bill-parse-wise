import { useAllPlans } from "@/hooks/useAllPlans";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star } from "lucide-react";
import { Layout } from "@/components/Layout";

const AllPlans = () => {
  const plans = useAllPlans();

  // Group plans by company
  const plansByCompany = plans.reduce((acc: any, plan) => {
    if (!acc[plan.company]) {
      acc[plan.company] = [];
    }
    acc[plan.company].push(plan);
    return acc;
  }, {});

  const getCompanyLogo = (company: string) => {
    // Return appropriate logo or placeholder
    return company;
  };

  const getCompanyBadge = (company: string) => {
    if (company.includes('פלאפון')) return { text: 'מובילה', variant: 'default' as const };
    if (company.includes('פרטנר')) return { text: 'הנחה 25%', variant: 'secondary' as const };
    return { text: 'מובילה', variant: 'outline' as const };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">כל המסלולים</h1>
          <p className="text-muted-foreground">סה"כ נמצאו {plans.length} מסלולים</p>
        </div>

        <div className="space-y-6">
          {Object.entries(plansByCompany).map(([company, companyPlans]: [string, any]) => (
            <Card key={company} className="overflow-hidden">
              <CardContent className="p-0">
                {companyPlans.map((plan: any, index: number) => {
                  const badge = getCompanyBadge(company);
                  const isFirst = index === 0;
                  
                  return (
                    <div key={index} className={`p-6 ${!isFirst ? 'border-t' : ''}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Company Info */}
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {getCompanyLogo(company)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{plan.plan || company}</h3>
                              {isFirst && (
                                <Badge variant={badge.variant} className="text-xs">
                                  {badge.text}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{company}</span>
                              {isFirst && (
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Plan Details */}
                        <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                          {/* Price */}
                          <div className="text-center md:text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {plan.monthlyPrice ? `₪${plan.monthlyPrice}` : 'מחיר לפי פנייה'}
                            </div>
                            <div className="text-sm text-muted-foreground">לחודש</div>
                            {plan.yearlyPrice && (
                              <div className="text-xs text-muted-foreground line-through">
                                ₪{Math.round(plan.yearlyPrice / 12)}
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                            {plan.transferBenefits && (
                              <div className="text-xs text-blue-600 mt-2">
                                +1 תכונות נוספות
                              </div>
                            )}
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
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AllPlans;
