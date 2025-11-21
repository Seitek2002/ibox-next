import { useNavigate } from 'react-router-dom';

import { ISpot } from 'types/venues.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';
import { loadUsersDataFromStorage } from 'utils/storageUtils';
import Header from 'src/components/Header';

const geoIcon = '/assets/icons/Order/geo.svg';

import { setUsersData } from 'src/store/yourFeatureSlice';

const Takeaway = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.yourFeature.venue);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  const handleClick = (spot: ISpot) => {
    vibrateClick();
    const res = loadUsersDataFromStorage();
    dispatch(setUsersData({ ...res, type: 2, activeSpot: spot.id }));
    navigate(`/${data.slug}/${spot.id}/s`);
  };

  return (
    <div className='h-[98dvh] tabs relative font-inter bg-[#F1F2F3] px-[16px] pt-[12px] lg:max-w-[1140px] lg:mx-auto'>
      <Header searchText={''} />
      <div className='tabs__pickup bg-white rounded-[12px] p-[12px]'>
        {data.spots?.map((spot) => {
          if (spot.address) {
            return (
              <button
                className='tabs__pickup-item'
                style={{ borderColor: colorTheme }}
                key={spot.id}
                onClick={() => handleClick(spot)}
              >
                <img
                  src={geoIcon}
                  alt='geoIcon'
                  style={{ backgroundColor: colorTheme }}
                />
                <div>
                  <p className='tabs__pickup-item-name'>{spot.name}</p>
                  <p className='tabs__pickup-item-address'>{spot.address}</p>
                </div>
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Takeaway;
