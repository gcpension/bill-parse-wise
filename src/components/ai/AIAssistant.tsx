import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic, X } from 'lucide-react';
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
      <div className="bg-gray-900 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-900 text-sm font-bold">AI</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">עוזר חכם</h2>
              <p className="text-sm text-gray-400">מצא את המסלולים הטובים ביותר</p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'chat' | 'voice')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
            <TabsTrigger 
              value="chat" 
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <MessageSquare className="h-4 w-4" />
              צ'אט
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <Mic className="h-4 w-4" />
              שיחה קולית
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="h-full m-0 mt-4">
            <div className="h-[calc(80vh-200px)]">
              <ChatInterface plans={plans} />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="h-full m-0 mt-4">
            <div className="h-[calc(80vh-200px)] bg-gray-50 rounded-lg">
              <VoiceInterface />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
