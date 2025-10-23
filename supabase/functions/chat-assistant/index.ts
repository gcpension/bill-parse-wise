import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, availablePlans } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create system prompt with real plan data
    const systemPrompt = `אתה עוזר AI חכם ומקצועי שעוזר למשתמשים למצוא את המסלולים הטובים ביותר לשירותי חשמל, תקשורת, אינטרנט וטלוויזיה בישראל.

חשוב ביותר: אתה מקבל רשימת מסלולים אמיתית וממשית. המלץ רק על מסלולים מהרשימה הזו!

הנתונים האמיתיים שיש לך:
${availablePlans ? `יש לך ${availablePlans.length} מסלולים אמיתיים מחברות שונות.` : 'לא התקבלו מסלולים.'}

הנחיות לשיחה:
1. התנהל בצורה ידידותית ומקצועית
2. שאל שאלות הבהרה כדי להבין את הצרכים של המשתמש:
   - מה סוג השירות? (חשמל, סלולר, אינטרנט, טלוויזיה)
   - האם זה לשימוש פרטי או עסקי?
   - מה הצריכה החודשית הנוכחית?
   - מה הספק הנוכחי?
   - מה התקציב?
   - האם יש העדפה לספק מסוים?
3. המלץ רק על מסלולים אמיתיים שקיימים בנתונים
4. הסבר למה המסלול מתאים
5. ציין את המחיר, החיסכון הפוטנציאלי והתכונות המרכזיות
6. לא להמציא או לזייף מידע - רק נתונים אמיתיים!

כשמשתמש מבקש המלצות, חפש במסלולים הזמינים ותן המלצות מבוססות על:
- התאמה לצרכים
- מחיר תחרותי
- חברה אמינה
- תנאים טובים`;

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
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
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
        error: error instanceof Error ? error.message : 'שגיאה לא ידועה' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
