import { ManualPlan } from '@/data/manual-plans';
import { ComparisonInsight, DetailedComparison } from './comparisonAnalyzer';

export class AdvancedAnalytics {
  
  /**
   * Calculate market position score
   */
  static calculateMarketPositionScore(plan: ManualPlan, allPlans: ManualPlan[]): number {
    const categoryPlans = allPlans.filter(p => p.category === plan.category);
    const prices = categoryPlans.map(p => p.regularPrice).filter(p => p > 0);
    
    if (prices.length === 0) return 75;
    
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const marketShare = this.getEstimatedMarketShare(plan.company);
    const brandRecognition = this.getBrandRecognitionScore(plan.company);
    
    let positionScore = 50;
    
    // Price positioning
    if (plan.regularPrice > 0) {
      const pricePosition = (avgPrice - plan.regularPrice) / avgPrice;
      positionScore += pricePosition * 20;
    }
    
    // Market share influence
    positionScore += marketShare * 15;
    
    // Brand recognition
    positionScore += brandRecognition * 15;
    
    return Math.min(100, Math.max(0, Math.round(positionScore)));
  }

  /**
   * Calculate future-proofing score
   */
  static calculateFutureProofingScore(plan: ManualPlan): number {
    let score = 60; // Base score
    
    // Technology indicators
    const futureFeatures = [
      'מונה חכם', 'WiFi 6', '5G', 'אינטרנט סיבים', 'חכם', 'דיגיטלי', 
      'אוטומטי', 'מתקדם', 'טכנולוגיה', 'עתידני', 'חדשני'
    ];
    
    const hasFutureFeatures = plan.features.some(feature => 
      futureFeatures.some(ff => feature.includes(ff))
    );
    
    if (hasFutureFeatures) score += 25;
    
    // Category-specific future-proofing
    switch (plan.category) {
      case 'internet':
        const speed = parseFloat(plan.downloadSpeed) || 0;
        if (speed >= 1000) score += 20;
        else if (speed >= 500) score += 15;
        else if (speed >= 200) score += 10;
        else if (speed < 50) score -= 20;
        break;
        
      case 'mobile':
        if (plan.features.some(f => f.includes('5G'))) score += 20;
        if (plan.features.some(f => f.includes('ללא הגבלה'))) score += 15;
        break;
        
      case 'electricity':
        if (plan.features.some(f => f.includes('מונה חכ'))) score += 25;
        if (plan.features.some(f => f.includes('סולאר'))) score += 15;
        break;
    }
    
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * Calculate customer satisfaction score
   */
  static calculateCustomerSatisfactionScore(plan: ManualPlan): number {
    // Base satisfaction scores by provider (simulated data based on market reputation)
    const providerSatisfaction: Record<string, number> = {
      'בזק': 85,
      'פרטנר': 82,
      'סלקום': 88,
      'הוט': 78,
      'פלאפון': 83,
      'רמי לוי': 75,
      'גולן טלקום': 72,
      'אקטיב': 70,
      'אלקטרה פאוור': 80,
      'אמישראגז חשמל': 85,
      'פזגז': 82,
      'הוט אנרגי': 78,
      'סלקום אנרגי': 85,
      'פרטנר פאוור': 83,
      'YES': 80,
      'נטפליקס': 90,
      'דיסני+': 88
    };
    
    let baseScore = providerSatisfaction[plan.company] || 75;
    
    // Adjust based on plan characteristics
    if (plan.features.length > 5) baseScore += 5;
    if (plan.features.some(f => f.includes('תמיכה') || f.includes('שירות'))) baseScore += 8;
    if (plan.features.some(f => f.includes('ללא התחייבות'))) baseScore += 10;
    
    return Math.min(100, Math.max(50, Math.round(baseScore)));
  }

  /**
   * Calculate ROI score
   */
  static calculateROIScore(plan: ManualPlan, allPlans: ManualPlan[]): number {
    if (plan.category === 'electricity') {
      const discountPercent = parseFloat(plan.speed.replace('%', '')) || 0;
      return Math.min(100, discountPercent * 5); // 20% discount = 100 ROI score
    }
    
    const categoryPlans = allPlans.filter(p => p.category === plan.category && p.regularPrice > 0);
    if (categoryPlans.length === 0) return 50;
    
    const avgPrice = categoryPlans.reduce((sum, p) => sum + p.regularPrice, 0) / categoryPlans.length;
    const featureCount = plan.features.length;
    const avgFeatures = categoryPlans.reduce((sum, p) => sum + p.features.length, 0) / categoryPlans.length;
    
    // ROI = (Features Value / Price) compared to market average
    const featureValue = featureCount / avgFeatures;
    const priceRatio = avgPrice / (plan.regularPrice || avgPrice);
    const roi = (featureValue * priceRatio) * 50;
    
    return Math.min(100, Math.max(0, Math.round(roi)));
  }

  /**
   * Generate advanced predictive insights
   */
  static generatePredictiveInsights(plan: ManualPlan, allPlans: ManualPlan[]): DetailedComparison['predictiveInsights'] {
    const categoryTrends = this.getCategoryTrends(plan.category);
    const seasonalFactors = this.getSeasonalFactors(plan.category);
    
    // Price projections with market trends
    const currentPrice = plan.regularPrice || 0;
    const trendMultiplier = categoryTrends.priceDirection === 'up' ? 1.05 : 
                           categoryTrends.priceDirection === 'down' ? 0.95 : 1.0;
    
    const priceProjection6Months = Math.round(currentPrice * trendMultiplier * seasonalFactors.q2);
    const priceProjection12Months = Math.round(currentPrice * Math.pow(trendMultiplier, 2) * seasonalFactors.q4);
    
    // Market trend analysis
    const marketTrend = categoryTrends.competitionIntensity > 0.7 ? 'improving' :
                       categoryTrends.competitionIntensity < 0.4 ? 'declining' : 'stable';
    
    // Competitive position
    const categoryPlans = allPlans.filter(p => p.category === plan.category);
    const priceRank = this.calculatePriceRank(plan, categoryPlans);
    const featureRank = this.calculateFeatureRank(plan, categoryPlans);
    
    const competitivePosition = priceRank <= 3 && featureRank <= 3 ? 'מוביל בשוק' :
                               priceRank <= 5 && featureRank <= 5 ? 'מתחרה חזק' :
                               priceRank <= 8 || featureRank <= 8 ? 'שחקן בינוני' : 'מאחרר';
    
    // User satisfaction trend
    const providerTrend = this.getProviderTrend(plan.company);
    
    return {
      priceProjection6Months,
      priceProjection12Months,
      marketTrend,
      competitivePosition,
      userSatisfactionTrend: providerTrend
    };
  }

  /**
   * Generate advanced risk assessment
   */
  static generateRiskAssessment(plan: ManualPlan): DetailedComparison['riskAssessment'] {
    const providerStability = this.getProviderStabilityScore(plan.company);
    const technologyRisk = this.getTechnologyRiskScore(plan);
    const contractFlexibility = this.getContractFlexibilityScore(plan);
    
    // Price stability analysis
    const priceStability = this.analyzePriceStability(plan);
    
    // Overall risk calculation
    const riskFactors = [
      100 - providerStability,
      technologyRisk,
      100 - contractFlexibility
    ];
    
    const avgRisk = riskFactors.reduce((a, b) => a + b, 0) / riskFactors.length;
    const overallRisk = avgRisk > 60 ? 'high' : avgRisk > 35 ? 'medium' : 'low';
    
    return {
      priceStability,
      contractFlexibility,
      providerStability,
      technologyRisk,
      overallRisk
    };
  }

  // Helper methods for calculations
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

  private static getSeasonalFactors(category: string) {
    const factors: Record<string, any> = {
      electricity: { q1: 1.1, q2: 0.9, q3: 1.2, q4: 1.0 },
      internet: { q1: 1.0, q2: 1.0, q3: 1.05, q4: 0.95 },
      mobile: { q1: 0.95, q2: 1.0, q3: 1.0, q4: 1.05 },
      tv: { q1: 0.9, q2: 1.0, q3: 0.95, q4: 1.15 }
    };
    return factors[category] || factors.electricity;
  }

  private static calculatePriceRank(plan: ManualPlan, categoryPlans: ManualPlan[]): number {
    const prices = categoryPlans.map(p => p.regularPrice).filter(p => p > 0).sort((a, b) => a - b);
    const planPrice = plan.regularPrice || 0;
    return prices.indexOf(planPrice) + 1;
  }

  private static calculateFeatureRank(plan: ManualPlan, categoryPlans: ManualPlan[]): number {
    const featureCounts = categoryPlans.map(p => p.features.length).sort((a, b) => b - a);
    const planFeatures = plan.features.length;
    return featureCounts.indexOf(planFeatures) + 1;
  }

  private static getProviderTrend(company: string): 'up' | 'stable' | 'down' {
    const trends: Record<string, 'up' | 'stable' | 'down'> = {
      'סלקום': 'up', 'פרטנר': 'up', 'בזק': 'stable',
      'רמי לוי': 'up', 'הוט': 'stable', 'פלאפון': 'stable',
      'אמישראגז חשמל': 'up', 'אלקטרה פאוור': 'stable'
    };
    return trends[company] || 'stable';
  }

  private static getProviderStabilityScore(company: string): number {
    const stability: Record<string, number> = {
      'בזק': 95, 'פרטנר': 90, 'סלקום': 88, 'הוט': 85,
      'פלאפון': 87, 'אמישראגז חשמל': 90, 'אלקטרה פאוור': 88,
      'פזגז': 85, 'רמי לוי': 75, 'גולן טלקום': 70
    };
    return stability[company] || 75;
  }

  private static getTechnologyRiskScore(plan: ManualPlan): number {
    // Lower score = lower risk
    let riskScore = 30; // Base low risk
    
    // Legacy technology indicators increase risk
    if (plan.category === 'internet') {
      const speed = parseFloat(plan.downloadSpeed) || 0;
      if (speed < 50) riskScore += 30;
      else if (speed < 100) riskScore += 15;
    }
    
    // Old mobile technologies
    if (plan.category === 'mobile' && !plan.features.some(f => f.includes('4G') || f.includes('5G'))) {
      riskScore += 25;
    }
    
    return Math.min(100, Math.max(0, riskScore));
  }

  private static getContractFlexibilityScore(plan: ManualPlan): number {
    let flexScore = 50; // Base flexibility
    
    if (plan.features.some(f => f.includes('ללא התחייבות'))) flexScore += 30;
    if (plan.features.some(f => f.includes('חוזה גמיש'))) flexScore += 20;
    if (plan.features.some(f => f.includes('ביטול חופשי'))) flexScore += 25;
    if (plan.introMonths > 12) flexScore -= 15;
    
    return Math.min(100, Math.max(0, flexScore));
  }

  private static analyzePriceStability(plan: ManualPlan): 'stable' | 'volatile' | 'increasing' | 'decreasing' {
    // Simplified analysis based on plan characteristics
    if (plan.category === 'electricity') {
      return plan.features.some(f => f.includes('קבוע')) ? 'stable' : 'volatile';
    }
    
    if (plan.introPrice > 0 && plan.introPrice < plan.regularPrice * 0.7) {
      return 'increasing'; // Large intro discount suggests price increases
    }
    
    return 'stable'; // Default assumption
  }
}