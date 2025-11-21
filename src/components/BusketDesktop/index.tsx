import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';
import { getTodayScheduleWindow, isOutsideWorkTime } from 'utils/timeUtils';
import BusketCard from 'components/Cards/Cart';
import WorkTimeModal from 'components/WorkTimeModal';


const BusketDesktop = ({
  to,
  createOrder,
  disabled,
}: {
  createOrder?: () => void;
  to: string;
  disabled?: boolean;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const venueData = useAppSelector((state) => state.yourFeature.venue);
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const location = useLocation();

  const [showWorkTimeModal, setShowWorkTimeModal] = useState(false);

  // Stock limit toast (top-right)
  const [showStockToast, setShowStockToast] = useState(false);
  const [stockToastMsg, setStockToastMsg] = useState('');
  const stockToastTimerRef = useRef<number | null>(null);
  const showMaxStockToast = () => {
    vibrateClick();
    setStockToastMsg('Нельзя добавить больше — такого количества товара нет');
    setShowStockToast(true);
    try {
      if (stockToastTimerRef.current) {
        clearTimeout(stockToastTimerRef.current);
      }
    } catch {}
    stockToastTimerRef.current = window.setTimeout(
      () => setShowStockToast(false),
      1800
    );
  };

  const handleClick = () => {
    vibrateClick();
    const { window: todayWindow, isClosed } = getTodayScheduleWindow(
      venueData?.schedules,
      venueData?.schedule
    );
    if (isClosed || isOutsideWorkTime(todayWindow)) {
      setShowWorkTimeModal(true);
      return;
    }

    if (location.pathname === '/cart') {
      if (createOrder) createOrder();
    } else {
      navigate(to);
    }
  };

  useEffect(() => {
    return () => {
      if (stockToastTimerRef.current) {
        clearTimeout(stockToastTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <WorkTimeModal
        isShow={showWorkTimeModal}
        onClose={() => setShowWorkTimeModal(false)}
      />
      {showStockToast && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px 12px',
            borderRadius: 8,
            zIndex: 10000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            maxWidth: '80vw',
            fontSize: 14,
          }}
          role="status"
          aria-live="polite"
        >
          {stockToastMsg || 'Нельзя добавить больше — такого количества товара нет'}
        </div>
      )}
      <div className='busket__content'>
        {venueData?.table?.tableNum && (
          <div className='table-num'>
            {t('table')}
            {venueData.table.tableNum}
          </div>
        )}
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <BusketCard key={item.id} item={item} onMaxExceeded={showMaxStockToast} />
            ))}
          </>
        ) : (
          <div className='busket__empty text-center'>
            {t('basket.addItems')}
          </div>
        )}
      </div>
      <hr style={{ borderTop: '1px solid #f3f3f3' }} />
      <div className='bg-[#fff] p-[12px]'>
        <button
          style={{ backgroundColor: colorTheme }}
          onClick={handleClick}
          disabled={disabled}
        >
          {t('button.next')}
        </button>
      </div>
    </>
  );
};

export default BusketDesktop;
