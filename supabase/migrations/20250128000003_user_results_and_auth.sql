-- Create user_quiz_attempts table
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL, -- Store the array of answers { questionId: string, selectedOption: number }
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON public.user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON public.user_quiz_attempts(quiz_id);

-- Enable Row Level Security
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can insert their own attempts
CREATE POLICY "Users can insert their own attempts"
  ON public.user_quiz_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own attempts
CREATE POLICY "Users can view their own attempts"
  ON public.user_quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);
