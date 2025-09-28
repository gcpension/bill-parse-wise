import { ManualPlan } from '@/data/manual-plans';

export interface UserProfile {
  // Basic Demographics
  familySize: number;
  homeType: 'apartment' | 'house' | 'student' | 'business';
  location?: 'north' | 'center' | 'south' | 'jerusalem';
  
  // Financial Preferences
  monthlyBudget: number;
  currentMonthlySpend: number;
  currentProvider: string;
  priceFlexibility: 'strict' | 'flexible' | 'very_flexible';
  
  // Usage Patterns
  usageLevel: 'light' | 'medium' | 'heavy' | 'extreme';
  usageHours: 'morning' | 'day' | 'evening' | 'night' | 'mixed';
  workFromHome: boolean;
  streamingHeavy: boolean;
  gamingHeavy: boolean;
  
  // Priorities (weighted 1-5)
  priorities: {
    price: number;
    reliability: number;
    speed: number;
    customerService: number;
    flexibility: number;
    features: number;
    brandTrust: number;
    innovation: number;
  };
  
  // Preferences
  contractFlexibility: 'no_commitment' | 'short_term' | 'long_term' | 'doesnt_matter';
  technologyPreference: 'latest' | 'stable' | 'basic' | 'doesnt_matter';
  supportImportance: 'critical' | 'important' | 'nice_to_have' | 'not_important';
  
  // Category Specific
  categorySpecific?: {
    // For electricity
    hasSmartMeter?: boolean;
    hasSolarPanels?: boolean;
    timeOfUseAware?: boolean;
    
    // For internet
    requiredSpeed?: number;
    uploadImportant?: boolean;
    staticIPNeeded?: boolean;
    
    // For mobile
    internationalCalls?: boolean;
    dataHeavyUser?: boolean;
    multipleLines?: number;
    
    // For TV
    sportsImportant?: boolean;
    kidsChannels?: boolean;
    internationalChannels?: boolean;
    recordingImportant?: boolean;
  };
}

export interface PersonalizedRecommendation {
  planId: string;
  matchScore: number;
  personalizedScore: number;
  reasonsForRecommendation: string[];
  potentialConcerns: string[];
  expectedSavings: {
    monthly: number;
    annual: number;
    percentage: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  confidenceLevel: number;
  personalizedInsights: string[];
  actionRecommendations: string[];
}

export class PersonalizedRecommendationEngine {
  
  /**
   * Generate personalized recommendations based on user profile
   */
  static generatePersonalizedRecommendations(
    plans: ManualPlan[], 
    userProfile: UserProfile,
    category: string
  ): PersonalizedRecommendation[] {
    
    const recommendations = plans.map(plan => 
      this.analyzePlanForUser(plan, userProfile, plans)
    );
    
    // Sort by personalized score
    recommendations.sort((a, b) => b.personalizedScore - a.personalizedScore);
    
    // Add confidence adjustments based on profile completeness
    const profileCompleteness = this.calculateProfileCompleteness(userProfile);
    recommendations.forEach(rec => {
      rec.confidenceLevel *= profileCompleteness;
    });
    
    return recommendations;
  }
  
