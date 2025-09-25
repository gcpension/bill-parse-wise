import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import heroBackgroundIllustration from '@/assets/hero-background-illustration.png';

export const HeroSection = () => {
  const { isVisible, elementRef } = useScrollAnimation();

  return (
    <section className="bg-gray-50 py-16 lg:py-24 relative overflow-hidden">
      {/* Background illustration */}
      <div className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: `url(${heroBackgroundIllustration})` }}>
      </div>
      <div 
        ref={elementRef}
        className={`container mx-auto px-4 lg:px-6 max-w-6xl relative z-10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center">
          {/* Clean subtitle */}
          <p className="text-lg text-purple-600 mb-8 font-assistant">
            המשפחה הממוצעת חוסכת ₪2,400 בשנה עם השירות שלנו
          </p>
          
          {/* Clean main title */}
          <h1 className="text-4xl lg:text-6xl font-heebo font-light text-royal-purple mb-4 leading-tight">
            חסכו בחשבונות הבית
            <br />
            <span className="font-medium text-purple-700">בקלות ובמהירות</span>
          </h1>
          
          <p className="text-xl text-purple-600 mt-6 font-assistant max-w-3xl mx-auto">
            אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
          </p>
        </div>
      </div>
    </section>
  );
};