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
    <div className="flex flex-col h-full glass-card rounded-3xl overflow-hidden shadow-elegant border border-primary/20">
      {/* Modern Header */}
      <div className="relative bg-gradient-to-br from-primary via-primary-glow to-accent px-8 py-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-glow">
              <Sparkles className="text-white h-7 w-7 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">עוזר חכם</h2>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>מוכן לעזור לך לחסוך</span>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'chat' | 'voice')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-glow">
              <TabsTrigger 
                value="chat" 
                className="gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=inactive]:text-white py-3 transition-all font-medium"
              >
                <MessageSquare className="h-4 w-4" />
                <span>צ׳אט</span>
              </TabsTrigger>
              <TabsTrigger 
                value="voice" 
                className="gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=inactive]:text-white py-3 transition-all font-medium"
              >
                <Mic className="h-4 w-4" />
                <span>קול</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="h-full m-0 mt-0">
              <div className="h-[calc(85vh-160px)] overflow-hidden">
                <ChatInterface plans={plans} />
              </div>
            </TabsContent>

            <TabsContent value="voice" className="h-full m-0 mt-0">
              <div className="h-[calc(85vh-160px)] overflow-hidden">
                <VoiceInterface />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
