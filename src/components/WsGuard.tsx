/** 
 * Client-only guard that limits WS attempts:
 * - Skips connecting to /ws/orders if phone_number param is missing or empty
 * - Allows at most ONE attempt per unique WS URL per page visit (no auto-retry)
 * This is a defensive shim because the current WS client code isn't in this repo.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __ISHOP_WS_GUARD_INSTALLED__?: boolean;
    __ISHOP_WS_ATTEMPTED__?: Set<string>;
  }
}

/**
 * Lightweight dummy WebSocket to satisfy consumers without opening a real socket.
 * It immediately schedules error/close events so upstream code can proceed gracefully,
 * but because we also block subsequent attempts per-URL, it prevents reconnect loops.
 */
function createDummyWebSocket(url: string): WebSocket {
  // Minimal shape; cast to any to satisfy type expectations
  const dummy: any = {
    url,
    readyState: WebSocket.CLOSED,
    bufferedAmount: 0,
    extensions: '',
    protocol: '',
    binaryType: 'blob',
    onopen: null,
    onmessage: null,
    onerror: null,
    onclose: null,
    close: () => void 0,
    send: (_data: any) => void 0,
    addEventListener: (_type: string, _listener: any, _opts?: any) => void 0,
    removeEventListener: (_type: string, _listener: any, _opts?: any) => void 0,
    dispatchEvent: (_e: any) => false
  };

  // Fire error/close asynchronously (microtask) to avoid interfering with caller flow
  Promise.resolve().then(() => {
    try {
      dummy.onerror && dummy.onerror(new Event('error'));
      dummy.onclose && dummy.onclose(new CloseEvent('close'));
    } catch {}
  });

  return dummy as WebSocket;
}

/**
 * Returns true if URL looks like an orders WS endpoint where a phone_number is required.
 */
function isOrdersWs(urlStr: string): boolean {
  try {
    const u = new URL(urlStr, typeof window !== 'undefined' ? window.location.href : 'http://localhost');
    // Heuristic: endpoint contains /ws/orders
    return /\/ws\/orders/i.test(u.pathname);
  } catch {
    // If URL constructor fails (relative or non-standard), fallback to substring check
    return /\/ws\/orders/i.test(String(urlStr));
  }
}

/**
 * Extracts phone_number query param (if present).
 */
function extractPhone(urlStr: string): string | null {
  try {
    const u = new URL(urlStr, typeof window !== 'undefined' ? window.location.href : 'http://localhost');
    const pn = u.searchParams.get('phone_number');
    return pn !== null ? pn.trim() : null;
  } catch {
    // Best-effort parse
    const m = String(urlStr).match(/[?&]phone_number=([^&#]+)/i);
    return m ? decodeURIComponent(m[1]).trim() : null;
  }
}

export default function WsGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Install only once per page
    if (window.__ISHOP_WS_GUARD_INSTALLED__) return;
    window.__ISHOP_WS_GUARD_INSTALLED__ = true;

    const attempted = (window.__ISHOP_WS_ATTEMPTED__ = window.__ISHOP_WS_ATTEMPTED__ ?? new Set<string>());
    const OriginalWS = window.WebSocket;

    // Patch global WebSocket
    const PatchedWS: any = function (this: any, url: string | URL, protocols?: string | string[]) {
      const urlStr = String(url);
      const isOrders = isOrdersWs(urlStr);
      const phone = extractPhone(urlStr);

      // 1) If это канал заказов и нет телефона — НЕ подключаться вовсе
      if (isOrders && (!phone || phone.length === 0)) {
        // console.info('[WSGuard] Blocked WS connect (no phone):', urlStr);
        return createDummyWebSocket(urlStr);
      }

      // 2) Разрешить только ОДНУ попытку на визит для каждого уникального URL (ТОЛЬКО для /ws/orders)
      if (isOrders && attempted.has(urlStr)) {
        // console.info('[WSGuard] Blocked WS reconnect (one-shot per visit):', urlStr);
        return createDummyWebSocket(urlStr);
      }

      if (isOrders) {
        attempted.add(urlStr);
      }
      // Proceed with a real connection
      // eslint-disable-next-line new-cap
      return protocols !== undefined ? new OriginalWS(urlStr as any, protocols as any) : new OriginalWS(urlStr as any);
    };

    // Preserve static members
    PatchedWS.CLOSED = OriginalWS.CLOSED;
    PatchedWS.CLOSING = OriginalWS.CLOSING;
    PatchedWS.CONNECTING = OriginalWS.CONNECTING;
    PatchedWS.OPEN = OriginalWS.OPEN;
    PatchedWS.prototype = OriginalWS.prototype;

    try {
      (window as any).WebSocket = PatchedWS;
    } catch {
      // In very strict environments, assignment could be blocked; ignore.
    }

    // No cleanup on unmount to keep guard active during the whole visit.
    // Returning undefined keeps the patch.
  }, []);

  return null;
}
