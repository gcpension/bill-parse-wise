import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatCurrency(amount: number, currency: string = '₪'): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    currencyDisplay: 'symbol'
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('he-IL').format(num);
}

export function getChangeColor(change: number): string {
  if (change > 0) return 'text-destructive';
  if (change < 0) return 'text-success';
  return 'text-muted-foreground';
}

export function getChangeIcon(change: number): string {
  if (change > 0) return '↗';
  if (change < 0) return '↘';
  return '→';
}

export function validateImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
}