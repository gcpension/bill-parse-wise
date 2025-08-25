import { Share, Download, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface ResultsHeader2025Props {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  onShare: () => void;
  onDownload: () => void;
  onBack: () => void;
}

export const ResultsHeader2025 = ({
  totalMonthlySavings,
  totalAnnualSavings,
  onShare,
  onDownload,
  onBack,
}: ResultsHeader2025Props) => {
  const monthly = useAnimatedCounter({ end: totalMonthlySavings, duration: 1600 });
  const annual = useAnimatedCounter({ end: totalAnnualSavings, duration: 2000 });

  return (
    <section aria-labelledby="results-2025-title" className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-glow bg-gradient-primary text-primary-foreground">
      {/* Techy animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-primary-glow/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-success-glow/30 blur-3xl animate-pulse [animation-delay:700ms]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, hsl(var(--primary-glow)) 0, transparent 40%), radial-gradient(circle at 80% 80%, hsl(var(--success)) 0, transparent 35%)' }} />
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-sm/6 text-primary-foreground/80">תוצאות הניתוח • 2025</span>
          </div>

          <h1 id="results-2025-title" className="text-3xl md:text-5xl font-black tracking-tight">
            ניתוח חכם. תוצאות מיידיות.
          </h1>
          <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
            מציגים את החיסכון הכולל שלך בזמן אמת, עם המלצות מותאמות והתקדמות מהירה לשלב הבא.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <div className="relative bg-white/15 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
            <div className="text-xs text-primary-foreground/70 mb-1">חיסכון חודשי</div>
            <div className="text-3xl md:text-4xl font-black">{formatCurrency(monthly)}</div>
            <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur" />
          </div>
          <div className="relative bg-white/15 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
            <div className="text-xs text-primary-foreground/70 mb-1">חיסכון שנתי</div>
            <div className="text-3xl md:text-4xl font-black">{formatCurrency(annual)}</div>
            <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur" />
          </div>
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onShare} className="hover-scale">
          <Share className="ml-2 h-4 w-4" />
          שתף
        </Button>
        <Button variant="secondary" onClick={onDownload} className="hover-scale">
          <Download className="ml-2 h-4 w-4" />
          הורד דוח
        </Button>
        <Button variant="outline" onClick={onBack} className="hover-scale">
          <RotateCcw className="ml-2 h-4 w-4" />
          נתח עוד
        </Button>
      </div>
    </section>
  );
};
