/*
  # Update transaction code format

  1. Changes
    - Modify the default value for the `code` column to use date-based format
    - Format: TRX-DDMMYYYY-[timestamp]
    
  2. Security
    - No security changes needed
*/

ALTER TABLE transactions 
ALTER COLUMN code SET DEFAULT 
  'TRX-' || 
  TO_CHAR(NOW(), 'DDMMYYYY') || 
  '-' || 
  FLOOR(EXTRACT(EPOCH FROM NOW()) * 1000)::text;