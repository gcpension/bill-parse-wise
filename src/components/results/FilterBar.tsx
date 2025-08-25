import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  providerFilter: string;
  setProviderFilter: (provider: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  uniqueProviders: string[];
  onReset: () => void;
}

export const FilterBar = ({
  searchTerm,
  setSearchTerm,
  providerFilter,
  setProviderFilter,
  sortBy,
  setSortBy,
  uniqueProviders,
  onReset
}: FilterBarProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש מסלול או ספק..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Provider Filter */}
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-full md:w-48 border-gray-300">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="בחר ספק" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הספקים</SelectItem>
            {uniqueProviders.map(provider => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 border-gray-300">
            <SelectValue placeholder="מיין לפי" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="savings">חיסכון (גבוה לנמוך)</SelectItem>
            <SelectItem value="price">מחיר (נמוך לגבוה)</SelectItem>
            <SelectItem value="rating">דירוג (גבוה לנמוך)</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button
          variant="outline"
          onClick={onReset}
          className="border-gray-300 text-gray-800 bg-white hover:bg-gray-50"
        >
          <RotateCcw className="ml-2 h-4 w-4" />
          סינון
        </Button>
      </div>
    </div>
  );
};