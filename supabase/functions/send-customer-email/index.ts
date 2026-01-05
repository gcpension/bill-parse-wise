import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  customerName: string;
  referenceNumber: string;
  sector: string;
  targetProvider?: string;
  selectedPlanName?: string;
  selectedPlanPrice?: number;
  status: string;
}

const statusLabels: Record<string, string> = {
  awaiting_signature: 'ממתין לחתימה',
  pending: 'ממתין לטיפול',
  in_progress: 'בטיפול',
  completed: 'הושלם',
  failed: 'נכשל',
  closed: 'סגור',
};

const sectorLabels: Record<string, string> = {
  cellular: 'סלולר',
  internet: 'אינטרנט',
  internet_isp: 'אינטרנט',
  tv: 'טלוויזיה',
  electricity: 'חשמל',
  general: 'כללי',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured, skipping email");
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(resendApiKey);
    const data: EmailRequest = await req.json();

    const { to, customerName, referenceNumber, sector, targetProvider, selectedPlanName, selectedPlanPrice, status } = data;

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .status-badge { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          .info-box { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
          .info-row:last-child { border-bottom: none; }
          .info-label { color: #64748b; }
          .info-value { font-weight: 600; color: #0f172a; }
          .reference { font-family: monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          .track-link { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 בקשת מעבר ספק</h1>
            <p>הבקשה שלך התקבלה בהצלחה!</p>
          </div>
          <div class="content">
            <p>שלום ${customerName},</p>
            <p>תודה שפנית אלינו! קיבלנו את הבקשה שלך ואנו מתחילים לטפל בה.</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">מספר אסמכתה:</span>
                <span class="info-value reference">${referenceNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">סקטור:</span>
                <span class="info-value">${sectorLabels[sector] || sector}</span>
              </div>
              ${targetProvider ? `
              <div class="info-row">
                <span class="info-label">ספק יעד:</span>
                <span class="info-value">${targetProvider}</span>
              </div>
              ` : ''}
              ${selectedPlanName ? `
              <div class="info-row">
                <span class="info-label">מסלול נבחר:</span>
                <span class="info-value">${selectedPlanName}${selectedPlanPrice ? ` (₪${selectedPlanPrice}/חודש)` : ''}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="info-label">סטטוס:</span>
                <span class="info-value"><span class="status-badge">${statusLabels[status] || status}</span></span>
              </div>
            </div>

            <p><strong>מה הלאה?</strong></p>
            <ul>
              <li>הצוות שלנו יבדוק את הבקשה</li>
              <li>ניצור קשר אם נצטרך פרטים נוספים</li>
              <li>נעדכן אותך בכל שלב בתהליך</li>
            </ul>

            <p>שמור את מספר האסמכתה שלך: <strong class="reference">${referenceNumber}</strong></p>
            <p>תוכל לעקוב אחרי סטטוס הבקשה בכל עת באתר שלנו.</p>
          </div>
          <div class="footer">
            <p>יש לך שאלות? צור איתנו קשר</p>
            <p>© ${new Date().getFullYear()} SaveSwitch - השוואת מחירים</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "SaveSwitch <onboarding@resend.dev>",
      to: [to],
      subject: `בקשת מעבר ספק התקבלה - ${referenceNumber}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
