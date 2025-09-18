import { ManualPlan } from '@/data/manual-plans';
import { logger } from './logger';

export interface ComparisonScore {
  overall: number;
  value: number;
  features: number;
  usability: number;
  reliability: number;
}

export interface ComparisonInsight {
  type: 'advantage' | 'disadvantage' | 'neutral' | 'warning';
  category: 'price' | 'features' | 'performance' | 'contract' | 'quality';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface DetailedComparison {
  planId: string;
  rank: number;
  score: ComparisonScore;
  insights: ComparisonInsight[];
  strongPoints: string[];
  weakPoints: string[];
  bestFor: string[];
  notRecommendedFor: string[];
  priceAnalysis: {
    isCompetitive: boolean;
    savingsVsBest: number;
    valueRating: number;
  };
}

export interface ComparisonMatrix {
  plans: DetailedComparison[];
  summary: {
    bestOverall: string;
    bestValue: string;
    bestFeatures: string;
    mostReliable: string;
    recommendations: string[];
  };
  categoryAnalysis: {
    averagePrice: number;
    priceRange: [number, number];
    commonFeatures: string[];
    uniqueFeatures: Record<string, string[]>;
  };
}

export class ComparisonAnalyzer {
  
  /**
   * Perform comprehensive comparison analysis
   */
  static analyzeComparison(plans: ManualPlan[]): ComparisonMatrix {
    logger.info('Starting comprehensive comparison analysis', 'ComparisonAnalyzer', {
      plansCount: plans.length,
      categories: [...new Set(plans.map(p => p.category))]
    });

    // Validate same category for accurate comparison
    const categories = [...new Set(plans.map(p => p.category))];
    const isSameCategory = categories.length === 1;

    if (!isSameCategory) {
      logger.warn('Comparing plans from different categories', 'ComparisonAnalyzer', { categories });
    }

    const detailedComparisons = plans.map((plan, index) => 
      this.analyzePlan(plan, plans, index)
    );

    // Sort by overall score
    detailedComparisons.sort((a, b) => b.score.overall - a.score.overall);
    
    // Update ranks after sorting
    detailedComparisons.forEach((comp, index) => {
      comp.rank = index + 1;
    });

    const categoryAnalysis = this.analyzeCategoryMetrics(plans);
    const summary = this.generateSummary(detailedComparisons, plans);

    return {
      plans: detailedComparisons,
      summary,
      categoryAnalysis
    };
  }

  /**
   * Analyze individual plan in context of all compared plans
   */
  private static analyzePlan(plan: ManualPlan, allPlans: ManualPlan[], index: number): DetailedComparison {
    const score = this.calculateComparisonScore(plan, allPlans);
    const insights = this.generateInsights(plan, allPlans);
    const priceAnalysis = this.analyzePricing(plan, allPlans);
    
    const { strongPoints, weakPoints } = this.identifyStrengthsWeaknesses(plan, allPlans);
    const { bestFor, notRecommendedFor } = this.generateUseCaseRecommendations(plan, allPlans);

    return {
      planId: plan.id,
      rank: index + 1, // Will be updated after sorting
      score,
      insights,
      strongPoints,
      weakPoints,
      bestFor,
      notRecommendedFor,
      priceAnalysis
    };
  }

