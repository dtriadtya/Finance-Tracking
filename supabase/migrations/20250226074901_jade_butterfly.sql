/*
  # Create transactions table and schema

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `type` (text, either 'income' or 'expense')
      - `amount` (numeric, non-negative)
      - `description` (text)
      - `category` (text)
      - `date` (date)
      - `created_at` (timestamp with time zone)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to:
      - Read their own transactions
      - Insert their own transactions
      - Update their own transactions
      - Delete their own transactions
*/

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL CHECK (amount >= 0),
  description text NOT NULL,
  category text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read own transactions" ON public.transactions;
  DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
  DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
  DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
END $$;

-- Create new policies
CREATE POLICY "Users can read own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);