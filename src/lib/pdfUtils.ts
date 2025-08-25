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

  await ensureHebrewFont(pdf);
  pdf.setFont('NotoSansHebrew', 'normal');

  // Enable RTL rendering if supported by jsPDF, fallback to manual reverse
  const setR2L = (pdf as any).setR2L as ((enable: boolean) => void) | undefined;
  const supportsR2L = typeof setR2L === 'function';
  if (supportsR2L) {
    setR2L(true);
  }

  const pageWidth = pdf.internal.pageSize.width;
  const rightX = rightAlignX(pdf, pageWidth);

  // Title
  pdf.setFontSize(16);
  const titleText = supportsR2L ? title : title.split('').reverse().join('');
  pdf.text(titleText, rightX, 30, { align: 'right' });

  // Content
  pdf.setFontSize(12);
  let y = 50;
  for (const line of content) {
    if (line.trim() === '') {
      y += 5;
    } else {
      const lineText = supportsR2L ? line : line.split('').reverse().join('');
      pdf.text(lineText, rightX, y, { align: 'right' });
      y += 7;
    }
  }

  return pdf;
};
