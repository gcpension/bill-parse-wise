import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface SheetPlan {
  company: string;
  type: string;
  plan: string;
  monthly: number;
  annual: number;
  perk: string;
  term: string;
  sla: string;
}

export interface SheetProvider {
  company: string;
  type: string;
  plans: SheetPlan[];
}

export default function useGoogleSheetCsv(
  csvUrl: string | undefined
): {
  loading: boolean;
  providers: SheetProvider[];
  error?: string;
} {
  const [providers, setProviders] = useState<SheetProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!csvUrl) return;
    setLoading(true);
    setError(undefined);
    fetch(csvUrl)
      .then(async (res) => {
        const text = await res.text();
        return Papa.parse(text, { header: true, skipEmptyLines: true }).data as unknown as any[];
      })
      .then((rows) => {
        const grouped: { [key: string]: SheetProvider } = {};
        (rows as any[]).forEach((row: any) => {
          const company = row["שם החברה"] || row.company;
          const type = row["סוג השירות"] || row.type;
          if (!company || !type) return;
          const monthly = parseFloat(
            row["מחיר חודשי"] || row.monthly || "0"
          );
          const annual =
            parseFloat(row["מחיר שנתי"] || row.annual || "0") ||
            monthly * 12;
          const plan: SheetPlan = {
            company,
            type,
            plan: row["שם המסלול"] || row.plan,
            monthly,
            annual,
            perk: row["הטבות מעבר (אם יש)"] || row.perk || "",
            term: row["זמן התחייבות"] || row.term || "",
            sla: row["SLA / ציון שירות"] || row.sla || "",
          };
          const key = `${company}_${type}`;
          if (!grouped[key]) {
            grouped[key] = {
              company,
              type,
              plans: [],
            };
          }
          grouped[key].plans.push(plan);
        });
        setProviders(Object.values(grouped));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setLoading(false));
  }, [csvUrl]);

  return { loading, providers, error };
}
