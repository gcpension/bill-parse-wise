import { 
  Lightbulb, 
  Smartphone, 
  Wifi, 
  Tv, 
  Phone, 
  Router, 
  Cable, 
  Plug, 
  WifiOff, 
  Battery, 
  Monitor, 
  Tablet, 
  Headphones, 
  Radio, 
  Satellite, 
  Zap 
} from 'lucide-react';

export const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Subtle background icons scattered across the page */}
      <Lightbulb className="absolute top-[15%] left-[8%] w-8 h-8 text-purple-500 opacity-20 animate-pulse" style={{ animationDelay: '0s', animationDuration: '8s' }} />
      <Smartphone className="absolute top-[25%] right-[12%] w-8 h-8 text-purple-600 opacity-20 animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />
      <Wifi className="absolute top-[45%] left-[15%] w-7 h-7 text-royal-purple opacity-20 animate-pulse" style={{ animationDelay: '4s', animationDuration: '8s' }} />
      <Tv className="absolute bottom-[35%] right-[7%] w-7 h-7 text-purple-500 opacity-20 animate-pulse" style={{ animationDelay: '6s', animationDuration: '8s' }} />
      
      {/* Additional scattered elements */}
      <Phone className="absolute top-[60%] left-[5%] w-6 h-6 text-purple-400 opacity-15 animate-pulse" style={{ animationDelay: '1s', animationDuration: '10s' }} />
      <Router className="absolute top-[35%] right-[20%] w-6 h-6 text-purple-600 opacity-15 animate-pulse" style={{ animationDelay: '3s', animationDuration: '9s' }} />
      <Cable className="absolute bottom-[60%] left-[25%] w-5 h-5 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '5s', animationDuration: '12s' }} />
      <Plug className="absolute top-[80%] right-[8%] w-5 h-5 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '7s', animationDuration: '11s' }} />
      <WifiOff className="absolute bottom-[45%] right-[30%] w-5 h-5 text-purple-400 opacity-12 animate-pulse" style={{ animationDelay: '4.5s', animationDuration: '13s' }} />
      <Battery className="absolute top-[70%] left-[35%] w-5 h-5 text-purple-500 opacity-12 animate-pulse" style={{ animationDelay: '6.5s', animationDuration: '14s' }} />
      <Monitor className="absolute bottom-[25%] left-[40%] w-6 h-6 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '8s', animationDuration: '10s' }} />
      <Tablet className="absolute top-[50%] right-[40%] w-5 h-5 text-purple-400 opacity-12 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '15s' }} />
      <Headphones className="absolute bottom-[70%] right-[15%] w-5 h-5 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '9s', animationDuration: '12s' }} />
      <Radio className="absolute top-[85%] left-[20%] w-5 h-5 text-purple-400 opacity-12 animate-pulse" style={{ animationDelay: '3.5s', animationDuration: '11s' }} />
      <Satellite className="absolute bottom-[15%] right-[35%] w-6 h-6 text-purple-600 opacity-15 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '13s' }} />
      
      {/* Additional elements for better distribution */}
      <Zap className="absolute top-[30%] left-[30%] w-6 h-6 text-purple-500 opacity-15 animate-pulse" style={{ animationDelay: '10s', animationDuration: '9s' }} />
      <Phone className="absolute bottom-[50%] left-[60%] w-5 h-5 text-purple-400 opacity-12 animate-pulse" style={{ animationDelay: '11s', animationDuration: '14s' }} />
      <Lightbulb className="absolute top-[65%] right-[25%] w-5 h-5 text-gray-500 opacity-15 animate-pulse" style={{ animationDelay: '12s', animationDuration: '10s' }} />
      <Wifi className="absolute bottom-[80%] left-[50%] w-6 h-6 text-purple-600 opacity-15 animate-pulse" style={{ animationDelay: '13s', animationDuration: '11s' }} />
    </div>
  );
};