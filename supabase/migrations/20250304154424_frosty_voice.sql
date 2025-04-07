/*
  # Update RLS policies for shared data access
  
  1. Changes
     - Drop existing RLS policies that restrict data access to user's own data
     - Create new policies that allow all authenticated users to access all data
     
  2. Security
     - All authenticated users can read all transactions
     - All authenticated users can insert transactions
     - All authenticated users can update all transactions
     - All authenticated users can delete all transactions
*/

-- Hapus kebijakan yang ada
DROP POLICY IF EXISTS "Users can read own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;

-- Hapus kebijakan baru jika sudah ada (untuk mencegah error)
DROP POLICY IF EXISTS "All authenticated users can read all transactions" ON public.transactions;
DROP POLICY IF EXISTS "All authenticated users can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "All authenticated users can update all transactions" ON public.transactions;
DROP POLICY IF EXISTS "All authenticated users can delete all transactions" ON public.transactions;

-- Buat kebijakan baru yang memungkinkan semua pengguna terautentikasi mengakses semua data
CREATE POLICY "All authenticated users can read all transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated users can insert transactions"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "All authenticated users can update all transactions"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "All authenticated users can delete all transactions"
  ON public.transactions
  FOR DELETE
  TO authenticated
  USING (true);