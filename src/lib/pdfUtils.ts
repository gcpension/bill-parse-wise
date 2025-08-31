import jsPDF from 'jspdf';

let fontRegistered = false;

const toBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const ensureHebrewFont = async (pdf: jsPDF) => {
  if (fontRegistered) return;
  const res = await fetch('/fonts/NotoSansHebrew-Regular.ttf');
  const blob = await res.blob();
  const dataUrl = await toBase64(blob);
  const base64 = dataUrl.split(',')[1] || dataUrl; // strip prefix
  pdf.addFileToVFS('NotoSansHebrew-Regular.ttf', base64);
  pdf.addFont('NotoSansHebrew-Regular.ttf', 'NotoSansHebrew', 'normal');
  fontRegistered = true;
};

// Calculate X position for right-aligned text
const rightAlignX = (pdf: jsPDF, pageWidth: number, rightMargin: number = 20) => pageWidth - rightMargin;

export const createHebrewPDF = async (title: string, content: string[]): Promise<jsPDF> => {
  const pdf = new jsPDF({ orientation: 'portrait', format: 'a4' });

  try {
    await ensureHebrewFont(pdf);
    pdf.setFont('NotoSansHebrew', 'normal');
  } catch (error) {
    console.warn('Failed to load Hebrew font, using default font:', error);
    // Fallback to default font if Hebrew font fails
    pdf.setFont('helvetica', 'normal');
  }

  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const rightX = pageWidth - margin;
  const leftX = margin;
  const lineHeight = 7;
  const maxWidth = pageWidth - (2 * margin);

  // Title
  pdf.setFontSize(18);
  pdf.text(title, rightX, 30, { align: 'right', maxWidth: maxWidth });
  
  // Separator
  pdf.setLineWidth(0.5);
  pdf.line(leftX, 40, pageWidth - margin, 40);

  // Content
  pdf.setFont('NotoSansHebrew', 'normal');
  pdf.setFontSize(12);
  let y = 55;

  for (const line of content) {
    // New page if needed
    if (y > pageHeight - 30) {
      pdf.addPage();
      y = 30;
    }

    if (line.trim() === '') {
      y += lineHeight * 0.7;
      continue;
    }

    // Simple word-wrapping for RTL text
    const words = line.split(' ');
    let currentLine = '';
    const lines: string[] = [];

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = pdf.getTextWidth(testLine);

      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) lines.push(currentLine);

    for (const splitLine of lines) {
      if (y > pageHeight - 30) {
        pdf.addPage();
        y = 30;
      }
      pdf.text(splitLine, rightX, y, { align: 'right', maxWidth });
      y += lineHeight;
    }
  }

  return pdf;
};
