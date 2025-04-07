/*
  # Fix storage bucket for transaction attachments

  1. Storage
    - Create 'transaction-attachments' bucket for storing transaction files
    - Set bucket to public for easier access
  
  2. Security
    - Add storage policies for authenticated users
*/

-- Create storage bucket if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'transaction-attachments',
  'transaction-attachments',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf']::text[];

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Read transaction attachments" ON storage.objects;
DROP POLICY IF EXISTS "Insert transaction attachments" ON storage.objects;
DROP POLICY IF EXISTS "Update transaction attachments" ON storage.objects;
DROP POLICY IF EXISTS "Delete transaction attachments" ON storage.objects;

-- Create new policies
CREATE POLICY "Read transaction attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'transaction-attachments');

CREATE POLICY "Insert transaction attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'transaction-attachments');

CREATE POLICY "Update transaction attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'transaction-attachments')
WITH CHECK (bucket_id = 'transaction-attachments');

CREATE POLICY "Delete transaction attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'transaction-attachments');