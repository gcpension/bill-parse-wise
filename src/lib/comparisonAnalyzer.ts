import { ManualPlan } from '@/data/manual-plans';
import { logger } from './logger';
import { AdvancedAnalytics } from './advancedAnalytics';
import { AdvancedInsights } from './advancedInsights';

export interface ComparisonScore {
  overall: number;
  value: number;
  features: number;
  usability: number;
  reliability: number;
  marketPosition: number;
  futureProofing: number;
  customerSatisfaction: number;
  roi: number;
}

export interface ComparisonInsight {
  type: 'advantage' | 'disadvantage' | 'neutral' | 'warning' | 'opportunity' | 'trend';
  category: 'price' | 'features' | 'performance' | 'contract' | 'quality' | 'market' | 'future' | 'roi';
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  urgency: 'immediate' | 'soon' | 'eventual' | 'monitor';
  dataSource: 'pricing' | 'features' | 'market' | 'predictions' | 'user_behavior';
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
    roi12Months: number;
    roi24Months: number;
    inflationAdjusted: number;
    marketRanking: number;
  };
  riskAssessment: {
    priceStability: 'stable' | 'volatile' | 'increasing' | 'decreasing';
    contractFlexibility: number;
    providerStability: number;
    technologyRisk: number;
    overallRisk: 'low' | 'medium' | 'high';
  };
  predictiveInsights: {
    priceProjection6Months: number;
    priceProjection12Months: number;
    marketTrend: 'improving' | 'stable' | 'declining';
    competitivePosition: string;
    userSatisfactionTrend: 'up' | 'stable' | 'down';
  };
}

export interface ComparisonMatrix {
  plans: DetailedComparison[];
  summary: {
    bestOverall: string;
    bestValue: string;
    bestFeatures: string;
    mostReliable: string;
    bestRoi: string;
    safestChoice: string;
    innovativePick: string;
    recommendations: string[];
    marketInsights: string[];
    seasonalFactors: string[];
  };
  categoryAnalysis: {
    averagePrice: number;
    priceRange: [number, number];
    commonFeatures: string[];
    uniqueFeatures: Record<string, string[]>;
    marketTrends: {
      priceDirection: 'up' | 'down' | 'stable';
      competitionIntensity: number;
      innovationRate: number;
      customerSwitchingRate: number;
    };
    benchmarkMetrics: {
      industryAveragePrice: number;
      topPerformerScore: number;
      valueThreshold: number;
      premiumJustificationScore: number;
    };
  };
  aiInsights: {
    overallRecommendation: string;
    riskWarnings: string[];
    opportunityAlerts: string[];
    seasonalConsiderations: string[];
    personalizedAdvice: string[];
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
    const aiInsights = this.generateAIInsights(detailedComparisons, plans);

    return {
      plans: detailedComparisons,
      summary,
      categoryAnalysis,
      aiInsights
    };
  }

