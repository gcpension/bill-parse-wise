import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleSheetsRequest {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  plan: string;
  referenceNumber?: string;
  customerType?: string;
  timestamp?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data: GoogleSheetsRequest = await req.json();
    
    // Google Apps Script URL - this should be configured in Supabase secrets
    const googleScriptUrl = Deno.env.get('GOOGLE_APPS_SCRIPT_URL') || 
      'https://script.google.com/macros/s/AKfycbz_H01BpsKvL0qsh6Uk6Q0BJF2RhMocA_q_2mSaxN4udq1EiX5vJX94x9iLVlR9MqR35g/exec';

    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      sheetName: 'לקוחות טפסים נכנסים',
      triggered_from: 'Supabase Edge Function'
    };

    console.log('Submitting to Google Sheets:', payload);

    // Submit to Google Apps Script
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Google Apps Script should return a proper response
    let responseData = null;
    try {
      responseData = await response.text();
      console.log('Google Apps Script response:', responseData);
    } catch (e) {
      console.log('Could not parse response as text');
    }

    if (!response.ok) {
      throw new Error(`Google Apps Script returned ${response.status}: ${responseData}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data submitted to Google Sheets successfully',
        googleResponse: responseData,
        submittedData: payload
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: 'Check that your Google Apps Script is published as a web app with "Anyone" access'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});