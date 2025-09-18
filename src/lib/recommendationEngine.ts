import { ManualPlan } from '@/data/manual-plans';
import { PlanRecord } from '@/hooks/useAllPlans';
import { logger } from './logger';

export interface SavingsCalculation {
  monthlySavings: number;
  annualSavings: number;
  percentageSaving: number;
  confidenceScore: number;
}

export interface RecommendationContext {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentProvider: string;
  currentAmount: number;
  familySize: number;
  usage: 'light' | 'medium' | 'heavy';
  budget: number;
  priorities: string[];
  homeType: 'apartment' | 'house' | 'office';
}

export interface EnhancedRecommendation {
  plan: ManualPlan | PlanRecord;
  score: number;
  savings: SavingsCalculation;
  matchReasons: string[];
  warnings: string[];
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Advanced recommendation engine with improved accuracy
 */
export class RecommendationEngine {
  
  /**
   * Calculate accurate savings with confidence scoring
   */
  static calculateSavings(currentAmount: number, planPrice: number, category: string): SavingsCalculation {
    const monthlySavings = Math.max(0, currentAmount - planPrice);
    const annualSavings = monthlySavings * 12;
    const percentageSaving = currentAmount > 0 ? (monthlySavings / currentAmount) * 100 : 0;
    
    // Calculate confidence based on savings amount and category
    let confidenceScore = 0.7; // Base confidence
    
    // Adjust confidence based on savings percentage
    if (percentageSaving > 30) {
      confidenceScore = Math.min(0.95, confidenceScore + 0.2); // High savings = high confidence
    } else if (percentageSaving > 15) {
      confidenceScore = Math.min(0.9, confidenceScore + 0.1);
    } else if (percentageSaving < 5) {
      confidenceScore = Math.max(0.3, confidenceScore - 0.2); // Low savings = lower confidence
    }
    
    // Category-specific confidence adjustments
    const categoryConfidence = {
      electricity: 0.85, // Most regulated, predictable
      internet: 0.8,     // Generally stable
      cellular: 0.75,    // Variable due to usage patterns
      tv: 0.7           // Most variable due to content preferences
    };
    
    confidenceScore *= categoryConfidence[category as keyof typeof categoryConfidence] || 0.7;
    
    return {
      monthlySavings,
      annualSavings,
      percentageSaving,
      confidenceScore
    };
  }

