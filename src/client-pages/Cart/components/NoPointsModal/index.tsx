import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from 'src/hooks/useAppSelector';
import { vibrateClick } from 'src/utils/haptics';

interface IProps {
  showNoPoints: boolean;
  setShowNoPoints: (value: boolean) => void;
}

const NoPointsModal: FC<IProps> = ({ showNoPoints, setShowNoPoints }) => {
  const { t } = useTranslation();
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  return (
    <>
      <div
        className={showNoPoints ? 'overlay active' : 'overlay'}
        onClick={() => {
          vibrateClick();
          setShowNoPoints(false);
        }}
      ></div>
      <div
        className={
          showNoPoints ? 'clear-cart-modal active' : 'clear-cart-modal'
        }
        style={{
          width: 'calc(100vw - 64px)',
          maxWidth: '520px',
          height: 'auto',
          padding: '16px 24px',
        }}
      >
        <div className='w-full px-[16px] md:px-[24px]'>
          <h3 className='text-[20px] font-medium mb-2 text-center'>
            К сожалению у вас нет баллов для использования
          </h3>
        </div>
        <div className='clear-cart-modal__btns'>
          <button
            className='text-white'
            style={{ backgroundColor: colorTheme }}
            onClick={() => {
              vibrateClick();
              setShowNoPoints(false);
            }}
          >
            {t('button.close')}
          </button>
        </div>
      </div>
    </>
  );
};

export default NoPointsModal;
