import jsPDF from 'jspdf';

// Function to reverse Hebrew text for proper display in jsPDF
export const reverseHebrewText = (text: string): string => {
  // Hebrew Unicode range: \u0590-\u05FF
  const hebrewRegex = /[\u0590-\u05FF]/;
  
  if (!hebrewRegex.test(text)) {
    return text; // Not Hebrew, return as is
  }
  
  // Split text into words and handle mixed content
  const words = text.split(' ');
  const reversedWords = words.map(word => {
    if (hebrewRegex.test(word)) {
      // Hebrew word - reverse it
      return word.split('').reverse().join('');
    }
    return word; // Non-Hebrew word, keep as is
  });
  
  // Reverse the word order for RTL
  return reversedWords.reverse().join(' ');
};

// Function to calculate proper positioning for RTL text
export const calculateRTLPosition = (pdf: jsPDF, text: string, pageWidth: number, rightMargin: number = 20): number => {
  const textWidth = pdf.getTextWidth(text);
  return pageWidth - rightMargin - textWidth;
};

// Enhanced PDF creation with Hebrew support
export const createHebrewPDF = (title: string, content: string[]): jsPDF => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    format: 'a4'
  });
  
  const pageWidth = pdf.internal.pageSize.width;
  const rightMargin = 20;
  
  // Set font for Hebrew
  pdf.setFont('helvetica', 'normal');
  
  // Add title
  pdf.setFontSize(16);
  const processedTitle = reverseHebrewText(title);
  const titleX = calculateRTLPosition(pdf, processedTitle, pageWidth, rightMargin);
  pdf.text(processedTitle, titleX, 30);
  
  // Add content
  pdf.setFontSize(12);
  let yPosition = 50;
  
  content.forEach(line => {
    if (line.trim() === '') {
      yPosition += 5;
    } else {
      const processedLine = reverseHebrewText(line);
      const lineX = calculateRTLPosition(pdf, processedLine, pageWidth, rightMargin);
      pdf.text(processedLine, lineX, yPosition);
      yPosition += 7;
    }
  });
  
  return pdf;
};