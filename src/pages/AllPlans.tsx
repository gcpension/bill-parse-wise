import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Wifi } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ManualPlan } from "@/data/manual-plans";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { extractTextFromImage } from "@/lib/ocr";
import { generateId } from "@/lib/utils";

const PlanCard = ({ plan }: { plan: ManualPlan }) => {
  return (
    <article className="bg-card border border-border rounded-2xl shadow-card hover:shadow-elegant transition-all duration-300 overflow-hidden">
      {/* Header with company name and speed */}
      <header className={`${plan.color} text-white p-6 text-center relative overflow-hidden`}>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-1">{plan.company}</h3>
          <div className="text-4xl font-bold">{plan.speed}</div>
          <p className="text-sm opacity-90 mt-1">{plan.planName}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </header>

      {/* Pricing section */}
      <div className="p-6 text-center border-b border-border/60">
        {plan.priceIntroText ? (
          <>
            <div className="text-2xl font-bold text-foreground mb-1">{plan.priceIntroText}</div>
            {plan.priceAfterText && (
              <div className="text-lg text-muted-foreground">{plan.priceAfterText}</div>
            )}
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-foreground mb-1">
              ₪{plan.introPrice}
              <span className="text-sm font-normal text-muted-foreground mr-1">
                לחודש ל-{plan.introMonths} חודשים הראשונים
              </span>
            </div>
            <div className="text-lg text-muted-foreground">
              לאחר מכן ₪{plan.regularPrice} לחודש
            </div>
          </>
        )}
      </div>

      {/* Speed details */}
      <div className="p-6 border-b border-border/60">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">העלאה עד</span>
            </div>
            <div className="text-2xl font-bold text-primary">{plan.uploadSpeed}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Download className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">הורדה עד</span>
            </div>
            <div className="text-2xl font-bold text-primary">{plan.downloadSpeed}</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="p-6">
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <span className="text-muted-foreground leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <Button className="w-full" size="lg">
          <Wifi className="ml-2 h-4 w-4" />
          בחר מסלול זה
        </Button>
      </div>
    </article>
  );
};

const AllPlans = () => {
  useEffect(() => {
    document.title = "מסלולים לפי תמונות | חסכונט";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "מסלולי אינטרנט מתוך תמונות שהועלו – תצוגה מדויקת לפי המקור");
    }
  }, []);

  type DraftPlan = { id: string; fileName: string; ocrText: string; featuresText: string; plan: ManualPlan };

  const [plans, setPlans] = useState<ManualPlan[]>([]);
  const [drafts, setDrafts] = useState<DraftPlan[]>([]);

  const updateDraft = (id: string, updater: (d: DraftPlan) => DraftPlan) => {
    setDrafts(prev => prev.map(d => (d.id === id ? updater(d) : d)));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const newDrafts: DraftPlan[] = [];
    for (const file of files) {
      try {
        const res = await extractTextFromImage(file);
        newDrafts.push({
          id: generateId(),
          fileName: file.name,
          ocrText: res.text || "",
          featuresText: "",
          plan: {
            id: generateId(),
            company: "",
            planName: "",
            speed: "",
            introPrice: 0,
            introMonths: 0,
            regularPrice: 0,
            priceIntroText: "",
            priceAfterText: "",
            uploadSpeed: "",
            downloadSpeed: "",
            features: [],
            color: "bg-gradient-to-br from-primary/70 to-primary"
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
    setDrafts(prev => [...prev, ...newDrafts]);
    if (e.target) e.target.value = "";
  };

  return (
    <Layout>
      <div dir="rtl" className="min-h-screen container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">מסלולי אינטרנט מתוך תמונות</h1>
          <p className="text-base text-muted-foreground">המסלולים שיוצגו הם אך ורק מהתמונות שתעלה. כרגע נמצאו {plans.length} מסלולים.</p>
        </header>

        {/* Upload Section */}
        <section className="mb-8 p-6 border border-border rounded-2xl bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-2">העלה תמונת מסלול</h2>
          <p className="text-sm text-muted-foreground mb-4">אנא העלה כאן את התמונה שצירפת בצ'אט כדי שנעתיק את הטקסט בדיוק.</p>
          <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
        </section>

        {/* Drafts from OCR */}
        {drafts.length > 0 && (
          <section className="space-y-6 mb-10">
            {drafts.map((draft) => (
              <article key={draft.id} className="p-6 border border-border rounded-2xl bg-card">
                <h3 className="font-semibold mb-2">קובץ: {draft.fileName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-1">טקסט מזוהה (OCR)</Label>
                    <Textarea dir="rtl" value={draft.ocrText} readOnly rows={10} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="block mb-1">חברה</Label>
                      <Input value={draft.plan.company} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, company: e.target.value } }))} />
                    </div>
                    <div>
                      <Label className="block mb-1">שם המסלול</Label>
                      <Input value={draft.plan.planName} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, planName: e.target.value } }))} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="block mb-1">מהירות</Label>
                        <Input value={draft.plan.speed} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, speed: e.target.value } }))} />
                      </div>
                      <div>
                        <Label className="block mb-1">מחיר מבצע (₪)</Label>
                        <Input type="number" value={draft.plan.introPrice} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, introPrice: Number(e.target.value) || 0 } }))} />
                      </div>
                      <div>
                        <Label className="block mb-1">חודשי מבצע</Label>
                        <Input type="number" value={draft.plan.introMonths} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, introMonths: Number(e.target.value) || 0 } }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="block mb-1">מחיר רגיל (₪)</Label>
                        <Input type="number" value={draft.plan.regularPrice} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, regularPrice: Number(e.target.value) || 0 } }))} />
                      </div>
                      <div>
                        <Label className="block mb-1">העלאה</Label>
                        <Input value={draft.plan.uploadSpeed} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, uploadSpeed: e.target.value } }))} />
                      </div>
                      <div>
                        <Label className="block mb-1">הורדה</Label>
                        <Input value={draft.plan.downloadSpeed} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, downloadSpeed: e.target.value } }))} />
                      </div>
                    </div>
                    <div>
                      <Label className="block mb-1">מחיר – שורה עליונה (מדויק כמו בתמונה)</Label>
                      <Input value={draft.plan.priceIntroText ?? ""} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, priceIntroText: e.target.value } }))} />
                    </div>
                    <div>
                      <Label className="block mb-1">מחיר – שורה תחתונה (מדויק כמו בתמונה)</Label>
                      <Input value={draft.plan.priceAfterText ?? ""} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, plan: { ...d.plan, priceAfterText: e.target.value } }))} />
                    </div>
                    <div>
                      <Label className="block mb-1">מאפיינים (שורה לכל מאפיין)</Label>
                      <Textarea rows={5} dir="rtl" value={draft.featuresText} onChange={(e) => updateDraft(draft.id, (d) => ({ ...d, featuresText: e.target.value }))} />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => {
                        const features = draft.featuresText.split('\n').map(f => f.trim()).filter(Boolean);
                        const planToAdd = { ...draft.plan, id: generateId(), features };
                        setPlans((prev) => [...prev, planToAdd]);
                        setDrafts((prev) => prev.filter((x) => x.id !== draft.id));
                      }}>
                        הוסף מסלול
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Plans Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default AllPlans;
