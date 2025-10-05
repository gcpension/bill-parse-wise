import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Smartphone, Wifi, Tv, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';

interface QuickStartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickStartModal = ({ isOpen, onClose }: QuickStartModalProps) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const categories = [
    { value: 'electricity', label: 'חשמל', icon: Zap },
    { value: 'cellular', label: 'סלולר', icon: Smartphone },
    { value: 'internet', label: 'אינטרנט', icon: Wifi },
    { value: 'tv', label: 'טלוויזיה', icon: Tv },
  ];

  const handleSubmit = () => {
    if (!category || !amount) {
      enhancedToast.warning({
        title: 'חסרים פרטים',
        description: 'אנא בחרו קטגוריה והזינו סכום חודשי'
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      enhancedToast.warning({
        title: 'סכום לא תקין',
        description: 'אנא הזינו סכום חודשי תקין'
      });
      return;
    }

    // Store data for AllPlans page
    localStorage.setItem('analysisData', JSON.stringify([{
      category,
      amount: numAmount,
      provider: '',
      selected: true
    }]));
    localStorage.setItem('selectedCategories', JSON.stringify([category]));
    
    onClose();
    navigate('/all-plans');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-50 to-pink-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-900 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            בואו נמצא לכם חיסכון!
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            רק 2 פרטים ואנחנו מוצאים לכם את ההצעה הזולה ביותר
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-lg font-semibold text-purple-900">
              איזה שירות?
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-14 text-lg border-2 border-purple-200 bg-white hover:border-purple-400 transition-colors">
                <SelectValue placeholder="בחרו שירות..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value}
                      className="text-lg py-3 cursor-pointer hover:bg-purple-50"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-purple-600" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg font-semibold text-purple-900">
              כמה אתם משלמים היום? (חודשי)
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="לדוגמה: 150"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-14 text-lg pl-12 border-2 border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 transition-colors"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-purple-600">
                ₪
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="ml-2 h-6 w-6" />
            מצאו לי את הזול ביותר!
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            ⚡ תוצאות מיידיות תוך שניות
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
