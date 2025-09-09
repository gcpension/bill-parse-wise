import { useState, useMemo } from 'react';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ManualPlan } from '@/data/manual-plans';

interface SearchAndFilterProps {
  plans: ManualPlan[];
  onFilteredPlansChange: (plans: ManualPlan[]) => void;
  className?: string;
}

interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  companies: string[];
  sortBy: 'price' | 'company' | 'features' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

export const SearchAndFilter = ({
  plans,
  onFilteredPlansChange,
  className
}: SearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 1000],
    companies: [],
    sortBy: 'relevance',
    sortOrder: 'asc',
  });

  // Get unique values for filters
  const uniqueCategories = useMemo(() => 
    Array.from(new Set(plans.map(plan => plan.category))), [plans]
  );
  
  const uniqueCompanies = useMemo(() => 
    Array.from(new Set(plans.map(plan => plan.company))), [plans]
  );

  const maxPrice = useMemo(() => 
    Math.max(...plans.map(plan => plan.regularPrice || 0)), [plans]
  );

  // Filter and sort plans
  const filteredPlans = useMemo(() => {
    let filtered = plans.filter(plan => {
      // Search query
      const matchesSearch = !searchQuery || 
        plan.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.features.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Category filter
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(plan.category);

      // Company filter
      const matchesCompany = filters.companies.length === 0 || 
        filters.companies.includes(plan.company);

      // Price range filter
      const planPrice = plan.regularPrice || 0;
      const matchesPrice = planPrice >= filters.priceRange[0] && 
        planPrice <= filters.priceRange[1];

      return matchesSearch && matchesCategory && matchesCompany && matchesPrice;
    });

    // Sort plans
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'price':
          comparison = (a.regularPrice || 0) - (b.regularPrice || 0);
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company, 'he');
          break;
        case 'features':
          comparison = b.features.length - a.features.length;
          break;
        case 'relevance':
        default:
          // Score based on search query relevance
          const getRelevanceScore = (plan: ManualPlan) => {
            if (!searchQuery) return 0;
            let score = 0;
            const query = searchQuery.toLowerCase();
            
            if (plan.planName.toLowerCase().includes(query)) score += 10;
            if (plan.company.toLowerCase().includes(query)) score += 8;
            plan.features.forEach(feature => {
              if (feature.toLowerCase().includes(query)) score += 5;
            });
            
            return score;
          };
          
          comparison = getRelevanceScore(b) - getRelevanceScore(a);
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [plans, searchQuery, filters]);

  // Update parent when filtered plans change
  useMemo(() => {
    onFilteredPlansChange(filteredPlans);
  }, [filteredPlans, onFilteredPlansChange]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      categories: [],
      priceRange: [0, maxPrice],
      companies: [],
      sortBy: 'relevance',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters = searchQuery || 
    filters.categories.length > 0 || 
    filters.companies.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < maxPrice;

  const activeFiltersCount = [
    searchQuery ? 1 : 0,
    filters.categories.length,
    filters.companies.length,
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="חפש מסלולים, ספקים או תכונות..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 bg-background"
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              סינון
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-background border shadow-lg z-50" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">סינון מתקדם</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">קטגוריות</Label>
                <div className="flex flex-wrap gap-2">
                  {uniqueCategories.map(category => (
                    <Badge
                      key={category}
                      variant={filters.categories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          categories: prev.categories.includes(category)
                            ? prev.categories.filter(c => c !== category)
                            : [...prev.categories, category]
                        }));
                      }}
                    >
                      {category === 'electricity' ? 'חשמל' : 
                       category === 'mobile' ? 'סלולר' :
                       category === 'internet' ? 'אינטרנט' :
                       category === 'tv' ? 'טלוויזיה' : category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  טווח מחירים: ₪{filters.priceRange[0]} - ₪{filters.priceRange[1]}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => {
                    setFilters(prev => ({ ...prev, priceRange: value as [number, number] }));
                  }}
                  max={maxPrice}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Companies */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">ספקים</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {uniqueCompanies.map(company => (
                    <Badge
                      key={company}
                      variant={filters.companies.includes(company) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          companies: prev.companies.includes(company)
                            ? prev.companies.filter(c => c !== company)
                            : [...prev.companies, company]
                        }));
                      }}
                    >
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value: any) => {
              setFilters(prev => ({ ...prev, sortBy: value }));
            }}
          >
            <SelectTrigger className="w-32 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="relevance">רלוונטיות</SelectItem>
              <SelectItem value="price">מחיר</SelectItem>
              <SelectItem value="company">ספק</SelectItem>
              <SelectItem value="features">תכונות</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters(prev => ({ 
                ...prev, 
                sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
              }));
            }}
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredPlans.length} מתוך {plans.length} מסלולים
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              חיפוש: "{searchQuery}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setSearchQuery('')}
              />
            </Badge>
          )}
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category === 'electricity' ? 'חשמל' : 
               category === 'mobile' ? 'סלולר' :
               category === 'internet' ? 'אינטרנט' :
               category === 'tv' ? 'טלוויזיה' : category}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    categories: prev.categories.filter(c => c !== category)
                  }));
                }}
              />
            </Badge>
          ))}
          {filters.companies.map(company => (
            <Badge key={company} variant="secondary" className="gap-1">
              {company}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    companies: prev.companies.filter(c => c !== company)
                  }));
                }}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};