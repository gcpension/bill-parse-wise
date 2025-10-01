import { ManualPlan } from "@/data/manual-plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, BarChart3, Check, Minus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ComparisonPanelProps {
  plans: ManualPlan[];
  onRemove: (planId: string) => void;
  onClear: () => void;
  maxPlans?: number;
}

export const ComparisonPanel = ({ 
  plans, 
  onRemove, 
  onClear,
  maxPlans = 3 
}: ComparisonPanelProps) => {
  if (plans.length === 0) return null;

  const allFeatures = Array.from(
    new Set(plans.flatMap(p => p.features))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5" />
            <CardTitle className="font-heebo">השוואת מסלולים</CardTitle>
            <Badge variant="secondary">
              {plans.length}/{maxPlans}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onClear}>
            <X className="w-4 h-4 ml-1" />
            נקה הכל
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold font-heebo truncate">{plan.company}</h4>
                    <p className="text-sm text-muted-foreground font-assistant truncate">
                      {plan.planName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(plan.id)}
                    className="h-8 w-8 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {plan.regularPrice > 0 && (
                  <div className="text-2xl font-bold font-heebo">
                    ₪{plan.regularPrice}
                    <span className="text-sm font-normal text-muted-foreground">/חודש</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-heebo">תכונה</TableHead>
                {plans.map(plan => (
                  <TableHead key={plan.id} className="text-center font-heebo">
                    {plan.company}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium font-assistant">מחיר חודשי</TableCell>
                {plans.map(plan => (
                  <TableCell key={plan.id} className="text-center font-bold">
                    ₪{plan.regularPrice}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium font-assistant">מספר תכונות</TableCell>
                {plans.map(plan => (
                  <TableCell key={plan.id} className="text-center">
                    {plan.features?.length || 0}
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Feature Rows */}
              {allFeatures.slice(0, 5).map((feature, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-assistant text-sm">{feature}</TableCell>
                  {plans.map(plan => (
                    <TableCell key={plan.id} className="text-center">
                      {plan.features?.includes(feature) ? (
                        <Check className="w-4 h-4 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 mx-auto text-muted-foreground" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
