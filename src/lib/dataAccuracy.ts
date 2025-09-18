import { logger } from './logger';

export interface DataAccuracyCheck {
  field: string;
  value: any;
  accuracy: 'high' | 'medium' | 'low';
  confidence: number;
  suggestions: string[];
  warnings: string[];
}

export interface CategoryDataAccuracy {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  overallAccuracy: 'high' | 'medium' | 'low';
  checks: DataAccuracyCheck[];
  recommendedActions: string[];
}

/**
 * Advanced data accuracy validation and improvement suggestions
 */
export class DataAccuracyValidator {

  /**
   * Validate category data accuracy
   */
  static validateCategoryData(
    category: 'electricity' | 'cellular' | 'internet' | 'tv',
    data: {
      currentProvider: string;
      monthlyAmount: number;
      accountDetails?: string;
      familySize?: number;
      homeType?: string;
    }
  ): CategoryDataAccuracy {
    
    logger.info('Validating data accuracy', 'DataAccuracyValidator', {
      category,
      amount: data.monthlyAmount,
      provider: data.currentProvider
    });

    const checks: DataAccuracyCheck[] = [];

    // Validate monthly amount
    checks.push(this.validateMonthlyAmount(category, data.monthlyAmount, data.familySize));
    
    // Validate provider
    checks.push(this.validateProvider(category, data.currentProvider));
    
    // Category-specific validations
    checks.push(...this.getCategorySpecificChecks(category, data));

    const overallAccuracy = this.calculateOverallAccuracy(checks);
    const recommendedActions = this.generateRecommendedActions(category, checks);

    return {
      category,
      overallAccuracy,
      checks,
      recommendedActions
    };
  }

  /**
   * Validate monthly amount accuracy
   */
  private static validateMonthlyAmount(
    category: string,
    amount: number,
    familySize?: number
  ): DataAccuracyCheck {
    const suggestions: string[] = [];
    const warnings: string[] = [];
    let accuracy: 'high' | 'medium' | 'low' = 'high';
    let confidence = 0.9;

    // Category-specific amount ranges (updated with 2024 Israeli market data)
    const ranges = {
      electricity: {
        min: 150, max: 1500, average: 400,
        familyMultiplier: { 1: 0.7, 2: 1.0, 3: 1.3, 4: 1.6, 5: 2.0 }
      },
      cellular: {
        min: 25, max: 200, average: 80,
        familyMultiplier: { 1: 1.0, 2: 1.8, 3: 2.5, 4: 3.2, 5: 4.0 }
      },
      internet: {
        min: 50, max: 200, average: 100,
        familyMultiplier: { 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.1, 5: 1.2 }
      },
      tv: {
        min: 30, max: 250, average: 120,
        familyMultiplier: { 1: 0.8, 2: 1.0, 3: 1.1, 4: 1.2, 5: 1.3 }
      }
    };

    const categoryRange = ranges[category as keyof typeof ranges];
    if (!categoryRange) {
      return {
        field: 'monthlyAmount',
        value: amount,
        accuracy: 'low',
        confidence: 0.3,
        suggestions: ['קטגוריה לא מוכרת'],
        warnings: []
      };
    }

    // Adjust expected range based on family size
    const familyFactor = familySize && familySize <= 5 ? 
      categoryRange.familyMultiplier[familySize as keyof typeof categoryRange.familyMultiplier] : 1;
    
    const expectedMin = categoryRange.min * familyFactor;
    const expectedMax = categoryRange.max * familyFactor;
    const expectedAverage = categoryRange.average * familyFactor;

    // Check if amount is within reasonable range
    if (amount < expectedMin) {
      accuracy = 'low';
      confidence = 0.4;
      warnings.push(`הסכום נמוך מהממוצע (צפוי: ₪${expectedMin.toFixed(0)}-${expectedMax.toFixed(0)})`);
      
      if (category === 'electricity') {
        suggestions.push('בדוק שכללת את כל חלקי החשבון: צריכה, אגרות, מע"מ');
        suggestions.push('ייתכן שיש לך תעריף מוזל או שעות נמוכות');
      } else if (category === 'cellular') {
        suggestions.push('בדוק שכללת את כל הקווים במשפחה');
        suggestions.push('ייתכן שאתה משלם רק עבור המסלול הבסיסי');
      }
    } else if (amount > expectedMax) {
      accuracy = 'medium';
      confidence = 0.6;
      warnings.push(`הסכום גבוה מהממוצע (צפוי: ₪${expectedMin.toFixed(0)}-${expectedMax.toFixed(0)})`);
      
      if (category === 'electricity') {
        suggestions.push('בדוק את צריכת החשמל - ייתכן שיש בעיה בבדידות או מכשירים ישנים');
        suggestions.push('שקול להתקין פאנלים סולריים');
      } else if (category === 'cellular') {
        suggestions.push('ייתכן שאתה משלם עבור שירותים שלא נחוצים');
        suggestions.push('בדוק אם יש עמלות או תוספות מיותרות');
      }
    } else {
      // Amount is within reasonable range
      const deviationFromAverage = Math.abs(amount - expectedAverage) / expectedAverage;
      if (deviationFromAverage < 0.2) {
        accuracy = 'high';
        confidence = 0.9;
        suggestions.push('הסכום נראה סביר ומדויק');
      } else {
        accuracy = 'medium';
        confidence = 0.7;
      }
    }

    // Seasonal considerations for electricity
    if (category === 'electricity') {
      const currentMonth = new Date().getMonth();
      const isSummer = currentMonth >= 5 && currentMonth <= 8; // June-September
      const isWinter = currentMonth <= 2 || currentMonth >= 11; // Dec-March

      if (isSummer && amount < expectedAverage * 0.8) {
        suggestions.push('בקיץ צריכת החשמל בדרך כלל גבוהה יותר בגלל מזגנים');
      } else if (isWinter && amount < expectedAverage * 0.9) {
        suggestions.push('בחורף צריכת החשמל עלולה להיות גבוהה יותר בגלל חימום');
      }
    }

    return {
      field: 'monthlyAmount',
      value: amount,
      accuracy,
      confidence,
      suggestions,
      warnings
    };
  }

