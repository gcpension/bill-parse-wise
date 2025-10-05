// Coverage data for Israeli telecom infrastructure
// Based on publicly available information and general market knowledge

export interface CoverageData {
  region: string;
  city?: string;
  fiberCoverage: 'full' | 'partial' | 'limited' | 'none';
  cellularCoverage: {
    partner: 'excellent' | 'good' | 'fair' | 'limited';
    cellcom: 'excellent' | 'good' | 'fair' | 'limited';
    pelephone: 'excellent' | 'good' | 'fair' | 'limited';
    hot: 'excellent' | 'good' | 'fair' | 'limited';
    golan: 'excellent' | 'good' | 'fair' | 'limited';
  };
  recommended5G: boolean;
  maxInternetSpeed: number; // in Mbps
  notes?: string;
}

// Regional coverage data
export const coverageByRegion: Record<string, CoverageData> = {
  // Center region - Tel Aviv Metro
  'tel-aviv': {
    region: 'center',
    city: 'תל אביב',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'excellent',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 1000,
    notes: 'כיסוי מלא של סיבים אופטיים וכל הרשתות הסלולריות'
  },
  'ramat-gan': {
    region: 'center',
    city: 'רמת גן',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'excellent',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 1000
  },
  'herzliya': {
    region: 'center',
    city: 'הרצליה',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'good',
      golan: 'fair'
    },
    recommended5G: true,
    maxInternetSpeed: 1000
  },
  'petah-tikva': {
    region: 'center',
    city: 'פתח תקווה',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'good',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 1000
  },
  'rishon-lezion': {
    region: 'center',
    city: 'ראשון לציון',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'good',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 1000
  },
  'holon': {
    region: 'center',
    city: 'חולון',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'good',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 1000
  },
  'bat-yam': {
    region: 'center',
    city: 'בת ים',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'good',
      hot: 'good',
      golan: 'fair'
    },
    recommended5G: true,
    maxInternetSpeed: 1000
  },
  'rehovot': {
    region: 'center',
    city: 'רחובות',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'good',
      hot: 'good',
      golan: 'fair'
    },
    recommended5G: true,
    maxInternetSpeed: 500
  },

  // Jerusalem
  'jerusalem': {
    region: 'jerusalem',
    city: 'ירושלים',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'good',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 500,
    notes: 'כיסוי משתנה בין שכונות - במרכז העיר מלא, בפריפריה חלקי'
  },

  // North region
  'haifa': {
    region: 'north',
    city: 'חיפה',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'good',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 1000
  },
  'nahariya': {
    region: 'north',
    city: 'נהריה',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'good',
      cellcom: 'good',
      pelephone: 'good',
      hot: 'fair',
      golan: 'fair'
    },
    recommended5G: false,
    maxInternetSpeed: 200
  },
  'tiberias': {
    region: 'north',
    city: 'טבריה',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'good',
      cellcom: 'good',
      pelephone: 'fair',
      hot: 'fair',
      golan: 'fair'
    },
    recommended5G: false,
    maxInternetSpeed: 200
  },
  'nazareth': {
    region: 'north',
    city: 'נצרת',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'good',
      cellcom: 'good',
      pelephone: 'good',
      hot: 'fair',
      golan: 'fair'
    },
    recommended5G: false,
    maxInternetSpeed: 200
  },

  // South region
  'beer-sheva': {
    region: 'south',
    city: 'באר שבע',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'good',
      hot: 'good',
      golan: 'fair'
    },
    recommended5G: true,
    maxInternetSpeed: 500
  },
  'ashdod': {
    region: 'south',
    city: 'אשדוד',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'good',
      hot: 'good',
      golan: 'fair'
    },
    recommended5G: true,
    maxInternetSpeed: 500
  },
  'ashkelon': {
    region: 'south',
    city: 'אשקלון',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'good',
      cellcom: 'good',
      pelephone: 'good',
      hot: 'fair',
      golan: 'fair'
    },
    recommended5G: false,
    maxInternetSpeed: 200
  },
  'eilat': {
    region: 'south',
    city: 'אילת',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'good',
      cellcom: 'good',
      pelephone: 'fair',
      hot: 'fair',
      golan: 'limited'
    },
    recommended5G: false,
    maxInternetSpeed: 200,
    notes: 'מרחק מהמרכז משפיע על זמינות שירותים'
  }
};

