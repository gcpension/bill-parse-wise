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
  const rightX = rightAlignX(pdf, pageWidth);

  // Title
  pdf.setFontSize(16);
  pdf.text(title, rightX, 30, { align: 'right' });

  // Content
  pdf.setFontSize(12);
  let y = 50;
  for (const line of content) {
    if (line.trim() === '') {
      y += 5;
    } else {
      pdf.text(line, rightX, y, { align: 'right' });
      y += 7;
    }
  }

  return pdf;
};
