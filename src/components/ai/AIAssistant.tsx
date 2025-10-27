import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic, X, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInterface } from './ChatInterface';
import { VoiceInterface } from './VoiceInterface';
import { PlanRecord } from '@/hooks/useAllPlans';

interface AIAssistantProps {
  plans: PlanRecord[];
}

export const AIAssistant = ({ plans }: AIAssistantProps) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');

  return (
    <div className="flex flex-col h-full glass-card rounded-[2.5rem] overflow-hidden shadow-elegant border-2 border-primary/30">
      {/* Ultra Modern Header */}
      <div className="relative bg-gradient-to-br from-primary via-primary-glow to-accent px-10 py-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-[2rem] blur-xl"></div>
              <div className="relative w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border-2 border-white/40 shadow-glow">
                <Sparkles className="text-white h-10 w-10 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">עוזר חכם AI</h2>
              <div className="flex items-center gap-3 text-white/95 text-base">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-glow"></div>
                <span className="font-semibold">מוכן לעזור לך למצוא את העסקה הטובה ביותר</span>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'chat' | 'voice')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-xl p-3 rounded-3xl border-2 border-white/25 shadow-elegant">
              <TabsTrigger 
                value="chat" 
                className="gap-3 rounded-2xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-glow data-[state=inactive]:text-white/90 py-4 transition-all font-bold text-base"
              >
                <MessageSquare className="h-5 w-5" />
                <span>צ׳אט</span>
              </TabsTrigger>
              <TabsTrigger 
                value="voice" 
                className="gap-3 rounded-2xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-glow data-[state=inactive]:text-white/90 py-4 transition-all font-bold text-base"
              >
                <Mic className="h-5 w-5" />
                <span>קול</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="h-full m-0 mt-0">
              <div className="h-[calc(90vh-200px)] overflow-hidden">
                <ChatInterface plans={plans} />
              </div>
            </TabsContent>

            <TabsContent value="voice" className="h-full m-0 mt-0">
              <div className="h-[calc(90vh-200px)] overflow-hidden">
                <VoiceInterface />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
