/*
  # Add attachment support for transactions

  1. Schema Changes
    - Add attachment_url column to transactions table
*/

-- Add attachment_url column to transactions table if not exists
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS attachment_url text;