// Default coverage by general region
export const defaultRegionalCoverage: Record<string, Omit<CoverageData, 'city'>> = {
  center: {
    region: 'center',
    fiberCoverage: 'full',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'good',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 1000
  },
  north: {
    region: 'north',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'good',
      cellcom: 'good',
      pelephone: 'good',
      hot: 'fair',
      golan: 'fair'
    },
    recommended5G: false,
    maxInternetSpeed: 200
  },
  south: {
    region: 'south',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'good',
      cellcom: 'good',
      pelephone: 'good',
      hot: 'fair',
      golan: 'fair'
    },
    recommended5G: false,
    maxInternetSpeed: 200
  },
  jerusalem: {
    region: 'jerusalem',
    fiberCoverage: 'partial',
    cellularCoverage: {
      partner: 'excellent',
      cellcom: 'excellent',
      pelephone: 'excellent',
      hot: 'good',
      golan: 'good'
    },
    recommended5G: true,
    maxInternetSpeed: 500
  }
};

export function getCoverageForLocation(location: string): CoverageData {
  const normalizedLocation = location.toLowerCase().trim();
  
  // Try to find exact city match
  const cityMatch = Object.entries(coverageByRegion).find(([key, data]) => 
    normalizedLocation.includes(key) || 
    (data.city && normalizedLocation.includes(data.city.toLowerCase()))
  );
  
  if (cityMatch) {
    return cityMatch[1];
  }
  
  // Fall back to regional coverage
  if (normalizedLocation.includes('תל אביב') || normalizedLocation.includes('tel aviv') || 
      normalizedLocation.includes('מרכז') || normalizedLocation.includes('center')) {
    return { ...defaultRegionalCoverage.center, city: location } as CoverageData;
  }
  
  if (normalizedLocation.includes('צפון') || normalizedLocation.includes('north') || 
      normalizedLocation.includes('חיפה') || normalizedLocation.includes('haifa')) {
    return { ...defaultRegionalCoverage.north, city: location } as CoverageData;
  }
  
  if (normalizedLocation.includes('דרום') || normalizedLocation.includes('south') || 
      normalizedLocation.includes('נגב') || normalizedLocation.includes('negev')) {
    return { ...defaultRegionalCoverage.south, city: location } as CoverageData;
  }
  
  if (normalizedLocation.includes('ירושלים') || normalizedLocation.includes('jerusalem')) {
    return { ...defaultRegionalCoverage.jerusalem, city: location } as CoverageData;
  }
  
  // Default to center region if no match
  return { ...defaultRegionalCoverage.center, city: location } as CoverageData;
}

export function getProviderCoverageScore(provider: string, coverage: CoverageData): number {
  const providerKey = provider.toLowerCase();
  let cellularScore = 3; // default medium score
  
  if (providerKey.includes('partner') || providerKey.includes('פרטנר')) {
    cellularScore = coverageScoreToNumber(coverage.cellularCoverage.partner);
  } else if (providerKey.includes('cellcom') || providerKey.includes('סלקום')) {
    cellularScore = coverageScoreToNumber(coverage.cellularCoverage.cellcom);
  } else if (providerKey.includes('pelephone') || providerKey.includes('פלאפון')) {
    cellularScore = coverageScoreToNumber(coverage.cellularCoverage.pelephone);
  } else if (providerKey.includes('hot') || providerKey.includes('הוט')) {
    cellularScore = coverageScoreToNumber(coverage.cellularCoverage.hot);
  } else if (providerKey.includes('golan') || providerKey.includes('גולן')) {
    cellularScore = coverageScoreToNumber(coverage.cellularCoverage.golan);
  }
  
  return cellularScore;
}

function coverageScoreToNumber(coverage: 'excellent' | 'good' | 'fair' | 'limited'): number {
  switch (coverage) {
    case 'excellent': return 5;
    case 'good': return 4;
    case 'fair': return 3;
    case 'limited': return 2;
    default: return 3;
  }
}

export function getFiberCoverageScore(coverage: CoverageData): number {
  switch (coverage.fiberCoverage) {
    case 'full': return 5;
    case 'partial': return 3;
    case 'limited': return 2;
    case 'none': return 1;
    default: return 3;
  }
}