  /**
   * Analyze how well a specific plan matches the user's profile
   */
  private static analyzePlanForUser(
    plan: ManualPlan, 
    userProfile: UserProfile, 
    allPlans: ManualPlan[]
  ): PersonalizedRecommendation {
    
    let matchScore = 0;
    const reasonsForRecommendation: string[] = [];
    const potentialConcerns: string[] = [];
    const personalizedInsights: string[] = [];
    const actionRecommendations: string[] = [];
    
    // Budget Analysis
    const budgetAnalysis = this.analyzeBudgetFit(plan, userProfile);
    matchScore += budgetAnalysis.score;
    reasonsForRecommendation.push(...budgetAnalysis.reasons);
    potentialConcerns.push(...budgetAnalysis.concerns);
    
    // Usage Analysis
    const usageAnalysis = this.analyzeUsageFit(plan, userProfile);
    matchScore += usageAnalysis.score;
    reasonsForRecommendation.push(...usageAnalysis.reasons);
    
    // Priority Matching
    const priorityAnalysis = this.analyzePriorityMatch(plan, userProfile, allPlans);
    matchScore += priorityAnalysis.score;
    reasonsForRecommendation.push(...priorityAnalysis.reasons);
    
    // Feature Matching
    const featureAnalysis = this.analyzeFeatureMatch(plan, userProfile);
    matchScore += featureAnalysis.score;
    reasonsForRecommendation.push(...featureAnalysis.reasons);
    
    // Risk Assessment
    const riskAnalysis = this.assessPersonalizedRisk(plan, userProfile);
    const riskLevel = riskAnalysis.level;
    potentialConcerns.push(...riskAnalysis.concerns);
    
    // Expected Savings
    const expectedSavings = this.calculateExpectedSavings(plan, userProfile);
    
    // Personalized Insights
    personalizedInsights.push(...this.generatePersonalizedInsights(plan, userProfile, allPlans));
    
    // Action Recommendations
    actionRecommendations.push(...this.generateActionRecommendations(plan, userProfile));
    
    const personalizedScore = Math.min(100, Math.max(0, matchScore));
    
    return {
      planId: plan.id,
      matchScore: matchScore,
      personalizedScore,
      reasonsForRecommendation: reasonsForRecommendation.filter(Boolean),
      potentialConcerns: potentialConcerns.filter(Boolean),
      expectedSavings,
      riskLevel,
      confidenceLevel: this.calculateConfidenceLevel(plan, userProfile),
      personalizedInsights: personalizedInsights.filter(Boolean),
      actionRecommendations: actionRecommendations.filter(Boolean)
    };
  }
  
  /**
   * Analyze budget fit
   */
  private static analyzeBudgetFit(plan: ManualPlan, userProfile: UserProfile) {
    const score = { score: 0, reasons: [] as string[], concerns: [] as string[] };
    const planPrice = plan.regularPrice || 0;
    
    if (plan.category === 'electricity') {
      const discountPercent = parseFloat(plan.speed.replace('%', '')) || 0;
      const estimatedSavings = userProfile.currentMonthlySpend * (discountPercent / 100);
      
      if (estimatedSavings > 50) {
        score.score += 25;
        score.reasons.push(`💰 חיסכון משמעותי של כ-₪${Math.round(estimatedSavings)} לחודש`);
      }
      
      return score;
    }
    
    // Budget flexibility analysis
    const budgetRatio = planPrice / userProfile.monthlyBudget;
    
    if (budgetRatio <= 0.7) {
      score.score += 30;
      score.reasons.push(`💵 המחיר נמוך מהתקציב שלכם ב-${Math.round((1 - budgetRatio) * 100)}%`);
    } else if (budgetRatio <= 0.9) {
      score.score += 20;
      score.reasons.push(`✅ המחיר מתאים לתקציב שלכם`);
    } else if (budgetRatio <= 1.1) {
      if (userProfile.priceFlexibility !== 'strict') {
        score.score += 10;
        score.reasons.push(`⚠️ המחיר מעט מעל התקציב אבל עדיין סביר`);
      } else {
        score.concerns.push(`💸 המחיר מעל התקציב שהגדרתם`);
      }
    } else {
      score.concerns.push(`❌ המחיר גבוה משמעותית מהתקציב שלכם`);
    }
    
    // Current spending comparison
    if (userProfile.currentMonthlySpend > 0) {
      const savings = userProfile.currentMonthlySpend - planPrice;
      if (savings > 0) {
        score.score += Math.min(20, savings / 10);
        score.reasons.push(`📉 חיסכון של ₪${savings} לחודש לעומת המחיר הנוכחי`);
      } else if (savings < -50) {
        score.concerns.push(`📈 יעלה לכם ₪${Math.abs(savings)} לחודש לעומת מה שאתם משלמים היום`);
      }
    }
    
    return score;
  }
  
