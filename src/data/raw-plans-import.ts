// This file safely imports the JSON data
import rawPlansData from './israeli_telecom_plans_hebrew.json';

export interface RawPlan {
  קטגוריה: string;
  שם_חברה: string;
  שם_המסלול: string;
  'נפח/מהירות': string;
  'דקות/שיחות': string;
  תוספות: string;
  מחיר: string;
  הערות: string;
}

export const rawPlans = rawPlansData as RawPlan[];
