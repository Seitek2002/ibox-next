import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useGetVenueQuery } from 'api/Venue.api';
import { vibrateClick } from 'utils/haptics';
import { loadVenueFromStorage } from 'utils/storageUtils';
// import { getTodayScheduleInfo } from 'utils/timeUtils';
import WeeklyScheduleModal from 'components/WeeklyScheduleModal';


import { Calendar } from 'lucide-react';
import { clearCart, setVenue } from 'src/store/yourFeatureSlice';

const SubHeader = () => {
  const { venue, id } = useParams();
  const dispatch = useDispatch();
  // const { t } = useTranslation();
  const { data } = useGetVenueQuery({
    venueSlug: venue || '',
    tableId: Number(id) || undefined,
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

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // const scheduleDisplay = useMemo(() => {
  //   const info = getTodayScheduleInfo(
  //     data?.schedules,
  //     data?.schedule,
  //     t('dayOff')
  //   );
  //   return `${info.text}`;
  // }, [data?.schedules, data?.schedule, t]);

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
            {/* <span className='schedule' title={scheduleDisplay}>
              {scheduleDisplay}
            </span> */}
          </div>
        </div>
        <div className='flex items-center justify-between md:gap-[12px] md:flex-initial'>
          <div
            className='call cursor-pointer'
            role='button'
            aria-label='График работы'
            onClick={() => {
              vibrateClick();
              setIsScheduleOpen(true);
            }}
          >
            <Calendar size={24} />
          </div>
          {data?.table?.tableNum && (
            <div className='table'>Стол №{data.table.tableNum}</div>
          )}
        </div>
      </div>

      <WeeklyScheduleModal
        isShow={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        schedules={data?.schedules}
        fallbackSchedule={data?.schedule}
      />
    </div>
  );
};

export default SubHeader;
