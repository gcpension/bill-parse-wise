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
    
    // Skip if company or service is missing
    if (!company || !service) return;
    
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
    
    // Convert plan data - handle null prices
    const monthlyPrice = planData["מחיר_חודשי_(₪)"];
    const planName = planData["שם_המסלול"];
    
    // Skip if plan name is missing
    if (!planName) return;
    
    const plan: Plan = {
      id: `${providerKey}-${planName}`.toLowerCase().replace(/\s+/g, '-'),
      name: planName,
      price: monthlyPrice !== null ? monthlyPrice : 0, // Use 0 for null prices
      currency: '₪',
      period: 'month',
      features: planData["הטבות_מעבר"] ? [planData["הטבות_מעבר"]] : ['מידע לא זמין'],
      limitations: planData["זמן_התחייבות"] && planData["זמן_התחייבות"] !== 'ללא התחייבות' && planData["זמן_התחייבות"] !== 'ללא'
        ? [`התחייבות: ${planData["זמן_התחייבות"]}`] 
        : [],
      detailedDescription: planData["הטבות_מעבר"] || 'פרטים נוספים יתקבלו בפנייה לספק',
      targetAudience: 'כלל הצרכנים',
      pros: planData["הטבות_מעבר"] ? [planData["הטבות_מעבר"]] : ['מסלול בסיסי'],
      cons: monthlyPrice === null ? ['המחיר יקבע בהתאם לפנייה'] : [],
      recommended: Math.random() > 0.8, // Mark some plans as recommended
      isPromotion: planData["הטבות_מעבר"] && planData["הטבות_מעבר"].includes('מבצע')
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
      // Only consider plans with actual prices > 0
      if (plan.price > 0 && plan.price < cheapestPrice) {
        cheapestPrice = plan.price;
        cheapestPlan = { ...plan, providerName: provider.name, providerId: provider.id };
      }
    });
  });
  
  // If no plans with prices found, return the first plan available
  if (!cheapestPlan && providers.length > 0 && providers[0].plans.length > 0) {
    const firstPlan = providers[0].plans[0];
    cheapestPlan = { ...firstPlan, providerName: providers[0].name, providerId: providers[0].id };
  }
  
  return cheapestPlan;
};

export const calculateAnnualSavings = (currentPrice: number, newPrice: number, category: 'electricity' | 'cellular' | 'internet' | 'tv') => {
  const multiplier = category === 'electricity' ? 2000 : 12;
  return (currentPrice - newPrice) * multiplier;
};