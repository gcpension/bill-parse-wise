import { pipeline, env } from '@huggingface/transformers';
import { OCRResult, ParsedExpense, ExpenseCategory } from '@/types';
import { getCategoryByKeywords } from './categories';
import { generateId } from './utils';
import { handleError } from './errorHandler';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

let ocrPipeline: any = null;

export const initializeOCR = async () => {
  if (!ocrPipeline) {
    try {
      logger.info('Initializing OCR pipeline...', 'OCR');
      ocrPipeline = await pipeline('image-to-text', 'Xenova/trocr-base-handwritten', {
        device: 'webgpu',
      });
      logger.info('OCR pipeline initialized successfully', 'OCR');
    } catch (error) {
      logger.warn('WebGPU not available, falling back to CPU', 'OCR');
      ocrPipeline = await pipeline('image-to-text', 'Xenova/trocr-base-handwritten');
    }
  }
  return ocrPipeline;
};

export const extractTextFromImage = async (imageFile: File): Promise<OCRResult> => {
  try {
    const pipeline = await initializeOCR();
    
    // Convert file to image element
    const imageUrl = URL.createObjectURL(imageFile);
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          logger.debug('Processing image with OCR...', 'OCR');
          const result = await pipeline(img);
          
          URL.revokeObjectURL(imageUrl);
          
          const text = result.generated_text || '';
          const lines = text.split('\n').filter(line => line.trim().length > 0);
          
          resolve({
            text,
            confidence: 0.8, // TrOCR doesn't provide confidence scores
            lines
          });
        } catch (error) {
          logger.error('Error processing image with OCR', 'OCR', error);
          URL.revokeObjectURL(imageUrl);
          reject(error);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    handleError(error, 'OCR initialization');
    throw error;
  }
};

export const parseHebrewAmount = (text: string): number[] => {
  // Hebrew number patterns with ₪ symbol and various formats
  const patterns = [
    /₪\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{1,2})?)/g,
    /([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{1,2})?)\s*₪/g,
    /([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{1,2})?)/g,
  ];
  
  const amounts: number[] = [];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const amountStr = match[1];
      // Normalize the amount: remove thousand separators, use dot for decimal
      let normalized = amountStr.replace(/,([0-9]{3})/g, '$1'); // Remove thousand separators
      normalized = normalized.replace(/,([0-9]{1,2})$/, '.$1'); // Convert decimal comma to dot
      
      const amount = parseFloat(normalized);
      if (!isNaN(amount) && amount > 0) {
        amounts.push(amount);
      }
    }
  }
  
  return amounts.filter((amount, index, self) => self.indexOf(amount) === index); // Remove duplicates
};

export const parseExpenseFromText = (
  text: string, 
  fileName: string, 
  ocrResult: OCRResult
): ParsedExpense[] => {
  const expenses: ParsedExpense[] = [];
  
  // Try to categorize the expense
  const category = getCategoryByKeywords(text);
  if (!category) {
    logger.debug('No category found for text', 'OCR', { text: text.substring(0, 100) });
    return expenses;
  }
  
  // Extract amounts
  const amounts = parseHebrewAmount(text);
  logger.debug('Found amounts in text', 'OCR', { amounts, text: text.substring(0, 100) });
  
  if (amounts.length === 0) {
    logger.debug('No amounts found in text', 'OCR');
    return expenses;
  }
  
  // Use the largest amount as the main expense (usually the total)
  const mainAmount = Math.max(...amounts);
  
  // Try to extract provider/company name from the first few lines
  const lines = ocrResult.lines;
  let provider = '';
  if (lines.length > 0) {
    provider = lines[0].trim();
    // Clean up common OCR artifacts
    provider = provider.replace(/[^\u0590-\u05FFa-zA-Z0-9\s]/g, '').trim();
  }
  
  const expense: ParsedExpense = {
    id: generateId(),
    category,
    amount: mainAmount,
    currency: '₪',
    description: `${category.nameHebrew} - ${provider || fileName}`,
    provider,
    fileName,
    confidence: ocrResult.confidence,
  };
  
  expenses.push(expense);
  
  return expenses;
};