  /**
   * Validate provider accuracy
   */
  private static validateProvider(category: string, provider: string): DataAccuracyCheck {
    const suggestions: string[] = [];
    const warnings: string[] = [];
    let accuracy: 'high' | 'medium' | 'low' = 'high';
    let confidence = 0.8;

    // Known providers by category (updated 2024)
    const knownProviders = {
      electricity: [
        'חברת החשמל', 'אנרג\'יה', 'פז חשמל', 'אקטיב', 'סלקטרה', 'בי חשמל',
        'חשמל דוראל', 'זכרון חשמל', 'חשמל זול'
      ],
      cellular: [
        'פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', 'רמי לוי', 'גולן טלקום',
        '012 מובייל', 'יונק טלקום'
      ],
      internet: [
        'בזק', 'פרטנר', 'סלקום', 'הוט', '012 נט', 'נטוויז\'ן',
        'גולן טלקום', 'אינטרנט זהב'
      ],
      tv: [
        'יס', 'הוט', 'פרטנר TV', 'סלקום TV', 'נטפליקס', 'ספוטיפיי',
        'דיסני פלוס', 'אמזון פריים'
      ]
    };

    const categoryProviders = knownProviders[category as keyof typeof knownProviders] || [];
    const isKnownProvider = categoryProviders.some(p => 
      provider.toLowerCase().includes(p.toLowerCase()) || 
      p.toLowerCase().includes(provider.toLowerCase())
    );

    if (!isKnownProvider) {
      accuracy = 'medium';
      confidence = 0.6;
      warnings.push('ספק לא מוכר או שם לא מדויק');
      suggestions.push('בדוק את השם המדויק של הספק');
      suggestions.push(`ספקים מוכרים: ${categoryProviders.slice(0, 5).join(', ')}`);
    } else {
      suggestions.push('ספק מוכר ומאומת');
    }

    // Check for common misspellings
    const commonMisspellings: Record<string, string> = {
      'פלפון': 'פלאפון',
      'סלוקום': 'סלקום',
      'פרטנר': 'פרטנר',
      'בזאק': 'בזק',
      'yesיס': 'יס',
      'נטפליקס': 'נטפליקס'
    };

    const corrected = commonMisspellings[provider];
    if (corrected) {
      suggestions.push(`האם התכוונת ל-${corrected}?`);
      accuracy = 'medium';
    }

    return {
      field: 'provider',
      value: provider,
      accuracy,
      confidence,
      suggestions,
      warnings
    };
  }

  /**
   * Get category-specific validation checks
   */
  private static getCategorySpecificChecks(
    category: string,
    data: any
  ): DataAccuracyCheck[] {
    const checks: DataAccuracyCheck[] = [];

    switch (category) {
      case 'electricity':
        checks.push(this.validateElectricitySpecific(data));
        break;
      case 'cellular':
        checks.push(this.validateCellularSpecific(data));
        break;
      case 'internet':
        checks.push(this.validateInternetSpecific(data));
        break;
      case 'tv':
        checks.push(this.validateTVSpecific(data));
        break;
    }

    return checks;
  }

