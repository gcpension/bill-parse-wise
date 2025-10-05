import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Signal, Wifi, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getCoverageForLocation, CoverageData } from '@/lib/coverageData';
import { cn } from '@/lib/utils';

interface CoverageIndicatorProps {
  location: string;
  category: 'mobile' | 'internet';
  provider?: string;
}

export const CoverageIndicator = ({ location, category, provider }: CoverageIndicatorProps) => {
  if (!location) return null;

  const coverage = getCoverageForLocation(location);

  const getCoverageIcon = (level: string) => {
    switch (level) {
      case 'excellent':
      case 'full':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'good':
      case 'partial':
        return <Signal className="w-4 h-4 text-warning" />;
      case 'fair':
      case 'limited':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'none':
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Signal className="w-4 h-4" />;
    }
  };

  const getCoverageText = (level: string) => {
    switch (level) {
      case 'excellent': return 'מצוין';
      case 'full': return 'מלא';
      case 'good': return 'טוב';
      case 'partial': return 'חלקי';
      case 'fair': return 'בינוני';
      case 'limited': return 'מוגבל';
      case 'none': return 'לא זמין';
      default: return level;
    }
  };

  const getCoverageColor = (level: string) => {
    switch (level) {
      case 'excellent':
      case 'full':
        return 'bg-success/10 text-success border-success/20';
      case 'good':
      case 'partial':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'fair':
      case 'limited':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (category === 'mobile' && provider) {
    const providerKey = provider.toLowerCase();
    let cellularCoverage: string = 'good';

    if (providerKey.includes('partner') || providerKey.includes('פרטנר')) {
      cellularCoverage = coverage.cellularCoverage.partner;
    } else if (providerKey.includes('cellcom') || providerKey.includes('סלקום')) {
      cellularCoverage = coverage.cellularCoverage.cellcom;
    } else if (providerKey.includes('pelephone') || providerKey.includes('פלאפון')) {
      cellularCoverage = coverage.cellularCoverage.pelephone;
    } else if (providerKey.includes('hot') || providerKey.includes('הוט')) {
      cellularCoverage = coverage.cellularCoverage.hot;
    } else if (providerKey.includes('golan') || providerKey.includes('גולן')) {
      cellularCoverage = coverage.cellularCoverage.golan;
    }

    return (
      <div className="flex items-center gap-2">
        {getCoverageIcon(cellularCoverage)}
        <span className="text-sm font-medium">
          כיסוי {getCoverageText(cellularCoverage)} ב{coverage.city || location}
        </span>
        {coverage.recommended5G && (
          <Badge variant="outline" className="text-xs">5G</Badge>
        )}
      </div>
    );
  }

  if (category === 'internet') {
    return (
      <Card className="border-none bg-muted/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-primary" />
            <span className="font-semibold">כיסוי באזורכם - {coverage.city || location}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">סיבים אופטיים:</span>
              <Badge variant="outline" className={cn('border', getCoverageColor(coverage.fiberCoverage))}>
                {getCoverageIcon(coverage.fiberCoverage)}
                <span className="mr-2">{getCoverageText(coverage.fiberCoverage)}</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">מהירות מקסימלית:</span>
              <Badge variant="outline">
                עד {coverage.maxInternetSpeed} Mbps
              </Badge>
            </div>
          </div>

          {coverage.notes && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              💡 {coverage.notes}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
};
