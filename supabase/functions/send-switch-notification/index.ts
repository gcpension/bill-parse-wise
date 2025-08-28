import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idNumber: string;
  };
  currentService: {
    providerName: string;
    serviceType: string;
    currentPlan: string;
  };
  newService: {
    newProvider: string;
    newPlan: string;
    switchDate: string;
  };
  requestId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { personalDetails, currentService, newService, requestId }: NotificationRequest = await req.json();

    // Send notification email to admin
    const adminEmailContent = `
      בקשת מעבר חדשה התקבלה:
      
      מספר בקשה: ${requestId}
      
      פרטי הלקוח:
      - שם: ${personalDetails.firstName} ${personalDetails.lastName}
      - ת.ז.: ${personalDetails.idNumber}
      - טלפון: ${personalDetails.phone}
      - אימייל: ${personalDetails.email}
      
      פרטי המעבר:
      - מ: ${currentService.providerName} (${currentService.currentPlan})
      - אל: ${newService.newProvider} (${newService.newPlan})
      - מועד מעבר: ${newService.switchDate}
      - סוג שירות: ${currentService.serviceType}
      
      התקבל ב: ${new Date().toLocaleString('he-IL')}
    `;

    // Send confirmation email to customer
    const customerEmailContent = `
      שלום ${personalDetails.firstName},
      
      קיבלנו את בקשתכם למעבר ספק!
      
      מספר אסמכתה: ${requestId}
      
      פרטי המעבר:
      - מ: ${currentService.providerName}
      - אל: ${newService.newProvider}
      
      הבקשה נמצאת בטיפול ונחזור אליכם תוך 48 שעות.
      
      בברכה,
      צוות השוואת ספקים
    `;

    console.log('=== ADMIN NOTIFICATION EMAIL ===');
    console.log('To: admin@company.com');
    console.log('Subject: בקשת מעבר חדשה - ' + requestId);
    console.log('Content:', adminEmailContent);

    console.log('=== CUSTOMER CONFIRMATION EMAIL ===');
    console.log('To:', personalDetails.email);
    console.log('Subject: אישור קבלת בקשה - ' + requestId);
    console.log('Content:', customerEmailContent);

    // Note: Replace console.log with actual email service like Resend
    // Example with Resend:
    /*
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@yourcompany.com',
          to: personalDetails.email,
          subject: 'אישור קבלת בקשה - ' + requestId,
          text: customerEmailContent,
        }),
      });
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification emails logged successfully',
        emailsSent: {
          admin: true,
          customer: true
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});