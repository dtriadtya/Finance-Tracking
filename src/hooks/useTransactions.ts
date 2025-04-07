import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types/finance';
import { format } from 'date-fns';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        setTransactions([]);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      setTransactions(data || []);
    } catch (err) {
      console.error('Error in fetchTransactions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAttachment(file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('transaction-attachments')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('transaction-attachments')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  }

  function generateTransactionCode(date: string) {
    return `TRX-${format(new Date(date), 'ddMMyyyy')}`;
  }

  async function addTransaction(
    transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id' | 'code'>,
    attachment?: File
  ) {
    try {
      setLoading(true);
      setError(null);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('No authenticated session');
      }
      
      let attachmentUrl: string | undefined;
      if (attachment) {
        attachmentUrl = await uploadAttachment(attachment);
      }

      const code = generateTransactionCode(transaction.date);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transaction,
          code,
          user_id: session.session.user.id,
          attachment_url: attachmentUrl
        }])
        .select()
        .single();

      if (error) {
        console.error('Error inserting transaction:', error);
        throw error;
      }

      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error in addTransaction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding the transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateTransaction(
    id: string,
    transaction: Partial<Omit<Transaction, 'id' | 'created_at' | 'user_id' | 'code'>>,
    attachment?: File
  ) {
    try {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('No authenticated session');
      }

      let attachmentUrl: string | undefined;
      if (attachment) {
        attachmentUrl = await uploadAttachment(attachment);
      }

      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...transaction,
          ...(attachmentUrl && { attachment_url: attachmentUrl })
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        throw error;
      }

      setTransactions(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      console.error('Error in updateTransaction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating the transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteTransaction(id: string) {
    try {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('No authenticated session');
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting transaction:', error);
        throw error;
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error in deleteTransaction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions
  };
}