/*
  # Create storage bucket for transaction attachments

  1. Storage
    - Create 'transaction-attachments' bucket for storing transaction files
    - Enable public access for authenticated users
  
  2. Security
    - Add storage policies for authenticated users to:
      - Read their own attachments
      - Upload new attachments
      - Update their attachments
      - Delete their attachments
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('transaction-attachments', 'transaction-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for storage.objects
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