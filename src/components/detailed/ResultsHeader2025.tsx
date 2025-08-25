import { Share, Download, RotateCcw, Sparkles, TrendingUp, Zap, Award } from 'lucide-react';
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
    <div className="relative">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 rounded-3xl"></div>
      <div 
        className="absolute inset-0 opacity-30 rounded-3xl"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%),
            linear-gradient(90deg, transparent 49%, rgba(139, 92, 246, 0.1) 50%, transparent 51%),
            linear-gradient(180deg, transparent 49%, rgba(99, 102, 241, 0.1) 50%, transparent 51%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 20px 20px, 20px 20px'
        }}
      ></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-pulse opacity-80 animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-70 animation-delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 md:p-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  2025
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> AI</span>
                </h1>
                <p className="text-gray-300 text-sm">תוצאות ניתוח מתקדמות</p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                החיסכון שלך מחושב ומוכן 🚀
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl">
                המערכת שלנו ניתחה את הנתונים שלך והפיקה תוצאות מדויקות בזמן אמת.
                גלה כמה תוכל לחסוך החל מהחודש הקרוב.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={onShare} 
              className="bg-purple-600 hover:bg-purple-700 text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Share className="ml-2 h-4 w-4" />
              שתף תוצאות
            </Button>
            <Button 
              onClick={onDownload}
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              <Download className="ml-2 h-4 w-4" />
              הורד PDF
            </Button>
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="text-gray-400 hover:text-white hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <RotateCcw className="ml-2 h-4 w-4" />
              ניתוח חדש
            </Button>
          </div>
        </div>

        {/* Savings Display */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Savings */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-green-300 font-medium">חיסכון חודשי</span>
                </div>
                <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                  ₪ / חודש
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                ₪{monthly.toLocaleString('he-IL')}
              </div>
              <div className="text-sm text-gray-400">
                חיסכון מיידי החל מהחודש הבא
              </div>
            </div>
          </div>

          {/* Annual Savings */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-blue-300 font-medium">חיסכון שנתי</span>
                </div>
                <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                  ₪ / שנה
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                ₪{annual.toLocaleString('he-IL')}
              </div>
              <div className="text-sm text-gray-400">
                סה"כ חיסכון בשנה הקרובה
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300 font-medium">תוצאות מעודכנות</span>
          </div>
        </div>
      </div>
    </div>
  );
};
