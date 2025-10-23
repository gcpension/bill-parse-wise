import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ServiceRequest {
  full_name: string;
  national_id_or_corp: string;
  email: string;
  phone: string;
  service_address: {
    street: string;
    number: string;
    city: string;
    zip?: string;
  };
  action_type: string;
  sector: string;
  customer_type: string;
  current_provider?: string;
  target_provider?: string;
  [key: string]: any;
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per window
const RATE_WINDOW = 300000; // 5 minutes

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

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^0(5[0-9]|[2-4]|7[0-9]|8|9)[0-9]{7,8}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

function validateId(id: string): boolean {
  const cleanId = id.replace(/\D/g, '');
  return cleanId.length >= 8 && cleanId.length <= 9;
}

function sanitizeString(str: string, maxLength: number = 200): string {
  return str.trim().slice(0, maxLength);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ success: false, error: "rate_limit_exceeded" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data: ServiceRequest = await req.json();

    // Validate required fields
    const requiredFields = ["full_name", "national_id_or_corp", "email", "phone", "service_address", "action_type", "sector", "customer_type"];
    for (const field of requiredFields) {
      if (!data[field as keyof ServiceRequest]) {
        return new Response(JSON.stringify({ success: false, error: "invalid_data" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Validate email
    if (!validateEmail(data.email)) {
      return new Response(JSON.stringify({ success: false, error: "invalid_data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate phone
    if (!validatePhone(data.phone)) {
      return new Response(JSON.stringify({ success: false, error: "invalid_data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate ID
    if (!validateId(data.national_id_or_corp)) {
      return new Response(JSON.stringify({ success: false, error: "invalid_data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate switch requires target provider
    if (data.action_type === "switch" && !data.target_provider) {
      return new Response(JSON.stringify({ success: false, error: "invalid_data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize string inputs
    data.full_name = sanitizeString(data.full_name, 100);
    data.email = sanitizeString(data.email, 255);
    data.phone = sanitizeString(data.phone, 20);
    if (data.current_provider) data.current_provider = sanitizeString(data.current_provider, 100);
    if (data.target_provider) data.target_provider = sanitizeString(data.target_provider, 100);
    if (data.company_name) data.company_name = sanitizeString(data.company_name, 200);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // check duplicate by national_id_or_corp + phone + service_address
    const { data: existing, error: existingErr } = await supabase
      .from("service_requests")
      .select("id")
      .eq("national_id_or_corp", data.national_id_or_corp)
      .eq("phone", data.phone)
      .eq("service_address->>street", data.service_address.street)
      .eq("service_address->>number", data.service_address.number)
      .eq("service_address->>city", data.service_address.city)
      .not("status", "in", "('closed','failed')");

    if (existingErr) {
      console.error("duplicate check error:", existingErr);
    }
    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ success: false, error: "duplicate_request" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert into database
    const insertPayload: any = {
      ...data,
      status: "awaiting_signature",
      signature_status: "awaiting",
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertErr } = await supabase
      .from("service_requests")
      .insert(insertPayload)
      .select()
      .single();

    if (insertErr || !inserted) {
      console.error("insert error", insertErr);
      return new Response(JSON.stringify({ success: false, error: "שגיאה בשמירת הנתונים" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // remote signature via ComSign
    try {
      const comsignUrl = Deno.env.get("COMSIGN_API_URL")!;
      const comsignKey = Deno.env.get("COMSIGN_API_KEY")!;
      const comsignWebhook = Deno.env.get("COMSIGN_WEBHOOK_URL")!;
      const payload = {
        request_id: inserted.id,
        customer_name: data.full_name,
        phone: data.phone,
        pdf_template_id: Deno.env.get("PDF_TEMPLATE_ID"),
        webhook: comsignWebhook,
      };
      const res = await fetch(`${comsignUrl}/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${comsignKey}`,
        },
        body: JSON.stringify(payload),
      });
      const resJson = await res.json();
      // update signature request id
      if (res.ok && resJson?.id) {
        await supabase
          .from("service_requests")
          .update({ comsign_request_id: resJson.id })
          .eq("id", inserted.id);
      }
    } catch (signatureErr) {
      console.error("comsign error", signatureErr);
    }

    return new Response(JSON.stringify({ success: true, id: inserted.id, status: "awaiting_signature" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("unexpected error", error);
    return new Response(JSON.stringify({ success: false, error: "אירעה שגיאה לא צפויה" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
