import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';
import { 
  Search, Filter, RotateCcw, ExternalLink, Edit, 
  AlertTriangle, CheckCircle, Zap, Smartphone, Wifi, Tv,
  Clock, ArrowRight, ArrowLeft
} from 'lucide-react';
import { PlanCard } from '@/components/results/PlanCard';
import { KPICard } from '@/components/results/KPICard';
import { FilterBar } from '@/components/results/FilterBar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface AnalysisResult {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentAmount: number;
  currentProvider: string;
  recommendedPlan: any;
  monthlySavings: number;
  annualSavings: number;
  allProviders: any[];
  fileId?: string;
}

interface NewDetailedAnalysisResultsProps {
  results: AnalysisResult[];
  onBackToInput: () => void;
}

const categoryConfig = {
  electricity: { icon: Zap, name: 'חשמל', color: 'text-golden-yellow', bgColor: 'bg-gradient-sunset' },
  cellular: { icon: Smartphone, name: 'סלולר', color: 'text-electric-blue', bgColor: 'bg-gradient-electric' },
  internet: { icon: Wifi, name: 'אינטרנט', color: 'text-vibrant-green', bgColor: 'bg-gradient-vibrant' },
  tv: { icon: Tv, name: 'טלוויזיה', color: 'text-royal-purple', bgColor: 'bg-gradient-primary' }
};

