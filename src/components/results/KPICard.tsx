import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

export const KPICard = ({ title, value, icon, trend = 'neutral', subtitle }: KPICardProps) => {
  return (
    <Card className="bg-white rounded-2xl shadow-md p-4 md:p-6">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className={cn(
              "text-2xl font-bold mb-1",
              trend === 'positive' && "text-success",
              trend === 'negative' && "text-destructive",
              trend === 'neutral' && "text-foreground"
            )}>
              {value}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="shrink-0 mr-3">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};