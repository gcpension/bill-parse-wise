import { ExpenseCategory } from '@/types';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'electricity',
    name: 'Electricity',
    nameHebrew: 'חשמל',
    keywords: ['חשמל', 'חברת חשמל', 'נק"ע', 'חח"י', 'קילוואט', 'kwh', 'electricity'],
    color: 'hsl(48, 96%, 53%)', // Yellow
  },
  {
    id: 'internet',
    name: 'Internet',
    nameHebrew: 'אינטרנט',
    keywords: ['אינטרנט', 'בזק', 'פרטנר', 'סלקום', 'הוט', 'internet', 'wifi'],
    color: 'hsl(217, 91%, 60%)', // Blue
  },
  {
    id: 'cellular',
    name: 'Cellular',
    nameHebrew: 'סלולר',
    keywords: ['סלולר', 'טלפון נייד', 'פלאפון', 'סלקום', 'פרטנר', 'cellular', 'mobile'],
    color: 'hsl(142, 76%, 36%)', // Green
  },
  {
    id: 'water',
    name: 'Water',
    nameHebrew: 'מים',
    keywords: ['מים', 'מי', 'עירייה', 'מים וביוב', 'water', 'municipal'],
    color: 'hsl(199, 89%, 48%)', // Light Blue
  },
  {
    id: 'gas',
    name: 'Gas',
    nameHebrew: 'גז',
    keywords: ['גז', 'דלק', 'סופרגז', 'אמיגז', 'gas', 'fuel'],
    color: 'hsl(25, 95%, 53%)', // Orange
  },
  {
    id: 'tv',
    name: 'Television',
    nameHebrew: 'טלוויזיה',
    keywords: ['טלוויזיה', 'טלוויזיה בכבלים', 'yes', 'הוט', 'נטפליקס', 'tv', 'cable'],
    color: 'hsl(271, 81%, 56%)', // Purple
  },
];

export const getCategoryByKeywords = (text: string): ExpenseCategory | null => {
  const lowerText = text.toLowerCase();
  
  for (const category of EXPENSE_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return null;
};