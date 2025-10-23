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
      content: 'איזה שירות מעניין אותך?' 
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

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = { role: 'user', content };
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

  const getQuickReplies = (lastMessage: string): string[] => {
    if (lastMessage.includes('שירות מעניין')) {
      return ['חשמל ⚡', 'סלולר 📱', 'אינטרנט 🌐', 'טלוויזיה 📺'];
    }
    if (lastMessage.includes('תקציב') || lastMessage.includes('משלם')) {
      return ['עד 100₪', '100-200₪', '200-300₪', 'מעל 300₪'];
    }
    if (lastMessage.includes('העדפ') || lastMessage.includes('חשוב')) {
      return ['מחיר נמוך', 'מהירות גבוהה', 'שירות איכותי', 'המלצות'];
    }
    return [];
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50 animate-pulse" 
           style={{ animationDuration: '8s' }} 
      />
      
      <ScrollArea className="flex-1 px-4 md:px-8 py-6 relative z-10" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-gray-900 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              {/* Quick reply buttons */}
              {msg.role === 'assistant' && idx === messages.length - 1 && !isLoading && (
                <div className={`mt-3 flex flex-wrap gap-2 ${msg.role === 'assistant' ? 'mr-10' : 'ml-10'}`}>
                  {getQuickReplies(msg.content).map((reply, replyIdx) => (
                    <button
                      key={replyIdx}
                      onClick={() => handleQuickReply(reply)}
                      className="px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-900 hover:text-white transition-all"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-gray-600 text-xs">מנתח...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Bottom info */}
      <div className="relative z-10 border-t border-gray-200 bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-gray-500">
            בחר באחת האפשרויות למעלה כדי להמשיך
          </p>
        </div>
      </div>
    </div>
  );
};
