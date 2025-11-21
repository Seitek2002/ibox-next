import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from 'hooks/useAppSelector';
import { getTodayScheduleWindow, isOutsideWorkTime } from 'utils/timeUtils';
import WorkTimeModal from 'components/WorkTimeModal';

const isAuthenticated = (): boolean => {
  try {
    if (typeof window === 'undefined') return true; // allow SSR, redirect on client if needed
    const venue = window.localStorage.getItem('venue');
    return venue !== null;
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  // Hooks must be declared unconditionally
  const [showClosed, setShowClosed] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const authenticated = isAuthenticated();
  const venue = useAppSelector((s) => s.yourFeature.venue);
  const { window: todayWindow, isClosed } = getTodayScheduleWindow(venue?.schedules, venue?.schedule);
  const closed = isClosed || isOutsideWorkTime(todayWindow);
  const mainPage = (typeof window !== 'undefined' ? localStorage.getItem('mainPage') : null) || '/';
  const cartLength = useAppSelector((s) => s.yourFeature.cart.length);
  const location = useLocation();

  useEffect(() => {
    if (closed) {
      setShowClosed(true);
    }
  }, [closed]);

  // Redirect to main if not authenticated (no venue context)
  if (!authenticated) {
    return <Navigate to='/' replace />;
  }

  // Block /cart when cart is empty (desktop/mobile)
  if (location.pathname === '/cart' && cartLength === 0) {
    return <Navigate to={mainPage} replace />;
  }

  // Block access to protected content when closed: show modal and then redirect
  if (closed) {
    return (
      <>
        <WorkTimeModal
          isShow={showClosed}
          onClose={() => setRedirect(true)}
        />
        {redirect ? <Navigate to={mainPage} replace /> : null}
      </>
    );
  }

  // Otherwise allow access
  return <>{children}</>;
};

export default ProtectedRoute;
