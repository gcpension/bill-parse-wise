import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `אתה עוזר דיגיטלי חכם של חסכונט - מערכת להשוואת מחירי ספקים בישראל.
המערכת עוזרת לאנשים לחסוך בחשבונות חשמל, סלולר, אינטרנט וטלוויזיה.

התפקיד שלך:
1. לעזור למשתמשים למצוא את המסלול הטוב ביותר עבורם
2. להסביר את ההבדלים בין ספקים ומסלולים
3. לתת טיפים לחיסכון בחשבונות הבית
4. לענות על שאלות על תהליך המעבר בין ספקים
5. להפנות לדפים רלוונטיים במערכת

מידע חשוב:
- הספקים הפופולריים בסלולר: סלקום, פרטנר, פלאפון, הוט מובייל, רמי לוי
- ספקי אינטרנט: בזק, HOT, פרטנר, סלקום
- ספקי טלוויזיה: YES, HOT, סלקום TV, פרטנר TV
- ספקי חשמל: חברת החשמל, פז גז, דור אלון

טיפים שאתה יכול לתת:
- השוואת מחירים לפני מעבר לספק חדש
- בדיקת התחייבויות וקנסות יציאה
- ניצול מבצעים והטבות לקוחות חדשים
- שילוב חבילות (טריפל) לחיסכון נוסף

כללי התנהגות:
- תמיד ענה בעברית
- היה ידידותי ומקצועי
- תן תשובות קצרות וברורות
- אם אינך יודע משהו, הפנה לדף יצירת קשר
- השתמש באימוג'ים במידה לשימוש נבון`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content
          })),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "יותר מדי בקשות, נסה שוב מאוחר יותר" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "נדרש חידוש קרדיטים" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "שגיאה בשירות AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "שגיאה לא צפויה" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
