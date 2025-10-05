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
      <DialogContent className="sm:max-w-[600px] glass-card-strong border-2 border-primary/20 shadow-purple-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            בואו נמצא לכם חיסכון!
          </DialogTitle>
          <p className="text-center text-lg text-muted-foreground">
            רק 2 פרטים ואנחנו מוצאים לכם את המסלול הזול ביותר
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-8">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-xl font-semibold">
              איזה שירות?
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-16 text-xl border-2 hover:border-primary transition-all">
                <SelectValue placeholder="בחרו שירות..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value}
                      className="text-xl py-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-xl font-semibold">
              כמה אתם משלמים היום? (חודשי)
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="לדוגמה: 150"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-16 text-xl pl-16 border-2 hover:border-primary transition-all"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-primary">
                ₪
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-16 text-xl font-bold gradient-primary hover:gradient-primary-hover shadow-purple group mt-8"
          >
            <Sparkles className="ml-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
            מצאו לי את הזול ביותר!
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            ⚡ תוצאות מיידיות • ללא עלות • ללא התחייבות
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
