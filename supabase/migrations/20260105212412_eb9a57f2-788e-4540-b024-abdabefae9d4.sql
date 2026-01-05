-- Create service_requests table to store all form submissions
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Reference and status
  reference_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'awaiting_signature',
  signature_status TEXT DEFAULT 'awaiting',
  comsign_request_id TEXT,
  
  -- General choices
  action_type TEXT NOT NULL DEFAULT 'switch',
  sector TEXT NOT NULL,
  customer_type TEXT NOT NULL DEFAULT 'private',
  
  -- Personal/Business details
  full_name TEXT NOT NULL,
  national_id_or_corp TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Business specific fields
  company_name TEXT,
  corp_registration_number TEXT,
  signer_name TEXT,
  signer_title TEXT,
  
  -- Address
  service_address JSONB NOT NULL DEFAULT '{}',
  
  -- Provider information
  current_provider TEXT,
  target_provider TEXT,
  
  -- Provider-specific fields (stored as JSONB for flexibility)
  customer_number TEXT,
  account_number TEXT,
  current_customer_number TEXT,
  current_account_number TEXT,
  current_meter_number TEXT,
  current_last_reading TEXT,
  current_subscriber_number TEXT,
  current_sim_number TEXT,
  current_puk_code TEXT,
  current_line_number TEXT,
  current_phone_number TEXT,
  current_installation_address TEXT,
  current_mac_address TEXT,
  current_modem_serial TEXT,
  current_decoder_number TEXT,
  current_smart_card TEXT,
  target_customer_number TEXT,
  target_account_number TEXT,
  target_subscriber_number TEXT,
  additional_notes TEXT,
  
  -- Selected plan info
  selected_plan_name TEXT,
  selected_plan_price NUMERIC,
  selected_plan_features JSONB,
  
  -- Preferences
  preferred_contact_window TEXT,
  preferred_language TEXT DEFAULT 'he',
  account_or_contract_no TEXT,
  payment_last4_optional TEXT,
  
  -- Declarations/Consents
  poa BOOLEAN DEFAULT false,
  privacy_tos BOOLEAN DEFAULT false,
  fees_ack BOOLEAN DEFAULT false,
  esign_ok BOOLEAN DEFAULT false,
  
  -- Sector-specific data (JSONB for flexibility)
  cellular_data JSONB,
  internet_isp_data JSONB,
  internet_infra_data JSONB,
  tv_data JSONB,
  electricity_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to INSERT (public form submissions)
CREATE POLICY "Anyone can create service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to SELECT their own request by reference_number or phone
CREATE POLICY "Anyone can view their requests by reference or phone" 
ON public.service_requests 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_service_requests_updated_at
BEFORE UPDATE ON public.service_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for common queries
CREATE INDEX idx_service_requests_reference ON public.service_requests(reference_number);
CREATE INDEX idx_service_requests_phone ON public.service_requests(phone);
CREATE INDEX idx_service_requests_email ON public.service_requests(email);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);