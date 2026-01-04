import { createClient } from '@supabase/supabase-js'
import type { PostgrestError } from '@supabase/supabase-js'
import { QUERY_CONFIG } from './constants'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Wrapper for Supabase queries with timeout support
 * Prevents queries from hanging indefinitely
 */
export async function queryWithTimeout<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  timeoutMs: number = QUERY_CONFIG.defaultTimeoutMs
): Promise<{ data: T | null; error: PostgrestError | null; timedOut: boolean }> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
  })

  try {
    const result = await Promise.race([queryFn(), timeoutPromise])
    return { ...result, timedOut: false }
  } catch (error) {
    if (error instanceof Error && error.message === 'Query timeout') {
      return { data: null, error: null, timedOut: true }
    }
    throw error
  }
}
