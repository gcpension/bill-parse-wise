import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    console.log('WebSocket connection established');
    
    // Connect to OpenAI Realtime API
    const openAISocket = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1',
        },
      }
    );

    let sessionConfigured = false;

    openAISocket.onopen = () => {
      console.log('Connected to OpenAI Realtime API');
    };

    openAISocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('OpenAI message type:', data.type);

        // Configure session after receiving session.created
        if (data.type === 'session.created' && !sessionConfigured) {
          sessionConfigured = true;
          const sessionConfig = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions: `אתה עוזר AI קולי חכם שעוזר למשתמשים למצוא מסלולים טובים לשירותי חשמל, תקשורת, אינטרנט וטלוויזיה בישראל.
              
דבר בעברית שוטפת וטבעית.
תן תשובות קצרות וברורות.
שאל שאלות הבהרה כדי להבין את הצרכים.
המלץ על מסלולים מתאימים בהתבסס על הצרכים.
היה ידידותי ומועיל.`,
              voice: 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: {
                model: 'whisper-1',
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000,
              },
              temperature: 0.8,
              max_response_output_tokens: 4096,
            },
          };
          
          console.log('Sending session configuration');
          openAISocket.send(JSON.stringify(sessionConfig));
        }

        // Forward all messages to client
        socket.send(event.data);
      } catch (error) {
        console.error('Error processing OpenAI message:', error);
      }
    };

    openAISocket.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error);
      socket.close(1011, 'OpenAI connection error');
    };

    openAISocket.onclose = (event) => {
      console.log('OpenAI WebSocket closed:', event.code, event.reason);
      socket.close(event.code, event.reason);
    };

    // Handle messages from client
    socket.onmessage = (event) => {
      try {
        if (openAISocket.readyState === WebSocket.OPEN) {
          openAISocket.send(event.data);
        } else {
          console.error('OpenAI socket not ready');
        }
      } catch (error) {
        console.error('Error forwarding to OpenAI:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('Client WebSocket closed');
      if (openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.close();
      }
    };

    return response;
  } catch (error) {
    console.error('Voice assistant error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
