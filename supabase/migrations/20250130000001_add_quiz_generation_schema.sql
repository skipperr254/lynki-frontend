-- =====================================================
-- Quiz Generation Schema Enhancement
-- Adds support for concept-linked, high-quality questions
-- with hints, per-option explanations, and document linkage
-- =====================================================

-- Step 1: Link quizzes to documents and users
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS generation_status TEXT DEFAULT 'pending';

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_quizzes_document_id ON public.quizzes(document_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON public.quizzes(user_id);

-- Step 2: Enhance questions table with concept linkage and metadata
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS hint TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard'));

-- Add index for concept-based queries
CREATE INDEX IF NOT EXISTS idx_questions_concept_id ON public.questions(concept_id);

-- Step 3: Create question_options table for per-option explanations
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_index INTEGER NOT NULL CHECK (option_index >= 0 AND option_index < 10),
  is_correct BOOLEAN DEFAULT false,
  explanation TEXT NOT NULL, -- Why this option is correct or incorrect
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_question_options_order ON public.question_options(question_id, option_index);

-- Enable RLS on new table
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to options
CREATE POLICY "Allow public read access to question options"
  ON public.question_options
  FOR SELECT
  USING (true);

-- Step 4: Update RLS policies for quizzes to respect user ownership
-- Drop old public policy and create user-specific ones
DROP POLICY IF EXISTS "Allow public read access to quizzes" ON public.quizzes;

-- Users can view their own quizzes
CREATE POLICY "Users can view their own quizzes"
  ON public.quizzes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own quizzes (for future manual creation)
CREATE POLICY "Users can insert their own quizzes"
  ON public.quizzes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own quizzes
CREATE POLICY "Users can update their own quizzes"
  ON public.quizzes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own quizzes
CREATE POLICY "Users can delete their own quizzes"
  ON public.quizzes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Update questions RLS to respect quiz ownership
DROP POLICY IF EXISTS "Allow public read access to questions" ON public.questions;

-- Users can view questions for their own quizzes
CREATE POLICY "Users can view questions for their quizzes"
  ON public.questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

-- Step 6: Add comment for documentation
COMMENT ON TABLE public.question_options IS 'Stores individual answer options with explanations for why each is correct or incorrect';
COMMENT ON COLUMN public.quizzes.generation_status IS 'Status of quiz generation: pending, generating, completed, failed';
COMMENT ON COLUMN public.questions.concept_id IS 'Links question to the knowledge component (concept) it tests';
COMMENT ON COLUMN public.questions.difficulty_level IS 'Question difficulty: easy, medium, hard';
COMMENT ON COLUMN public.questions.hint IS 'Subtle hint to help user think through the question without revealing answer';

-- Step 7: Create a view for easy quiz access with question counts
CREATE OR REPLACE VIEW public.quiz_summary AS
SELECT 
  q.id,
  q.title,
  q.description,
  q.document_id,
  q.user_id,
  q.generation_status,
  q.created_at,
  q.updated_at,
  COUNT(DISTINCT qu.id) as question_count,
  d.title as document_title
FROM public.quizzes q
LEFT JOIN public.questions qu ON q.id = qu.quiz_id
LEFT JOIN public.documents d ON q.document_id = d.id
GROUP BY q.id, q.title, q.description, q.document_id, q.user_id, 
         q.generation_status, q.created_at, q.updated_at, d.title;

-- Grant access to view
GRANT SELECT ON public.quiz_summary TO authenticated;
GRANT SELECT ON public.quiz_summary TO anon;
