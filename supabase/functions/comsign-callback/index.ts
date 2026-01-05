import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  
  try {
    const body = await req.json();
    const requestId = body.request_id ?? body.reference_id;
    const signatureStatus = body.signature_status;
    const signedAt = body.signed_at;
    const auditUrl = body.audit_url;

    console.log("ComSign callback received:", { requestId, signatureStatus });

    if (!requestId || !signatureStatus) {
      return new Response(JSON.stringify({ error: "missing_parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Determine next status
    let nextStatus = "awaiting_signature";
    if (signatureStatus === "signed") {
      nextStatus = "sent_to_provider";
    } else if (signatureStatus === "failed" || signatureStatus === "expired") {
      nextStatus = "awaiting_signature";
    }

    const updatePayload: Record<string, any> = {
      signature_status: signatureStatus,
      status: nextStatus,
    };
    
    if (auditUrl) {
      updatePayload.audit_url = auditUrl;
    }
    
    if (signatureStatus === "signed") {
      updatePayload.signed_at = signedAt ?? new Date().toISOString();
    }

    const { data: updated, error: updateError } = await supabase
      .from("service_requests")
      .update(updatePayload)
      .eq("id", requestId)
      .select()
      .single();

    if (updateError || !updated) {
      console.error("Update error:", updateError);
      return new Response(JSON.stringify({ error: "update_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Request updated successfully:", updated.id);

    // On signed, trigger downstream processes
    if (signatureStatus === "signed") {
      const webhookUrl = Deno.env.get("WEBHOOK_URL") ?? "";
      
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          });
          console.log("Webhook called successfully");
        } catch (whErr) {
          console.error("Webhook error:", whErr);
        }
      }

      // Call Google Sheets function
      try {
        await supabase.functions.invoke("submit-to-google-sheets", {
          body: updated,
        });
        console.log("Google Sheets updated");
      } catch (gsErr) {
        console.error("Google Sheets error:", gsErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Callback handler error:", error);
    return new Response(JSON.stringify({ error: error.message ?? "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});