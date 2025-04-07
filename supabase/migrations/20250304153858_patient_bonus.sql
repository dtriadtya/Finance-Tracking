/*
  # Mengubah kebijakan keamanan untuk berbagi data

  1. Perubahan Kebijakan
    - Memodifikasi kebijakan RLS pada tabel `transactions` agar semua pengguna yang terautentikasi dapat mengakses semua data
    - Menghapus kebijakan yang membatasi akses berdasarkan user_id
    - Membuat kebijakan baru yang memungkinkan akses untuk semua pengguna terautentikasi
  
  2. Tujuan
    - Memungkinkan semua pengguna melihat dan mengelola data yang sama
    - Membuat pengalaman berbagi data antar akun
*/

-- Hapus kebijakan yang ada
DROP POLICY IF EXISTS "Users can read own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;

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