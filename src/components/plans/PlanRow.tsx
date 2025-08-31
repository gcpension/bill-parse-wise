import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Info } from "lucide-react";
import React from "react";

export type PlanRowProps = {
  company: string;
  planName?: string | null;
  service: string;
  price: number | null;
  yearlyPrice?: number | null;
  transferBenefits?: string | null;
  commitment?: string | null;
};

const getCompanyLogo = (company: string) => {
  const firstTwo = company.slice(0, 2);
  const base = {
    initials: firstTwo,
    bg: "bg-accent/40",
    text: "text-foreground",
  };
  if (company.includes("איינטוף")) return { ...base, bg: "bg-primary/10", text: "text-primary" };
  if (company.includes("פרטנר")) return { ...base, bg: "bg-secondary/30", text: "text-secondary-foreground" };
  if (company.includes("פלאפון")) return { ...base, bg: "bg-accent/40", text: "text-foreground" };
  return base;
};

const getCompanyBadge = (company: string) => {
  if (company.includes("איינטוף")) return { text: "25% הנחה", variant: "secondary" as const };
  if (company.includes("פרטנר")) return { text: "24% הנחה", variant: "secondary" as const };
  return { text: "מובילה", variant: "outline" as const };
};

export const PlanRow: React.FC<PlanRowProps> = ({
  company,
  planName,
  service,
  price,
  yearlyPrice,
  transferBenefits,
  commitment,
}) => {
  const logo = getCompanyLogo(company);
  const badge = getCompanyBadge(company);

  const monthlyFromYear = yearlyPrice ? Math.round((yearlyPrice || 0) / 12) : null;
  const showOriginal = monthlyFromYear !== null && price !== null && monthlyFromYear > price;

  return (
    <article className="bg-card border border-border rounded-2xl shadow-card hover:shadow-elegant transition-all duration-300 overflow-hidden">
      <div className="grid grid-cols-12 items-center gap-4 p-4 md:p-5" dir="rtl">
        {/* Provider + badges */}
        <div className="col-span-12 md:col-span-3 flex items-center gap-3">
          <div className={`w-12 h-12 ${logo.bg} rounded-xl flex items-center justify-center border border-border/60`}>
            <span className={`text-sm font-bold ${logo.text}`}>{logo.initials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <h3 className="text-base font-semibold text-foreground leading-tight">{company}</h3>
              <Badge variant={badge.variant as any} className="rounded-full text-[11px] px-2 py-0.5">{badge.text}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 text-right">{service}</p>
          </div>
        </div>

        {/* Plan name + highlight */}
        <div className="col-span-12 md:col-span-3 text-right">
          <div className="flex items-center justify-end gap-2 flex-wrap">
            {planName && <span className="text-sm font-medium text-foreground">{planName}</span>}
            <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs">ללא הגבלה</span>
          </div>
          {transferBenefits && (
            <p className="text-[11px] mt-1 text-muted-foreground">הטבות מעבר זמינות</p>
          )}
        </div>

        {/* Price */}
        <div className="col-span-6 md:col-span-2 text-right">
          <div className="flex items-baseline justify-end gap-2">
            <div className="text-3xl font-bold text-primary">₪{price ?? 89}</div>
            {showOriginal && (
              <div className="text-sm text-muted-foreground line-through">₪{monthlyFromYear}</div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">לחודש</div>
        </div>

        {/* Features */}
        <div className="col-span-6 md:col-span-3">
          <ul className="space-y-1">
            <li className="flex items-center gap-2 justify-end">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm">גלישה בלתי מוגבלת</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm">שיחות בלתי מוגבלות</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm">SMS בלתי מוגבל</span>
            </li>
            <li className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              <span>תכונות נוספות +1</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="col-span-12 md:col-span-1 flex md:justify-start justify-end">
          <Button size="sm" className="px-6">עבור</Button>
        </div>
      </div>
    </article>
  );
};

export default PlanRow;
