import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method === 'POST') {
      const { type, data } = await req.json()

      if (type === 'signature_completed') {
        const emailContent = `
        בקשה חדשה להעברת ספק!
        
        פרטי הלקוח:
        שם: ${data.customer_name}
        אימייל: ${data.customer_email}  
        טלפון: ${data.customer_phone}
        תעודת זהות: ${data.customer_id}
        
        פרטי ההעברה:
        ספק נוכחי: ${data.current_provider}
        ספק חדש: ${data.new_provider}
        קטגוריה: ${data.category}
        
        המסמך נחתם בהצלחה!
        קישור למסמך החתום: ${data.signed_document_url}
        
        תאריך חתימה: ${new Date(data.signed_at).toLocaleString('he-IL')}
        `

        // Send email to admin (you can replace with your actual email service)
        console.log('Email to send:', emailContent)
        
        // Here you would integrate with your preferred email service
        // For now, we'll just log it so you can see the notifications
        
        return new Response(
          JSON.stringify({ success: true, message: 'Email notification logged' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Unknown notification type' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )

  } catch (error) {
    console.error('Email notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})