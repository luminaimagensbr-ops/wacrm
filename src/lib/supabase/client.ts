import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton instance — one client shared across the whole browser session.
// Creating multiple clients causes auth-lock contention ("Lock was released
// because another request stole it") and intermittent fetch failures.
let browserClient: SupabaseClient | undefined

export function createClient() {
  if (browserClient) return browserClient

  const envWindow =
    typeof window !== 'undefined'
      ? (
          window as unknown as {
            __ENV__?: {
              NEXT_PUBLIC_SUPABASE_URL?: string
              NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
            }
          }
        ).__ENV__
      : undefined

  const supabaseUrl =
    envWindow?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey =
    envWindow?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  browserClient = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )

  return browserClient
}
