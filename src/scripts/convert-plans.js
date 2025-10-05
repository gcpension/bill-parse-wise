// Node.js script to convert JSON plans to TypeScript format
const fs = require('fs');
const path = require('path');

// Read the JSON file
const rawPlans = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../data/israeli_telecom_plans_hebrew.json'),
    'utf8'
  )
);

// Map category names from Hebrew to English
const categoryMap = {
  'חשמל': 'electricity',
  'אינטרנט': 'internet',
  'סלולר': 'mobile',
  'סטרימינג/טלוויזיה': 'tv',
};

// Get color based on category
function getCategoryColor(category) {
  const colors = {
    electricity: 'bg-gradient-to-br from-blue-400 to-blue-600',
    internet: 'bg-gradient-to-br from-green-400 to-green-600',
    mobile: 'bg-gradient-to-br from-purple-400 to-purple-600',
    tv: 'bg-gradient-to-br from-red-400 to-red-600',
  };
  return colors[category] || 'bg-gradient-to-br from-gray-400 to-gray-600';
}

// Parse price from Hebrew text
function parsePrice(priceText) {
  const match = priceText.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

// Generate unique ID
function generateId(company, planName) {
  const combined = `${company}-${planName}`;
  return combined
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0590-\u05FF-]/g, '')
    .toLowerCase()
    .substring(0, 100); // Limit length
}

// Convert raw plan to ManualPlan format
function convertRawPlan(raw, index) {
  const category = categoryMap[raw.קטגוריה];
  if (!category) {
    console.warn(`Unknown category: ${raw.קטגוריה}`);
    return null;
  }

  const price = parsePrice(raw.מחיר);
  
  // Build features array
  const features = [];
  
  if (raw.הערות && raw.הערות !== 'לא רלוונטי') {
    features.push(raw.הערות);
  }
  
  if (raw.תוספות && raw.תוספות !== 'ללא' && raw.תוספות !== 'לא רלוונטי') {
    features.push(`תוספות: ${raw.תוספות}`);
  }
  
  if (raw['נפח/מהירות'] && raw['נפח/מהירות'] !== 'לא רלוונטי') {
    if (category === 'mobile') {
      features.push(`גלישה: ${raw['נפח/מהירות']}`);
    } else if (category === 'internet' || category === 'tv') {
      features.push(`מהירות: ${raw['נפח/מהירות']}`);
    }
  }
  
  if (raw['דקות/שיחות'] && raw['דקות/שיחות'] !== 'לא רלוונטי' && raw['דקות/שיחות'] !== 'לא מוגבל') {
    features.push(`שיחות: ${raw['דקות/שיחות']}`);
  }

  // Extract data amount for mobile
  let dataAmount = undefined;
  if (category === 'mobile' && raw['נפח/מהירות'] !== 'לא רלוונטי' && raw['נפח/מהירות'] !== 'ללא הגבלה') {
    dataAmount = raw['נפח/מהירות'];
  }

  // Extract speed info for internet/tv
  let downloadSpeed = '';
  let uploadSpeed = '';
  if ((category === 'internet' || category === 'tv') && raw['נפח/מהירות'] !== 'לא רלוונטי') {
    downloadSpeed = raw['נפח/מהירות'];
  }

  return {
    id: generateId(raw.שם_חברה, raw.שם_המסלול) || `plan-${index}`,
    company: raw.שם_חברה,
    planName: raw.שם_המסלול,
    speed: raw['נפח/מהירות'] !== 'לא רלוונטי' ? raw['נפח/מהירות'] : '',
    introPrice: 0,
    introMonths: 0,
    regularPrice: price,
    uploadSpeed,
    downloadSpeed,
    features: features.filter(f => f.length > 0),
    color: getCategoryColor(category),
    category,
    dataAmount,
    callMinutes: raw['דקות/שיחות'] === 'לא מוגבל' ? 'ללא הגבלה' : undefined,
  };
}

// Convert all plans
const convertedPlans = rawPlans
  .map((raw, index) => convertRawPlan(raw, index))
  .filter(plan => plan !== null);

console.log(`Converted ${convertedPlans.length} plans successfully`);

// Generate TypeScript file content
const tsContent = `// Auto-generated file - converted from israeli_telecom_plans_hebrew.json
// DO NOT EDIT MANUALLY - regenerate using: node src/scripts/convert-plans.js

import type { ManualPlan } from './manual-plans';

export const convertedPlans: ManualPlan[] = ${JSON.stringify(convertedPlans, null, 2)};
`;

// Write to file
const outputPath = path.join(__dirname, '../data/converted-plans.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log(`Successfully wrote ${convertedPlans.length} plans to ${outputPath}`);
console.log('Plans by category:');
const categoryCounts = convertedPlans.reduce((acc, plan) => {
  acc[plan.category] = (acc[plan.category] || 0) + 1;
  return acc;
}, {});
console.log(categoryCounts);
