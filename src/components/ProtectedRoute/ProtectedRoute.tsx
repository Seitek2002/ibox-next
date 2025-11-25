import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from 'hooks/useAppSelector';

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

  const authenticated = isAuthenticated();
  const mainPage = (typeof window !== 'undefined' ? localStorage.getItem('mainPage') : null) || '/';
  const cartLength = useAppSelector((s) => s.yourFeature.cart.length);
  const location = useLocation();


  // Redirect to main if not authenticated (no venue context)
  if (!authenticated) {
    return <Navigate to='/' replace />;
  }

  // Block /cart when cart is empty (desktop/mobile)
  if (location.pathname === '/cart' && cartLength === 0) {
    return <Navigate to={mainPage} replace />;
  }


  // Otherwise allow access
  return <>{children}</>;
};

export default ProtectedRoute;
