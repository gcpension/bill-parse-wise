import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Mic, MicOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchHistory } from '@/hooks/useSearchHistory';

interface SmartSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'חיפוש מסלול או חברה...',
  className,
  suggestions: externalSuggestions = [],
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const { history, addToHistory, removeFromHistory, getSuggestions, clearHistory } = useSearchHistory();

  // Check for voice support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'he-IL';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(transcript);
        addToHistory(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onChange, addToHistory]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow click
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim()) {
      addToHistory(value.trim());
      onSearch?.(value.trim());
    }
    setShowSuggestions(false);
  }, [value, addToHistory, onSearch]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    addToHistory(suggestion);
    onSearch?.(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const toggleVoice = () => {
    if (!voiceSupported || !recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Combine history suggestions with external suggestions
  const allSuggestions = value.trim() 
    ? [...new Set([...getSuggestions(value), ...externalSuggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      )])]
    : history.slice(0, 5).map(h => h.query);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className={cn(
          "relative flex items-center transition-all duration-200",
          isFocused && "ring-2 ring-primary/20 rounded-xl"
        )}>
          <div className="absolute right-3 flex items-center pointer-events-none z-10">
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
              </motion.div>
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isListening ? 'מקשיב...' : placeholder}
            className={cn(
              "pr-10 h-11 text-sm border-border bg-background",
              "focus:border-primary focus:ring-primary",
              "transition-all duration-200",
              value && "pl-20"
            )}
          />
          
          <div className="absolute left-2 flex items-center gap-1">
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {voiceSupported && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 transition-colors",
                  isListening ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={toggleVoice}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && allSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            <div className="p-2">
              {!value.trim() && history.length > 0 && (
                <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    חיפושים אחרונים
                  </span>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    נקה
                  </button>
                </div>
              )}
              
              {allSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm text-right",
                    "hover:bg-muted rounded-lg transition-colors",
                    "group"
                  )}
                >
                  {value.trim() ? (
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="flex-1">{suggestion}</span>
                  {!value.trim() && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(suggestion);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded transition-all"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearchBar;