  /**
   * Generate smart recommendations based on user context
   */
  static generateRecommendations(
    plans: ManualPlan[],
    context: RecommendationContext
  ): EnhancedRecommendation[] {
    
    logger.info('Generating recommendations', 'RecommendationEngine', {
      category: context.category,
      plansCount: plans.length,
      currentAmount: context.currentAmount
    });

    const recommendations: EnhancedRecommendation[] = [];

    for (const plan of plans) {
      const score = this.calculatePlanScore(plan, context);
      const savings = this.calculateSavings(context.currentAmount, plan.regularPrice, context.category);
      const { matchReasons, warnings } = this.analyzePlanMatch(plan, context);
      
      recommendations.push({
        plan,
        score,
        savings,
        matchReasons,
        warnings,
        confidence: this.getConfidenceLevel(score, savings.confidenceScore)
      });
    }

    // Sort by score (highest first)
    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate comprehensive plan score
   */
  private static calculatePlanScore(plan: ManualPlan, context: RecommendationContext): number {
    let score = 0;
    const weights = {
      savings: 0.35,      // Savings importance
      budget: 0.25,       // Budget fit
      features: 0.20,     // Feature match
      usage: 0.15,        // Usage pattern match
      provider: 0.05      // Provider reputation
    };

    // 1. Savings Score (0-100)
    const potentialSavings = Math.max(0, context.currentAmount - plan.regularPrice);
    const savingsPercentage = context.currentAmount > 0 ? (potentialSavings / context.currentAmount) * 100 : 0;
    const savingsScore = Math.min(100, savingsPercentage * 2); // Cap at 100
    score += savingsScore * weights.savings;

    // 2. Budget Score (0-100)
    const budgetScore = plan.regularPrice <= context.budget ? 
      100 - ((plan.regularPrice / context.budget) * 20) : // Within budget gets high score
      Math.max(0, 100 - (((plan.regularPrice - context.budget) / context.budget) * 100)); // Over budget penalty
    score += budgetScore * weights.budget;

    // 3. Features Score (0-100)
    const featuresScore = this.calculateFeatureScore(plan, context);
    score += featuresScore * weights.features;

    // 4. Usage Score (0-100)
    const usageScore = this.calculateUsageScore(plan, context);
    score += usageScore * weights.usage;

    // 5. Provider Score (0-100) - Simple reputation scoring
    const providerScore = this.getProviderScore(plan.company);
    score += providerScore * weights.provider;

    // Normalize to 0-100 scale
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate feature matching score
   */
  private static calculateFeatureScore(plan: ManualPlan, context: RecommendationContext): number {
    let featureScore = 50; // Base score

    // Family size considerations
    if (context.familySize > 3) {
      const familyFeatures = plan.features.filter(f => 
        f.includes('משפחתי') || f.includes('רב משתמשים') || f.includes('קווי')
      );
      featureScore += familyFeatures.length * 15;
    }

    // Home type considerations
    if (context.homeType === 'office') {
      const businessFeatures = plan.features.filter(f => 
        f.includes('עסקי') || f.includes('מקצועי') || f.includes('SLA')
      );
      featureScore += businessFeatures.length * 10;
    }

    // Priority matching
    context.priorities.forEach(priority => {
      const matchingFeatures = plan.features.filter(f => 
        f.toLowerCase().includes(priority.toLowerCase())
      );
      featureScore += matchingFeatures.length * 8;
    });

    return Math.min(100, featureScore);
  }

  /**
   * Calculate usage pattern matching score
   */
  private static calculateUsageScore(plan: ManualPlan, context: RecommendationContext): number {
    let usageScore = 70; // Base score

    // Usage-specific logic by category
    switch (context.category) {
      case 'internet':
        if (context.usage === 'heavy' && plan.downloadSpeed) {
          const speed = parseFloat(plan.downloadSpeed);
          usageScore = speed > 100 ? 95 : speed > 50 ? 80 : 60;
        } else if (context.usage === 'light') {
          usageScore = 85; // Most plans suitable for light usage
        }
        break;

      case 'cellular':
        if (context.usage === 'heavy') {
          const hasUnlimitedData = plan.features.some(f => 
            f.includes('ללא הגבלה') || f.includes('אינסוף')
          );
          usageScore = hasUnlimitedData ? 90 : 65;
        }
        break;

      case 'tv':
        if (context.usage === 'heavy') {
          const hasStreamingServices = plan.features.some(f => 
            f.includes('נטפליקס') || f.includes('סטרימינג') || f.includes('הוט')
          );
          usageScore = hasStreamingServices ? 85 : 70;
        }
        break;
    }

    return usageScore;
  }

  /**
   * Get provider reputation score
   */
  private static getProviderScore(providerName: string): number {
    // Simplified provider scoring - in real app this would be data-driven
    const providerScores: Record<string, number> = {
      'בזק': 85,
      'פרטנר': 80,
      'סלקום': 82,
      'הוט': 78,
      'רמי לוי': 75,
      'פלאפון': 80,
      'גולן טלקום': 70,
      'אקטיב': 72
    };

    return providerScores[providerName] || 70; // Default score
  }

  /**
   * Analyze plan match and generate reasons/warnings
   */
  private static analyzePlanMatch(plan: ManualPlan, context: RecommendationContext): {
    matchReasons: string[];
    warnings: string[];
  } {
    const matchReasons: string[] = [];
    const warnings: string[] = [];

    // Analyze savings
    const savings = context.currentAmount - plan.regularPrice;
    if (savings > 0) {
      const percentage = (savings / context.currentAmount) * 100;
      if (percentage > 20) {
        matchReasons.push(`חיסכון משמעותי של ${percentage.toFixed(0)}% (₪${savings.toLocaleString()} לחודש)`);
      } else if (percentage > 10) {
        matchReasons.push(`חיסכון של ${percentage.toFixed(0)}% (₪${savings.toLocaleString()} לחודש)`);
      }
    } else if (savings < 0) {
      warnings.push(`המסלול יקר יותר ב-₪${Math.abs(savings).toLocaleString()} לחודש`);
    }

    // Budget analysis
    if (plan.regularPrice <= context.budget) {
      matchReasons.push('מתאים לתקציב שקבעת');
    } else {
      warnings.push(`חורג מהתקציב ב-₪${(plan.regularPrice - context.budget).toLocaleString()}`);
    }

    // Family size considerations
    if (context.familySize > 3) {
      const familyFeatures = plan.features.filter(f => 
        f.includes('משפחתי') || f.includes('רב משתמשים')
      );
      if (familyFeatures.length > 0) {
        matchReasons.push('מתאים למשפחות גדולות');
      }
    }

    // Usage patterns
    if (context.usage === 'heavy') {
      if (context.category === 'internet' && plan.downloadSpeed) {
        const speed = parseFloat(plan.downloadSpeed);
        if (speed > 100) {
          matchReasons.push('מהירות גבוהה לשימוש כثיף');
        } else if (speed < 50) {
          warnings.push('מהירות נמוכה עבור שימוש כבד');
        }
      }
    }

    return { matchReasons, warnings };
  }

  /**
   * Determine confidence level
   */
  private static getConfidenceLevel(score: number, confidenceScore: number): 'high' | 'medium' | 'low' {
    const combinedScore = (score / 100) * confidenceScore;
    
    if (combinedScore >= 0.8) return 'high';
    if (combinedScore >= 0.6) return 'medium';
    return 'low';
  }

  /**
   * Validate recommendation data accuracy
   */
  static validateRecommendationData(context: RecommendationContext): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Validate current amount
    if (context.currentAmount <= 0) {
      issues.push('סכום נוכחי לא תקין');
    }

    // Category-specific validations
    switch (context.category) {
      case 'electricity':
        if (context.currentAmount < 100) {
          suggestions.push('חשבון חשמל נמוך מהממוצע - בדוק שכללת את כל הרכיבים');
        }
        if (context.currentAmount > 2000) {
          suggestions.push('חשבון חשמל גבוה מהממוצע - בדוק צריכת חשמל');
        }
        break;

      case 'cellular':
        if (context.currentAmount < 30) {
          suggestions.push('תעריף סלולר נמוך - בדוק שכללת את כל השירותים');
        }
        if (context.currentAmount > 200 && context.familySize <= 2) {
          suggestions.push('תעריף סלולר גבוה יחסית לגודל המשפחה');
        }
        break;

      case 'internet':
        if (context.currentAmount < 50) {
          suggestions.push('תעריף אינטרנט נמוך - ודא שכללת את כל השירותים');
        }
        break;

      case 'tv':
        if (context.currentAmount < 40) {
          suggestions.push('תעריף טלוויזיה נמוך - בדוק שכללת את כל החבילות');
        }
        break;
    }

    // Budget validation
    if (context.budget < context.currentAmount * 0.7) {
      suggestions.push('התקציב שקבעת נמוך מדי - ייתכן שתקשה למצוא חיסכון משמעותי');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}