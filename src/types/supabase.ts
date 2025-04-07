export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          code: string
          type: 'income' | 'expense'
          amount: number
          description: string
          category: string
          date: string
          created_at: string
          user_id: string
          attachment_url?: string
        }
        Insert: {
          id?: string
          code?: string
          type: 'income' | 'expense'
          amount: number
          description: string
          category: string
          date: string
          created_at?: string
          user_id: string
          attachment_url?: string
        }
        Update: {
          id?: string
          code?: string
          type?: 'income' | 'expense'
          amount?: number
          description?: string
          category?: string
          date?: string
          created_at?: string
          user_id?: string
          attachment_url?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}