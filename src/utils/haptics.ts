/**
 * Simple, safe haptics utility for click/tap feedback.
 * - Uses navigator.vibrate when available
 * - Exposes a global click listener with throttling
 */

export const vibrateClick = (duration = 10) => {
  try {
    // Guard for SSR and unsupported environments
    if (typeof navigator !== 'undefined') {
      const navVibrate = navigator as Navigator & {
        vibrate?: (pattern: number | number[]) => boolean;
      };
      if (typeof navVibrate.vibrate === 'function') {
        navVibrate.vibrate(duration);
      }
    }
  } catch {
    // ignore
  }
};

/**
 * Adds a global click listener (capture phase) to vibrate on any user click.
 * Returns a cleanup function to remove the listener.
 */
export const addGlobalHaptics = (duration = 10, minGapMs = 80) => {
  let last = 0;

  const handler = (e: MouseEvent | TouchEvent) => {
    // Only react to primary button clicks when using mouse
    if (e instanceof MouseEvent && e.button !== 0) return;

    const now = Date.now();
    if (now - last < minGapMs) return;

    vibrateClick(duration);
    last = now;
  };

  try {
    document.addEventListener('click', handler, true);
  } catch {
    // ignore
  }

  return () => {
    try {
      document.removeEventListener('click', handler, true);
    } catch {
      // ignore
    }
  };
};
