import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting map (simple in-memory, in production use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ 
        error: 'חרגת ממספר הבקשות המותר. נסה שוב בעוד דקה.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages, conversationData } = await req.json();
    
    // Input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'נתונים לא תקינים' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate message structure and length
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response(JSON.stringify({ 
          error: 'נתונים לא תקינים' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (msg.content.length > 5000) {
        return new Response(JSON.stringify({ 
          error: 'הודעה ארוכה מדי' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Limit total messages
    if (messages.length > 100) {
      return new Response(JSON.stringify({ 
        error: 'יותר מדי הודעות בשיחה' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create focused system prompt for quick navigation
    const systemPrompt = `אתה עוזר AI ממוקד שתפקידו להביא משתמשים במהירות לעמוד המסלולים המתאים.

המטרה: לאסוף את המידע החיוני ב-2-3 שאלות בלבד ולשלוח למסלולים.

תהליך מהיר:
1. שאלה ראשונה: איזה שירות? (חשמל/סלולר/אינטרנט/טלוויזיה)
2. שאלה שנייה: מה התקציב החודשי הנוכחי? (או "לא יודע")
3. שאלה שלישית (אופציונלי): האם יש העדפה מיוחדת? (או דלג)

אחרי 2-3 הודעות, **חובה** לסיים עם:
"מעולה! 🎯 אני מעביר אותך עכשיו לעמוד המסלולים המתאימים ביותר עבורך [NAVIGATE_TO_PLANS]"

חשוב:
- שאלות קצרות וממוקדות בלבד
- ללא דיבורים מיותרים
- אחרי מקסימום 3 הודעות - תמיד להוסיף [NAVIGATE_TO_PLANS]
- אל תציג מסלולים בצ'אט - רק תנווט לעמוד המסלולים!

נתונים נוכחיים שנאספו:
${JSON.stringify(conversationData, null, 2)}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'חרגנו ממגבלת הבקשות. אנא נסה שוב מאוחר יותר.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'נדרש תשלום. אנא הוסף קרדיטים ל-workspace שלך.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: 'אירעה שגיאה. אנא נסה שוב.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat assistant error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'אירעה שגיאה לא צפויה. אנא נסה שוב מאוחר יותר.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
