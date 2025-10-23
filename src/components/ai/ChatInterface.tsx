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

  // Quick action buttons with emojis and descriptions
  const quickActions = [
    { 
      label: 'סלולר', 
      value: 'אני מחפש מסלול סלולר', 
      emoji: '📱',
      description: 'מסלולי סלולר מתקדמים'
    },
    { 
      label: 'חשמל', 
      value: 'אני מחפש מסלול חשמל', 
      emoji: '⚡',
      description: 'חיסכון בחשבון החשמל'
    },
    { 
      label: 'אינטרנט', 
      value: 'אני מחפש מסלול אינטרנט', 
      emoji: '🌐',
      description: 'אינטרנט מהיר ויציב'
    },
    { 
      label: 'טלוויזיה', 
      value: 'אני מחפש מסלול טלוויזיה', 
      emoji: '📺',
      description: 'ערוצים ושידורים'
    },
  ];

  const handleQuickAction = (value: string) => {
    setInput(value);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50 animate-pulse" 
           style={{ animationDuration: '8s' }} 
      />
      
      <ScrollArea className="flex-1 px-4 md:px-8 py-6 relative z-10" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome banner with animation */}
          {messages.length <= 1 && (
            <div className="text-center space-y-6 animate-fade-in mb-8">
              <div className="inline-block">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl animate-scale-in">
                  <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                בואו נמצא את המסלול המושלם עבורכם
              </h2>
              <p className="text-gray-600 text-lg">
                תהליך מהיר וחכם שיחסוך לכם זמן וכסף
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 md:gap-4 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              )}
              <div
                className={`group max-w-[80%] md:max-w-[75%] rounded-3xl px-6 py-4 shadow-md hover:shadow-xl transition-all duration-300 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transform hover:scale-[1.02]'
                    : 'bg-white/90 backdrop-blur-sm border-2 border-gray-100 transform hover:scale-[1.02]'
                }`}
              >
                <p className="whitespace-pre-wrap text-base md:text-lg leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 justify-start animate-fade-in">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm border-2 border-gray-100 rounded-3xl px-6 py-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-gray-600 text-sm font-medium">AI חושב...</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Quick Actions */}
          {messages.length <= 1 && !isLoading && (
            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {quickActions.map((action, idx) => (
                <button
                  key={action.value}
                  onClick={() => handleQuickAction(action.value)}
                  className="group relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 text-center space-y-2">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{action.emoji}</div>
                    <div className="font-bold text-lg text-gray-900">{action.label}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Enhanced input area */}
      <div className="relative z-10 border-t-2 border-gray-200/50 bg-white/90 backdrop-blur-xl px-4 md:px-8 py-6 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="כתבו את תשובתכם כאן..."
                className="w-full rounded-2xl px-6 py-6 text-base md:text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all shadow-sm"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              size="lg"
              className="rounded-2xl px-8 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </Button>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 inline-flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              בינה מלאכותית מתקדמת תמצא עבורכם את המסלול האידיאלי
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
