-- Create documents table to track metadata
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);

-- Policies for documents table
CREATE POLICY "Users can view their own documents"
  ON public.documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON public.documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket if not exists (this is often done via dashboard, but we can try via SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
-- Allow users to upload to their own folder: user_id/*
CREATE POLICY "Users can upload course materials"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'course-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own course materials"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'course-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own course materials"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'course-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own course materials"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'course-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
