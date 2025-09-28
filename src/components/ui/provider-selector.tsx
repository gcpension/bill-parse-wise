import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Import logos
import bezeqLogo from '@/assets/logos/bezeq-logo.png';
import partnerLogo from '@/assets/logos/partner-logo.png';
import pelephoneLogo from '@/assets/logos/pelephone-logo.png';
import yesLogo from '@/assets/logos/yes-logo.png';
import electricityLogo from '@/assets/logos/electricity-logo.png';
import cellcomLogo from '@/assets/logos/cellcom-logo.svg';
import hotLogo from '@/assets/logos/hot-logo.svg';

export interface Provider {
  id: string;
  name: string;
  logo?: string;
  color: string;
}

interface ProviderSelectorProps {
  providers: Provider[];
  selectedProvider?: string;
  onSelect: (providerId: string) => void;
  title?: string;
  description?: string;
  excludeProvider?: string;
  className?: string;
}

// Predefined provider configurations
const providerLogos: Record<string, string> = {
  'בזק': bezeqLogo,
  'פרטנר/אורנג׳': partnerLogo,
  'פלאפון': pelephoneLogo,
  'יס': yesLogo,
  'חברת החשמל': electricityLogo,
  'נקטיק אנרגיה': electricityLogo,
  'HOT': hotLogo,
  'סלקום': cellcomLogo,
  'גולן טלקום': partnerLogo,
  'רמי לוי': partnerLogo
};

const providerColors: Record<string, string> = {
  'בזק': 'bg-blue-500',
  'פרטנר/אורנג׳': 'bg-orange-500', 
  'סלקום': 'bg-green-500',
  'HOT': 'bg-red-500',
  'גולן טלקום': 'bg-purple-500',
  'רמי לוי': 'bg-yellow-500',
  'פלאפון': 'bg-blue-600',
  'חברת החשמל': 'bg-yellow-500',
  'נקטיק אנרגיה': 'bg-green-600',
  'יס': 'bg-green-500',
  'אחר': 'bg-gray-500'
};

export default function ProviderSelector({ 
  providers = [], 
  selectedProvider, 
  onSelect, 
  title,
  description,
  excludeProvider,
  className 
}: ProviderSelectorProps) {
  
  // Filter out excluded provider
  const filteredProviders = providers.filter(provider => provider.id !== excludeProvider);
  
  return (
    <div className={cn("space-y-6", className)}>
      {(title || description) && (
        <div className="text-center">
          {title && (
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-slate-600">{description}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProviders.map((provider) => {
          const isSelected = selectedProvider === provider.id;
          const logoUrl = providerLogos[provider.name] || provider.logo;
          const colorClass = providerColors[provider.name] || provider.color || 'bg-gray-500';
          
          return (
            <button
              key={provider.id}
              onClick={() => {
                console.log('Provider selected:', provider.id, provider.name);
                onSelect(provider.id);
              }}
              className={cn(
                "relative p-6 rounded-2xl border-2 transition-all duration-200 group hover:shadow-lg",
                isSelected 
                  ? "border-slate-400 bg-slate-50 shadow-md" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="flex flex-col items-center space-y-3">
                {/* Logo container */}
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200",
                  isSelected ? "scale-110" : "group-hover:scale-105"
                )}>
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt={`${provider.name} logo`}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        // Fallback to color circle if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextSibling) {
                          (target.nextSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback colored circle */}
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg",
                      colorClass,
                      logoUrl ? "hidden" : "flex"
                    )}
                    style={{ display: logoUrl ? 'none' : 'flex' }}
                  >
                    {provider.name.charAt(0)}
                  </div>
                </div>
                
                {/* Provider name */}
                <div className="text-center">
                  <div className={cn(
                    "text-sm font-semibold transition-colors",
                    isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                  )}>
                    {provider.name}
                  </div>
                </div>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Default provider list for Israeli telecom market
export const defaultProviders: Provider[] = [
  { id: 'בזק', name: 'בזק', color: 'bg-blue-500' },
  { id: 'פרטנר/אורנג׳', name: 'פרטנר/אורנג׳', color: 'bg-orange-500' },
  { id: 'סלקום', name: 'סלקום', color: 'bg-green-500' },
  { id: 'HOT', name: 'HOT', color: 'bg-red-500' },
  { id: 'גולן טלקום', name: 'גולן טלקום', color: 'bg-purple-500' },
  { id: 'רמי לוי', name: 'רמי לוי', color: 'bg-yellow-500' },
  { id: 'פלאפון', name: 'פלאפון', color: 'bg-blue-600' },
  { id: 'חברת החשמל', name: 'חברת החשמל', color: 'bg-yellow-500' },
  { id: 'נקטיק אנרגיה', name: 'נקטיק אנרגיה', color: 'bg-green-600' },
  { id: 'יס', name: 'יס', color: 'bg-green-500' },
  { id: 'אחר', name: 'אחר', color: 'bg-gray-500' }
];