import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { PlanRecord } from '@/hooks/useAllPlans';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  plans: PlanRecord[];
}

export const ChatInterface = ({ plans }: ChatInterfaceProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '👋 היי! בואו נמצא לכם את המסלול המושלם במהירות.\n\nאיזה שירות מעניין אתכם?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationData, setConversationData] = useState<{
    service?: string;
    budget?: number;
    currentProvider?: string;
  }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          conversationData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'שגיאה בחיבור לשרת');
      }

      if (!response.body) {
        throw new Error('שגיאה בחיבור לשרת');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let textBuffer = '';
      let streamDone = false;

      // Add empty assistant message that we'll update
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantMessage
                };
                return newMessages;
              });
              
              // Check if we should navigate to plans
              if (assistantMessage.includes('[NAVIGATE_TO_PLANS]')) {
                const cleanMessage = assistantMessage.replace('[NAVIGATE_TO_PLANS]', '').trim();
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: cleanMessage
                  };
                  return newMessages;
                });
                
                // Navigate after a short delay
                setTimeout(() => {
                  localStorage.setItem('chatFilters', JSON.stringify(conversationData));
                  navigate('/plans');
                }, 1500);
              }
            }
          } catch (e) {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה בתקשורת. אנא נסה שוב.',
        variant: 'destructive',
      });
      // Remove the empty assistant message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: '📱 סלולר', value: 'סלולר' },
    { label: '💡 חשמל', value: 'חשמל' },
    { label: '🌐 אינטרנט', value: 'אינטרנט' },
    { label: '📺 טלוויזיה', value: 'טלוויזיה' },
  ];

  const handleQuickAction = (value: string) => {
    setInput(value);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      <ScrollArea className="flex-1 px-6 py-8" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap text-base leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-gray-700" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-gray-500 text-sm">מחשב תשובה...</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions - Show only if no messages yet or first message */}
          {messages.length <= 1 && !isLoading && (
            <div className="flex flex-wrap gap-2 justify-center mt-6 animate-fade-in">
              {quickActions.map((action) => (
                <Button
                  key={action.value}
                  variant="outline"
                  onClick={() => handleQuickAction(action.value)}
                  className="rounded-full hover:bg-gray-100 transition-all hover:scale-105"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t bg-white px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="כתבו את התשובה שלכם..."
              className="flex-1 rounded-full px-5 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              size="lg"
              className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            המערכת תנתח את צרכיכם ותציג את המסלולים המתאימים ביותר
          </p>
        </div>
      </div>
    </div>
  );
};