  /**
   * Calculate comprehensive comparison scores
   */
  private static calculateComparisonScore(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonScore {
    // Price competitiveness (40% weight)
    const priceScore = this.calculatePriceScore(plan, allPlans);
    
    // Feature richness (30% weight)  
    const featuresScore = this.calculateFeaturesScore(plan, allPlans);
    
    // Usability factors (20% weight)
    const usabilityScore = this.calculateUsabilityScore(plan);
    
    // Reliability indicators (10% weight)
    const reliabilityScore = this.calculateReliabilityScore(plan);

    const overall = Math.round(
      priceScore * 0.4 + 
      featuresScore * 0.3 + 
      usabilityScore * 0.2 + 
      reliabilityScore * 0.1
    );

    return {
      overall,
      value: priceScore,
      features: featuresScore,
      usability: usabilityScore,
      reliability: reliabilityScore
    };
  }

  /**
   * Calculate price competitiveness score
   */
  private static calculatePriceScore(plan: ManualPlan, allPlans: ManualPlan[]): number {
    if (plan.category === 'electricity') {
      // For electricity, higher percentage discount is better
      const discountValue = parseFloat(plan.speed.replace('%', '')) || 0;
      const maxDiscount = Math.max(...allPlans.map(p => parseFloat(p.speed.replace('%', '')) || 0));
      return Math.round((discountValue / maxDiscount) * 100);
    }

    // For other categories, lower price is better
    const prices = allPlans.map(p => p.regularPrice).sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    
    if (maxPrice === minPrice) return 100; // All same price
    
    // Invert scale: lower price = higher score
    const pricePosition = (maxPrice - plan.regularPrice) / (maxPrice - minPrice);
    return Math.round(pricePosition * 100);
  }

  /**
   * Calculate features richness score
   */
  private static calculateFeaturesScore(plan: ManualPlan, allPlans: ManualPlan[]): number {
    const totalFeatures = [...new Set(allPlans.flatMap(p => p.features))];
    const planFeatureCount = plan.features.length;
    const maxFeatures = Math.max(...allPlans.map(p => p.features.length));
    
    // Base score from feature count
    let score = (planFeatureCount / maxFeatures) * 80;
    
    // Bonus for unique valuable features
    const uniqueFeatures = plan.features.filter(f => 
      !allPlans.some(p => p.id !== plan.id && p.features.includes(f))
    );
    score += uniqueFeatures.length * 5;
    
    return Math.min(100, Math.round(score));
  }

  /**
   * Calculate usability score based on plan characteristics
   */
  private static calculateUsabilityScore(plan: ManualPlan): number {
    let score = 70; // Base score
    
    // Category-specific usability factors
    switch (plan.category) {
      case 'internet':
        const speed = parseFloat(plan.downloadSpeed) || 0;
        if (speed >= 100) score += 20;
        else if (speed >= 50) score += 10;
        break;
        
      case 'mobile':
        if (plan.features.some(f => f.includes('ללא הגבלה'))) score += 15;
        if (plan.dataAmount && plan.dataAmount.includes('GB')) {
          const gbAmount = parseFloat(plan.dataAmount);
          if (gbAmount >= 50) score += 10;
        }
        break;
        
      case 'electricity':
        if (plan.features.some(f => f.includes('מונה חכם'))) score += 10;
        break;
    }
    
    // Plan name clarity bonus
    if (plan.planName.length < 30) score += 5;
    
    return Math.min(100, Math.round(score));
  }

  /**
   * Calculate reliability score based on provider reputation and plan stability
   */
  private static calculateReliabilityScore(plan: ManualPlan): number {
    // Provider reputation scores (simplified)
    const providerScores: Record<string, number> = {
      'בזק': 90,
      'פרטנר': 85,
      'סלקום': 88,
      'הוט': 82,
      'רמי לוי': 75,
      'פלאפון': 85,
      'גולן טלקום': 70,
      'אקטיב': 72,
      'אלקטרה פאוור': 80,
      'אמישראגז חשמל': 85,
      'פזגז': 82,
      'הוט אנרגי': 80,
      'סלקום אנרגי': 85,
      'פרטנר פאוור': 83
    };
    
    return providerScores[plan.company] || 75;
  }

  /**
   * Generate actionable insights for each plan
   */
  private static generateInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    // Price insights
    const priceInsights = this.generatePriceInsights(plan, allPlans);
    insights.push(...priceInsights);
    
    // Feature insights
    const featureInsights = this.generateFeatureInsights(plan, allPlans);
    insights.push(...featureInsights);
    
    // Performance insights
    const performanceInsights = this.generatePerformanceInsights(plan, allPlans);
    insights.push(...performanceInsights);
    
    return insights;
  }

  /**
   * Generate price-related insights
   */
  private static generatePriceInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    if (plan.category !== 'electricity') {
      const prices = allPlans.map(p => p.regularPrice).sort((a, b) => a - b);
      const minPrice = prices[0];
      const maxPrice = prices[prices.length - 1];
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      
      if (plan.regularPrice === minPrice) {
        insights.push({
          type: 'advantage',
          category: 'price',
          title: 'המחיר הטוב ביותר',
          description: `זהו המסלול הזול ביותר מבין כל המושווים - חיסכון של עד ₪${maxPrice - minPrice} לחודש`,
          impact: 'high',
          confidence: 0.95
        });
      } else if (plan.regularPrice <= avgPrice) {
        insights.push({
          type: 'advantage',
          category: 'price',
          title: 'מחיר תחרותי',
          description: `המחיר נמוך מהממוצע ב-₪${Math.round(avgPrice - plan.regularPrice)} לחודש`,
          impact: 'medium',
          confidence: 0.85
        });
      } else if (plan.regularPrice === maxPrice) {
        insights.push({
          type: 'disadvantage',
          category: 'price',
          title: 'המחיר הגבוה ביותר',
          description: `זהו המסלול היקר ביותר - ₪${plan.regularPrice - minPrice} יותר מהזול ביותר`,
          impact: 'high',
          confidence: 0.95
        });
      }
    }
    
