import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'hooks/useAppSelector';

import { useGetVenueQuery } from 'api/Venue.api';
import { loadVenueFromStorage } from 'utils/storageUtils';

import { clearCart, setVenue } from 'src/store/yourFeatureSlice';

const SubHeader = () => {
  const { venue, venueId } = useParams();
  const dispatch = useDispatch();
  const activeSpotId = useAppSelector((s) => s.yourFeature.usersData?.activeSpot) as number | undefined;
  const { data } = useGetVenueQuery({
    venueSlug: venue || '',
    spotId: Number(venueId),
  });

  useEffect(() => {
    if (data) dispatch(setVenue(data));
  }, [data, dispatch]);

  useEffect(() => {
    const loadedVenue = loadVenueFromStorage();
    if (loadedVenue.companyName !== venue) {
      dispatch(clearCart());
    }
  }, [venue, dispatch]);

  return (
    <div className='sub-header'>
      <div className='sub-header__content'>
        <div className='venue'>
          <div className='logo'>
            <img src={data?.logo || undefined} alt='' />
          </div>
          <div>
            <div className='name' title={data?.companyName}>
              {data?.companyName}
            </div>
            <span className='text-sm'>
              {data?.spots?.find((s) => s.id === activeSpotId)?.address ?? data?.spots?.[0]?.address}
            </span>
          </div>
        </div>
        <div className='flex items-center justify-between md:gap-[12px] md:flex-initial'>
          {data?.table?.tableNum && (
            <div className='table'>Стол №{data.table.tableNum}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
