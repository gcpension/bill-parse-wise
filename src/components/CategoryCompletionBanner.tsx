import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ArrowRight, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CategoryCompletionBannerProps {
  isVisible: boolean;
  selectedCategory: string;
  currentAmount: string;
  onAmountChange: (amount: string) => void;
  onCheckAnother: () => void;
  onProceedToPlans: () => void;
  onClose: () => void;
}

export const CategoryCompletionBanner = ({
  isVisible,
  selectedCategory,
  currentAmount,
  onAmountChange,
  onCheckAnother,
  onProceedToPlans,
  onClose
}: CategoryCompletionBannerProps) => {
  const categoryData: Record<string, { name: string; emoji: string; color: string }> = {
    electricity: { name: 'חשמל', emoji: '⚡', color: 'from-yellow-500 to-orange-500' },
    cellular: { name: 'סלולר', emoji: '📱', color: 'from-blue-500 to-indigo-500' },
    internet: { name: 'אינטרנט', emoji: '🌐', color: 'from-purple-500 to-pink-500' },
    tv: { name: 'טלוויזיה', emoji: '📺', color: 'from-red-500 to-pink-500' }
  };

  const category = categoryData[selectedCategory] || { name: '', emoji: '💡', color: 'from-gray-500 to-gray-600' };
  const amount = parseFloat(currentAmount) || 0;
  const estimatedSavings = Math.round(amount * 0.25);
  const yearlySavings = estimatedSavings * 12;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="pointer-events-auto w-full max-w-2xl"
            >
              <Card className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 border-2 border-purple-200 shadow-2xl overflow-hidden">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="absolute left-4 top-4 text-white hover:bg-white/20 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    <div className="text-center">
                      <div className="text-6xl mb-3">{category.emoji}</div>
                      <h2 className="text-3xl font-bold mb-2">קטגוריית {category.name}</h2>
                      <p className="text-white/90 text-lg">הזן את הסכום החודשי הנוכחי שלך</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Amount Input Section */}
                  <div className="mb-8">
                    <Label className="text-lg font-semibold text-gray-800 mb-3 block text-center">
                      כמה אתה משלם כרגע לחודש?
                    </Label>
                    
                    <div className="relative">
                      <Input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => onAmountChange(e.target.value)}
                        placeholder="0"
                        className="text-center text-4xl font-bold h-20 border-2 border-purple-300 focus:border-purple-500 rounded-xl shadow-lg"
                      />
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">₪</span>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                      {[50, 100, 150, 200, 300, 500].map(quickAmount => (
                        <Button
                          key={quickAmount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onAmountChange(quickAmount.toString())}
                          className="border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-500 font-semibold px-4 py-2"
                        >
                          ₪{quickAmount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Savings Estimate */}
                  {amount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-6 mb-8"
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-bold text-green-800">חיסכון משוער</h3>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-1">
                          ₪{estimatedSavings}
                        </div>
                        <p className="text-sm text-green-700 font-medium">לחודש</p>
                        <p className="text-xs text-gray-600 mt-2">
                          (₪{yearlySavings} לשנה!)
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Question Section */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-800">מה הלאה?</h3>
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-gray-600">בחר אם להמשיך למסלולים או לבדוק עוד סקטור</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      onClick={onCheckAnother}
                      variant="outline"
                      className="w-full border-2 border-purple-500 text-purple-700 hover:bg-purple-50 hover:border-purple-600 py-6 text-lg font-bold transition-all duration-300 hover:scale-105"
                      disabled={!amount || amount === 0}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        בדוק עוד סקטור
                      </span>
                    </Button>

                    <Button
                      onClick={onProceedToPlans}
                      className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white py-6 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105"
                      disabled={!amount || amount === 0}
                    >
                      <span className="flex items-center justify-center gap-2">
                        המשך למסלולים
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Button>
                  </div>

                  {amount === 0 && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      * יש להזין סכום כדי להמשיך
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
