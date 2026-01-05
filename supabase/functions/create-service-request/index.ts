import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.1";
import { corsHeaders } from "../_shared/cors.ts";

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

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const data: ServiceRequest = await req.json();

    // Basic required field validation
    const requiredFields = ["full_name", "national_id_or_corp", "email", "phone", "service_address", "action_type", "sector", "customer_type"];
    for (const field of requiredFields) {
      if (!data[field as keyof ServiceRequest]) {
        return new Response(JSON.stringify({ success: false, error: `missing_${field}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    // If switch then target_provider required
    if (data.action_type === "switch" && !data.target_provider) {
      return new Response(JSON.stringify({ success: false, error: "missing_target_provider" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
      return new Response(JSON.stringify({ success: false, error: "db_insert_failed" }), {
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
    return new Response(JSON.stringify({ success: false, error: error.message ?? "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
