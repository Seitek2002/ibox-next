import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { vibrateClick } from 'utils/haptics';
import BusketDesktop from 'components/BusketDesktop';

import Search from '../Search';

const clearCartIcon = '/assets/icons/Busket/clear-cart.svg';

interface IProps {
  clearCartHandler: () => void;
  search: boolean;
  onSearchChange: (bool: boolean) => void;
  searchText?: string;
  setSearchText: (text: string) => void;
}

const Adaptivement: FC<IProps> = ({
  clearCartHandler,
  search,
  onSearchChange,
  searchText,
  setSearchText,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {window.innerWidth < 768 ? (
        <>
          {search && (
            <Search
              onSearchChange={onSearchChange}
              searchText={searchText}
              setSearchText={setSearchText}
            />
          )}
        </>
      ) : (
        <div className='flex-1 sticky z-10'>
          <div className='busket'>
            <header className='busket__header'>
              <h2>{t('basket.title')}</h2>
              <img
                onClick={() => {
                  vibrateClick();
                  clearCartHandler();
                }}
                src={clearCartIcon}
                alt=''
                className='cursor-pointer'
              />
            </header>
            <BusketDesktop to='/cart' />
          </div>
        </div>
      )}
    </>
  );
};

export default Adaptivement;
