import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      const { document_id, reference_id, status, signed_document_url } = await req.json()

      // Update the signing request status
      const { data: updatedRecord, error: updateError } = await supabaseClient
        .from('signing_requests')
        .update({
          status: status === 'signed' ? 'completed' : 'failed',
          signed_document_url: signed_document_url,
          signed_at: status === 'signed' ? new Date().toISOString() : null
        })
        .eq('id', reference_id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Failed to update record: ${updateError.message}`)
      }

      // If successfully signed, send notification email
      if (status === 'signed' && updatedRecord) {
        await supabaseClient.functions.invoke('send-notification-email', {
          body: {
            type: 'signature_completed',
            data: updatedRecord
          }
        })
      }

      return new Response(
        JSON.stringify({ success: true }),
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
    console.error('Callback error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})