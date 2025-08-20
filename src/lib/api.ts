// API helper functions for client to call backend endpoints

export interface ParsedLine {
  text: string;
  amount?: number;
  category?: string;
}

export interface CostCategory {
  category: string;
  total: number;
}

export interface Recommendation {
  category: string;
  title: string;
  description: string;
  monthlySavings: number;
  annualSavings: number;
}

// Base URL for API calls. In development with Vite proxy, this can be empty string.
const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || '';

/**
 * Upload an invoice file to the server for OCR and parsing.
 * Returns the parsed lines with optional amounts and categories.
 */
export async function uploadInvoice(file: File): Promise<ParsedLine[]> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload invoice');
  }

  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || 'Error processing invoice');
  }

  // result.data should contain { lines, parsed }
  return result.data?.parsed ?? [];
}

/**
 * Fetch aggregated cost categories from the server.
 */
export async function getCostCategories(): Promise<CostCategory[]> {
  const response = await fetch(`${API_BASE}/api/cost-categories`);
  if (!response.ok) {
    throw new Error('Failed to load cost categories');
  }
  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || 'Error fetching cost categories');
  }
  return result.data ?? [];
}

/**
 * Fetch saving recommendations from the server.
 */
export async function getRecommendations(): Promise<Recommendation[]> {
  const response = await fetch(`${API_BASE}/api/recommendations`);
  if (!response.ok) {
    throw new Error('Failed to load recommendations');
  }
  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || 'Error fetching recommendations');
  }
  return result.data ?? [];
}
