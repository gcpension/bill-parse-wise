// Plan Value Calculator - calculates value score and deal quality

export interface ValueScore {
  total: number; // 0-100
  priceScore: number;
  featuresScore: number;
  flexibilityScore: number;
  bonusScore: number;
  dealQuality: 'excellent' | 'good' | 'fair' | 'expensive';
  percentFromAverage: number;
  whyChoose: string[];
  bestFor: string[];
}

interface PlanData {
  monthlyPrice: number | null;
  service: string;
  plan: string;
  commitment?: string | null;
  transferBenefits?: string | null;
  company: string;
}

// Average prices by category (based on market data)
const categoryAverages: Record<string, number> = {
  'סלולר': 55,
  'אינטרנט': 100,
  'טלוויזיה': 150,
  'חשמל': 300,
  'סטרימינג': 45,
};

// Feature keywords for scoring
const premiumFeatures = ['5G', 'סיבים', 'אופטי', 'fiber', 'גיגה', '1000', 'unlimited', 'ללא הגבלה', 'אינסופי'];
const valueFeatures = ['Netflix', 'HBO', 'Disney', 'ספורט', 'VOD', 'WiFi 6'];
const flexibilityKeywords = ['ללא התחייבות', 'בלי התחייבות', 'חודש בחודש', 'ניתן לביטול'];

export const calculateValueScore = (plan: PlanData, allPlans: PlanData[]): ValueScore => {
  const price = plan.monthlyPrice || 0;
  const category = plan.service;
  const planName = plan.plan.toLowerCase();
  const commitment = plan.commitment?.toLowerCase() || '';
  const benefits = plan.transferBenefits?.toLowerCase() || '';
  
  // Calculate category average from actual data
  const categoryPlans = allPlans.filter(p => p.service === category && p.monthlyPrice);
  const avgPrice = categoryPlans.length > 0
    ? categoryPlans.reduce((sum, p) => sum + (p.monthlyPrice || 0), 0) / categoryPlans.length
    : categoryAverages[category] || 100;
  
  // Price Score (40% weight) - lower is better
  const priceRatio = price / avgPrice;
  let priceScore = 0;
  if (priceRatio <= 0.7) priceScore = 100;
  else if (priceRatio <= 0.85) priceScore = 85;
  else if (priceRatio <= 1.0) priceScore = 70;
  else if (priceRatio <= 1.15) priceScore = 50;
  else if (priceRatio <= 1.3) priceScore = 30;
  else priceScore = 15;
  
  // Features Score (30% weight)
  let featuresScore = 50; // base score
  premiumFeatures.forEach(feature => {
    if (planName.includes(feature.toLowerCase())) featuresScore += 10;
  });
  valueFeatures.forEach(feature => {
    if (planName.includes(feature.toLowerCase()) || benefits.includes(feature.toLowerCase())) featuresScore += 8;
  });
  featuresScore = Math.min(100, featuresScore);
  
  // Flexibility Score (20% weight)
  let flexibilityScore = 50;
  if (flexibilityKeywords.some(k => commitment.includes(k) || planName.includes(k))) {
    flexibilityScore = 100;
  } else if (commitment.includes('12') || commitment.includes('שנה')) {
    flexibilityScore = 40;
  } else if (commitment.includes('24') || commitment.includes('שנתיים')) {
    flexibilityScore = 20;
  }
  
  // Bonus Score (10% weight) - transfer benefits
  let bonusScore = 0;
  if (benefits && benefits.length > 10) {
    bonusScore = 50;
    if (benefits.includes('חינם') || benefits.includes('מתנה')) bonusScore += 25;
    if (benefits.includes('החזר') || benefits.includes('זיכוי')) bonusScore += 25;
  }
  bonusScore = Math.min(100, bonusScore);
  
  // Calculate total score
  const total = Math.round(
    priceScore * 0.4 +
    featuresScore * 0.3 +
    flexibilityScore * 0.2 +
    bonusScore * 0.1
  );
  
  // Deal quality
  const percentFromAverage = Math.round(((avgPrice - price) / avgPrice) * 100);
  let dealQuality: ValueScore['dealQuality'];
  if (percentFromAverage >= 20) dealQuality = 'excellent';
  else if (percentFromAverage >= 5) dealQuality = 'good';
  else if (percentFromAverage >= -10) dealQuality = 'fair';
  else dealQuality = 'expensive';
  
  // Generate "Why Choose" reasons
  const whyChoose: string[] = [];
  if (percentFromAverage >= 15) whyChoose.push(`${percentFromAverage}% זול מהממוצע בשוק`);
  if (flexibilityScore >= 80) whyChoose.push('ללא התחייבות - ניתן לבטל בכל עת');
  if (premiumFeatures.some(f => planName.includes(f.toLowerCase()))) {
    if (planName.includes('5g')) whyChoose.push('כולל 5G ללא תשלום נוסף');
    if (planName.includes('סיבים') || planName.includes('fiber')) whyChoose.push('אינטרנט סיבים במהירות גבוהה');
  }
  if (benefits && benefits.length > 10) whyChoose.push('כולל הטבות מעבר');
  if (whyChoose.length === 0) whyChoose.push('מסלול בסיסי במחיר סביר');
  
  // Generate "Best For" tags
  const bestFor: string[] = [];
  if (priceScore >= 80) bestFor.push('תקציב מוגבל');
  if (featuresScore >= 80) bestFor.push('גולשים כבדים');
  if (flexibilityScore >= 80) bestFor.push('גמישות מקסימלית');
  if (planName.includes('משפח') || planName.includes('family')) bestFor.push('משפחות');
  if (planName.includes('עסק') || planName.includes('business')) bestFor.push('עסקים');
  
  return {
    total,
    priceScore,
    featuresScore,
    flexibilityScore,
    bonusScore,
    dealQuality,
    percentFromAverage,
    whyChoose: whyChoose.slice(0, 3),
    bestFor: bestFor.slice(0, 2),
  };
};

export const getDealQualityColor = (quality: ValueScore['dealQuality']): string => {
  switch (quality) {
    case 'excellent': return 'text-green-600 bg-green-100';
    case 'good': return 'text-emerald-600 bg-emerald-100';
    case 'fair': return 'text-yellow-600 bg-yellow-100';
    case 'expensive': return 'text-red-600 bg-red-100';
  }
};

export const getDealQualityLabel = (quality: ValueScore['dealQuality']): string => {
  switch (quality) {
    case 'excellent': return 'עסקה מעולה';
    case 'good': return 'מחיר טוב';
    case 'fair': return 'מחיר סביר';
    case 'expensive': return 'יקר';
  }
};
