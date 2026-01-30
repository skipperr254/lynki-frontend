# Supabase Migrations

This folder contains all database migrations for the Lynki quiz application.

## How to Apply Migrations

1. **Via Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the migration SQL
   - Run the query

2. **Via Supabase CLI:**
   ```bash
   supabase db push
   ```

## Migration Files

- `20250128000001_initial_schema.sql` - Initial database schema with quizzes, questions, and dummy data

## Database Schema

### Tables

#### `quizzes`
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### `questions`
- `id` (UUID, Primary Key)
- `quiz_id` (UUID, Foreign Key to quizzes)
- `question` (TEXT)
- `options` (JSONB) - Array of answer options
- `correct_answer` (INTEGER) - Index of correct option
- `explanation` (TEXT)
- `order_index` (INTEGER) - Question ordering
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Row Level Security (RLS)

Both tables have RLS enabled with public read access. This means anyone can view quizzes and questions, but modifications require authentication (to be implemented later).
