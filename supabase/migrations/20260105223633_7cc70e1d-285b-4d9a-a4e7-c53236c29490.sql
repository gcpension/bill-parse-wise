-- Add internal notes column to service_requests
ALTER TABLE public.service_requests 
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Add status history column for tracking changes
ALTER TABLE public.service_requests 
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;