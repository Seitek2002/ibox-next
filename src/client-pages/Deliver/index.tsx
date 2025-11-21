import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { loadUsersDataFromStorage } from 'utils/storageUtils';
import Header from 'src/components/Header';

import { useMask } from '@react-input/mask';
import { setUsersData } from 'src/store/yourFeatureSlice';

const Deliver = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const userData = loadUsersDataFromStorage();
  const [phoneNumber, setPhoneNumber] = useState(
    '+' + userData.phoneNumber || ''
  );
  const [address, setAddress] = useState(userData.address || '');
  const [comment, setComment] = useState(userData.comment);
  const venueData = useAppSelector((state) => state.yourFeature.venue);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = {
      phoneNumber: phoneNumber
        .replace('-', '')
        .replace('(', '')
        .replace(')', '')
        .replace(' ', '')
        .replace('+', '')
        .replace(' ', ''),
      type: 3,
      comment,
      address,
    };
    const defaultSpotId =
      venueData?.defaultDeliverySpot ?? venueData?.spots?.[0]?.id ?? 0;

    dispatch(setUsersData({ ...data, activeSpot: defaultSpotId }));
    navigate(`/${params.venue}/d`);
  };

  const inputRef = useMask({
    mask: '+996_________',
    replacement: { _: /\d/ },
  });

  const { t } = useTranslation();
  const isFormValid = useMemo(() => {
    return phoneNumber.length >= 12 && address.trim().length > 3;
  }, [phoneNumber, address]);

  return (
    <div className='h-[98dvh] relative font-inter bg-[#F1F2F3] px-[16px] pt-[12px] lg:max-w-[1140px] lg:mx-auto'>
      <Header searchText={''} />
      <div className='tabs__content'>
        <form className='cart__contacts' onSubmit={handleClick}>
          <div className='flex items-center justify-between mb-[12px]'>
            <h4>{t('empty.contact')}</h4>
            <span className='required' style={{ color: colorTheme }}>
              {t('necessarily')}
            </span>
          </div>
          <input
            required
            type='text'
            placeholder='+996'
            ref={inputRef}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            required
            type='text'
            placeholder={t('deliver.twoGis')}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type='text'
            placeholder={t('empty.comment')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className='tabs__btn'
            style={{ backgroundColor: colorTheme }}
            disabled={!isFormValid}
          >
            {t('button.next')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Deliver;
