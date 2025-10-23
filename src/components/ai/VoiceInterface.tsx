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
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col items-center gap-4 p-6">
        <Button
          onClick={isConnected ? disconnect : connect}
          disabled={isConnecting}
          size="lg"
          className={`rounded-full h-20 w-20 ${
            isSpeaking ? 'animate-pulse bg-green-500 hover:bg-green-600' : ''
          }`}
        >
          {isConnecting ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : isConnected ? (
            <Mic className="h-8 w-8" />
          ) : (
            <MicOff className="h-8 w-8" />
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-lg font-semibold">
            {isConnecting
              ? 'מתחבר...'
              : isConnected
              ? isSpeaking
                ? 'AI מדבר...'
                : 'מקשיב...'
              : 'לחץ כדי להתחיל'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isConnected ? 'דבר בצורה טבעית ואני אעזור לך' : 'שיחה קולית עם עוזר AI חכם'}
          </p>
        </div>
      </div>

      {transcript.length > 0 && (
        <Card className="flex-1 p-4 overflow-auto">
          <h3 className="font-semibold mb-2">תמליל השיחה:</h3>
          <div className="space-y-2">
            {transcript.map((line, idx) => (
              <p key={idx} className="text-sm">
                {line}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
