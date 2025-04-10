import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log environment variable status in development
if (process.env.NODE_ENV === 'development') {
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Supabase URL:', supabaseUrl ? 'Available' : 'Missing')
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Available' : 'Missing')
}

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
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

export function isSupabaseAvailable() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.log('Not in browser environment')
    return false
  }

  // Check if environment variables are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:')
    if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL is missing')
    if (!supabaseAnonKey) console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
    return false
  }

  // Check if the client was created successfully
  if (!supabase) {
    console.error('Supabase client initialization failed')
    return false
  }

  // Test the connection
  return true
} 