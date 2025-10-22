// Utility functions to parse and structure plan data

export interface ParsedTechnicalSpecs {
  // Cellular
  dataVolume?: string;
  calls?: string;
  internationalMinutes?: string;
  network?: string; // 5G, 4G
  esim?: boolean;
  
  // Internet
  speed?: string;
  technology?: string; // fiber, copper
  router?: string;
  
  // TV
  channels?: string;
  sports?: boolean;
  kids?: boolean;
  vod?: boolean;
  quality?: string; // HD, 4K
  
  // Electricity
  energyType?: string;
  tariff?: string;
  
  // General
  additionalFeatures: string[];
}

export function parseTechnicalSpecs(
  transferBenefits: string | null,
  service: string
): ParsedTechnicalSpecs {
  const specs: ParsedTechnicalSpecs = {
    additionalFeatures: []
  };

  if (!transferBenefits) return specs;

  const benefits = transferBenefits.toLowerCase();

  // Cellular parsing
  if (service === 'סלולר' || service === 'cellular') {
    // Data volume
    const gbMatch = benefits.match(/(\d+)\s*gb/i);
    if (gbMatch) {
      specs.dataVolume = `${gbMatch[1]} GB`;
    } else if (benefits.includes('ללא הגבלה') || benefits.includes('אינסוף')) {
      specs.dataVolume = 'ללא הגבלה';
    }

    // Calls
    if (benefits.includes('שיחות ללא הגבלה') || benefits.includes('דקות ללא הגבלה')) {
      specs.calls = 'ללא הגבלה';
    }

    // International
    const intlMatch = benefits.match(/(\d+)\s*דקות.*?חו["']ל/i);
    if (intlMatch) {
      specs.internationalMinutes = `${intlMatch[1]} דקות`;
    }

    // Network
    if (benefits.includes('5g')) {
      specs.network = '5G';
    } else if (benefits.includes('4g')) {
      specs.network = '4G';
    }

    // eSIM
    if (benefits.includes('esim') || benefits.includes('e-sim')) {
      specs.esim = true;
    }
  }

  // Internet parsing
  if (service === 'אינטרנט' || service === 'internet') {
    // Speed
    const speedMatch = benefits.match(/(\d+)\s*מגה/i);
    if (speedMatch) {
      specs.speed = `${speedMatch[1]} מגה`;
    }

    // Technology
    if (benefits.includes('סיב אופטי') || benefits.includes('fiber')) {
      specs.technology = 'סיב אופטי';
    } else if (benefits.includes('נחושת')) {
      specs.technology = 'נחושת';
    }

    // Router
    if (benefits.includes('נתב חינם') || benefits.includes('ללא עלות נתב')) {
      specs.router = 'חינם';
    } else if (benefits.includes('נתב')) {
      specs.router = 'בתשלום';
    }
  }

  // TV parsing
  if (service === 'טלוויזיה' || service === 'tv') {
    // Channels
    const channelMatch = benefits.match(/(\d+)\s*ערוצ/i);
    if (channelMatch) {
      specs.channels = `${channelMatch[1]} ערוצים`;
    }

    // Sports
    if (benefits.includes('ספורט')) {
      specs.sports = true;
    }

    // Kids
    if (benefits.includes('ילדים')) {
      specs.kids = true;
    }

    // VOD
    if (benefits.includes('vod') || benefits.includes('לפי דרישה')) {
      specs.vod = true;
    }

    // Quality
    if (benefits.includes('4k')) {
      specs.quality = '4K';
    } else if (benefits.includes('hd')) {
      specs.quality = 'HD';
    }
  }

  // Electricity parsing
  if (service === 'חשמל' || service === 'electricity') {
    if (benefits.includes('ירוק') || benefits.includes('מתחדש')) {
      specs.energyType = 'אנרגיה ירוקה';
    }

    if (benefits.includes('לילה')) {
      specs.tariff = 'תעריף יום/לילה';
    }
  }

  // Extract additional features
  const lines = transferBenefits.split(/[,.\n]/).filter(l => l.trim());
  specs.additionalFeatures = lines
    .map(l => l.trim())
    .filter(l => l.length > 5 && l.length < 100)
    .slice(0, 5); // Limit to 5 features

  return specs;
}

export interface MarketPosition {
  position: 'זול' | 'סטנדרטי' | 'פרימיום';
  percentageDiff: number;
  savings: number;
}

export function calculateMarketPosition(
  planPrice: number,
  allPlansInCategory: { monthlyPrice: number | null }[]
): MarketPosition {
  const prices = allPlansInCategory
    .map(p => p.monthlyPrice)
    .filter((p): p is number => p !== null && p > 0);

  if (prices.length === 0) {
    return { position: 'סטנדרטי', percentageDiff: 0, savings: 0 };
  }

  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const percentageDiff = ((planPrice - avgPrice) / avgPrice) * 100;
  const savings = avgPrice - planPrice;

  let position: 'זול' | 'סטנדרטי' | 'פרימיום';
  if (percentageDiff < -15) {
    position = 'זול';
  } else if (percentageDiff > 15) {
    position = 'פרימיום';
  } else {
    position = 'סטנדרטי';
  }

  return { position, percentageDiff, savings: Math.round(savings) };
}

export function getSuitabilityTags(
  specs: ParsedTechnicalSpecs,
  service: string,
  marketPosition: MarketPosition
): string[] {
  const tags: string[] = [];

  // Budget friendly
  if (marketPosition.position === 'זול') {
    tags.push('מתאים למחפשי חיסכון');
  }

  // Cellular
  if (service === 'סלולר' || service === 'cellular') {
    if (specs.dataVolume === 'ללא הגבלה' || (specs.dataVolume && parseInt(specs.dataVolume) >= 100)) {
      tags.push('מתאים לגולשים כבדים');
    }
    if (specs.internationalMinutes) {
      tags.push('מתאים למטיילים');
    }
    if (specs.esim) {
      tags.push('מתאים לנוודים דיגיטליים');
    }
    if (specs.network === '5G') {
      tags.push('טכנולוגיה מתקדמת');
    }
  }

  // Internet
  if (service === 'אינטרנט' || service === 'internet') {
    const speed = specs.speed ? parseInt(specs.speed) : 0;
    if (speed >= 500) {
      tags.push('מתאים למשפחות גדולות');
    } else if (speed >= 200) {
      tags.push('מתאים לעבודה מהבית');
    }
    if (specs.technology === 'סיב אופטי') {
      tags.push('טכנולוגיה מתקדמת');
    }
    if (specs.router === 'חינם') {
      tags.push('חסכון בהוצאות נלוות');
    }
  }

  // TV
  if (service === 'טלוויזיה' || service === 'tv') {
    if (specs.sports) {
      tags.push('מתאים לחובבי ספורט');
    }
    if (specs.kids) {
      tags.push('מתאים למשפחות עם ילדים');
    }
    if (specs.quality === '4K') {
      tags.push('איכות פרימיום');
    }
  }

  return tags;
}
