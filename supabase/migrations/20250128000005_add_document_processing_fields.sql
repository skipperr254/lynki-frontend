-- Create processing_status enum
CREATE TYPE public.processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Add columns to documents table
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS status processing_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS extracted_text TEXT,
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Index for status to help find pending documents if we setup a cron later
CREATE INDEX idx_documents_status ON public.documents(status);
