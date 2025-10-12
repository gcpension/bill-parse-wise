import { Brain, FileCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
const SimpleStepsBanner = () => {
  const {
    isVisible,
    elementRef
  } = useScrollAnimation(0.2);
  return <div ref={elementRef} className={`max-w-xl mx-auto mb-10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
    </div>;
};
export default SimpleStepsBanner;