  /**
   * Electricity-specific validations
   */
  private static validateElectricitySpecific(data: any): DataAccuracyCheck {
    const suggestions: string[] = [];
    const warnings: string[] = [];
    let accuracy: 'high' | 'medium' | 'low' = 'high';

    // Check for common electricity billing components
    suggestions.push('ודא שכללת: צריכה + אגרה קבועה + מע"מ');
    
    if (data.monthlyAmount && data.familySize) {
      const avgConsumptionPerPerson = data.monthlyAmount / data.familySize;
      if (avgConsumptionPerPerson < 80) {
        suggestions.push('צריכה נמוכה לאדם - בדוק שהמונה קורא נכון');
      } else if (avgConsumptionPerPerson > 200) {
        suggestions.push('צריכה גבוהה לאדם - שקול בדיקת יעילות אנרגטית');
      }
    }

    // Seasonal advice
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 5 && currentMonth <= 8) { // Summer
      suggestions.push('בקיץ: החשבון כולל בדרך כלל עלות מזגן גבוהה יותר');
    }

    return {
      field: 'electricitySpecific',
      value: data,
      accuracy,
      confidence: 0.8,
      suggestions,
      warnings
    };
  }

  /**
   * Cellular-specific validations
   */
  private static validateCellularSpecific(data: any): DataAccuracyCheck {
    const suggestions: string[] = [];
    const warnings: string[] = [];

    suggestions.push('כלול את כל הקווים במשפחה');
    suggestions.push('בדוק תוספות כמו: ביטוח, שיחות לחו"ל, נתונים נוספים');

    if (data.familySize && data.familySize > 1) {
      const avgPerLine = data.monthlyAmount / data.familySize;
      if (avgPerLine > 100) {
        warnings.push('תעריף גבוה לקו - בדוק אם יש תוספות מיותרות');
      } else if (avgPerLine < 30) {
        suggestions.push('תעריף נמוך - ודא שכללת את כל השירותים');
      }
    }

    return {
      field: 'cellularSpecific',
      value: data,
      accuracy: 'high',
      confidence: 0.8,
      suggestions,
      warnings
    };
  }

  /**
   * Internet-specific validations
   */
  private static validateInternetSpecific(data: any): DataAccuracyCheck {
    const suggestions: string[] = [];

    suggestions.push('כלול: אינטרנט + טלפון קווי (אם יש) + שכירות ציוד');
    
    if (data.homeType === 'office') {
      suggestions.push('לעסק: שקול קו עסקי עם SLA מתאים');
    }

    return {
      field: 'internetSpecific',
      value: data,
      accuracy: 'high',
      confidence: 0.8,
      suggestions,
      warnings: []
    };
  }

  /**
   * TV-specific validations
   */
  private static validateTVSpecific(data: any): DataAccuracyCheck {
    const suggestions: string[] = [];
    const warnings: string[] = [];

    suggestions.push('כלול: חבילת טלוויזיה + שירותי סטרימינג + שכירות ציוד');
    
    if (data.monthlyAmount > 200) {
      suggestions.push('תעריף גבוה - בדוק אם אתה משלם עבור ערוצים שלא צופה בהם');
    }

    return {
      field: 'tvSpecific',
      value: data,
      accuracy: 'high',
      confidence: 0.7,
      suggestions,
      warnings
    };
  }

  /**
   * Calculate overall accuracy from individual checks
   */
  private static calculateOverallAccuracy(checks: DataAccuracyCheck[]): 'high' | 'medium' | 'low' {
    if (checks.length === 0) return 'low';

    const accuracyScores = checks.map(check => {
      switch (check.accuracy) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 1;
      }
    });

    const averageScore = accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length;
    
    if (averageScore >= 2.7) return 'high';
    if (averageScore >= 2.0) return 'medium';
    return 'low';
  }

  /**
   * Generate recommended actions based on checks
   */
  private static generateRecommendedActions(
    category: string,
    checks: DataAccuracyCheck[]
  ): string[] {
    const actions: string[] = [];
    
    const hasLowAccuracy = checks.some(check => check.accuracy === 'low');
    const hasWarnings = checks.some(check => check.warnings.length > 0);

    if (hasLowAccuracy) {
      actions.push('בדוק את הנתונים שהזנת ועדכן אותם בהתאם להמלצות');
    }

    if (hasWarnings) {
      actions.push('שים לב לאזהרות ובדוק את הסכומים בחשבונות האחרונים');
    }

    // Category-specific actions
    switch (category) {
      case 'electricity':
        actions.push('צרף חשבון חשמל אחרון לבדיקה מדויקת יותר');
        break;
      case 'cellular':
        actions.push('בדוק באפליקציה של הספק את הפירוט המדויק');
        break;
      case 'internet':
        actions.push('ודא שכללת את כל השירותים הנלווים');
        break;
      case 'tv':
        actions.push('בדוק רשימת מנויים בשירותי הסטרימינג');
        break;
    }

    return actions;
  }
}