import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SigningRequest {
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    idNumber: string;
  };
  currentProvider: string;
  newProvider: string;
  category: string;
  documentData: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method === 'POST') {
      const { customerDetails, currentProvider, newProvider, category, documentData }: SigningRequest = await req.json()

      // Store the signing request in database
      const { data: signingRecord, error: dbError } = await supabaseClient
        .from('signing_requests')
        .insert({
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_phone: customerDetails.phone,
          customer_id: customerDetails.idNumber,
          current_provider: currentProvider,
          new_provider: newProvider,
          category: category,
          document_data: documentData,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      // Create signing link with SignTrust
      const signTrustResponse = await fetch('https://wse.comsigntrust.com:443/api/signing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SIGNTRUST_API_KEY')}`,
        },
        body: JSON.stringify({
          document: {
            title: `העברת ספק ${category} - ${customerDetails.name}`,
            content: generateDocumentContent(customerDetails, currentProvider, newProvider, category)
          },
          signer: {
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone
          },
          callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/signtrust-callback`,
          reference_id: signingRecord.id
        })
      })

      if (!signTrustResponse.ok) {
        throw new Error('Failed to create signing link')
      }

      const signTrustData = await signTrustResponse.json()

      // Update the record with signing link
      await supabaseClient
        .from('signing_requests')
        .update({ 
          signing_link: signTrustData.signing_url,
          signtrust_id: signTrustData.document_id 
        })
        .eq('id', signingRecord.id)

      return new Response(
        JSON.stringify({ 
          success: true, 
          signing_url: signTrustData.signing_url,
          request_id: signingRecord.id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function generateDocumentContent(customerDetails: any, currentProvider: string, newProvider: string, category: string): string {
  return `
בקשה להעברת ספק ${category}

פרטי הלקוח:
שם: ${customerDetails.name}
תעודת זהות: ${customerDetails.idNumber}
טלפון: ${customerDetails.phone}
אימייל: ${customerDetails.email}

פרטי ההעברה:
ספק נוכחי: ${currentProvider}
ספק חדש: ${newProvider}
קטגוריה: ${category}

תאריך: ${new Date().toLocaleDateString('he-IL')}

אני מאשר/ת את העברת השירות מהספק הנוכחי לספק החדש על פי התנאים המפורטים לעיל.

חתימה: _________________
  `
}