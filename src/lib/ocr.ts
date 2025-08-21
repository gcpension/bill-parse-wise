import { pipeline, env } from '@huggingface/transformers';
import { OCRResult, ParsedExpense, ExpenseCategory } from '@/types';
import { getCategoryByKeywords } from './categories';
import { generateId } from './utils';
import { handleError } from './errorHandler';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let ocrPipeline: any = null;

export const initializeOCR = async () => {
  if (!ocrPipeline) {
    try {
      console.log('Initializing OCR pipeline...');
      ocrPipeline = await pipeline('image-to-text', 'Xenova/trocr-base-handwritten', {
        device: 'webgpu',
      });
      console.log('OCR pipeline initialized successfully');
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
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
          console.log('Processing image with OCR...');
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
          handleError(error, 'OCR processing');
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
    console.log('No category found for text:', text);
    return expenses;
  }
  
  // Extract amounts
  const amounts = parseHebrewAmount(text);
  console.log('Found amounts:', amounts);
  
  if (amounts.length === 0) {
    console.log('No amounts found in text');
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