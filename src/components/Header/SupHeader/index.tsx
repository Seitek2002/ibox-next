import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { vibrateClick } from 'utils/haptics';
import { useAppSelector } from 'hooks/useAppSelector';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { setUsersData } from 'src/store/yourFeatureSlice';
import PhoneModal from 'components/PhoneModal';

const arrowIcon = '/assets/icons/Header/arrow.svg';
const search = '/assets/icons/Header/search.svg';
const logoIcon = '/assets/icons/header-logo.svg';


import { Coins } from 'lucide-react';
import { useGetClientBonusQuery, useGetVenueQuery } from 'src/api';

const LANGUAGES = ['RU', 'KG', 'ENG'];
const LANGUAGE_MAP: Record<string, string> = {
  ru: 'RU',
  kg: 'KG',
  en: 'ENG',
};

interface IProps {
  searchText: string;
  setSearchText?: (text: string) => void;
}

const SupHeader: FC<IProps> = ({ searchText, setSearchText }) => {
  const { i18n } = useTranslation();
  const { venue, id } = useParams();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);

  const activeLang = useMemo(
    () => LANGUAGE_MAP[i18n.language] || 'RU',
    [i18n.language]
  );
  const { t } = useTranslation();
  const toggleLanguageMenu = () => {
    vibrateClick();
    setIsLanguageOpen((prev) => !prev);
  };
  const { data } = useGetVenueQuery({
    venueSlug: venue || '',
    tableId: Number(id) || undefined,
  });

  const selectLanguage = (language: string) => {
    vibrateClick();
    const langCode = language === 'RU' ? 'ru' : language === 'KG' ? 'kg' : 'en';
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    setIsLanguageOpen(false);

    window.location.reload();
  };

  const usersData = useAppSelector((s) => s.yourFeature.usersData);
  const dispatch = useAppDispatch();
  const phoneForBonus = (usersData?.phoneNumber || '').trim();

  const { data: bonusData } = useGetClientBonusQuery(
    { phone: phoneForBonus, organizationSlug: data?.slug || venue },
    { skip: !phoneForBonus || !(data?.slug || venue) }
  );

  return (
    <div className='header'>
      <div className='header__content'>
        <div className='logo'>
          <img src={logoIcon} width={30} alt='iMenu Logo' />
          <span>ishop.kg</span>
        </div>

        {setSearchText && (
          <label htmlFor='search' className='header__search bg-[#F9F9F9]'>
            <img src={search} alt='' />
            <input
              type='text'
              placeholder={t('search')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              id='search'
            />
          </label>
        )}

        <div
          className='call'
          title='Баллы'
          onClick={() => {
            vibrateClick();
            setPhoneModalOpen(true);
          }}
        >
          <span className='text-[14px] font-bold text-center flex items-center gap-[8px]'>
            <Coins size={20} />
            <span className='mt-[4px]'>{bonusData?.balance ?? 0} <span className='hidden md:inline'>б.</span></span>
          </span>
        </div>
        <div className='language'>
          <button
            className={`language-selected bg-gray-100 ${
              isLanguageOpen ? 'active' : ''
            }`}
            onClick={toggleLanguageMenu}
          >
            {activeLang} <img src={arrowIcon} alt='Toggle Language' />
          </button>

          <div
            className={`language__wrapper bg-gray-100 ${
              isLanguageOpen ? 'active' : ''
            }`}
          >
            {LANGUAGES.filter((lang) => lang !== activeLang).map((lang) => (
              <button
                key={lang}
                className='language__item text-gray-900 cursor-pointer'
                onClick={() => selectLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
      <PhoneModal
        open={isPhoneModalOpen}
        defaultPhone={usersData?.phoneNumber ? (usersData.phoneNumber.startsWith('+') ? usersData.phoneNumber : `+${usersData.phoneNumber}`) : '+996'}
        onClose={() => setPhoneModalOpen(false)}
        onSubmit={(p) => {
          const digits = (p || '').replace(/\D/g, '');
          dispatch(setUsersData({ ...usersData, phoneNumber: digits }));
        }}
      />
    </div>
  );
};

export default SupHeader;
