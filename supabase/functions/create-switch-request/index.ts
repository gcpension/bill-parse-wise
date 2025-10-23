import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 600000; // 10 minutes

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

interface SwitchRequest {
  personalDetails: {
    firstName: string;
    lastName: string;
    idNumber: string;
    birthDate: string;
    address: {
      street: string;
      houseNumber: string;
      city: string;
      zipCode: string;
    };
    phone: string;
    email: string;
  };
  currentService: {
    providerName: string;
    customerNumber: string;
    serviceType: string;
    currentPlan: string;
    contractCommitment?: string;
    commitmentEndDate?: string;
  };
  newService: {
    newProvider: string;
    newPlan: string;
    switchDate: string;
    customSwitchDate?: string;
  };
  payment: {
    paymentMethod: string;
    creditCardLast4?: string;
    bankAccount?: string;
    isOwner: boolean;
  };
  consent: {
    dataProcessingConsent: boolean;
    powerOfAttorneyConsent: boolean;
    termsAndConditionsConsent: boolean;
    exitFeesAwareness: boolean;
    gdprConsent: boolean;
    finalConfirmation: boolean;
  };
  signature: {
    signature: string;
    timestamp: string;
    powerOfAttorneyAgreed: boolean;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'חרגת ממספר הבקשות המותר' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const requestData: SwitchRequest = await req.json()
    
    // Basic validation
    if (!requestData.personalDetails || !requestData.consent || !requestData.signature) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'נתונים חסרים' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify all consents are true
    const requiredConsents = ['dataProcessingConsent', 'powerOfAttorneyConsent', 'termsAndConditionsConsent', 'exitFeesAwareness', 'gdprConsent', 'finalConfirmation'];
    for (const consent of requiredConsents) {
      if (requestData.consent[consent as keyof typeof requestData.consent] !== true) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'יש לאשר את כל ההסכמות' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Get client IP address
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'

    // Generate unique request ID
    const requestId = `SW${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    // Calculate estimated switch date
    const getEstimatedSwitchDate = () => {
      const now = new Date()
      switch (requestData.newService.switchDate) {
        case 'immediate':
          now.setDate(now.getDate() + 14) // 14 days for immediate
          return now.toISOString().split('T')[0]
        case 'end_of_billing':
          now.setMonth(now.getMonth() + 1) // End of next billing cycle
          return now.toISOString().split('T')[0]
        case 'end_of_commitment':
          return requestData.currentService.commitmentEndDate || now.toISOString().split('T')[0]
        case 'custom':
          return requestData.newService.customSwitchDate || now.toISOString().split('T')[0]
        default:
          now.setDate(now.getDate() + 14)
          return now.toISOString().split('T')[0]
      }
    }

    // Check for exit fees (mock implementation)
    const checkExitFees = () => {
      const hasCommitment = requestData.currentService.contractCommitment && 
                           requestData.currentService.contractCommitment !== 'none'
      const commitmentEndDate = requestData.currentService.commitmentEndDate
      
      if (hasCommitment && commitmentEndDate) {
        const endDate = new Date(commitmentEndDate)
        const now = new Date()
        if (endDate > now) {
          // Has active commitment - calculate estimated fee
          const monthsLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
          return {
            hasExitFee: true,
            estimatedAmount: monthsLeft * 50, // Mock calculation
            reason: `התחייבות פעילה עד ${endDate.toLocaleDateString('he-IL')}`
          }
        }
      }
      
      return {
        hasExitFee: false,
        estimatedAmount: 0,
        reason: 'ללא התחייבות פעילה'
      }
    }

    const exitFeeInfo = checkExitFees()

    // Insert switch request into database
    const { data: switchRequest, error: insertError } = await supabaseClient
      .from('switch_requests')
      .insert({
        request_id: requestId,
        status: 'pending',
        service_type: requestData.currentService.serviceType,
        current_provider: requestData.currentService.providerName,
        new_provider: requestData.newService.newProvider,
        current_plan: requestData.currentService.currentPlan,
        new_plan: requestData.newService.newPlan,
        customer_details: {
          firstName: requestData.personalDetails.firstName,
          lastName: requestData.personalDetails.lastName,
          idNumber: requestData.personalDetails.idNumber,
          email: requestData.personalDetails.email,
          phone: requestData.personalDetails.phone,
          address: requestData.personalDetails.address
        },
        service_details: {
          currentService: requestData.currentService,
          newService: requestData.newService,
          paymentMethod: requestData.payment.paymentMethod
        },
        consent_data: requestData.consent,
        signature_data: {
          ...requestData.signature,
          ipAddress: clientIP,
          timestamp: new Date().toISOString()
        },
        estimated_switch_date: getEstimatedSwitchDate(),
        exit_fee_info: exitFeeInfo,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'שגיאה בשמירת הבקשה' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log consent for audit trail
    const consentEntries = Object.entries(requestData.consent).map(([consentType, agreed]) => ({
      request_id: requestId,
      consent_type: consentType,
      agreed: agreed,
      timestamp: new Date().toISOString(),
      ip_address: clientIP,
      user_agent: req.headers.get('user-agent') || 'unknown'
    }))

    const { error: consentError } = await supabaseClient
      .from('consent_logs')
      .insert(consentEntries)

    if (consentError) {
      console.error('Consent logging error:', consentError)
      // Don't fail the request for consent logging issues
    }

    // Send confirmation email (call existing function)
    try {
      const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification-email`, {
        method: 'POST',
        headers: {
          'Authorization': req.headers.get('Authorization') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: requestData.personalDetails.email,
          subject: `אישור קבלת בקשת מעבר #${requestId}`,
          template: 'switch-request-confirmation',
          data: {
            requestId,
            customerName: `${requestData.personalDetails.firstName} ${requestData.personalDetails.lastName}`,
            currentProvider: requestData.currentService.providerName,
            newProvider: requestData.newService.newProvider,
            estimatedSwitchDate: getEstimatedSwitchDate(),
            exitFeeInfo,
            supportEmail: 'support@switch-provider.co.il',
            supportPhone: '03-1234567'
          }
        })
      })

      if (!emailResponse.ok) {
        console.error('Email sending failed:', await emailResponse.text())
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the main request for email issues
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        requestId,
        message: 'בקשת המעבר נשלחה בהצלחה',
        estimatedProcessingTime: '24-48 שעות',
        exitFeeInfo,
        nextSteps: [
          'קבלת אישור במייל תוך 15 דקות',
          'בדיקת כשירות והתחייבויות עם הספק הנוכחי',
          'יצירת קשר טלפוני לאישור פרטים',
          'ביצוע המעבר בתאריך המתוכנן'
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (err) {
    console.error('Function error:', err)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'שגיאה בעיבוד הבקשה',
        message: 'אנא נסה שוב או צור קשר עם התמיכה'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})