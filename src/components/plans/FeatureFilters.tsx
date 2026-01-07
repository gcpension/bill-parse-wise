import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Signal, 
  Wifi, 
  Tv, 
  Zap, 
  Clock, 
  Gift,
  X
} from 'lucide-react';

interface FeatureFiltersProps {
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
  onClearAll: () => void;
  category?: string;
}

interface FeatureOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  categories: string[];
}

const featureOptions: FeatureOption[] = [
  { id: '5g', label: '5G', icon: <Signal className="h-3 w-3" />, categories: ['סלולר'] },
  { id: 'unlimited', label: 'ללא הגבלה', icon: <Zap className="h-3 w-3" />, categories: ['סלולר', 'אינטרנט'] },
  { id: 'fiber', label: 'סיבים', icon: <Wifi className="h-3 w-3" />, categories: ['אינטרנט'] },
  { id: 'no-commitment', label: 'ללא התחייבות', icon: <Clock className="h-3 w-3" />, categories: ['סלולר', 'אינטרנט', 'טלוויזיה', 'חשמל'] },
  { id: 'netflix', label: 'Netflix', icon: <Tv className="h-3 w-3" />, categories: ['טלוויזיה', 'סטרימינג'] },
  { id: 'transfer-bonus', label: 'הטבות מעבר', icon: <Gift className="h-3 w-3" />, categories: ['סלולר', 'אינטרנט', 'טלוויזיה', 'חשמל'] },
];

export const FeatureFilters: React.FC<FeatureFiltersProps> = ({
  selectedFeatures,
  onFeatureToggle,
  onClearAll,
  category = 'all',
}) => {
  // Filter options by category
  const visibleOptions = category === 'all' 
    ? featureOptions 
    : featureOptions.filter(opt => opt.categories.includes(category) || opt.categories.includes('all'));

  if (visibleOptions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleOptions.map((option) => {
        const isSelected = selectedFeatures.includes(option.id);
        return (
          <Badge
            key={option.id}
            variant={isSelected ? 'default' : 'outline'}
            className={`cursor-pointer transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 ${
              isSelected 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-muted'
            }`}
            onClick={() => onFeatureToggle(option.id)}
          >
            {option.icon}
            <span>{option.label}</span>
          </Badge>
        );
      })}
      
      {selectedFeatures.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground h-7 px-2"
        >
          <X className="h-3 w-3 ml-1" />
          נקה
        </Button>
      )}
    </div>
  );
};

// Helper function to filter plans by features
export const filterPlansByFeatures = (
  plans: any[],
  features: string[]
): any[] => {
  if (features.length === 0) return plans;

  return plans.filter(plan => {
    const planText = `${plan.plan} ${plan.commitment || ''} ${plan.transferBenefits || ''}`.toLowerCase();
    
    return features.every(feature => {
      switch (feature) {
        case '5g':
          return planText.includes('5g');
        case 'unlimited':
          return planText.includes('ללא הגבלה') || planText.includes('אינסופי') || planText.includes('unlimited');
        case 'fiber':
          return planText.includes('סיבים') || planText.includes('fiber') || planText.includes('אופטי');
        case 'no-commitment':
          return planText.includes('ללא התחייבות') || planText.includes('בלי התחייבות') || planText.includes('חודש בחודש');
        case 'netflix':
          return planText.includes('netflix') || planText.includes('נטפליקס');
        case 'transfer-bonus':
          return plan.transferBenefits && plan.transferBenefits.length > 5;
        default:
          return true;
      }
    });
  });
};
