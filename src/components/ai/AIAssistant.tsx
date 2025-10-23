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
    <div className="flex flex-col h-full bg-white">
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">עוזר AI</h2>
              <p className="text-xs text-gray-400">מוכן לעזור</p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'chat' | 'voice')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 p-1 rounded-xl">
            <TabsTrigger 
              value="chat" 
              className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 py-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium text-sm">צ'אט</span>
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 py-2"
            >
              <Mic className="h-4 w-4" />
              <span className="font-medium text-sm">קול</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="h-full m-0 mt-0">
            <div className="h-[calc(80vh-140px)] overflow-hidden">
              <ChatInterface plans={plans} />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="h-full m-0 mt-0">
            <div className="h-[calc(80vh-140px)] overflow-hidden">
              <VoiceInterface />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
