import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator } from 'lucide-react';

interface CTASectionProps {
  selectedCategories: Record<string, { provider: string; amount: string; selected: boolean }>;
  onStartAnalysis: () => void;
}

export const CTASection = ({ selectedCategories, onStartAnalysis }: CTASectionProps) => {
  const hasSelectedCategories = Object.values(selectedCategories).some(
    category => category.selected && category.provider && category.amount
  );

  if (!hasSelectedCategories) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-heebo">
            מוכנים לגלות כמה תחסכו?
          </h2>
          <p className="text-xl text-purple-100 mb-8 font-assistant">
            לחצו כאן לקבלת ניתוח מפורט והמלצות מותאמות אישית שיחסכו לכם אלפי שקלים בשנה
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              onClick={onStartAnalysis}
              className="group bg-white text-purple-700 hover:bg-purple-50 hover:scale-105 font-bold text-xl px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl"
            >
              <Calculator className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
              התחל ניתוח חיסכון
              <ArrowRight className="w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-purple-200 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ללא עלות
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              תוצאות מיידיות
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ללא התחייבות
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};