  /**
   * Analyze usage fit
   */
  private static analyzeUsageFit(plan: ManualPlan, userProfile: UserProfile) {
    const score = { score: 0, reasons: [] as string[] };
    
    // Family size considerations
    if (userProfile.familySize >= 4 && plan.features.some(f => f.includes('משפחה') || f.includes('רב קווי'))) {
      score.score += 15;
      score.reasons.push(`👨‍👩‍👧‍👦 מתאים למשפחות גדולות (${userProfile.familySize} נفשות)`);
    }
    
    // Work from home considerations
    if (userProfile.workFromHome) {
      if (plan.category === 'internet') {
        const speed = parseFloat(plan.downloadSpeed) || 0;
        if (speed >= 100) {
          score.score += 20;
          score.reasons.push(`💻 מהירות גבוהה מתאימה לעבודה מהבית`);
        }
      }
      
      if (plan.features.some(f => f.includes('יציבות') || f.includes('אמין'))) {
        score.score += 10;
        score.reasons.push(`🔒 אמינות גבוהה חשובה לעבודה מהבית`);
      }
    }
    
    // Usage level matching
    const usageMultiplier = {
      'light': { threshold: 0.3, bonus: 'מתאים לשימוש קל' },
      'medium': { threshold: 0.6, bonus: 'מתאים לשימוש בינוני' },
      'heavy': { threshold: 0.8, bonus: 'מתאים לשימוש כבד' },
      'extreme': { threshold: 1.0, bonus: 'מתאים לשימוש אינטנסיבי' }
    };
    
    const userLevel = usageMultiplier[userProfile.usageLevel];
    if (userLevel && plan.features.length >= Math.ceil(5 * userLevel.threshold)) {
      score.score += 15;
      score.reasons.push(`📊 ${userLevel.bonus} - מספר תכונות מתאים`);
    }
    
    return score;
  }
  
  /**
   * Analyze priority matching
   */
  private static analyzePriorityMatch(plan: ManualPlan, userProfile: UserProfile, allPlans: ManualPlan[]) {
    const score = { score: 0, reasons: [] as string[] };
    let totalWeight = 0;
    let weightedScore = 0;
    
    // Price priority
    if (userProfile.priorities.price > 3) {
      const priceRank = this.getPriceRank(plan, allPlans);
      const priceScore = Math.max(0, 20 - priceRank * 3);
      weightedScore += priceScore * userProfile.priorities.price;
      totalWeight += userProfile.priorities.price;
      
      if (priceRank <= 3) {
        score.reasons.push(`💰 מחיר תחרותי - דירוג ${priceRank} מתוך ${allPlans.length}`);
      }
    }
    
    // Reliability priority
    if (userProfile.priorities.reliability > 3) {
      const reliabilityScore = this.getProviderReliabilityScore(plan.company);
      weightedScore += reliabilityScore * 0.2 * userProfile.priorities.reliability;
      totalWeight += userProfile.priorities.reliability;
      
      if (reliabilityScore > 80) {
        score.reasons.push(`🔒 ספק אמין עם מוניטין טוב`);
      }
    }
    
    // Features priority
    if (userProfile.priorities.features > 3) {
      const featureRank = this.getFeatureRank(plan, allPlans);
      const featureScore = Math.max(0, 20 - featureRank * 2);
      weightedScore += featureScore * userProfile.priorities.features;
      totalWeight += userProfile.priorities.features;
      
      if (featureRank <= 3) {
        score.reasons.push(`✨ עשיר בתכונות - דירוג ${featureRank} מתוך ${allPlans.length}`);
      }
    }
    
    // Brand trust priority
    if (userProfile.priorities.brandTrust > 3) {
      const brandScore = this.getBrandTrustScore(plan.company);
      weightedScore += brandScore * 0.15 * userProfile.priorities.brandTrust;
      totalWeight += userProfile.priorities.brandTrust;
      
      if (brandScore > 85) {
        score.reasons.push(`🏢 מותג מוכר ומהימן`);
      }
    }
    
    if (totalWeight > 0) {
      score.score = Math.round(weightedScore / totalWeight);
    }
    
    return score;
  }
  
