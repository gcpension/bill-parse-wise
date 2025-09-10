import { useState } from 'react';
import { Cpu, FileSignature, SearchCheck, ChevronRight } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  title: string;
  bullets: string[];
  gradient: string; // tailwind gradient classes
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: 'הזנת נתונים',
    title: 'מוסיפים את מה שמשלמים היום',
    bullets: [
      'בחירת קטגוריות: חשמל / סלולר / אינטרנט / TV',
      'ספק נוכחי וסכום חודשי',
      'אפשרות להעלאת חשבונית'
    ],
    gradient: 'from-amber-200 to-orange-200 dark:from-amber-800 dark:to-orange-800',
    icon: SearchCheck
  },
  {
    id: 2,
    label: 'ניתוח חכם',
    title: 'אנחנו מנתחים אלפי תעריפים',
    bullets: [
      'השוואת מבצעים בזמן אמת',
      'בדיקת קנסות והתחייבויות',
      'חישוב חיסכון אמיתי נטו'
    ],
    gradient: 'from-sky-200 to-indigo-200 dark:from-sky-800 dark:to-indigo-800',
    icon: Cpu
  },
  {
    id: 3,
    label: 'מעבר מלא',
    title: 'מעבירים אתכם לספק המשתלם',
    bullets: [
      'חתימה דיגיטלית מאובטחת',
      'אנחנו מנתקים ומחברים בשבילכם',
      'מעקב סטטוס בזמן אמת'
    ],
    gradient: 'from-green-200 to-emerald-200 dark:from-green-800 dark:to-emerald-800',
    icon: FileSignature
  }
];

export const InteractiveStepsBanner = () => {
  const [current, setCurrent] = useState(0);
  const step = STEPS[current];
  const Icon = step.icon;

  return (
    <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        {/* Container card */}
        <div className="bg-gradient-to-br from-white/95 via-slate-50/95 to-gray-50/90 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-600/85 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-600/30 p-5 hover:shadow-xl transition-all duration-300">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 dark:bg-slate-700/80 rounded-full border border-slate-300/40 dark:border-slate-600/40">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
              <span className="text-slate-700 dark:text-slate-200 font-fredoka font-semibold text-xs">איך זה עובד – צעדים קצרים וברורים</span>
            </div>
          </div>

          {/* Steps nav */}
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrent(idx)}
                className={`group flex-1 min-w-[0] rounded-xl border px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  current === idx
                    ? 'border-slate-400/60 bg-white/80 dark:bg-slate-700/50 shadow-sm'
                    : 'border-slate-200/50 dark:border-slate-600/40 hover:bg-white/70 dark:hover:bg-slate-700/40'
                }`}
                aria-current={current === idx}
              >
                <div className={`w-8 h-8 mx-auto mb-1 rounded-lg border text-xs font-bold flex items-center justify-center text-slate-800 dark:text-slate-200 bg-gradient-to-br ${s.gradient} border-white/40 dark:border-white/10`}>
                  {idx + 1}
                </div>
                <div className={`text-[11px] font-fredoka font-semibold truncate ${current === idx ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-300'}`}>
                  {s.label}
                </div>
              </button>
            ))}
          </div>

          {/* Progress line */}
          <div className="mt-3 h-1 w-full bg-slate-200/60 dark:bg-slate-600/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-glow to-success transition-all duration-300"
              style={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Detail panel */}
          <div key={step.id} className="mt-4 grid grid-cols-[44px,1fr] gap-3 items-start animate-fade-in">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.gradient} border border-white/50 dark:border-white/10 text-slate-900 dark:text-white`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-fredoka font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">{step.title}</h4>
              <ul className="text-[11px] text-slate-700 dark:text-slate-200 font-comfortaa leading-snug space-y-1 text-right">
                {step.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <ChevronRight className="w-3 h-3 text-primary mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveStepsBanner;
