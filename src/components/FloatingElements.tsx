import { 
  Zap, Wifi, Smartphone, Tv, Phone, Router, Lightbulb, Cable, 
  Plug, WifiOff, Battery, Monitor, Tablet, Headphones, Radio, 
  Satellite, Signal, Cast, Cloud, Globe, Compass, Download, 
  HardDrive, Laptop, Mic, Music, Navigation, Package, Printer, 
  Share2, Speaker, Upload, Video, Volume2, Watch, Wifi as WifiIcon,
  TrendingUp, Star, Sparkles, Target, Award, Gift, Heart, 
  Shield, Wrench, Settings, Search, Bell, BookOpen, Calendar
} from 'lucide-react';

const FloatingElements = () => {
  const floatingIcons = [
    // First layer - primary icons
    { Icon: Lightbulb, position: 'top-[8%] left-[5%]', size: 'w-8 h-8', color: 'text-purple-500', opacity: 'opacity-20', delay: '0s' },
    { Icon: Smartphone, position: 'top-[15%] right-[8%]', size: 'w-8 h-8', color: 'text-purple-600', opacity: 'opacity-20', delay: '0.5s' },
    { Icon: Wifi, position: 'top-[22%] left-[12%]', size: 'w-7 h-7', color: 'text-primary', opacity: 'opacity-20', delay: '1s' },
    { Icon: Tv, position: 'top-[30%] right-[15%]', size: 'w-7 h-7', color: 'text-purple-500', opacity: 'opacity-20', delay: '1.5s' },
    { Icon: Zap, position: 'top-[38%] left-[7%]', size: 'w-6 h-6', color: 'text-purple-600', opacity: 'opacity-18', delay: '2s' },
    
    // Second layer - medium icons
    { Icon: Phone, position: 'top-[45%] right-[10%]', size: 'w-6 h-6', color: 'text-purple-400', opacity: 'opacity-15', delay: '0.3s' },
    { Icon: Router, position: 'top-[52%] left-[18%]', size: 'w-6 h-6', color: 'text-primary', opacity: 'opacity-15', delay: '0.8s' },
    { Icon: Cable, position: 'top-[60%] right-[20%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.3s' },
    { Icon: Plug, position: 'top-[68%] left-[10%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '1.8s' },
    { Icon: Battery, position: 'top-[75%] right-[12%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '2.3s' },
    
    // Third layer - small scattered icons
    { Icon: Monitor, position: 'top-[12%] left-[25%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-15', delay: '0.6s' },
    { Icon: Tablet, position: 'top-[18%] right-[25%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '1.1s' },
    { Icon: Headphones, position: 'top-[25%] left-[30%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '1.6s' },
    { Icon: Radio, position: 'top-[33%] right-[28%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '2.1s' },
    { Icon: Satellite, position: 'top-[40%] left-[35%]', size: 'w-6 h-6', color: 'text-purple-500', opacity: 'opacity-15', delay: '0.4s' },
    
    // Fourth layer - tech icons
    { Icon: Signal, position: 'top-[48%] right-[35%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '0.9s' },
    { Icon: Cast, position: 'top-[55%] left-[40%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '1.4s' },
    { Icon: Cloud, position: 'top-[63%] right-[38%]', size: 'w-6 h-6', color: 'text-purple-600', opacity: 'opacity-15', delay: '1.9s' },
    { Icon: Globe, position: 'top-[70%] left-[42%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-12', delay: '0.2s' },
    
    // Fifth layer - more variety
    { Icon: Compass, position: 'top-[10%] left-[45%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '0.7s' },
    { Icon: Download, position: 'top-[17%] right-[42%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '1.2s' },
    { Icon: HardDrive, position: 'top-[28%] left-[48%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '1.7s' },
    { Icon: Laptop, position: 'top-[35%] right-[45%]', size: 'w-6 h-6', color: 'text-purple-500', opacity: 'opacity-15', delay: '2.2s' },
    { Icon: Mic, position: 'top-[43%] left-[52%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '0.5s' },
    
    // Sixth layer - entertainment
    { Icon: Music, position: 'top-[50%] right-[50%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '1s' },
    { Icon: Navigation, position: 'top-[58%] left-[55%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '1.5s' },
    { Icon: Package, position: 'top-[65%] right-[52%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-15', delay: '2s' },
    { Icon: Printer, position: 'top-[72%] left-[58%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '0.3s' },
    
    // Seventh layer - connectivity
    { Icon: Share2, position: 'top-[14%] left-[62%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '0.8s' },
    { Icon: Speaker, position: 'top-[21%] right-[58%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '1.3s' },
    { Icon: Upload, position: 'top-[29%] left-[65%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.8s' },
    { Icon: Video, position: 'top-[36%] right-[62%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '0.1s' },
    { Icon: Volume2, position: 'top-[44%] left-[68%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '0.6s' },
    
    // Eighth layer - devices
    { Icon: Watch, position: 'top-[51%] right-[65%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '1.1s' },
    { Icon: WifiIcon, position: 'top-[59%] left-[70%]', size: 'w-6 h-6', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.6s' },
    { Icon: WifiOff, position: 'top-[66%] right-[68%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '2.1s' },
    
    // Ninth layer - special icons
    { Icon: TrendingUp, position: 'top-[11%] left-[75%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '0.4s' },
    { Icon: Star, position: 'top-[19%] right-[72%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '0.9s' },
    { Icon: Sparkles, position: 'top-[26%] left-[78%]', size: 'w-6 h-6', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.4s' },
    { Icon: Target, position: 'top-[34%] right-[75%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '1.9s' },
    { Icon: Award, position: 'top-[41%] left-[80%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '0.2s' },
    
    // Tenth layer - more icons
    { Icon: Gift, position: 'top-[49%] right-[78%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '0.7s' },
    { Icon: Heart, position: 'top-[56%] left-[82%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.2s' },
    { Icon: Shield, position: 'top-[64%] right-[80%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '1.7s' },
    { Icon: Wrench, position: 'top-[71%] left-[85%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '0.5s' },
    
    // Additional scattered icons
    { Icon: Settings, position: 'top-[13%] left-[88%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '1s' },
    { Icon: Search, position: 'top-[20%] right-[85%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.5s' },
    { Icon: Bell, position: 'top-[27%] left-[90%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '2s' },
    { Icon: BookOpen, position: 'top-[32%] right-[88%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '0.3s' },
    { Icon: Calendar, position: 'top-[39%] left-[92%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '0.8s' },
    
    // Bottom section scattered
    { Icon: Zap, position: 'bottom-[8%] left-[8%]', size: 'w-6 h-6', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.3s' },
    { Icon: Phone, position: 'bottom-[15%] right-[10%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '1.8s' },
    { Icon: Wifi, position: 'bottom-[22%] left-[15%]', size: 'w-6 h-6', color: 'text-primary', opacity: 'opacity-15', delay: '0.1s' },
    { Icon: Router, position: 'bottom-[12%] right-[18%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '0.6s' },
    { Icon: Lightbulb, position: 'bottom-[18%] left-[22%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.1s' },
    
    // More bottom layer
    { Icon: Smartphone, position: 'bottom-[10%] left-[28%]', size: 'w-6 h-6', color: 'text-purple-400', opacity: 'opacity-15', delay: '1.6s' },
    { Icon: Tv, position: 'bottom-[16%] right-[25%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-12', delay: '0.4s' },
    { Icon: Monitor, position: 'bottom-[9%] left-[35%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-15', delay: '0.9s' },
    { Icon: Tablet, position: 'bottom-[14%] right-[32%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-12', delay: '1.4s' },
    { Icon: Cloud, position: 'bottom-[20%] left-[40%]', size: 'w-6 h-6', color: 'text-purple-400', opacity: 'opacity-15', delay: '1.9s' },
    
    // Final bottom layer
    { Icon: Globe, position: 'bottom-[11%] right-[38%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-12', delay: '0.2s' },
    { Icon: Signal, position: 'bottom-[17%] left-[45%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-15', delay: '0.7s' },
    { Icon: Cast, position: 'bottom-[13%] right-[45%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-12', delay: '1.2s' },
    { Icon: Speaker, position: 'bottom-[19%] left-[52%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-15', delay: '1.7s' },
    { Icon: Video, position: 'bottom-[10%] right-[50%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-12', delay: '0.5s' },
    
    // More bottom variety
    { Icon: Music, position: 'bottom-[15%] left-[58%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-15', delay: '1s' },
    { Icon: Laptop, position: 'bottom-[21%] right-[55%]', size: 'w-6 h-6', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.5s' },
    { Icon: Watch, position: 'bottom-[12%] left-[65%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '2s' },
    { Icon: Star, position: 'bottom-[18%] right-[62%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '0.3s' },
    { Icon: TrendingUp, position: 'bottom-[9%] left-[72%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '0.8s' },
    
    // Last bottom section
    { Icon: Sparkles, position: 'bottom-[14%] right-[68%]', size: 'w-6 h-6', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.3s' },
    { Icon: Heart, position: 'bottom-[20%] left-[78%]', size: 'w-5 h-5', color: 'text-purple-400', opacity: 'opacity-12', delay: '1.8s' },
    { Icon: Shield, position: 'bottom-[11%] right-[75%]', size: 'w-5 h-5', color: 'text-primary', opacity: 'opacity-15', delay: '0.1s' },
    { Icon: Award, position: 'bottom-[16%] left-[85%]', size: 'w-5 h-5', color: 'text-purple-600', opacity: 'opacity-12', delay: '0.6s' },
    { Icon: Gift, position: 'bottom-[8%] right-[82%]', size: 'w-5 h-5', color: 'text-purple-500', opacity: 'opacity-15', delay: '1.1s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {floatingIcons.map((item, index) => {
        const { Icon, position, size, color, opacity, delay } = item;
        return (
          <Icon
            key={index}
            className={`absolute ${position} ${size} ${color} ${opacity} animate-pulse`}
            style={{
              animationDelay: delay,
              animationDuration: '4s',
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingElements;
