'use client';
import { FC, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Home from 'client-pages/Home';
import NotFound from 'client-pages/NotFound';
import { useGetVenueQuery } from 'api/Venue.api';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import dynamic from 'next/dynamic';
const Loader = dynamic(() => import('components/Loader'), { ssr: false });

import { setUsersData } from 'src/store/yourFeatureSlice';

const VenueGate: FC = () => {
  const { venue, venueId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location?.pathname ?? '/';
  const dispatch = useAppDispatch();
  const usersData = useAppSelector((s) => s.yourFeature.usersData);

  // Capture promo/ref from query and redirect to clean URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const promo = params.get('promo');
    const ref = params.get('ref') ?? params.get('refId');

    if (promo !== null) localStorage.setItem('promo', String(promo));
    if (ref !== null) localStorage.setItem('refId', String(ref));

    if (promo || ref) {
      navigate(pathname, { replace: true });
    }
  }, [location.search, pathname, navigate]);

  // Set order mode by URL:
  // - "/:venue/:venueId" or "/:venue/:venueId/s" => pickup (type = 2) and set activeSpot = venueId
  // - "/:venue" => keep existing activeSpot, still pickup (delivery removed)
  useEffect(() => {
    const spotIdNum = venueId ? Number(venueId) : NaN;
    const hasSpotId = Number.isFinite(spotIdNum);

    const nextUsers = {
      ...usersData,
      // Delivery removed: always self-pickup
      type: 2,
      activeSpot: hasSpotId ? spotIdNum : (usersData?.activeSpot ?? 0),
    };

    if (usersData?.type !== nextUsers.type || usersData?.activeSpot !== nextUsers.activeSpot) {
      dispatch(setUsersData(nextUsers));
    }
  }, [pathname, venueId, usersData, dispatch]);

  const { data, isError, isLoading } = useGetVenueQuery({
    venueSlug: venue || '',
  });

  if (isLoading) {
    return (
      <div className='min-h-[60vh] w-full flex items-center justify-center'>
        <Loader />
      </div>
    );
  }

  if (isError || !data) {
    return <NotFound />;
  }

  return <Home />;
};

export default VenueGate;
