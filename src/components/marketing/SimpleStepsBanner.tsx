import { Brain, FileCheck, Sparkles, Zap } from 'lucide-react';

const SimpleStepsBanner = () => {
  return (
    <div className="max-w-sm mx-auto mb-8">
      <div className="bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 px-4 py-3 border-b border-border">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-foreground font-bold text-base font-heebo">איך התהליך עובד?</h3>
          </div>
        </div>

        {/* Content - Compact Steps */}
        <div className="p-4 space-y-4">
          {/* Step 1 */}
          <div className="flex gap-3 items-start group">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm transition-transform group-hover:scale-105">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm mb-1 font-heebo">הזנת נתונים</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-assistant">
                הזינו את החשבון הנוכחי - לוקח 30 שניות
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3 items-start group">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm mb-1 font-heebo">ניתוח חכם</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-assistant">
                המערכת מוצאת את ההצעה הטובה ביותר עבורכם
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3 items-start group">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <FileCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm mb-1 font-heebo">מעבר מלא</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-assistant">
                אנחנו מסדרים הכל - בחינם לחלוטין
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Compact highlights */}
        <div className="bg-primary/5 px-4 py-3 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-foreground font-medium text-xs font-assistant">
                חינמי לחלוטין • חיסכון של 35%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;