import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryCompletionBannerProps {
  isVisible: boolean;
  completedCategory: string;
  onCheckAnother: () => void;
  onProceedToPlans: () => void;
}

export const CategoryCompletionBanner = ({
  isVisible,
  completedCategory,
  onCheckAnother,
  onProceedToPlans
}: CategoryCompletionBannerProps) => {
  const categoryNames: Record<string, string> = {
    electricity: 'חשמל',
    cellular: 'סלולר',
    internet: 'אינטרנט',
    tv: 'טלוויזיה'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
          <Card className="bg-gradient-to-br from-green-50 via-white to-emerald-50 border-2 border-green-500 shadow-2xl">
            <div className="p-6">
              {/* Success Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    מעולה! השלמת את קטגוריית {categoryNames[completedCategory]}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    עכשיו אפשר להמשיך למסלולים או לבדוק עוד סקטור
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="mb-6 text-center">
                <p className="text-lg font-semibold text-gray-800">
                  האם תרצה לבדוק עוד סקטור?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={onCheckAnother}
                  variant="outline"
                  className="w-full border-2 border-purple-500 text-purple-700 hover:bg-purple-50 hover:border-purple-600 py-6 text-base font-semibold transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    כן, בדוק עוד סקטור
                  </span>
                </Button>

                <Button
                  onClick={onProceedToPlans}
                  className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-base font-semibold shadow-lg transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    המשך למסלולים
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
