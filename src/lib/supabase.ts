import { createClient } from '@supabase/supabase-js'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a Supabase client with the correct configuration
export const supabase = isBrowser && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
  : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return !!supabase
} 