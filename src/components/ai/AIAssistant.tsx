import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic, Bot, X } from 'lucide-react';
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
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Bot className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">עוזר AI חכם</h2>
            <p className="text-white/90">מצא את המסלולים הטובים ביותר</p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'chat' | 'voice')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <MessageSquare className="h-4 w-4" />
              צ'אט
            </TabsTrigger>
            <TabsTrigger value="voice" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <Mic className="h-4 w-4" />
              שיחה קולית
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <ChatInterface plans={plans} />
        ) : (
          <div className="h-full p-6">
            <VoiceInterface />
          </div>
        )}
      </div>
    </div>
  );
};
