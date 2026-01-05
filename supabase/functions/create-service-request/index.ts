import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ServiceRequest {
  // Reference
  reference_number?: string;
  
  // General choices
  action_type?: string;
  sector: string;
  customer_type: string;
  
  // Personal/Business details
  full_name: string;
  national_id_or_corp: string;
  email: string;
  phone: string;
  
  // Business fields
  company_name?: string;
  corp_registration_number?: string;
  signer_name?: string;
  signer_title?: string;
  
  // Address
  service_address: {
    street: string;
    number: string;
    city: string;
    zip?: string;
  };
  
  // Provider info
  current_provider?: string;
  target_provider?: string;
  
  // Provider-specific fields
  customer_number?: string;
  account_number?: string;
  current_customer_number?: string;
  current_account_number?: string;
  current_meter_number?: string;
  current_last_reading?: string;
  current_subscriber_number?: string;
  current_sim_number?: string;
  current_puk_code?: string;
  current_line_number?: string;
  current_phone_number?: string;
  current_installation_address?: string;
  current_mac_address?: string;
  current_modem_serial?: string;
  current_decoder_number?: string;
  current_smart_card?: string;
  target_customer_number?: string;
  target_account_number?: string;
  target_subscriber_number?: string;
  additional_notes?: string;
  
  // Selected plan
  selected_plan_name?: string;
  selected_plan_price?: number;
  selected_plan_features?: string[];
  
  // Preferences
  preferred_contact_window?: string;
  preferred_language?: string;
  account_or_contract_no?: string;
  payment_last4_optional?: string;
  
  // Consents
  poa?: boolean;
  privacy_tos?: boolean;
  fees_ack?: boolean;
  esign_ok?: boolean;
  
  // Sector-specific data
  cellular_data?: any;
  internet_isp_data?: any;
  internet_infra_data?: any;
  tv_data?: any;
  electricity_data?: any;
}

function generateReferenceNumber(sector: string, customerType: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${sector.toUpperCase()}-${customerType.toUpperCase()}-${timestamp}-${random}`.toUpperCase();
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ServiceRequest = await req.json();
    
    console.log("Received service request:", JSON.stringify(data, null, 2));

    // Basic required field validation
    const requiredFields = ["full_name", "national_id_or_corp", "email", "phone", "sector", "customer_type"];
    for (const field of requiredFields) {
      if (!data[field as keyof ServiceRequest]) {
        console.error(`Missing required field: ${field}`);
        return new Response(JSON.stringify({ success: false, error: `missing_${field}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Validate service_address
    if (!data.service_address || !data.service_address.city || !data.service_address.street) {
      console.error("Missing service address");
      return new Response(JSON.stringify({ success: false, error: "missing_service_address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If switch action, target_provider is required
    if (data.action_type === "switch" && !data.target_provider) {
      console.error("Missing target provider for switch action");
      return new Response(JSON.stringify({ success: false, error: "missing_target_provider" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate reference number
    const referenceNumber = data.reference_number || generateReferenceNumber(data.sector, data.customer_type);

    // Check for duplicates
    const { data: existing, error: existingErr } = await supabase
      .from("service_requests")
      .select("id, reference_number")
      .eq("national_id_or_corp", data.national_id_or_corp)
      .eq("phone", data.phone)
      .not("status", "in", "('closed','failed','completed')")
      .limit(1);

    if (existingErr) {
      console.error("Duplicate check error:", existingErr);
    }
    
    if (existing && existing.length > 0) {
      console.log("Duplicate request found:", existing[0].reference_number);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "duplicate_request",
        existing_reference: existing[0].reference_number 
      }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prepare insert payload with all fields
    const insertPayload = {
      reference_number: referenceNumber,
      status: "awaiting_signature",
      signature_status: "awaiting",
      
      // General
      action_type: data.action_type || "switch",
      sector: data.sector,
      customer_type: data.customer_type,
      
      // Personal
      full_name: data.full_name,
      national_id_or_corp: data.national_id_or_corp,
      email: data.email,
      phone: data.phone,
      
      // Business
      company_name: data.company_name || null,
      corp_registration_number: data.corp_registration_number || null,
      signer_name: data.signer_name || null,
      signer_title: data.signer_title || null,
      
      // Address
      service_address: data.service_address,
      
      // Providers
      current_provider: data.current_provider || null,
      target_provider: data.target_provider || null,
      
      // Provider-specific
      customer_number: data.customer_number || null,
      account_number: data.account_number || null,
      current_customer_number: data.current_customer_number || null,
      current_account_number: data.current_account_number || null,
      current_meter_number: data.current_meter_number || null,
      current_last_reading: data.current_last_reading || null,
      current_subscriber_number: data.current_subscriber_number || null,
      current_sim_number: data.current_sim_number || null,
      current_puk_code: data.current_puk_code || null,
      current_line_number: data.current_line_number || null,
      current_phone_number: data.current_phone_number || null,
      current_installation_address: data.current_installation_address || null,
      current_mac_address: data.current_mac_address || null,
      current_modem_serial: data.current_modem_serial || null,
      current_decoder_number: data.current_decoder_number || null,
      current_smart_card: data.current_smart_card || null,
      target_customer_number: data.target_customer_number || null,
      target_account_number: data.target_account_number || null,
      target_subscriber_number: data.target_subscriber_number || null,
      additional_notes: data.additional_notes || null,
      
      // Plan info
      selected_plan_name: data.selected_plan_name || null,
      selected_plan_price: data.selected_plan_price || null,
      selected_plan_features: data.selected_plan_features || null,
      
      // Preferences
      preferred_contact_window: data.preferred_contact_window || null,
      preferred_language: data.preferred_language || "he",
      account_or_contract_no: data.account_or_contract_no || null,
      payment_last4_optional: data.payment_last4_optional || null,
      
      // Consents
      poa: data.poa || false,
      privacy_tos: data.privacy_tos || false,
      fees_ack: data.fees_ack || false,
      esign_ok: data.esign_ok || false,
      
      // Sector-specific
      cellular_data: data.cellular_data || null,
      internet_isp_data: data.internet_isp_data || null,
      internet_infra_data: data.internet_infra_data || null,
      tv_data: data.tv_data || null,
      electricity_data: data.electricity_data || null,
    };

    console.log("Inserting payload:", JSON.stringify(insertPayload, null, 2));

    // Insert into database
    const { data: inserted, error: insertErr } = await supabase
      .from("service_requests")
      .insert(insertPayload)
      .select()
      .single();

    if (insertErr || !inserted) {
      console.error("Insert error:", insertErr);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "db_insert_failed",
        details: insertErr?.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Successfully inserted request:", inserted.id);

    // Optional: Send notification email (if configured)
    try {
      const emailResponse = await supabase.functions.invoke("send-notification-email", {
        body: {
          to: data.email,
          subject: `בקשת שירות התקבלה - ${referenceNumber}`,
          reference_number: referenceNumber,
          customer_name: data.full_name
        }
      });
      console.log("Email notification sent:", emailResponse);
    } catch (emailErr) {
      console.warn("Email notification failed (non-critical):", emailErr);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      id: inserted.id, 
      reference_number: referenceNumber,
      status: "awaiting_signature" 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message ?? "unknown" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
