import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, ArrowRight, Check } from 'lucide-react';
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

  const getQuickReplies = (lastMessage: string): { text: string; icon: string }[] => {
    if (lastMessage.includes('שירות מעניין')) {
      return [
        { text: 'חשמל', icon: '⚡' },
        { text: 'סלולר', icon: '📱' },
        { text: 'אינטרנט', icon: '🌐' },
        { text: 'טלוויזיה', icon: '📺' }
      ];
    }
    if (lastMessage.includes('תקציב') || lastMessage.includes('משלם')) {
      return [
        { text: 'עד 100₪', icon: '💰' },
        { text: '100-200₪', icon: '💵' },
        { text: '200-300₪', icon: '💸' },
        { text: 'מעל 300₪', icon: '🏦' }
      ];
    }
    if (lastMessage.includes('העדפ') || lastMessage.includes('חשוב')) {
      return [
        { text: 'מחיר נמוך', icon: '🎯' },
        { text: 'מהירות גבוהה', icon: '⚡' },
        { text: 'שירות איכותי', icon: '⭐' },
        { text: 'המלצות', icon: '👍' }
      ];
    }
    return [];
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const currentStep = messages.length;
  const totalSteps = 3;
  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex-1 overflow-y-auto px-8 py-8" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress Bar */}
          <div className="glass-card rounded-2xl p-6 border border-primary/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-foreground">שלב {currentStep} מתוך {totalSteps}</span>
              <span className="text-sm font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-primary shadow-glow transition-all duration-700 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          {messages.map((msg, idx) => {
            const isQuestion = msg.role === 'assistant';
            const replies = isQuestion ? getQuickReplies(msg.content) : [];
            
            return (
              <div key={idx} className="animate-fade-in">
                {isQuestion ? (
                  <div className="glass-card p-8 border-primary/10 hover:shadow-glow transition-all duration-500 group">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-6 w-6 text-white animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-medium text-foreground leading-relaxed">{msg.content}</div>
                      </div>
                    </div>
                    
                    {idx === messages.length - 1 && !isLoading && replies.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {replies.map((reply, i) => (
                          <button key={i} onClick={() => handleQuickReply(reply.text)}
                            className="group relative p-6 rounded-2xl border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-background to-primary/5 hover:to-primary/10 transition-all duration-300 hover:shadow-colorful hover:-translate-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{reply.icon}</span>
                              <span className="text-base font-semibold text-foreground flex-1 text-right">{reply.text}</span>
                              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-primary text-white rounded-2xl shadow-glow hover:scale-105 transition-transform">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">{msg.content}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-center animate-fade-in">
              <div className="glass-card px-8 py-5 border-primary/20 inline-flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-gradient-primary rounded-full animate-bounce shadow-glow"></div>
                  <div className="w-3 h-3 bg-gradient-primary rounded-full animate-bounce shadow-glow" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-3 h-3 bg-gradient-primary rounded-full animate-bounce shadow-glow" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-base font-medium bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">מנתח...</span>
              </div>
            </div>
          )}

          {progress === 100 && !isLoading && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-3 glass-card px-8 py-4 border-success/20">
                <Check className="h-6 w-6 text-success" />
                <span className="text-base font-semibold text-foreground">מעולה! מעביר אותך לתוצאות...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
