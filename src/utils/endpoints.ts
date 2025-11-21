export const DEFAULT_API_BASE = 'https://stark.adamtech.dev/api/';

/**
 * Returns REST API base URL with trailing slash ensured.
 * Respects NEXT_PUBLIC_API_BASE_URL if provided, otherwise falls back to DEFAULT_API_BASE.
 */
export function getApiBase(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  let base = (typeof env === 'string' && env.trim()) ? env.trim() : DEFAULT_API_BASE;
  if (!base.endsWith('/')) base += '/';
  return base;
}

/**
 * Derives WS base from NEXT_PUBLIC_WS_BASE_URL if provided.
 * Otherwise converts API base protocol to ws(s) and uses only host (no /api).
 * Fallback: wss://stark.adamtech.dev
 */
export function getWsBase(): string {
  const wsEnv = process.env.NEXT_PUBLIC_WS_BASE_URL;
  if (typeof wsEnv === 'string' && wsEnv.trim()) {
    return wsEnv.trim();
  }
  try {
    const apiBase = getApiBase();
    const u = new URL(apiBase);
    const protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${u.host}`;
  } catch {
    return 'wss://stark.adamtech.dev';
  }
}

/**
 * Orders WebSocket URL: /ws/orders/?phone_number=...&site=...
 */
export function wsOrdersUrl(opts: { phone: string; site?: string }): string {
  const base = getWsBase();
  const params = new URLSearchParams();
  params.set('phone_number', String(opts?.phone ?? ''));
  if (opts?.site) params.set('site', String(opts.site));
  return `${base}/ws/orders/?${params.toString()}`;
}
