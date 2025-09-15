import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { removeBackground, loadImage } from '@/utils/backgroundRemover';
import middleSectionIllustrationOriginal from '@/assets/original-middle-illustration.png';

const BackgroundRemovalDemo = () => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async () => {
    setIsProcessing(true);
    try {
      // Load the original image
      const response = await fetch(middleSectionIllustrationOriginal);
      const blob = await response.blob();
      const imageElement = await loadImage(blob);
      
      // Remove background
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for the processed image
      const url = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(url);
      
      // Save the processed image (this would be used to replace the original)
      console.log('Background removed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Auto-process on mount for demo
    processImage();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Background Removal Demo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Original</h3>
          <img 
            src={middleSectionIllustrationOriginal} 
            alt="Original illustration" 
            className="max-w-full h-auto border rounded-lg bg-gray-100"
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Background Removed</h3>
          {isProcessing ? (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Processing...</p>
              </div>
            </div>
          ) : processedImageUrl ? (
            <div className="bg-gradient-to-br from-gray-50 to-white border rounded-lg p-4">
              <img 
                src={processedImageUrl} 
                alt="Processed illustration" 
                className="max-w-full h-auto"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-gray-50">
              <Button onClick={processImage} disabled={isProcessing}>
                Process Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemovalDemo;