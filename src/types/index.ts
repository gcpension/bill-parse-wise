export interface ExpenseCategory {
  id: string;
  name: string;
  nameHebrew: string;
  keywords: string[];
  color: string;
}

export interface ParsedExpense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  date?: Date;
  provider?: string;
  fileName: string;
  confidence: number;
}

export interface MonthlyStats {
  category: ExpenseCategory;
  currentMonth: number;
  previousMonth: number;
  change: number;
  changePercent: number;
}

export interface SavingRecommendation {
  id: string;
  category: ExpenseCategory;
  title: string;
  description: string;
  monthlySavings: number;
  annualSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  lines: string[];
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface Plan {
  id?: string;
  name: string;
  provider: string;
  category?: string;
  price: number;
  originalPrice?: number;
  monthlyPrice?: number;
  features?: string[];
  rating?: number;
  savings?: number;
  description?: string;
  recommended?: boolean;
}

export interface FilterOptions {
  category: string;
  maxPrice: number;
  minRating: number;
  contractLength: number;
  features: string[];
  includePromotions: boolean;
  priceRange?: [number, number];
  providers?: string[];
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  key?: keyof Plan;
  label?: string;
}