    return insights;
  }

  /**
   * Generate feature-related insights
   */
  private static generateFeatureInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    const allFeatures = [...new Set(allPlans.flatMap(p => p.features))];
    const uniqueFeatures = plan.features.filter(f => 
      !allPlans.some(p => p.id !== plan.id && p.features.includes(f))
    );
    
    if (uniqueFeatures.length > 0) {
      insights.push({
        type: 'advantage',
        category: 'features',
        title: 'תכונות ייחודיות',
        description: `כולל ${uniqueFeatures.length} תכונות שלא קיימות במסלולים האחרים`,
        impact: uniqueFeatures.length > 2 ? 'high' : 'medium',
        confidence: 0.9
      });
    }
    
    const maxFeatures = Math.max(...allPlans.map(p => p.features.length));
    if (plan.features.length === maxFeatures) {
      insights.push({
        type: 'advantage',
        category: 'features',
        title: 'עשיר בתכונות',
        description: `המסלול עם מספר התכונות הגבוה ביותר (${plan.features.length})`,
        impact: 'medium',
        confidence: 0.85
      });
    }
    
    return insights;
  }

  /**
   * Generate performance-related insights
   */
  private static generatePerformanceInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    if (plan.category === 'internet' && plan.downloadSpeed) {
      const speed = parseFloat(plan.downloadSpeed);
      const speeds = allPlans.map(p => parseFloat(p.downloadSpeed) || 0);
      const maxSpeed = Math.max(...speeds);
      
      if (speed === maxSpeed && speed > 0) {
        insights.push({
          type: 'advantage',
          category: 'performance',
          title: 'המהירות הגבוהה ביותר',
          description: `מהירות הורדה מקסימלית של ${speed} Mbps`,
          impact: 'high',
          confidence: 0.9
        });
      }
    }
    
    return insights;
  }

  /**
   * Identify strengths and weaknesses
   */
  private static identifyStrengthsWeaknesses(plan: ManualPlan, allPlans: ManualPlan[]): {
    strongPoints: string[];
    weakPoints: string[];
  } {
    const strongPoints: string[] = [];
    const weakPoints: string[] = [];
    
    // Price analysis
    if (plan.category !== 'electricity') {
      const prices = allPlans.map(p => p.regularPrice).sort((a, b) => a - b);
      if (plan.regularPrice === prices[0]) {
        strongPoints.push('המחיר הטוב ביותר בהשוואה');
      } else if (plan.regularPrice === prices[prices.length - 1]) {
        weakPoints.push('המחיר הגבוה ביותר בין המושווים');
      }
    }
    
    // Feature analysis
    const maxFeatures = Math.max(...allPlans.map(p => p.features.length));
    const minFeatures = Math.min(...allPlans.map(p => p.features.length));
    
    if (plan.features.length === maxFeatures) {
      strongPoints.push('מספר התכונות הגבוה ביותר');
    } else if (plan.features.length === minFeatures && maxFeatures > minFeatures) {
      weakPoints.push('מספר תכונות מוגבל יחסית');
    }
    
    // Category-specific analysis
    if (plan.category === 'internet') {
      const speed = parseFloat(plan.downloadSpeed) || 0;
      if (speed >= 100) {
        strongPoints.push('מהירות אינטרנט גבוהה');
      } else if (speed < 50) {
        weakPoints.push('מהירות אינטרנט נמוכה יחסית');
      }
    }
    
    return { strongPoints, weakPoints };
  }

  /**
   * Generate use case recommendations
   */
  private static generateUseCaseRecommendations(plan: ManualPlan, allPlans: ManualPlan[]): {
    bestFor: string[];
    notRecommendedFor: string[];
  } {
    const bestFor: string[] = [];
    const notRecommendedFor: string[] = [];
    
    switch (plan.category) {
      case 'internet':
        const speed = parseFloat(plan.downloadSpeed) || 0;
        if (speed >= 100) {
          bestFor.push('משפחות גדולות', 'עבודה מהבית', 'גיימרים');
        } else if (speed >= 50) {
          bestFor.push('זוגות צעירים', 'שימוש בינוני באינטרנט');
        } else {
          bestFor.push('שימוש בסיסי', 'תקציב מוגבל');
          notRecommendedFor.push('שימוש כבד באינטרנט', 'משפחות גדולות');
        }
        break;
        
      case 'mobile':
        if (plan.features.some(f => f.includes('ללא הגבלה'))) {
          bestFor.push('שימוש כבד בנתונים', 'עבודה נייד');
        }
        break;
        
      case 'electricity':
        const discount = parseFloat(plan.speed.replace('%', '')) || 0;
        if (discount >= 15) {
          bestFor.push('משפחות עם צריכה גבוהה', 'חיסכון מקסימלי');
        }
        break;
    }
    
    return { bestFor, notRecommendedFor };
  }

  /**
   * Analyze pricing in context
   */
  private static analyzePricing(plan: ManualPlan, allPlans: ManualPlan[]): DetailedComparison['priceAnalysis'] {
    if (plan.category === 'electricity') {
      const discount = parseFloat(plan.speed.replace('%', '')) || 0;
      const maxDiscount = Math.max(...allPlans.map(p => parseFloat(p.speed.replace('%', '')) || 0));
      
      return {
        isCompetitive: discount >= maxDiscount * 0.8,
        savingsVsBest: maxDiscount - discount,
        valueRating: Math.round((discount / maxDiscount) * 100)
      };
    }
    
    const prices = allPlans.map(p => p.regularPrice).sort((a, b) => a - b);
    const minPrice = prices[0];
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    return {
      isCompetitive: plan.regularPrice <= avgPrice,
      savingsVsBest: plan.regularPrice - minPrice,
      valueRating: Math.round(((avgPrice - plan.regularPrice) / avgPrice) * 100 + 50)
    };
  }

  /**
   * Analyze category-wide metrics
   */
  private static analyzeCategoryMetrics(plans: ManualPlan[]): ComparisonMatrix['categoryAnalysis'] {
    const prices = plans.filter(p => p.category !== 'electricity').map(p => p.regularPrice);
    const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const priceRange: [number, number] = prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [0, 0];
    
    // Find common features (appear in 50% or more plans)
    const allFeatures = plans.flatMap(p => p.features);
    const featureCounts: Record<string, number> = {};
    allFeatures.forEach(feature => {
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });
    
    const commonFeatures = Object.entries(featureCounts)
      .filter(([_, count]) => count >= Math.ceil(plans.length * 0.5))
      .map(([feature, _]) => feature)
      .slice(0, 5);
    
    // Find unique features per plan
    const uniqueFeatures: Record<string, string[]> = {};
    plans.forEach(plan => {
      const unique = plan.features.filter(f => 
        !plans.some(p => p.id !== plan.id && p.features.includes(f))
      );
      if (unique.length > 0) {
        uniqueFeatures[plan.company] = unique;
      }
    });
    
    return {
      averagePrice,
      priceRange,
      commonFeatures,
      uniqueFeatures
    };
  }

  /**
   * Generate comparison summary
   */
  private static generateSummary(comparisons: DetailedComparison[], plans: ManualPlan[]): ComparisonMatrix['summary'] {
    const bestOverall = comparisons[0]?.planId || '';
    
    const bestValue = comparisons
      .filter(c => c.priceAnalysis.valueRating > 70)
      .sort((a, b) => b.priceAnalysis.valueRating - a.priceAnalysis.valueRating)[0]?.planId || bestOverall;
    
    const bestFeatures = comparisons
      .sort((a, b) => b.score.features - a.score.features)[0]?.planId || bestOverall;
    
    const mostReliable = comparisons
      .sort((a, b) => b.score.reliability - a.score.reliability)[0]?.planId || bestOverall;
    
    const recommendations = this.generateRecommendations(comparisons, plans);
    
    return {
      bestOverall,
      bestValue,
      bestFeatures,
      mostReliable,
      recommendations
    };
  }

  /**
   * Generate actionable recommendations
   */
  private static generateRecommendations(comparisons: DetailedComparison[], plans: ManualPlan[]): string[] {
    const recommendations: string[] = [];
    
    if (comparisons.length >= 2) {
      const topPlan = comparisons[0];
      const secondPlan = comparisons[1];
      
      const topPlanData = plans.find(p => p.id === topPlan.planId);
      const secondPlanData = plans.find(p => p.id === secondPlan.planId);
      
      if (topPlanData && secondPlanData) {
        recommendations.push(`המסלול המוביל: ${topPlanData.company} - ${topPlanData.planName}`);
        
        if (topPlan.score.overall - secondPlan.score.overall < 10) {
          recommendations.push(`גם ${secondPlanData.company} הוא אופציה מעולה - ההבדל קטן`);
        }
        
        if (topPlan.priceAnalysis.isCompetitive) {
          recommendations.push('המסלול המוביל גם מציע יחס מחיר-ביצועים מעולה');
        }
      }
    }
    
    return recommendations;
  }
}

export default ComparisonAnalyzer;