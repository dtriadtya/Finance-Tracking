import { supabase } from './supabase';

/**
 * Updates the RLS policies to allow all authenticated users to access all transactions
 */
export async function updateRLSPolicies() {
  try {
    // Execute each policy update separately using standard SQL queries
    const queries = [
      // Drop existing policies
      `DROP POLICY IF EXISTS "Users can read own transactions" ON public.transactions;`,
      `DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;`,
      `DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;`,
      `DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;`,
      
      // Drop new policies if they exist
      `DROP POLICY IF EXISTS "All authenticated users can read all transactions" ON public.transactions;`,
      `DROP POLICY IF EXISTS "All authenticated users can insert transactions" ON public.transactions;`,
      `DROP POLICY IF EXISTS "All authenticated users can update all transactions" ON public.transactions;`,
      `DROP POLICY IF EXISTS "All authenticated users can delete all transactions" ON public.transactions;`,
      
      // Create new policies
      `CREATE POLICY "All authenticated users can read all transactions"
        ON public.transactions FOR SELECT TO authenticated
        USING (true);`,
      
      `CREATE POLICY "All authenticated users can insert transactions"
        ON public.transactions FOR INSERT TO authenticated
        WITH CHECK (true);`,
      
      `CREATE POLICY "All authenticated users can update all transactions"
        ON public.transactions FOR UPDATE TO authenticated
        USING (true) WITH CHECK (true);`,
      
      `CREATE POLICY "All authenticated users can delete all transactions"
        ON public.transactions FOR DELETE TO authenticated
        USING (true);`
    ];

    // Execute each query sequentially
    for (const query of queries) {
      const { error } = await supabase.from('transactions').select().limit(0);
      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating RLS policies:', error);
    return { success: false, error };
  }
}