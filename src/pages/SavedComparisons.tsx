import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookmarkCheck, 
  Trash2, 
  Calendar, 
  TrendingDown, 
  Eye, 
  Download,
  Share2,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SavedComparison {
  id: string;
  date: string;
  category: 'electricity' | 'cellular' | 'internet';
  currentProvider: string;
  currentAmount: number;
  recommendedProvider: string;
  recommendedAmount: number;
  monthlySavings: number;
  annualSavings: number;
  status: 'saved' | 'in-progress' | 'completed';
}

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט'
};

const categoryColors = {
  electricity: 'from-yellow-500 to-orange-500',
  cellular: 'from-blue-500 to-purple-500',
  internet: 'from-green-500 to-teal-500'
};

// Sample data - in real app this would come from local storage or backend
const sampleComparisons: SavedComparison[] = [
  {
    id: '1',
    date: '2024-01-15',
    category: 'electricity',
    currentProvider: 'חברת החשמל',
    currentAmount: 850,
    recommendedProvider: 'פזגז חשמל',
    recommendedAmount: 650,
    monthlySavings: 200,
    annualSavings: 2400,
    status: 'saved'
  },
  {
    id: '2',
    date: '2024-01-10',
    category: 'cellular',
    currentProvider: 'פלאפון',
    currentAmount: 120,
    recommendedProvider: 'סלקום',
    recommendedAmount: 75,
    monthlySavings: 45,
    annualSavings: 540,
    status: 'in-progress'
  },
  {
    id: '3',
    date: '2024-01-05',
    category: 'internet',
    currentProvider: 'בזק',
    currentAmount: 150,
    recommendedProvider: 'הוט',
    recommendedAmount: 99,
    monthlySavings: 51,
    annualSavings: 612,
    status: 'completed'
  }
];

export const SavedComparisons = () => {
  const [comparisons, setComparisons] = useState<SavedComparison[]>(sampleComparisons);
  const [filteredComparisons, setFilteredComparisons] = useState<SavedComparison[]>(sampleComparisons);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  // Filter comparisons based on search and filters
  useEffect(() => {
    let filtered = comparisons;

    if (searchQuery) {
      filtered = filtered.filter(comp => 
        comp.currentProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.recommendedProvider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(comp => comp.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(comp => comp.status === filterStatus);
    }

    setFilteredComparisons(filtered);
  }, [searchQuery, filterCategory, filterStatus, comparisons]);

  const deleteComparison = (id: string) => {
    setComparisons(prev => prev.filter(comp => comp.id !== id));
    toast({
      title: "השוואה נמחקה",
      description: "ההשוואה נמחקה בהצלחה מהרשימה שלך",
    });
  };

  const totalSavings = comparisons.reduce((sum, comp) => sum + comp.annualSavings, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'saved':
        return <Badge variant="secondary">שמור</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500 text-white">בתהליך</Badge>;
      case 'completed':
        return <Badge className="bg-success text-success-foreground">הושלם</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (comparisons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 py-16">
          <div className="p-6 bg-accent/20 rounded-full w-fit mx-auto">
            <BookmarkCheck className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">אין השוואות שמורות</h2>
            <p className="text-muted-foreground">
              בצע ההשוואה הראשונה שלך כדי לראות אותה כאן
            </p>
          </div>
          <Button className="mt-4">
            <TrendingDown className="ml-2 h-4 w-4" />
            התחל להשוות
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center">
              <BookmarkCheck className="ml-3 h-8 w-8 text-primary" />
              השוואות שמורות
            </h1>
            <p className="text-muted-foreground">
              כל ההשוואות שביצעת נשמרות כאן. תוכל לעקוב אחר החיסכון שלך!
            </p>
          </div>
          
          <div className="text-left">
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalSavings)}
            </div>
            <p className="text-sm text-muted-foreground">חיסכון שנתי כולל</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{comparisons.length}</div>
              <p className="text-sm text-muted-foreground">השוואות שמורות</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {formatCurrency(totalSavings / 12)}
              </div>
              <p className="text-sm text-muted-foreground">חיסכון חודשי ממוצע</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-glow">
                {comparisons.filter(c => c.status === 'completed').length}
              </div>
              <p className="text-sm text-muted-foreground">מעברים הושלמו</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי ספק..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="כל הקטגוריות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                <SelectItem value="electricity">חשמל</SelectItem>
                <SelectItem value="cellular">סלולר</SelectItem>
                <SelectItem value="internet">אינטרנט</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="כל הסטטוסים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="saved">שמור</SelectItem>
                <SelectItem value="in-progress">בתהליך</SelectItem>
                <SelectItem value="completed">הושלם</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 ml-1" />
                יצא
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 ml-1" />
                שתף
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparisons List */}
      <div className="grid gap-4">
        {filteredComparisons.map((comparison) => (
          <Card key={comparison.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className={`p-3 bg-gradient-to-r ${categoryColors[comparison.category]} rounded-lg`}>
                    <div className="w-6 h-6 bg-white/20 rounded" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <h3 className="font-semibold">{categoryNames[comparison.category]}</h3>
                      {getStatusBadge(comparison.status)}
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(comparison.date).toLocaleDateString('he-IL')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-2">
                  <div className="text-lg font-bold text-success">
                    {formatCurrency(comparison.monthlySavings)}/חודש
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(comparison.annualSavings)} לשנה
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm text-red-600 font-medium">מצב נוכחי</p>
                  <p className="font-semibold">{comparison.currentProvider}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(comparison.currentAmount)}/חודש</p>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-600 font-medium">המלצה</p>
                  <p className="font-semibold">{comparison.recommendedProvider}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(comparison.recommendedAmount)}/חודש</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 ml-1" />
                    צפה
                  </Button>
                  {comparison.status === 'saved' && (
                    <Button size="sm">
                      <TrendingDown className="h-4 w-4 ml-1" />
                      בצע מעבר
                    </Button>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteComparison(comparison.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredComparisons.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">לא נמצאו השוואות התואמות לחיפוש</p>
        </div>
      )}
    </div>
  );
};