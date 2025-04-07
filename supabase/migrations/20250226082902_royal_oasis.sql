/*
  # Add transaction code column

  1. Changes
    - Add `code` column to `transactions` table
      - Type: text
      - Not null
      - Unique constraint to ensure no duplicate codes
*/

ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS code text NOT NULL DEFAULT 'TRX-' || floor(extract(epoch from now()) * 1000)::text;

-- Add unique constraint
ALTER TABLE transactions
ADD CONSTRAINT transactions_code_key UNIQUE (code);

-- Update existing rows to have unique codes
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN SELECT id FROM transactions LOOP
    UPDATE transactions 
    SET code = 'TRX-' || floor(extract(epoch from now()) * 1000)::text
    WHERE id = t.id;
    -- Add small delay to ensure unique timestamps
    PERFORM pg_sleep(0.001);
  END LOOP;
END $$;