  /**
   * Analyze feature matching based on user preferences
   */
  private static analyzeFeatureMatch(plan: ManualPlan, userProfile: UserProfile) {
    const score = { score: 0, reasons: [] as string[] };
    
    // Contract flexibility
    if (userProfile.contractFlexibility === 'no_commitment') {
      if (plan.features.some(f => f.includes('ללא התחייבות') || f.includes('גמיש'))) {
        score.score += 15;
        score.reasons.push(`🔄 מסלול גמיש ללא התחייבות`);
      }
    }
    
    // Technology preference
    if (userProfile.technologyPreference === 'latest') {
      const modernFeatures = ['5G', 'סיבים', 'חכם', '4K', 'WiFi 6'];
      if (plan.features.some(f => modernFeatures.some(mf => f.includes(mf)))) {
        score.score += 15;
        score.reasons.push(`🚀 כולל טכנולוגיות מתקדמות`);
      }
    }
    
    // Category-specific matching
    const categorySpecific = userProfile.categorySpecific;
    if (categorySpecific && plan.category === 'electricity') {
      if (categorySpecific.hasSmartMeter && plan.features.some(f => f.includes('מונה חכם'))) {
        score.score += 10;
        score.reasons.push(`📊 מתאים למונה חכם`);
      }
      
      if (categorySpecific.timeOfUseAware && plan.features.some(f => f.includes('שעות') || f.includes('זמן'))) {
        score.score += 10;
        score.reasons.push(`⏰ מתאים לצריכה מודעת בזמן`);
      }
    }
    
    if (categorySpecific && plan.category === 'internet') {
      if (categorySpecific.requiredSpeed && plan.downloadSpeed) {
        const planSpeed = parseFloat(plan.downloadSpeed) || 0;
        if (planSpeed >= categorySpecific.requiredSpeed) {
          score.score += 15;
          score.reasons.push(`⚡ מהירות ${planSpeed} Mbps עונה על הדרישות שלכם`);
        }
      }
    }
    
    return score;
  }
  
  /**
   * Calculate expected savings
   */
  private static calculateExpectedSavings(plan: ManualPlan, userProfile: UserProfile) {
    if (plan.category === 'electricity') {
      const discountPercent = parseFloat(plan.speed.replace('%', '')) || 0;
      const monthly = userProfile.currentMonthlySpend * (discountPercent / 100);
      const annual = monthly * 12;
      const percentage = discountPercent;
      
      return { monthly: Math.round(monthly), annual: Math.round(annual), percentage };
    }
    
    const monthly = Math.max(0, userProfile.currentMonthlySpend - (plan.regularPrice || 0));
    const annual = monthly * 12;
    const percentage = userProfile.currentMonthlySpend > 0 ? 
      Math.round((monthly / userProfile.currentMonthlySpend) * 100) : 0;
    
    return { monthly: Math.round(monthly), annual: Math.round(annual), percentage };
  }
  
  /**
   * Generate personalized insights
   */
  private static generatePersonalizedInsights(plan: ManualPlan, userProfile: UserProfile, allPlans: ManualPlan[]): string[] {
    const insights: string[] = [];
    
    // Family-specific insights
    if (userProfile.familySize >= 4) {
      insights.push(`👨‍👩‍👧‍👦 למשפחה בגודל ${userProfile.familySize} נפשות, מסלול זה יכול לחסוך כ-${Math.round(userProfile.familySize * 20)}% מהעלויות הכוללות`);
    }
    
    // Work from home insights
    if (userProfile.workFromHome && plan.category === 'internet') {
      const speed = parseFloat(plan.downloadSpeed) || 0;
      if (speed >= 100) {
        insights.push(`💻 המהירות גבוהה מספיק לכמה שיחות וידאו בו-זמנית`);
      } else if (speed < 50) {
        insights.push(`⚠️ ייתכן שהמהירות לא תספיק לעבודה מהבית במקביל לשימוש משפחתי`);
      }
    }
    
    // Budget insights
    const budgetRatio = (plan.regularPrice || 0) / userProfile.monthlyBudget;
    if (budgetRatio < 0.5) {
      insights.push(`💡 המחיר נמוך משמעותית מהתקציב - יש מקום לשדרוג או חיסכון נוסף`);
    }
    
    return insights;
  }
  
