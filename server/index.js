const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
const expenses = [];

app.use(express.json());

// Utility to parse lines into category and amount
function parseLines(lines) {
  const categoryRules = {
    electricity: ['חשמל', 'חברת החשמל'],
    internet: ['אינטרנט', 'גלישה', 'ספק'],
    cellular: ['סלולר', 'חבילה', 'דקות', 'GB'],
    water: ['מים', 'תאגיד'],
    gas: ['גז', 'גז טבעי'],
    tv: ['טלוויזיה', 'HOT', 'YES', 'STING'],
  };
  const amountRegex = /(?:₪|\b)\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{1,2})?)/g;
  const parsed = [];
  lines.forEach((line) => {
    const lower = line.toLowerCase();
    let category = null;
    for (const [key, keywords] of Object.entries(categoryRules)) {
      if (keywords.some((k) => lower.includes(k.toLowerCase()))) {
        category = key;
        break;
      }
    }
    let match;
    while ((match = amountRegex.exec(line))) {
      const raw = match[1];
      const normalized = raw
        .replace(/[^\d.,]/g, '')
        .replace(/(\d)[.,](?=\d{3}\b)/g, '$1')
        .replace(',', '.');
      const amount = parseFloat(normalized);
      if (!isNaN(amount)) {
        parsed.push({ rawLine: line, category, amount });
      }
    }
  });
  return parsed;
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No file provided' });
  }
  try {
    const imagePath = req.file.path;
    const { data: { text } } = await Tesseract.recognize(imagePath, 'heb+eng', { logger: () => {} });
    fs.unlinkSync(imagePath);
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed = parseLines(lines);
        expenses.push(...parsed);
    
    return res.json({ ok: true, data: { lines: parsed } });
  } catch (err) {
    
    console.error(err);
        
    return res.status(500).json({ ok: false, error: 'OCR failed' });
  }
});

app.get('/api/cost-categories', (req, res) => {
  
    // Summarize expenses by category
  const summary = {};
  for (const exp of expenses) {
    const cat = exp.category || 'other';
    summary[cat] = (summary[cat] || 0) + (exp.amount || 0);
  }
  const result = Object.entries(summary).map(([category, total]) => ({ category, total }));
  return res.json({ ok: true, data: result });
  
  
});

app.get('/api/recommendations', (req, res) => {
  const summaryRec = {};
  for (const exp of expenses) {
    const cat = exp.category || 'other';
    summaryRec[cat] = (summaryRec[cat] || 0) + (exp.amount || 0);
  }
  const recommendations = Object.entries(summaryRec).map(([category, total]) => {
    const monthlySavings = Number((total * 0.1).toFixed(2));
    const annualSavings = Number((monthlySavings * 12).toFixed(2));
    const title = `Save on ${category}`;
    const description = 'Based on your spending, you could save about 10% by switching providers or reducing usage.';
    return { category, title, description, monthlySavings, annualSavings };
  });
  return res.json({ ok: true, data: recommendations });
});
});
  
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
