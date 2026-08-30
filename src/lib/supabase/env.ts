/**
 * Helper to dynamically resolve Supabase environment variables at runtime.
 *
 * Using bracket notation `process.env['NEXT_PUBLIC_SUPABASE_URL']` prevents
 * Next.js Turbopack/Webpack from inlining build-time fallback values into
 * the compiled code, allowing runtime environment variables in Docker/Railway
 * to take precedence.
 */
export function getSupabaseEnv() {
  const isBrowser = typeof window !== 'undefined'
  const windowEnv = isBrowser
    ? (
        window as unknown as {
          __ENV__?: {
            NEXT_PUBLIC_SUPABASE_URL?: string
            NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
          }
        }
      ).__ENV__
    : undefined

  const url =
    windowEnv?.NEXT_PUBLIC_SUPABASE_URL ||
    process.env['NEXT_PUBLIC_SUPABASE_URL'] ||
    process.env['SUPABASE_URL'] ||
    ''

  const anonKey =
    windowEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
    process.env['SUPABASE_ANON_KEY'] ||
    ''

  return { url, anonKey }
}
