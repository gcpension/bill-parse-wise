const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
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
    return res.json({ ok: true, data: { lines: parsed } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'OCR failed' });
  }
});

app.get('/api/cost-categories', (req, res) => {
  // TODO: Replace with DB queries; returns empty for now
  return res.json({ ok: true, data: [] });
});

app.get('/api/recommendations', (req, res) => {
  // TODO: compute recommendations based on parsed data; returns empty for now
  return res.json({ ok: true, data: [] });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
