import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  TrendingDown,
  TrendingUp,
  Minus,
  Calculator,
  Target
} from 'lucide-react';
import { ParsedExpense, ExpenseCategory, SavingRecommendation } from '@/types';
import { EXPENSE_CATEGORIES } from '@/lib/categories';
import { formatCurrency, getChangeColor, getChangeIcon } from '@/lib/utils';

// Mock comparison data
const mockProviders = [
  { 
    name: 'חברת החשמל', 
    category: 'electricity', 
    averageBill: 320, 
    potentialSavings: 45,
    plan: 'תעריף רגיל',
    features: ['תשלום חודשי', 'קריאת מונה אוטומטית']
  },
  { 
    name: 'חשמל ירוק', 
    category: 'electricity', 
    averageBill: 275, 
    potentialSavings: 0,
    plan: 'תעריף ירוק',
    features: ['אנרגיה מתחדשת', 'הנחה לצרכנים ירוקים']
  },
  { 
    name: 'בזק בינלאומי', 
    category: 'internet', 
    averageBill: 89, 
    potentialSavings: 25,
    plan: 'אינטרנט 100MB',
    features: ['מהירות גבוהה', 'תמיכה 24/7']
  },
  { 
    name: 'פרטנר טלקום', 
    category: 'internet', 
    averageBill: 64, 
    potentialSavings: 0,
    plan: 'אינטרנט 200MB',
    features: ['מהירות גבוהה יותר', 'ללא הגבלת גלישה']
  },
];

const mockUserExpenses: ParsedExpense[] = [
  {
    id: '1',
    category: EXPENSE_CATEGORIES[0], // electricity
    amount: 320,
    currency: '₪',
    description: 'חשמל - חודש מרץ',
    fileName: 'electricity_march.pdf',
    confidence: 0.92
  },
  {
    id: '2',
    category: EXPENSE_CATEGORIES[1], // internet
    amount: 89,
    currency: '₪',
    description: 'אינטרנט בזק',
    fileName: 'bezeq_internet.jpg',
    confidence: 0.88
  }
];

type SortField = 'name' | 'averageBill' | 'potentialSavings';
type SortDirection = 'asc' | 'desc';

export const Compare = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('potentialSavings');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedProviders = useMemo(() => {
    let filtered = mockProviders.filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.plan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [searchTerm, selectedCategory, sortField, sortDirection]);

  const getUserExpenseByCategory = (categoryId: string) => {
    return mockUserExpenses.find(exp => exp.category.id === categoryId);
  };

  const calculateSavings = (providerBill: number, categoryId: string) => {
    const userExpense = getUserExpenseByCategory(categoryId);
    if (!userExpense) return 0;
    
    return userExpense.amount - providerBill;
  };

  const getTotalPotentialSavings = () => {
    return filteredAndSortedProviders.reduce((total, provider) => {
      const savings = calculateSavings(provider.averageBill, provider.category);
      return total + Math.max(0, savings);
    }, 0);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">השוואת עלויות</h1>
        <p className="text-muted-foreground">
          השווה את החשבונות שלך עם ספקים אחרים וגלה הזדמנויות חיסכון
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה״כ עלויות נוכחיות</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockUserExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              על בסיס החשבונות שהעלאת
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חיסכון פוטנציאלי</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(getTotalPotentialSavings())}
            </div>
            <p className="text-xs text-muted-foreground">
              חיסכון חודשי אפשרי
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חיסכון שנתי</CardTitle>
            <TrendingDown className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(getTotalPotentialSavings() * 12)}
            </div>
            <p className="text-xs text-muted-foreground">
              על בסיס חיסכון חודשי
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>סינון והשוואה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 rtl:md:space-x-reverse">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חפש ספק או תוכנית..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="ml-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  {EXPENSE_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameHebrew}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>השוואת ספקים</CardTitle>
          <CardDescription>
            לחץ על כותרות הטבלה למיון
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <span>ספק</span>
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead>תוכנית</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => handleSort('averageBill')}
                  >
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <span>עלות חודשית</span>
                      {getSortIcon('averageBill')}
                    </div>
                  </TableHead>
                  <TableHead>העלות שלך</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => handleSort('potentialSavings')}
                  >
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <span>חיסכון</span>
                      {getSortIcon('potentialSavings')}
                    </div>
                  </TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProviders.map((provider, index) => {
                  const category = EXPENSE_CATEGORIES.find(cat => cat.id === provider.category);
                  const userExpense = getUserExpenseByCategory(provider.category);
                  const savings = calculateSavings(provider.averageBill, provider.category);
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category?.color }}
                          />
                          <span className="font-medium">{category?.nameHebrew}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {provider.features.slice(0, 2).join(' • ')}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline">
                          {provider.plan}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(provider.averageBill)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {userExpense ? (
                          <div className="font-medium">
                            {formatCurrency(userExpense.amount)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">לא זמין</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {userExpense ? (
                          <div className={`flex items-center space-x-1 rtl:space-x-reverse ${getChangeColor(-savings)}`}>
                            {savings > 0 ? (
                              <>
                                <TrendingDown className="h-4 w-4" />
                                <span className="font-medium">
                                  {formatCurrency(savings)}
                                </span>
                              </>
                            ) : savings < 0 ? (
                              <>
                                <TrendingUp className="h-4 w-4" />
                                <span className="font-medium">
                                  +{formatCurrency(Math.abs(savings))}
                                </span>
                              </>
                            ) : (
                              <>
                                <Minus className="h-4 w-4" />
                                <span>ללא הבדל</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Button variant="outline" size="sm">
                          צור קשר
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredAndSortedProviders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">לא נמצאו תוצאות עבור החיפוש הנוכחי</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};