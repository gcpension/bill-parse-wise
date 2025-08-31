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
  
  try {
    // Try to load local font first
    const res = await fetch('/fonts/NotoSansHebrew-Regular.ttf');
    if (res.ok) {
      const blob = await res.blob();
      const dataUrl = await toBase64(blob);
      const base64 = dataUrl.split(',')[1] || dataUrl;
      pdf.addFileToVFS('NotoSansHebrew-Regular.ttf', base64);
      pdf.addFont('NotoSansHebrew-Regular.ttf', 'NotoSansHebrew', 'normal');
      fontRegistered = true;
      console.log('Hebrew font loaded successfully');
      return;
    }
  } catch (error) {
    console.warn('Local Hebrew font not found, using fallback');
  }
  
  // Set flag to avoid repeated attempts
  fontRegistered = true;
};

// Function to handle Hebrew text direction properly
const processHebrewText = (text: string): string => {
  // Keep the text as-is since jsPDF handles RTL with align: 'right'
  return text;
};

export const createHebrewPDF = async (title: string, content: string[]): Promise<jsPDF> => {
  const pdf = new jsPDF({ 
    orientation: 'portrait', 
    format: 'a4',
    compress: true
  });

  // Try to load Hebrew font
  await ensureHebrewFont(pdf);
  
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 25;
  const rightX = pageWidth - margin;
  const leftX = margin;
  const lineHeight = 7;
  const maxWidth = pageWidth - (2 * margin);

  // Set font - use Hebrew if available, otherwise fallback
  if (fontRegistered) {
    try {
      pdf.setFont('NotoSansHebrew', 'normal');
    } catch (error) {
      console.warn('Hebrew font not available, using Arial Unicode');
      pdf.setFont('helvetica', 'normal');
    }
  } else {
    pdf.setFont('helvetica', 'normal');
  }

  // Title with better formatting
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 139); // Dark blue color
  const titleLines = pdf.splitTextToSize(title, maxWidth);
  let titleY = 30;
  
  titleLines.forEach((line: string) => {
    pdf.text(processHebrewText(line), rightX, titleY, { 
      align: 'right'
    });
    titleY += 8;
  });
  
  // Header decoration
  pdf.setLineWidth(1.5);
  pdf.setDrawColor(0, 0, 139);
  pdf.line(leftX, titleY + 5, pageWidth - margin, titleY + 5);
  
  // Reset color for content
  pdf.setTextColor(0, 0, 0);

  // Content with improved formatting
  pdf.setFontSize(11);
  let y = titleY + 20;
  
  for (let i = 0; i < content.length; i++) {
    const line = content[i].trim();
    
    // Check if we need a new page
    if (y > pageHeight - 40) {
      pdf.addPage();
      if (fontRegistered) {
        try {
          pdf.setFont('NotoSansHebrew', 'normal');
        } catch {
          pdf.setFont('helvetica', 'normal');
        }
      }
      y = 30;
    }
    
    if (line === '') {
      y += 4; // Small space for empty lines
      continue;
    }
    
    // Check if line is a section header
    const isHeader = line.startsWith('===') && line.endsWith('===');
    const isSubHeader = line.endsWith(':') && !line.includes('✓') && !line.includes('✗');
    
    if (isHeader) {
      // Main section headers
      const headerText = line.replace(/===/g, '').trim();
      pdf.setFontSize(13);
      pdf.setTextColor(0, 0, 139);
      y += 5;
      
      pdf.text(processHebrewText(headerText), rightX, y, { 
        align: 'right' 
      });
      
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      continue;
    }
    
    if (isSubHeader) {
      // Sub headers
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      y += 3;
    } else {
      // Regular content
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
    }
    
    // Handle text wrapping for long lines
    const wrappedLines = pdf.splitTextToSize(processHebrewText(line), maxWidth - 10);
    
    wrappedLines.forEach((wrappedLine: string, index: number) => {
      if (y > pageHeight - 40) {
        pdf.addPage();
        if (fontRegistered) {
          try {
            pdf.setFont('NotoSansHebrew', 'normal');
          } catch {
            pdf.setFont('helvetica', 'normal');
          }
        }
        y = 30;
      }
      
      pdf.text(wrappedLine, rightX, y, { 
        align: 'right'
      });
      
      y += lineHeight;
    });
    
    // Extra space after headers
    if (isSubHeader) {
      y += 2;
    }
  }
  
  // Add footer with page numbers and timestamp
  const totalPages = pdf.getNumberOfPages();
  const timestamp = new Date().toLocaleDateString('he-IL') + ' ' + new Date().toLocaleTimeString('he-IL');
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(150, 150, 150);
    pdf.line(leftX, pageHeight - 25, pageWidth - margin, pageHeight - 25);
    
    // Page numbers
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`עמוד ${i} מתוך ${totalPages}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Timestamp on first page
    if (i === 1) {
      pdf.text(processHebrewText(`נוצר ב: ${timestamp}`), rightX, pageHeight - 10, { align: 'right' });
    }
  }

  return pdf;
};
