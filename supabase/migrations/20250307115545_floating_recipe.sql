/*
  # Update transaction code format

  1. Changes
    - Update existing transaction codes to new format
    - Modify the default value for the `code` column
    
  2. Notes
    - Format: TRX-DDMMYYYY-[timestamp]
    - Updates all existing transactions to use the new format
*/

-- First, update existing transaction codes
UPDATE transactions
SET code = 
  'TRX-' || 
  TO_CHAR(date, 'DDMMYYYY') || 
  '-' || 
  FLOOR(EXTRACT(EPOCH FROM created_at) * 1000)::text;

-- Then modify the default value for new transactions
ALTER TABLE transactions 
ALTER COLUMN code SET DEFAULT 
  'TRX-' || 
  TO_CHAR(NOW(), 'DDMMYYYY') || 
  '-' || 
  FLOOR(EXTRACT(EPOCH FROM NOW()) * 1000)::text;