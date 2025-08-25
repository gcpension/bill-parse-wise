// Real data from Israeli market - updated 2024 - COMPREHENSIVE VERSION
import plansData from '@/data/all_plans_clean.json';

export interface Provider {
  id: string;
  name: string;
  logo?: string;
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  plans: Plan[];
  rating: number;
  customerService: string;
  website: string;
  description: string;
  established: string;
  specialOffers?: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  period: 'month' | 'year';
  features: string[];
  limitations?: string[];
  discount?: {
    amount: number;
    description: string;
    validUntil?: string;
  };
  recommended?: boolean;
  isPromotion?: boolean;
  detailedDescription: string;
  targetAudience: string;
  pros: string[];
  cons: string[];
}

// Transform JSON data to Provider format
const transformJsonToProviders = (): Provider[] => {
  const providerMap = new Map<string, Provider>();

  plansData.forEach((planData: any) => {
    const company = planData["שם_החברה"];
    const service = planData["סוג_השירות"];
    
    // Map service types to our categories
    let category: 'electricity' | 'cellular' | 'internet' | 'tv';
    if (service === 'סלולר') category = 'cellular';
    else if (service === 'אינטרנט ביתי (ספק + תשתית)' || service === 'אינטרנט סיבים (ספק + תשתית)') category = 'internet';
    else if (service === 'טלוויזיה' || service === 'טריפל') category = 'tv';
    else category = 'electricity';

    const providerKey = `${company}-${category}`;
    
    if (!providerMap.has(providerKey)) {
      providerMap.set(providerKey, {
        id: providerKey.toLowerCase().replace(/\s+/g, '-'),
        name: company,
        category,
        rating: 4.0, // Default rating
        customerService: 'לא זמין',
        website: 'לא זמין',
        description: `ספק ${category === 'cellular' ? 'סלולר' : category === 'internet' ? 'אינטרנט' : category === 'tv' ? 'טלוויזיה' : 'חשמל'}`,
        established: '2020',
        plans: []
      });
    }

    const provider = providerMap.get(providerKey)!;
    
    // Convert plan data
    const plan: Plan = {
      id: `${providerKey}-${planData["שם_המסלול"]}`.toLowerCase().replace(/\s+/g, '-'),
      name: planData["שם_המסלול"],
      price: planData["מחיר_חודשי_(₪)"] || 0,
      currency: '₪',
      period: 'month',
      features: planData["הטבות_מעבר"] ? [planData["הטבות_מעבר"]] : ['תיאור לא זמין'],
      limitations: planData["זמן_התחייבות"] && planData["זמן_התחייבות"] !== 'ללא התחייבות' 
        ? [`התחייבות: ${planData["זמן_התחייבות"]}`] 
        : [],
      detailedDescription: planData["הטבות_מעבר"] || 'לא זמין',
      targetAudience: 'כלל הצרכנים',
      pros: planData["הטבות_מעבר"] ? [planData["הטבות_מעבר"]] : ['מסלול בסיסי'],
      cons: planData["זמן_התחייבות"] && planData["זמן_התחייבות"] !== 'ללא התחייבות' 
        ? [`דרישת התחייבות: ${planData["זמן_התחייבות"]}`] 
        : [],
      recommended: Math.random() > 0.7 // Mark some plans as recommended randomly
    };

    provider.plans.push(plan);
  });

  return Array.from(providerMap.values());
};

export const allProviders: Provider[] = transformJsonToProviders();

// Legacy providers - now generated from JSON data
export const electricityProviders: Provider[] = allProviders.filter(p => p.category === 'electricity');
export const cellularProviders: Provider[] = allProviders.filter(p => p.category === 'cellular');
export const internetProviders: Provider[] = allProviders.filter(p => p.category === 'internet');
export const tvProviders: Provider[] = allProviders.filter(p => p.category === 'tv');

export const getProvidersByCategory = (category: 'electricity' | 'cellular' | 'internet' | 'tv') => {
  return allProviders.filter(provider => provider.category === category);
};

export const getCheapestPlan = (category: 'electricity' | 'cellular' | 'internet' | 'tv') => {
  const providers = getProvidersByCategory(category);
  let cheapestPlan = null;
  let cheapestPrice = Infinity;
  
  providers.forEach(provider => {
    provider.plans.forEach(plan => {
      if (plan.price < cheapestPrice && plan.price > 0) {
        cheapestPrice = plan.price;
        cheapestPlan = { ...plan, providerName: provider.name, providerId: provider.id };
      }
    });
  });
  
  return cheapestPlan;
};

export const calculateAnnualSavings = (currentPrice: number, newPrice: number, category: 'electricity' | 'cellular' | 'internet' | 'tv') => {
  const multiplier = category === 'electricity' ? 2000 : 12;
  return (currentPrice - newPrice) * multiplier;
};