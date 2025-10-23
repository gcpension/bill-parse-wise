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
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black px-6 py-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
              <Sparkles className="text-white text-2xl h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">עוזר AI מתקדם</h2>
              <p className="text-sm text-gray-300">טכנולוגיית בינה מלאכותית חדשנית</p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'chat' | 'voice')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 p-1 rounded-2xl">
            <TabsTrigger 
              value="chat" 
              className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg py-3"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold">צ'אט טקסט</span>
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg py-3"
            >
              <Mic className="h-5 w-5" />
              <span className="font-semibold">שיחה קולית</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="h-full m-0 mt-0">
            <div className="h-[calc(85vh-180px)] rounded-b-2xl overflow-hidden shadow-xl">
              <ChatInterface plans={plans} />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="h-full m-0 mt-0">
            <div className="h-[calc(85vh-180px)] rounded-b-2xl overflow-hidden shadow-xl">
              <VoiceInterface />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
