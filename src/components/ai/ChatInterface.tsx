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
    <div className="flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 py-8" ref={scrollRef}>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Step cards */}
          {messages.map((msg, idx) => {
            const stepNumber = Math.floor(idx / 2) + 1;
            const isQuestion = msg.role === 'assistant';
            const replies = isQuestion ? getQuickReplies(msg.content) : [];
            
            return (
              <div key={idx} className="animate-fade-in">
                {isQuestion && (
                  <div className="mb-4">
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                        {stepNumber}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent" />
                    </div>
                    
                    {/* Question card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {msg.content}
                          </h3>
                          <p className="text-sm text-gray-500">בחר את האפשרות המתאימה</p>
                        </div>
                      </div>
                      
                      {/* Options grid */}
                      {idx === messages.length - 1 && !isLoading && replies.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {replies.map((reply, replyIdx) => (
                            <button
                              key={replyIdx}
                              onClick={() => handleQuickReply(reply.text)}
                              className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 text-right hover:border-gray-900 hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900">{reply.text}</span>
                                  <span className="text-2xl">{reply.icon}</span>
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 opacity-0 group-hover:opacity-5 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* User answer */}
                {!isQuestion && (
                  <div className="flex justify-end mb-4">
                    <div className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2.5 shadow-sm">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">{msg.content}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Loading state */}
          {isLoading && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">מכין את השאלה הבאה...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completion indicator */}
          {progress === 100 && !isLoading && (
            <div className="text-center py-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-900 rounded-full px-6 py-3 border border-green-200">
                <Check className="h-5 w-5" />
                <span className="text-sm font-semibold">מעולה! מעביר אותך לתוצאות...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
