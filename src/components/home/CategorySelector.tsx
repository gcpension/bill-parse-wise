import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Zap, Smartphone, Wifi, Tv } from 'lucide-react';
import { InteractiveProviderGrid } from '@/components/InteractiveProviderGrid';
import { cn } from '@/lib/utils';
import electricityFamily from '@/assets/electricity-family.jpg';
import cellularFamily from '@/assets/cellular-family.jpg';
import internetFamily from '@/assets/internet-family.jpg';
import tvFamily from '@/assets/tv-family.jpg';

interface CategoryData {
  name: string;
  icon: React.ComponentType<any>;
  image: string;
  providers: string[];
}

interface CategoryState {
  provider: string;
  amount: string;
  selected: boolean;
}

interface CategorySelectorProps {
  selectedCategories: Record<string, CategoryState>;
  onCategorySelect: (category: string) => void;
  onProviderChange: (category: string, provider: string) => void;
  onAmountChange: (category: string, amount: string) => void;
}

const categoryData: Record<string, CategoryData> = {
  electricity: {
    name: 'חשמל',
    icon: Zap,
    image: electricityFamily,
    providers: ['חברת החשמל', 'פז אנרגיה', 'אלקטרה פאוור', 'דור אלון אנרגיה', 'סלקום אנרגיה']
  },
  cellular: {
    name: 'סלולר', 
    icon: Smartphone,
    image: cellularFamily,
    providers: ['פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', '019 מובייל']
  },
  internet: {
    name: 'אינטרנט',
    icon: Wifi,
    image: internetFamily,
    providers: ['בזק', 'הוט', 'פרטנר', 'סלקום', 'אורנג']
  },
  tv: {
    name: 'טלוויזיה',
    icon: Tv,
    image: tvFamily,
    providers: ['יס', 'הוט', 'סלקום TV', 'פרטנר TV', 'נטפליקס']
  }
};

export const CategorySelector = ({ 
  selectedCategories, 
  onCategorySelect, 
  onProviderChange, 
  onAmountChange 
}: CategorySelectorProps) => {
  return (
    <section id="services" className="py-16 bg-gray-50 relative scroll-mt-20">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heebo font-medium text-royal-purple mb-4 animate-fade-in opacity-0"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            בחרו את הקטגוריה שלכם
          </h2>
          <p className="text-lg text-purple-600 font-assistant animate-fade-in opacity-0"
             style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            קבלו המלצות מותאמות אישית והשוו מחירים בכל הקטגוריות
          </p>
        </div>
        
        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryData).map(([category, data], index) => {
            const Icon = data.icon;
            const isSelected = selectedCategories[category].selected;
            
            return (
              <Card 
                key={category}
                className={`bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 transform hover:scale-105 hover:-translate-y-1 animate-fade-in opacity-0 ${
                  isSelected ? 'ring-2 ring-purple-500 shadow-lg scale-105 md:col-span-4' : ''
                }`}
                style={{ 
                  animationDelay: `${0.6 + index * 0.1}s`, 
                  animationFillMode: 'forwards' 
                }}
                onClick={() => !isSelected && onCategorySelect(category)}
              >
                <CardContent className={`${isSelected ? 'p-6' : 'p-4'} ${isSelected ? '' : 'text-center'}`}>
                  {!isSelected ? (
                    // Compact view when not selected
                    <>
                      {/* Image illustration */}
                      <div className="w-full h-16 mx-auto mb-3 overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105">
                        <img 
                          src={data.image}
                          alt={`איור ${data.name}`}
                          className="w-full h-full object-cover transition-all duration-300 hover:brightness-110"
                        />
                      </div>
                      
                      {/* Category title */}
                      <h3 className="text-base font-heebo font-medium text-purple-700 mb-3 transition-colors duration-200">
                        {data.name}
                      </h3>
                      
                      {/* Button */}
                      <Button 
                        className="w-full h-8 rounded-lg font-medium text-xs transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCategorySelect(category);
                        }}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <Icon className="w-3 h-3" />
                          בחר {data.name}
                        </span>
                      </Button>
                    </>
                  ) : (
                    // Expanded view when selected
                    <>
                      {/* Category Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {data.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            השווה ספקים וחסוך בחשבונות
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCategorySelect(category)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          ביטול
                        </Button>
                      </div>
                      
                      {/* Form fields when selected */}
                      <div className="space-y-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <InteractiveProviderGrid
                          category={category as 'electricity' | 'cellular' | 'internet' | 'tv'}
                          value={selectedCategories[category].provider}
                          onValueChange={(value) => onProviderChange(category, value)}
                        />
                        
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span className="text-lg">₪</span>
                            סכום חודשי
                          </label>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="הזינו סכום בשקלים"
                              value={selectedCategories[category].amount}
                              onChange={(e) => onAmountChange(category, e.target.value)}
                              className="h-12 pr-12 text-lg font-semibold bg-gray-50/80 border-gray-300 hover:border-purple-400 focus:border-purple-500 transition-all duration-300 rounded-xl"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">
                              ₪
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status indicator */}
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">קטגוריה נבחרה בהצלחה</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};