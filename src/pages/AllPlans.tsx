import { useEffect, useMemo, useState } from "react";
import { useAllPlans } from "@/hooks/useAllPlans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone, MessageSquare, Wifi, Filter, Info } from "lucide-react";
import { Layout } from "@/components/Layout";

const SERVICE_TABS = [
  { key: "all", label: "הכל" },
  { key: "cellular", label: "סלולר" },
  { key: "internet", label: "אינטרנט" },
  { key: "tv", label: "טלוויזיה" },
  { key: "devices", label: "מכשירים" },
] as const;

const iconByKey: Record<string, JSX.Element> = {
  cellular: <Wifi className="h-4 w-4" />, // Using Wifi icon as cellular/data indicator
  internet: <Wifi className="h-4 w-4" />,
  tv: <MessageSquare className="h-4 w-4" />, // Placeholder icon
  devices: <Phone className="h-4 w-4" />, // Placeholder icon
};

const getCompanyBadge = (company: string) => {
  if (company.includes("איינטוף")) return { text: "הנחה 25%", variant: "secondary" as const };
  if (company.includes("פרטנר")) return { text: "הנחה 24%", variant: "secondary" as const };
  return { text: "מובילה", variant: "outline" as const };
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
  if (company.includes("פלאפון")) return { ...base, bg: "bg-blue-500/10", text: "text-blue-500" };
  if (company.includes("מובייל")) return { ...base, bg: "bg-emerald-500/10", text: "text-emerald-600" };
  return base;
};

const featureRow = (icon: JSX.Element, label: string, sub?: string) => (
  <div className="flex items-center justify-center gap-2">
    <CheckCircle2 className="h-5 w-5 text-green-500" />
    <div className="text-sm">
      <div className="font-medium text-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  </div>
);

const PlanCard = ({
  company,
  service,
  price,
  transferBenefits,
  commitment,
}: {
  company: string;
  service: string;
  price: number | null;
  transferBenefits?: string | null;
  commitment?: string | null;
}) => {
  const badge = getCompanyBadge(company);
  const logo = getCompanyLogo(company);

  return (
    <article className="bg-card border border-border rounded-xl shadow-card hover:shadow-elegant transition-shadow duration-300 overflow-hidden">
      <header className="flex items-center gap-3 p-4 border-b border-border/60">
        <div className={`w-12 h-12 ${logo.bg} rounded-xl flex items-center justify-center border border-border/60`}>
          <span className={`text-sm font-bold ${logo.text}`}>{logo.initials}</span>
        </div>
        <div className="flex-1 text-right">
          <h3 className="text-base font-semibold text-foreground leading-tight">{company}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{service}</p>
        </div>
        <Badge variant={badge.variant as any} className="rounded-full text-[11px] px-2 py-0.5">
          {badge.text}
        </Badge>
      </header>

      <div className="p-4 flex flex-col gap-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">₪{price ?? 89}</div>
          <div className="text-xs text-muted-foreground">לחודש</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {featureRow(iconByKey.cellular, "ללא הגבלה", "גלישה מהירה")}
          {featureRow(iconByKey.devices, "ללא הגבלה", "שיחות לכל הרשתות")}
          {featureRow(iconByKey.tv, "ללא הגבלה", "SMS בארץ ובחו" + "\"" + "ל")}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            <span>{transferBenefits ? "הטבות מעבר" : "מבצע חיבור"}</span>
          </div>
          <span>{commitment || "ללא התחייבות"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button size="sm" className="w-full">בחר מסלול</Button>
          <Button variant="outline" size="sm" className="w-full">פרטים נוספים</Button>
        </div>
      </div>
    </article>
  );
};

const AllPlans = () => {
  const plans = useAllPlans();
  const [selectedTab, setSelectedTab] = useState<typeof SERVICE_TABS[number]["key"]>("all");
  const [visible, setVisible] = useState(24);

  useEffect(() => {
    document.title = "כל המסלולים | חסכונט";
  }, []);

  const filteredPlans = useMemo(() => {
    if (selectedTab === "all") return plans;
    // Basic mapping for services if dataset is in Hebrew; adjust mapping as needed
    const map: Record<string, string[]> = {
      cellular: ["סלולר", "cellular", "נייד"],
      internet: ["אינטרנט", "internet", "גלישה"],
      tv: ["טלוויזיה", "tv"],
      devices: ["מכשירים", "devices"],
    };
    return plans.filter((p) => map[selectedTab]?.some((k) => p.service?.includes(k)));
  }, [plans, selectedTab]);

  const shown = filteredPlans.slice(0, visible);

  return (
    <Layout>
      <div dir="rtl" className="min-h-screen">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">כל המסלולים</h1>
          <p className="text-base text-muted-foreground">השווה בין {filteredPlans.length} מסלולים והתחל לחסוך היום</p>
        </header>

        {/* Filters */}
        <section className="bg-card rounded-xl shadow-card border border-border p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mr-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm">סינון לפי שירות</span>
            </div>
            {SERVICE_TABS.map((tab) => (
              <Button
                key={tab.key}
                variant={selectedTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab(tab.key)}
              >
                <span className="ml-2 inline-flex">{iconByKey[tab.key as string]}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Grid of plans */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {shown.map((plan, idx) => (
            <PlanCard
              key={`${plan.company}-${idx}`}
              company={plan.company}
              service={plan.service}
              price={plan.monthlyPrice}
              transferBenefits={plan.transferBenefits}
              commitment={plan.commitment}
            />
          ))}
        </section>

        {/* Load More */}
        {visible < filteredPlans.length && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + 24)}>
              טען עוד מסלולים ({filteredPlans.length - visible} נוספים)
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllPlans;