  /**
   * Generate action recommendations
   */
  private static generateActionRecommendations(plan: ManualPlan, userProfile: UserProfile): string[] {
    const actions: string[] = [];
    
    if (plan.introPrice > 0 && plan.introPrice < plan.regularPrice * 0.8) {
      actions.push(`📅 כדאי לשים תזכורת לבדוק מחירים מחדש אחרי ${plan.introMonths} חודשים`);
    }
    
    if (userProfile.contractFlexibility === 'no_commitment') {
      actions.push(`📋 בדקו את תנאי הביטול לפני החתימה`);
    }
    
    if (userProfile.supportImportance === 'critical') {
      actions.push(`📞 מומלץ לבדוק איכות השירות של ${plan.company} בביקורות לקוחות`);
    }
    
    return actions;
  }
  
  // Helper methods
  private static calculateProfileCompleteness(profile: UserProfile): number {
    let completeness = 0.7; // Base completeness
    
    if (profile.currentMonthlySpend > 0) completeness += 0.1;
    if (profile.categorySpecific) completeness += 0.1;
    if (profile.location) completeness += 0.05;
    if (Object.values(profile.priorities).some(p => p > 0)) completeness += 0.05;
    
    return Math.min(1, completeness);
  }
  
  private static assessPersonalizedRisk(plan: ManualPlan, userProfile: UserProfile) {
    let riskScore = 0;
    const concerns: string[] = [];
    
    // Budget risk
    const budgetRatio = (plan.regularPrice || 0) / userProfile.monthlyBudget;
    if (budgetRatio > 1.1) {
      riskScore += 30;
      concerns.push('מחיר מעל התקציב');
    }
    
    // Provider stability risk
    const stabilityScore = this.getProviderReliabilityScore(plan.company);
    if (stabilityScore < 70) {
      riskScore += 20;
      concerns.push('ספק עם מוניטין נמוך יחסית');
    }
    
    // Contract flexibility risk
    if (userProfile.contractFlexibility === 'no_commitment' && 
        !plan.features.some(f => f.includes('ללא התחייבות'))) {
      riskScore += 15;
      concerns.push('חוזה קשיח לעומת העדפתכם לגמישות');
    }
    
    const level: 'low' | 'medium' | 'high' = riskScore > 50 ? 'high' : riskScore > 25 ? 'medium' : 'low';
    
    return { level, concerns };
  }
  
  private static calculateConfidenceLevel(plan: ManualPlan, userProfile: UserProfile): number {
    let confidence = 0.8; // Base confidence
    
    if (userProfile.currentMonthlySpend > 0) confidence += 0.1;
    if (userProfile.currentProvider) confidence += 0.05;
    if (userProfile.categorySpecific) confidence += 0.05;
    
    return Math.min(1, confidence);
  }
  
  private static getPriceRank(plan: ManualPlan, allPlans: ManualPlan[]): number {
    const prices = allPlans
      .filter(p => p.category === plan.category && p.regularPrice > 0)
      .map(p => p.regularPrice)
      .sort((a, b) => a - b);
    
    return prices.indexOf(plan.regularPrice) + 1;
  }
  
  private static getFeatureRank(plan: ManualPlan, allPlans: ManualPlan[]): number {
    const featureCounts = allPlans
      .filter(p => p.category === plan.category)
      .map(p => p.features.length)
      .sort((a, b) => b - a);
    
    return featureCounts.indexOf(plan.features.length) + 1;
  }
  
  private static getProviderReliabilityScore(company: string): number {
    const scores: Record<string, number> = {
      'בזק': 90, 'פרטנר': 85, 'סלקום': 88, 'הוט': 80,
      'פלאפון': 83, 'רמי לוי': 75, 'אלקטרה פאוור': 82,
      'אמישראגז חשמל': 87, 'פזגז': 85, 'YES': 88
    };
    return scores[company] || 70;
  }
  
  private static getBrandTrustScore(company: string): number {
    const scores: Record<string, number> = {
      'בזק': 95, 'פרטנר': 90, 'סלקום': 92, 'הוט': 85,
      'פלאפון': 88, 'אלקטרה פאוור': 85, 'אמישראגז חשמל': 90
    };
    return scores[company] || 70;
  }
}