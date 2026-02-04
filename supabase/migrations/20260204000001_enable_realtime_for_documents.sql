-- Enable Realtime for the documents table
-- This allows the frontend to receive real-time updates when document status changes

-- Add documents table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE documents;

-- Verify the change
-- You can check with: SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
