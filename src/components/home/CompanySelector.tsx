import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Building2, ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CompanySelectorProps {
  category: string;
  selectedCompany: string;
  onSelect: (company: string) => void;
  className?: string;
}

// Companies by category
const companiesByCategory: Record<string, string[]> = {
  electricity: ['חברת חשמל', 'פז אנרגיה', 'אלקטרה פאוור', 'דור אלון אנרגיה', 'סלקום אנרגיה', 'אנרג׳יקס', 'OPC אנרגיה'],
  cellular: ['פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', '019 מובייל', 'רמי לוי', 'גולן טלקום', 'יו פון'],
  internet: ['בזק', 'הוט', 'פרטנר', 'סלקום', 'אורנג׳', 'נטוויז׳ן', '012'],
  tv: ['יס', 'הוט', 'סלקום TV', 'פרטנר TV', 'STINGTV', 'cellcom tv'],
  triple: ['הוט', 'פרטנר', 'סלקום', 'בזק'],
};

// Company colors and emoji logos for visual distinction
const companyBranding: Record<string, { color: string; emoji: string }> = {
  'פלאפון': { color: 'bg-orange-500', emoji: '🟠' },
  'סלקום': { color: 'bg-purple-500', emoji: '🟣' },
  'פרטנר': { color: 'bg-blue-500', emoji: '🔵' },
  'הוט מובייל': { color: 'bg-red-500', emoji: '🔴' },
  'הוט': { color: 'bg-red-500', emoji: '🔴' },
  '019 מובייל': { color: 'bg-green-500', emoji: '🟢' },
  'רמי לוי': { color: 'bg-yellow-500', emoji: '🟡' },
  'גולן טלקום': { color: 'bg-teal-500', emoji: '💎' },
  'יו פון': { color: 'bg-sky-500', emoji: '📲' },
  'בזק': { color: 'bg-cyan-600', emoji: '🌐' },
  'יס': { color: 'bg-pink-500', emoji: '📡' },
  'חברת חשמל': { color: 'bg-amber-500', emoji: '⚡' },
  'פז אנרגיה': { color: 'bg-emerald-500', emoji: '🔋' },
  'אלקטרה פאוור': { color: 'bg-indigo-500', emoji: '💡' },
  'דור אלון אנרגיה': { color: 'bg-lime-600', emoji: '🏭' },
  'סלקום אנרגיה': { color: 'bg-purple-500', emoji: '⚡' },
  'אנרג׳יקס': { color: 'bg-green-600', emoji: '🌿' },
  'OPC אנרגיה': { color: 'bg-blue-600', emoji: '🔌' },
  'אורנג׳': { color: 'bg-orange-600', emoji: '🍊' },
  'נטוויז׳ן': { color: 'bg-violet-500', emoji: '🌐' },
  '012': { color: 'bg-blue-700', emoji: '🔷' },
  'סלקום TV': { color: 'bg-purple-500', emoji: '📺' },
  'פרטנר TV': { color: 'bg-blue-500', emoji: '📺' },
  'STINGTV': { color: 'bg-yellow-600', emoji: '🐝' },
  'cellcom tv': { color: 'bg-purple-600', emoji: '📺' },
};

const getCompanyBranding = (company: string) => 
  companyBranding[company] || { color: 'bg-gray-500', emoji: '🏢' };

const CompanySelector: React.FC<CompanySelectorProps> = ({
  category,
  selectedCompany,
  onSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const companies = companiesByCategory[category] || [];
  
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;
    return companies.filter(company => 
      company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  const handleSelect = (company: string) => {
    onSelect(company);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelect('');
    setSearchQuery('');
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "w-full justify-between h-12 text-right",
              "border-2 transition-all duration-200",
              selectedCompany 
                ? "border-primary/50 bg-primary/5" 
                : "border-dashed border-muted-foreground/30 hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-2">
              {selectedCompany ? (
                <>
                  <span className="text-lg">{getCompanyBranding(selectedCompany).emoji}</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getCompanyBranding(selectedCompany).color
                  )} />
                  <span className="font-medium">{selectedCompany}</span>
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">בחרו את הספק הנוכחי</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedCompany && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )} />
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
        >
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש ספק..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* Companies list */}
          <div className="max-h-[250px] overflow-y-auto p-2">
            <AnimatePresence mode="popLayout">
              {filteredCompanies.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground text-center py-4"
                >
                  לא נמצאו ספקים
                </motion.p>
              ) : (
                filteredCompanies.map((company, index) => {
                  const isSelected = selectedCompany === company;
                  const branding = getCompanyBranding(company);
                  return (
                    <motion.button
                      key={company}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleSelect(company)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "text-sm text-right transition-all duration-150",
                        isSelected 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm",
                        branding.color + '/10'
                      )}>
                        {branding.emoji}
                      </div>
                      <span className="flex-1 font-medium">{company}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Footer hint */}
          <div className="p-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              {companies.length} ספקים זמינים
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CompanySelector;
