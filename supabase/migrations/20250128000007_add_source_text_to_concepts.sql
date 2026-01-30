-- Add source_text column to concepts table to store the original context/quote
ALTER TABLE public.concepts 
ADD COLUMN IF NOT EXISTS source_text TEXT;

-- Comment on column
COMMENT ON COLUMN public.concepts.source_text IS 'The specific excerpt or paragraph from the document that defines or explains this concept. Used for generating grounded questions.';
