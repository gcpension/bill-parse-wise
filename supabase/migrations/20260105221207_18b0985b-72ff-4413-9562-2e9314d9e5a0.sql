-- Add column to store the signature data (base64 image)
ALTER TABLE public.service_requests 
ADD COLUMN IF NOT EXISTS signature_data TEXT;