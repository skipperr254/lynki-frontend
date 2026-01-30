-- Create tables for topics and concepts extracted from documents

-- Topics table
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concepts table (linked to topics)
CREATE TABLE IF NOT EXISTS public.concepts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    explanation TEXT,
    complexity_level TEXT DEFAULT 'intermediate', -- introductory, intermediate, advanced
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LLM Logs table for usage tracking
CREATE TABLE IF NOT EXISTS public.llm_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    operation TEXT NOT NULL, -- e.g., 'topic_extraction', 'question_generation'
    model TEXT NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_logs ENABLE ROW LEVEL SECURITY;

-- Policies for Topics (viewable by document owner)
CREATE POLICY "Users can view topics for their documents"
    ON public.topics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE documents.id = topics.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- Policies for Concepts (viewable by document owner via topic->document chain)
CREATE POLICY "Users can view concepts for their topics"
    ON public.concepts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.topics
            JOIN public.documents ON topics.document_id = documents.id
            WHERE topics.id = concepts.topic_id
            AND documents.user_id = auth.uid()
        )
    );

-- Service role policies (full access for backend)
-- Note: As long as backend uses service_role key, it bypasses RLS, but explicit policies can be good for clarity if we ever use anon key for some reads.
