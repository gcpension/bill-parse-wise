import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown, Search, Building2, Zap, Smartphone, Wifi, Tv, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'electricity' | 'cellular' | 'internet' | 'tv';

interface ProviderSelectorProps {
  category: Category;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const categoryProviders = {
  electricity: [
    { name: 'חברת חשמל', popular: true, logo: '⚡' },
    { name: 'פז אנרגיה', popular: true, logo: '🔋' },
    { name: 'אלקטרה פאוור', popular: true, logo: '⚡' },
    { name: 'דור אלון אנרגיה', popular: true, logo: '🔋' },
    { name: 'סלקום אנרגיה', popular: false, logo: '⚡' },
    { name: 'נקסט אנרגיה', popular: false, logo: '🔋' },
    { name: 'אורמת אנרגיה', popular: false, logo: '⚡' },
    { name: 'גין אנרגיה', popular: false, logo: '🔋' },
    { name: 'בזק אנרגיה', popular: false, logo: '⚡' },
    { name: 'אנרג\'יה ישראלית', popular: false, logo: '🔋' },
    { name: 'מי אנרגיה', popular: false, logo: '⚡' },
    { name: 'חשמל ירוק', popular: false, logo: '🌱' },
    { name: 'פאוור אנרג\'י', popular: false, logo: '🔋' },
    { name: 'נרג\'יה חכמה', popular: false, logo: '⚡' },
    { name: 'אחר', popular: false, logo: '🏢' }
  ],
  cellular: [
    { name: 'פלאפון', popular: true, logo: '📱' },
    { name: 'סלקום', popular: true, logo: '📞' },
    { name: 'פרטנר', popular: true, logo: '📱' },
    { name: 'הוט מובייל', popular: true, logo: '📞' },
    { name: '019 מובייל', popular: false, logo: '📱' },
    { name: 'רמי לוי תקשורת', popular: false, logo: '📞' },
    { name: 'אלקטרה אפיקים', popular: false, logo: '📱' },
    { name: 'יס', popular: false, logo: '📞' },
    { name: 'גולן טלקום', popular: false, logo: '📱' },
    { name: 'סמארט מובייל', popular: false, logo: '📞' },
    { name: 'WAY', popular: false, logo: '📱' },
    { name: 'מובייל אנלימיטד', popular: false, logo: '📞' },
    { name: 'רדיוס', popular: false, logo: '📱' },
    { name: 'פרי מובייל', popular: false, logo: '📞' },
    { name: 'אחר', popular: false, logo: '🏢' }
  ],
  internet: [
    { name: 'בזק', popular: true, logo: '🌐' },
    { name: 'הוט', popular: true, logo: '📡' },
    { name: 'פרטנר', popular: true, logo: '🌐' },
    { name: 'סלקום', popular: true, logo: '📡' },
    { name: 'אורנג', popular: false, logo: '🌐' },
    { name: 'סלקום TV', popular: false, logo: '📡' },
    { name: 'גולד ליינס', popular: false, logo: '🌐' },
    { name: 'נטוויזן', popular: false, logo: '📡' },
    { name: '013 נטליין', popular: false, logo: '🌐' },
    { name: 'יס', popular: false, logo: '📡' },
    { name: 'Free Tel', popular: false, logo: '🌐' },
    { name: 'נט ביז\'ן', popular: false, logo: '📡' },
    { name: 'רידאן', popular: false, logo: '🌐' },
    { name: 'סמייל', popular: false, logo: '📡' },
    { name: 'אחר', popular: false, logo: '🏢' }
  ],
  tv: [
    { name: 'יס', popular: true, logo: '📺' },
    { name: 'הוט', popular: true, logo: '🎬' },
    { name: 'סלקום TV', popular: true, logo: '📺' },
    { name: 'פרטנר TV', popular: true, logo: '🎬' },
    { name: 'נטפליקס', popular: true, logo: '🍿' },
    { name: 'סטרימקס', popular: false, logo: '📺' },
    { name: 'בזק בינלאומי', popular: false, logo: '🎬' },
    { name: 'אמזון פריים', popular: false, logo: '📺' },
    { name: 'Disney+', popular: false, logo: '🎭' },
    { name: 'אפל TV+', popular: false, logo: '📱' },
    { name: 'פרמאונט+', popular: false, logo: '🎬' },
    { name: 'HBO Max', popular: false, logo: '🎭' },
    { name: 'יוטיוב פרמיום', popular: false, logo: '📹' },
    { name: 'ספוטיפיי', popular: false, logo: '🎵' },
    { name: 'אחר', popular: false, logo: '🏢' }
  ]
};

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi,
  tv: Tv
};

export const ProviderSelector = ({ 
  category, 
  value, 
  onValueChange, 
  placeholder = "בחרו ספק" 
}: ProviderSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const providers = categoryProviders[category] || [];
  const CategoryIcon = categoryIcons[category];
  
  const popularProviders = providers.filter(p => p.popular);
  const otherProviders = providers.filter(p => !p.popular);
  
  const filteredPopular = popularProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredOther = otherProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProvider = providers.find(p => p.name === value);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <CategoryIcon className="h-4 w-4" />
        ספק נוכחי
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 text-right border-border hover:border-primary/50 transition-colors"
          >
            {value ? (
              <div className="flex items-center gap-3">
                <span className="text-lg">{selectedProvider?.logo}</span>
                <span className="font-medium">{value}</span>
                {selectedProvider?.popular && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                    <Star className="h-3 w-3 mr-1" />
                    פופולארי
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="חפש ספק..." 
                className="flex-1 border-0 focus:ring-0"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>לא נמצאו ספקים</CommandEmpty>
              
              {filteredPopular.length > 0 && (
                <CommandGroup heading="ספקים פופולאריים">
                  {filteredPopular.map((provider) => (
                    <CommandItem
                      key={provider.name}
                      value={provider.name}
                      onSelect={() => {
                        onValueChange(provider.name === value ? "" : provider.name);
                        setOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 rounded-lg"
                    >
                      <span className="text-lg">{provider.logo}</span>
                      <div className="flex-1 text-right">
                        <div className="font-medium">{provider.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          <Star className="h-3 w-3 mr-1" />
                          פופולארי
                        </Badge>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            value === provider.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {filteredOther.length > 0 && (
                <CommandGroup heading="ספקים נוספים">
                  {filteredOther.map((provider) => (
                    <CommandItem
                      key={provider.name}
                      value={provider.name}
                      onSelect={() => {
                        onValueChange(provider.name === value ? "" : provider.name);
                        setOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 rounded-lg"
                    >
                      <span className="text-lg">{provider.logo}</span>
                      <div className="flex-1 text-right">
                        <div className="font-medium">{provider.name}</div>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === provider.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};