  /**
   * Analyze individual plan in context of all compared plans with advanced analytics
   */
  private static analyzePlan(plan: ManualPlan, allPlans: ManualPlan[], index: number): DetailedComparison {
    const score = this.calculateComparisonScore(plan, allPlans);
    const insights = this.generateAdvancedInsights(plan, allPlans);
    const priceAnalysis = this.analyzePricingAdvanced(plan, allPlans);
    const riskAssessment = AdvancedAnalytics.generateRiskAssessment(plan);
    const predictiveInsights = AdvancedAnalytics.generatePredictiveInsights(plan, allPlans);
    
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
      priceAnalysis,
      riskAssessment,
      predictiveInsights
    };
  }

  /**
   * Calculate comprehensive comparison scores with advanced metrics
   */
  private static calculateComparisonScore(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonScore {
    // Core scoring metrics with refined weights
    const priceScore = this.calculatePriceScore(plan, allPlans);
    const featuresScore = this.calculateFeaturesScore(plan, allPlans);
    const usabilityScore = this.calculateUsabilityScore(plan);
    const reliabilityScore = this.calculateReliabilityScore(plan);
    
    // Advanced metrics
    const marketPosition = this.calculateMarketPositionScore(plan, allPlans);
    const futureProofing = this.calculateFutureProofingScore(plan);
    const customerSatisfaction = this.calculateCustomerSatisfactionScore(plan);
    const roi = this.calculateROIScore(plan, allPlans);

    // Weighted overall calculation with dynamic weights based on category
    const weights = this.getDynamicWeights(plan.category);
    
    const overall = Math.round(
      priceScore * weights.price + 
      featuresScore * weights.features + 
      usabilityScore * weights.usability + 
      reliabilityScore * weights.reliability +
      marketPosition * weights.market +
      futureProofing * weights.future +
      customerSatisfaction * weights.satisfaction +
      roi * weights.roi
    );

    return {
      overall: Math.min(100, Math.max(0, overall)),
      value: priceScore,
      features: featuresScore,
      usability: usabilityScore,
      reliability: reliabilityScore,
      marketPosition,
      futureProofing,
      customerSatisfaction,
      roi
    };
  }

  /**
   * Get dynamic weights based on category
   */
  private static getDynamicWeights(category: string) {
    const baseWeights = {
      electricity: { price: 0.35, features: 0.20, usability: 0.15, reliability: 0.15, market: 0.05, future: 0.05, satisfaction: 0.03, roi: 0.02 },
      internet: { price: 0.25, features: 0.30, usability: 0.20, reliability: 0.10, market: 0.05, future: 0.05, satisfaction: 0.03, roi: 0.02 },
      mobile: { price: 0.30, features: 0.25, usability: 0.20, reliability: 0.10, market: 0.05, future: 0.05, satisfaction: 0.03, roi: 0.02 },
      tv: { price: 0.25, features: 0.35, usability: 0.15, reliability: 0.10, market: 0.05, future: 0.05, satisfaction: 0.03, roi: 0.02 }
    };
    
    return baseWeights[category as keyof typeof baseWeights] || baseWeights.electricity;
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
   * Calculate reliability score - REMOVED: No official data available
   * Returns 0 as we only show real data from official sources
   */
  private static calculateReliabilityScore(plan: ManualPlan): number {
    // No official reliability data available - returning 0
    return 0;
  }

  /**
   * Calculate market position score
   */
  private static calculateMarketPositionScore(plan: ManualPlan, allPlans: ManualPlan[]): number {
    return AdvancedAnalytics.calculateMarketPositionScore(plan, allPlans);
  }

  /**
   * Calculate future-proofing score
   */
  private static calculateFutureProofingScore(plan: ManualPlan): number {
    return AdvancedAnalytics.calculateFutureProofingScore(plan);
  }

  /**
   * Calculate customer satisfaction score
   */
  private static calculateCustomerSatisfactionScore(plan: ManualPlan): number {
    return AdvancedAnalytics.calculateCustomerSatisfactionScore(plan);
  }

  /**
   * Calculate ROI score
   */
  private static calculateROIScore(plan: ManualPlan, allPlans: ManualPlan[]): number {
    return AdvancedAnalytics.calculateROIScore(plan, allPlans);
  }

  /**
   * Generate advanced AI-powered insights for each plan
   */
  private static generateAdvancedInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    // Enhanced price insights
    const priceInsights = AdvancedInsights.generateAdvancedPriceInsights(plan, allPlans);
    insights.push(...priceInsights);
    
    // Feature insights with competitive analysis
    const featureInsights = AdvancedInsights.generateAdvancedFeatureInsights(plan, allPlans);
    insights.push(...featureInsights);
    
    // Performance insights with market context
    const performanceInsights = this.generateAdvancedPerformanceInsights(plan, allPlans);
    insights.push(...performanceInsights);

    // Market insights
    const marketInsights = AdvancedInsights.generateMarketInsights(plan, allPlans);
    insights.push(...marketInsights);

    // Future trends insights
    const trendInsights = AdvancedInsights.generateTrendInsights(plan, allPlans);
    insights.push(...trendInsights);

    // ROI insights
    const roiInsights = AdvancedInsights.generateROIInsights(plan, allPlans);
    insights.push(...roiInsights);
    
    return insights;
  }

  /**
   * Generate advanced performance insights
   */
  private static generateAdvancedPerformanceInsights(plan: ManualPlan, allPlans: ManualPlan[]): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    
    if (plan.category === 'internet' && plan.downloadSpeed) {
      const speed = parseFloat(plan.downloadSpeed);
      const speeds = allPlans.map(p => parseFloat(p.downloadSpeed) || 0);
      const maxSpeed = Math.max(...speeds);
      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      
      if (speed === maxSpeed && speed > 0) {
        insights.push({
          type: 'advantage',
          category: 'performance',
          title: 'המהירות הגבוהה ביותר',
          description: `מהירות הורדה מקסימלית של ${speed} Mbps - מושלם לעבודה מהבית וסטרימינג 4K`,
          impact: 'high',
          confidence: 0.9,
          urgency: 'immediate',
          dataSource: 'features'
        });
      } else if (speed >= avgSpeed * 1.5) {
        insights.push({
          type: 'advantage',
          category: 'performance',
          title: 'מהירות מעולה',
          description: `מהירות ${speed} Mbps - גבוה מהממוצע ב-${Math.round(((speed - avgSpeed) / avgSpeed) * 100)}%`,
          impact: 'medium',
          confidence: 0.85,
          urgency: 'immediate',
          dataSource: 'features'
        });
      }
    }
    
    return insights;
  }

  /**
   * Generate advanced price insights with market context
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
          confidence: 0.95,
          urgency: 'immediate',
          dataSource: 'pricing'
        });
      } else if (plan.regularPrice <= avgPrice) {
        insights.push({
          type: 'advantage',
          category: 'price',
          title: 'מחיר תחרותי',
          description: `המחיר נמוך מהממוצע ב-₪${Math.round(avgPrice - plan.regularPrice)} לחודש`,
          impact: 'medium',
          confidence: 0.85,
          urgency: 'immediate',
          dataSource: 'pricing'
        });
      } else if (plan.regularPrice === maxPrice) {
        insights.push({
          type: 'disadvantage',
          category: 'price',
          title: 'המחיר הגבוה ביותר',
          description: `זהו המסלול היקר ביותר - ₪${plan.regularPrice - minPrice} יותר מהזול ביותר`,
          impact: 'high',
          confidence: 0.95,
          urgency: 'immediate',
          dataSource: 'pricing'
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
        confidence: 0.9,
        urgency: 'immediate',
        dataSource: 'features'
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
        confidence: 0.85,
        urgency: 'immediate',
        dataSource: 'features'
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
          confidence: 0.9,
          urgency: 'immediate',
          dataSource: 'features'
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
   * Analyze pricing in advanced context
   */
  private static analyzePricingAdvanced(plan: ManualPlan, allPlans: ManualPlan[]): DetailedComparison['priceAnalysis'] {
    if (plan.category === 'electricity') {
      const discount = parseFloat(plan.speed.replace('%', '')) || 0;
      const maxDiscount = Math.max(...allPlans.map(p => parseFloat(p.speed.replace('%', '')) || 0));
      const avgDiscount = allPlans.reduce((sum, p) => sum + (parseFloat(p.speed.replace('%', '')) || 0), 0) / allPlans.length;
      
      const roi12Months = discount * 12 * 10; // Estimated annual savings per 1% discount
      const roi24Months = roi12Months * 2;
      const inflationAdjusted = roi12Months * 0.95; // 5% inflation adjustment
      const marketRanking = allPlans.filter(p => (parseFloat(p.speed.replace('%', '')) || 0) < discount).length + 1;
      
      return {
        isCompetitive: discount >= maxDiscount * 0.8,
        savingsVsBest: maxDiscount - discount,
        valueRating: Math.round((discount / maxDiscount) * 100),
        roi12Months,
        roi24Months,
        inflationAdjusted,
        marketRanking
      };
    }
    
    const prices = allPlans.map(p => p.regularPrice).sort((a, b) => a - b);
    const minPrice = prices[0];
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const marketRanking = prices.indexOf(plan.regularPrice) + 1;
    
    const monthlySavings = avgPrice - plan.regularPrice;
    const roi12Months = monthlySavings * 12;
    const roi24Months = roi12Months * 2;
    const inflationAdjusted = roi12Months * 0.95;
    
    return {
      isCompetitive: plan.regularPrice <= avgPrice,
      savingsVsBest: plan.regularPrice - minPrice,
      valueRating: Math.round(((avgPrice - plan.regularPrice) / avgPrice) * 100 + 50),
      roi12Months,
      roi24Months,
      inflationAdjusted,
      marketRanking
    };
  }

  /**
   * Analyze category-wide metrics with advanced insights
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
    
    // Market trends analysis
    const category = plans[0]?.category || 'electricity';
    const competitionIntensity = [...new Set(plans.map(p => p.company))].length / 10; // More competitors = higher intensity
    const priceDirection = this.analyzePriceTrend(plans);
    const innovationRate = this.analyzeInnovationRate(plans);
    const customerSwitchingRate = 0.15; // Estimated 15% annual switching rate
    
    // Benchmark metrics
    const industryAveragePrice = averagePrice;
    const topPerformerScore = 95; // Highest possible score
    const valueThreshold = averagePrice * 0.8; // 20% below average is good value
    const premiumJustificationScore = 75; // Score needed to justify premium pricing
    
    return {
      averagePrice,
      priceRange,
      commonFeatures,
      uniqueFeatures,
      marketTrends: {
        priceDirection,
        competitionIntensity: Math.min(1, competitionIntensity),
        innovationRate,
        customerSwitchingRate
      },
      benchmarkMetrics: {
        industryAveragePrice,
        topPerformerScore,
        valueThreshold,
        premiumJustificationScore
      }
    };
  }

  /**
   * Generate advanced comparison summary
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

    const bestRoi = comparisons
      .sort((a, b) => b.score.roi - a.score.roi)[0]?.planId || bestOverall;

    const safestChoice = comparisons
      .sort((a, b) => {
        const aRisk = a.riskAssessment.overallRisk === 'low' ? 3 : a.riskAssessment.overallRisk === 'medium' ? 2 : 1;
        const bRisk = b.riskAssessment.overallRisk === 'low' ? 3 : b.riskAssessment.overallRisk === 'medium' ? 2 : 1;
        return bRisk - aRisk;
      })[0]?.planId || bestOverall;

    const innovativePick = comparisons
      .sort((a, b) => b.score.futureProofing - a.score.futureProofing)[0]?.planId || bestOverall;
    
    const recommendations = this.generateAdvancedRecommendations(comparisons, plans);
    const marketInsights = this.generateMarketInsights(comparisons, plans);
    const seasonalFactors = this.generateSeasonalFactors(plans);
    
    return {
      bestOverall,
      bestValue,
      bestFeatures,
      mostReliable,
      bestRoi,
      safestChoice,
      innovativePick,
      recommendations,
      marketInsights,
      seasonalFactors
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

  /**
   * Helper methods for advanced analysis
   */
  private static analyzePriceTrend(plans: ManualPlan[]): 'up' | 'down' | 'stable' {
    // Simplified trend analysis - in real world would use historical data
    const category = plans[0]?.category;
    const trendMap: Record<string, 'up' | 'down' | 'stable'> = {
      electricity: 'up',
      internet: 'stable', 
      mobile: 'down',
      tv: 'up'
    };
    return trendMap[category || 'electricity'] || 'stable';
  }

  private static analyzeInnovationRate(plans: ManualPlan[]): number {
    // Calculate innovation based on modern features
    const modernFeatures = ['5G', 'סיבים', 'חכם', '4K', 'WiFi 6', 'cloud'];
    const totalPlans = plans.length;
    const plansWithModernFeatures = plans.filter(p => 
      p.features.some(f => modernFeatures.some(mf => f.toLowerCase().includes(mf.toLowerCase())))
    ).length;
    
    return Math.min(1, plansWithModernFeatures / totalPlans);
  }

  private static generateAdvancedRecommendations(comparisons: DetailedComparison[], plans: ManualPlan[]): string[] {
    const recommendations: string[] = [];
    
    if (comparisons.length >= 2) {
      const topPlan = comparisons[0];
      const secondPlan = comparisons[1];
      
      const topPlanData = plans.find(p => p.id === topPlan.planId);
      const secondPlanData = plans.find(p => p.id === secondPlan.planId);
      
      if (topPlanData && secondPlanData) {
        recommendations.push(`🏆 המסלול המוביל: ${topPlanData.company} - ${topPlanData.planName} (ציון: ${topPlan.score.overall})`);
        
        if (topPlan.score.overall - secondPlan.score.overall < 10) {
          recommendations.push(`🥈 ${secondPlanData.company} גם הוא בחירה מעולה - הפרש של ${topPlan.score.overall - secondPlan.score.overall} נקודות בלבד`);
        }
        
        if (topPlan.priceAnalysis.isCompetitive) {
          recommendations.push('💰 המסלול המוביל מציע גם יחס מחיר-ביצועים מעולה');
        }

        // Risk-based recommendations
        if (topPlan.riskAssessment.overallRisk === 'low') {
          recommendations.push('✅ המסלול המוביל נחשב לבחירה בטוחה עם סיכון נמוך');
        }

        // ROI recommendations
        const bestRoi = comparisons.sort((a, b) => b.score.roi - a.score.roi)[0];
        if (bestRoi.planId !== topPlan.planId) {
          const roiPlan = plans.find(p => p.id === bestRoi.planId);
          if (roiPlan) {
            recommendations.push(`📈 לתשואה מקסימלית: ${roiPlan.company} - ${roiPlan.planName}`);
          }
        }
      }
    }
    
    return recommendations;
  }

  private static generateMarketInsights(comparisons: DetailedComparison[], plans: ManualPlan[]): string[] {
    const insights: string[] = [];
    const category = plans[0]?.category;
    const companies = [...new Set(plans.map(p => p.company))];
    
    insights.push(`📊 השוק מציע ${plans.length} מסלולים מ-${companies.length} חברות שונות`);
    
    const avgScore = comparisons.reduce((sum, c) => sum + c.score.overall, 0) / comparisons.length;
    insights.push(`⭐ ציון איכות ממוצע: ${Math.round(avgScore)} נקודות`);
    
    const highRiskPlans = comparisons.filter(c => c.riskAssessment.overallRisk === 'high').length;
    if (highRiskPlans > 0) {
      insights.push(`⚠️ ${highRiskPlans} מסלולים מסווגים כבעלי סיכון גבוה`);
    }
    
    return insights;
  }

  private static generateSeasonalFactors(plans: ManualPlan[]): string[] {
    const factors: string[] = [];
    const category = plans[0]?.category;
    const currentMonth = new Date().getMonth() + 1;
    
    if (category === 'electricity') {
      if (currentMonth >= 6 && currentMonth <= 9) {
        factors.push('🌡️ עונת הקיץ - צריכת חשמל גבוהה עקב מזגנים');
      } else if (currentMonth >= 11 || currentMonth <= 2) {
        factors.push('❄️ עונת החורף - צריכת חשמל מוגברת לחימום');
      }
    }
    
    if (category === 'tv') {
      if (currentMonth >= 11 && currentMonth <= 1) {
        factors.push('📺 עונת הטלוויזיה - מבצעים מיוחדים לקראת החגים');
      }
    }
    
    return factors;
  }

  private static generateAIInsights(comparisons: DetailedComparison[], plans: ManualPlan[]): ComparisonMatrix['aiInsights'] {
    const bestPlan = comparisons[0];
    const worstPlan = comparisons[comparisons.length - 1];
    
    const overallRecommendation = bestPlan ? 
      `על בסיס ניתוח מקיף של ${comparisons.length} מסלולים, המסלול המומלץ ביותר הוא ${plans.find(p => p.id === bestPlan.planId)?.company} עם ציון של ${bestPlan.score.overall} נקודות` :
      'לא נמצאו מסלולים להשוואה';

    const riskWarnings = comparisons
      .filter(c => c.riskAssessment.overallRisk === 'high')
      .map(c => {
        const plan = plans.find(p => p.id === c.planId);
        return `⚠️ ${plan?.company} - ${plan?.planName} מסווג כבעל סיכון גבוה`;
      });

    const opportunityAlerts = comparisons
      .filter(c => c.insights.some(i => i.type === 'opportunity'))
      .map(c => {
        const plan = plans.find(p => p.id === c.planId);
        const opportunity = c.insights.find(i => i.type === 'opportunity');
        return `💡 ${plan?.company}: ${opportunity?.title}`;
      });

    const seasonalConsiderations = this.generateSeasonalFactors(plans);

    const personalizedAdvice = [
      'המלצה אישית תתבסס על הצרכים הספציפיים שלכם',
      'כדאי לשקול את תקופת ההתחייבות מול הגמישות הנדרשת',
      'בדקו האם יש מבצעים מיוחדים או הטבות נוספות'
    ];

    return {
      overallRecommendation,
      riskWarnings,
      opportunityAlerts,
      seasonalConsiderations,
      personalizedAdvice
    };
  }
}

export default ComparisonAnalyzer;