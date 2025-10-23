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
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Sparkles className="text-white h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">אשף חכם</h2>
              <p className="text-sm text-gray-300">נמצא את התוכנית המושלמת עבורך</p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'chat' | 'voice')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm p-1.5 rounded-xl border border-white/20">
            <TabsTrigger 
              value="chat" 
              className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-white py-2.5 transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="font-semibold text-sm">שאלות ותשובות</span>
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-white py-2.5 transition-all"
            >
              <Mic className="h-4 w-4" />
              <span className="font-semibold text-sm">דיבור חופשי</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="h-full m-0 mt-0">
            <div className="h-[calc(75vh-140px)] overflow-hidden">
              <ChatInterface plans={plans} />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="h-full m-0 mt-0">
            <div className="h-[calc(75vh-140px)] overflow-hidden">
              <VoiceInterface />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
