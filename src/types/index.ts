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