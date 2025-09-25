import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import BackToTop from '@/components/BackToTop';

// Import new modular components
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySelector } from '@/components/home/CategorySelector';
import { ProcessSteps } from '@/components/home/ProcessSteps';
import { BackgroundDecorations } from '@/components/home/BackgroundDecorations';
import { CTASection } from '@/components/home/CTASection';

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, { provider: string; amount: string; selected: boolean }>>({
    electricity: { provider: '', amount: '', selected: false },
    cellular: { provider: '', amount: '', selected: false },
    internet: { provider: '', amount: '', selected: false },
    tv: { provider: '', amount: '', selected: false }
  });
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: { ...prev[category], selected: !prev[category].selected }
    }));
  };

  const handleProviderChange = (category: string, provider: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: { ...prev[category], provider }
    }));
  };

  const handleAmountChange = (category: string, amount: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: { ...prev[category], amount }
    }));
  };

  const handleStartAnalysis = () => {
    const selectedData = Object.entries(selectedCategories)
      .filter(([_, data]) => data.selected && data.provider && data.amount)
      .map(([category, data]) => ({ category, ...data }));

    if (selectedData.length === 0) {
      enhancedToast.warning({
        title: 'בחרו קטגוריה',
        description: 'יש לבחור לפחות קטגוריה אחת עם פרטי ספק וסכום'
      });
      return;
    }

    // Store analysis data for the AllPlans page
    localStorage.setItem('analysisData', JSON.stringify(selectedData));
    
    // Store selected categories for filtering
    const categories = selectedData.map(item => item.category);
    localStorage.setItem('selectedCategories', JSON.stringify(categories));
    
    navigate('/all-plans');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-purple-600 font-heebo">
                EasySwitch
              </h1>
            </div>
            
            {/* Navigation Links on the right */}
            <div className="flex items-center space-x-8">
              <a href="/" className="text-purple-600 font-medium hover:text-purple-700 transition-colors font-heebo">
                דף הבית
              </a>
              <a href="/magazine" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">
                מגזין
              </a>
              <a href="/tips" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">
                טיפים
              </a>
              <a href="/about" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">
                אודות
              </a>
              <a href="/contact" className="text-gray-600 font-medium hover:text-purple-600 transition-colors font-heebo">
                צור קשר
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Background decorative elements */}
      <BackgroundDecorations />

      {/* Hero Section */}
      <HeroSection />

      {/* Category Selection Section */}
      <CategorySelector 
        selectedCategories={selectedCategories}
        onCategorySelect={handleCategorySelect}
        onProviderChange={handleProviderChange}
        onAmountChange={handleAmountChange}
      />

      {/* Process Steps Section */}
      <ProcessSteps />

      {/* CTA Section - only show if categories are selected */}
      <CTASection 
        selectedCategories={selectedCategories}
        onStartAnalysis={handleStartAnalysis}
      />

      {/* Back to top component */}
      <BackToTop />
    </div>
  );
};

export default Home;