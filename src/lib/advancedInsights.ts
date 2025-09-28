import { ManualPlan } from '@/data/manual-plans';
import { ComparisonInsight } from './comparisonAnalyzer';

export class AdvancedInsights {
  
  /**
   * Generate advanced price insights with market context
   */
  static generateAdvancedPriceInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    if (plan.category !== 'electricity') {
      const categoryPlans = allPlans.filter(p => p.category === plan.category && p.regularPrice > 0);
      const prices = categoryPlans.map(p => p.regularPrice).sort((a, b) => a - b);
      
      if (prices.length < 2) return insights;
      
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const minPrice = prices[0];
      const maxPrice = prices[prices.length - 1];
      const medianPrice = prices[Math.floor(prices.length / 2)];
      
      // Market position analysis
      const pricePercentile = (prices.indexOf(plan.regularPrice) / (prices.length - 1)) * 100;
      
      if (plan.regularPrice === minPrice) {
        insights.push({
          type: 'advantage',
          category: 'price',
          title: '🏆 המחיר הזול ביותר בשוק',
          description: `המסלול הזה מציע את המחיר הטוב ביותר - חיסכון של עד ₪${maxPrice - minPrice} לחודש (₪${(maxPrice - minPrice) * 12} בשנה) לעומת המסלול היקר ביותר`,
          impact: 'critical',
          confidence: 0.98,
          urgency: 'immediate',
          dataSource: 'pricing'
        });
      } else if (pricePercentile <= 25) {
        const annualSavings = (avgPrice - plan.regularPrice) * 12;
        insights.push({
          type: 'advantage',
          category: 'price',
          title: '💰 מחיר מעולה - ברבעון התחתון',
          description: `המסלול נמצא ב-25% הזולים ביותר בקטגוריה. חיסכון של ₪${Math.round(avgPrice - plan.regularPrice)} לחודש (₪${Math.round(annualSavings)} בשנה) לעומת הממוצע`,
          impact: 'high',
          confidence: 0.92,
          urgency: 'immediate',
          dataSource: 'pricing'
        });
      } else if (pricePercentile >= 75) {
        const extraCost = (plan.regularPrice - avgPrice) * 12;
        insights.push({
          type: 'disadvantage',
          category: 'price',
          title: '💸 מחיר גבוה - ברבעון העליון',
          description: `המסלול יקר ב-₪${Math.round(plan.regularPrice - avgPrice)} לחודש (₪${Math.round(extraCost)} בשנה) מהממוצע בקטגוריה`,
          impact: 'high',
          confidence: 0.90,
          urgency: 'immediate',
          dataSource: 'pricing'
        });
      }

      // Intro price analysis
      if (plan.introPrice > 0 && plan.introPrice < plan.regularPrice * 0.8) {
        const introSavings = (plan.regularPrice - plan.introPrice) * plan.introMonths;
        const priceIncrease = ((plan.regularPrice - plan.introPrice) / plan.introPrice) * 100;
        
        insights.push({
          type: 'warning',
          category: 'price',
          title: '⚠️ זהירות - עליית מחיר משמעותית',
          description: `המחיר יעלה ב-${Math.round(priceIncrease)}% אחרי ${plan.introMonths} חודשים (מ-₪${plan.introPrice} ל-₪${plan.regularPrice}). חיסכון ראשוני: ₪${introSavings}`,
          impact: 'high',
          confidence: 0.95,
          urgency: 'soon',
          dataSource: 'pricing'
        });
      }
    } else {
      // Electricity-specific insights
      const discountPercent = parseFloat(plan.speed.replace('%', '')) || 0;
      const categoryPlans = allPlans.filter(p => p.category === 'electricity');
      const discounts = categoryPlans.map(p => parseFloat(p.speed.replace('%', '')) || 0);
      const maxDiscount = Math.max(...discounts);
      
      if (discountPercent === maxDiscount) {
        insights.push({
          type: 'advantage',
          category: 'price',
          title: '⚡ ההנחה הגבוהה ביותר בחשמל',
          description: `המסלול מציע הנחה של ${discountPercent}% - החיסכון המקסימלי הזמין בשוק החשמל`,
          impact: 'critical',
          confidence: 0.98,
          urgency: 'immediate',
          dataSource: 'pricing'
        });
      } else if (discountPercent >= maxDiscount * 0.8) {
        insights.push({
          type: 'advantage',
          category: 'price',
          title: '💡 הנחה תחרותית מאוד',
          description: `הנחה של ${discountPercent}% - קרוב לטוב ביותר בשוק (${maxDiscount}%)`,
          impact: 'high',
          confidence: 0.90,
          urgency: 'immediate',
          dataSource: 'pricing'
        });
      }
    }
    
    return insights;
  }

  /**
   * Generate advanced feature insights with competitive analysis
   */
  static generateAdvancedFeatureInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    const categoryPlans = allPlans.filter(p => p.category === plan.category);
    const allFeatures = [...new Set(categoryPlans.flatMap(p => p.features))];
    const avgFeatures = categoryPlans.reduce((sum, p) => sum + p.features.length, 0) / categoryPlans.length;
    
    // Unique feature analysis
    const uniqueFeatures = plan.features.filter(f => 
      !allPlans.some(p => p.id !== plan.id && p.features.includes(f))
    );
    
    if (uniqueFeatures.length > 0) {
      const impact = uniqueFeatures.length >= 3 ? 'critical' : uniqueFeatures.length >= 2 ? 'high' : 'medium';
      insights.push({
        type: 'advantage',
        category: 'features',
        title: `🌟 ${uniqueFeatures.length} תכונות ייחודיות`,
        description: `התכונות הייחודיות: ${uniqueFeatures.slice(0, 3).join(', ')}${uniqueFeatures.length > 3 ? ` ועוד ${uniqueFeatures.length - 3}` : ''}`,
        impact,
        confidence: 0.95,
        urgency: 'immediate',
        dataSource: 'features'
      });
    }

    // Feature density analysis
    const featureDensity = plan.features.length / (plan.regularPrice || 100);
    const avgFeatureDensity = categoryPlans.reduce((sum, p) => sum + (p.features.length / (p.regularPrice || 100)), 0) / categoryPlans.length;
    
    if (featureDensity > avgFeatureDensity * 1.3) {
      insights.push({
        type: 'advantage',
        category: 'features',
        title: '📊 צפיפות תכונות מעולה',
        description: `יחס מעולה של תכונות למחיר - ${Math.round(featureDensity * 100)} תכונות לכל ₪100 (ממוצע: ${Math.round(avgFeatureDensity * 100)})`,
        impact: 'high',
        confidence: 0.88,
        urgency: 'immediate',
        dataSource: 'features'
      });
    }

    // Critical features analysis by category
    const criticalFeatures = this.getCriticalFeatures(plan.category);
    const hasCriticalFeatures = criticalFeatures.filter(cf => 
      plan.features.some(f => f.toLowerCase().includes(cf.toLowerCase()))
    );
    
    if (hasCriticalFeatures.length > 0) {
      insights.push({
        type: 'advantage',
        category: 'features',
        title: '✅ תכונות קריטיות כלולות',
        description: `המסלול כולל תכונות חיוניות: ${hasCriticalFeatures.slice(0, 2).join(', ')}`,
        impact: 'high',
        confidence: 0.92,
        urgency: 'immediate',
        dataSource: 'features'
      });
    }

    const missingCriticalFeatures = criticalFeatures.filter(cf => 
      !plan.features.some(f => f.toLowerCase().includes(cf.toLowerCase()))
    );
    
    if (missingCriticalFeatures.length > 0) {
      insights.push({
        type: 'disadvantage',
        category: 'features',
        title: '❌ חסרות תכונות חיוניות',
        description: `תכונות חסרות: ${missingCriticalFeatures.slice(0, 2).join(', ')}`,
        impact: 'medium',
        confidence: 0.85,
        urgency: 'monitor',
        dataSource: 'features'
      });
    }
    
    return insights;
  }

  /**
   * Generate market insights
   */
  static generateMarketInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    const marketShare = this.getEstimatedMarketShare(plan.company);
    const brandRecognition = this.getBrandRecognitionScore(plan.company);
    
    if (marketShare >= 0.2) {
      insights.push({
        type: 'advantage',
        category: 'market',
        title: '🏢 מוביל שוק מבוסס',
        description: `${plan.company} מחזיקים ב-${Math.round(marketShare * 100)}% מהשוק - יביל יותר ותמיכה נרחבת`,
        impact: 'medium',
        confidence: 0.85,
        urgency: 'monitor',
        dataSource: 'market'
      });
    } else if (marketShare <= 0.05) {
      insights.push({
        type: 'opportunity',
        category: 'market',
        title: '🚀 שחקן חדשני מתפתח',
        description: `${plan.company} הם שחקן קטן יותר בשוק - עשויים להציע שירות אישי יותר ומחירים תחרותיים`,
        impact: 'medium',
        confidence: 0.75,
        urgency: 'monitor',
        dataSource: 'market'
      });
    }

    // Competition intensity
    const categoryCompetitors = [...new Set(allPlans.filter(p => p.category === plan.category).map(p => p.company))];
    if (categoryCompetitors.length >= 5) {
      insights.push({
        type: 'opportunity',
        category: 'market',
        title: '⚔️ תחרות גבוהה - הזדמנויות לחיסכון',
        description: `${categoryCompetitors.length} מתחרים בקטגוריה - תחרות גבוהה מובילה למחירים טובים יותר`,
        impact: 'medium',
        confidence: 0.80,
        urgency: 'monitor',
        dataSource: 'market'
      });
    }
    
    return insights;
  }

  /**
   * Generate trend insights
   */
  static generateTrendInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    const trends = this.getCategoryTrends(plan.category);
    
    if (trends.priceDirection === 'up') {
      insights.push({
        type: 'trend',
        category: 'future',
        title: '📈 מגמת עליית מחירים בקטגוריה',
        description: `מחירי ${this.getCategoryDisplayName(plan.category)} בעלייה - כדאי לנעול מחיר עכשיו`,
        impact: 'high',
        confidence: 0.75,
        urgency: 'soon',
        dataSource: 'predictions'
      });
    } else if (trends.priceDirection === 'down') {
      insights.push({
        type: 'opportunity',
        category: 'future',
        title: '📉 מגמת ירידת מחירים בקטגוריה',
        description: `מחירי ${this.getCategoryDisplayName(plan.category)} בירידה - אפשר לחכות למחירים טובים יותר`,
        impact: 'medium',
        confidence: 0.70,
        urgency: 'monitor',
        dataSource: 'predictions'
      });
    }

    if (trends.innovationRate > 0.7) {
      insights.push({
        type: 'trend',
        category: 'future',
        title: '🔬 קטגוריה בחדשנות גבוהה',
        description: `תחום ${this.getCategoryDisplayName(plan.category)} בפיתוח מהיר - כדאי לבחור ספקים חדשניים`,
        impact: 'medium',
        confidence: 0.80,
        urgency: 'eventual',
        dataSource: 'predictions'
      });
    }
    
    return insights;
  }

  /**
   * Generate ROI insights
   */
  static generateROIInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    if (plan.category === 'electricity') {
      const discountPercent = parseFloat(plan.speed.replace('%', '')) || 0;
      const estimatedMonthlyBill = 400; // Average household electricity bill
      const monthlySavings = estimatedMonthlyBill * (discountPercent / 100);
      const annualSavings = monthlySavings * 12;
      
      if (annualSavings > 500) {
        insights.push({
          type: 'advantage',
          category: 'roi',
          title: '💰 חיסכון שנתי משמעותי',
          description: `חיסכון צפוי של ₪${Math.round(monthlySavings)} לחודש, ₪${Math.round(annualSavings)} בשנה (בהשוואה לחשמל רגיל)`,
          impact: 'high',
          confidence: 0.85,
          urgency: 'immediate',
          dataSource: 'user_behavior'
        });
      }
    } else {
      // ROI for other categories
      const categoryPlans = allPlans.filter(p => p.category === plan.category && p.regularPrice > 0);
      const avgPrice = categoryPlans.reduce((sum, p) => sum + p.regularPrice, 0) / categoryPlans.length;
      const featureValue = plan.features.length / Math.max(...categoryPlans.map(p => p.features.length));
      const priceEfficiency = avgPrice / plan.regularPrice;
      const roiScore = (featureValue * priceEfficiency) * 100;
      
      if (roiScore > 120) {
        insights.push({
          type: 'advantage',
          category: 'roi',
          title: '📈 יחס תועלת-עלות מעולה',
          description: `המסלול מציע יחס מעולה בין תכונות למחיר - ציון ROI ${Math.round(roiScore)}`,
          impact: 'high',
          confidence: 0.80,
          urgency: 'immediate',
          dataSource: 'user_behavior'
        });
      }
    }
    
    return insights;
  }

  // Helper methods
  private static getCriticalFeatures(category: string): string[] {
    const features: Record<string, string[]> = {
      internet: ['סיבים', 'WiFi', 'מהירות', 'יציבות'],
      mobile: ['ללא הגבלה', '4G', '5G', 'דקות'],
      electricity: ['מונה חכם', 'הנחה', 'קבוע', 'זמן'],
      tv: ['HD', '4K', 'ערוצים', 'סטרימינג']
    };
    return features[category] || [];
  }

  private static getEstimatedMarketShare(company: string): number {
    const marketShares: Record<string, number> = {
      'בזק': 0.35, 'פרטנר': 0.25, 'סלקום': 0.20, 'הוט': 0.15,
      'פלאפון': 0.30, 'רמי לוי': 0.10, 'גולן טלקום': 0.05,
      'אלקטרה פאוור': 0.15, 'אמישראגז חשמל': 0.20, 'פזגז': 0.12
    };
    return marketShares[company] || 0.05;
  }

  private static getBrandRecognitionScore(company: string): number {
    const brandScores: Record<string, number> = {
      'בזק': 95, 'פרטנר': 90, 'סלקום': 88, 'הוט': 85,
      'פלאפון': 87, 'רמי לוי': 75, 'אלקטרה פאוור': 80,
      'אמישראגז חשמל': 85, 'פזגז': 82, 'YES': 88
    };
    return brandScores[company] || 60;
  }

  private static getCategoryTrends(category: string) {
    const trends: Record<string, any> = {
      electricity: { priceDirection: 'up', competitionIntensity: 0.8, innovationRate: 0.6 },
      internet: { priceDirection: 'stable', competitionIntensity: 0.9, innovationRate: 0.8 },
      mobile: { priceDirection: 'down', competitionIntensity: 0.95, innovationRate: 0.7 },
      tv: { priceDirection: 'up', competitionIntensity: 0.7, innovationRate: 0.9 }
    };
    return trends[category] || trends.electricity;
  }

  private static getCategoryDisplayName(category: string): string {
    const names: Record<string, string> = {
      electricity: 'חשמל',
      internet: 'אינטרנט',
      mobile: 'סלולר',
      tv: 'טלוויזיה'
    };
    return names[category] || category;
  }
}