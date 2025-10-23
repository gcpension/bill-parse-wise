import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/RealtimeAudio';
import { Card } from '@/components/ui/card';

export const VoiceInterface = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });

      // Connect to voice assistant edge function
      const wsUrl = `wss://qrdczgenetblylaoiupz.supabase.co/functions/v1/voice-assistant`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = async () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);

        // Start recording audio
        recorderRef.current = new AudioRecorder((audioData) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const encoded = encodeAudioForAPI(audioData);
            wsRef.current.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: encoded
            }));
          }
        });

        await recorderRef.current.start();

        toast({
          title: 'מחובר',
          description: 'אתה יכול להתחיל לדבר עכשיו',
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received event:', data.type);

          if (data.type === 'response.audio.delta') {
            setIsSpeaking(true);
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            if (audioContextRef.current) {
              await playAudioData(audioContextRef.current, bytes);
            }
          } else if (data.type === 'response.audio.done') {
            setIsSpeaking(false);
          } else if (data.type === 'conversation.item.input_audio_transcription.completed') {
            setTranscript(prev => [...prev, `אתה: ${data.transcript}`]);
          } else if (data.type === 'response.audio_transcript.delta') {
            setTranscript(prev => {
              const newTranscript = [...prev];
              const lastIndex = newTranscript.length - 1;
              if (lastIndex >= 0 && newTranscript[lastIndex].startsWith('AI: ')) {
                newTranscript[lastIndex] += data.delta;
              } else {
                newTranscript.push(`AI: ${data.delta}`);
              }
              return newTranscript;
            });
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: 'שגיאה',
          description: 'אירעה שגיאה בחיבור',
          variant: 'destructive',
        });
        disconnect();
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        disconnect();
      };

    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: 'שגיאה',
        description: error instanceof Error ? error.message : 'שגיאה בחיבור',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    recorderRef.current?.stop();
    wsRef.current?.close();
    audioContextRef.current?.close();
    
    recorderRef.current = null;
    wsRef.current = null;
    audioContextRef.current = null;
    
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-8 p-8">
        {/* Welcome message */}
        {!isConnected && !isConnecting && (
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              שיחה קולית עם AI
            </h2>
            <p className="text-xl text-blue-200">
              דבר באופן טבעי ואני אעזור לך למצוא את המסלול המושלם
            </p>
          </div>
        )}

        {/* Main microphone button with animations */}
        <div className="relative">
          {/* Ripple effect when speaking */}
          {isSpeaking && (
            <>
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-50" style={{ animationDuration: '1.5s' }}></div>
            </>
          )}
          
          {/* Pulse effect when listening */}
          {isConnected && !isSpeaking && (
            <>
              <div className="absolute -inset-4 rounded-full bg-blue-400 animate-pulse opacity-20"></div>
              <div className="absolute -inset-8 rounded-full bg-blue-400 animate-pulse opacity-10" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}

          <Button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            size="lg"
            className={`relative z-10 rounded-full h-32 w-32 md:h-40 md:w-40 shadow-2xl transition-all duration-300 transform hover:scale-110 ${
              isSpeaking 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                : isConnected
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                : 'bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900'
            }`}
          >
            {isConnecting ? (
              <Loader2 className="h-16 w-16 md:h-20 md:w-20 animate-spin text-white" />
            ) : isConnected ? (
              <Mic className={`h-16 w-16 md:h-20 md:w-20 text-white ${isSpeaking ? 'animate-pulse' : ''}`} />
            ) : (
              <MicOff className="h-16 w-16 md:h-20 md:w-20 text-white" />
            )}
          </Button>
        </div>
        
        {/* Status text */}
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-2xl md:text-3xl font-bold text-white">
            {isConnecting
              ? 'מתחבר לשירות...'
              : isConnected
              ? isSpeaking
                ? '🎙️ AI מדבר אליך'
                : '👂 מקשיב לך בקשב רב'
              : 'לחץ להתחלת שיחה'}
          </p>
          <p className="text-lg text-blue-200">
            {isConnected 
              ? 'דבר בצורה טבעית, אני כאן לעזור' 
              : 'תחילת שיחה אורכת מספר שניות'
            }
          </p>
        </div>

        {/* Connection indicator dots */}
        {isConnected && (
          <div className="flex gap-2 animate-fade-in">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {/* Transcript section */}
      {transcript.length > 0 && (
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border-t border-white/20 p-6 max-h-64 overflow-auto">
          <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
            <Mic className="h-5 w-5" />
            תמליל השיחה
          </h3>
          <div className="space-y-3">
            {transcript.map((line, idx) => (
              <div 
                key={idx} 
                className={`animate-fade-in p-3 rounded-xl ${
                  line.startsWith('אתה:') 
                    ? 'bg-blue-500/20 text-blue-100 mr-8' 
                    : 'bg-purple-500/20 text-purple-100 ml-8'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <p className="text-sm md:text-base leading-relaxed">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