export const NewDetailedAnalysisResults = ({ results, onBackToInput }: NewDetailedAnalysisResultsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');
  const [sortBy, setSortBy] = useState('savings');
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  const [showDisconnectWarning, setShowDisconnectWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const totalMonthlySavings = results.reduce((sum, result) => sum + result.monthlySavings, 0);
  const totalAnnualSavings = results.reduce((sum, result) => sum + result.annualSavings, 0);
  const estimatedSwitchTime = '2-3 שבועות'; // mock data

  // Generate enhanced plans from results
  const allPlans = results.flatMap(result => 
    (result.allProviders || []).flatMap(provider => 
      (provider.plans || []).map((plan: any) => ({
        ...plan,
        provider: provider.name,
        rating: provider.rating,
        category: result.category,
        currentAmount: result.currentAmount,
        savings: Math.max(0, result.currentAmount - plan.price),
        recommended: plan.recommended || false,
        popular: plan.popular || false,
        features: plan.features || ['שירות לקוחות 24/7', 'התקנה חינם', 'אחריות מלאה'],
        id: `${provider.name}-${plan.name}-${result.category}`
      }))
    )
  );

  // Filter and sort plans
  const filteredPlans = allPlans
    .filter(plan => 
      (searchTerm === '' || 
       plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       plan.provider.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (providerFilter === 'all' || plan.provider === providerFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'savings': return b.savings - a.savings;
        case 'price': return a.price - b.price;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        default: return 0;
      }
    });

  const uniqueProviders = Array.from(new Set(allPlans.map(plan => plan.provider)));

  const handleConnect = (planId: string) => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      const ticketId = Math.random().toString(36).substr(2, 8).toUpperCase();
      toast({
        title: "הבקשה נקלטה! ✅",
        description: `מספר בקשה #${ticketId}. נחזור אליך עד 48 שעות.`,
        variant: "default",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setShowDisconnectWarning(true);
  };

  const confirmDisconnect = () => {
    toast({
      title: "בקשת ניתוק נשלחה",
      description: "נבדוק עמלות יציאה ונחזור אליך בהקדם",
      variant: "default",
    });
    setShowDisconnectWarning(false);
  };

  const handleCompare = () => {
    if (selectedPlans.size < 2) {
      toast({
        title: "בחרו לפחות 2 מסלולים להשוואה",
        description: "סמנו את המסלולים שברצונכם להשוות",
        variant: "destructive",
      });
      return;
    }
    // Navigate to comparison view
    console.log('Comparing plans:', Array.from(selectedPlans));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setProviderFilter('all');
    setSortBy('savings');
  };

  // Mock loading state
  if (isLoading && filteredPlans.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">טוען תוצאות...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              משהו השתבש. נסו שוב או פנו לתמיכה.
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => window.location.reload()}>
                נסו שוב
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  // Empty state
  if (filteredPlans.length === 0 && !isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <Button variant="ghost" onClick={onBackToInput} className="mb-4">
                <ArrowRight className="ml-2 h-4 w-4" />
                חזרה לניתוח
              </Button>
              <h1 className="text-3xl font-bold mb-2">התוצאות שלך</h1>
            </div>
            
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              providerFilter={providerFilter}
              setProviderFilter={setProviderFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              uniqueProviders={uniqueProviders}
              onReset={resetFilters}
            />

            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">לא נמצאו מסלולים תואמים</h3>
              <p className="text-muted-foreground mb-4">נסו לשנות פילטרים או חפשו מונחים אחרים</p>
              <Button onClick={resetFilters}>
                <RotateCcw className="ml-2 h-4 w-4" />
                איפוס פילטרים
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Button variant="ghost" onClick={onBackToInput} className="mb-4">
                <ArrowRight className="ml-2 h-4 w-4" />
                חזרה לניתוח
              </Button>
              <h1 className="text-3xl font-bold">התוצאות שלך</h1>
              <p className="text-muted-foreground">מסלולים מותאמים אישית עם חיסכון משמעותי</p>
            </div>
          </div>

          {/* Enhanced Savings Header */}
          <div className="relative bg-gradient-to-br from-success/20 via-success/10 to-primary/10 rounded-3xl p-8 overflow-hidden shadow-2xl">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-success/30 to-transparent rounded-full -translate-y-16 translate-x-16 blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/20 to-transparent rounded-full translate-y-8 -translate-x-8 blur-2xl animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative z-10 text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-success via-success/80 to-primary bg-clip-text text-transparent">
                  החיסכון שלך
                </h2>
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-success/30 shadow-xl">
                  <ArrowLeft className="h-8 w-8 text-success mx-auto mb-3" />
                  <p className="text-4xl font-black text-success mb-1">
                    ₪{totalMonthlySavings.toLocaleString()}
                  </p>
                  <p className="text-lg font-semibold text-success/80">חיסכון חודשי</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-primary/30 shadow-xl">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-4xl font-black text-primary mb-1">
                    ₪{totalAnnualSavings.toLocaleString()}
                  </p>
                  <p className="text-lg font-semibold text-primary/80">חיסכון שנתי</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-xl font-bold text-success mb-2">
                  🎉 מדהים! תחסוך {totalAnnualSavings.toLocaleString()}₪ השנה
                </p>
                <p className="text-muted-foreground">
                  זמן מעבר משוער: {estimatedSwitchTime}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            providerFilter={providerFilter}
            setProviderFilter={setProviderFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            uniqueProviders={uniqueProviders}
            onReset={resetFilters}
          />

          {/* Action Bar */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleCompare}
              disabled={selectedPlans.size < 2}
              variant="outline"
            >
              השווה למסלול הנוכחי שלי
              {selectedPlans.size > 0 && (
                <Badge variant="secondary" className="mr-2">
                  {selectedPlans.size}
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={handleDisconnect}>
              נתק
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="ml-2 h-4 w-4" />
              איפוס פילטרים
            </Button>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                categoryConfig={categoryConfig}
                selectedPlans={selectedPlans}
                setSelectedPlans={setSelectedPlans}
                onConnect={handleConnect}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* Disconnect Warning Dialog */}
          <ConfirmDialog
            open={showDisconnectWarning}
            onOpenChange={setShowDisconnectWarning}
            title="אזהרת ניתוק"
            description="האם אתה בטוח שברצונך להתנתק? ייתכן וקיימים קנסות/אובדן הטבות."
            confirmText="כן, התנתק"
            cancelText="ביטול"
            onConfirm={confirmDisconnect}
            variant="destructive"
          />
        </div>
      </div>
    </Layout>
  );
};